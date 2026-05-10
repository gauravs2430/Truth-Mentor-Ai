# 🐛 Known Bugs & Technical Debt

This document tracks current known issues, edge cases, and technical debt in the TruthMentor AI platform that will be addressed in upcoming phases. 

*(Note: Do not include these in the main README to keep the public-facing documentation clean).*

### 1. Profile Creation Race Condition
- **Issue:** During user signup, there is a potential race condition between the frontend inserting the user's initial `profiles` row and the PostgreSQL database trigger doing the same thing. 
- **Current Workaround:** We currently ignore the Postgres `23505` (unique_violation) error code on the frontend if the trigger beats it.
- **Future Fix:** Fully migrate profile initialization to a backend Supabase/InsForge Auth trigger and remove the frontend `profiles` insert entirely.

### 2. Orphaned Profiles on User Deletion
- **Issue:** If a user is manually deleted from the InsForge Auth Dashboard, their associated row in the `profiles` table (and other related tables) is not automatically deleted. If they try to sign up again with the same email, it may cause a conflict.
- **Future Fix:** Add an `ON DELETE CASCADE` constraint or a database trigger on the `auth.users` table to automatically clean up the `profiles` table when an auth user is deleted.

### 3. AI Roadmap Generation Timeouts
- **Issue:** The `GenerateRoadmap` component currently waits for the entire JSON payload from the AI before rendering. If the AI takes longer than 15-20 seconds to generate a complex roadmap, the Vercel/Render edge function or browser network request might timeout.
- **Future Fix:** Implement true JSON streaming using React Server Components or Edge streaming so the user sees the roadmap being built step-by-step in real-time.

### 4. Cross-Tab Session Synchronization
- **Issue:** If the user logs out in one browser tab, the other browser tab might not instantly update its UI until the page is refreshed due to how the `@insforge/react` provider currently listens to state changes.
- **Future Fix:** Ensure `onAuthStateChange` listeners are properly broadcasting cross-tab events or implement a manual `window.addEventListener('storage')` sync.

### 5. Missing Error Boundaries
- **Issue:** If the database goes down or returns a malformed JSON payload for a roadmap, the React application might crash and show a blank screen instead of a graceful error UI.
- **Future Fix:** Implement React `<ErrorBoundary>` components around the main application routes, specifically the `RoadmapDetail` and `Dashboard` views.
