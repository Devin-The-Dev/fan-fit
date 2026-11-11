import type { UserProfile, WorkoutDuration } from './types';

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function scaleCount(n: number, scale: number, min = 1): number {
  return Math.max(min, Math.round(n * scale));
}

/** Combined multiplier for sets, reps, and rounds (0.55–1.25). */
export function getVolumeScale(profile: UserProfile): number {
  const age = clamp(profile.age, 13, 90);

  let ageFactor = 1;
  if (age < 18) ageFactor = 0.82;
  else if (age <= 29) ageFactor = 1;
  else if (age <= 39) ageFactor = 0.98;
  else if (age <= 49) ageFactor = 0.9;
  else if (age <= 59) ageFactor = 0.82;
  else if (age <= 69) ageFactor = 0.74;
  else ageFactor = 0.66;

  const activityFactor: Record<UserProfile['activityLevel'], number> = {
    sedentary: 0.62,
    light: 0.78,
    moderate: 1,
    active: 1.12,
    very_active: 1.22,
  };

  return clamp(ageFactor * activityFactor[profile.activityLevel], 0.55, 1.25);
}

const DURATION_VOLUME: Record<WorkoutDuration, number> = {
  30: 0.72,
  45: 1,
  60: 1.28,
};

export function getDurationVolumeFactor(minutes: WorkoutDuration): number {
  return DURATION_VOLUME[minutes];
}

export interface DurationPlan {
  warmCount: number;
  mainCount: number;
  conditioningCount: number;
  coolCount: number;
}

export function getDurationPlan(minutes: WorkoutDuration): DurationPlan {
  switch (minutes) {
    case 30:
      return { warmCount: 2, mainCount: 3, conditioningCount: 1, coolCount: 2 };
    case 60:
      return { warmCount: 3, mainCount: 5, conditioningCount: 2, coolCount: 3 };
    default:
      return { warmCount: 3, mainCount: 4, conditioningCount: 2, coolCount: 3 };
  }
}

const DURATION_LABEL: Record<WorkoutDuration, string> = {
  30: '30 min',
  45: '45 min',
  60: '1 hour',
};

export function scaleExerciseDetail(detail: string, scale: number): string {
  let d = detail;

  d = d.replace(/(\d+)\s*×\s*(\d+)(?=\s*min)/gi, (_, a, b) => {
    const sets = scaleCount(Number(a), scale);
    const mins = scaleCount(Number(b), Math.pow(scale, 0.35), 1);
    return `${sets} × ${mins} min`;
  });

  d = d.replace(/(\d+)\s*×\s*(\d+)/g, (_, a, b) => {
    return `${scaleCount(Number(a), scale)} × ${scaleCount(Number(b), scale)}`;
  });

  d = d.replace(/(\d+)\s*rounds?/gi, (_, n) => `${scaleCount(Number(n), scale)} rounds`);

  d = d.replace(/(\d+)\s*reps?/gi, (_, n) => `${scaleCount(Number(n), scale)} reps`);

  d = d.replace(/(\d+)\s*each side/gi, (_, n) => `${scaleCount(Number(n), scale)} each side`);

  d = d.replace(/(\d+)\s*each (direction|leg)/gi, (_, n, unit) =>
    `${scaleCount(Number(n), scale)} each ${unit}`
  );

  d = d.replace(/\b(\d+)\s*min\b/gi, (_, n) => `${scaleCount(Number(n), Math.pow(scale, 0.4), 1)} min`);

  d = d.replace(/(\d+)s\b/g, (_, n) => `${scaleCount(Number(n), Math.pow(scale, 0.45), 15)}s`);

  d = d.replace(/AMRAP:\s*(\d+)/gi, (_, n) => `AMRAP: ${scaleCount(Number(n), scale)}`);

  d = d.replace(/,\s*(\d+)\s+(burpees|mountain climbers|jump lunges)/gi, (_, n, move) =>
    `, ${scaleCount(Number(n), scale)} ${move}`
  );

  return d;
}

const GENDER_LABEL: Record<UserProfile['gender'], string> = {
  female: 'woman',
  male: 'man',
  unknown: 'your profile',
};

const ACTIVITY_LABEL: Record<UserProfile['activityLevel'], string> = {
  sedentary: 'sedentary',
  light: 'lightly active',
  moderate: 'moderately active',
  active: 'active',
  very_active: 'very active',
};

export function buildTailoringLabel(profile: UserProfile, scale: number): string {
  const intensity =
    scale < 0.75 ? 'gentler volume' : scale < 0.95 ? 'moderate volume' : scale > 1.1 ? 'higher volume' : 'balanced volume';

  const genderPart =
    profile.gender === 'unknown'
      ? ''
      : ` · ${GENDER_LABEL[profile.gender]}-informed pacing`;

  return `${DURATION_LABEL[profile.durationMinutes]} session · Age ${profile.age} · ${ACTIVITY_LABEL[profile.activityLevel]}${genderPart} · ${intensity}`;
}
