import { View, Text, StyleSheet } from 'react-native';
import { STATUS_COLORS, SPACING, FONT_SIZES } from '../constants/theme';

// Small colored pill showing a course's status (Safe, At Risk, Short...).
export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status];

  return (
    // color + '1A' adds transparency (about 10%) for a light background.
    <View style={[styles.badge, { backgroundColor: color + '1A', borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    alignSelf: 'flex-start',
  },
  text: { fontSize: FONT_SIZES.sm, fontWeight: '600' },
});