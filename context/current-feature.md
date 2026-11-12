# Current Feature: Target Heart Rate

Add the Target Heart Rate panel to the Profile sheet, next to the Age stepper, as shown in `context/screenshots/ProfileMenu.png`.

## Status

In Progress

## Goals

- Add `src/lib/heartRate.ts` with a pure function that takes age and returns three zones in bpm, based on an estimated max heart rate of `220 − age`:
  - Fat loss: 50–69% of max
  - Cardio: 70–84% of max
  - Muscle gain: 85–100% of max
- Round each edge to a whole bpm. Age 30 (max 190) must show Fat loss 95–131, Cardio 133–160, Muscle gain 162–190, matching the screenshot.
- Add a `TargetHeartRatePanel` component in `src/components/mainMenu/` on NativeWind: bordered card with a "TARGET HEART RATE" label, then one row per zone with a colored dot, the zone name and the `low–high bpm` range.
- Put the panel in the slot reserved next to the Age stepper in `ProfileForm.tsx` (replacing the empty `h-[76px]` placeholder) and keep the Age row layout from the screenshot.
- Update the panel live as the Age stepper changes (13–90).
- Add theme tokens for the three dot colors (cyan, green, coral) to both `tailwind.config.js` and `src/theme.ts`; no hard-coded hex values in the component.
- `npx tsc --noEmit` passes, and the panel is checked in the iOS simulator at the min, default and max ages.

## Notes

- Reference: `context/screenshots/ProfileMenu.png` (panel top right, next to Age).
- The zone percentages were worked back from the screenshot numbers at age 30, so the bands don't overlap (131 → 133, 160 → 162).
- The panel only displays values; nothing new is stored in the profile, and age is already in `ProfileDetails`.
- The panel must fit at half the sheet width next to the stepper; check that "Muscle gain 162–190 bpm" doesn't wrap or get cut off on small screens.
- Like the BMI panel, it's a general estimate. Adding a disclaimer isn't in scope unless requested.

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
- 2026-11-11: Added the BMI panel to the Profile sheet (`src/lib/bmi.ts`, `BmiPanel`): live BMI to one decimal, category (Normal in the accent color, others muted) and healthy weight range in kg or lb, plus the BMI disclaimer below Height and Weight. Range edges are adjusted to agree with the category (69 in shows 125–168 lb, and 169 lb is Overweight), and BMI is calculated from the values shown in the steppers. Under 20, the panel shows only the BMI with "Adult ranges don't apply under 20." at the same size. Lowered the weight stepper minimum to 18 kg / 40 lb so every healthy range is reachable. Every stepper combination was checked in both unit systems. Tested in the iOS simulator.
- 2026-11-11: Set up the Postgres database on Neon with Drizzle ORM in a new `worker/` Cloudflare Worker package (Hono, `pg`). Added the schema for `users`, `workouts` and `exercise_cache`, with enums and gender as `female`, `male`, `unknown` (the app's `Gender` type was changed to match), and applied the `0000_init` migration. Created Hyperdrive config `fan-fit-db`, bound as `HYPERDRIVE`, and tested a `GET /health` route through it locally. Deploying and the app API client are on the back burner. Research saved in `context/research/drizzle.md`.
