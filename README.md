# DevPulse

A real-time engineering team dashboard built as a portfolio project to demonstrate modern frontend architecture. Combines a production-grade component library, real-time collaboration, GitHub integration, and AI-powered tooling.

## Tech Stack

**Monorepo & Tooling**

- [Turborepo](https://turbo.build) — monorepo build system with smart caching
- [pnpm](https://pnpm.io) — package manager with workspace support
- [TypeScript](https://www.typescriptlang.org) — strict mode across all packages

**Frontend**

- [Next.js 14](https://nextjs.org) — App Router, Server Components, API Routes
- [Tailwind CSS v3](https://tailwindcss.com) — utility-first styling
- [Framer Motion](https://www.framer.com/motion) — spring animations and drag physics
- [Storybook 8](https://storybook.js.org) — component library documentation

**State & Data**

- [TanStack Query](https://tanstack.com/query) — server state, caching, optimistic updates
- [Zustand](https://zustand-demo.pmnd.rs) — client-side state management
- [Apollo Client](https://www.apollographql.com/docs/react) — GitHub GraphQL API integration

**Backend & Auth**

- [Supabase](https://supabase.com) — PostgreSQL database, real-time WebSockets, storage
- [Clerk](https://clerk.com) — authentication and user management

**Quality**

- [Sentry](https://sentry.io) — error monitoring and session replay
- [Vitest](https://vitest.dev) — unit testing
- [Playwright](https://playwright.dev) — end-to-end testing
- [ESLint 9](https://eslint.org) — flat config, shared across all packages

## Project Structure

```
devpulse/
├── apps/
│   ├── dashboard/          # Next.js 14 app (main product)
│   └── storybook/          # Component library documentation
├── packages/
│   ├── ui/                 # @devpulse/ui — shared React component library
│   ├── utils/              # @devpulse/utils — shared utilities (cn(), etc.)
│   └── tsconfig/           # Shared TypeScript configurations
├── turbo.json
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/devpulse.git
cd devpulse
pnpm install
```

### Environment Variables

Create `apps/dashboard/.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# GitHub (Personal Access Token — read:user, public_repo)
GITHUB_ACCESS_TOKEN=

# OpenAI
OPENAI_API_KEY=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
```

### Development

```bash
# Run everything (dashboard + storybook + ui watch mode)
pnpm dev

# Run dashboard only
pnpm dev --filter @devpulse/dashboard

# Run Storybook only
pnpm dev --filter @devpulse/storybook
```

Open [http://localhost:3000](http://localhost:3000) for the dashboard.
Open [http://localhost:6006](http://localhost:6006) for Storybook.

### Build

```bash
pnpm build
```

## Features

### Built

- **Authentication** — Clerk-powered login, signup, and protected routes
- **Kanban Board** — drag-and-drop task management with optimistic updates and real-time sync
- **Component Library** — 10 production-ready components documented in Storybook (Button, Badge, Avatar, Input, Card, Skeleton, Toast, Modal, KanbanCard, Sidebar)
- **Real-time Updates** — Supabase WebSocket subscriptions for live board state

### In Progress

- **GitHub Integration** — Apollo Client + GraphQL for repo health metrics (open PRs, commits, issues)
- **AI Standup Generator** — OpenAI + Vercel AI SDK to generate daily standups from completed tasks
- **Error Monitoring** — Sentry integration with error boundaries and session replay
- **PWA** — Offline support and installable manifest

## Component Library

The shared UI component library lives in `packages/ui` and is documented in Storybook.

```bash
pnpm dev --filter @devpulse/storybook
```

Key patterns used across all components:

- `cn()` utility (clsx + tailwind-merge) for conditional class names
- Full TypeScript props with JSDoc
- `exactOptionalPropertyTypes` strict mode compliance
- Accessible by default (aria attributes, focus management, keyboard navigation)

## Database Schema

```
projects        → top-level project containers
columns         → Kanban columns (To Do, In Progress, Done)
tasks           → individual task cards
team_members    → team roster linked to Clerk user IDs
```

## License

MIT
