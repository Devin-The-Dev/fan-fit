import {
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const oauthProvider = pgEnum('oauth_provider', ['google', 'apple']);
export const gender = pgEnum('gender', ['female', 'male', 'unknown']);
export const activityLevel = pgEnum('activity_level', ['sedentary', 'light', 'moderate', 'active', 'very_active']);
export const unitSystem = pgEnum('unit_system', ['metric', 'imperial']);
export const subscriptionTier = pgEnum('subscription_tier', ['free', 'pro']);

const createdAt = () => timestamp({ withTimezone: true }).notNull().defaultNow();

// Profile fields stay null until onboarding is finished; height and weight are stored in metric.
export const users = pgTable(
  'users',
  {
    id: uuid().primaryKey().defaultRandom(),
    oauthProvider: oauthProvider().notNull(),
    oauthProviderId: text().notNull(),
    email: text().notNull().unique(),
    name: text(),
    gender: gender(),
    activityLevel: activityLevel(),
    age: integer(),
    units: unitSystem().notNull().default('metric'),
    heightCm: doublePrecision(),
    weightKg: doublePrecision(),
    preferredWorkoutLength: integer().notNull().default(45),
    subscriptionTier: subscriptionTier().notNull().default('free'),
    monthlyGenerationsUsed: integer().notNull().default(0),
    creditPeriodStart: timestamp({ withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique().on(t.oauthProvider, t.oauthProviderId)],
);

// Prompt history (Pro only). `routine` is validated with the shared Zod routine schema before it is saved.
export const workouts = pgTable(
  'workouts',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    personaQuery: text().notNull(),
    routine: jsonb().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.userId, t.createdAt)],
);

export const exerciseCache = pgTable('exercise_cache', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  muscleGroup: text().notNull(),
  equipment: text().notNull(),
  externalId: text().notNull().unique(),
  gifUrl: text().notNull(),
});
