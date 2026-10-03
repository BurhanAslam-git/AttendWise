import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

// A labelled row of tappable chips, generated from an array of { key, label }.
// Used twice on the Courses screen: once for filtering, once for sorting.
export default function OptionChips({ label, options, selectedKey, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const isSelected = option.key === selectedKey;
          return (
            <Pressable
              key={option.key}
              onPress={() => onSelect(option.key)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  label: { fontSize: FONT_SIZES.sm, color: COLORS.textMuted, marginBottom: SPACING.xs },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    borderRadius: 999,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: FONT_SIZES.md, color: COLORS.text },
  chipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
});