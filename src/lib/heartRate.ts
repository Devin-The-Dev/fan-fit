export type HeartRateZoneKey = 'fatLoss' | 'cardio' | 'muscleGain';

export interface HeartRateZone {
  key: HeartRateZoneKey;
  label: string;
  minBpm: number;
  maxBpm: number;
}

interface ZoneDefinition {
  key: HeartRateZoneKey;
  label: string;
  minPercent: number;
  maxPercent: number;
}

// Percentages of estimated max heart rate. The bands don't overlap once rounded (age 30: 95–131, 133–160, 162–190).
const ZONE_DEFINITIONS: ZoneDefinition[] = [
  { key: 'fatLoss', label: 'Fat loss', minPercent: 0.5, maxPercent: 0.69 },
  { key: 'cardio', label: 'Cardio', minPercent: 0.7, maxPercent: 0.84 },
  { key: 'muscleGain', label: 'Muscle gain', minPercent: 0.85, maxPercent: 1 },
];

// The common 220 − age estimate; individual max heart rates vary.
function estimateMaxHeartRate(age: number): number {
  return 220 - age;
}

export function getHeartRateZones(age: number): HeartRateZone[] {
  const maxHeartRate = estimateMaxHeartRate(age);
  return ZONE_DEFINITIONS.map(({ key, label, minPercent, maxPercent }) => ({
    key,
    label,
    minBpm: Math.round(maxHeartRate * minPercent),
    maxBpm: Math.round(maxHeartRate * maxPercent),
  }));
}
