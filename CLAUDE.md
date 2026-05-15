# CLAUDE.md — DevPulse

This file is the persistent briefing for any Claude session working on DevPulse. Read it fully before writing any code.

---

## What This Project Is

**DevPulse** is a real-time engineering team dashboard — a portfolio project built to demonstrate production-grade frontend architecture. It is a Turborepo monorepo with a Next.js 14 app, a shared React component library, and a Storybook documentation site.

---

## Monorepo Structure

```
devpulse/
├── apps/
│   ├── dashboard/          # Next.js 14 App Router — the main product
│   └── storybook/          # Storybook 8 — component library docs
├── packages/
│   ├── ui/                 # @devpulse/ui — shared React components
│   ├── utils/              # @devpulse/utils — cn() and other utilities
│   └── tsconfig/           # Shared TypeScript configs
├── turbo.json
├── pnpm-workspace.yaml
└── CLAUDE.md               ← you are here
```

Package manager: **pnpm** (v10+). Never use npm or yarn in this project.

---

## Commands

```bash
# Run everything (dashboard + storybook + ui watch mode)
pnpm dev

# Run dashboard only
pnpm dev --filter @devpulse/dashboard

# Run Storybook only
pnpm dev --filter @devpulse/storybook

# Build all packages
pnpm build

# Type-check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Run unit tests (Vitest)
pnpm test

# Run e2e tests (Playwright)
pnpm test:e2e
```

**After editing anything in `packages/ui`**, the package must be rebuilt (or running in watch mode) before the dashboard picks up changes:

```bash
pnpm dev --filter @devpulse/ui  # watch mode
# or
pnpm build --filter @devpulse/ui
```

---

## Version Pins — Do Not Upgrade Without Checking

| Package         | Pinned Version | Reason                                                                    |
| --------------- | -------------- | ------------------------------------------------------------------------- |
| `@clerk/nextjs` | `^6`           | v7 requires Next.js 15. This project is on Next.js 14.                    |
| `next`          | `^14`          | App Router stable. Not upgrading to 15 during portfolio build.            |
| `eslint`        | `^9`           | Flat config (eslint.config.js). Not compatible with old .eslintrc format. |

---

## Session 4 — Bugs Fixed

### 7. Vercel AI SDK v4 — `ai/react` no longer exists

In AI SDK v4, the React hooks were moved to a separate package. The `ai/react` subpath export was removed.

```ts
// WRONG — ai/react does not exist in AI SDK v4
import { useCompletion } from 'ai/react'

// CORRECT — install @ai-sdk/react, then import from it
import { useCompletion } from '@ai-sdk/react'
```

Always install `@ai-sdk/react` alongside `ai` and `@ai-sdk/openai` when using AI SDK v4 React hooks.

---

## Critical Bugs Already Fixed — Do Not Reintroduce

### 1. `auth.protect()` must be awaited (Clerk v6)

In `apps/dashboard/src/middleware.ts`, the clerkMiddleware callback MUST be `async` and `auth.protect()` MUST be awaited. Without this, unauthenticated users are silently passed through — no redirect, no error.

```ts
// CORRECT
export default clerkMiddleware(async (auth, req) => {
  if (!isPublic(req)) await auth.protect()
})

// WRONG — silently does nothing
export default clerkMiddleware((auth, req) => {
  if (!isPublic(req)) auth.protect()
})
```

### 2. PostCSS config must be `.cjs` not `.js`

The root `package.json` has `"type": "module"`. PostCSS cannot parse ESM. The config file must be `postcss.config.cjs` (CommonJS), not `postcss.config.js`.

### 3. No `--turbopack` flag in Next.js 14 dev script

`next dev --turbopack` throws "unknown option" in Next.js 14. The dev script in `apps/dashboard/package.json` is just `next dev` with no flags.

### 4. Circular imports inside `packages/ui`

Components inside `packages/ui` that import sibling components MUST use relative paths, not the package name.

```ts
// CORRECT — inside packages/ui/src/KanbanCard/KanbanCard.tsx
import { Badge } from '../Badge/Badge'
import { Avatar } from '../Avatar/Avatar'

// WRONG — causes circular import
import { Badge, Avatar } from '@devpulse/ui'
```

### 5. Supabase key naming confusion

The new Supabase dashboard renames the keys. The mapping is:

- "Publishable key" in Supabase UI → `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- "Secret key" in Supabase UI → `SUPABASE_SERVICE_ROLE_KEY` (never expose client-side)

### 6. Two separate Supabase clients

- `apps/dashboard/src/lib/supabase/client.ts` — `createBrowserClient`, singleton, for Client Components
- `apps/dashboard/src/lib/supabase/server.ts` — `createServerClient`, per-request (reads cookies), for Server Components

Never use the browser client in a Server Component or the server client in a Client Component.

---

## Code Conventions

### Tailwind — No Dynamic Class Names

Tailwind purges unused classes at build time. Dynamic class names break this.

```ts
// WRONG — Tailwind won't include this class
const color = `bg-${props.color}-500`

// CORRECT — use a literal lookup array/object
const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500']
const color = COLORS[index % COLORS.length]
```

For runtime values (widths, heights, percentages), use **inline styles**, not Tailwind classes:

```tsx
<div style={{ width: `${props.percent}%` }} />
```

### `cn()` utility

Always use `cn()` from `@devpulse/utils` for conditional class names. Never concatenate class strings manually.

```ts
import { cn } from '@devpulse/utils';
className={cn('base-class', isActive && 'active-class', props.className)}
```

### TypeScript

All packages use strict mode with `exactOptionalPropertyTypes: true`. This means optional props cannot be set to `undefined` explicitly — they must be omitted.

```ts
// WRONG with exactOptionalPropertyTypes
<Avatar size={undefined} />

// CORRECT
<Avatar />
```

### Framer Motion + dnd-kit (KanbanCard / TaskCard)

Both libraries want to control CSS `transform`. They conflict. The fix is `layout={!isDragging}` on the motion element — this hands transform control to dnd-kit while dragging, and back to Framer Motion when not.

```tsx
<motion.div
  layout={!isDragging}         // KEY: only Framer Motion animates layout when not dragging
  animate={{ opacity: isDragging ? 0.4 : 1 }}
  style={{ transform: CSS.Transform.toString(transform), transition }}
>
```

### AnimatePresence placement

- **Toast**: `AnimatePresence` lives in the **caller** (the ToastContainer), not inside Toast itself
- **Modal**: `AnimatePresence` lives **inside** the Modal component, wrapping the backdrop/panel

### Modal — SSR guard

Modal uses `createPortal` which is browser-only. It must have an SSR mount guard:

```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
return createPortal(<div>...</div>, document.body)
```

### Middleware file location

Clerk middleware MUST be at `apps/dashboard/src/middleware.ts` (not `apps/dashboard/middleware.ts`). Next.js with `src/` directory looks for middleware inside `src/`.

### Route groups

- `(auth)` group — sign-in, sign-up routes (public)
- `(dashboard)` group — all protected routes with shared layout (no URL impact)

Optional catch-all `[[...sign-in]]` is used for Clerk multi-step auth flows so all step URLs are handled.

### QueryClient initialization

QueryClient must be created inside `useState`, not at module level. This ensures each user session gets its own cache (avoids cross-user data leaks in SSR).

```tsx
const [queryClient] = useState(
  () =>
    new QueryClient({
      defaultOptions: { queries: { staleTime: 60_000 } },
    })
)
```

### TanStack Query — Optimistic Updates Pattern

All kanban mutations follow the three-callback pattern:

```ts
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey });
  const previous = queryClient.getQueryData(queryKey);
  queryClient.setQueryData(queryKey, optimisticUpdate);
  return { previous };
},
onError: (_err, _vars, context) => {
  queryClient.setQueryData(queryKey, context.previous); // rollback
},
onSettled: () => {
  queryClient.invalidateQueries({ queryKey }); // reconcile with server
},
```

---

## Environment Variables

All in `apps/dashboard/.env.local` (never commit this file):

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

# GitHub (Personal Access Token — scopes: read:user, public_repo)
GITHUB_ACCESS_TOKEN=

# OpenAI
OPENAI_API_KEY=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
```

---

## Database Schema (Supabase / PostgreSQL)

```
projects        — top-level project containers
columns         — Kanban columns (To Do, In Progress, Done), ordered
tasks           — individual task cards, belong to a column
team_members    — team roster linked to Clerk user IDs
```

Row Level Security (RLS) is enabled on all tables.

---

## Component Library (`packages/ui`)

10 production-ready components, all documented in Storybook:

| Component  | Notes                                                                 |
| ---------- | --------------------------------------------------------------------- |
| Button     | variants: default, destructive, outline, ghost, link                  |
| Badge      | variants: default, secondary, destructive, outline                    |
| Avatar     | literal color array for initials backgrounds (never dynamic Tailwind) |
| Input      | forwarded ref, full a11y                                              |
| Card       | Card, CardHeader, CardContent, CardFooter sub-components              |
| Skeleton   | inline styles for width/height (runtime props)                        |
| Toast      | AnimatePresence in caller; auto-dismiss with useEffect                |
| Modal      | createPortal + SSR mount guard + focus trap                           |
| KanbanCard | composes Badge + Avatar via relative imports                          |
| Sidebar    | collapsible, responsive                                               |

All components use the `cn()` utility, full TypeScript props with JSDoc, and are accessible by default.

---

## What's Built vs. In Progress

### Built (Sessions 1–3)

- Turborepo + pnpm monorepo scaffold
- Shared TypeScript configs, ESLint 9 flat config
- `@devpulse/utils` with `cn()`
- `@devpulse/ui` component library (10 components)
- Storybook 8 with all components documented
- Next.js 14 App Router with Clerk v6 auth (login, signup, protected routes)
- Supabase PostgreSQL schema + RLS
- Kanban board with drag-and-drop (@dnd-kit), Framer Motion animations
- TanStack Query with optimistic updates
- Zustand for client state
- QueryClient provider

### In Progress (Session 4)

- **Sentry** — error monitoring, error boundaries, session replay
- **Supabase Realtime** — WebSocket subscriptions for live board state across clients
- **GitHub GraphQL** — Apollo Client integration for repo metrics (open PRs, commits, issues)
- **AI Standup Generator** — OpenAI + Vercel AI SDK to generate daily standups from completed tasks
- **PWA** — offline support and installable manifest

---

## Storybook

Storybook is a separate app at `apps/storybook` using `@storybook/react-vite` (not `@storybook/nextjs`). It points directly at `packages/ui`. All stories use CSF 3.0 with the `satisfies` pattern:

```ts
const meta = {
  title: 'UI/Button',
  component: Button,
} satisfies Meta<typeof Button>
```

Run at: `http://localhost:6006`

---

## AI Collaboration Notes

- Always check version compatibility before suggesting package upgrades
- When suggesting Tailwind classes, verify they are static strings (not dynamically constructed)
- When writing Server Components, never import browser-only APIs directly
- Supabase server client must be created per-request (inside the function), never at module level
- All new UI components go in `packages/ui/src/ComponentName/ComponentName.tsx` with a matching `ComponentName.stories.tsx`
- Export new components from `packages/ui/src/index.ts`
