import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

// Shown instead of a list or chart when there is nothing to display.
// The button only appears if the parent passes onAction.
export default function EmptyState({ title, message, actionTitle, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onAction ? <AppButton title={actionTitle} onPress={onAction} style={styles.button} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  button: { marginTop: SPACING.md, alignSelf: 'stretch' },
});