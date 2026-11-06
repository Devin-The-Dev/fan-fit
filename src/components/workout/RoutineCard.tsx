import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS } from '../../theme';
import type { Exercise, WorkoutRoutine } from '../../types';

interface Props {
  routine: WorkoutRoutine;
  onWatchTutorial: (exercise: Exercise) => void;
  onShuffle: () => void;
  onLayoutY: (y: number) => void;
}

export function RoutineCard({ routine, onWatchTutorial, onShuffle, onLayoutY }: Props) {
  return (
    <View style={styles.card} onLayout={(event) => onLayoutY(event.nativeEvent.layout.y)}>
      <Text style={styles.title}>{routine.headline}</Text>
      <Text style={styles.subtitle}>{routine.subtitle}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaBadge}>{routine.focusLabel}</Text>
        <Text style={styles.metaTime}>~{routine.estimatedMinutes} min</Text>
      </View>
      <Text style={styles.tailoring}>{routine.tailoringLabel}</Text>

      {routine.sections.map((section) => (
        <View key={section.title} style={styles.block}>
          <Text style={styles.blockTitle}>{section.title}</Text>
          {section.exercises.map((exercise) => (
            <View key={exercise.name + exercise.detail} style={styles.exercise}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetail}>{exercise.detail}</Text>
              <Pressable
                onPress={() => onWatchTutorial(exercise)}
                style={({ pressed }) => [styles.videoBtn, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Watch tutorial for ${exercise.name}`}
              >
                <Text style={styles.videoBtnText}>▶  Watch tutorial</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ))}

      <Pressable onPress={onShuffle} style={({ pressed }) => [styles.shuffleBtn, pressed && styles.pressed]}>
        <Text style={styles.shuffleText}>Shuffle another variation</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 28,
    padding: 18,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: COLORS.textMuted, fontSize: 15, lineHeight: 22, marginBottom: 12 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 18 },
  metaBadge: { flex: 1, minWidth: 120, color: COLORS.accent, fontSize: 13, fontWeight: '700' },
  metaTime: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  tailoring: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, marginBottom: 16, fontStyle: 'italic' },
  block: { marginBottom: 18 },
  blockTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  exercise: {
    marginBottom: 14,
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  exerciseName: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  exerciseDetail: { color: COLORS.textMuted, fontSize: 14, lineHeight: 20, marginBottom: 10 },
  videoBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.selectedSurface,
  },
  videoBtnText: { color: COLORS.accent, fontSize: 13, fontWeight: '700' },
  shuffleBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    alignItems: 'center',
  },
  shuffleText: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
