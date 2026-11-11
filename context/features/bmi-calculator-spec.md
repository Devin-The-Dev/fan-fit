# BMI Calculator Spec

## Overview

Fill the reserved BMI slot in the Profile sheet (`src/components/mainMenu/ProfileForm.tsx`) with a BMI panel that matches `@context/screenshots/ProfileMenu.png`, and add the BMI disclaimer below the Height and Weight steppers.

The panel calculates from the height and weight being edited in the sheet, so it updates as the steppers change, before the user taps Done.

## Location

- The panel replaces the empty fixed-width `View` to the right of the Height and Weight steppers. It spans the height of both steppers, as in the screenshot.
- The disclaimer goes directly below the Height + Weight row, full width, above the Gender field.
- The Target Heart Rate slot next to Age stays empty.

## BMI Panel Layout (top to bottom)

The panel is a rounded card with a 1px border and a slightly raised background, with all text centered.

### 1. Label

- "BMI" in small, muted, uppercase text.

### 2. Value

- BMI to one decimal place (e.g. `22.9`) in large bold text.

### 3. Category

- Category name in bold text below the value (e.g. "Normal").
- "Normal" uses the accent color. Underweight, Overweight and Obese use muted text.

### 4. Divider

- A 1px horizontal line across the panel's inner width.

### 5. Healthy Range

- "Healthy range" label in small, muted, uppercase text.
- Weight range in bold text (e.g. `57–76 kg`), shown in the selected unit: kg in Metric, lb in Imperial.

## Calculations

Height and weight are stored in metric (`heightCm`, `weightKg` on `UserProfile`), so all calculations use metric. The panel first converts the whole-number height and weight shown in the steppers back to metric, so the BMI always matches what the user sees, even after switching units.

- **BMI:** `weight (kg) / height (m)²`, rounded to one decimal place for display.
- **Category:** based on the rounded BMI, so the category always matches the number shown.

| BMI         | Category    | Color        |
| ----------- | ----------- | ------------ |
| Below 18.5  | Underweight | Muted text   |
| 18.5–24.9   | Normal      | Accent       |
| 25.0–29.9   | Overweight  | Muted text   |
| 30.0 and up | Obese       | Muted text   |

- **Healthy range:** the lightest to heaviest whole-number weight in the selected unit that shows a Normal BMI. Start from `18.5 × height²` and `24.9 × height²` (height in meters), rounded to the selected unit, then adjust each end until it agrees with the category. Plain rounding isn't enough: at 69 in, `24.9 × height²` is 168.6 lb, which rounds to 169, but 169 lb is BMI 25.0 (Overweight).
- **Weight stepper minimum:** 18 kg / 40 lb, below the lowest healthy weight for the shortest allowed height (19 kg / 42 lb at 100 cm / 40 in), so every healthy range can be reached.

Examples:
- 70 kg at 175 cm → BMI 22.9, Normal, healthy range 57–76 kg (125–168 lb), matching the screenshot.
- 69 in → healthy range 125–168 lb; 168 lb is BMI 24.8 (Normal) and 169 lb is BMI 25.0 (Overweight).

## Users Under 20

Adult BMI categories don't apply to teenagers, who are assessed with growth percentiles.

- When age is under 20, show the label and BMI value only.
- Replace the category, divider and healthy range with short muted text: "Adult ranges don't apply under 20."
- The panel keeps the same size, so the layout doesn't shift when the age changes. The category, divider and range stay laid out but invisible, with the note shown on top of them.

## Disclaimer

- Small muted text, full width, below the Height + Weight row:
  > BMI is a rough estimate and doesn't account for muscle mass, bone density, or body composition. If this number doesn't feel right for you, consider checking in with a personal trainer.
- Shown for all ages.

## Code Structure

- `src/lib/bmi.ts`: pure functions for the BMI value, category and healthy weight range in the selected unit. No React.
- `src/components/mainMenu/BmiPanel.tsx`: the panel. Takes `heightCm`, `weightKg`, `age` and `units`.
- Reuse the conversion helpers and `WEIGHT_UNIT_LABEL` from `src/lib/units.ts`, and lower `WEIGHT_RANGE`'s minimum there.
- `ProfileForm` renders `BmiPanel` in place of the reserved slot and adds the disclaimer below the row.

## Styling

- NativeWind `className` with theme tokens from `tailwind.config.js` / `src/theme.ts` only. No new tokens are needed.
- The screenshot's lime green stands in for the project accent color; don't hard-code it.
- Keep the slot's current width so the steppers don't move.

## Out of Scope

- Target Heart Rate panel
- Saving BMI to the profile (it's always calculated from height and weight)
- Using BMI in workout generation or volume scaling
- Growth percentile charts for users under 20

## References

- `@context/screenshots/ProfileMenu.png`
- `src/components/mainMenu/ProfileForm.tsx` (reserved BMI slot)
- `src/lib/units.ts` (unit conversion)
- `context/features/profile-menu-spec.md` (Reserved Slots section)
