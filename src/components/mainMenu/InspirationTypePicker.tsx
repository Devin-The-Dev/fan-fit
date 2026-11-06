import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS } from '../../theme';
import type { InspirationKind } from '../../types';

export interface InspirationOption {
  key: InspirationKind;
  label: string;
  icon: string;
}

interface Props {
  options: InspirationOption[];
  value: InspirationKind;
  onChange: (value: InspirationKind) => void;
}

export function InspirationTypePicker({ options, value, onChange }: Props) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option.label}
            style={({ pressed }) => [styles.card, active && styles.cardActive, pressed && styles.pressed]}
          >
            <View style={[styles.iconBox, active && styles.iconBoxActive]}>
              <Text style={styles.icon}>{option.icon}</Text>
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 6,
    minHeight: 120,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  cardActive: { borderWidth: 2, borderColor: COLORS.accent, backgroundColor: COLORS.selectedSurface },
  pressed: { opacity: 0.85 },
  iconBox: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.textSubtle,
  },
  iconBoxActive: { borderColor: COLORS.secondary, backgroundColor: COLORS.raised },
  icon: { fontSize: 24 },
  label: { color: COLORS.text, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  labelActive: { color: COLORS.accent },
});
