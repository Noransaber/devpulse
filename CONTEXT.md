# Project Brief

I'm a frontend developer with 3+ years of experience in React, Next.js,
TypeScript, Tailwind, Redux, Zustand, Jest, Playwright, and Docker.

I'm building DevPulse — a real-time engineering team dashboard.
It's a personal portfolio project. My goal is to learn the technologies
I haven't worked with before while reinforcing what I already know.

# Tech Stack I want to use

- Next.js 14 (App Router) + TypeScript
- Supabase (database, auth, real-time WebSockets)
- TanStack Query (data fetching)
- Apollo Client + GraphQL (for GitHub API)
- Framer Motion (animations)
- Clerk (authentication)
- Sentry (error monitoring)
- Turborepo (monorepo — apps/dashboard, apps/storybook, packages/ui)
- Storybook (component library)
- Vitest (unit testing)
- Vercel (deployment)

# Technologies I already know well (no need to over-explain)

React, Next.js, TypeScript, Tailwind, Zustand, Jest, Playwright,
Docker, GitHub Actions, Supabase basics

# Technologies that are NEW to me (please explain decisions clearly)

TanStack Query, Apollo Client, GraphQL, Framer Motion,
Turborepo, Storybook, Clerk, Sentry, Vitest

# What I want from you in THIS conversation

[THIS PART CHANGES EVERY SESSION — write what you want to do TODAY only]

# My rules for working together

- Give me a plan before writing any code
- Explain every new technology decision
- Do one thing at a time, wait for my confirmation before moving on
- Don't install packages I haven't mentioned without asking first
- When I paste an error, diagnose it first before fixing it

# Session 1 — Completed (Monorepo Scaffold)

All steps done. Full build passes with zero errors.

## What exists

- Turborepo 2.9 + pnpm 10 workspaces
- packages/tsconfig — base, nextjs, react-library presets
- packages/utils — @devpulse/utils, builds to dist/
- packages/ui — @devpulse/ui, builds to dist/ via tsup (ESM)
- apps/dashboard — Next.js 14 App Router, imports from workspace packages
- apps/storybook — Storybook 8 with react-vite, Button + Card stories
- ESLint 9 flat config at root, shared across all packages
- Prettier 3 at root

## Key commands

- pnpm turbo build → full build in dependency order
- pnpm turbo dev → dashboard (3000) + storybook (6006)
- pnpm --filter @devpulse/dashboard dev → dashboard only
- pnpm --filter @devpulse/storybook dev → storybook only

## Decisions made

- tsup for packages/ui builds (not plain tsc)
- transpilePackages in next.config.ts for workspace imports
- ESLint 9 flat config (eslint.config.js), not .eslintrc
- Storybook uses react-vite framework (not nextjs)
- Stories live in apps/storybook/src/stories/ (not co-located)

# Session 2 — Completed (Component Library)

All 10 components built in packages/ui, documented in Storybook.
Full build passes. All stories verified manually.

## Components in @devpulse/ui

Button, Badge, Avatar, Input, Card, Skeleton,
Toast, Modal, KanbanCard, Sidebar

## Utilities in @devpulse/utils

cn() — combines clsx + tailwind-merge for all className logic

## Patterns established

- cn() used in every component for classNames
- exactOptionalPropertyTypes: never pass prop={maybeUndefined},
  use {...(val !== undefined ? { prop: val } : {})}
- Inline styles for runtime sizing (Skeleton width/height)
- Literal class arrays for dynamic Tailwind colors (Avatar)
- AnimatePresence in caller for Toast, inside component for Modal
- createPortal + SSR mounted guard for anything touching document
- Relative path imports inside packages/ui to avoid circular refs

## Tailwind

- Installed in apps/storybook (rendering) + packages/ui (IntelliSense)
- Content paths include packages/ui/src/\*\*

# Session 3 — Completed (Auth + Database + Kanban)

## What was built

- Clerk v6 auth: middleware, sign-in/sign-up pages, UserButton
- Supabase: projects, columns, tasks, team_members tables + seed data
- TanStack Query: QueryClientProvider in root layout, devtools
- /board page: full Kanban board with drag-and-drop

## New files

- src/middleware.ts (Clerk, await auth.protect() — must be async)
- src/lib/supabase/client.ts (browser client)
- src/lib/supabase/server.ts (server client, reads cookies)
- src/lib/query/provider.tsx (QueryClientProvider + devtools)
- src/app/(dashboard)/board/page.tsx
- src/components/board/KanbanBoard.tsx (data + DnD + mutation)
- src/components/board/KanbanColumn.tsx (useDroppable + SortableContext)
- src/components/board/TaskCard.tsx (useSortable + motion.div)

## Key lessons

- auth.protect() is async in Clerk v6 — must await it
- Two Supabase clients: browser (singleton) vs server (per-request)
- Optimistic mutation: onMutate snapshot → onError rollback → onSettled reconcile
- layout={!isDragging}: hand off between Framer Motion and dnd-kit
- packages/ui changes require rebuild before dashboard sees them
  (run pnpm dev --filter @devpulse/ui in a second terminal)

## Packages added

- @clerk/nextjs@^6
- @supabase/ssr
- @tanstack/react-query + react-query-devtools
- @dnd-kit/core + sortable + utilities
- framer-motion (explicit in dashboard)
