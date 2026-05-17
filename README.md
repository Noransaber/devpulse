# DevPulse

**Your engineering team, in sync.**

Real-time Kanban board, GitHub metrics, team presence, and AI-powered standups — all in one dashboard.

🔗 [Live Demo](https://devpulse-dashboard-zeta.vercel.app) · [GitHub](https://github.com/Noransaber/devpulse)

---

## Overview

DevPulse is a production-grade engineering team dashboard built as a portfolio project to demonstrate real-world frontend architecture. It covers the full spectrum of modern frontend engineering — monorepo tooling, real-time data, AI integration, testing, and deployment.

---

## Features

- **Real-time Kanban board** — drag-and-drop task management with live sync across browser tabs via Supabase WebSocket subscriptions and optimistic UI updates
- **Team presence** — see who's online right now via Supabase Presence, with green dot indicators on the sidebar and team page
- **Board filtering** — search tasks by title, filter by assignee or column; drag-and-drop is automatically disabled while filters are active
- **GitHub metrics** — stars, forks, open PRs, open issues, and recent commits fetched via GitHub's GraphQL API v4, proxied server-side to keep tokens out of the browser
- **AI standup generator** — streams a daily standup from tasks completed in the last 24 hours using Google Gemini and the Vercel AI SDK
- **Full task CRUD** — create, edit, delete tasks with optimistic updates and rollback on failure
- **Team management** — add and remove team members, view task counts per member
- **Dark / light theme** — system preference detection with no flash on load
- **PWA** — installable as a desktop/mobile app with offline support via service worker
- **Error monitoring** — Sentry integration with Session Replay and React Error Boundaries
- **Responsive** — mobile-first layout with a collapsible sidebar drawer on small screens

---

## Tech Stack

### Frontend

| Technology              | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| Next.js 14 (App Router) | Framework — SSR, routing, API routes         |
| TypeScript              | Type safety across the entire monorepo       |
| Tailwind CSS            | Styling                                      |
| Framer Motion           | Animations (board cards, sidebar, hero orbs) |
| @dnd-kit                | Drag-and-drop Kanban board                   |
| Zustand                 | Client state (filters, presence, theme)      |
| TanStack Query          | Server state, caching, optimistic updates    |

### Backend & Infrastructure

| Technology              | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| Supabase                | PostgreSQL database + Realtime WebSockets + Presence |
| Clerk                   | Authentication (Google OAuth + email)                |
| Apollo Client + GraphQL | GitHub API v4 integration                            |
| Vercel AI SDK + Gemini  | AI standup generation with streaming                 |
| Sentry                  | Error monitoring + Session Replay                    |

### Monorepo & Tooling

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| Turborepo       | Monorepo build orchestration    |
| pnpm workspaces | Package management              |
| Storybook 8     | Component library documentation |
| Vitest          | Unit testing                    |
| Vercel          | Deployment + CI                 |

---

## Architecture

```
devpulse/
├── apps/
│   ├── dashboard/        # Next.js 14 App Router — the main product
│   └── storybook/        # Storybook 8 — component docs
├── packages/
│   ├── ui/               # @devpulse/ui — 10 shared React components
│   ├── utils/            # @devpulse/utils — cn() and utilities
│   └── tsconfig/         # Shared TypeScript configs
```

### Key architectural decisions

**Islands Architecture** — Server and Client components are split at meaningful boundaries. Data fetching happens server-side where possible; interactive components are isolated Client components. This keeps the client bundle small and improves TTI.

**Single Supabase Presence subscriber** — Supabase only allows one presence subscriber per channel. A Zustand `presenceStore` acts as a bridge: `DashboardSidebar` is the sole subscriber and writes online users to the store; all other components read from it. This avoids runtime channel errors entirely.

**Optimistic updates pattern** — all mutations follow a consistent three-callback pattern: `onMutate` snapshots current state and applies the optimistic update, `onError` rolls back to the snapshot, `onSettled` reconciles with the server. Used across task CRUD, team member management, and column moves.

**GitHub token proxying** — the GitHub Personal Access Token never reaches the browser. A Next.js API route at `/api/github` receives the GraphQL query from the client, executes it server-side with the token, and returns the result.

**Dark mode without flash** — an inline `<script>` in `<head>` runs before React hydrates, reads `localStorage`, and sets the `dark` class on `<html>` synchronously. Using `useEffect` would cause a flash because it runs after the first paint.

---

## Component Library

10 production-ready components in `@devpulse/ui`, all documented in Storybook:

`Button` · `Badge` · `Avatar` · `Input` · `Card` · `Skeleton` · `Toast` · `Modal` · `KanbanCard` · `Sidebar`

All components are fully typed with JSDoc, use the `cn()` utility for conditional classes, and are accessible by default.

---

## Testing

17 unit tests across two packages using Vitest:

| File                                  | Tests                                                               |
| ------------------------------------- | ------------------------------------------------------------------- |
| `packages/utils/src/cn.test.ts`       | 4 — class merging, Tailwind conflict resolution, falsy conditionals |
| `src/stores/boardFilterStore.test.ts` | 5 — initial state, setters, reset                                   |
| `src/stores/presenceStore.test.ts`    | 3 — initial state, update, clear                                    |
| `src/hooks/useTheme.test.ts`          | 5 — dark default, class toggling, localStorage persistence          |

```bash
pnpm --filter @devpulse/dashboard test
pnpm --filter @devpulse/utils test
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- pnpm 10+

### 1. Clone and install

```bash
git clone https://github.com/Noransaber/devpulse.git
cd devpulse
pnpm install
```

### 2. Environment variables

Create `apps/dashboard/.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# GitHub Personal Access Token (scopes: read:user, public_repo)
GITHUB_ACCESS_TOKEN=

# Google Gemini — free tier, get from aistudio.google.com
GOOGLE_GENERATIVE_AI_API_KEY=

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=
```

### 3. Run

```bash
# Dashboard only
pnpm --filter @devpulse/dashboard dev

# Everything (dashboard + storybook + ui watch)
pnpm dev
```

Dashboard → `http://localhost:3000` · Storybook → `http://localhost:6006`

---

## Database Schema

Four tables in Supabase PostgreSQL, all with Row Level Security enabled:

```
projects      — top-level project containers
columns       — Kanban columns (To Do, In Progress, Done), ordered
tasks         — individual task cards, belong to a column
team_members  — team roster
```

---

## Built by

[Noran Abdelfattah](https://www.linkedin.com/in/noran-saber-abdelfattah-6198471ba/) — Frontend Developer

[LinkedIn](https://www.linkedin.com/in/noran-saber-abdelfattah-6198471ba/) · [GitHub](https://github.com/Noransaber) · [Medium](https://medium.com/@noransaber685)
