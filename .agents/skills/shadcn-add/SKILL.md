---
name: shadcn-add
description: Required cleanup after `shadcn add` adds a component. Use whenever a file is added to `packages/docs/src/components/ui/`.
---

- Replace `import * as React from "react"` with named imports of what is used, and drop every `React.` prefix.
- Replace the trailing `export { ... }` block with `export` on each declaration.
- Sort imports alphabetically by module specifier, with no blank lines between them.
- Fix `exactOptionalPropertyTypes` errors, usually by leaving the prop in `...props` instead of destructuring it.
- Modernize Tailwind v4 classes: value-less data attributes (`data-[inset]:` -> `data-inset:`) and arbitrary sizes on the spacing scale (`size-[3rem]` -> `size-12`).
