# Indie Game Dev Planner

Collaborative planning tool for indie game development teams.

## Overview

A personal full-stack portfolio project built to practice real-time systems, layered architecture, and modern full-stack tooling.

Indie Game Dev Planner gives small indie teams a shared space to manage their game project:
- **Task board** — kanban-style board (todo / in progress / done) sorted by due date and priority
- **Scene planner** — map out game scenes with images, type tags, and status tracking, then link scenes together to model your game flow
- **Activity feed** — every task and scene change is logged and shown to all members in real time
- **Presence** — see which teammates are currently online in the project

The technically interesting parts are the real-time sync layer (every change broadcasts instantly to all members via Socket.io), JWT auth with invite-based team access, and the strict layered architecture on both the backend and frontend.

> This project is not intended for production use. It is a hands-on study of building a real-time collaborative app with a clean fullstack architecture.

---

## Screenshots

| Dashboard | Project Board |
|-----------|--------------|
| ![Dashboard](screenshots/dashboard.png) | ![Project Board](screenshots/project-board.png) |

| Scene Flow | Activity Feed |
|------------|--------------|
| ![Scene Flow](screenshots/scene-flow.png) | ![Activity Feed](screenshots/activity-feed.png) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma 7 |
| Real-time | Socket.io |
| Database | PostgreSQL (Supabase) |
| File Storage | Supabase Storage |
| Auth | JWT |

---

## Features

- JWT authentication (register, login)
- Create and manage game projects (name, genre, engine, platform, description)
- Invite team members via shareable one-time invite links (7-day expiry)
- Kanban task board with priority (high / medium / low) and due date sorting
- Scene planner with image uploads (stored in Supabase Storage) and scene-to-scene link connections
- Real-time sync — all task and scene changes broadcast instantly to every member in the project
- Presence tracking — see who is currently online in a project room
- Activity feed — timestamped log of every create / update / delete action across the project
- Dark / light mode toggle

---

## Tools & AI Used

| Tool | Role |
|------|------|
| [Claude Code](https://claude.ai/code) | Primary development assistant — architecture guidance, code review, pair programming throughout all phases |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)

---

### 1. Clone the repository
```bash
git clone https://github.com/PhakanunK/Indie-Game-Dev-Planner.git
cd Indie-Game-Dev-Planner
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Storage** → create a new bucket named `scene-images` → set to **Public**
3. Add storage policies to allow public uploads and reads:
```sql
CREATE POLICY "Allow anon uploads" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'scene-images');

CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT TO anon
USING (bucket_id = 'scene-images');
```
4. Go to **Settings → API** and note your **Project URL** and **anon public key**
5. Go to **Settings → Database** and note your **connection string** for `DATABASE_URL`

### 3. Configure environment variables

**Backend** — copy and fill in:
```bash
cd backend
cp .env.example .env
```

```env
DATABASE_URL=postgresql://postgres:your_password@db.your_project.supabase.co:5432/postgres
JWT_SECRET=your_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=1440m
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend** — copy and fill in:
```bash
cd frontend
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
```

### 4. Run migrations and start

**Backend:**
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev       # starts on port 3001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev       # starts on port 3000
```

---

## Project Structure

```
indie-game-dev-planner/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── routes/         # Express routers — HTTP only
│       ├── sockets/        # Socket.io event handlers
│       ├── services/       # Business logic — no req/res/socket imports
│       ├── repositories/   # Prisma queries only
│       ├── middlewares/    # Auth, error handling, validation
│       ├── schemas/        # Zod validation schemas
│       └── utils/          # JWT, invite tokens, helpers
└── frontend/
    ├── app/                # Next.js App Router pages
    ├── components/         # shadcn/ui + custom components
    ├── hooks/              # Presenter hooks (one per page/feature)
    ├── contexts/           # Auth context, Socket context
    └── lib/
        ├── actions/        # All API call functions, one file per domain
        ├── models/         # TypeScript interfaces, one file per domain
        └── utils/          # Constants, formatters
```

---

## Architecture

### Backend

Strict layered architecture — each layer has one responsibility:

```
Route/Socket → Service → Repository → Database
```

| Layer | Responsibility |
|-------|---------------|
| **Routes/Sockets** | HTTP/WebSocket input, Zod validation, map errors to status codes |
| **Services** | Business logic only — plain TypeScript, no Express or Socket imports |
| **Repositories** | Prisma queries only, no business logic |

Socket handlers follow the same rule — they are thin and delegate to services, just like routes.

### Frontend — MVP Pattern

```
Page (View) → Presenter Hook → lib/actions (Model) → Backend
```

| MVP Role | Location | Responsibility |
|----------|----------|---------------|
| **View** | `app/` pages + `components/` | Pure rendering — calls one hook, maps data to JSX |
| **Presenter** | `hooks/` | All state, socket listeners, derived values, event handlers |
| **Model** | `lib/actions/` + `lib/models/` | Typed fetch wrappers and TypeScript interfaces, one file per domain |

### Real-time events

| Event | Direction | Description |
|-------|-----------|-------------|
| `task:updated` | server → client | Task created, moved, or deleted |
| `scene:updated` | server → client | Scene created, updated, or deleted |
| `activity:new` | server → client | New activity entry logged |
| `user:presence` | server → client | Member joined or left the project room |
