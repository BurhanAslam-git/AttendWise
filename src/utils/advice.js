import { ATTENDANCE_THRESHOLD, STATUS } from '../constants/settings';
import { getAttendanceStatus, getClassesCanMiss, getClassesNeeded } from './calculations';

// "1 class" or "3 classes"
function countClasses(count) {
  return `${count} ${count === 1 ? 'class' : 'classes'}`;
}

// One sentence telling the student what to do next for a course.
// Used on course cards AND in the dashboard warnings, so it lives here once.
export function getAdvice(course) {
  const status = getAttendanceStatus(course);

  if (status === STATUS.NO_CLASSES) return 'No classes yet. Mark your first class below.';

  if (status === STATUS.SHORT) {
    const needed = getClassesNeeded(course);
    if (needed === null) return `You can no longer reach ${ATTENDANCE_THRESHOLD}%.`;
    return `Attend the next ${countClasses(needed)} in a row to reach ${ATTENDANCE_THRESHOLD}%.`;
  }

  const canMiss = getClassesCanMiss(course);
  if (canMiss === 0) return "Don't miss the next class.";
  return `You can miss ${countClasses(canMiss)} and stay at ${ATTENDANCE_THRESHOLD}% or above.`;
}