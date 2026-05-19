# Indie Game Dev Planner

A fullstack portfolio project demonstrating real-time collaboration, auth, CRUD, presence tracking, and clean layered architecture — built for small indie game teams.

---

## Project Concept

Collaborative planning tool for indie game developers. Teams can manage tasks on a kanban board and map out game scenes/scenarios together. The technically interesting parts are real-time sync (all members see changes instantly), presence tracking (see who's online), and the activity feed that logs every action across a project.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express + Prisma |
| Real-time | Socket.io |
| Database | PostgreSQL via Supabase |
| File Storage | Supabase Storage (scene images) |
| Frontend | Next.js (App Router) + React + Tailwind CSS 4 + shadcn/ui |
| Auth | JWT |
| Local Dev | Node.js native — no Docker needed |
| Deployment | Not planned (portfolio/demo only) |

---

## Core Features (v1)

- [ ] Users can register and log in with email + password (JWT auth)
- [ ] Users can create game projects (name, genre, engine, platform, description)
- [ ] Users can invite members via a shareable link
- [ ] Users can manage a task board per project (kanban: todo / in progress / done)
- [ ] Users can add and link scenes/scenarios (title, description, image, type, status, leads-to links)
- [ ] Users can see who is currently online in a project (presence)
- [ ] All task and scene changes sync in real time to every member in the project
- [ ] Users can view an activity feed showing recent actions in the project

**Real-time events:**
- `user:presence` — server → client when a member joins or leaves the project room
- `task:updated` — server → client when any task is created, moved, or deleted
- `scene:updated` — server → client when any scene is created, updated, or deleted
- `activity:new` — server → client when a new activity entry is created

---

## Repo Layout

```
project/
├── backend/
│   ├── src/
│   │   ├── routes/         # Express routers — HTTP only
│   │   ├── sockets/        # Socket.io event handlers
│   │   ├── services/       # Business logic — no req/res/socket imports
│   │   ├── repositories/   # Prisma queries only
│   │   ├── middlewares/    # Auth, error handling, validation
│   │   ├── schemas/        # Zod validation schemas
│   │   └── utils/          # Helpers (jwt, invite tokens, etc.)
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env.example
└── frontend/
    ├── app/                # Next.js App Router pages
    ├── components/         # shadcn/ui + custom
    ├── hooks/              # Presenter hooks (one per page/feature)
    ├── lib/
    │   ├── api.ts          # HTTP client (fetch wrappers)
    │   ├── socket.ts       # Socket.io client singleton
    │   ├── actions/        # API call functions
    │   ├── models/         # TypeScript interfaces
    │   └── utils/          # constants, formatters
    └── contexts/           # Shared React context (auth, socket)
```

---

## Architecture Rules

### Backend
1. **Layering**: Route/Socket → Service → Repository. No skipping layers.
2. **No Prisma in routes or sockets** — only in repositories.
3. **No Express/Socket imports in services** — services are framework-agnostic.
4. **Zod at the boundary** — validate all incoming data in routes/sockets before it reaches services.
5. **Socket handlers are thin** — extract logic to services, same as routes.
6. **JWT `sub`** — encode as `String(user.id)`, decode back to number.
7. **Errors** — services throw plain Error subclasses; routes/sockets catch and map to HTTP status or socket error event.
8. **Activity log** — written inside the service layer after every mutating operation.

### Frontend
1. **MVP pattern** — Pages are views only. All state and logic in presenter hooks.
2. **One hook per page** — `use-[page-name].ts` in `hooks/`.
3. **Socket client is a singleton** — import from `lib/socket.ts`, never create inline.
4. **API calls** — only in `lib/actions/`, never raw fetch in pages or hooks.
5. **Types** — all interfaces in `lib/models/`, never inline.
6. **No Tailwind config file** — Tailwind 4 configured via `@theme` in globals.css.

---

## Database Schema

```
Table: users
  - id (int, PK), email (unique), password_hash, created_at

Table: projects
  - id, owner_id (FK users), name, genre, engine, platform
  - description (text, nullable), created_at, updated_at

Table: project_members
  - id, project_id (FK), user_id (FK), role (enum: owner | member), joined_at
  - UNIQUE (project_id, user_id)

Table: invite_tokens
  - id, project_id (FK), token (unique string), created_by (FK users)
  - expires_at, used (bool), created_at

Table: tasks
  - id, project_id (FK), created_by (FK users)
  - title, status (enum: todo | in_progress | done)
  - due_date (date, nullable), order (int — position within column)
  - created_at, updated_at, deleted_at (nullable — SOFT DELETE)

Table: scenes
  - id, project_id (FK), created_by (FK users)
  - title, description (text, nullable), image_url (text, nullable)
  - type (enum: cutscene | gameplay | boss | dialogue | other)
  - status (enum: planned | in_progress | done)
  - created_at, updated_at

Table: scene_links
  - id, from_scene_id (FK scenes), to_scene_id (FK scenes)
  - label (string, nullable — e.g. "if player picks option A")
  - UNIQUE (from_scene_id, to_scene_id)

Table: activities
  - id, project_id (FK), user_id (FK)
  - action (string — human-readable, e.g. "moved task 'Fix bug' to Done")
  - entity_type (string), entity_id (int)
  - created_at
```

**Key design decisions:**
- Soft delete on tasks (so activity log references stay valid)
- Invite tokens expire after 7 days
- project_members covers all users including owner (owner also has a row here)
- Indexes: tasks(project_id, status), scenes(project_id), activities(project_id)

---

## API Endpoints

### HTTP
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Register new user |
| POST | `/auth/login` | — | Login, returns JWT |
| GET | `/auth/me` | JWT | Get current user |
| GET | `/projects` | JWT | List user's projects |
| POST | `/projects` | JWT | Create project |
| GET | `/projects/:id` | JWT + member | Get project details |
| PATCH | `/projects/:id` | JWT + owner | Update project |
| DELETE | `/projects/:id` | JWT + owner | Delete project |
| POST | `/projects/:id/invite` | JWT + owner | Generate invite link |
| POST | `/invites/:token/accept` | JWT | Join project via invite |
| GET | `/projects/:id/members` | JWT + member | List members |
| DELETE | `/projects/:id/members/:userId` | JWT + owner | Remove member |
| GET | `/projects/:id/tasks` | JWT + member | List tasks |
| POST | `/projects/:id/tasks` | JWT + member | Create task |
| PATCH | `/projects/:id/tasks/:taskId` | JWT + member | Update task |
| DELETE | `/projects/:id/tasks/:taskId` | JWT + member | Soft-delete task |
| PATCH | `/projects/:id/tasks/reorder` | JWT + member | Reorder tasks within a column — body: `{ status, orderedIds: [id, ...] }` |
| GET | `/projects/:id/scenes` | JWT + member | List scenes |
| POST | `/projects/:id/scenes` | JWT + member | Create scene |
| PATCH | `/projects/:id/scenes/:sceneId` | JWT + member | Update scene |
| DELETE | `/projects/:id/scenes/:sceneId` | JWT + member | Delete scene |
| POST | `/projects/:id/scenes/:sceneId/links` | JWT + member | Add scene link |
| DELETE | `/projects/:id/scenes/:sceneId/links/:linkId` | JWT + member | Remove scene link |
| GET | `/projects/:id/activities` | JWT + member | Get activity feed |

### Socket Events
| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| client → server | `auth` | `{ token }` | Authenticate socket connection |
| client → server | `project:join` | `{ projectId }` | Join a project room |
| client → server | `project:leave` | `{ projectId }` | Leave a project room |
| server → client | `user:presence` | `{ projectId, onlineUserIds }` | Who is online in the project |
| server → client | `task:updated` | `{ projectId, task, action }` | Task created/moved/deleted |
| server → client | `scene:updated` | `{ projectId, scene, action }` | Scene created/updated/deleted |
| server → client | `activity:new` | `{ projectId, activity }` | New activity entry |

---

## Development Workflow

### Phase gates — do not skip

Before moving to the next phase, stop and review with the user.

```
Phase 1: Schema + API design (no code yet) ✓ DONE
Phase 2: Backend core (auth + projects + members + tasks + scenes, no sockets yet)
  → Review: Test with Bruno/Postman. Auth works? Routes return correct data?
Phase 3: Socket layer + activity feed
  → Review: Presence works? Task/scene changes sync to all members?
Phase 4: Frontend skeleton (pages + routing, no real data yet)
  → Review: Navigation feels right? Any missing pages?
Phase 5: Frontend wired up (hooks + actions connected to backend)
  → Review: Full golden path works end to end?
Phase 6: Polish + error handling
  → Review: Error states, loading states, empty states, edge cases.
```

---

## Multi-Agent Usage

**Explore agent** — for codebase searches across many files:
```
"Use Explore agent to find all socket event handlers"
"Use Explore agent to check where Prisma is imported"
```

**Plan agent** — before starting a non-trivial feature:
```
"Use Plan agent to design the invite system before I write any code"
```

**Parallel agents** — when two independent pieces of work can run at once:
```
"Build the backend task routes and the frontend task hook in parallel"
```

**Review agent** — before merging a phase:
```
/review
```

---

## Code Quality Rules

- No `any` types in TypeScript
- No `console.log` left in committed code
- No raw `fetch()` in pages or hooks — use `lib/actions/`
- No business logic in routes or socket handlers
- Every page needs a loading state and an error state
- Forms use react-hook-form + zod
- Error boundaries (`error.tsx`) at route segment level
- Activity log written for every create/update/delete in the service layer

---

## Environment Variables

```env
# Backend (.env)
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1440m
PORT=3001
FRONTEND_URL=http://localhost:3000
```

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

> Scene images are uploaded directly from the frontend to Supabase Storage using `@supabase/supabase-js`. The resulting public URL is then saved to the scene via `PATCH /scenes/:sceneId`. The backend never handles file uploads.

---

## Running Locally

```bash
# Backend
cd backend
npm install
npx prisma migrate dev   # runs migrations against your Supabase project
npm run dev              # starts on port 3001

# Frontend
cd frontend
npm install
npm run dev              # starts on port 3000
```

---

## What's Left

- [x] Project concept finalized
- [x] Tech stack confirmed
- [x] DB schema designed
- [x] API endpoints listed
- [x] Socket events listed
- [x] Phase 1 review done
- [ ] Phase 2 complete
- [ ] Phase 3 complete
- [ ] Phase 4 complete
- [ ] Phase 5 complete
- [ ] Phase 6 complete
