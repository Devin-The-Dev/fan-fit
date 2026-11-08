# Current Feature: NativeWind v4 Setup + Pilot

Add NativeWind (Tailwind for React Native) alongside `StyleSheet`, mirror the theme tokens, and convert one component as a pilot.

## Status

In Progress

## Goals

- Install NativeWind 4.2.7, react-native-css-interop 0.2.7, Reanimated 4 + Worklets, Tailwind CSS 3.4.17 and babel-preset-expo (pinned versions)
- Add `babel.config.js` (`jsxImportSource: 'nativewind'` + `nativewind/babel`), `metro.config.js` (`withNativeWind`), `tailwind.config.js`, `global.css`, `nativewind-env.d.ts` and `global-css.d.ts`
- Import `global.css` from `index.ts`
- Mirror the `src/theme.ts` colors, radii and spacing in `tailwind.config.js`
- Convert `src/components/mainMenu/ProfileCard.tsx` to `className` as the pilot; all other components stay on `StyleSheet`
- Update `coding-standards.md`, `back-burner.md` and `CLAUDE.md` to reflect NativeWind
- Verify: `npx tsc --noEmit`, `npx expo export --platform ios`, ProfileCard looks unchanged on the iOS simulator

## Notes

- Full research: `context/research/nativewind.md`
- Tried v5.0.0-rc.1 first: its CSS compiler (react-native-css) fails on Tailwind v4 output in this setup (lightningcss "failed to deserialize" errors), on both Node 25 and Node 24
- v4.2.7 works on SDK 58 once `babel-preset-expo` and `react-native-css-interop` are installed as direct dependencies; type-check and iOS bundle pass
- Downgrading to SDK 57 isn't needed (tested in a scratch copy; same Babel fix was the real issue)
- `src/theme.ts` stays; it and `tailwind.config.js` must stay in sync until the full migration
- Checked on the iOS simulator: ProfileCard looks a little different from the `StyleSheet` version. Accepted as is, since the profile layout is getting redesigned later.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-05-05: Created the InspireFit Expo app with an inspiration-based workout generator (`App.tsx`, `src/generateWorkout.ts`, `src/types.ts`).
- 2026-05-05: Added project `README.md`.
- 2026-05-16: Added profile-based workout scaling (`src/scaleVolume.ts`) and in-app exercise tutorials (`src/exerciseVideos.ts`, `src/components/ExerciseVideoPlayer.tsx`).
- 2026-06-25: Added compound exercise tutorial support (one video per sub-move for tri-sets, circuits and finishers).
- 2026-06-25: Auto-scroll to the routine when shuffling a variation.
- 2026-07-01: Added the `context/` directory with the `current-feature.md` tracking file.
- 2026-08-17: Added `context/features/main-menu-spec.md` and reference screenshots (MainMenu, ProfileMenu, WorkoutPage, WorkoutPageCollapsed) for the main menu redesign; pushed to `cursor/inspire-fit-workout-app`.
- 2026-10-26: Renamed the project from InspireFit to fan-fit (`App.tsx`, `README.md`, `app.json`, `package.json`) on the `fan-fit` branch.
- 2026-10-26: Added `context/project-spec.md` with product requirements and target architecture.
- 2026-10-28: Added `CLAUDE.md` and context docs (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `back-burner.md`) plus the color theme reference `context/screenshots/AdobeColor-My Color Theme.jpeg`.
- 2026-10-29: Upgraded to Expo SDK 58 (React Native 0.88, React 19.3, TypeScript 6); pushed to `fan-fit`.
- 2026-11-05: Implemented the main menu redesign on `feature/main-menu-redesign`: added `src/theme.ts` with all 5 palette colors, new `src/components/mainMenu/` components (profile card, profile sheet, option groups, inspiration type cards), extracted `RoutineCard`, pinned the Generate button, and moved the video player to theme colors. Type-check and iOS bundle pass; not yet tested on a device.
- 2026-11-05: Switched the background and cards to neutral near-black to remove the green tint; palette colors now used for accents, selected fills, pressed states and borders. Removed the color theme item from `context/back-burner.md`.
