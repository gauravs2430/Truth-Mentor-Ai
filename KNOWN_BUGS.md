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

---

---

## ✅ Recently Resolved

### 1. Roadmap Save Constraint (PostgreSQL Error 23502)
- **Issue:** Generating a roadmap would fail with: `null value in column "query" of relation "roadmaps" violates not-null constraint`.
- **Cause:** The database schema required a `query` field (to store the user's original prompt), but the frontend code was not providing it during insertion.
- **Fix:** Updated `GenerateRoadmap.jsx` to include the `query` field in the `insforge.database.insert()` call.

### 2. The Google OAuth Redirect Bug (A 4-Hour Debugging Story)

Spent HOURS debugging a Google OAuth issue while building my project “TruthMentor” using InsForge + React Router 😭
Thought I’d share the issue and fix because someone else will probably run into this too.

**The problem:**
✅ Email/password auth worked perfectly
❌ Google OAuth login got stuck on the login page

After signing in with Google:
`/login#access_token=xyz` would briefly appear… and then immediately become `/login` while `useUser()` still returned `null`.
So the app thought: `"No user logged in"` and stayed on the login screen forever.

At first I thought it was:
* OAuth callback URL issue
* Google Cloud config problem
* cookie/session issue
* redirect allowlist problem
* backend issue

…but the actual issue was MUCH more subtle:
⚠️ **Frontend auth state synchronization after OAuth redirect.**

The OAuth login itself was actually succeeding correctly. This proved it:
```js
const result = await insforge.auth.getCurrentUser();
```
returned the authenticated user successfully.

But `useUser()` was still lagging behind and not updating immediately after the OAuth redirect/session recovery flow.

**So the fix was:**
1. Let OAuth redirect back to `/login` instead of directly to `/dashboard`
2. Preserve OAuth URL hash/query while redirecting
3. Manually recover/check session using: `insforge.auth.getCurrentUser()`
4. Navigate to dashboard only AFTER session recovery succeeds

**The key realization:**
OAuth login succeeded. The frontend auth state just wasn’t synchronized yet.

**One more important thing:**
DO NOT accidentally destroy the OAuth hash/query params too early.
Example: `/login#access_token=xyz`
If your router redirects too early and turns it into `/login` before the SDK parses it… the login session can effectively be lost 😭
At one point during debugging, `useUser()` continued returning `null` even though `getCurrentUser()` successfully returned the authenticated user.

This was honestly one of the most educational auth debugging sessions I’ve had recently.
Huge learning about:
* OAuth flows
* React auth state timing
* route protection
* session recovery
* preserving URL hashes/query params
