import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

// The one button used across the whole app.
// variant: 'primary' (blue), 'secondary' (outlined) or 'danger' (red).
// style: optional extra layout from the parent, e.g. { flex: 1 }.
export default function AppButton({ title, onPress, variant = 'primary', style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, style]}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS,
    borderWidth: 1,
    alignItems: 'center',
  },
  primary: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.card, borderColor: COLORS.border },
  danger: { backgroundColor: COLORS.short, borderColor: COLORS.short },
  pressed: { opacity: 0.7 }, // visible feedback when tapped
  text: { color: '#FFFFFF', fontSize: FONT_SIZES.md, fontWeight: '600' },
  secondaryText: { color: COLORS.text },
});