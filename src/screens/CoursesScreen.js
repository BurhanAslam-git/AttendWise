import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import FormField from '../components/FormField';
import OptionChips from '../components/OptionChips';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import AppButton from '../components/AppButton';
import { FILTER_ALL, FILTER_OPTIONS, SORT_KEYS, SORT_OPTIONS } from '../constants/settings';
import { SPACING } from '../constants/theme';
import { searchCourses, filterByStatus, sortCourses } from '../utils/courseListHelpers';

// List of all courses with search, filter, sort, attendance buttons, edit and delete.
export default function CoursesScreen({
  courses,
  onMarkAttendance,
  onEdit,
  onDelete,
  onAdd,
  onBack,
}) {
  // These only matter on this screen, so they live here (not in App).
  const [searchText, setSearchText] = useState('');
  const [filterKey, setFilterKey] = useState(FILTER_ALL);
  const [sortKey, setSortKey] = useState(SORT_KEYS.ATTENDANCE);

  // Empty state: every course has been deleted.
  if (courses.length === 0) {
    return (
      <>
        <ScreenHeader title="My courses" onBack={onBack} />
        <EmptyState
          title="No courses yet"
          message="Add a course to start tracking your attendance."
          actionTitle="Add a course"
          onAction={onAdd}
        />
      </>
    );
  }

  // search -> filter -> sort. Each step returns a NEW array; `courses` is never changed.
  const visibleCourses = sortCourses(
    filterByStatus(searchCourses(courses, searchText), filterKey),
    sortKey
  );

  function confirmDelete(course) {
    Alert.alert('Delete this course?', `${course.code} ${course.title} and its attendance will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(course.id) },
    ]);
  }

  function clearSearchAndFilter() {
    setSearchText('');
    setFilterKey(FILTER_ALL);
  }

  return (
    <>
      <ScreenHeader
        title="My courses"
        subtitle={`Showing ${visibleCourses.length} of ${courses.length}`}
        onBack={onBack}
      />

      <FormField
        label="Search"
        placeholder="Course code or name"
        value={searchText}
        onChangeText={setSearchText}
        autoCorrect={false}
        maxLength={40}
      />
      <OptionChips label="Show" options={FILTER_OPTIONS} selectedKey={filterKey} onSelect={setFilterKey} />
      <OptionChips label="Sort by" options={SORT_OPTIONS} selectedKey={sortKey} onSelect={setSortKey} />
      <AppButton title="Add a course" variant="secondary" onPress={onAdd} style={styles.addButton} />

      {visibleCourses.length === 0 ? (
        <EmptyState
          title="No matching courses"
          message="Nothing matches your search and filter."
          actionTitle="Clear search and filter"
          onAction={clearSearchAndFilter}
        />
      ) : (
        visibleCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onMarkPresent={(courseId) => onMarkAttendance(courseId, true)}
            onMarkAbsent={(courseId) => onMarkAttendance(courseId, false)}
            onEdit={onEdit}
            onDelete={confirmDelete}
          />
        ))
      )}
    </>
  );
}

const styles = StyleSheet.create({
  addButton: { marginBottom: SPACING.md },
});