---
name: remeda-utility
description: Guidelines for how to properly develop, maintain, and test, a Remeda utility function. Use this skill whenever a file is being edited in the `packages/remeda/src`, when reviewing a PR or local changes to those files, or whenever an issue, PR, or a chat session, refers to a specific function or file in that directory.
---

This checklist ensures every function ships with the right implementation,
tests, documentation, and migration mappings. Work through each item in order.

# 1. Implementation (`src/functionName.ts`)

When any of the edits involves the runtime implementation of a function, one of
its overloading function signatures, or any of the type definitions that it uses
(either directly on the same file, or indirectly via imports) read
`reference/implementation.md`.

# 2. Tests

- **Runtime tests** (`functionName.test.ts`) — cover the happy path, edge cases, empty inputs, and both calling styles (data-first and data-last / inside `pipe`).
  - If editing runtime tests read `reference/testing-runtime.md`.
- **Type tests** (`functionName.test-d.ts`) — use `expectTypeOf` to verify inferred return types, type narrowing, and that invalid inputs produce compile errors.
  - If editing type tests read `reference/testing-types.md`.
- **Property-based tests** (`functionName.test-prop.ts`) are optional but encouraged for functions with well-defined algebraic properties.
  - If adding property-based tests, read `reference/testing-properties.md`.
- Runtime and type tests are **strictly separated** — never mix `expect()` and `expectTypeOf()` in the same test block. Exception: testing callback parameter types inline with `expectTypeOf` inside a callback is acceptable.
- Tests covering specific bugs should reference the issue number in the test name or a comment
- Test names must be distinct — duplicate names make failure reports ambiguous
- Test names describe what's being tested — "lazy early exit with hasMany" not "take and flat"
- Input arrays need enough variation to produce different outputs — overly simple inputs hide bugs

# 3. JSDoc

Each overload needs its own JSDoc block. Required tags:

| Tag                         | Notes                                                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description                 | Present tense, precise vocabulary. First sentence should be concise and terse, and act as one-liner description, followed by a newline, then further expansions. |
| `@param`                    | One per parameter, hyphen before description.                                                                                                                    |
| `@signature`                | The call signature as it looks in user code (e.g., `filter(data, predicate)` / `filter(predicate)(data)`).                                                       |
| `@example`                  | Simple, almost trivial. Data-last examples use `pipe` or `filter`.                                                                                               |
| `@dataFirst` or `@dataLast` | One per overload.                                                                                                                                                |
| `@lazy`                     | Only if lazy evaluation is supported.                                                                                                                            |
| `@category`                 | The function's category (e.g., `Array`, `Object`, `String`).                                                                                                     |

If the new function is closely related to other functions where a user might need to pick the right one, list those alternatives in the description body of every overload. See `indexBy` for an example — it lists `fromKeys`, `pullObject`, and `fromEntries` with a one-line explanation of each. Update the related functions' JSDoc to cross-reference back to the new function too.

# 4. Export

Add `export * from "./functionName";` to `src/index.ts` (alphabetical order).

# 5. Migration Mappings

Check whether the new function is an equivalent of a Lodash or Ramda function. If so:

1. Add a mapping file in the relevant directory:
   - `packages/docs/src/content/mapping/lodash/functionName.md`
   - `packages/docs/src/content/mapping/ramda/functionName.md`

   Format:

   ```markdown
   ---
   category: CategoryName
   remeda: functionName
   ---
   ```

2. Remove the function from `__MISSING.md` in the same directory if it's listed there.
3. Check `___TODO.md` in the same directory for any related items that are now resolved and remove them.

If there's no Lodash/Ramda equivalent, skip this step.
