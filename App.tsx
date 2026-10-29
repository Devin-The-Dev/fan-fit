import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExerciseVideoPlayer } from './src/components/ExerciseVideoPlayer';
import { generateWorkout } from './src/generateWorkout';
import type {
  ActivityLevel,
  Gender,
  InspirationKind,
  UserProfile,
  WorkoutDuration,
  WorkoutRoutine,
} from './src/types';
import { DEFAULT_PROFILE } from './src/types';

const ACCENT = '#34d399';
const BG = '#0c1222';
const CARD = '#151d33';
const MUTED = '#94a3b8';
const BORDER = '#273352';

const KINDS: { key: InspirationKind; label: string; hint: string }[] = [
  { key: 'sport', label: 'Sport', hint: 'e.g. basketball, swimming, boxing' },
  { key: 'celebrity', label: 'Celebrity', hint: 'e.g. actor, musician, public figure' },
  { key: 'character', label: 'Fictional character', hint: 'e.g. superhero, anime lead, book hero' },
];

const GENDERS: { key: Gender; label: string }[] = [
  { key: 'female', label: 'Female' },
  { key: 'male', label: 'Male' },
  { key: 'non_binary', label: 'Non-binary' },
  { key: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const ACTIVITY_LEVELS: { key: ActivityLevel; label: string }[] = [
  { key: 'sedentary', label: 'Sedentary' },
  { key: 'light', label: 'Light' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'active', label: 'Active' },
  { key: 'very_active', label: 'Very active' },
];

const WORKOUT_DURATIONS: { key: WorkoutDuration; label: string }[] = [
  { key: 30, label: '30 minutes' },
  { key: 45, label: '45 minutes' },
  { key: 60, label: '1 hour' },
];

function parseAge(raw: string): number {
  const n = parseInt(raw.replace(/\D/g, ''), 10);
  if (Number.isNaN(n)) return DEFAULT_PROFILE.age;
  return Math.min(90, Math.max(13, n));
}

function buildProfile(
  ageText: string,
  gender: Gender,
  activityLevel: ActivityLevel,
  durationMinutes: WorkoutDuration
): UserProfile {
  return { age: parseAge(ageText), gender, activityLevel, durationMinutes };
}

function HomeBody() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [kind, setKind] = useState<InspirationKind>('sport');
  const [name, setName] = useState('');
  const [ageText, setAgeText] = useState(String(DEFAULT_PROFILE.age));
  const [gender, setGender] = useState<Gender>(DEFAULT_PROFILE.gender);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(DEFAULT_PROFILE.activityLevel);
  const [durationMinutes, setDurationMinutes] = useState<WorkoutDuration>(DEFAULT_PROFILE.durationMinutes);
  const [variation, setVariation] = useState(0);
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  const [routineStartY, setRoutineStartY] = useState<number | null>(null);
  const [pendingRoutineScroll, setPendingRoutineScroll] = useState(false);
  const [activeVideo, setActiveVideo] = useState<
    { title: string; videos: { name: string; videoId: string }[] } | null
  >(null);

  const hint = useMemo(() => KINDS.find((k) => k.key === kind)?.hint ?? '', [kind]);
  const profile = useMemo(
    () => buildProfile(ageText, gender, activityLevel, durationMinutes),
    [ageText, gender, activityLevel, durationMinutes]
  );

  const onGenerate = () => {
    setPendingRoutineScroll(true);
    const next = variation + 1;
    setVariation(next);
    setRoutine(generateWorkout(kind, name, next, profile));
  };

  const onNewVariation = () => {
    setPendingRoutineScroll(true);
    const next = variation + 1;
    setVariation(next);
    setRoutine(generateWorkout(kind, name, next, profile));
  };

  useEffect(() => {
    if (!pendingRoutineScroll || !routine || routineStartY === null) return;

    scrollRef.current?.scrollTo({ y: Math.max(0, routineStartY - 8), animated: true });
    setPendingRoutineScroll(false);
  }, [pendingRoutineScroll, routine, routineStartY]);

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>FanFit</Text>
          <Text style={styles.title}>Workouts from what motivates you</Text>
          <Text style={styles.lede}>
            Pick a sport, a celebrity, or a fictional character. Sets and reps scale to your age, gender, and activity level.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>About you</Text>
        <Text style={styles.fieldLabel}>Age</Text>
        <TextInput
          value={ageText}
          onChangeText={setAgeText}
          placeholder="30"
          placeholderTextColor="#64748b"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={2}
          returnKeyType="done"
        />

        <Text style={styles.fieldLabel}>Gender</Text>
        <View style={styles.row}>
          {GENDERS.map((item) => {
            const active = gender === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setGender(item.key)}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipActive,
                  pressed && styles.chipPressed,
                ]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.fieldLabel}>Activity level</Text>
        <View style={styles.row}>
          {ACTIVITY_LEVELS.map((item) => {
            const active = activityLevel === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setActivityLevel(item.key)}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipActive,
                  pressed && styles.chipPressed,
                ]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.fieldLabel}>Workout length</Text>
        <View style={styles.row}>
          {WORKOUT_DURATIONS.map((item) => {
            const active = durationMinutes === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setDurationMinutes(item.key)}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipActive,
                  pressed && styles.chipPressed,
                ]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Inspiration type</Text>
        <View style={styles.row}>
          {KINDS.map((item) => {
            const active = kind === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setKind(item.key)}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipActive,
                  pressed && styles.chipPressed,
                ]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Who or what inspires this session?</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={hint}
          placeholderTextColor="#64748b"
          style={styles.input}
          autoCapitalize="words"
          autoCorrect
          returnKeyType="done"
        />

        <Pressable
          onPress={onGenerate}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
        >
          <Text style={styles.primaryBtnText}>Generate routine</Text>
        </Pressable>

        {routine && (
          <View
            style={styles.resultCard}
            onLayout={(event) => setRoutineStartY(event.nativeEvent.layout.y)}
          >
            <View style={styles.resultHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>{routine.headline}</Text>
                <Text style={styles.resultSub}>{routine.subtitle}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaBadge}>{routine.focusLabel}</Text>
              <Text style={styles.metaTime}>~{routine.estimatedMinutes} min</Text>
            </View>
            <Text style={styles.tailoring}>{routine.tailoringLabel}</Text>

            {routine.sections.map((sec) => (
              <View key={sec.title} style={styles.block}>
                <Text style={styles.blockTitle}>{sec.title}</Text>
                {sec.exercises.map((ex) => (
                  <View key={ex.name + ex.detail} style={styles.exercise}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseDetail}>{ex.detail}</Text>
                    <Pressable
                      onPress={() => {
                        const playableVideos = ex.tutorialVideos.map((video) => ({
                          name: video.name,
                          videoId: video.videoId,
                        }));

                        if (playableVideos.length > 0) {
                          setActiveVideo({
                            title: ex.name,
                            videos: playableVideos,
                          });
                        } else {
                          Linking.openURL(ex.videoUrl);
                        }
                      }}
                      style={({ pressed }) => [styles.videoBtn, pressed && styles.videoBtnPressed]}
                      accessibilityRole="button"
                      accessibilityLabel={`Watch tutorial for ${ex.name}`}
                    >
                      <Text style={styles.videoBtnIcon}>▶</Text>
                      <Text style={styles.videoBtnText}>Watch tutorial</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ))}

            <Pressable
              onPress={onNewVariation}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
            >
              <Text style={styles.secondaryBtnText}>Shuffle another variation</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {activeVideo && (
        <ExerciseVideoPlayer
          title={activeVideo.title}
          videos={activeVideo.videos}
          visible={Boolean(activeVideo)}
          onClose={() => setActiveVideo(null)}
        />
      )}

      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <HomeBody />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: BG },
  safe: { flex: 1, backgroundColor: BG },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: { marginBottom: 24 },
  kicker: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 10,
  },
  lede: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 24,
  },
  sectionLabel: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  fieldLabel: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
  },
  chipActive: {
    borderColor: ACCENT,
    backgroundColor: '#132a22',
  },
  chipPressed: { opacity: 0.85 },
  chipText: { color: MUTED, fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: ACCENT },
  input: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#f8fafc',
    marginBottom: 18,
  },
  primaryBtn: {
    backgroundColor: ACCENT,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryBtnPressed: { opacity: 0.9 },
  primaryBtnText: { color: '#042f24', fontSize: 17, fontWeight: '800' },
  resultCard: {
    marginTop: 28,
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },
  resultHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  resultTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  resultSub: { color: MUTED, fontSize: 15, lineHeight: 22 },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    marginBottom: 18,
  },
  metaBadge: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    minWidth: 120,
  },
  metaTime: { color: MUTED, fontSize: 13, fontWeight: '600' },
  tailoring: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  block: { marginBottom: 18 },
  blockTitle: {
    color: '#e2e8f0',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    paddingBottom: 8,
  },
  exercise: {
    marginBottom: 14,
    paddingLeft: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#334155',
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  exerciseName: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  exerciseDetail: { color: MUTED, fontSize: 14, lineHeight: 20, marginBottom: 10 },
  videoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#132a22',
    borderWidth: 1,
    borderColor: '#1f4d3d',
  },
  videoBtnPressed: { opacity: 0.85 },
  videoBtnIcon: { color: ACCENT, fontSize: 12, fontWeight: '800' },
  videoBtnText: { color: ACCENT, fontSize: 13, fontWeight: '700' },
  secondaryBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
  },
  secondaryBtnPressed: { opacity: 0.85 },
  secondaryBtnText: { color: '#e2e8f0', fontSize: 15, fontWeight: '700' },
});
