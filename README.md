# FanFit

React Native (Expo) app that builds **workout routines** from what motivates you: a **sport**, a **celebrity**, or a **fictional character**. Pick a type, enter a name, and get a structured session (warm-up, main work, conditioning, cool-down) with an estimated duration.

Routines are generated **on device** from themed exercise pools and rules—no API keys required.

## Requirements

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) via `npx` (no global install required)
- For physical devices: [Expo Go](https://expo.dev/go) (iOS / Android)

## Getting started

```bash
cd fan-fit
npm install
npm start
```

Then:

- Press **i** for iOS simulator, **a** for Android emulator, or **w** for web (if supported by your setup)
- Or scan the QR code with **Expo Go** on your phone (same network as your computer)

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm start`    | Start the Expo dev server |
| `npm run ios`  | Start and open iOS        |
| `npm run android` | Start and open Android |
| `npm run web`  | Start web bundler         |

## Project layout

| Path | Role |
|------|------|
| `App.tsx` | UI: inspiration type, input, generated routine |
| `src/generateWorkout.ts` | Routine generation (pools, sport routing, seeded variation) |
| `src/types.ts` | Shared TypeScript types |
| `app.json` | Expo app name and platform settings |

## Customization ideas

- Swap or extend exercise pools in `src/generateWorkout.ts`
- Call an LLM or your backend from `App.tsx` and map responses into the same `WorkoutRoutine` shape

## License

Private project (see `package.json`).
