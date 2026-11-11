# Drizzle ORM Research

Researched 2026-11-11 for setting up Fan Fit's database: Postgres on **Neon**, reached from a Cloudflare Worker through **Hyperdrive**, with **Drizzle ORM** for schema, queries and migrations (see `context/project-overview.md`).

## Why Drizzle + Hyperdrive

- Drizzle is a thin, typed SQL layer. The schema is plain TypeScript, so table types flow into the Worker without a codegen step.
- `drizzle-kit` turns schema changes into versioned SQL migration files that get committed with the change.
- `drizzle-zod` can derive Zod schemas from tables, which fits the "one Zod schema source" coding standard.
- Hyperdrive keeps a pool of warm connections close to the database. Workers open a cheap connection to Hyperdrive on every request instead of a slow TCP + TLS + auth handshake to Neon.

## Versions (npm, 2026-11-11)

| Package | Version | Role |
| --- | --- | --- |
| `drizzle-orm` | 0.45.4 | ORM / query builder |
| `drizzle-kit` | 0.31.11 | Migrations CLI (dev) |
| `pg` | 8.23.1 | node-postgres driver |
| `drizzle-zod` | 0.8.3 | Zod schemas from tables (later) |
| `wrangler` | 4.160.1 | Workers CLI (dev) |
| `hono` | 4.13.18 | Worker routing |

Local Node: 25.2.1.

## Key facts and gotchas

- **Use `pg` (node-postgres), not Postgres.js.** Cloudflare's docs state Drizzle + Postgres.js over Hyperdrive is not supported. Import from `drizzle-orm/node-postgres`.
- **One client per request.** Create `new Client({ connectionString: env.HYPERDRIVE.connectionString })`, `await client.connect()`, then `drizzle(client)`. Close it with `ctx.waitUntil(client.end())`. Hyperdrive does the pooling, so the Worker doesn't use `Pool`.
- **Wrangler config** needs `compatibility_flags: ["nodejs_compat"]` (for `pg`) and a `hyperdrive` binding with the id printed by `wrangler hyperdrive create`.
- **Two connection paths:**
  - Runtime (Worker): goes through Hyperdrive via `env.HYPERDRIVE.connectionString`.
  - Tooling (`drizzle-kit`): connects straight to Neon using `CONNECTION_STRING` from the gitignored `worker/.env.prod` (or the file named by `ENV_FILE`).
- **Local dev:** `wrangler dev` reads `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` (format `..._<BINDING_NAME>`). It wins over `localConnectionString` in the wrangler config, and keeps credentials out of committed files.
- **Neon connection string:** give Hyperdrive Neon's **direct** (non-pooled) string, since Hyperdrive already pools. The pooled host has `-pooler` in its name.
- **Migrations:** `drizzle-kit generate` then `drizzle-kit migrate`. Never `drizzle-kit push` (coding standards). Commit the generated `worker/drizzle/` folder.
- **drizzle-kit loads `.env` by itself** (it bundles dotenv) before reading `drizzle.config.ts`. Since dotenv doesn't overwrite variables that are already set, a placeholder `CONNECTION_STRING` in `worker/.env` silently won over `.env.prod`. The config loads its file with `override: true`. Symptoms were `drizzle-kit migrate` exiting 1 with no error, then "Invalid URL" once the config parsed the string.
- **Grant the app role access to `public`.** Since Postgres 15, new roles can't create objects in `public`. Neon's app role needed `GRANT USAGE, CREATE ON SCHEMA public TO fan_fit_app;`, run as `neondb_owner` in the SQL Editor.
- **`sslmode=require` warning:** pg 8.x treats `require` as `verify-full` and prints a deprecation warning. `drizzle.config.ts` sets `verify-full` explicitly. Neon's `channel_binding=require` works with `pg` as-is.
- **`jsonb().$type<T>()` is compile-time only.** It doesn't check stored values, so Gemini routines must still be parsed with Zod before saving.

## Schema building blocks

```ts
import { pgEnum, pgTable, uuid, text, integer, timestamp, jsonb, unique } from 'drizzle-orm/pg-core';

export const tier = pgEnum('subscription_tier', ['free', 'pro']);

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  tier: tier().notNull().default('free'),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const workouts = pgTable('workouts', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull().references(() => users.id, { onDelete: 'cascade' }),
  routine: jsonb().$type<WorkoutRoutine>().notNull(),
});
```

Composite unique: `pgTable('t', {...}, (t) => [unique().on(t.a, t.b)])`.

`drizzle({ client, casing: 'snake_case' })` plus `casing: 'snake_case'` in `drizzle.config.ts` maps camelCase keys to snake_case columns without naming each column.

## Target layout

```
worker/
  package.json        # separate from the Expo app
  tsconfig.json
  wrangler.jsonc      # nodejs_compat + HYPERDRIVE binding
  drizzle.config.ts
  .env.prod           # CONNECTION_STRING for drizzle-kit (gitignored)
  .env, .env.dev      # placeholder templates (gitignored)
  drizzle/            # generated migrations (committed)
  src/
    index.ts          # Hono app
    db/schema.ts
    db/client.ts      # createDb(env)
```

## Setup commands

```bash
cd worker
npm install drizzle-orm pg hono
npm install -D drizzle-kit @types/pg wrangler @cloudflare/workers-types dotenv typescript

npx drizzle-kit generate          # schema.ts -> SQL in drizzle/
npx drizzle-kit migrate           # apply to Neon via CONNECTION_STRING in .env.prod
npx drizzle-kit studio            # browse tables

npx wrangler login
npx wrangler hyperdrive create fan-fit-db --connection-string="<neon direct string>"
CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="<neon direct string>" npx wrangler dev
```

## `drizzle.config.ts`

```ts
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit already loads worker/.env on its own; override so the chosen file wins.
config({ path: process.env.ENV_FILE ?? '.env.prod', override: true, quiet: true });

const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
  throw new Error('CONNECTION_STRING is missing; add it to worker/.env.prod or set ENV_FILE.');
}

const url = new URL(connectionString);
url.searchParams.set('sslmode', 'verify-full');

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  casing: 'snake_case',
  dbCredentials: { url: url.toString() },
  strict: true,
  verbose: true,
});
```

## Worker client

```ts
import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

export async function createDb(env: { HYPERDRIVE: Hyperdrive }) {
  const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
  await client.connect();
  return { db: drizzle({ client, casing: 'snake_case' }), client };
}
// in a route: ctx.executionCtx.waitUntil(client.end())
```

## Risks

- Drizzle is pre-1.0 (0.45.x), so APIs can shift between minor versions. Pin versions.
- Two token sources are avoided, but there will be two `package.json` / `tsconfig.json` roots (app and `worker/`). The root `tsc` must not pick up `worker/`.
- Hyperdrive and Neon both have free tiers. Neon's free compute scales to zero, so the first query after idle is slower.

## Sources

- Context7 `/drizzle-team/drizzle-orm-docs`: drizzle-config-file, drizzle-kit-generate, drizzle-kit-migrate, column-types, indexes-constraints
- Context7 `/websites/developers_cloudflare_hyperdrive`
- https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/drizzle-orm
- https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-database-providers/neon
- https://developers.cloudflare.com/hyperdrive/configuration/local-development
- https://orm.drizzle.team/docs/get-started/postgresql-new
- npm: `npm view <pkg> version`
