import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import StatusBadge from './StatusBadge';
import { ATTENDANCE_THRESHOLD, LOW_MARKS_THRESHOLD } from '../constants/settings';
import { COLORS, STATUS_COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';
import {
  getAttendancePercent,
  getAttendanceStatus,
  getMarksPercent,
  withOneMoreAbsence,
  formatPercent,
} from '../utils/calculations';
import { getAdvice } from '../utils/advice';

// One course: status, attendance bar, advice, and attendance buttons.
// Tapping the card shows or hides marks, Edit and Delete.
export default function CourseCard({ course, onMarkPresent, onMarkAbsent, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = getAttendanceStatus(course);
  const statusColor = STATUS_COLORS[status];
  const attendancePercent = getAttendancePercent(course);
  const marksPercent = getMarksPercent(course);
  const isLowMarks = marksPercent !== null && marksPercent < LOW_MARKS_THRESHOLD;

  // "What if I skip?" preview: the course after one more absence.
  const ifSkipped = withOneMoreAbsence(course);
  const ifSkippedStatus = getAttendanceStatus(ifSkipped);

  return (
    <View style={[styles.card, { borderLeftColor: statusColor }]}>
      <Pressable onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.code}>{course.code}</Text>
            <Text style={styles.title}>{course.title}</Text>
          </View>
          <StatusBadge status={status} />
        </View>

        <Text style={[styles.percent, { color: statusColor }]}>
          {formatPercent(attendancePercent)}
        </Text>
        <Text style={styles.muted}>
          {course.attended} of {course.conducted} classes attended
        </Text>

        {/* Attendance bar with a thin black mark at the threshold */}
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${attendancePercent ?? 0}%`, backgroundColor: statusColor },
            ]}
          />
          <View style={[styles.thresholdMark, { left: `${ATTENDANCE_THRESHOLD}%` }]} />
        </View>

        <Text style={styles.advice}>{getAdvice(course)}</Text>
        <Text style={styles.whatIf}>
          If you skip the next class:{' '}
          <Text style={[styles.whatIfValue, { color: STATUS_COLORS[ifSkippedStatus] }]}>
            {formatPercent(getAttendancePercent(ifSkipped))} ({ifSkippedStatus})
          </Text>
        </Text>
      </Pressable>

      <View style={styles.buttonRow}>
        <AppButton
          title="+ Present"
          onPress={() => onMarkPresent(course.id)}
          style={styles.flexButton}
        />
        <AppButton
          title="+ Absent"
          variant="secondary"
          onPress={() => onMarkAbsent(course.id)}
          style={styles.flexButton}
        />
      </View>

      {isExpanded ? (
        <View style={styles.details}>
          <Text style={styles.detailText}>Credit hours: {course.creditHours}</Text>
          <Text style={[styles.detailText, isLowMarks && styles.lowMarks]}>
            Marks:{' '}
            {course.marksTotal === 0
              ? 'none recorded yet'
              : `${course.marksObtained} / ${course.marksTotal} (${formatPercent(marksPercent)})`}
          </Text>
          <View style={styles.buttonRow}>
            <AppButton
              title="Edit"
              variant="secondary"
              onPress={() => onEdit(course)}
              style={styles.flexButton}
            />
            <AppButton
              title="Delete"
              variant="danger"
              onPress={() => onDelete(course)}
              style={styles.flexButton}
            />
          </View>
        </View>
      ) : (
        <Text style={styles.hint}>Tap the card to see marks, edit or delete</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    borderLeftWidth: 5, // colored strip shows the status at a glance
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.sm },
  titleBlock: { flex: 1 },
  code: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted, fontWeight: '600' },
  title: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  percent: { fontSize: FONT_SIZES.xl, fontWeight: '700', marginTop: SPACING.sm },
  muted: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted },
  barTrack: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  barFill: { height: '100%' },
  thresholdMark: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.text,
  },
  advice: { fontSize: FONT_SIZES.md, color: COLORS.text, marginTop: SPACING.sm },
  whatIf: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginTop: SPACING.xs },
  whatIfValue: { fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  flexButton: { flex: 1 },
  details: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
  },
  detailText: { fontSize: FONT_SIZES.md, color: COLORS.text, marginBottom: SPACING.xs },
  lowMarks: { color: COLORS.short, fontWeight: '600' },
  hint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});