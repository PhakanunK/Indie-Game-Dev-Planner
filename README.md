# Indie Game Dev Planner

A real-time collaborative planning tool for indie game development teams. Built as a fullstack portfolio project demonstrating JWT auth, layered architecture, real-time sync with Socket.io, and REST API design.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma 7 |
| Real-time | Socket.io |
| Database | PostgreSQL (Supabase) |
| Frontend | Next.js (App Router) + Tailwind CSS 4 + shadcn/ui |
| Auth | JWT |

---

## Features

- JWT authentication (register, login)
- Create and manage game projects (name, genre, engine, platform)
- Invite team members via shareable invite links
- Kanban task board (todo / in progress / done) with drag-to-reorder
- Scene/scenario planner with scene link connections
- Real-time sync — all task and scene changes broadcast instantly to all members
- Presence tracking — see who is currently online in a project
- Activity feed — log of every action across the project

---

## Project Status

| Phase | Status |
|-------|--------|
| Phase 1 — Schema + API design | ✅ Complete |
| Phase 2 — Backend core (auth, projects, tasks, scenes) | ✅ Complete |
| Phase 3 — Socket.io + activity feed | ✅ Complete |
| Phase 4 — Frontend skeleton | 🔄 In progress |
| Phase 5 — Frontend wired up | ⏳ Upcoming |
| Phase 6 — Polish + error handling | ⏳ Upcoming |

---

## Running Locally

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your Supabase DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run dev            # starts on port 3001
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # fill in API and Supabase URLs
npm run dev                  # starts on port 3000
```

---

## Architecture

The backend follows a strict layered architecture:

```
Route/Socket → Service → Repository
```

- **Routes/Sockets** — handle HTTP/WebSocket input, validate with Zod, call services
- **Services** — business logic, no framework imports
- **Repositories** — Prisma queries only, no business logic
