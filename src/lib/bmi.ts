import type { UnitSystem } from '../types';
import { weightForDisplay, weightToKg } from './units';

export type BmiCategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export interface WeightRange {
  min: number;
  max: number;
}

// Adult BMI categories don't apply under this age; teenagers are assessed with growth percentiles instead.
export const ADULT_BMI_MIN_AGE = 20;

const HEALTHY_BMI_MIN = 18.5;
const HEALTHY_BMI_MAX = 24.9;
const OVERWEIGHT_BMI_MIN = 25;
const OBESE_BMI_MIN = 30;

function heightInMetersSquared(heightCm: number): number {
  const meters = heightCm / 100;
  return meters * meters;
}

// Rounded to one decimal so the category is always based on the number shown.
export function calculateBmi(heightCm: number, weightKg: number): number {
  return Math.round((weightKg / heightInMetersSquared(heightCm)) * 10) / 10;
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < HEALTHY_BMI_MIN) return 'Underweight';
  if (bmi < OVERWEIGHT_BMI_MIN) return 'Normal';
  if (bmi < OBESE_BMI_MIN) return 'Overweight';
  return 'Obese';
}

// The lightest and heaviest whole-number weights (in the selected unit) that show a Normal BMI.
// Rounding the 18.5 and 24.9 boundaries alone can land one step outside Normal (e.g. 169 lb at 69 in is BMI 25.0),
// so each edge is nudged until it agrees with getBmiCategory.
export function getHealthyWeightRange(heightCm: number, units: UnitSystem): WeightRange {
  const isNormalAt = (weight: number) =>
    getBmiCategory(calculateBmi(heightCm, weightToKg(weight, units))) === 'Normal';
  const metersSquared = heightInMetersSquared(heightCm);

  let min = weightForDisplay(HEALTHY_BMI_MIN * metersSquared, units);
  while (!isNormalAt(min)) min += 1;
  while (isNormalAt(min - 1)) min -= 1;

  let max = weightForDisplay(HEALTHY_BMI_MAX * metersSquared, units);
  while (!isNormalAt(max)) max -= 1;
  while (isNormalAt(max + 1)) max += 1;

  return { min, max };
}
