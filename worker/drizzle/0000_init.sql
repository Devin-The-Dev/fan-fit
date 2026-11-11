CREATE TYPE "public"."activity_level" AS ENUM('sedentary', 'light', 'moderate', 'active', 'very_active');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('female', 'male', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."oauth_provider" AS ENUM('google', 'apple');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TYPE "public"."unit_system" AS ENUM('metric', 'imperial');--> statement-breakpoint
CREATE TABLE "exercise_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"muscle_group" text NOT NULL,
	"equipment" text NOT NULL,
	"external_id" text NOT NULL,
	"gif_url" text NOT NULL,
	CONSTRAINT "exercise_cache_externalId_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"oauth_provider" "oauth_provider" NOT NULL,
	"oauth_provider_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"gender" "gender",
	"activity_level" "activity_level",
	"age" integer,
	"units" "unit_system" DEFAULT 'metric' NOT NULL,
	"height_cm" double precision,
	"weight_kg" double precision,
	"preferred_workout_length" integer DEFAULT 45 NOT NULL,
	"subscription_tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"monthly_generations_used" integer DEFAULT 0 NOT NULL,
	"credit_period_start" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_oauthProvider_oauthProviderId_unique" UNIQUE("oauth_provider","oauth_provider_id")
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"persona_query" text NOT NULL,
	"routine" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workouts_user_id_created_at_index" ON "workouts" USING btree ("user_id","created_at");