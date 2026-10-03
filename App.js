import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DashboardScreen from './src/screens/DashboardScreen';
import CoursesScreen from './src/screens/CoursesScreen';
import CourseFormScreen from './src/screens/CourseFormScreen';
import UndoBar from './src/components/UndoBar';
import { initialCourses } from './src/data/initialCourses';
import { UNDO_SECONDS } from './src/constants/settings';
import { COLORS, SPACING } from './src/constants/theme';

// The three screens. Switching screens = changing the currentScreen state.
// No navigation library is used.
const SCREENS = { DASHBOARD: 'dashboard', COURSES: 'courses', FORM: 'form' };

export default function App() {
  // The course list lives here because all three screens need it ("lifting state up").
  const [courses, setCourses] = useState(initialCourses);
  const [currentScreen, setCurrentScreen] = useState(SCREENS.DASHBOARD);
  const [courseToEdit, setCourseToEdit] = useState(null); // null = adding a new course
  const [formReturnScreen, setFormReturnScreen] = useState(SCREENS.DASHBOARD);
  // The last attendance tap, so it can be undone: { message, previousCourses } or null.
  const [lastAction, setLastAction] = useState(null);

  // Hide the Undo bar after UNDO_SECONDS. A new tap restarts the timer.
  useEffect(() => {
    if (lastAction === null) return;
    const timer = setTimeout(() => setLastAction(null), UNDO_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [lastAction]);

  // Android back button: go back one screen; on the Dashboard let Android close the app.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentScreen === SCREENS.DASHBOARD) return false;
      goBack();
      return true; // true = "we handled it"
    });
    return () => subscription.remove();
  }, [currentScreen, formReturnScreen]);

  // Form goes back to where it was opened from; Courses goes back to the Dashboard.
  function goBack() {
    setCurrentScreen(currentScreen === SCREENS.FORM ? formReturnScreen : SCREENS.DASHBOARD);
  }

  // One class happened: always count it as held, count it as attended only if present.
  function markAttendance(courseId, isPresent) {
    const course = courses.find((item) => item.id === courseId);
    setLastAction({
      message: `Marked ${isPresent ? 'present' : 'absent'} in ${course.code}.`,
      previousCourses: courses, // a snapshot to restore on Undo
    });
    setCourses(
      courses.map((item) =>
        item.id === courseId
          ? {
              ...item,
              conducted: item.conducted + 1,
              attended: item.attended + (isPresent ? 1 : 0),
            }
          : item
      )
    );
  }

  function undoLastAction() {
    setCourses(lastAction.previousCourses);
    setLastAction(null);
  }

  function deleteCourse(courseId) {
    setLastAction(null); // the old snapshot would bring the deleted course back
    setCourses(courses.filter((course) => course.id !== courseId));
  }

  // Opens the form. Pass a course to edit it, or null to add a new one.
  function openForm(course) {
    setCourseToEdit(course);
    setFormReturnScreen(currentScreen); // Cancel goes back to where we came from
    setCurrentScreen(SCREENS.FORM);
  }

  // Replace the course if it already exists, otherwise add it to the end.
  function saveCourse(savedCourse) {
    const alreadyExists = courses.some((course) => course.id === savedCourse.id);
    setLastAction(null); // the old snapshot would undo this save too
    setCourses(
      alreadyExists
        ? courses.map((course) => (course.id === savedCourse.id ? savedCourse : course))
        : [...courses, savedCourse]
    );
    setCurrentScreen(SCREENS.COURSES);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        {/* key makes the scroll position start at the top whenever the screen changes */}
        <ScrollView
          key={currentScreen}
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {currentScreen === SCREENS.DASHBOARD ? (
            <DashboardScreen
              courses={courses}
              onViewCourses={() => setCurrentScreen(SCREENS.COURSES)}
              onAddCourse={() => openForm(null)}
            />
          ) : null}

          {currentScreen === SCREENS.COURSES ? (
            <CoursesScreen
              courses={courses}
              onMarkAttendance={markAttendance}
              onEdit={openForm}
              onDelete={deleteCourse}
              onAdd={() => openForm(null)}
              onBack={goBack}
            />
          ) : null}

          {currentScreen === SCREENS.FORM ? (
            <CourseFormScreen
              courseToEdit={courseToEdit}
              courses={courses}
              onSave={saveCourse}
              onCancel={goBack}
            />
          ) : null}
        </ScrollView>

        {lastAction !== null && currentScreen !== SCREENS.FORM ? (
          <UndoBar message={lastAction.message} onUndo={undoLastAction} />
        ) : null}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: SPACING.lg * 2 },
});