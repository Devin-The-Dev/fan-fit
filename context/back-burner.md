# Back Burner

Ideas and upgrades saved for a later update or feature.

- **NativeWind full migration:** NativeWind v4 is set up. `ProfileCard` and the workout generation UI are converted. Still on `StyleSheet`:
  - `App.tsx` (9 entries):
    - Screen wrappers `flex` and `safe`, plus `scrollContent`, which needs `contentContainerClassName` on the `ScrollView`
    - The hero: `hero`, `kicker`, `title`, `lede`
    - The Profile section wrapper `section`: convert to `className="mb-7"`
  - `src/components/mainMenu/ProfileSheet.tsx` (15 entries): the modal sheet, age stepper and Done button. The sheet's safe-area bottom padding stays inline.
  - **Skip `src/components/ExerciseVideoPlayer.tsx`.** The YouTube → GIF demos item below deletes it. Convert it only if that item is dropped.
  - **Color props can't take a `className`.** `placeholderTextColor` and `selectionColor` on the `TextInput` in `App.tsx`, and `ActivityIndicator`'s `color` in `ExerciseVideoPlayer`, need actual color values. Either map them with NativeWind's `cssInterop` or keep a small JS color export. So `src/theme.ts` can't be fully retired yet; trim it to just what those props need.
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
- **Cloudflare Worker backend:** the database is set up and Hyperdrive config `fan-fit-db` is bound to the Worker. `worker/` has a Hono app with a `GET /health` route that was tested locally only. Still to do:
  - Deploy with `npm --prefix worker run deploy` once the app has something to call (sign-in or Gemini generation). Start on `*.workers.dev`; a custom domain like `api.<domain>` can come later.
  - Add a typed API client in `src/lib/` pointing at the Worker URL.
  - Hyperdrive caches read queries for about 60s by default. Before building the free-tier credit check, turn caching off for `fan-fit-db` or read `monthly_generations_used` from the same query that updates it, so the limit never acts on a stale count.
  - Make `npm run dev` set `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` from `worker/.env.prod`, instead of exporting it by hand.
  - `worker/.env` and `worker/.env.dev` still hold the placeholder template. drizzle-kit loads `.env` on its own, so put real values there only on purpose, for example once a Neon dev branch exists.
