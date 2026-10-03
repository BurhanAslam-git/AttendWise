import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import FormField from '../components/FormField';
import AppButton from '../components/AppButton';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { validateCourse } from '../utils/validation';

// Every input of the form, described as data and drawn with .map().
// keyboardType, maxLength, placeholder and autoCapitalize are built-in TextInput props.
const FORM_FIELDS = [
  { name: 'code', label: 'Course code', placeholder: 'e.g. CS2001', maxLength: 10, autoCapitalize: 'characters' },
  { name: 'title', label: 'Course name', placeholder: 'e.g. Data Structures', maxLength: 40, autoCapitalize: 'words' },
  { name: 'creditHours', label: 'Credit hours (1 to 4)', placeholder: 'e.g. 3', maxLength: 1, keyboardType: 'number-pad' },
  { name: 'conducted', label: 'Classes held so far', placeholder: 'e.g. 20', maxLength: 3, keyboardType: 'number-pad' },
  { name: 'attended', label: 'Classes you attended', placeholder: 'e.g. 18', maxLength: 3, keyboardType: 'number-pad' },
  { name: 'marksTotal', label: 'Total marks assessed so far', placeholder: '0 if none yet', maxLength: 5, keyboardType: 'decimal-pad' },
  { name: 'marksObtained', label: 'Marks you obtained', placeholder: '0 if none yet', maxLength: 5, keyboardType: 'decimal-pad' },
];

// TextInput works with text, so numbers are turned into strings for the form.
// A new course (null) starts with blank names and zeros.
function toFormValues(course) {
  if (course === null) {
    return { code: '', title: '', creditHours: '', conducted: '0', attended: '0', marksTotal: '0', marksObtained: '0' };
  }
  return {
    code: course.code,
    title: course.title,
    creditHours: String(course.creditHours),
    conducted: String(course.conducted),
    attended: String(course.attended),
    marksTotal: String(course.marksTotal),
    marksObtained: String(course.marksObtained),
  };
}

// One form for both adding and editing. courseToEdit is null when adding.
export default function CourseFormScreen({ courseToEdit, courses, onSave, onCancel }) {
  const isEditing = courseToEdit !== null;
  const [values, setValues] = useState(() => toFormValues(courseToEdit));
  const [errors, setErrors] = useState({});

  const hasErrors = Object.values(errors).some(Boolean);

  function handleChange(fieldName, text) {
    setValues({ ...values, [fieldName]: text });
    setErrors({ ...errors, [fieldName]: null }); // hide this field's error while it is being fixed
  }

  function handleSave() {
    // When editing, the course may keep its own code, so leave it out of the duplicate check.
    const otherCourses = courses.filter((course) => course.id !== courseToEdit?.id);
    const newErrors = validateCourse(values, otherCourses);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // stop: something is invalid

    onSave({
      id: isEditing ? courseToEdit.id : Date.now().toString(), // new courses get a unique id
      code: values.code.trim().toUpperCase(),
      title: values.title.trim(),
      creditHours: Number(values.creditHours),
      conducted: Number(values.conducted),
      attended: Number(values.attended),
      marksTotal: Number(values.marksTotal),
      marksObtained: Number(values.marksObtained),
    });
  }

  return (
    <>
      <ScreenHeader title={isEditing ? 'Edit course' : 'Add a course'} onBack={onCancel} />

      {FORM_FIELDS.map(({ name, ...inputProps }) => (
        <FormField
          key={name}
          {...inputProps}
          value={values[name]}
          onChangeText={(text) => handleChange(name, text)}
          error={errors[name]}
        />
      ))}

      {hasErrors ? <Text style={styles.summary}>Fix the fields marked in red, then save again.</Text> : null}

      <View style={styles.buttons}>
        <AppButton title={isEditing ? 'Save changes' : 'Add course'} onPress={handleSave} />
        <AppButton title="Cancel" variant="secondary" onPress={onCancel} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  summary: { color: COLORS.short, fontSize: FONT_SIZES.md, marginBottom: SPACING.md },
  buttons: { gap: SPACING.sm },
});