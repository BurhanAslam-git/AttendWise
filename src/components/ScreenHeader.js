import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

// Title at the top of every screen.
// The Back link only appears if the parent passes onBack.
// The subtitle only appears if the parent passes one.
export default function ScreenHeader({ title, subtitle, onBack }) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  back: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  title: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.textMuted, marginTop: SPACING.xs },
});