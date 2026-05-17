# Project Brief

I'm a frontend developer with 3+ years of experience in React, Next.js,
TypeScript, Tailwind, Redux, Zustand, Jest, Playwright, and Docker.

I'm building DevPulse — a real-time engineering team dashboard.
It's a personal portfolio project. My goal is to learn the technologies
I haven't worked with before while reinforcing what I already know.

# Tech Stack I want to use

- Next.js 14 (App Router) + TypeScript
- Supabase (database, auth, real-time WebSockets + Presence)
- TanStack Query (data fetching)
- Apollo Client + GraphQL (for GitHub API)
- Framer Motion (animations)
- Clerk (authentication)
- Sentry (error monitoring + Session Replay)
- Turborepo (monorepo — apps/dashboard, apps/storybook, packages/ui)
- Storybook (component library)
- Vitest (unit testing)
- Vercel AI SDK + @ai-sdk/openai + @ai-sdk/react (AI Standup Generator)
- @ducanh2912/next-pwa (PWA — service worker + manifest)
- Vercel (deployment)

# Technologies I already know well (no need to over-explain)

React, Next.js, TypeScript, Tailwind, Zustand, Jest, Playwright,
Docker, GitHub Actions, Supabase basics

# Technologies that are NEW to me (please explain decisions clearly)

TanStack Query, Apollo Client, GraphQL, Framer Motion,
Turborepo, Storybook, Clerk, Sentry, Vitest, Vercel AI SDK, PWA

# What I want from you in THIS conversation

[THIS PART CHANGES EVERY SESSION — write what you want to do TODAY only]

# My rules for working together

- Give me a plan before writing any code
- Explain every new technology decision
- Do one thing at a time, wait for my confirmation before moving on
- Don't install packages I haven't mentioned without asking first
- When I paste an error, diagnose it first before fixing it
- Warn me before touching any file from a previous session

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
- transpilePackages in next.config.mjs for workspace imports
- ESLint 9 flat config (eslint.config.js), not .eslintrc
- postcss.config.cjs (not .js) — root has "type":"module"
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

# Session 4 — Completed (Sentry + Realtime + GitHub + AI + PWA)

## What was built

- Sentry: error monitoring, Session Replay, ErrorBoundary
- Supabase Realtime: live board sync + presence indicators
- GitHub GraphQL + Apollo Client: repo metrics page
- AI Standup Generator: streaming standup from completed tasks
- PWA: installable app with manifest + service worker

## New files

- sentry.client.config.ts (Session Replay enabled)
- sentry.server.config.ts
- src/components/ErrorBoundary.tsx (captureException + retry UI)
- src/app/(dashboard)/error.tsx (wires ErrorBoundary into Next.js)
- src/hooks/useRealtimeTasks.ts (postgres_changes subscription,
  invalidates TanStack Query cache on INSERT/UPDATE/DELETE)
- src/hooks/usePresence.ts (Supabase Presence channel,
  tracks current Clerk user, deduplicates by userId)
- src/components/DashboardSidebar.tsx (client wrapper around
  ui/Sidebar, calls usePresence, shows online users with green dot)
- src/lib/apollo/client.ts (ApolloClient factory, new instance
  per request — avoids stale cache across server requests)
- src/app/api/github/route.ts (proxies GitHub GraphQL query
  server-side — keeps GITHUB_ACCESS_TOKEN out of the browser)
- src/app/(dashboard)/github/page.tsx (stars, forks, open PRs,
  open issues, last 5 commits)
- src/app/api/standup/route.ts (fetches Done tasks from last 24h,
  streams OpenAI response via Vercel AI SDK streamText)
- src/app/(dashboard)/standup/page.tsx (lists completed tasks,
  Generate Standup button, streams response word-by-word,
  graceful 503 message if OPENAI_API_KEY is missing)
- public/manifest.json (name, icons, theme #4f46e5, standalone)
- public/icon-192x192.png + icon-512x512.png

## Files updated from previous sessions

- next.config.mjs — wrapped with withPWA (inner) + withSentryConfig (outer)
- src/app/layout.tsx — added manifest to metadata export
- src/app/(dashboard)/layout.tsx — replaced inline Sidebar with DashboardSidebar
- src/components/board/KanbanBoard.tsx — added useRealtimeTasks(projectId) call

## Key lessons

- Sentry ErrorBoundary (error.tsx) only renders in production —
  in dev mode Next.js shows its own error overlay instead
- Supabase Realtime requires the table added to supabase_realtime
  publication: ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
- Apollo Client must be a new instance per server request (factory
  function) — never a module-level singleton on the server
- GitHub token must never reach the browser — proxy via API route
- Vercel AI SDK v4: ai/react no longer exists. Import useCompletion
  from @ai-sdk/react (separate package), not from ai/react
- PWA service worker is disabled in development
  (disable: process.env.NODE_ENV === 'development') — this is correct.
  Verify manifest in DevTools → Application → Manifest in dev mode.
  Install prompt only appears after a production build.

## Packages added

- @sentry/nextjs
- @supabase/supabase-js (Realtime channels)
- @apollo/client + graphql
- ai + @ai-sdk/openai + @ai-sdk/react
- @ducanh2912/next-pwa (NOT next-pwa — that package is unmaintained
  and has webpack conflicts with Next.js 14)

## Environment variables (all in apps/dashboard/.env.local)

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- GITHUB_ACCESS_TOKEN (scopes: read:user, public_repo)
- NEXT_PUBLIC_SENTRY_DSN
- OPENAI_API_KEY (optional — standup page handles missing key gracefully)

# Session 5 — Completed (Polish + Dark Mode + Full CRUD)

## What was built

- Task CRUD: add, edit, delete tasks via modal
- Sidebar polish: logo, user info, logout, active link highlighting
- Loading skeletons + empty states on all pages
- Homepage redesign: greeting, stats, nav cards, recent activity
- Dark/light theme toggle with system preference + no flash

## New files

- src/hooks/useTaskMutations.ts (useCreateTask, useUpdateTask,
  useDeleteTask — all with optimistic updates)
- src/hooks/useTheme.ts (reads/writes localStorage, applies dark
  class to <html>, defaults to prefers-color-scheme)
- src/hooks/useHomeStats.ts (Supabase count queries for homepage
  stats + last 5 updated tasks)
- src/components/board/TaskModal.tsx (shared add/edit modal —
  title, description, assignee dropdown, delete with confirmation)
- src/components/board/KanbanSkeleton.tsx (3-column skeleton
  with varying card counts — renders while board data loads)

## Files updated from previous sessions

- packages/ui/src/KanbanCard/KanbanCard.tsx — dark mode variants
- packages/ui/src/Sidebar/Sidebar.tsx — dark mode variants
- src/app/layout.tsx — inline anti-flash script + suppressHydrationWarning
- tailwind.config.ts — added darkMode: 'class'
- src/components/DashboardSidebar.tsx — logo, user row, logout,
  active link highlighting via usePathname(), theme toggle button
- src/components/board/TaskCard.tsx — full card draggable (listeners
  on motion.div), onClick with isDragging guard opens edit modal
- src/components/board/KanbanColumn.tsx — Add task button,
  empty state inside droppable div
- src/components/board/KanbanBoard.tsx — modal state lifted up,
  KanbanSkeleton while loading
- src/app/(dashboard)/page.tsx — full homepage redesign
- src/app/(dashboard)/github/page.tsx — skeleton stat cards
- src/app/(dashboard)/standup/page.tsx — skeleton task rows

## Key lessons

- Dark mode flash fix: use an inline <script> in <head> that runs
  before React hydrates — reads localStorage and sets dark class
  on <html> synchronously. useEffect is too late (runs after paint).
  Add suppressHydrationWarning to <html> to silence React warning.
- packages/ui dark mode: when adding dark mode to the dashboard,
  don't forget components in packages/ui — they need dark: variants
  too. After editing packages/ui, always rebuild:
  pnpm build --filter @devpulse/ui
- Full card draggable vs grip handle: putting dnd-kit listeners on
  the entire card is better UX than a tiny grip handle.
  activationConstraint: { distance: 5 } on MouseSensor separates
  click (< 5px movement) from drag (>= 5px movement) cleanly.
- RLS insert/delete policies: Supabase RLS blocks inserts and
  deletes silently (no console error) if policies are missing.
  Always add INSERT and DELETE policies alongside SELECT and UPDATE:
  CREATE POLICY "dev: insert tasks" ON tasks FOR INSERT WITH CHECK (true);
  CREATE POLICY "dev: delete tasks" ON tasks FOR DELETE USING (true);
- Supabase returns embedded joins as arrays regardless of cardinality.
  Type columns as { name: string }[] | null and access via [0].

## Deployment

- Live on Vercel
- Root directory set to apps/dashboard in Vercel project settings
- All environment variables added to Vercel project settings

# Session 6 — Completed (Landing Page + Auth Styling + Route Restructure)

## What was built

- Public landing page at / (no auth required)
- Navbar with logo + Sign in + Get started buttons
- Hero section with animated gradient orbs and CTA buttons
- Features section with 4 cards and hover animations
- Footer with social links (GitHub, LinkedIn, Twitter, Medium)
- Styled Clerk auth forms matching DevPulse branding
- Route restructure: dashboard home moved from / to /dashboard

## New files

- src/app/page.tsx (public landing page — Navbar, Hero,
  Features, Footer all in one file, ~290 lines)
- src/app/(dashboard)/dashboard/page.tsx (dashboard home,
  moved from the old (dashboard)/page.tsx)

## Files updated from previous sessions

- src/middleware.ts — added '/' to isPublicRoute matcher
- src/components/DashboardSidebar.tsx — Home link updated
  from '/' to '/dashboard', isActive logic corrected
- src/app/(auth)/sign-in/[[...sign-in]]/page.tsx — Clerk
  appearance prop with indigo primary, rounded-lg, dark theme
- src/app/(auth)/sign-up/[[...sign-up]]/page.tsx — same
  appearance prop as sign-in

## Deleted files

- src/app/(dashboard)/page.tsx — replaced by /dashboard/page.tsx

## Key lessons

- Clerk fallback redirect URLs must point to /dashboard not / —
  otherwise signed-in users clicking Sign in get redirected back
  to the landing page (looks like a reload):
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
  Update these in both .env.local AND Vercel environment variables.
- Framer Motion orbs need pointer-events-none on each motion.div
  individually — CSS transform creates a new stacking context that
  breaks pointer-event inheritance from the parent wrapper.
- Clerk appearance prop customization: colorNeutral controls icon
  tints, divider text ("or"), and secondary button text like
  "Continue with Google" — set to #ffffff for dark backgrounds.
- Public routes in middleware must explicitly list '/' — it is NOT
  public by default even though it seems obvious.

## Route structure (final)

- / → public landing page (no auth)
- /sign-in → Clerk sign-in (public)
- /sign-up → Clerk sign-up (public)
- /dashboard → protected dashboard home (was /)
- /board → protected Kanban board
- /github → protected GitHub metrics
- /standup → protected AI standup generator
