import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

// One summary number with a label underneath, e.g. "85.7%" / "Overall".
// color is optional; it defaults to the normal text color.
export default function StatBox({ label, value, color = COLORS.text }) {
  return (
    <View style={styles.box}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1, // boxes in a row share the width equally
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  value: { fontSize: FONT_SIZES.lg, fontWeight: '700' },
  label: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginTop: SPACING.xs },
});