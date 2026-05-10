# 🛠️ InsForge Documentation & Project Knowledge Base

> **What is this file?**
> This file is a living document tracking everything we do with **InsForge** in the TruthMentor project. Since InsForge is a bleeding-edge AI-native Backend-as-a-Service (BaaS), not all of its documentation is easily found on Google. This document ensures you (and any future developers) understand exactly how we set it up, how to interact with it, and what features we are using.

---

## 📌 1. What is InsForge?

InsForge is an **open-source, AI-native Backend-as-a-Service (BaaS)**. 
Think of it like Supabase or Firebase, but specifically architected so that AI agents (like Claude or Gemini) can seamlessly read its structure, configure it, and write code against it via the **Model Context Protocol (MCP)**.

### Features we are using:
- **Database:** PostgreSQL (with PostgREST API)
- **Authentication:** Email/Password & OAuth
- **Row Level Security (RLS):** Database-level security ensuring users only see their own data
- **AI Integration SDK:** Direct access to models like Claude 3.5, Gemini 3 Pro, and OpenAI directly through the InsForge backend (potentially bypassing the need for separate API keys).

---

## 🚀 2. Project Setup & Configuration

Here are the crucial details for our project. **Do not lose these.**

| Key | Value |
|-----|-------|
| **Project Name** | `Truth-Mentor` |
| **Project ID** | `075fc7fb-39f1-4731-9bcc-5225f9aa7149` |
| **Region** | `us-east` |
| **API URL** | `https://hw4jc9m9.us-east.insforge.app` |
| **Anon Key** | `[YOUR_ANON_KEY_HERE]` |
| **PostgreSQL Connection URL** | `postgresql://postgres:[YOUR_DB_PASSWORD]@hw4jc9m9.us-east.database.insforge.app:5432/insforge?sslmode=require` |

---

## 💻 3. InsForge CLI Cheat Sheet

We manage InsForge entirely via its CLI (`@insforge/cli`). Here are the commands we've used and what they do:

### Authentication & Linking
- `npx @insforge/cli login --user-api-key <key>`: Log into the CLI.
- `npx @insforge/cli link --project-id <id>`: Link the current directory to the cloud project.
- `npx @insforge/cli current --json`: See the currently authenticated user and linked project details.

### Database & Migrations
- `npx @insforge/cli db query "<sql>"`: Run a raw SQL query.
- `npx @insforge/cli db tables`: List all tables in the database.
- `npx @insforge/cli db policies`: List all Row Level Security (RLS) policies.
- `npx @insforge/cli db connection-string`: Print the Postgres connection URL.
- `npx @insforge/cli db migrations new <name>`: Create a new local SQL migration file in the `migrations/` folder.
- `npx @insforge/cli db migrations up --all -y`: Apply all unapplied local migrations to the cloud database.

### Reading Documentation via CLI (Crucial for AI Agents)
The CLI has built-in documentation that AI agents can read.
- `npx @insforge/cli docs instructions`: Read the setup guide.
- `npx @insforge/cli docs db-sdk`: Read the Database SDK guide.
- `npx @insforge/cli docs auth-sdk`: Read the Authentication SDK guide.
- `npx @insforge/cli docs ai-integration-sdk`: Read the AI SDK guide.

---

## 🗄️ 4. What are Database Migrations? (DO NOT DELETE THEM)

If you look in the project folder, you will see a `migrations/` folder (e.g., `migrations/20260509234006_initial-schema.sql`). 

**Question:** *Can I delete these files once they are applied?*
**Answer:** **NO! Never delete migration files.**

### Why are they important? (A Noob-Friendly Explanation)
Think of your database like a house. 
- A **Migration** is the architectural blueprint for building a specific room.
- If you build the kitchen, and then throw away the blueprint, your house still has a kitchen. BUT, if a new developer joins your team and needs to build an exact copy of your house on their computer, they can't do it because the blueprints are gone.

Migration files act as **version control for your database**. 
1. **History:** They tell the story of how your database evolved over time (first we added users, then we added roadmaps, etc.).
2. **Teamwork:** If someone else clones this project, they just run `npx @insforge/cli db migrations up --all` and their local database will instantly match yours.
3. **Safety:** If you mess up your cloud database, you can always delete it, create a new one, and run the migrations to instantly rebuild all your tables, rules, and seed data.

**The Golden Rule:** Treat the `migrations/` folder exactly like you treat your source code. Commit it to GitHub, and never manually edit an old migration file once it has been applied to the cloud. If you need to change a table later, you create a *new* migration file.

---

## 🏗️ 5. What We Have Built So Far (Database Schema)

We successfully created our initial database schema and applied it via a migration file (`migrations/20260509234006_initial-schema.sql`). 

### Tables Created:
1. `profiles`: Extends the built-in auth users table with `experience`, `current_position`, `target_role`, and `mentor_tone`.
2. `skills`: A pre-populated list of 42 tech skills.
3. `user_skills`: Junction table tracking which skills a user possesses.
4. `roadmaps`: Stores the AI-generated career roadmaps.
5. `roadmap_steps`: The individual steps inside a roadmap.
6. `user_progress`: Tracks which steps a user has checked off.
7. `chat_sessions`: Groups chat messages into specific conversations.
8. `chat_messages`: The actual messages between the user and the AI mentor.
9. `bookmarks`: Links/resources the user has saved.

### Security (Row Level Security - RLS)
We enabled RLS on every table. This means even if someone gets our Anon API key, they cannot query another user's data. 
- Example Policy: `CREATE POLICY profiles_select ON profiles FOR SELECT USING (auth.uid() = id);`

---

## 📝 6. How to Write Code with InsForge SDK (Reference)

When we start writing our frontend (React/Node.js), we will use the `@insforge/sdk`. Here is a quick reference based on the docs we pulled:

### Initialization
```typescript
import { createClient } from '@insforge/sdk';

const insforge = createClient({
  baseUrl: process.env.VITE_INSFORGE_API_URL,
  anonKey: process.env.VITE_INSFORGE_ANON_KEY
});
```

### Database Queries
```typescript
// Fetch a user's roadmaps
const { data, error } = await insforge.database
  .from('roadmaps')
  .select('*')
  .eq('user_id', userId);

// Insert a new progress record
const { error } = await insforge.database
  .from('user_progress')
  .insert([{ user_id: userId, step_id: stepId, status: 'completed' }]);
```

### Calling AI Models Directly
InsForge has AI built-in. We can actually do this instead of making a separate Axios call to Gemini:
```typescript
const completion = await insforge.ai.chat.completions.create({
  model: 'anthropic/claude-sonnet-4.5', // or google/gemini-3-pro
  messages: [{ role: 'user', content: 'Give me a brutally honest roadmap for React' }],
});
console.log(completion.choices[0].message.content);
```

---

## ⏭️ 7. Next Steps Log

*Last updated: Phase 2 (Auth & Roadmaps Completed)*

1. [x] Log into InsForge CLI
2. [x] Link Project
3. [x] Create Initial Database Schema (Tables, RLS, Seed Data)
4. [x] Apply Migration to Cloud Database
5. [x] Initialize the new frontend structure (React/Vite).
6. [x] Install `@insforge/sdk` and set up authentication UI with secure protected routes.
7. [x] Implement AI Roadmap generation (JSON streaming) and interactive progress tracking.
8. [ ] (Up Next) Begin Phase 3: AI Chat feature with conversation memory and persistent session history.
