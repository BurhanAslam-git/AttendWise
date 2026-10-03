// Patterns used to check what the user typed.
const WHOLE_NUMBER = /^\d+$/; // 0, 7, 120 (no minus, no decimals)
const DECIMAL_NUMBER = /^\d+(\.\d+)?$/; // 0, 7, 7.5
const LETTERS_AND_DIGITS = /^[A-Z0-9]+$/;

// Checks the form values (all text) and returns an errors object,
// e.g. { code: 'Enter a course code.' }. An empty object means everything is valid.
// otherCourses = every course except the one being edited (for the duplicate check).
export function validateCourse(values, otherCourses) {
  const errors = {};
  const code = values.code.trim().toUpperCase();
  const title = values.title.trim();

  if (code === '') {
    errors.code = 'Enter a course code.';
  } else if (!LETTERS_AND_DIGITS.test(code)) {
    errors.code = 'Use letters and numbers only, with no spaces.';
  } else if (otherCourses.some((course) => course.code === code)) {
    errors.code = `${code} is already in your list.`;
  }

  if (title.length < 3) {
    errors.title = 'Enter a course name of at least 3 letters.';
  }

  const creditHours = Number(values.creditHours);
  if (!WHOLE_NUMBER.test(values.creditHours) || creditHours < 1 || creditHours > 4) {
    errors.creditHours = 'Enter a whole number from 1 to 4.';
  }

  if (!WHOLE_NUMBER.test(values.conducted)) {
    errors.conducted = 'Enter a whole number, e.g. 20.';
  }
  if (!WHOLE_NUMBER.test(values.attended)) {
    errors.attended = 'Enter a whole number, e.g. 18.';
  } else if (!errors.conducted && Number(values.attended) > Number(values.conducted)) {
    errors.attended = "You can't attend more classes than were held.";
  }

  if (!DECIMAL_NUMBER.test(values.marksTotal)) {
    errors.marksTotal = 'Enter a number, e.g. 50 (or 0 if none yet).';
  }
  if (!DECIMAL_NUMBER.test(values.marksObtained)) {
    errors.marksObtained = 'Enter a number, e.g. 38.5 (or 0 if none yet).';
  } else if (!errors.marksTotal && Number(values.marksObtained) > Number(values.marksTotal)) {
    errors.marksObtained = "Marks obtained can't be more than total marks.";
  }

  return errors;
}