import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

// Dark bar at the bottom of the screen: "Marked absent in CS2001.  Undo"
// App decides when to show it and what Undo does.
export default function UndoBar({ message, onUndo }) {
  return (
    <View style={styles.bar}>
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={onUndo} hitSlop={12}>
        <Text style={styles.undo}>Undo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.text,
    borderRadius: RADIUS,
    padding: SPACING.md,
    margin: SPACING.md,
  },
  message: { flex: 1, color: '#FFFFFF', fontSize: FONT_SIZES.md },
  undo: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});