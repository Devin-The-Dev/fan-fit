import { Text, TextInput, View } from 'react-native';
import {
  HEIGHT_RANGE,
  HEIGHT_UNIT_LABEL,
  heightForDisplay,
  heightToCm,
  WEIGHT_RANGE,
  WEIGHT_UNIT_LABEL,
  weightForDisplay,
  weightToKg,
} from '../../lib/units';
import { COLORS } from '../../theme';
import type { Gender, ProfileDetails, UnitSystem } from '../../types';
import { BmiPanel } from './BmiPanel';
import { type Option, OptionGroup } from './OptionGroup';
import { SectionLabel } from './SectionLabel';
import { Stepper } from './Stepper';

const MIN_AGE = 13;
const MAX_AGE = 90;

const BMI_DISCLAIMER =
  "BMI is a rough estimate and doesn't account for muscle mass, bone density, or body composition. If this number doesn't feel right for you, consider checking in with a personal trainer.";

const UNIT_OPTIONS: Option<UnitSystem>[] = [
  { key: 'metric', label: 'Metric' },
  { key: 'imperial', label: 'Imperial' },
];

interface Props {
  draft: ProfileDetails;
  genderOptions: Option<Gender>[];
  onChange: (patch: Partial<ProfileDetails>) => void;
}

function BodyMeasurements({ draft, onChange }: Omit<Props, 'genderOptions'>) {
  const { units } = draft;

  return (
    <View className="mb-5">
      <View className="flex-row justify-between gap-3 mb-3">
        <View>
          <SectionLabel variant="field">{`Height (${HEIGHT_UNIT_LABEL[units]})`}</SectionLabel>
          <Stepper
            label="height"
            value={heightForDisplay(draft.heightCm, units)}
            unit={HEIGHT_UNIT_LABEL[units]}
            {...HEIGHT_RANGE[units]}
            onChange={(value) => onChange({ heightCm: heightToCm(value, units) })}
          />
          <View className="h-3" />
          <SectionLabel variant="field">{`Weight (${WEIGHT_UNIT_LABEL[units]})`}</SectionLabel>
          <Stepper
            label="weight"
            value={weightForDisplay(draft.weightKg, units)}
            unit={WEIGHT_UNIT_LABEL[units]}
            {...WEIGHT_RANGE[units]}
            onChange={(value) => onChange({ weightKg: weightToKg(value, units) })}
          />
        </View>
        <BmiPanel heightCm={draft.heightCm} weightKg={draft.weightKg} age={draft.age} units={units} />
      </View>
      <Text className="text-text-muted text-xs leading-[18px]">{BMI_DISCLAIMER}</Text>
    </View>
  );
}

export function ProfileForm({ draft, genderOptions, onChange }: Props) {
  return (
    <View>
      <SectionLabel variant="field">Name</SectionLabel>
      <TextInput
        value={draft.name}
        onChangeText={(name) => onChange({ name })}
        placeholder="Your name"
        placeholderTextColor={COLORS.textSubtle}
        selectionColor={COLORS.accent}
        className="mb-5 px-4 py-3.5 rounded-md border border-border bg-surface text-text text-[17px]"
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="done"
      />

      <SectionLabel variant="field">Age</SectionLabel>
      <View className="flex-row items-center gap-2 mb-4">
        <View className="flex-1">
          <Stepper label="age" value={draft.age} min={MIN_AGE} max={MAX_AGE} onChange={(age) => onChange({ age })} />
        </View>
        {/* Reserved for the Target Heart Rate panel */}
        <View className="flex-1 h-[76px]" />
      </View>

      <SectionLabel variant="field">Units</SectionLabel>
      <View className="mb-5">
        <OptionGroup options={UNIT_OPTIONS} value={draft.units} onChange={(units) => onChange({ units })} variant="segment" />
      </View>

      <BodyMeasurements draft={draft} onChange={onChange} />

      <SectionLabel variant="field">Gender</SectionLabel>
      <OptionGroup options={genderOptions} value={draft.gender} onChange={(gender) => onChange({ gender })} wrap />
    </View>
  );
}
