---
name: shadcn-add
description: Follow up cleanup and refactors that **must** be done whenever a new shadcn component is added via the add cli command. This skill should be checked whenever a new file is added to the shadcn ui component directory (`src/components/ui`).
---

# Remove:

- The global React namespace import (`import * as React from "react"`); only import the concrete types and utilities needed.
- Any `React.` prefixes, both in types and in runtime code.
- The global `export { }` block; add the export keyword to each declaration instead.
- `"use client"` directives.
- Blank lines within the import statements.

# Fix:

- Issues caused by having `exactOptionalPropertyTypes` enabled. This might require removing props from destructurings.
- Tailwind v4 modernization concerns (squashing `data-['xxx']` attributes to `data-xxx`, converting arbitrary sizes to concrete values, e.g. `size-[3rem]` to `size-12`).

# Organize:

- Sort imports via the vscode "Organize Imports" source action.
