---
name: remeda-utility
description: Conventions for authoring, modifying, testing, and documenting a Remeda utility function — including the migration mapping pages for Lodash/Ramda/Just users. Use this skill whenever editing a file under `packages/remeda/src/` or `packages/docs/src/content/mapping/{lodash,ramda,just}/`, when reviewing a PR or local changes touching those directories, or whenever an issue, PR, or chat refers to a specific Remeda function or to a migration mapping page.
---

A new or modified Remeda function ships across five surfaces: implementation,
tests, JSDoc, the public export, and — when there's a Lodash/Ramda equivalent —
migration mappings on the docs site. Skipping any one of them leaves the
function half-shipped (e.g., a working implementation that isn't re-exported,
or a behavior change with no test covering it). Work through the sections in
order — later sections assume the earlier ones are in place.

# 1. Implementation (`src/functionName.ts`)

When any of the edits involves the runtime implementation of a function, one of
its overloading function signatures, or any of the type definitions that it uses
(either directly on the same file, or indirectly via imports) read
`reference/implementation.md`.

# 2. Tests

Each function has up to three test files, one per kind:

- **Runtime tests** (`functionName.test.ts`) — Vitest. Cover happy path, edge cases, empty inputs, and both calling styles (data-first and data-last inside `pipe`, `map` or `filter`). When editing, read `reference/testing-runtime.md`.
- **Type tests** (`functionName.test-d.ts`) — `expectTypeOf` from Vitest. Verify inferred return types, narrowing, and that invalid inputs are compile errors. When editing, read `reference/testing-types.md`.
- **Property-based tests** (`functionName.test-prop.ts`) — `@fast-check/vitest`. Optional but encouraged for functions with well-defined algebraic properties (idempotence, involutions, round-trips). When adding, read `reference/testing-properties.md`.

Conventions that apply across all three kinds:

- Runtime and type assertions are **strictly separated** — `expect()` lives in `.test.ts`, `expectTypeOf()` lives in `.test-d.ts`. Never mix them in the same test block, and never put one kind in the other file.
- Test names describe **what** is being tested in the function's own vocabulary — "lazy early exit with hasMany", not "take and flat".
- Test names should be terse and concise, and should rely on context from parent `describe()` blocks and not repeat them.
- Test names do not need to read as prose!
- Tests for a specific bug must reference the issue number, either in the test name or a comment so that the reporting issue can always be traced back.
- Input data needs enough variation to produce distinct outputs — `[1, 1, 1]` hides bugs that `[1, 2, 3]` catches.

# 3. JSDoc

Each overload needs its own JSDoc block. Required tags:

| Tag                        | Notes                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Description                | Present tense, precise vocabulary. First sentence is a concise one-line summary; further detail goes after a blank line.        |
| `@param`                   | One per parameter.                                                                                                              |
| `@signature`               | The call as it looks at the call site, e.g., `filter(data, predicate)` for data-first, `filter(predicate)(data)` for data-last. |
| `@example`                 | Simple, almost trivial — show params and output, not a full usage pattern. Data-last examples use `pipe`, `map`, of `filter`.   |
| `@dataFirst` / `@dataLast` | One per overload, matching the signature style. The docs site uses these to label and group overloads.                          |
| `@lazy`                    | Only if the function supports lazy evaluation in `pipe`.                                                                        |
| `@category`                | The function's category (`Array`, `Object`, `String`, etc.) — drives docs-site navigation.                                      |

If the new function is closely related to others where a user might pick the wrong one (e.g., `indexBy` vs. `fromKeys` vs. `pullObject` vs. `fromEntries`), list those alternatives with a one-line "use this when…" gloss in the description body of every overload. Update the related functions' JSDoc to cross-reference back, so the disambiguation is symmetric — a user who lands on either function discovers the others.

The function description, `@params`, `@returns`, and `@deprecated` should be copied verbatim between the overloads, unless there is a strong reason not to, and then that reason should be made extremely clear in both blocks.

# 4. Export

Add `export * from "./functionName";` to `src/index.ts` (alphabetical order).

# 5. Migration Mappings

Many Remeda functions are genuinely novel and have no Lodash, Ramda, or Just counterpart — those skip this section entirely. But if the function **has** a matching upstream function (or replaces one), it needs a per-library mapping page on the docs site so migrators landing from a search for the upstream name find a clean answer for their call site.

Read `reference/migration.md` when:

- Authoring a new Remeda function that has a Lodash, Ramda, or Just equivalent.
- Editing any existing file under `packages/docs/src/content/mapping/{lodash,ramda,just}/`.
- Reviewing changes that add or modify a mapping page.

`reference/migration.md` covers the file location and frontmatter, the bullets-then-examples body structure, the comment-header convention inside code blocks (`// Lodash` / `// Remeda` / `// Native`), the linking rules, and the `__MISSING.md` cleanup. This is interim guidance — eventually migration work will live behind its own skill, but until then this reference is the source of truth.
