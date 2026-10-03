import { ATTENDANCE_THRESHOLD, WARNING_MARGIN, STATUS } from '../constants/settings';

// Attendance % (0 to 100), or null if no classes have been held yet.
export function getAttendancePercent({ attended, conducted }) {
  if (conducted === 0) return null; // avoid dividing by zero
  return (attended / conducted) * 100;
}

// Marks % (0 to 100), or null if nothing has been assessed yet.
export function getMarksPercent({ marksObtained, marksTotal }) {
  if (marksTotal === 0) return null; // avoid dividing by zero
  return (marksObtained / marksTotal) * 100;
}

// Safe, At Risk, Short, or No classes yet.
export function getAttendanceStatus(course) {
  const percent = getAttendancePercent(course);
  if (percent === null) return STATUS.NO_CLASSES;
  if (percent < ATTENDANCE_THRESHOLD) return STATUS.SHORT;
  if (percent < ATTENDANCE_THRESHOLD + WARNING_MARGIN) return STATUS.AT_RISK;
  return STATUS.SAFE;
}

// How many more classes can be missed while staying at or above the threshold.
// Rule: attended / (conducted + missed) >= threshold / 100
export function getClassesCanMiss({ attended, conducted }) {
  const maxTotalClasses = Math.floor((attended * 100) / ATTENDANCE_THRESHOLD);
  return Math.max(0, maxTotalClasses - conducted);
}

// How many classes in a row must be attended to get back to the threshold.
// Returns 0 if already fine, or null if recovery is impossible (threshold 100%).
export function getClassesNeeded({ attended, conducted }) {
  const shortfall = ATTENDANCE_THRESHOLD * conducted - 100 * attended;
  if (shortfall <= 0) return 0;
  if (ATTENDANCE_THRESHOLD >= 100) return null;
  return Math.ceil(shortfall / (100 - ATTENDANCE_THRESHOLD));
}

// The same course as it would be after missing one more class.
// Used for the "If you skip the next class" preview.
export function withOneMoreAbsence(course) {
  return { ...course, conducted: course.conducted + 1 };
}

// Attendance % of all courses together (total attended / total conducted).
export function getOverallAttendance(courses) {
  const totals = courses.reduce(
    (sum, course) => ({
      attended: sum.attended + course.attended,
      conducted: sum.conducted + course.conducted,
    }),
    { attended: 0, conducted: 0 }
  );
  return getAttendancePercent(totals);
}

// Marks % of all courses together (total obtained / total assessed).
export function getOverallMarks(courses) {
  const totals = courses.reduce(
    (sum, course) => ({
      marksObtained: sum.marksObtained + course.marksObtained,
      marksTotal: sum.marksTotal + course.marksTotal,
    }),
    { marksObtained: 0, marksTotal: 0 }
  );
  return getMarksPercent(totals);
}

// 84.2105... -> "84.2%", and null -> "–" so the UI never shows NaN.
export function formatPercent(value) {
  if (value === null) return '–';
  return `${value.toFixed(1)}%`;
}