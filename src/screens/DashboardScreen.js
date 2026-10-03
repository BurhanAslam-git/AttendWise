import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import ScreenHeader from '../components/ScreenHeader';
import StatBox from '../components/StatBox';
import StatusBadge from '../components/StatusBadge';
import ChartCard from '../components/ChartCard';
import EmptyState from '../components/EmptyState';
import AppButton from '../components/AppButton';
import {
  ATTENDANCE_THRESHOLD,
  LOW_MARKS_THRESHOLD,
  STATUS,
  SORT_KEYS,
} from '../constants/settings';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';
import {
  getAttendancePercent,
  getMarksPercent,
  getAttendanceStatus,
  getOverallAttendance,
  getOverallMarks,
  formatPercent,
} from '../utils/calculations';
import { getAdvice } from '../utils/advice';
import { sortCourses } from '../utils/courseListHelpers';

const CHART_HEIGHT = 220;

// Shared look for both charts. rgba(37, 99, 235) is the same blue as COLORS.primary.
const chartConfig = {
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: () => COLORS.textMuted,
};

// Home screen: summary numbers, warnings, and two charts.
export default function DashboardScreen({ courses, onViewCourses, onAddCourse }) {
  const { width } = useWindowDimensions();
  const chartWidth = width - SPACING.md * 2; // screen padding on both sides

  const header = (
    <ScreenHeader title="AttendWise" subtitle={`Minimum attendance: ${ATTENDANCE_THRESHOLD}%`} />
  );

  // Empty state: no courses at all, so there is nothing to summarise or chart.
  if (courses.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          title="No courses yet"
          message="Add your courses to see your attendance dashboard."
          actionTitle="Add a course"
          onAction={onAddCourse}
        />
      </>
    );
  }

  const overallAttendance = getOverallAttendance(courses);
  const overallMarks = getOverallMarks(courses);

  // Short and At Risk courses, lowest attendance first.
  const coursesNeedingAttention = sortCourses(
    courses.filter((course) => {
      const status = getAttendanceStatus(course);
      return status === STATUS.SHORT || status === STATUS.AT_RISK;
    }),
    SORT_KEYS.ATTENDANCE
  );

  // Charts only show courses that have data, so they never get empty or null values.
  const coursesWithClasses = courses.filter((course) => course.conducted > 0);
  const coursesWithMarks = courses.filter((course) => course.marksTotal > 0);

  return (
    <>
      {header}

      <View style={styles.statRow}>
        <StatBox
          label="Attendance"
          value={formatPercent(overallAttendance)}
          color={
            overallAttendance !== null && overallAttendance < ATTENDANCE_THRESHOLD
              ? COLORS.short
              : COLORS.text
          }
        />
        <StatBox
          label="Marks so far"
          value={formatPercent(overallMarks)}
          color={
            overallMarks !== null && overallMarks < LOW_MARKS_THRESHOLD ? COLORS.short : COLORS.text
          }
        />
        <StatBox
          label="Need attention"
          value={coursesNeedingAttention.length}
          color={coursesNeedingAttention.length > 0 ? COLORS.short : COLORS.safe}
        />
      </View>

      <View style={styles.warningsCard}>
        <Text style={styles.sectionTitle}>Warnings</Text>
        {coursesNeedingAttention.length === 0 ? (
          <Text style={styles.allClear}>No course is close to the {ATTENDANCE_THRESHOLD}% limit.</Text>
        ) : (
          coursesNeedingAttention.map((course) => (
            <View key={course.id} style={styles.warningRow}>
              <View style={styles.warningHeader}>
                <Text style={styles.warningTitle}>{course.title}</Text>
                <StatusBadge status={getAttendanceStatus(course)} />
              </View>
              <Text style={styles.warningText}>{getAdvice(course)}</Text>
            </View>
          ))
        )}
      </View>

      <ChartCard
        title="Attendance by course"
        caption={`Bars below ${ATTENDANCE_THRESHOLD}% mean you are short.`}
      >
        {coursesWithClasses.length === 0 ? (
          <Text style={styles.noData}>No classes recorded yet.</Text>
        ) : (
          <BarChart
            data={{
              labels: coursesWithClasses.map((course) => course.code),
              datasets: [{ data: coursesWithClasses.map((course) => getAttendancePercent(course)) }],
            }}
            width={chartWidth}
            height={CHART_HEIGHT}
            yAxisLabel=""
            yAxisSuffix="%"
            fromZero // start the y-axis at 0 so bar heights are honest
            chartConfig={chartConfig}
          />
        )}
      </ChartCard>

      <ChartCard
        title="Marks earned so far"
        caption="Each ring is one course. A full ring means full marks."
      >
        {coursesWithMarks.length === 0 ? (
          <Text style={styles.noData}>No marks recorded yet.</Text>
        ) : (
          <ProgressChart
            data={{
              labels: coursesWithMarks.map((course) => course.code),
              data: coursesWithMarks.map((course) => getMarksPercent(course) / 100), // 0 to 1
            }}
            width={chartWidth}
            height={CHART_HEIGHT}
            strokeWidth={12}
            radius={28}
            chartConfig={chartConfig}
          />
        )}
      </ChartCard>

      <View style={styles.buttons}>
        <AppButton title="View all courses" onPress={onViewCourses} />
        <AppButton title="Add a course" variant="secondary" onPress={onAddCourse} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  warningsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  allClear: { fontSize: FONT_SIZES.md, color: COLORS.safe },
  warningRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  warningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  warningTitle: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  warningText: { fontSize: FONT_SIZES.md, color: COLORS.textMuted, marginTop: SPACING.xs },
  noData: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  buttons: { gap: SPACING.sm },
});