import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../../theme';
import type { Gender } from '../../types';
import { type Option, OptionGroup } from './OptionGroup';
import { SectionLabel } from './SectionLabel';

const MIN_AGE = 13;
const MAX_AGE = 90;

interface Props {
  visible: boolean;
  age: number;
  gender: Gender;
  genderOptions: Option<Gender>[];
  onChangeAge: (age: number) => void;
  onChangeGender: (gender: Gender) => void;
  onClose: () => void;
}

interface StepButtonProps {
  label: string;
  symbol: string;
  disabled: boolean;
  onPress: () => void;
}

function StepButton({ label, symbol, disabled, onPress }: StepButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed, disabled && styles.disabled]}
    >
      <Text style={styles.stepSymbol}>{symbol}</Text>
    </Pressable>
  );
}

export function ProfileSheet({
  visible,
  age,
  gender,
  genderOptions,
  onChangeAge,
  onChangeGender,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={onClose} accessibilityLabel="Close profile" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close">
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <SectionLabel variant="field">Age</SectionLabel>
          <View style={styles.stepper}>
            <StepButton
              label="Decrease age"
              symbol="−"
              disabled={age <= MIN_AGE}
              onPress={() => onChangeAge(Math.max(MIN_AGE, age - 1))}
            />
            <Text style={styles.stepValue}>{age}</Text>
            <StepButton
              label="Increase age"
              symbol="+"
              disabled={age >= MAX_AGE}
              onPress={() => onChangeAge(Math.min(MAX_AGE, age + 1))}
            />
          </View>

          <SectionLabel variant="field">Gender</SectionLabel>
          <OptionGroup options={genderOptions} value={gender} onChange={onChangeGender} wrap />

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.doneBtn, pressed && styles.doneBtnPressed]}
          >
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.screenX,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '800' },
  close: { color: COLORS.textMuted, fontSize: 20 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 24 },
  stepBtn: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  stepBtnPressed: { borderColor: COLORS.secondary, backgroundColor: COLORS.raised },
  disabled: { opacity: 0.4 },
  stepSymbol: { color: COLORS.accent, fontSize: 24, fontWeight: '700' },
  stepValue: { color: COLORS.text, fontSize: 32, fontWeight: '700', minWidth: 48, textAlign: 'center' },
  doneBtn: {
    marginTop: 28,
    paddingVertical: 18,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    backgroundColor: COLORS.accent,
  },
  doneBtnPressed: { backgroundColor: COLORS.accentPressed },
  doneText: { color: COLORS.textOnAccent, fontSize: 18, fontWeight: '800' },
});
