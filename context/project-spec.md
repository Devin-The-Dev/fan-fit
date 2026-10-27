# Fan Fit — Product Requirement & Architecture Document

## 1. Executive Summary & Problem
* **Product Name:** Fan Fit
* **Problem Solved:** Gym-goers and fitness first-timers suffer from "workout paralysis"—arriving at the gym without knowing what exercises to perform or how to structure their session.
* **Core Solution:** Fan Fit uses AI to bridge fandom and fitness. Users input their favorite athlete, fictional character, superhero, musician, or actor, and the app instantly generates a realistic, scientifically sound athletic conditioning routine themed around that persona.
* **Key Differentiator:** Combines pop culture inspiration with practical fitness guidance, replacing generic templates with highly personalized, character-driven routines.

---

## 2. Target Audience (Users)
* **Primary Persona:** Fans of sports, anime, pop culture, movies, and music who want to get fit, build consistency, and train like their icons.
* **Experience Level:** Primarily skews towards beginners and intermediates who need clear exercise selection and form/demonstration guidance.
* **Usage Pattern:** Designed as a focused, personal, solo workout tool without social feed distractions.

---

## 3. Feature Set (MVP Scope)
1. **Seamless Social Onboarding:** Quick login via Google/Apple followed by an immediate profile setup screen (Gender, Activity Level).
2. **AI Persona Prompt & Generator:** Interactive prompt screen where users select or type their favorite character, athlete, or artist.
3. **Structured Scrollable Workout View:** Clean, distraction-free scrollable list displaying the generated exercise routine, set/rep breakdown, target muscle groups, and demo GIFs.
4. **Exercise Demo Library Integration:** High-quality motion GIFs embedded directly for every exercise to ensure proper form for beginners.
5. **Fresh Session Generation:** Fast, low-friction entry point designed to prompt and generate a new workout every time the user hits the gym.

---

## 4. Data Architecture & Schema
### Key Stored Entities:
* **Users:** Unique ID, OAuth Provider ID, Email, Gender, Activity Level, Subscription Tier (`free` vs. `pro`), Monthly Generation Credit Counter, Created/Updated Timestamps.
* **Prompt History / Workouts:** User ID, Target Persona Query, Generated JSON Routine, Execution Timestamp.
* **Exercise Cache (Local / Edge):** Exercise Name, Muscle Group, Equipment Type, External API Reference ID, GIF URL.

---

## 5. Technology Stack & Latency Optimization
### Tech Stack:
* **Mobile Frontend:** React Native (Cross-platform iOS & Android)
* **Backend Runtime:** TypeScript on Cloudflare Workers (Serverless Edge execution)
* **Database & Pooling:** PostgreSQL hosted on Cloudflare Hyperdrive (Global low-latency connection pooling)
* **AI Engine:** Google Gemini API (Structured JSON prompt execution)
* **Exercise Data API:** 3rd-Party Exercise API (e.g., ExerciseDB) with GIF media assets
* **In-App Purchases / Subscriptions:** RevenueCat SDK (Handling Apple IAP & Google Play Billing)

### Latency Management Strategy:
* **AI Streaming & UI Skeleton:** Display responsive loading indicators during Gemini LLM generation.
* **Edge Caching:** Cache 3rd-party exercise GIF assets via Cloudflare CDN / R2 to prevent buffering on mobile cellular connections (3G/4G/5G).
* **Database Connection Acceleration:** Utilize Cloudflare Hyperdrive to eliminate cold-start database connection overhead.

---

## 6. Business Model & Monetization
* **Model:** Freemium Subscription Model
* **Free Tier:** 3 free AI workout generations per month.
* **Pro Tier:** Unlimited AI workout generations via monthly or annual subscription managed seamlessly through RevenueCat.

---

## 7. UI/UX Specifications
* **Design Aesthetic:** Clean, sleek, minimalist dark mode UI with high-contrast green accents.
* **Color Palette:**
  * Primary Accent Green: `#009C15`
  * Secondary Green: `#156920`
  * Deep Forest Accent: `#15361A`
  * Dark Charcoal Container: `#1F3321`
  * Deep Background Charcoal: `#29332A`
* **Layout Flow:**
  1. Social Authentication Screen
  2. Onboarding Attribute Collector (Gender & Activity Level)
  3. AI Persona Generation Screen
  4. Scrollable Workout & Demo View

---

## 8. AI Developer Context & Coding Guidelines (Claude Code)
### Target AI Tooling:
* **AI Coding Assistant:** Claude Code

### System Rules & Requirements for Claude Code:
1. **Git Commit Rules:** 
   * Do NOT include the `Co-authored-by: Claude <noreply@anthropic.com>` trailer or any co-author metadata when committing and pushing code changes to GitHub.
2. **Gemini Prompt Output Structuring:**
   * Gemini system prompts MUST enforce strict JSON schema output matching exercise data types expected by the frontend parser.
   * Prompts must strictly filter routines to fit realistic athletic conditioning based on user gender and activity level without non-functional gimmick exercises.
3. **Architecture Conventions:**
   * Strict TypeScript typing across both frontend React Native components and backend Cloudflare Worker routes.
   * Modular API layers separating Gemini completion calls, RevenueCat entitlement checks, and 3rd-party exercise API lookups.