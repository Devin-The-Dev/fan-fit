import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS } from '../../theme';

export interface Option<T extends string | number> {
  key: T;
  label: string;
}

interface Props<T extends string | number> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: 'chip' | 'segment';
  wrap?: boolean;
}

export function OptionGroup<T extends string | number>({
  options,
  value,
  onChange,
  variant = 'chip',
  wrap = false,
}: Props<T>) {
  const isSegment = variant === 'segment';

  return (
    <View style={[styles.row, wrap && styles.rowWrap]} accessibilityRole="radiogroup">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={String(option.key)}
            onPress={() => onChange(option.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.base,
              isSegment ? styles.segment : styles.chip,
              wrap && styles.wrapItem,
              active && (isSegment ? styles.segmentActive : styles.chipActive),
              pressed && styles.pressed,
            ]}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                isSegment ? styles.segmentText : styles.chipText,
                active && (isSegment ? styles.segmentTextActive : styles.chipTextActive),
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  rowWrap: { flexWrap: 'wrap' },
  wrapItem: { flex: 0, paddingHorizontal: 18, borderRadius: RADIUS.pill },
  base: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chip: { paddingVertical: 10, paddingHorizontal: 4, borderRadius: RADIUS.md },
  chipActive: { borderColor: COLORS.accent, backgroundColor: COLORS.selectedSurface },
  segment: { paddingVertical: 14, borderRadius: RADIUS.md },
  segmentActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accent },
  pressed: { opacity: 0.85 },
  chipText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: COLORS.accent },
  segmentText: { color: COLORS.textMuted, fontSize: 16, fontWeight: '700' },
  segmentTextActive: { color: COLORS.textOnAccent },
});
