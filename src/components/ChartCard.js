import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

// A white card with a title, an optional caption, and any chart inside it.
// "children" is whatever the parent puts between <ChartCard> and </ChartCard>.
export default function ChartCard({ title, caption, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
  },
  caption: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
});