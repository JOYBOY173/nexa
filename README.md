# Nexa — your personal organizer & performance AI

> Get organized. Perform at your best.

Nexa is a portfolio SaaS product concept: a marketing site plus a real, working
productivity workspace. It turns **chaos into flow into clarity** across four
pillars — Organize, Prioritize, Execute, Perform.

This is a demo/portfolio project. There's no real authentication, billing, or
team collaboration — see [Demo limitations](#demo-limitations) below.

## Product philosophy

Every interactive element in Nexa actually works. There are no fake buttons,
fake charts, or fake AI responses. Deterministic logic (task CRUD, filtering,
metrics) is handled entirely on the frontend; a real OpenAI-backed API handles
the parts that genuinely benefit from natural-language reasoning
(prioritization, day planning, notes-to-tasks, and open-ended chat).

## Tech stack

**Frontend** — React 18, Vite, Tailwind CSS, React Router. No Redux — a single
`WorkspaceContext` plus `localStorage` is enough for this app's scope.

**Backend** — Node.js, Express, the official `openai` SDK. Exists solely as a
secure layer between the browser and OpenAI: your API key never reaches the
client.

**Storage** — Browser `localStorage` only. No database.

## Architecture

```
React Frontend  →  Nexa Express API  →  OpenAI API
      ↑                    ↓
      └────────── structured JSON response
```

The AI never touches application state directly. It returns structured
recommendations (task IDs + priorities, a schedule, or draft tasks); the
frontend validates every ID against the tasks that actually exist before
anything is applied, and the user explicitly clicks "Apply" / "Add" to commit
the change.

```
nexa/
├── frontend/                 Vite + React + Tailwind app
│   └── src/
│       ├── api/               Centralized fetch layer (askNexa, prioritizeTasks, ...)
│       ├── context/            WorkspaceContext — the single source of app state
│       ├── data/                Default scenario/task seed data
│       ├── features/
│       │   ├── marketing/       Landing page sections
│       │   ├── workspace/       Sidebar, shell, overview, quick actions
│       │   ├── tasks/           Task list, filters, add-task modal
│       │   ├── assistant/       Chat + Prioritize/Plan/Notes AI panels
│       │   └── insights/        Metrics + trend chart
│       ├── hooks/                useLocalStorage, useAI
│       └── lib/                  Date utilities, id generator
└── backend/                  Express API (the only thing that talks to OpenAI)
    ├── routes/ai.js            POST /api/ai/{chat,prioritize,plan,notes-to-tasks}
    ├── services/openai.js       OpenAI client + JSON-safe parsing + timeouts
    ├── prompts/                  One compact system prompt per endpoint
    └── middleware/                Request validation + in-memory rate limiting
```

## Local setup

Requires Node.js 18+.

```bash
# 1. Backend
cd backend
cp .env.example .env
# edit .env and add your OPENAI_API_KEY
npm install
npm run dev        # http://localhost:8787

# 2. Frontend (in a second terminal)
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

Visit `http://localhost:5173`. The marketing site works immediately; enter the
workspace via "Try Nexa". AI features work once the backend has a valid
`OPENAI_API_KEY` — without one, they fail gracefully with a friendly
"Nexa couldn't complete that request" message instead of crashing.

## Environment variables

**`backend/.env`**
```
OPENAI_API_KEY=          # required for AI features — never exposed to the frontend
OPENAI_MODEL=gpt-4o-mini # configurable, defaults to gpt-4o-mini
ALLOWED_ORIGINS=http://localhost:5173
PORT=8787
```

**`frontend/.env`**
```
VITE_NEXA_API_BASE_URL=http://localhost:8787
```

## Production build

```bash
cd frontend && npm run build   # outputs frontend/dist
```

## Deployment

- **Frontend** deploys to Vercel as a static Vite build. `vercel.json` includes
  a rewrite so client-side routes like `/app/tasks` don't 404 on direct load.
- **Backend** is a normal long-running Express server — deploy it separately
  (Render, Railway, Fly.io, a small VPS, etc.), then point the frontend's
  `VITE_NEXA_API_BASE_URL` at its public URL. It was deliberately *not*
  restructured into Vercel serverless functions, to keep the architecture
  simple and avoid assuming a long-running Express app behaves the same way
  as a serverless one.

## AI security

- `OPENAI_API_KEY` lives only in `backend/.env`, is read only by
  `backend/services/openai.js`, and is never sent to the frontend in any form.
- The frontend never imports the OpenAI SDK.
- CORS restricts which origins may call the API.
- Every request is validated (types, lengths, task-list shape) before it
  reaches OpenAI; every response the AI returns is re-validated before the
  frontend is allowed to apply it (task IDs must exist, priorities must be one
  of `high`/`medium`/`low`, plan times must be well-formed).
- A simple in-memory rate limiter (20 requests/minute/IP) protects the public
  demo from runaway usage.

## Demo limitations

This is a portfolio concept, not a production SaaS company. Explicitly **not**
implemented: real authentication, payments/billing, team collaboration,
external calendar sync, and the integrations shown on the marketing page
(Google Calendar, Slack, Notion, Linear, GitHub — all labeled "conceptual").
Social proof stats and testimonials are fictional demo content.

## Future possibilities

Real auth + a database would unlock multi-user accounts and team workspaces;
the AI prompts could grow tool-calling to read/write across a richer data
model; a real calendar integration could replace the local "Plan My Day"
feature.

---
Product concept & portfolio project by Joshua Olushina.
