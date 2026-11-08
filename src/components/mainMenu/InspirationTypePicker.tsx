import { Pressable, Text, View } from 'react-native';
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

const CARD_BASE = 'flex-1 items-center gap-2.5 pt-3.5 pb-4 px-1.5 min-h-[120px] rounded-lg active:opacity-[0.85]';
const ICON_BOX_BASE = 'w-[52px] h-[52px] items-center justify-center rounded-md border-[1.5px] border-dashed';

export function InspirationTypePicker({ options, value, onChange }: Props) {
  return (
    <View className="flex-row gap-2" accessibilityRole="radiogroup">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option.label}
            className={`${CARD_BASE} ${
              active ? 'border-2 border-accent bg-selected-surface' : 'border border-border bg-surface'
            }`}
          >
            <View className={`${ICON_BOX_BASE} ${active ? 'border-secondary bg-raised' : 'border-text-subtle'}`}>
              <Text className="text-2xl">{option.icon}</Text>
            </View>
            <Text className={`text-base font-bold text-center ${active ? 'text-accent' : 'text-text'}`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
