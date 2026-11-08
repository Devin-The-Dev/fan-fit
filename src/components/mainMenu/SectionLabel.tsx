import { Text } from 'react-native';

interface Props {
  children: string;
  variant?: 'section' | 'field';
}

const VARIANT_CLASSES: Record<NonNullable<Props['variant']>, string> = {
  section: 'mb-3 text-text text-sm font-bold tracking-[1px] uppercase',
  field: 'mb-2 text-text-subtle text-sm font-semibold',
};

export function SectionLabel({ children, variant = 'section' }: Props) {
  return <Text className={VARIANT_CLASSES[variant]}>{children}</Text>;
}
