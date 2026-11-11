import { Pressable, Text, View } from 'react-native';

interface Props {
  label: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
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
      accessibilityState={{ disabled }}
      className={`w-11 h-11 items-center justify-center rounded-md border border-border bg-surface active:border-secondary active:bg-raised ${disabled ? 'opacity-40' : ''}`}
    >
      <Text className="text-accent text-[22px] font-bold">{symbol}</Text>
    </Pressable>
  );
}

export function Stepper({ label, value, unit, min, max, onChange }: Props) {
  return (
    <View className="flex-row items-center gap-1">
      <StepButton
        label={`Decrease ${label}`}
        symbol="−"
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - 1))}
      />
      <Text
        accessibilityLabel={`${label} ${value}${unit ? ` ${unit}` : ''}`}
        className="min-w-[64px] text-center text-text text-[30px] font-bold"
      >
        {value}
      </Text>
      <StepButton
        label={`Increase ${label}`}
        symbol="+"
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + 1))}
      />
    </View>
  );
}
