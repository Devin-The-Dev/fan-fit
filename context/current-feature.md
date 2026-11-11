# Current Feature
<!-- Feature name and short description -->

## Status

<!-- Not Started | In Progress | Completed -->

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

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
- 2026-11-07: Added NativeWind v4.2.7 (Tailwind CSS 3) on SDK 58: `babel.config.js`, `metro.config.js`, `tailwind.config.js` with theme tokens mirroring `src/theme.ts`, `global.css`, and type declarations. Converted `ProfileCard` to `className` as the pilot. NativeWind v5 RC was tried first but failed to compile Tailwind v4 output, so it's on the back burner. Research saved in `context/research/nativewind.md`.
- 2026-11-08: Converted the workout generation UI to NativeWind `className`: `SectionLabel`, `OptionGroup`, `InspirationTypePicker`, `RoutineCard`, and the generator sections, text input, footer and Generate button in `App.tsx`. Added a `hairline` border width to `tailwind.config.js`. The Profile section's `styles.section` is left on the back burner.
- 2026-11-10: Redesigned the Profile sheet to match `ProfileMenu.png`: added name, Metric/Imperial units, and height and weight steppers (stored in metric, converted for display in `src/lib/units.ts`), with empty slots reserved for the future BMI and Target Heart Rate panels. Split the sheet into `ProfileSheet`, `ProfileForm` and a reusable `Stepper`, all on NativeWind. Done saves the profile, and closing with unsaved changes asks to discard them. The sheet offers only Female and Male, and "Prefer not to say" is now labeled "Unknown". Tested in the iOS simulator.
- 2026-11-11: Added the BMI panel to the Profile sheet (`src/lib/bmi.ts`, `BmiPanel`): live BMI to one decimal, category (Normal in the accent color, others muted) and healthy weight range in kg or lb, plus the BMI disclaimer below Height and Weight. Range edges are adjusted to agree with the category (69 in shows 125–168 lb, and 169 lb is Overweight), and BMI is calculated from the values shown in the steppers. Under 20, the panel shows only the BMI with "Adult ranges don't apply under 20." at the same size. Lowered the weight stepper minimum to 18 kg / 40 lb so every healthy range is reachable. Every stepper combination was checked in both unit systems.
