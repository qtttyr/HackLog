# HackLog

**Track the whole hackathon without the chaos.**

HackLog is a focused workspace for hackathon teams — from idea to demo in one app. Tasks, decisions, countdown, AI brainstorming, roadmap, and pitch — all connected, so you stop jumping between tools and start building.

---

## Philosophy

Hackathons are intense. The tools we use during them shouldn't add to the noise.

Every hackathon team has the same rhythm: you come up with an idea, you divide work, you track progress, you make decisions, and eventually you present. Most teams use four different apps for this. HackLog gives you one — designed for the speed and pressure of a weekend build.

The product is built on a few convictions:

**Calm under pressure.** Big touch targets, clean hierarchy, mobile-first. The UI stays usable during finals when your team is tired and the deadline is close.

**Trust at first glance.** Brutalist borders, bold typography, generous whitespace. What you see is what matters. No hidden menus, no onboarding labyrinths.

**Solo is the default. Team is a toggle.** Most hackathon tools assume you start as a team. We assume you start alone and invite people when you're ready.

**AI as a teammate, not a gimmick.** Groq-powered generation for ideas, roadmap planning, role assignments, and pitch writing — accessible on every page, never in your way.

**Works offline.** PWA with service worker. Your progress stays when the wifi drops during finals.

---

## Quick Start

```bash
cd frontend
cp .env.example .env       # Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev                # → http://localhost:5173
```

That's it. No backend required for Phase 1 — everything runs in the browser with direct Supabase Auth.

> **Disable email confirmation** in your Supabase dashboard (Authentication → Providers → Email) for instant signup during development.

---

## Features

| Page | What it does |
|------|-------------|
| **Dashboard** | Countdown, task summary, idea count, quick links to every section |
| **Tasks** | Team kanban + personal todo list. Status toggle, create, delete |
| **Board** | Visual column board — move tasks through stages |
| **Roadmap** | AI-generated project tree. Plan your build step by step |
| **Brainstorm** | AI idea generation. Vote, filter by tags, refine together |
| **Decisions** | Log every decision with context. Never forget why you chose what |
| **Pitch** | AI-generated README and pitch deck copy from your team context |
| **Settings** | Manage team members, assign roles, AI-powered role suggestions |

---

## Design

```
Palette:  #c7ff66  #ffd9f3  #c7e7ff  #fff8c7  #111111  #f7f4ef
Type:     Space Grotesk (headings) · Plus Jakarta Sans (body)
UI:       Brutalist · 3px borders · 28px radius · 8px card shadow
```

Brutalist by choice, not by trend. Hard borders and raw contrast make every interaction decisive. The interface tells you exactly what you can do — no ambiguity, no fluff.

On mobile, everything adjusts: smaller borders, tighter shadows, bigger tap areas. The same confidence, just compressed.

---

## Stack

```
Frontend   React 18 · TypeScript 5.9 · Vite 7 · TailwindCSS 4
State      Zustand 5 + persist middleware
Auth       Supabase JS (direct, no backend)
Async      TanStack Query 5
PWA        vite-plugin-pwa + Workbox
Icons      Lucide
AI         Groq (Llama 3.1 8B via FastAPI — Phase 2)
Backend    FastAPI (Python) — optional, for AI pipeline
Database   Supabase PostgreSQL + RLS
```

---

## Project Structure

```
HackLog/
├── frontend/
│   ├── src/
│   │   ├── app/           # Router, providers, app shell
│   │   ├── components/    # Shared UI (button, input, card, layout)
│   │   ├── features/      # Feature modules (auth, tasks, brainstorm, …)
│   │   ├── hooks/         # React Query hooks, session, team loader
│   │   ├── store/         # Zustand store with Supabase sync
│   │   ├── styles/        # Global CSS, design tokens
│   │   ├── types/         # Domain types (single source of truth)
│   │   ├── utils/         # Time helpers, API fetch wrapper
│   │   └── lib/           # Supabase client
│   └── index.html
├── backend/               # FastAPI skeleton (optional)
│   └── app/
│       ├── routes/        # auth, generate, health, ai
│       ├── services/      # groq.py AI client
│       ├── config.py
│       ├── models.py      # Pydantic schemas
│       └── main.py
└── database/              # SQL schema + migrations
```

---

## Getting Started

### 1. Supabase

Create a project at [supabase.com](https://supabase.com). Run the schema from `database/schema.sql` in the SQL editor. Get your URL and anon key from Settings → API.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# edit .env → set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

### 3. Backend (optional — for AI features)

```bash
cd backend
python -m venv venv
pip install -r requirements.txt
# Fill backend/.env with SUPABASE_URL, SUPABASE_SERVICE_KEY, GROQ_API_KEY
uvicorn app.main:app --reload --port 8000
```

Then uncomment `VITE_API_BASE_URL` in `frontend/.env`.

---

## Development

```bash
npm run dev      # Dev server at localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # ESLint
```

Phase 1 works entirely without the backend — auth uses Supabase directly from the browser, and all data syncs to Supabase PostgreSQL. The backend only adds the AI pipeline (Groq) and is completely optional until you need it.

---

## Phase 2 (Coming)

- AI-powered idea generation (Brainstorm)
- AI-generated roadmap trees
- AI role assignment for team members
- AI pitch and README copywriting
- Full Supabase sync for all data
- Deploy guides for Vercel + Render

---

<!-- mk-studio:start -->
<p align="center"><a href="https://www.mk-studio.xyz"><img src="https://img.shields.io/badge/MK_STUDIO-ideas%2C_shipped.-0A0A0C?style=flat-square&labelColor=0A0A0C&color=4CC2E8" alt="Built by MK Studio" height="20" /></a></p>
<!-- mk-studio:end -->

---

Built for hackathon teams who'd rather build than configure.
