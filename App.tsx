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
import {
  type InspirationOption,
  InspirationTypePicker,
} from './src/components/mainMenu/InspirationTypePicker';
import { type Option, OptionGroup } from './src/components/mainMenu/OptionGroup';
import { ProfileCard } from './src/components/mainMenu/ProfileCard';
import { ProfileSheet } from './src/components/mainMenu/ProfileSheet';
import { SectionLabel } from './src/components/mainMenu/SectionLabel';
import { RoutineCard } from './src/components/workout/RoutineCard';
import { generateWorkout } from './src/generateWorkout';
import { COLORS, RADIUS, SPACING } from './src/theme';
import type {
  ActivityLevel,
  Exercise,
  Gender,
  InspirationKind,
  UserProfile,
  WorkoutDuration,
  WorkoutRoutine,
} from './src/types';
import { DEFAULT_PROFILE } from './src/types';

interface ActiveVideo {
  title: string;
  videos: { name: string; videoId: string }[];
}

const KINDS: InspirationOption[] = [
  { key: 'sport', label: 'Sport', icon: '🏅' },
  { key: 'celebrity', label: 'Celebrity', icon: '⭐' },
  { key: 'character', label: 'Fictional character', icon: '🦸' },
];

const KIND_HINTS: Record<InspirationKind, string> = {
  sport: 'e.g. basketball, swimming, boxing',
  celebrity: 'e.g. actor, musician, public figure',
  character: 'e.g. superhero, anime lead, book hero',
};

const GENDERS: Option<Gender>[] = [
  { key: 'female', label: 'Female' },
  { key: 'male', label: 'Male' },
  { key: 'non_binary', label: 'Non-binary' },
  { key: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const ACTIVITY_LEVELS: Option<ActivityLevel>[] = [
  { key: 'sedentary', label: 'Sedentary' },
  { key: 'light', label: 'Light' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'active', label: 'Active' },
  { key: 'very_active', label: 'Very active' },
];

const WORKOUT_DURATIONS: Option<WorkoutDuration>[] = [
  { key: 30, label: '30 min' },
  { key: 45, label: '45 min' },
  { key: 60, label: '1 hour' },
];

function toActiveVideo(exercise: Exercise): ActiveVideo {
  return {
    title: exercise.name,
    videos: exercise.tutorialVideos.map((video) => ({ name: video.name, videoId: video.videoId })),
  };
}

function HomeBody() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [kind, setKind] = useState<InspirationKind>('sport');
  const [name, setName] = useState('');
  const [age, setAge] = useState(DEFAULT_PROFILE.age);
  const [gender, setGender] = useState<Gender>(DEFAULT_PROFILE.gender);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(DEFAULT_PROFILE.activityLevel);
  const [durationMinutes, setDurationMinutes] = useState<WorkoutDuration>(DEFAULT_PROFILE.durationMinutes);
  const [profileOpen, setProfileOpen] = useState(false);
  const [variation, setVariation] = useState(0);
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  const [routineStartY, setRoutineStartY] = useState<number | null>(null);
  const [pendingRoutineScroll, setPendingRoutineScroll] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);

  const profile = useMemo<UserProfile>(
    () => ({ age, gender, activityLevel, durationMinutes }),
    [age, gender, activityLevel, durationMinutes]
  );
  const genderLabel = GENDERS.find((g) => g.key === gender)?.label ?? '';

  const generate = () => {
    setPendingRoutineScroll(true);
    const next = variation + 1;
    setVariation(next);
    setRoutine(generateWorkout(kind, name, next, profile));
  };

  const onWatchTutorial = (exercise: Exercise) => {
    if (exercise.tutorialVideos.length > 0) {
      setActiveVideo(toActiveVideo(exercise));
    } else {
      Linking.openURL(exercise.videoUrl);
    }
  };

  useEffect(() => {
    if (!pendingRoutineScroll || !routine || routineStartY === null) return;

    scrollRef.current?.scrollTo({ y: Math.max(0, routineStartY - 8), animated: true });
    setPendingRoutineScroll(false);
  }, [pendingRoutineScroll, routine, routineStartY]);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>FanFit</Text>
          <Text style={styles.title}>Train like your icon.</Text>
          <Text style={styles.lede}>
            Pick a sport, a celebrity, or a fictional character. Sets and reps scale to you.
          </Text>
        </View>

        <View style={styles.section}>
          <SectionLabel>Profile</SectionLabel>
          <ProfileCard summary={`Your profile · ${genderLabel}, ${age}`} onEdit={() => setProfileOpen(true)} />
        </View>

        <View style={styles.section}>
          <SectionLabel>Workout session</SectionLabel>
          <SectionLabel variant="field">Activity level</SectionLabel>
          <OptionGroup options={ACTIVITY_LEVELS} value={activityLevel} onChange={setActivityLevel} />
          <View style={styles.fieldGap} />
          <SectionLabel variant="field">Workout length</SectionLabel>
          <OptionGroup
            options={WORKOUT_DURATIONS}
            value={durationMinutes}
            onChange={setDurationMinutes}
            variant="segment"
          />
        </View>

        <View style={styles.section}>
          <SectionLabel>Inspiration type</SectionLabel>
          <InspirationTypePicker options={KINDS} value={kind} onChange={setKind} />
        </View>

        <SectionLabel>Who or what inspires this session?</SectionLabel>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={KIND_HINTS[kind]}
          placeholderTextColor={COLORS.textSubtle}
          selectionColor={COLORS.accent}
          style={styles.input}
          autoCapitalize="words"
          autoCorrect
          returnKeyType="done"
          onSubmitEditing={generate}
        />

        {routine && (
          <RoutineCard
            routine={routine}
            onWatchTutorial={onWatchTutorial}
            onShuffle={generate}
            onLayoutY={setRoutineStartY}
          />
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          onPress={generate}
          accessibilityRole="button"
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
        >
          <Text style={styles.primaryBtnText}>Generate routine</Text>
        </Pressable>
      </View>

      <ProfileSheet
        visible={profileOpen}
        age={age}
        gender={gender}
        genderOptions={GENDERS}
        onChangeAge={setAge}
        onChangeGender={setGender}
        onClose={() => setProfileOpen(false)}
      />

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
      <SafeAreaView style={styles.safe} edges={['top']}>
        <HomeBody />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: SPACING.screenX, paddingTop: 8, paddingBottom: 32 },
  hero: { marginBottom: 32 },
  kicker: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { color: COLORS.text, fontSize: 32, fontWeight: '800', lineHeight: 38, marginBottom: 10 },
  lede: { color: COLORS.textMuted, fontSize: 17, lineHeight: 24 },
  section: { marginBottom: 28 },
  fieldGap: { height: 18 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 18,
    paddingVertical: 18,
    fontSize: 18,
    color: COLORS.text,
  },
  footer: {
    paddingHorizontal: SPACING.screenX,
    paddingTop: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  primaryBtnPressed: { backgroundColor: COLORS.accentPressed },
  primaryBtnText: { color: COLORS.textOnAccent, fontSize: 18, fontWeight: '800' },
});
