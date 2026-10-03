import { FILTER_ALL, SORT_KEYS } from '../constants/settings';
import { getAttendancePercent, getMarksPercent, getAttendanceStatus } from './calculations';

// Keep courses whose code or title contains the search text (ignores capitals).
export function searchCourses(courses, searchText) {
  const query = searchText.trim().toLowerCase();
  if (query === '') return courses;
  return courses.filter(
    (course) =>
      course.code.toLowerCase().includes(query) ||
      course.title.toLowerCase().includes(query)
  );
}

// Keep only courses with the chosen status, or all of them.
export function filterByStatus(courses, filterKey) {
  if (filterKey === FILTER_ALL) return courses;
  return courses.filter((course) => getAttendanceStatus(course) === filterKey);
}

// Courses with no data (null %) get 101 so they always go to the end.
const NO_DATA_SORT_VALUE = 101;

// Return a NEW sorted array. We copy first because .sort() changes
// the array it is called on, and React state must never be changed directly.
export function sortCourses(courses, sortKey) {
  const sorted = [...courses];

  if (sortKey === SORT_KEYS.NAME) {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  const getValue = sortKey === SORT_KEYS.MARKS ? getMarksPercent : getAttendancePercent;
  return sorted.sort(
    (a, b) => (getValue(a) ?? NO_DATA_SORT_VALUE) - (getValue(b) ?? NO_DATA_SORT_VALUE)
  );
}