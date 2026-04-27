---
name: shadcn-add
description: Follow up cleanup and refactors that **must** be done whenever a new shadcn component is added via the add cli command. This skill should be checked whenever a new file is added to the shadcn ui component directory (`src/components/ui`).
---

- Remove the global React import (`import * as React from "react"`) and import only the concrete types and utilities needed.
- Remove all `React.` prefixes from the code, both in types and in runtime code.
- Remove any blank lines within the import statements and sort them using the vscode source action "Organize Imports".
- Remove the global `export { }` block, and add the export keyword to all exported components.
- Fix any tailwind lint/prettier concern, mainly squashing `data-['xxx']` attributes to `data-xxx` and converting arbitrary sizes to concrete values (e.g. `size-[3rem]` to `size-12`).
- Fix any issues caused by having `exactOptionalPropertyTypes` enabled. This might require removing props from earlier destructurings.
- Always validate we have 0 lint errors and warnings, and that the file is formatted.
