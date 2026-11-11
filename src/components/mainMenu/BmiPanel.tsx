import { Text, View } from 'react-native';
import {
  ADULT_BMI_MIN_AGE,
  type BmiCategory,
  calculateBmi,
  getBmiCategory,
  getHealthyWeightRange,
} from '../../lib/bmi';
import { heightForDisplay, heightToCm, WEIGHT_UNIT_LABEL, weightForDisplay, weightToKg } from '../../lib/units';
import type { UnitSystem } from '../../types';

interface Props {
  heightCm: number;
  weightKg: number;
  age: number;
  units: UnitSystem;
}

const SMALL_LABEL = 'text-text-muted text-[11px] font-semibold tracking-[0.5px] uppercase text-center';

function formatHealthyRange(heightCm: number, units: UnitSystem): string {
  const { min, max } = getHealthyWeightRange(heightCm, units);
  return `${min}–${max} ${WEIGHT_UNIT_LABEL[units]}`;
}

interface AdultDetailsProps {
  category: BmiCategory;
  healthyRange: string;
}

function AdultDetails({ category, healthyRange }: AdultDetailsProps) {
  return (
    <>
      <Text className={`text-[15px] font-bold ${category === 'Normal' ? 'text-accent' : 'text-text-muted'}`}>
        {category}
      </Text>
      <View className="self-stretch h-px my-2 bg-border" />
      <Text className={SMALL_LABEL}>Healthy range</Text>
      <Text className="mt-0.5 text-text text-[15px] font-bold">{healthyRange}</Text>
    </>
  );
}

export function BmiPanel({ heightCm, weightKg, age, units }: Props) {
  // Calculate from the whole numbers shown in the steppers, so the BMI always matches what the user sees.
  const shownHeightCm = heightToCm(heightForDisplay(heightCm, units), units);
  const shownWeightKg = weightToKg(weightForDisplay(weightKg, units), units);

  const bmi = calculateBmi(shownHeightCm, shownWeightKg).toFixed(1);
  const isAdult = age >= ADULT_BMI_MIN_AGE;
  const category = getBmiCategory(Number(bmi));
  const healthyRange = formatHealthyRange(shownHeightCm, units);

  const accessibilityLabel = isAdult
    ? `BMI ${bmi}, ${category}. Healthy range ${healthyRange}`
    : `BMI ${bmi}. Adult ranges don't apply under ${ADULT_BMI_MIN_AGE}`;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      className="w-[128px] items-center justify-center px-2 py-3 rounded-lg border border-border bg-surface"
    >
      <Text className={SMALL_LABEL}>BMI</Text>
      <Text className="text-text text-[30px] font-bold">{bmi}</Text>
      {/* Under 20 the adult details stay laid out but invisible, with the note on top, so the panel never changes size. */}
      <View className="self-stretch">
        <View className={`items-center ${isAdult ? '' : 'opacity-0'}`}>
          <AdultDetails category={category} healthyRange={healthyRange} />
        </View>
        {!isAdult && (
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-center text-text-muted text-xs">
              {`Adult ranges don't apply under ${ADULT_BMI_MIN_AGE}.`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
