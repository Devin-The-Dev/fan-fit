// Mirrors src/theme.ts. Keep both in sync until every component uses className.
const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0B0D0C',
        surface: '#151917',
        raised: '#1F3321',
        'selected-surface': '#15361A',
        accent: '#009C15',
        'accent-pressed': '#156920',
        secondary: '#156920',
        border: '#29332A',
        text: '#F5F6F5',
        'text-muted': '#A3A8A5',
        'text-subtle': '#7A807C',
        'text-on-accent': '#06140A',
        overlay: 'rgba(0, 0, 0, 0.6)',
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '18px',
      },
      spacing: {
        'screen-x': '20px',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [],
};
