# Current Feature: Profile Menu

Redesign the Profile bottom sheet (`src/components/mainMenu/ProfileSheet.tsx`) to match `context/screenshots/ProfileMenu.png`, adding name, units, height and weight to the existing age and gender controls. Spec: `context/features/profile-menu-spec.md`.

## Status

In Progress

## Goals

Use `context/screenshots/ProfileMenu.png` as the visual reference for layout, spacing and sizing.

- The sheet slides up over the dimmed main menu from the `PROFILE` card's `Edit ›`. The menu header and profile card stay visible above it, and the sheet has rounded top corners and a 1px top border
- Header shows a bold "Profile" title on the left and a muted ✕ on the right that closes the sheet
- Name field: muted "Name" label, then a full-width rounded input with a 1px border and the placeholder "Your name"
- Age row: `−` / large bold value / `+` stepper on the left with square, bordered, accent-symbol buttons. Keep the 13–90 limits and disable the button at a limit
- Units: two separate equal-width rounded buttons, Metric and Imperial, with a gap between them. The selected button has a solid accent fill and dark bold text; the other is outlined with muted text
- Switching units converts the displayed height and weight and changes the labels between "Height (cm)" / "Height (in)" and "Weight (kg)" / "Weight (lb)"
- Height and Weight steppers are stacked in the left column, in the same style as Age
- Gender: pill chips for Female and Male. The selected chip has a dark accent fill, accent border and accent text; the other is outlined with muted text
- Full-width "Done" button with solid accent fill, rounded corners and a bold dark label, which saves the profile and closes the sheet
- Closing the sheet with unsaved changes (✕, backdrop tap or Android back) shows a "Discard changes?" alert with Keep editing and Discard options. Without changes, the sheet closes straight away
- Reserved empty, fixed-width slots in the right column next to Age (Target Heart Rate) and spanning Height + Weight (BMI), sized so the left column matches the screenshot
- `UserProfile` gains `name`, `heightCm`, `weightKg` and `units`, with `DEFAULT_PROFILE` values `''`, `175`, `70` and `'metric'`
- `ProfileSheet` is converted to NativeWind `className` using only theme tokens

## Notes

- The screenshot's lime green stands in for the project accent color; don't hard-code it.
- The BMI panel, Target Heart Rate panel and the BMI disclaimer paragraph shown in the screenshot are out of scope. Their slots stay empty, with no border or placeholder text.
- The spec's slot table lists the BMI disclaimer below Height + Weight, but the Reserved Slots section only reserves the two panel slots. No gap is reserved for the disclaimer; adding it later will push Gender and Done down.
- Store height and weight in metric only and convert for display, so later features (BMI, workout scaling) work in one unit.
- `Gender` keeps its existing type; the sheet only shows Female and Male.
- Persisting the profile between launches is out of scope.
- Theme tokens live in both `tailwind.config.js` and `src/theme.ts`; keep them in sync if any are added.

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
