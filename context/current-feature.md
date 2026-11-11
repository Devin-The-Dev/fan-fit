# Current Feature: BMI Calculator

Fill the reserved BMI slot in the Profile sheet with a live BMI panel and add the BMI disclaimer below the Height and Weight steppers. Spec: `context/features/bmi-calculator-spec.md`.

## Status

In Progress

## Goals

Use `context/screenshots/ProfileMenu.png` as the visual reference for the panel and disclaimer.

- A BMI panel replaces the empty slot to the right of the Height and Weight steppers, spanning both steppers at the slot's current width so the steppers don't move
- The panel is a rounded card with a 1px border and a slightly raised background, with centered text: a small muted uppercase "BMI" label, the BMI to one decimal in large bold text, the category in bold, a 1px divider, a small muted uppercase "Healthy range" label, and the range in bold
- BMI is `weight (kg) / height (m)²`, rounded to one decimal, calculated from the whole-number height and weight shown in the steppers (converted to metric) so it always matches what the user sees. It updates live from the sheet's draft as the steppers change
- The category comes from the rounded BMI: below 18.5 Underweight, 18.5–24.9 Normal, 25.0–29.9 Overweight, 30.0 and up Obese. Normal uses the accent color, and the others use muted text
- The healthy range is the lightest to heaviest whole-number weight in the selected unit (kg in Metric, lb in Imperial) that shows a Normal BMI. It starts from `18.5 × height²` and `24.9 × height²` (height in meters), and each end is adjusted until it agrees with the category, so the first weight outside the range always changes the category. 70 kg at 175 cm shows BMI 22.9, Normal, 57–76 kg (125–168 lb); at 69 in the range is 125–168 lb, and 169 lb shows Overweight
- The weight stepper minimum is 18 kg / 40 lb, so the healthy range for every allowed height (shortest: 100 cm / 40 in) can be reached
- Under age 20, the panel shows only the label and BMI value, with the muted note "Adult ranges don't apply under 20." in place of the category, divider and range. The panel keeps the same size
- The disclaimer sits full width below the Height + Weight row and above Gender, in small muted text, for all ages: "BMI is a rough estimate and doesn't account for muscle mass, bone density, or body composition. If this number doesn't feel right for you, consider checking in with a personal trainer."
- Calculations live in `src/lib/bmi.ts` as pure functions, and the panel is a new `src/components/mainMenu/BmiPanel.tsx` that takes `heightCm`, `weightKg`, `age` and `units`
- NativeWind `className` with existing theme tokens only

## Notes

- The screenshot's lime green stands in for the project accent color; don't hard-code it.
- Height and weight are already stored in metric. Reuse `weightForDisplay` and `WEIGHT_UNIT_LABEL` from `src/lib/units.ts` for the range in kg or lb.
- BMI isn't saved to the profile; it's always calculated from height and weight.
- Out of scope: the Target Heart Rate panel (its slot next to Age stays empty), using BMI in workout generation or volume scaling, and growth percentile charts for users under 20.
- Adding the disclaimer pushes Gender and Done down, as expected from the Profile Menu feature.

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
