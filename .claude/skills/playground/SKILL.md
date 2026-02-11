---
name: playground
description: Decode a TypeScript Playground URL to reveal the source code, compiler options, and TypeScript diagnostics (errors/warnings). Use this whenever you encounter a typescriptlang.org/play link anywhere — pasted in chat, in GitHub issues, in source code comments, on websites, or in any other context where you need to see what the playground contains.
---

# TypeScript Playground Viewer

Decode a TypeScript Playground link and type-check the embedded code — giving
you the same view of errors and warnings the user sees in the playground.

## Usage

```
npx @remeda/typescript-playground-viewer "$ARGUMENTS"
```

The tool handles everything automatically: it extracts the TypeScript version
from the URL's `ts` query param (defaulting to `latest`), installs it into a
local cache on first use, and loads it via the compiler API.

## What It Outputs

A markdown document with YAML frontmatter:

1. **Frontmatter** — TypeScript version and any compiler option overrides.
2. **Source** — the decoded source code from the LZString-compressed `#code/`
   hash fragment.
3. **Diagnostics** — errors and warnings from the TypeScript compiler API, with
   line numbers and TS error codes (e.g. `TS2322`), matching what the playground
   shows as red/yellow squiggly lines.

## After Decoding

Analyze the output in the context of the conversation:

- **Errors are the main signal.** The diagnostics section shows exactly what the
  user sees. Use the error codes and line numbers to understand the problem.
- If it's a bug reproduction, identify which error is unexpected (shouldn't
  happen) or which error is missing (should happen but doesn't).
- If it contains `// ^?` (twoslash queries), explain what type TypeScript would
  infer at those positions.
- If compiler options are set, note how they affect the behavior (e.g.,
  `noUncheckedIndexedAccess` adds `| undefined` to index signatures).
