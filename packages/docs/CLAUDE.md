# Docs Site

## Commands

```bash
npm run dev     # start Astro dev server (watches library source via TypeDoc)
npm run build   # production static build
npm run preview # preview production build locally
npm run check   # Astro type checking
npm run sync    # regenerate Astro content types
npm run lint    # eslint with autofix
```

## Overview

This is the documentation site for [Remeda](https://remedajs.com), built with **Astro 6** and deployed as a static site. Function documentation is **auto-generated** from the library's JSDoc/TypeDoc comments — there are no hand-written pages for individual functions.

There are no tests in this package.

## Architecture

### Content Pipeline

The site has five content collections, each with its own `content.config.ts` co-located in its content directory, aggregated by `src/content.config.ts`:

1. **functions** — Auto-generated at build/dev time via a custom TypeDoc Astro Loader (`src/lib/typedoc/loader.ts`). TypeDoc parses `packages/remeda/src/index.ts`, extracts all exported functions, and feeds them through a Zod schema (`src/lib/typedoc/schema.ts`). During dev, TypeDoc watches the library source and incrementally updates the store (only changed functions, via digest comparison).

2. **functions-v1** / **categories-v1** — Legacy V1 function docs loaded from a static `functions.json` file. Used for the V1 migration page.

3. **docs-articles** — Hand-written markdown articles in `src/content/docs-articles/`. Frontmatter has `title`, `category`, and optional `priority` (controls sort order within category).

4. **mapping** — Migration guides from other libraries (Ramda, Lodash, etc.) in `src/content/mapping/{library}/{function}.md`. Frontmatter has `category` and optional `remeda` reference linking to a Remeda function. **File names are case-sensitive** — the loader uses a custom `generateId` to preserve casing (Astro lowercases by default).

5. **v1-migration** — V1 to V2 migration content.

### Page Routing

- `/` — Homepage (`src/pages/index.mdx`)
- `/docs` — Function reference page, all functions rendered on a single page with anchor links (`/docs#functionName`)
- `/migrate/[library]` — Dynamic pages for each migration library (Ramda, Lodash, etc.)
- `/migrate/v1` — V1 migration guide

### Component Pattern

Astro components (`.astro`) handle data loading and server rendering. React components (`.tsx`) are hydrated as islands using `client:*` directives — `client:visible` for interactive UI (navbar, collapsible signatures), `client:idle` for low-priority (theme switcher), `client:only="react"` for search (Algolia DocSearch). The `src/components/ui/` directory contains unmodified shadcn/ui components (Radix UI + Tailwind) — lint rules are relaxed for these files.

### Key Directories

- `src/lib/typedoc/` — Custom Astro content loader that bridges TypeDoc and Astro's content system
- `src/lib/functions/` — `getFunctions()` and `forNavbar()` helpers that group and sort functions by `@category` tag
- `src/lib/tags.ts` — Extracts `@lazy`, `@indexed`, `@strict` tags from JSDoc for UI badges
- `src/components/ui/` — shadcn/ui components (Radix UI + Tailwind)
- `src/scripts/` — Static scripts compiled by a custom Vite plugin in `astro.config.ts` (e.g., theme init)

### Gotchas

- **Static scripts are NOT hot-reloaded** — `src/scripts/` are compiled by a separate Vite build at server start. Restart the dev server after changing them.
- **Run `npm run sync`** after modifying content loaders or Zod schemas — Astro needs to regenerate `.astro/types.d.ts`.
- **TypeDoc custom block tags** — The loader defines custom tags beyond TypeDoc defaults (`@dataFirst`, `@dataLast`, `@lazy`, `@signature`). These are parsed and validated by the Zod schema.
- **Theme init runs inline** — `src/scripts/init-theme.ts` uses `<script is:inline>` to execute before hydration and prevent dark mode FOUC.
