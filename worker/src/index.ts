import { sql } from 'drizzle-orm';
import { Hono } from 'hono';

import { createDb, type DbEnv } from './db/client';

const app = new Hono<{ Bindings: DbEnv }>();

app.get('/health', async (c) => {
  try {
    const { db, close } = await createDb(c.env);
    try {
      await db.execute(sql`select 1`);
    } finally {
      c.executionCtx.waitUntil(close());
    }
    return c.json({ success: true, data: { database: 'ok' }, error: null });
  } catch (err) {
    console.error('Health check failed', err);
    return c.json({ success: false, data: null, error: 'Database unavailable' }, 503);
  }
});

export default app;
