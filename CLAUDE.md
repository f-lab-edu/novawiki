# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server

# Build & lint
npm run build        # Production build
npm run lint         # Biome lint
npm run format       # Biome format
npm run check        # Biome check + auto-fix
```

No test framework is configured in this project.

## Architecture

**NovaWiki** — Next.js 16 wiki platform with markdown editing, version management, and diff comparison.

### Layer Structure

```
src/
├── entities/      # Domain models + TanStack Query options (queryOptions/mutationOptions)
├── features/      # Feature-specific UI + business logic (document, edit, history, compare, search)
├── components/    # Reusable presentational components (shadcn/ui wrappers)
├── lib/           # Infrastructure: Supabase clients, utilities, plugins
├── store/         # Zustand global state (useUserStore for auth)
├── app/
│   ├── (pages)/   # Next.js App Router pages
│   ├── api/       # API route handlers
│   └── actions/   # Server Actions (document, user, auth)
└── packages/
    ├── markdown-parser/   # Custom markdown parsing
    └── markdown-editor/   # Custom editor (core + React wrapper)
```

### Key Conventions

- **Entities layer** owns query/mutation definitions using TanStack Query `queryOptions`; features consume them
- **Features** may have `api/`, `hooks/`, `ui/`, `model/` subdirectories — each feature is self-contained
- **Supabase has two clients**: `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server + admin)
- **SSR prefetching**: pages use `prefetchQuery` + `HydrationBoundary` for SSR data
- **State**: Zustand (`useUserStore`) for auth/user; TanStack Query for all server state
- **Auth**: `src/authProvider.tsx` subscribes to Supabase auth changes and syncs to Zustand

### Path Aliases (tsconfig)

```
@/*                         → src/*
@f-wiki/markdown-parser     → src/packages/markdown-parser/src/index.ts
@f-wiki/markdown-editor     → src/packages/markdown-editor/core/src/index.ts
@f-wiki/markdown-editor-react → src/packages/markdown-editor/react/src/index.ts
```

### Code Style (Biome)

- 2-space indentation, 80-char line width
- Double quotes, always semicolons
- Only `src/**` is linted/formatted

### Page Routes

| Route | Purpose |
|-------|---------|
| `/` | Home (popular & recent docs) |
| `/d/[id]` | View document |
| `/e/[id]` | Edit document |
| `/h/[id]` | Version history |
| `/c/[id]` | Version comparison (diff) |
| `/search` | Search results |

### Wiki Syntax

- `[[Document Title]]` — wiki-style internal links
- Korean jamo decomposition search supported via `decomposeKorean` in `lib/utils/common.ts`

