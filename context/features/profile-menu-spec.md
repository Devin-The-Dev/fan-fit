# Profile Menu Spec

## Overview

Redesign the Profile bottom sheet (`src/components/mainMenu/ProfileSheet.tsx`) to match `@context/screenshots/ProfileMenu.png`. The sheet adds name, units, height and weight inputs to the existing age and gender controls.

The **BMI** and **Target Heart Rate** panels in the screenshot are out of scope for this feature. Their slots in the layout are reserved (see [Reserved Slots](#reserved-slots)) so they can be added later without moving anything else.

## Entry Point

- The main menu `PROFILE` card ("Your profile · Female", `Edit ›`) opens the sheet. This already exists in `ProfileCard`.
- The sheet slides up over the dimmed main menu and covers roughly the bottom three quarters of the screen. It has rounded top corners and a 1px top border.

## Layout (top to bottom)

### 1. Header

- Title "Profile" on the left, bold.
- Close button (✕) on the right in muted text. Closes the sheet.

### 2. Name

- Field label "Name".
- Full-width text input with rounded corners, 1px border and placeholder "Your name".

### 3. Age (left column)

- Field label "Age".
- Stepper: `−` button, current value (e.g. `30`) in large bold text, `+` button.
- Square step buttons with a 1px border and accent-colored symbols, as in the current sheet.
- Keep the current 13–90 limits; the button at a limit is disabled.
- **Right column:** reserved slot for the Target Heart Rate panel.

### 4. Units

- Field label "Units".
- Two-option segmented toggle across the full width: **Metric** | **Imperial**.
- Selected option: solid accent fill with dark text. Unselected: outlined with muted text.
- Switching units converts the current height and weight values and updates their labels.

### 5. Height and Weight (left column)

- **Height:** label "Height (cm)" in metric and "Height (in)" in imperial, with a `−` / value / `+` stepper (e.g. `175`).
- **Weight:** label "Weight (kg)" in metric and "Weight (lb)" in imperial, with a `−` / value / `+` stepper (e.g. `70`).
- Same stepper style as Age.
- **Right column:** reserved slot for the BMI panel. It spans the height of both steppers.

### 6. Gender

- Field label "Gender".
- Pill-shaped chips: **Female** and **Male**.
- Selected chip: dark accent fill, accent border and accent text. Unselected: outlined with muted text.

### 7. Done Button

- Full-width button with solid accent fill, rounded corners and a bold dark "Done" label.
- Saves the profile and closes the sheet.

## Reserved Slots

Both slots sit to the right of the steppers in a two-column row. For now, render an empty `View` with a fixed width so the left column keeps the width and alignment shown in the screenshot. Leave the slots empty (no border or placeholder text).

| Slot              | Row                     | Later feature contents                                                   |
| ----------------- | ----------------------- | ------------------------------------------------------------------------ |
| Target Heart Rate | Age                     | Fat loss / Cardio / Muscle gain bpm ranges based on age                  |
| BMI               | Height + Weight         | BMI value, category (e.g. "Normal") and healthy weight range             |
| BMI disclaimer    | Below Height + Weight   | Small muted text: BMI is a rough estimate; consider a personal trainer   |

## Data Changes

- Add `name: string`, `heightCm: number`, `weightKg: number` and `units: 'metric' | 'imperial'` to `UserProfile` in `src/types.ts`, with defaults in `DEFAULT_PROFILE` (`''`, `175`, `70`, `'metric'`).
- Store height and weight in metric and convert only for display, so later features (BMI, workout scaling) use one unit.
- Gender stays the existing `Gender` type. The sheet shows Female and Male as in the screenshot.

## Styling

- Use theme tokens from `tailwind.config.js` / `src/theme.ts`. The screenshot's lime green stands in for the project's accent color; don't hard-code it.
- Convert `ProfileSheet` to NativeWind `className` as part of this work.

## Out of Scope

- BMI panel, Target Heart Rate panel and the BMI disclaimer text
- Persisting the profile between app launches

## References

- `@context/screenshots/ProfileMenu.png`
- `src/components/mainMenu/ProfileSheet.tsx` (current sheet)
- `src/components/mainMenu/ProfileCard.tsx` (entry point)
