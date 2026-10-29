# Coding Standards

## TypeScript

- Strict mode enabled (app and Worker)
- No `any` types - use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful
- Types shared between the app and the Worker (routine, exercise, profile) come from one Zod schema source - don't redefine them on each side

## React Native

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks
- Use React Native core components (`View`, `Text`, `Pressable`, `FlatList`, etc.) - no web DOM elements
- Wrap screens in `react-native-safe-area-context` safe areas
- Use `FlatList` / `SectionList` for long or dynamic lists instead of mapping inside a `ScrollView`

## Expo Router

- Every screen is a file under `src/app/`
- Use route groups for flow stages, e.g. `(auth)` for sign-in and onboarding, `(main)` for generator and workout views
- Use `_layout.tsx` files for shared navigation (stacks, tabs) and auth redirects
- Keep screen files thin - move UI pieces into `src/components/` and logic into hooks or `src/lib/`

## Cloudflare Worker (Hono)

- All backend routes use **Hono**
- Validate every request body, param, and query with Zod (`@hono/zod-validator`)
- Auth and entitlement checks run as Hono middleware, not inside each route
- Keep integrations in separate modules - routes call them, they don't call each other:
  - Gemini completions
  - RevenueCat entitlement checks
  - ExerciseDB lookups
- Secrets (Gemini, ExerciseDB, RevenueCat keys) live only in Worker environment bindings - never in the app bundle

## Gemini

- Use Gemini's structured JSON output with a schema that matches the shared routine types
- Parse every Gemini response with the Zod routine schema before saving or returning it - reject or retry on failure
- Prompts must produce realistic athletic conditioning scaled to gender, activity level, age, and workout length - no non-functional gimmick exercises

## File Organization

- Screens: `src/app/[route].tsx`
- Components: `src/components/[feature]/ComponentName.tsx`
- Hooks: `src/hooks/useThing.ts`
- Lib/Utils (API client, helpers): `src/lib/[utility].ts`
- Types/Schemas: `src/types/[feature].ts`
- Theme (colors, spacing, type sizes): `src/theme.ts`
- Worker: `worker/src/` - `routes/`, `services/` (Gemini, RevenueCat, ExerciseDB), `db/` (Drizzle schema + queries)

## Naming

- Components: PascalCase (`WorkoutCard.tsx`)
- Files: Match component name, otherwise camelCase (`generateWorkout.ts`)
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)

## Styling

- Use React Native `StyleSheet.create` for all styling (NativeWind is on the back burner - see `context/back-burner.md`)
- All colors come from `src/theme.ts` - no hard-coded hex values in components
- Theme uses the project palette:
  - Primary Accent Green `#009C15`
  - Secondary Green `#156920`
  - Deep Forest Accent `#15361A`
  - Dark Charcoal Container `#1F3321`
  - Deep Background Charcoal `#29332A`
- Dark mode only for now
- No inline style objects except for values computed at runtime (e.g. safe-area insets)

## Database

- Use Drizzle ORM for all database operations (Postgres via Hyperdrive)
- Schema changes: edit the Drizzle schema, then `drizzle-kit generate` and `drizzle-kit migrate` - don't use `drizzle-kit push`
- Commit generated migration files with the schema change
- Only the Worker talks to the database - the app never connects directly

## Data Fetching

- The app calls the Worker through a single typed API client in `src/lib/`
- Validate all inputs with Zod on the Worker
- Show loading skeletons while Gemini generates

## Error Handling

- Use try/catch around external calls (Gemini, ExerciseDB, RevenueCat, database)
- Worker responses return `{ success, data, error }`
- Show user-friendly error messages on screen - never raw error text or stack traces

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
- Run `npx tsc --noEmit` before committing
