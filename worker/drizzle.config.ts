import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit already loads worker/.env on its own; override so the chosen file wins.
config({ path: process.env.ENV_FILE ?? '.env.prod', override: true, quiet: true });

const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
  throw new Error('CONNECTION_STRING is missing; add it to worker/.env.prod or set ENV_FILE.');
}

// pg already treats `sslmode=require` as `verify-full`; naming it explicitly silences pg's SSL-mode deprecation warning.
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
