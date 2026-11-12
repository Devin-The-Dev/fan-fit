import { Text, View } from 'react-native';
import { getHeartRateZones, type HeartRateZone, type HeartRateZoneKey } from '../../lib/heartRate';

interface Props {
  age: number;
}

// Full class names so Tailwind can find them when scanning the source.
const DOT_CLASSES: Record<HeartRateZoneKey, string> = {
  fatLoss: 'bg-zone-fat-loss',
  cardio: 'bg-zone-cardio',
  muscleGain: 'bg-zone-muscle-gain',
};

function formatRange({ minBpm, maxBpm }: HeartRateZone): string {
  return `${minBpm}–${maxBpm} bpm`;
}

interface ZoneRowProps {
  zone: HeartRateZone;
}

function ZoneRow({ zone }: ZoneRowProps) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View className={`w-1.5 h-1.5 rounded-full ${DOT_CLASSES[zone.key]}`} />
      <Text numberOfLines={1} adjustsFontSizeToFit className="flex-1 text-text text-[13px] font-semibold">
        {`${zone.label}  ${formatRange(zone)}`}
      </Text>
    </View>
  );
}

export function TargetHeartRatePanel({ age }: Props) {
  const zones = getHeartRateZones(age);
  const accessibilityLabel = `Target heart rate. ${zones.map((zone) => `${zone.label} ${formatRange(zone)}`).join('. ')}`;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      className="flex-1 gap-1 px-3 py-2.5 rounded-lg border border-border bg-surface"
    >
      <Text numberOfLines={1} adjustsFontSizeToFit className="mb-0.5 text-text-muted text-[11px] font-semibold tracking-[0.5px] uppercase">
        Target heart rate
      </Text>
      {zones.map((zone) => (
        <ZoneRow key={zone.key} zone={zone} />
      ))}
    </View>
  );
}
