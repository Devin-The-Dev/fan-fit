// tailwind.config.js mirrors these values as Tailwind theme tokens. Keep both in sync until the full NativeWind migration.
export const PALETTE = {
  PRIMARY_ACCENT_GREEN: '#009C15',
  SECONDARY_GREEN: '#156920',
  DEEP_FOREST_ACCENT: '#15361A',
  DARK_CHARCOAL_CONTAINER: '#1F3321',
  DEEP_BACKGROUND_CHARCOAL: '#29332A',
} as const;

export const COLORS = {
  background: '#0B0D0C',
  surface: '#151917',
  raised: PALETTE.DARK_CHARCOAL_CONTAINER,
  selectedSurface: PALETTE.DEEP_FOREST_ACCENT,
  accent: PALETTE.PRIMARY_ACCENT_GREEN,
  accentPressed: PALETTE.SECONDARY_GREEN,
  secondary: PALETTE.SECONDARY_GREEN,
  border: PALETTE.DEEP_BACKGROUND_CHARCOAL,
  text: '#F5F6F5',
  textMuted: '#A3A8A5',
  textSubtle: '#7A807C',
  textOnAccent: '#06140A',
  overlay: 'rgba(0, 0, 0, 0.6)',
  black: '#000000',
  zoneFatLoss: '#22C3D6',
  zoneCardio: '#6BBF59',
  zoneMuscleGain: '#F07A6A',
} as const;

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 18,
  pill: 999,
} as const;

export const SPACING = {
  screenX: 20,
} as const;
