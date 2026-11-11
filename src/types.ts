export type InspirationKind = 'sport' | 'celebrity' | 'character';

export type Gender = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type WorkoutDuration = 30 | 45 | 60;

export type UnitSystem = 'metric' | 'imperial';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  units: UnitSystem;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  durationMinutes: WorkoutDuration;
}

export type ProfileDetails = Pick<UserProfile, 'name' | 'age' | 'gender' | 'units' | 'heightCm' | 'weightKg'>;

export const DEFAULT_PROFILE_DETAILS: ProfileDetails = {
  name: '',
  age: 30,
  gender: 'prefer_not_to_say',
  units: 'metric',
  heightCm: 175,
  weightKg: 70,
};

export const DEFAULT_PROFILE: UserProfile = {
  ...DEFAULT_PROFILE_DETAILS,
  activityLevel: 'moderate',
  durationMinutes: 45,
};

export interface ExerciseTemplate {
  name: string;
  detail: string;
}

export interface ExerciseTutorialVideo {
  name: string;
  videoId: string;
  videoUrl: string;
}

export interface Exercise extends ExerciseTemplate {
  videoUrl: string;
  videoId: string | null;
  tutorialVideos: ExerciseTutorialVideo[];
}

export interface WorkoutSection {
  title: string;
  exercises: Exercise[];
}

export interface WorkoutRoutine {
  headline: string;
  subtitle: string;
  focusLabel: string;
  tailoringLabel: string;
  estimatedMinutes: number;
  sections: WorkoutSection[];
}
