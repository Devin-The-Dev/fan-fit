# Back Burner

Ideas and upgrades saved for a later update or feature.

- **NativeWind:** switch styling from React Native `StyleSheet` to Tailwind-style classes with NativeWind. Requires adding the library and rewriting existing styles.
- **Multi-page app:** split the single-screen `App.tsx` into separate screens with Expo Router (files under `src/app/`):
  1. Social authentication
  2. Onboarding profile setup (gender, activity level, age, workout length)
  3. AI persona generation
  4. Scrollable workout & demo view
- **YouTube → GIF demos:** replace the YouTube tutorial videos with ExerciseDB motion GIFs shown inline for every exercise:
  - Remove `src/exerciseVideos.ts`, `src/components/ExerciseVideoPlayer.tsx`, and the `react-native-youtube-iframe` / `react-native-webview` dependencies
  - Match each exercise to an ExerciseDB entry and show its GIF in the workout view
  - Cache GIFs on Cloudflare R2 / CDN (requires the Worker backend)
