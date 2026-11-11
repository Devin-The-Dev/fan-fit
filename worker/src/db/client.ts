import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

import * as schema from './schema';

export interface DbEnv {
  HYPERDRIVE: Hyperdrive;
}

// Hyperdrive pools connections, so each request opens its own client and closes it when the response is done.
export async function createDb(env: DbEnv) {
  const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
  await client.connect();
  const db = drizzle({ client, schema, casing: 'snake_case' });
  return { db, close: () => client.end() };
}
