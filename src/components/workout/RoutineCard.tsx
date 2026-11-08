import { Pressable, Text, View } from 'react-native';
import type { Exercise, WorkoutRoutine } from '../../types';

interface Props {
  routine: WorkoutRoutine;
  onWatchTutorial: (exercise: Exercise) => void;
  onShuffle: () => void;
  onLayoutY: (y: number) => void;
}

export function RoutineCard({ routine, onWatchTutorial, onShuffle, onLayoutY }: Props) {
  return (
    <View
      className="mt-7 p-[18px] rounded-lg border border-border bg-surface"
      onLayout={(event) => onLayoutY(event.nativeEvent.layout.y)}
    >
      <Text className="mb-2 text-text text-[22px] font-extrabold">{routine.headline}</Text>
      <Text className="mb-3 text-text-muted text-[15px] leading-[22px]">{routine.subtitle}</Text>
      <View className="mb-[18px] flex-row flex-wrap items-center gap-2.5">
        <Text className="flex-1 min-w-[120px] text-accent text-[13px] font-bold">{routine.focusLabel}</Text>
        <Text className="text-text-muted text-[13px] font-semibold">~{routine.estimatedMinutes} min</Text>
      </View>
      <Text className="mb-4 text-text-muted text-xs leading-[18px] italic">{routine.tailoringLabel}</Text>

      {routine.sections.map((section) => (
        <View key={section.title} className="mb-[18px]">
          <Text className="mb-3 pb-2 text-text text-[17px] font-extrabold border-b-hairline border-border">
            {section.title}
          </Text>
          {section.exercises.map((exercise) => (
            <View key={exercise.name + exercise.detail} className="mb-3.5 py-0.5 px-3 border-l-[3px] border-secondary">
              <Text className="mb-1 text-text text-base font-bold">{exercise.name}</Text>
              <Text className="mb-2.5 text-text-muted text-sm leading-5">{exercise.detail}</Text>
              <Pressable
                onPress={() => onWatchTutorial(exercise)}
                className="self-start py-2 px-3 rounded-sm border border-secondary bg-selected-surface active:opacity-[0.85]"
                accessibilityRole="button"
                accessibilityLabel={`Watch tutorial for ${exercise.name}`}
              >
                <Text className="text-accent text-[13px] font-bold">▶  Watch tutorial</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ))}

      <Pressable
        onPress={onShuffle}
        className="mt-2 py-3.5 items-center rounded-md border border-secondary active:opacity-[0.85]"
      >
        <Text className="text-text text-[15px] font-bold">Shuffle another variation</Text>
      </Pressable>
    </View>
  );
}
