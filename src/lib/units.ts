import type { UnitSystem } from '../types';

const CM_PER_INCH = 2.54;
const LB_PER_KG = 2.20462;

export interface MeasurementRange {
  min: number;
  max: number;
}

export const HEIGHT_RANGE: Record<UnitSystem, MeasurementRange> = {
  metric: { min: 100, max: 250 },
  imperial: { min: 40, max: 98 },
};

export const WEIGHT_RANGE: Record<UnitSystem, MeasurementRange> = {
  metric: { min: 30, max: 250 },
  imperial: { min: 66, max: 551 },
};

export const HEIGHT_UNIT_LABEL: Record<UnitSystem, string> = { metric: 'cm', imperial: 'in' };
export const WEIGHT_UNIT_LABEL: Record<UnitSystem, string> = { metric: 'kg', imperial: 'lb' };

// Height and weight are stored in metric; these convert to and from the whole numbers shown in the steppers.
export function heightForDisplay(heightCm: number, units: UnitSystem): number {
  return Math.round(units === 'metric' ? heightCm : heightCm / CM_PER_INCH);
}

export function heightToCm(value: number, units: UnitSystem): number {
  return units === 'metric' ? value : value * CM_PER_INCH;
}

export function weightForDisplay(weightKg: number, units: UnitSystem): number {
  return Math.round(units === 'metric' ? weightKg : weightKg * LB_PER_KG);
}

export function weightToKg(value: number, units: UnitSystem): number {
  return units === 'metric' ? value : value / LB_PER_KG;
}

const UNIT_SYSTEMS: UnitSystem[] = ['metric', 'imperial'];

// Two values match when they show the same whole number in both unit systems, ignoring drift from converting back to metric.
export function isSameHeight(a: number, b: number): boolean {
  return UNIT_SYSTEMS.every((units) => heightForDisplay(a, units) === heightForDisplay(b, units));
}

export function isSameWeight(a: number, b: number): boolean {
  return UNIT_SYSTEMS.every((units) => weightForDisplay(a, units) === weightForDisplay(b, units));
}
