import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS } from '../../theme';

interface Props {
  summary: string;
  onEdit: () => void;
}

export function ProfileCard({ summary, onEdit }: Props) {
  return (
    <Pressable
      onPress={onEdit}
      accessibilityRole="button"
      accessibilityLabel="Edit profile"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.summary} numberOfLines={1}>
        {summary}
      </Text>
      <Text style={styles.edit}>Edit ›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  pressed: { borderColor: COLORS.secondary, backgroundColor: COLORS.raised },
  summary: { flex: 1, color: COLORS.text, fontSize: 17, fontWeight: '600' },
  edit: { color: COLORS.accent, fontSize: 17, fontWeight: '700' },
});
