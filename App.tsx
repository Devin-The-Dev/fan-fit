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
import { COLORS, SPACING } from './src/theme';
import type {
  ActivityLevel,
  Exercise,
  Gender,
  InspirationKind,
  ProfileDetails,
  UserProfile,
  WorkoutDuration,
  WorkoutRoutine,
} from './src/types';
import { DEFAULT_PROFILE, DEFAULT_PROFILE_DETAILS } from './src/types';

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
  { key: 'unknown', label: 'Unknown' },
];

const PROFILE_SHEET_GENDERS = GENDERS.filter((option) => option.key === 'female' || option.key === 'male');

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
  const [details, setDetails] = useState<ProfileDetails>(DEFAULT_PROFILE_DETAILS);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(DEFAULT_PROFILE.activityLevel);
  const [durationMinutes, setDurationMinutes] = useState<WorkoutDuration>(DEFAULT_PROFILE.durationMinutes);
  const [profileOpen, setProfileOpen] = useState(false);
  const [variation, setVariation] = useState(0);
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  const [routineStartY, setRoutineStartY] = useState<number | null>(null);
  const [pendingRoutineScroll, setPendingRoutineScroll] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);

  const profile = useMemo<UserProfile>(
    () => ({ ...details, activityLevel, durationMinutes }),
    [details, activityLevel, durationMinutes]
  );
  const genderLabel = GENDERS.find((g) => g.key === details.gender)?.label ?? '';

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
          <ProfileCard summary={`${details.name.trim() || 'Your profile'} · ${genderLabel}, ${details.age}`} onEdit={() => setProfileOpen(true)} />
        </View>

        <View className="mb-7">
          <SectionLabel>Workout session</SectionLabel>
          <SectionLabel variant="field">Activity level</SectionLabel>
          <OptionGroup options={ACTIVITY_LEVELS} value={activityLevel} onChange={setActivityLevel} />
          <View className="h-[18px]" />
          <SectionLabel variant="field">Workout length</SectionLabel>
          <OptionGroup
            options={WORKOUT_DURATIONS}
            value={durationMinutes}
            onChange={setDurationMinutes}
            variant="segment"
          />
        </View>

        <View className="mb-7">
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
          className="p-[18px] rounded-lg border border-border bg-surface text-text text-[18px]"
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

      <View
        className="px-screen-x pt-3 bg-background border-t-hairline border-border"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Pressable
          onPress={generate}
          accessibilityRole="button"
          className="py-[18px] items-center rounded-lg bg-accent active:bg-accent-pressed"
        >
          <Text className="text-text-on-accent text-[18px] font-extrabold">Generate routine</Text>
        </Pressable>
      </View>

      <ProfileSheet
        visible={profileOpen}
        details={details}
        genderOptions={PROFILE_SHEET_GENDERS}
        onSave={setDetails}
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
});
