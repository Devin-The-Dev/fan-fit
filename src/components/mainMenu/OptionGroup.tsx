import { Pressable, Text, View } from 'react-native';

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

const ITEM_BASE = 'items-center justify-center rounded-md border active:opacity-[0.85]';

function itemClasses(isSegment: boolean, wrap: boolean, active: boolean): string {
  const size = isSegment ? 'py-3.5' : 'py-2.5 px-1';
  const layout = wrap ? 'flex-none px-[18px] rounded-full' : 'flex-1';
  let colors = 'border-border bg-surface';
  if (active) colors = isSegment ? 'border-accent bg-accent' : 'border-accent bg-selected-surface';
  return `${ITEM_BASE} ${size} ${layout} ${colors}`;
}

function textClasses(isSegment: boolean, active: boolean): string {
  if (isSegment) return `text-base font-bold ${active ? 'text-text-on-accent' : 'text-text-muted'}`;
  return `text-[13px] font-semibold ${active ? 'text-accent' : 'text-text-muted'}`;
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
    <View className={`flex-row gap-2 ${wrap ? 'flex-wrap' : ''}`} accessibilityRole="radiogroup">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={String(option.key)}
            onPress={() => onChange(option.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            className={itemClasses(isSegment, wrap, active)}
          >
            <Text numberOfLines={1} adjustsFontSizeToFit className={textClasses(isSegment, active)}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
