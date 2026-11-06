import { StyleSheet, Text } from 'react-native';
import { COLORS } from '../../theme';

interface Props {
  children: string;
  variant?: 'section' | 'field';
}

export function SectionLabel({ children, variant = 'section' }: Props) {
  return <Text style={variant === 'section' ? styles.section : styles.field}>{children}</Text>;
}

const styles = StyleSheet.create({
  section: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  field: {
    color: COLORS.textSubtle,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
});
