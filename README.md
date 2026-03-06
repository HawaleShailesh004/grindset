# Grindset

**DSA revision companion: in-problem AI coach, workout logging, and spaced repetition so you stay interview-ready.**

---

## What it is

**Grindset** is a **Chrome extension + web app** that turns LeetCode into a structured loop: solve, get AI hints (no spoilers), log the workout, revise when due. One account and settings everywhere; optional auto-login when opening the site from the extension.
---

## Description

- **In-problem AI coach** — Chat (streaming) while you’re on a problem. The coach gives hints and asks what you’ve tried instead of handing out full solutions (“tough love” / spotter style). Optional Groq or OpenAI API key for your own quota; otherwise a shared daily limit.
- **Workout logging** — After solving, log confidence (Struggled / Okay / Crushed it), optional stopwatch, approach notes, and code. Backend can auto-fill pattern, complexity, and snippet from the conversation.
- **Spaced repetition** — Each log gets a `nextReviewAt` (1 / 3 / 7 days by confidence). The **dashboard** shows a review queue (due today / overdue) and “all” view with search and filters.
- **Web app** — Login, dashboard, revise-by-log pages, settings (password, AI provider and key, language, quick prompts), and “How it works.” Opening the site from the extension can pass a token so you’re **auto-logged in**.
- **Unified account** — Same user and settings (language, AI key, quick prompts) in extension and web via a single API and database.

---

## Target Users

| Role | Who they are | What they care about |
|------|----------------|------------------------|
| **Prep candidate** | Someone preparing for coding interviews (DSA). | Not forgetting patterns; knowing *when* to revise; getting hints without full answers. |
| **Product manager** | Evaluating the product. | Value prop, flows (solve → log → revise), differentiation from “just LeetCode + ChatGPT.” |
| **Engineer** | Contributing or integrating. | Architecture (extension vs server), APIs, stack, env, how to run and extend. |

---

## Goals

1. **Improve retention** — Spaced repetition so harder problems come back sooner, easier ones later.
2. **Keep the user thinking** — AI gives hints and asks “what have you tried?” instead of dumping solutions.
3. **Single place for “what to do today”** — Dashboard shows due reviews; user can open in browser from extension and stay logged in.
4. **Unified experience** — Same account and settings (language, API key, quick prompts) in extension and on the website.

---

## Features

### Extension (Grindset)

| Feature | Description |
|--------|-------------|
| **Context-aware chat** | On LeetCode problem pages; sends title, difficulty, description. Streaming replies with markdown and code. |
| **Quick prompts** | One-click: Hint, Complexity, Edge Cases, Find Bug, Approach, Optimize, Rate Code, Visualize. List synced from server when logged in. |
| **Mermaid diagrams** | Renders `mermaid` code blocks from the coach in the UI. |
| **Workout logger** | Confidence (1–3), category, approach, complexity, code; optional time. “Generate notes” fills from conversation. |
| **Stopwatch** | Per-problem timer; time shown in footer and passed into workout log. |
| **Open in browser** | Opens web dashboard; when logged in, passes `?token=...` for auto-login. |
| **Settings** | AI provider (Groq / OpenAI), API key (optional), preferred language. Stored in Chrome and synced to server. |
| **Auth** | Login / logout with same JWT as website; token and user id in `chrome.storage.local`. |

### Web app

| Feature | Description |
|--------|-------------|
| **Landing** | Home for Grindset; links to login, dashboard, how-it-works. |
| **Auth** | Login, forgot password, reset (email + token). JWT in `localStorage`; layout shows user menu. |
| **Dashboard** | Review queue (due / all), search, filters; each item links to Revise by log id. |
| **Revise [id]** | Single log: title, difficulty, confidence, next review, approach, complexity, code; “Open in LeetCode,” copy, generate notes. |
| **How it works** | Install → solve → log → revise; explains spaced intervals (e.g. Hard 1d, Medium 3d, Easy 7d). |
| **Settings** | AI provider, API key, language, quick prompts (add/remove, load defaults), change password. Same data as extension via `/api/settings`. |
| **Analytics & study plan** | Analytics views; study plan generator (when available). |

### Backend (API)

| Area | Endpoints / behavior |
|------|------------------------|
| **Auth** | `POST /api/auth` (login), reset flow, `PATCH /api/auth/password`. JWT (jose), bcrypt. |
| **Chat** | `POST /api/chat`: `messages`, `problemContext`, optional `userApiKey`. Groq/OpenAI; rate limit when no user key. |
| **Logs** | `POST /api/log`, `GET /api/log`, `GET /api/log/[id]`. Auth required. |
| **Generate notes** | `POST /api/generate-notes`: from conversation + context → category, approach, complexity, snippet. |
| **Settings** | `GET` / `PATCH /api/settings`: preferredLanguage, aiProvider, groqApiKey, openaiApiKey, quickPrompts. Auth required. |
| **Other** | `GET /api/problem/[slug]`, `GET /api/health`; analytics routes as implemented. |

---

## Use Cases

1. **Daily practice** — User opens LeetCode, picks a problem, opens Grindset. Uses quick prompts or free-form chat for hints, logs the workout with confidence and notes. Later, dashboard shows “due today”; user revises from the web or goes back to LeetCode with context.
2. **Interview prep** — Focus on weak areas; spaced repetition surfaces hard problems more often. Revise page shows approach and code before re-attempting.
3. **Managing prompts** — User goes to website Settings, adds/removes quick prompts; extension fetches the list when loaded so both stay in sync.
4. **Using own AI quota** — User adds Groq API key in extension or website Settings; chat uses that key and avoids the shared 10-msg/day limit.
5. **Seamless extension → web** — User clicks “Open in browser” in extension; lands on dashboard already logged in (token in URL consumed and stored, then URL cleaned).

---

## Tech stack

| Layer | Stack |
|-------|--------|
| **Extension** | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, react-markdown, Mermaid, Lucide. Chrome Manifest V3; `chrome.storage`; content script on `leetcode.com/problems/*`. |
| **Web app** | Next.js 16 (App Router), React 19, TypeScript, Tailwind, Lucide. Auth: `localStorage` + token-in-URL for auto-login. |
| **Backend** | Next.js API routes (same app as web), Prisma, PostgreSQL. Auth: jose (JWT), bcrypt. Rate limit: Upstash Redis. AI: OpenAI-compatible client (Groq). Validation: Zod. |

### Repo layout

```
Leetcode AI/
├── README.md                 # This file
├── frontend/                 # Chrome extension (React + Vite)
│   ├── public/
│   │   ├── manifest.json
│   │   └── content.js, background.js
│   ├── src/
│   │   ├── App.tsx           # Root; composes views and hooks
│   │   ├── App.css           # Design tokens (Grindset), light theme
│   │   ├── main.tsx
│   │   ├── types/            # Shared types (ChatMessage, ProblemContext, etc.)
│   │   ├── constants/        # STORAGE_KEYS, LANGUAGE_OPTIONS, form styles
│   │   ├── utils/            # api (getApiBase, patchSettings), formStyles
│   │   ├── contexts/         # ThemeContext (dark/light)
│   │   ├── hooks/            # useAuth, useChatStream, useProblemContext, useExtensionStorage, useQuickPrompts
│   │   └── components/       # Header, MessageBubble, QuickPrompts, WorkoutLogger, Timer, Login,
│   │                         # Dashboard, SettingsDrawer, ChatInputBar, ChatFooter, EmptyChat,
│   │                         # ThinkingIndicator, CodeBlock, Mermaid, QuotaCard, ThemeToggle
│   └── package.json
└── backend/                  # Next.js app (web + API)
    ├── app/
    │   ├── (web)/            # login, dashboard, revise/[id], settings, how-it-works, analytics, study-plan
    │   ├── api/             # auth, chat, log, settings, generate-notes, problem, health, analytics
    │   ├── layout.tsx
    │   └── page.tsx         # Landing
    ├── prisma/
    │   └── schema.prisma    # User, Log, PasswordResetToken
    ├── lib/                 # auth, prisma, validation, prompts
    └── package.json
```

---

## Data Model (high level)

- **User** — id, email, password, preferredLanguage, aiProvider (groq | openai), groqApiKey (optional), openaiApiKey (optional), quickPrompts (JSON array of `{ label, text }`).
- **Log** — userId, slug, title, difficulty, confidence (1–3), reviewedAt, nextReviewAt, category, approach, complexity, codeSnippet, solution, timeTaken, timeLimit, metTimeLimit, language.
- **PasswordResetToken** — email, token, expiresAt.

Spaced intervals: confidence 1 → +1 day, 2 → +3 days, 3 → +7 days.

---

## Getting Started

### Prerequisites

- Node.js (e.g. 20+)
- PostgreSQL (for backend)
- Upstash Redis (for chat rate limiting)
- (Optional) Groq API key for AI

### 1. Backend + Web

```bash
cd backend
# From repo root: cd backend
cp .env.example .env   # if present; otherwise create .env
# Set: DATABASE_URL, JWT_SECRET, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN,
#      GROQ_API_KEY, GROQ_BASE_URL, AI_MODEL (e.g. llama-3.1-70b-versatile)
npm install
npx prisma migrate dev
npm run dev
```

- Web app: **http://localhost:3000**
- Login, dashboard, settings, how-it-works, revise/[id], analytics, study-plan.

### 2. Extension

```bash
cd frontend
npm install
# Create .env with VITE_API_URL pointing at your server (e.g. http://localhost:3000)
npm run build
```

- In Chrome: **chrome://extensions** → Load unpacked → select **`frontend/dist`** (the folder containing `manifest.json` after build).
- Ensure extension `host_permissions` and `VITE_API_URL` match your backend URL (and CORS if needed).

### 3. Auto-login from extension

- In the extension, when logged in, “Open in browser” uses `{appUrl}/dashboard?token={jwt}`.
- The web layout reads `?token=`, decodes the JWT for `sub` and `email`, stores token and user in `localStorage`, then replaces the URL so the token is removed from the address bar.

### 4. Codebase overview

- **frontend**: Modular structure — `types/` (shared types), `constants/` (storage keys, language options), `utils/` (API helpers, form styles), `hooks/` (auth, chat, storage, quick prompts), `contexts/` (theme), `components/` (UI). App composes hooks and components; no business logic inlined.
- **backend**: Next.js App Router; `app/api/` for routes, `lib/` for auth, Prisma, validation, prompts.

---

## Environment

### Backend (server)

| Variable | Purpose |
|----------|--------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing/verifying JWTs |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Redis for chat rate limits |
| `GROQ_API_KEY` | Default Groq key (used when user doesn’t provide one) |
| `GROQ_BASE_URL` | Groq API base URL |
| `AI_MODEL` | Model name (e.g. for chat and generate-notes) |

### Extension (frontend)

| Variable | Purpose |
|----------|--------|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:3000`). Used for `/api/settings`, `/api/chat`, etc. |

---

## Summary

- **Product:** Grindset = LeetCode + in-problem AI coach + workout logging + spaced repetition + web dashboard and revise flow. One account and settings on extension and web; auto-login when opening the site from the extension.
- **User:** Anyone prepping for interviews who wants to retain what they practice and get hints without full solutions.
- **Features:** Context-aware chat (optional Groq/OpenAI key), quick prompts, Mermaid diagrams, workout logger, stopwatch, dashboard, revise pages, settings (password, AI provider & key, language, quick prompts).
- **Tech:** Chrome extension (React, Vite, Tailwind) + Next.js (web + API), Prisma/PostgreSQL, Redis, JWT, Groq (OpenAI-compatible).
- **Use cases:** Daily practice, interview prep, managing prompts and API key, seamless extension-to-web login.
