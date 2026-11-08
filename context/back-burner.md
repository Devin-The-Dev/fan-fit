# Back Burner

Ideas and upgrades saved for a later update or feature.

- **NativeWind full migration:** NativeWind v4 is set up and `ProfileCard` is converted. Still to do: convert `App.tsx` and the remaining components from `StyleSheet` to `className`, then retire the duplicated tokens in `src/theme.ts`.
  - `App.tsx` still uses `styles.section` for the Profile section wrapper; convert it to `className="mb-7"`, then delete the `section` entry from the `StyleSheet`.
- **NativeWind v5:** upgrade from v4.2.7 once v5 is stable (Tailwind v4, theme in CSS via `@theme`, no Babel preset). `5.0.0-rc.1` failed to compile Tailwind v4 output on SDK 58. See `context/research/nativewind.md`.
- **Multi-page app:** split the single-screen `App.tsx` into separate screens with Expo Router (files under `src/app/`):
  1. Social authentication
  2. Onboarding profile setup (gender, activity level, age, workout length)
  3. AI persona generation
  4. Scrollable workout & demo view
- **YouTube → GIF demos:** replace the YouTube tutorial videos with ExerciseDB motion GIFs shown inline for every exercise:
  - Remove `src/exerciseVideos.ts`, `src/components/ExerciseVideoPlayer.tsx`, and the `react-native-youtube-iframe` / `react-native-webview` dependencies
  - Match each exercise to an ExerciseDB entry and show its GIF in the workout view
  - Cache GIFs on Cloudflare R2 / CDN (requires the Worker backend)
