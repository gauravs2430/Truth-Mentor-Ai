# 🚀 AI Career Mentor — Full Upgrade Plan

> **Vision:** Transform a basic Gemini API wrapper into a production-grade, AI-powered career mentoring platform — fully hosted, feature-rich, and resume-worthy.

---

## 📌 Table of Contents

1. [What is this project (Current State)](#1-what-is-this-project-current-state)
2. [What it will become (Future Vision)](#2-what-it-will-become-future-vision)
3. [How Software is Actually Built — Step by Step](#3-how-software-is-actually-built--step-by-step)
4. [Tech Stack — What, Why & How](#4-tech-stack--what-why--how)
5. [Feature Roadmap](#5-feature-roadmap)
6. [Database Design & Schema](#6-database-design--schema)
7. [UI/UX Design Plan](#7-uiux-design-plan)
8. [API Design](#8-api-design)
9. [AI Integration Strategy](#9-ai-integration-strategy)
10. [Honest AI — The "Brutal Truth" Mentor Philosophy](#10-honest-ai--the-brutal-truth-mentor-philosophy)
11. [Deployment & Hosting Plan](#11-deployment--hosting-plan)
12. [Phase-wise Development Plan](#12-phase-wise-development-plan)

---

## 1. What is this project (Current State)

### What exists right now:
- A React frontend with one input box and a toggle switch
- A Node/Express backend with a single route
- The route does basic keyword matching (`if query.includes("mern")`) and calls the Gemini API
- Returns a text response — that's it

### The problems:
- No database — nothing is saved
- No users — no login, no history, no personalization
- No real AI logic — just a prompt wrapper
- No deployment-ready setup
- Cannot be called a "product" — it's a proof-of-concept at best

---

## 2. What it will become (Future Vision)

**AI Career Mentor Pro** — A full-stack career intelligence platform where:

- Users **sign up and log in** with Google or Email
- They set their **current skills, experience level, and career goals**
- The AI generates a **personalized, interactive career roadmap**
- Users can **track their progress** on each step of the roadmap
- They can **chat with an AI mentor** at any time for advice
- A **skills gap analyzer** tells them exactly what they're missing
- A **job market insights** section shows what's in demand right now
- Everything is **saved to a real database** and persists across sessions
- The app is **hosted live** and usable by anyone

---

## 3. How Software is Actually Built — Step by Step

> This section explains the real-world software development process that professionals follow.

### Step 1: Define the Problem & Requirements

Before writing a single line of code, answer these questions:
- **What problem does this solve?** (Who is the user? What pain point are we addressing?)
- **What are the core features?** (Separate must-haves from nice-to-haves)
- **What does success look like?** (What metrics matter — users, sessions, retention?)

For us:
- **Problem:** Students and fresh graduates don't know what skills to learn or in what order
- **Users:** CS students, career switchers, self-learners
- **Core features:** Auth, AI roadmap, progress tracking, chat

---

### Step 2: System Design (Architecture)

Before coding, design how the system works at a high level:

```
[User Browser]
     ↓ HTTPS
[Frontend — React + Vite]
     ↓ REST API / WebSocket
[Backend — Node.js + Express]
     ↓               ↓              ↓
[PostgreSQL]    [Redis Cache]  [Gemini AI API]
     ↓
[Supabase Storage — for avatars/files]
```

Ask yourself:
- What talks to what?
- Where is data stored?
- What needs to be fast (cache)?
- What is sensitive (auth, secrets)?

---

### Step 3: Design the Database Schema

This is one of the most critical steps. **Bad schema = bad app.** You design tables, their columns, relationships, and constraints BEFORE writing any backend code.

See Section 6 for full schema.

---

### Step 4: Design the API (Contract First)

Define all your API endpoints on paper before building them:
- What URL does it hit? (`POST /api/auth/login`)
- What does the request body look like?
- What does the response look like?
- What HTTP status codes do you return?

This is called **API-first design** and it lets frontend and backend work in parallel.

---

### Step 5: Set Up the Project Structure

Create a clean, scalable folder structure. Don't put everything in one file. Think in layers:
- `routes/` → only URL definitions
- `controllers/` → business logic
- `services/` → reusable logic (AI calls, email, etc.)
- `models/` → database queries
- `middleware/` → auth checks, error handling

---

### Step 6: Build Backend First (API + DB)

Start with the server. Why? Because the frontend is just UI — if the data layer isn't solid, the UI is built on sand.

Order:
1. Set up Express + PostgreSQL connection
2. Run database migrations (create tables)
3. Build auth routes (register, login, JWT)
4. Build core feature routes one by one
5. Test every route with Postman/Thunder Client

---

### Step 7: Build the Frontend

Now wire up React to your working API:
1. Set up routing (React Router)
2. Build auth pages (Login, Register)
3. Build protected routes (only logged-in users can access)
4. Build core feature pages
5. Handle loading states, errors, empty states

---

### Step 8: Polish & Test

- Write basic tests for critical routes
- Handle all edge cases (empty input, API failures, duplicate emails)
- Make the UI responsive (mobile-friendly)
- Optimize performance (lazy loading, caching)

---

### Step 9: Deploy

- Frontend → Vercel
- Backend → Render or Railway
- Database → Supabase (hosted PostgreSQL)
- Set all environment variables in the hosting dashboard

---

### Step 10: Maintain & Iterate

- Monitor errors (Sentry)
- Track usage (PostHog or Google Analytics)
- Add features based on feedback

---

## 4. Tech Stack — What, Why & How

### Frontend

| Technology | Why Use It | Demand Level |
|------------|-----------|--------------|
| **React + Vite** | Vite is faster than Create React App. Industry standard. | 🔥🔥🔥🔥🔥 |
| **TypeScript** | Type safety catches bugs early. Every serious company uses it | 🔥🔥🔥🔥🔥 |
| **TailwindCSS** | Utility-first CSS — faster styling, consistent design | 🔥🔥🔥🔥🔥 |
| **Framer Motion** | Beautiful animations with minimal code | 🔥🔥🔥🔥 |
| **React Query (TanStack)** | Handles API state, caching, loading states cleanly | 🔥🔥🔥🔥🔥 |
| **Zustand** | Lightweight global state management (simpler than Redux) | 🔥🔥🔥🔥 |
| **React Router v6** | Client-side routing, protected routes | 🔥🔥🔥🔥🔥 |

---

### Backend

| Technology | Why Use It | Demand Level |
|------------|-----------|--------------|
| **Node.js + Express** | Keep existing backend, just restructure it | 🔥🔥🔥🔥🔥 |
| **TypeScript (backend)** | Same language on both sides, type-safe code | 🔥🔥🔥🔥🔥 |
| **JWT + Refresh Tokens** | Secure, stateless authentication | 🔥🔥🔥🔥🔥 |
| **Bcrypt** | Password hashing | 🔥🔥🔥🔥🔥 |
| **Zod** | Request validation — validates API inputs | 🔥🔥🔥🔥 |

---

### Database

| Technology | Why Use It | Demand Level |
|------------|-----------|--------------|
| **PostgreSQL** | Relational, powerful, production-grade. Used by every serious company. Handles complex queries for roadmaps, progress tracking | 🔥🔥🔥🔥🔥 |
| **InsForge** | AI-native hosted PostgreSQL + Auth + Storage. Built specifically for AI-driven development. Perfect for modern, agent-assisted workflows | 🔥🔥🔥🔥🔥 |
| **Redis** | Cache frequent AI responses so you don't call Gemini API every single time (saves cost + improves speed) | 🔥🔥🔥🔥 |

**Why PostgreSQL over MongoDB?**
- Career roadmaps have clear relationships: User → Roadmap → Steps → Progress
- Relational data is better modeled in SQL
- PostgreSQL has JSON column support so you still get flexibility
- More in-demand in enterprise jobs

**Why InsForge?**
- It's a bleeding-edge Backend-as-a-Service (BaaS) built specifically for AI agents.
- Gives you a hosted PostgreSQL database for free, along with built-in Auth (Google OAuth, Email/Password).
- Designed for faster development when pair-programming with AI, reducing configuration overhead.

---

### AI & External Services

| Technology | Why Use It | Demand Level |
|------------|-----------|--------------|
| **Google Gemini API** | Keep it — it's already integrated and free tier is good | 🔥🔥🔥🔥 |
| **Gemini Streaming** | Stream the AI response token by token (like ChatGPT typing effect) instead of waiting for full response | 🔥🔥🔥🔥🔥 |
| **LangChain.js** | Framework for building advanced AI apps — memory, chains, agents. Makes your AI features much more sophisticated | 🔥🔥🔥🔥🔥 |
| **Vector Embeddings** | Store career data as vectors in pgvector (PostgreSQL extension) for semantic search | 🔥🔥🔥🔥 |

---

### DevOps & Tooling

| Technology | Why Use It |
|------------|-----------|
| **Docker** | Containerize the app so it runs the same everywhere |
| **GitHub Actions** | CI/CD — auto-deploy when you push to main |
| **ESLint + Prettier** | Code quality and formatting |
| **Husky** | Pre-commit hooks — run linting before every commit |
| **.env management** | Never commit secrets — use dotenv + hosting env vars |

---

## 5. Feature Roadmap

### 🟢 Phase 1 — Foundation (MVP)
- [x] ~~Basic Gemini query~~ (already exists)
- [x] User registration and login (Email/Password)
- [x] Google OAuth login
- [x] User profile (name, current role, experience level)
- [x] Save roadmap to database
- [x] View past roadmaps in a history panel
- [x] Delete a roadmap

### 🟡 Phase 2 — Core Features
- [x] **Interactive Roadmap UI** — Visual step-by-step roadmap with checkboxes
- [x] **Progress Tracker** — Mark steps as complete, see % completion
- [x] **Skills Input** — User sets their current skills before querying
- [ ] **AI Chat** — Ongoing conversation with the AI mentor (not just one-shot queries)
- [x] **Streaming Responses** — Token-by-token output like ChatGPT
- [x] **Short/Detailed toggle** — Already exists, improve it

### 🔴 Phase 3 — Advanced Features
- [ ] **Skills Gap Analyzer** — User inputs current skills + target role, AI shows the gap
- [ ] **Resume Analyzer** — Upload PDF resume, AI suggests improvements
- [ ] **Job Market Insights** — Show trending skills, average salaries for roles
- [ ] **Resource Recommendations** — AI suggests specific courses (Udemy, freeCodeCamp, etc.)
- [ ] **Bookmark Resources** — Save recommended resources
- [ ] **Dashboard** — Overview of all active roadmaps, progress, recent activity
- [ ] **Dark/Light Mode**

### ⚡ Phase 4 — Wow Factor
- [ ] **AI Voice Mentor** — Talk to the AI using your microphone (Web Speech API)
- [ ] **Community Roadmaps** — Users can share and fork roadmaps
- [ ] **Weekly AI Check-ins** — AI emails you weekly progress summaries
- [ ] **Streak System** — Gamified learning streaks like Duolingo

---

## 6. Database Design & Schema

> Schema is designed in PostgreSQL. All tables follow best practices: UUIDs as primary keys, timestamps, soft deletes where appropriate.

### How to Think About Schema Design

1. **Identify your entities** (nouns in your feature list: User, Roadmap, Step, Progress, Chat, Message)
2. **Define relationships** (A User has many Roadmaps. A Roadmap has many Steps. A User tracks Progress on Steps.)
3. **Draw an ER diagram** before writing SQL
4. **Add indexes** on columns you'll frequently filter/search by
5. **Use constraints** (NOT NULL, UNIQUE, FOREIGN KEY) to keep data clean

---

### Tables

#### `users`
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),              -- NULL if using OAuth
  full_name     VARCHAR(255) NOT NULL,
  avatar_url    TEXT,
  experience    VARCHAR(50),               -- 'beginner' | 'intermediate' | 'advanced'
  current_role  VARCHAR(100),              -- e.g., 'Student', 'Junior Dev'
  target_role   VARCHAR(100),              -- e.g., 'Full Stack Engineer'
  provider      VARCHAR(50) DEFAULT 'email',  -- 'email' | 'google'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### `skills`
```sql
CREATE TABLE skills (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) UNIQUE NOT NULL,  -- 'React', 'Python', 'SQL'
  category   VARCHAR(100),                  -- 'Frontend', 'Backend', 'AI/ML'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `user_skills`
```sql
-- Junction table: which skills does a user have?
CREATE TABLE user_skills (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id   UUID REFERENCES skills(id) ON DELETE CASCADE,
  level      VARCHAR(50) DEFAULT 'beginner',  -- 'beginner' | 'intermediate' | 'expert'
  PRIMARY KEY (user_id, skill_id)
);
```

#### `roadmaps`
```sql
CREATE TABLE roadmaps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,          -- e.g., "MERN Stack Roadmap"
  target_role VARCHAR(255),
  query       TEXT NOT NULL,                  -- original user query
  ai_raw      TEXT,                           -- full AI response (backup)
  is_public   BOOLEAN DEFAULT FALSE,          -- for community sharing feature
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_roadmaps_user ON roadmaps(user_id);
```

#### `roadmap_steps`
```sql
CREATE TABLE roadmap_steps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id  UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,          -- e.g., "Learn JavaScript Basics"
  description TEXT,
  resources   JSONB,                          -- [{title, url, type}]
  order_index INTEGER NOT NULL,               -- step 1, 2, 3...
  phase       VARCHAR(50),                    -- 'foundation' | 'intermediate' | 'advanced'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_steps_roadmap ON roadmap_steps(roadmap_id);
```

#### `user_progress`
```sql
CREATE TABLE user_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  step_id     UUID REFERENCES roadmap_steps(id) ON DELETE CASCADE,
  status      VARCHAR(50) DEFAULT 'not_started',  -- 'not_started' | 'in_progress' | 'completed'
  completed_at TIMESTAMPTZ,
  notes       TEXT,                               -- user's personal notes on this step
  UNIQUE(user_id, step_id)
);
```

#### `chat_sessions`
```sql
CREATE TABLE chat_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  roadmap_id  UUID REFERENCES roadmaps(id),      -- optionally linked to a roadmap
  title       VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

#### `chat_messages`
```sql
CREATE TABLE chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        VARCHAR(20) NOT NULL,               -- 'user' | 'assistant'
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_session ON chat_messages(session_id);
```

#### `bookmarks`
```sql
CREATE TABLE bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  url         TEXT NOT NULL,
  type        VARCHAR(50),                        -- 'course' | 'article' | 'video'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Relationships Summary (ER Diagram in Text Form)

```
users ──< user_skills >── skills
  │
  ├──< roadmaps ──< roadmap_steps
  │                      │
  │                      └──< user_progress
  │
  ├──< chat_sessions ──< chat_messages
  │
  └──< bookmarks
```

---

## 7. UI/UX Design Plan

### Design System

| Element | Value |
|---------|-------|
| **Primary Font** | `Inter` or `Geist` (from Google Fonts) |
| **Color Palette** | Dark: `#0A0A0F` bg, `#6C63FF` primary accent (purple-blue), `#00D4FF` secondary (cyan) |
| **Border Radius** | `12px` for cards, `8px` for inputs, `999px` for pills |
| **Glassmorphism** | `backdrop-filter: blur(12px)` + semi-transparent backgrounds |
| **Shadows** | Glow effects using `box-shadow` with accent colors |
| **Motion** | Framer Motion for page transitions, Lottie for loader animations |

---

### Pages / Screens

#### 1. Landing Page (`/`)
- Hero section: Bold headline, animated text, "Get Started" CTA
- Feature highlights: 3-4 feature cards with icons
- How it works: 3-step visual flow
- Testimonials (placeholder initially)
- Footer

#### 2. Auth Pages (`/login`, `/register`)
- Clean, minimal centered card
- Email/password + Google OAuth button
- Smooth transition animations

#### 3. Onboarding (`/onboarding`)
- Step 1: "What's your current role?"
- Step 2: "What's your experience level?" (Beginner / Intermediate / Advanced)
- Step 3: "Select your current skills" (chip-style multi-select)
- Step 4: "What's your goal?" (target role input)
- Progress bar at top

#### 4. Dashboard (`/dashboard`)
- Greeting with user name
- Active roadmaps (card grid with progress bars)
- Quick "Ask AI" input bar
- Recent chat sessions
- Skills overview

#### 5. Roadmap View (`/roadmap/:id`)
- Timeline/stepper UI showing all steps vertically
- Each step: expandable card with description, resources, checkbox to mark complete
- Progress percentage at top
- "Chat with AI about this step" button

#### 6. AI Chat (`/chat`)
- ChatGPT-style chat interface
- Message bubbles (user right, AI left)
- Streaming text (typing effect)
- Session history sidebar on the left

#### 7. Profile (`/profile`)
- Avatar, name, role
- Skills management (add/remove)
- Account settings

---

### Component Architecture

```
src/
├── components/
│   ├── ui/           # Reusable: Button, Input, Card, Badge, Modal
│   ├── layout/       # Navbar, Sidebar, Footer, PageWrapper
│   ├── roadmap/      # RoadmapCard, StepCard, ProgressBar, Timeline
│   ├── chat/         # ChatBubble, ChatInput, SessionList
│   └── auth/         # LoginForm, RegisterForm, GoogleOAuthBtn
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Onboarding.jsx
│   ├── Dashboard.jsx
│   ├── RoadmapView.jsx
│   ├── Chat.jsx
│   └── Profile.jsx
├── hooks/            # useAuth, useRoadmap, useChat, useProgress
├── store/            # Zustand global state
├── services/         # api.js (Axios instance), auth.js
└── utils/            # helpers, formatters, constants
```

---

## 8. API Design

### Auth Routes
```
POST   /api/auth/register        → Create account
POST   /api/auth/login           → Login, return JWT
POST   /api/auth/google          → Google OAuth callback
POST   /api/auth/refresh         → Refresh access token
POST   /api/auth/logout          → Invalidate refresh token
GET    /api/auth/me              → Get current user profile
```

### User Routes
```
PUT    /api/user/profile         → Update profile
PUT    /api/user/skills          → Update user skills
GET    /api/user/stats           → Get dashboard stats
```

### Roadmap Routes
```
POST   /api/roadmaps             → Generate new roadmap (calls Gemini)
GET    /api/roadmaps             → Get all user's roadmaps
GET    /api/roadmaps/:id         → Get single roadmap with steps
DELETE /api/roadmaps/:id         → Delete roadmap
PATCH  /api/roadmaps/:id/progress → Update step progress
```

### Chat Routes
```
POST   /api/chat/sessions        → Start new chat session
GET    /api/chat/sessions        → List all sessions
GET    /api/chat/sessions/:id    → Get session + messages
POST   /api/chat/sessions/:id/message → Send message (streams back)
```

### Bookmarks
```
GET    /api/bookmarks            → Get all bookmarks
POST   /api/bookmarks            → Add bookmark
DELETE /api/bookmarks/:id        → Remove bookmark
```

---

## 9. AI Integration Strategy

### Current (Bad) Approach
```
User types → Basic if/else keyword match → One Gemini call → Text dump
```

### New (Good) Approach

#### 1. Context-Rich Prompting
Before calling Gemini, build a rich context object from the database:
```json
{
  "user": {
    "experience": "beginner",
    "currentRole": "CS Student",
    "targetRole": "Full Stack Developer",
    "currentSkills": ["HTML", "CSS", "basic Python"]
  },
  "query": "I want to become a MERN stack developer"
}
```
Then inject this into the prompt so the AI gives *personalized* advice.

#### 2. Structured Output
Instead of free-form text, prompt Gemini to return **JSON**:
```json
{
  "title": "MERN Stack Roadmap",
  "phases": [
    {
      "name": "Foundation",
      "steps": [
        {
          "title": "JavaScript Fundamentals",
          "description": "...",
          "resources": [
            { "title": "JavaScript.info", "url": "https://javascript.info", "type": "article" }
          ],
          "estimatedDays": 14
        }
      ]
    }
  ]
}
```
Then parse this JSON and save each step to the `roadmap_steps` table.

#### 3. Streaming
Use Gemini's streaming API so the response appears token by token:
```js
const stream = await gemini.generateContentStream(prompt);
for await (const chunk of stream) {
  res.write(chunk.text()); // Stream to client
}
```

#### 4. Conversation Memory with LangChain
For the chat feature, use LangChain.js to maintain conversation history:
- Load last N messages from DB
- Pass them as context to Gemini
- This makes the AI remember what was said earlier in the conversation

#### 5. Caching with Redis
Cache AI responses for identical queries to save API costs:
```
Key:   hash(userId + query + responseType)
Value: AI response JSON
TTL:   24 hours
```

---

## 10. Honest AI — The "Brutal Truth" Mentor Philosophy

> **Core Idea:** Most AI tools are people-pleasers. They say "Great question! You can definitely do it!" even when the honest answer is "That path takes 2 years and the market is oversaturated right now." This app will be different — it will tell users the real, uncomfortable, actionable truth.

This is not just a philosophical choice. It is a **product differentiator**. Users will trust this app more because it doesn't lie to them.

---

### Why AI Models Are Sycophantic By Default

Large Language Models like Gemini are trained using **RLHF (Reinforcement Learning from Human Feedback)**. During training, human raters rate responses — and they tend to rate *agreeable, positive* responses higher. Over time the model learns: *"Users prefer soft, validating answers."*

The result: Ask an AI "Can I become a software engineer in 30 days?" and it will say *"It's challenging but with dedication, you absolutely can..."* — which is **dishonest**.

---

### The Honest AI Principles (for this app)

1. **No false encouragement** — If a goal is unrealistic given the user's current level and timeline, say so directly
2. **Market-grounded answers** — Base career advice on actual job market data, not theory
3. **Quantify everything** — Give real numbers: timelines, salary ranges, job opening counts, competition level
4. **Name the hard truths** — "This role is oversaturated," "This skill is declining," "Most bootcamp grads don't get hired" — only if true
5. **Still be constructive** — Honest ≠ cruel. Every hard truth comes with a concrete alternative path
6. **No hedging** — Ban phrases like "It depends," "You could potentially," "Some people say" unless truly necessary

---

### How to Implement This Technically

#### Step 1: The System Prompt (Most Important)

The **system prompt** is the hidden instruction you give the AI before every conversation. This is where you define the AI's personality and rules. This is the single most powerful lever you have.

Here is the actual system prompt to use:

```js
const HONEST_MENTOR_SYSTEM_PROMPT = `
You are an AI career mentor called "TruthMentor". Your role is to give brutally honest, 
data-grounded career guidance to aspiring tech professionals.

Your core principles:

1. HONESTY OVER COMFORT
   - Never sugarcoat. If a goal is unrealistic, say so clearly with reasons.
   - Do not start responses with praise ("Great question!", "Absolutely!", "Sure!")
   - Do not use filler phrases like "It's a journey", "You've got this", "Believe in yourself"

2. GROUND EVERYTHING IN REALITY
   - Reference real job market conditions (e.g., "The 2024-2025 tech layoffs reduced entry-level hiring by ~35%")
   - Mention actual competition levels (e.g., "A junior React role in India gets 500+ applicants on average")
   - Give realistic timelines based on hours of focused study, not motivation
   - If you don't have current data, say so — don't invent statistics

3. QUANTIFY ALWAYS
   - Bad: "It might take some time"
   - Good: "At 3 hours/day of focused practice, this skill takes 4-6 months to reach employable level"
   - Give salary ranges with location context
   - Give rough demand scores (High / Medium / Low / Declining)

4. NAME THE HARD TRUTHS
   - If a tech stack is declining, say: "This stack is losing job market share. Here's what's replacing it."
   - If a user's timeline is impossible: "You cannot become a production-ready ML engineer in 3 months. No one can. Here is a realistic 18-month path instead."
   - If a role is oversaturated: "Entry-level data science is extremely competitive in 2025. Most applicants have degrees + projects + internships. Factor this in."

5. ALWAYS GIVE A CONSTRUCTIVE PATH
   - Every hard truth must be followed by: "Here's what you can actually do:"
   - Give specific, actionable next steps
   - Prioritize steps by impact, not by ease

6. BANNED BEHAVIORS
   - Do not say "It depends" without immediately explaining what it depends on and giving a direct answer anyway
   - Do not validate bad plans just to be nice
   - Do not list 20 options when the user needs 1 clear recommendation
   - Do not use corporate jargon or motivational poster language

User context you will receive:
- Their current skills and experience level
- Their target role
- Their timeline/urgency
- Their prior conversation (for context)

Always factor this context into your answer. A beginner asking how to become a CTO 
does not need the same answer as a senior engineer asking the same question.
`;
```

---

#### Step 2: Inject User Context Into Every Request

Before sending any message to Gemini, build a context block from the database and prepend it:

```js
function buildUserContext(user, skills) {
  return `
--- USER CONTEXT ---
Name: ${user.full_name}
Current Role: ${user.current_role || 'Not specified'}
Experience Level: ${user.experience} (${getExperienceDescription(user.experience)})
Target Role: ${user.target_role || 'Not specified'}
Current Skills: ${skills.map(s => s.name).join(', ') || 'None listed'}
Skills They Lack for Target Role: [computed gap from DB]
--- END CONTEXT ---

Now respond to the user's message below with full honesty given this context:
  `;
}
```

This means the AI never gives generic advice — it always responds knowing exactly who it's talking to.

---

#### Step 3: Grounding With Real-World Data

To make the AI's claims actually accurate, integrate **live data sources**:

| Data Source | What it gives | How to use |
|-------------|--------------|------------|
| **Gemini with Google Search Grounding** | Real-time web search results injected into the response | Enable `tools: [{ googleSearch: {} }]` in the Gemini API call |
| **LinkedIn Job Count API** (unofficial scrape) | Real job opening counts per role/location | Call periodically, cache in DB, inject into prompt |
| **Stack Overflow Developer Survey** | Annual data on most loved/paid/used languages | Fetch once, store in DB, reference in prompts |
| **TIOBE / GitHub Octoverse** | Language popularity trends | Same as above |

**How to enable Google Search Grounding in Gemini:**
```js
const response = await geminiClient.generateContent({
  contents: [{ role: 'user', parts: [{ text: userMessage }] }],
  tools: [{ googleSearch: {} }],   // <-- This is all you need
  systemInstruction: HONEST_MENTOR_SYSTEM_PROMPT,
});
```

With this enabled, Gemini will automatically search Google for current information and cite its sources in the response. Your users will see things like:
> *"According to the 2024 Stack Overflow survey, Rust is the most loved language for the 9th consecutive year, but it has only ~8K job openings globally — vs 400K+ for JavaScript."*

That's the difference between hallucinated generic advice and grounded truth.

---

#### Step 4: Anti-Sycophancy Response Validation (Optional but Powerful)

You can add a second AI call that **reviews** the first response and flags sycophantic language:

```js
async function validateHonesty(response) {
  const validationPrompt = `
    Review the following AI career advice response.
    Flag any of these sycophantic patterns:
    - Unprompted praise ("Great question!", "Absolutely!")
    - Vague encouragement without data ("You can do it!")
    - Unrealistic timelines presented as achievable
    - Missing the hard truth the user needs to hear
    - Wishy-washy "it depends" without a direct answer

    Response to review:
    "${response}"

    Return JSON: { isHonest: boolean, issues: string[], fixedResponse: string }
  `;

  const validation = await callGemini(validationPrompt);
  if (!validation.isHonest) {
    return validation.fixedResponse; // Use the fixed version
  }
  return response;
}
```

This is an **AI-reviewing-AI** pattern and it's actually used in production systems.

---

#### Step 5: UI — Make the Honesty Visible

The honesty philosophy should be visible in the UI too — it sets user expectations:

- **On the landing page:** "We don't sugarcoat. We give you the real picture."
- **On the chat page:** A small badge next to the AI avatar: `🔴 Honest Mode — No Fluff`
- **In responses:** Visually distinguish hard truths with a different-colored callout box:
  ```
  ⚠️  Hard Truth
  ┌────────────────────────────────────────────────────────────┐
  │  The "learn ML in 30 days" YouTube thumbnails are lying.  │
  │  Production ML engineers have an average of 3.2 years of  │
  │  experience. Here's the realistic path instead:           │
  └────────────────────────────────────────────────────────────┘
  ```
- **Tone setting on first chat:** The AI introduces itself: *"I'm TruthMentor. I don't do motivational speeches. I'll tell you exactly what the job market looks like and what you actually need. Ready?"*

---

### What This Looks Like in Practice

**User asks:** *"Can I become a data scientist in 2 months?"*

❌ **Typical AI response (sycophantic):**
> "Data science is an exciting field! While 2 months is a tight timeline, with dedication and the right resources, you can definitely make significant progress. Start with Python, then learn pandas and scikit-learn..."

✅ **TruthMentor response (honest):**
> **Short answer: No.** A hireable data scientist in 2 months is not realistic — here's why with numbers:
> - The average data science job posting requires 2+ years experience + a degree or equivalent portfolio
> - Entry-level DS roles get 300-800 applicants. Most have multiple projects, Kaggle rankings, or a relevant degree
> - 2 months ≈ ~120 hours at 2hrs/day. Python basics alone take 80-100 hours to reach competence
>
> **What you CAN do in 2 months:**
> Become job-ready for a junior data analyst role (different from data scientist, but a real stepping stone):
> - Week 1-2: Python + Pandas fundamentals
> - Week 3-4: SQL (this alone gets you interviews)
> - Week 5-6: Excel/Google Sheets, basic stats
> - Week 7-8: Build 1 real analysis project with a public dataset and put it on GitHub
>
> That path is honest. That path gets results.

---

### Database Addition for This Feature

Add a `mentor_tone` setting to the `users` table:

```sql
ALTER TABLE users ADD COLUMN mentor_tone VARCHAR(20) DEFAULT 'honest';
-- Values: 'honest' (default) | 'balanced' | 'encouraging'
-- Most users will keep 'honest'. Some may prefer 'balanced'.
-- 'encouraging' is still honest but gentler in delivery — for users who explicitly want it.
```

This gives users agency while defaulting to honesty.

---

## 11. Deployment & Hosting Plan

| Service | What For | Cost |
|---------|----------|------|
| **Vercel** | Frontend (React) | Free |
| **Railway** | Backend (Node.js) | Free tier / $5/mo |
| **InsForge** | PostgreSQL Database & Auth | Free tier |
| **Upstash** | Redis (serverless) | Free tier |
| **Cloudinary** | Avatar image storage | Free tier |
| **GitHub Actions** | CI/CD pipeline | Free |

### Environment Variables Needed
```env
# Server
PORT=5000
NODE_ENV=production
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=another_secret

# Database
DATABASE_URL=postgresql://...   (from InsForge)

# AI
GEMINI_API_KEY=your_key

# Redis
REDIS_URL=rediss://...   (from Upstash)

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Client
VITE_API_URL=https://your-backend.railway.app
```

---

## 12. Phase-wise Development Plan

### Phase 1 — Foundation (Week 1-2)

**Goal:** Auth + Database working. Nothing fancy, just solid.

- [x] Set up InsForge project and get DB URL
- [x] Create all tables using SQL migrations
- [x] Implement register + login endpoints with JWT *(Handled via InsForge Auth)*
- [x] Add Google OAuth *(Configured via InsForge)*
- [x] Build Login and Register pages in React (Vite)
- [x] Protect routes — redirect unauthenticated users
- [x] Test all auth flows

**Milestone:** You can sign up, log in, and access a protected page. ✅

---

### Phase 2 — Core AI Feature (Week 3)

**Goal:** Roadmap generation with saving and history.

- [x] Build the roadmap generation logic
- [x] Use context-rich prompting (pull user skills from DB)
- [x] Parse structured JSON from Gemini / Claude response
- [x] Save roadmap + steps to PostgreSQL
- [x] Build Roadmap History page (Dashboard view)
- [x] Build Roadmap View page (stepper/timeline UI)
- [x] Implement progress tracking (checkboxes → DB)

**Milestone:** User can generate a personalized roadmap, see it visually, and track progress. ✅

---

### Phase 3 — AI Chat (Week 4)

**Goal:** A real conversational AI mentor.

- [ ] Set up chat sessions table
- [ ] Build chat API with streaming support
- [ ] Implement conversation memory with LangChain
- [ ] Build ChatGPT-style UI
- [ ] Add session history sidebar

**Milestone:** User can have a multi-turn conversation with the AI that remembers context.

---

### Phase 4 — Dashboard & Polish (Week 5)

**Goal:** Make it feel like a real product.

- [ ] Build the main dashboard
- [ ] Add user onboarding flow
- [ ] Build profile + skills management
- [ ] Add bookmarks feature
- [ ] Implement Redis caching
- [ ] Mobile responsive design
- [ ] Dark/light mode toggle
- [ ] Error boundaries and loading states
- [ ] Add landing page

**Milestone:** App is feature-complete and looks production-ready.

---

### Phase 5 — Deploy & Ship (Week 6)

**Goal:** Live, working product on the internet.

- [ ] Set up GitHub Actions for auto-deploy
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Set all environment variables in hosting dashboards
- [ ] Configure CORS for production URLs
- [ ] Run end-to-end tests on production
- [ ] Write final README with live demo link

**Milestone:** The app is live. Anyone can use it.

---

## 📝 Summary: What Makes This Resume-Worthy

When this is done, you can say:

> *"Built a full-stack AI career mentoring platform using React, Node.js, PostgreSQL (InsForge), and Google Gemini API with LangChain. Features include JWT + Google OAuth authentication, personalized AI-generated roadmaps with progress tracking, a streaming AI chat interface with conversation memory, and Redis caching for API optimization. Deployed on Vercel + Railway with a CI/CD pipeline via GitHub Actions."*

That is a project that will make interviewers stop and ask follow-up questions.

---

*Plan created: May 2026 | Status: 🚧 In Progress*
