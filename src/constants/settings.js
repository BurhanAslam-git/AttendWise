// App-wide settings. Change a value here and the whole app updates.

// Minimum attendance % required. Set this to YOUR university's rule.
export const ATTENDANCE_THRESHOLD = 80;

// A course less than this many % above the threshold is "At Risk".
export const WARNING_MARGIN = 5;

// A marks % below this is shown as low.
export const LOW_MARKS_THRESHOLD = 50;

// How long the "Undo" bar stays on screen after marking attendance.
export const UNDO_SECONDS = 5;

// The possible attendance statuses of a course.
export const STATUS = {
  SAFE: 'Safe',
  AT_RISK: 'At Risk',
  SHORT: 'Short',
  NO_CLASSES: 'No classes yet',
};

// Filter chips on the Courses screen are generated from this array.
export const FILTER_ALL = 'all';
export const FILTER_OPTIONS = [
  { key: FILTER_ALL, label: 'All' },
  { key: STATUS.AT_RISK, label: 'At Risk' },
  { key: STATUS.SHORT, label: 'Short' },
];

// Sort chips on the Courses screen are generated from this array.
export const SORT_KEYS = {
  ATTENDANCE: 'attendance',
  NAME: 'name',
  MARKS: 'marks',
};
export const SORT_OPTIONS = [
  { key: SORT_KEYS.ATTENDANCE, label: 'Lowest attendance' },
  { key: SORT_KEYS.MARKS, label: 'Lowest marks' },
  { key: SORT_KEYS.NAME, label: 'Name' },
];