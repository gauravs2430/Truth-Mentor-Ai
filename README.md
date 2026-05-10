<div align="center">
  
# 🧭 TruthMentor AI
**A Production-Grade, "Brutally Honest" AI Career Platform**

[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![InsForge](https://img.shields.io/badge/Backend-InsForge-FF0055?style=flat-square)](https://insforge.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![AI Models](https://img.shields.io/badge/AI_Model-Claude_3.5_&_Gemini_3-blueviolet?style=flat-square)](https://anthropic.com)

*"Stop getting sugarcoated advice. Get a realistic, data-driven roadmap to your dream career."*

</div>

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [The Problem & The Solution](#-the-problem--the-solution)
3. [Core Features](#-core-features)
4. [Tech Stack & Architecture](#-tech-stack--architecture)
5. [Why This Stack? (Engineering Decisions)](#-why-this-stack-engineering-decisions)
6. [How We Built It (Development Journey)](#-how-we-built-it-development-journey)
7. [Database Schema & Security](#-database-schema--security)
8. [Performance & Optimizations](#-performance--optimizations)
9. [Local Setup & Installation](#-local-setup--installation)

---

## 🔭 Project Overview

**TruthMentor** is a fully persistent, full-stack AI career mentoring platform. It goes beyond simple prompt-wrapping by utilizing a highly-structured relational database and context-injected AI prompting. 

Users input their current experience level and career goals, and the AI generates a multi-phase, step-by-step career roadmap. Users can check off milestones, save learning resources, and chat with a persistent AI mentor that remembers their specific journey and skills.

---

## 🎯 The Problem & The Solution

### ❌ The Problem
The market is flooded with simple "ChatGPT wrappers" that just forward a user's prompt to an LLM and return text. 
1. **Generic Advice:** AI tends to give sugarcoated, generic advice (e.g., *"Just learn HTML and you'll get a job!"*).
2. **No Memory:** Once you close the browser tab, the AI forgets everything about your career goals.
3. **Un-trackable:** You cannot track your progress on a massive wall of generated text.

### ✅ The Solution (TruthMentor)
1. **The "Brutal Truth" Philosophy:** We engineered custom system prompts forcing the AI to evaluate the current job market ruthlessly, preventing sycophantic or overly optimistic responses.
2. **Persistent Memory:** Using PostgreSQL, we save the user's profile, exact skills, and past chat histories. Before the AI responds, it pulls this context from the database, meaning it *remembers you*.
3. **Actionable Roadmaps:** The AI doesn't return a text blob. It returns structured JSON data which is parsed and saved into individual `roadmap_steps` in the database. The UI renders these as interactive checkboxes so users can actively track their career progression.

---

## ✨ Core Features

- 🔐 **Robust Authentication:** Secure Email/Password and OAuth (GitHub) integration natively handled.
- 🗺️ **Dynamic AI Roadmaps:** Generates multi-phase, step-by-step career roadmaps based on user skill gaps.
- 📈 **Progress Tracking:** Interactive UI allows users to check off roadmap milestones, saving progress instantly.
- 💬 **Context-Aware AI Mentor:** A conversational UI where the AI acts as a tough but fair mentor, recalling past advice.
- 🛡️ **Enterprise-Grade Security:** Row Level Security (RLS) ensures user data is mathematically isolated at the database level.
- 🎨 **Premium UI/UX:** Stunning, modern interface built with Tailwind CSS, featuring glassmorphism, dynamic animations, and dark-mode optimization.

---

## 🛠️ Tech Stack & Architecture

This application utilizes a modern, serverless-first architecture optimized for speed and AI integration.

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS (v3.4) + Custom CSS Animations
- **Icons:** Lucide React
- **Routing:** React Router v7

### Backend (InsForge BaaS)
- **Database:** PostgreSQL
- **Security:** Strict Row Level Security (RLS) policies
- **Auth:** InsForge Auth (JWT-based)
- **AI Gateway:** Direct integration with cutting-edge models (Claude 3.5 Sonnet, Gemini 3 Pro) via the `@insforge/sdk`.

---

## 🤔 Why This Stack? (Engineering Decisions)

1. **Why Vite + React?** 
   Vite provides instantaneous Hot Module Replacement (HMR). React gives us the component-driven architecture necessary to handle complex state (like checking off roadmap steps while chatting with an AI).
2. **Why Tailwind CSS?** 
   Utility-first CSS allows for rapid prototyping of complex "glassmorphism" designs without writing thousands of lines of custom CSS. It keeps the bundle size incredibly small.
3. **Why InsForge over Node.js/Express?** 
   Instead of writing thousands of lines of boilerplate Express code for user authentication, password hashing, and JWT validation, **InsForge** provides an out-of-the-box, highly scalable PostgreSQL backend. This allows us to focus entirely on the core business logic (the AI Mentor).
4. **Why Row Level Security (RLS)?**
   Since the frontend talks directly to the database via the InsForge SDK, RLS policies run *inside* Postgres to ensure that User A can never accidentally (or maliciously) fetch User B's career roadmap.

---

## 🏗️ How We Built It (Development Journey)

We treat this README as a living document. Here is our phase-by-phase execution:

- **Phase 1 (Foundation):** 
  - Migrated away from a basic Express server.
  - Initialized the InsForge project and architected a 9-table PostgreSQL schema.
  - Built the React frontend, configured Tailwind, and established a secure Authentication flow with Protected Routes.
- **Phase 2 (Roadmaps) - *Completed*:** 
  - Implemented the AI-to-JSON parsing pipeline to generate visual learning paths.
  - Built `RoadmapDetail` for tracking step-by-step progress with interactive completion toggles.
  - Updated the User Dashboard to fetch and display previously generated roadmaps.
- **Phase 3 (AI Chat) - *Upcoming*:** 
  - Integrating LangChain-style memory so the AI can recall past chat sessions.

## 🐛 Recent Bug Fixes

- **Authentication Race Condition:** Fixed an issue where manual React Router navigation was firing before the `@insforge/react` context synced the session, causing users to bounce back to the login screen.
- **Google OAuth Redirection:** Corrected the `signInWithOAuth` syntax required by the `@insforge/sdk` (moving `redirectTo` to the top level) to resolve `400 Bad Request` errors.
- **State Synchronization:** Ensured explicit logins happen via `useInsforge` context hooks rather than raw SDK calls so the frontend state updates reliably.

---

## 🗄️ Database Schema & Security

Our relational database is highly structured. Key tables include:
- `profiles` & `skills`: Maps what the user currently knows.
- `roadmaps` & `roadmap_steps`: Stores the AI-generated plan.
- `user_progress`: A junction table tracking what the user has completed.
- `chat_sessions` & `chat_messages`: Stores AI conversation history.

*For an in-depth breakdown and Entity-Relationship Diagram, please read [DatabaseSchema.md](./DatabaseSchema.md).*

---

## ⚡ Performance & Optimizations

1. **No Backend Bottleneck:** By bypassing a traditional Node server and querying the database directly from the edge via InsForge, we eliminate network hops, resulting in sub-100ms database reads.
2. **JSON Streaming:** When generating massive roadmaps, the AI streams the response chunk-by-chunk to the UI so the user doesn't wait 15 seconds staring at a loading spinner.
3. **Optimistic UI Updates:** When a user checks off a roadmap step, the UI updates instantly before the database confirms the write, providing a perfectly smooth user experience.

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- An InsForge Project (for the database and AI gateway)

### 1. Clone & Install
```bash
git clone https://github.com/gauravs2430/Truth-Mentor-Ai.git
cd Truth-Mentor-Ai/client
npm install
```

### 2. Environment Variables
Copy the example environment file and add your InsForge credentials:
```bash
cp ../.env.example ../.env.insForge
```
Ensure your `.env.insForge` file contains:
```env
VITE_INSFORGE_API_URL=your_api_url_here
VITE_INSFORGE_ANON_KEY=your_anon_key_here
```

### 3. Start the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port specified by Vite).

---
*Continuously built and updated by Gaurav.*
