# Docs Site

## Commands

```bash
npm run dev # Astro dev server; TypeDoc watches the library source
npm run build
npm run preview
npm run check # Astro type checking
npm run sync  # regenerate Astro content types
npm run lint  # eslint with autofix
```

## Overview

The [Remeda](https://remedajs.com) docs site, built with Astro and deployed as a static site. Function docs are generated from the library's JSDoc; no function has a hand-written page. This package has no tests.

## Content Collections

`src/content.config.ts` aggregates the collections, each defined in a `content.config.ts` inside its content directory:

- **functions**: a custom TypeDoc loader (`src/lib/typedoc/loader.ts`) parses `packages/remeda/src/index.ts` and validates each exported function with `src/lib/typedoc/schema.ts`. In dev it watches the source and updates only the functions whose digest changed.
- **functions-v1**, **categories-v1**: static V1 docs from `functions.json`, for the V1 migration page.
- **docs-articles**: hand-written markdown; frontmatter `title`, `category` and optional `priority` (order within the category).
- **mapping**: migration guides at `src/content/mapping/{library}/{function}.md`. File names are case-sensitive: a custom `generateId` keeps the casing Astro lowercases by default.
- **v1-migration**: V1 to V2 migration content.

## Pages and Components

- `/` (`src/pages/index.mdx`): homepage
- `/docs`: every function on one page, anchored as `/docs#functionName`
- `/migrate/[library]`: one page per migration library
- `/migrate/v1`: V1 migration guide

`src/lib/functions/entries.ts` groups and sorts functions by `@category`; `src/lib/tags.ts` turns JSDoc tags such as `@lazy` into UI badges.

## Gotchas

- **Static scripts aren't hot-reloaded**: a Vite plugin in `astro.config.ts` builds `src/scripts/` once at server start, so restart the dev server after changing them. Pages load them with `<script is:inline>` so they run before hydration (`init-theme.ts` prevents the dark-mode flash).
- **Custom JSDoc block tags** (`@dataFirst`, `@dataLast`, `@lazy`, `@signature`) are registered with TypeDoc in `src/content/functions/content.config.ts`.
- **Content types**: `check` syncs on its own, but the IDE only sees content config or schema changes after `npm run sync`.
