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

## Stack

Expo SDK 54, React Native 0.81 (new architecture enabled), React 19, TypeScript. Entry is `index.ts` → `App.tsx`. Tutorial videos play in-app through `react-native-youtube-iframe` (WebView-based).

## Architecture

Everything runs on the device; there is no backend, network API, persistence or navigation library. `App.tsx` is a single screen that holds all state (profile inputs, inspiration kind and name, variation counter, current routine, active video) and renders the generated routine inline.

Generating a routine is a pipeline across `src/`:

1. **`generateWorkout.ts`**: seeds a deterministic PRNG (FNV-1a hash of `kind:name:variation` → mulberry32). The same inputs always produce the same routine, and "Shuffle another variation" just increments `variationSeed`. It picks exercises from template pools: warm-up/cool-down bases, plus a main pool chosen by inspiration kind. For sports, a regex in `sportBucket()` maps the free-text sport to `run`/`court`/`mat`/`ring`/`water`/`default`. A shared `used` set keeps any exercise from appearing twice in one routine.
2. **`scaleVolume.ts`**: `getDurationPlan()` sets how many exercises each section gets for 30/45/60 min. `getVolumeScale()` (age × activity) times `getDurationVolumeFactor()` gives one multiplier. `scaleExerciseDetail()` applies that multiplier by **regex-rewriting the numbers inside the human-readable `detail` string** (`3 × 10`, `4 rounds`, `45s`, `12 min`, etc.). The detail text is the only place volume is stored, so new templates must use those notations or they won't scale.
3. **`exerciseVideos.ts`**: `withVideoUrl()` attaches YouTube data to each exercise. Lookup goes through `normalizeExerciseName()`, which lowercases and turns curly apostrophes into straight ones. `CURATED_IDS` maps an exercise name to one video. Multi-move exercises (tri-sets, circuits, finishers) get one video per sub-move in `COMPOUND_TUTORIALS`. Exercises without a match fall back to a YouTube search URL, which `App.tsx` opens externally instead of in the player modal.

**Coupling to watch:** the keys in `exerciseVideos.ts` must match the `name` of each template in `generateWorkout.ts` after normalization. Renaming or adding an exercise means updating both files.

`src/types.ts` holds the shared types (`UserProfile`, `WorkoutRoutine`, etc.) and `DEFAULT_PROFILE`. `ExerciseTutorialVideo` is also declared again in `exerciseVideos.ts`.

Styling uses plain `StyleSheet` with color constants (`ACCENT`, `BG`, …) duplicated at the top of `App.tsx` and `ExerciseVideoPlayer.tsx`. There is no theme module.

## Project context (`context/`)

- `context/current-feature.md`: the feature in progress, its status and a dated history log. Update it as work on a feature progresses.
- `context/features/*-spec.md`: feature specs. `context/screenshots/` holds the reference designs; the current feature is the main menu redesign based on `MainMenu.png`.
- `context/project-spec.md`: the long-term product plan. It describes a **target** architecture that does not exist yet: AI generation through Gemini, a Cloudflare Workers backend, Postgres with Hyperdrive, OAuth login, RevenueCat subscriptions, and ExerciseDB GIFs. Don't assume any of it is present in the code; the current app is on-device only.
