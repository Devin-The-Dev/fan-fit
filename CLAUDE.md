# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Fan Fit

A fitness tool for gym goers to train like their favorite celebrity, sport, or sport. 

## Context Files

Read the following to get the full context of the project:
- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- `npm start` — Expo dev server (then `i` iOS sim, `a` Android emu, `w` web, or scan with Expo Go)
- `npm run ios` / `npm run android` / `npm run web` — start and open a specific platform
- `npx tsc --noEmit` — type-check (strict mode); this is the only static check

There is no test runner, linter, or formatter configured.

Worker commands live in `worker/package.json`. Run them from `worker/`, or from the root with `npm --prefix worker run <script>`:

- `npm run db:generate` / `npm run db:migrate` / `npm run db:studio`: Drizzle migrations against Neon (never `drizzle-kit push`)
- `npm run dev`: local Worker on `localhost:8787`; needs `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` exported first
- `npm run typecheck`: Worker type-check (the root `tsconfig.json` excludes `worker/`)

## Stack

Expo SDK 58, React Native 0.88 (new architecture always on), React 19.3, TypeScript 6, NativeWind 4.2.7 (Tailwind CSS 3). Entry is `index.ts` (imports `global.css`) → `App.tsx`. Tutorial videos play in-app through `react-native-youtube-iframe` (WebView-based).

## Architecture

The app runs entirely on the device; it has no persistence or navigation library and does not call the Worker yet. `App.tsx` is a single screen that holds all state (profile inputs, inspiration kind and name, variation counter, current routine, active video) and renders the generated routine inline.

Generating a routine is a pipeline across `src/`:

1. **`generateWorkout.ts`**: seeds a deterministic PRNG (FNV-1a hash of `kind:name:variation` → mulberry32). The same inputs always produce the same routine, and "Shuffle another variation" just increments `variationSeed`. It picks exercises from template pools: warm-up/cool-down bases, plus a main pool chosen by inspiration kind. For sports, a regex in `sportBucket()` maps the free-text sport to `run`/`court`/`mat`/`ring`/`water`/`default`. A shared `used` set keeps any exercise from appearing twice in one routine.
2. **`scaleVolume.ts`**: `getDurationPlan()` sets how many exercises each section gets for 30/45/60 min. `getVolumeScale()` (age × activity) times `getDurationVolumeFactor()` gives one multiplier. `scaleExerciseDetail()` applies that multiplier by **regex-rewriting the numbers inside the human-readable `detail` string** (`3 × 10`, `4 rounds`, `45s`, `12 min`, etc.). The detail text is the only place volume is stored, so new templates must use those notations or they won't scale.
3. **`exerciseVideos.ts`**: `withVideoUrl()` attaches YouTube data to each exercise. Lookup goes through `normalizeExerciseName()`, which lowercases and turns curly apostrophes into straight ones. `CURATED_IDS` maps an exercise name to one video. Multi-move exercises (tri-sets, circuits, finishers) get one video per sub-move in `COMPOUND_TUTORIALS`. Exercises without a match fall back to a YouTube search URL, which `App.tsx` opens externally instead of in the player modal.

**Coupling to watch:** the keys in `exerciseVideos.ts` must match the `name` of each template in `generateWorkout.ts` after normalization. Renaming or adding an exercise means updating both files.

`src/types.ts` holds the shared types (`UserProfile`, `WorkoutRoutine`, etc.) and `DEFAULT_PROFILE`. `ExerciseTutorialVideo` is also declared again in `exerciseVideos.ts`.

### Worker and database (`worker/`)

A separate Cloudflare Worker package (Hono, Drizzle ORM 0.45, `pg`) with its own `package.json` and `tsconfig.json`. It is not deployed yet; see `context/back-burner.md`.

- `src/db/schema.ts`: `users`, `workouts` and `exercise_cache` plus their enums. Gender is `female | male | unknown`, matching `Gender` in `src/types.ts`; keep the two in sync.
- `src/db/client.ts`: `createDb(env)` opens one `pg` client per request through the `HYPERDRIVE` binding (Hyperdrive `fan-fit-db`). Close it with `waitUntil` after the query, not before.
- `src/index.ts`: Hono app; only `GET /health` exists.
- `drizzle/`: generated migrations, committed.
- Credentials: `drizzle.config.ts` reads `CONNECTION_STRING` from the gitignored `worker/.env.prod` (`ENV_FILE` picks another file). drizzle-kit loads `worker/.env` (a placeholder) on its own first, so the config uses dotenv `override: true`.

See `context/research/drizzle.md` for gotchas.

Styling is mid-migration. `ProfileCard` uses NativeWind `className`; everything else still uses `StyleSheet` with tokens from `src/theme.ts`. NativeWind is configured through `babel.config.js`, `metro.config.js`, `tailwind.config.js` and `global.css`. Theme tokens are defined twice, in `tailwind.config.js` and `src/theme.ts`, so keep them in sync.

## Project context (`context/`)

- `context/current-feature.md`: the feature in progress, its status and a dated history log. Update it as work on a feature progresses.
- `context/research/*.md`: library and approach research notes (e.g. `nativewind.md`).
- `context/features/*-spec.md`: feature specs. `context/screenshots/` holds the reference designs; the current feature is the main menu redesign based on `MainMenu.png`.
- `context/project-spec.md`: the long-term product plan. It describes a **target** architecture. Only the Postgres database (Neon + Drizzle) and a bare Worker bound to Hyperdrive exist so far. AI generation through Gemini, OAuth login, RevenueCat subscriptions, ExerciseDB GIFs and a deployed Worker API do not exist yet, so don't assume them; the app itself is still on-device only.
