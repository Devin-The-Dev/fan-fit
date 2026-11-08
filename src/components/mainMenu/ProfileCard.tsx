import { Pressable, Text } from 'react-native';

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
      className="flex-row items-center justify-between gap-3 p-4 rounded-lg border border-border bg-surface active:border-secondary active:bg-raised"
    >
      <Text className="flex-1 text-text text-[17px] font-semibold" numberOfLines={1}>
        {summary}
      </Text>
      <Text className="text-accent text-[17px] font-bold">Edit ›</Text>
    </Pressable>
  );
}
