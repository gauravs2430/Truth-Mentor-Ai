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


## 🤖 8. Agent Instructions (from AGENTS.md)

---
description: Instructions building apps with MCP
globs: *
alwaysApply: true
---

# InsForge SDK Documentation - Overview

## What is InsForge?

Backend-as-a-service (BaaS) platform providing:

- **Database**: PostgreSQL with PostgREST API
- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Storage**: File upload/download
- **AI**: Chat completions and image generation (OpenAI-compatible)
- **Functions**: Serverless function deployment
- **Realtime**: WebSocket pub/sub (database + client events)

## Installation

The following is a step-by-step guide to installing and using the InsForge TypeScript SDK for Web applications. If you are building other types of applications, please refer to:
- [Swift SDK documentation](/sdks/swift/overview) for iOS, macOS, tvOS, and watchOS applications.
- [Kotlin SDK documentation](/sdks/kotlin/overview) for Android applications.
- [REST API documentation](/sdks/rest/overview) for direct HTTP API access.

### 🚨 CRITICAL: Follow these steps in order

### Step 1: Download Template

Use the `download-template` MCP tool to create a new project with your backend URL and anon key pre-configured.

### Step 2: Install SDK

```bash
npm install @insforge/sdk@latest
```

### Step 3: Create SDK Client

You must create a client instance using `createClient()` with your base URL and anon key:

```javascript
import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://your-app.region.insforge.app',  // Your InsForge backend URL
  anonKey: 'your-anon-key-here'       // Get this from backend metadata
});

```

**API BASE URL**: Your API base URL is `https://your-app.region.insforge.app`.

## Getting Detailed Documentation

### 🚨 CRITICAL: Always Fetch Documentation Before Writing Code

InsForge provides official SDKs and REST APIs, use them to interact with InsForge services from your application code.

- [TypeScript SDK](/sdks/typescript/overview) - JavaScript/TypeScript
- [Swift SDK](/sdks/swift/overview) - iOS, macOS, tvOS, and watchOS
- [Kotlin SDK](/sdks/kotlin/overview) - Android and Kotlin Multiplatform
- [REST API](/sdks/rest/overview) - Direct HTTP API access

Before writing or editing any InsForge integration code, you **MUST** call the `fetch-docs` or `fetch-sdk-docs` MCP tool to get the latest SDK documentation. This ensures you have accurate, up-to-date implementation patterns.

### Use the InsForge `fetch-docs` MCP tool to get specific SDK documentation:

Available documentation types:

- `"instructions"` - Essential backend setup (START HERE)
- `"real-time"` - Real-time pub/sub (database + client events) via WebSockets
- `"db-sdk-typescript"` - Database operations with TypeScript SDK
- **Authentication** - Choose based on implementation:
  - `"auth-sdk-typescript"` - TypeScript SDK methods for custom auth flows
  - `"auth-components-react"` - Pre-built auth UI for React+Vite (singlepage App)
  - `"auth-components-react-router"` - Pre-built auth UI for React(Vite+React Router) (Multipage App)
  - `"auth-components-nextjs"` - Pre-built auth UI for Nextjs (SSR App)
- `"storage-sdk"` - File storage operations
- `"functions-sdk"` - Serverless functions invocation
- `"ai-integration-sdk"` - AI chat and image generation
- `"real-time"` - Real-time pub/sub (database + client events) via WebSockets
- `"deployment"` - Deploy frontend applications via MCP tool

These documentations are mostly for TypeScript SDK. For other languages, you can also use `fetch-sdk-docs` mcp tool to get specific documentation.

### Use the InsForge `fetch-sdk-docs` MCP tool to get specific SDK documentation

You can fetch sdk documentation using the `fetch-sdk-docs` MCP tool with specific feature type and language.

Available feature types:
- db - Database operations
- storage - File storage operations
- functions - Serverless functions invocation
- auth - User authentication
- ai - AI chat and image generation
- realtime - Real-time pub/sub (database + client events) via WebSockets

Available languages:
- typescript - JavaScript/TypeScript SDK
- swift - Swift SDK (for iOS, macOS, tvOS, and watchOS)
- kotlin - Kotlin SDK (for Android and JVM applications)
- rest-api - REST API

## When to Use SDK vs MCP Tools

### Always SDK for Application Logic:

- Authentication (register, login, logout, profiles)
- Database CRUD (select, insert, update, delete)
- Storage operations (upload, download files)
- AI operations (chat, image generation)
- Serverless function invocation

### Use MCP Tools for Infrastructure:

- Project scaffolding (`download-template`) - Download starter templates with InsForge integration
- Backend setup and metadata (`get-backend-metadata`)
- Database schema management (`run-raw-sql`, `get-table-schema`)
- Storage bucket creation (`create-bucket`, `list-buckets`, `delete-bucket`)
- Serverless function deployment (`create-function`, `update-function`, `delete-function`)
- Frontend deployment (`create-deployment`) - Deploy frontend apps to InsForge hosting

## Important Notes

- For auth: use `auth-sdk` for custom UI, or framework-specific components for pre-built UI
- SDK returns `{data, error}` structure for all operations
- Database inserts require array format: `[{...}]`
- Serverless functions have single endpoint (no subpaths)
- Storage: Upload files to buckets, store URLs in database
- AI operations are OpenAI-compatible
- **EXTRA IMPORTANT**: Use Tailwind CSS 3.4 (do not upgrade to v4). Lock these dependencies in `package.json`