---
name: new-function
description: >
  Checklist for adding a new utility function to Remeda. Use this skill whenever
  you are adding a new function to the library, OR when reviewing a PR that adds
  a new function. If you see a new file in `packages/remeda/src/` that exports a
  function and it wasn't there before — this skill applies.
---

# Adding a New Function to Remeda

This checklist ensures every new function ships with the right implementation,
tests, documentation, and migration mappings. Work through each item in order.

## 1. Implementation (`src/functionName.ts`)

- Build on `purry` (or `purryFromLazy` when the eager path just delegates to the lazy one).
- Follow the dual-overload pattern: data-first and data-last signatures, each with its own JSDoc block.
- See `.claude/rules/implementation.md` for full conventions (lazy evaluation, type system, naming, etc.).

## 2. Tests

- **Runtime tests** (`functionName.test.ts`) — cover the happy path, edge cases, empty inputs, and both calling styles (data-first and data-last / inside `pipe`).
- **Type tests** (`functionName.test-d.ts`) — use `expectTypeOf` to verify inferred return types, type narrowing, and that invalid inputs produce compile errors.
- Property-based tests (`functionName.test-prop.ts`) are optional but encouraged for functions with well-defined algebraic properties.

## 3. JSDoc

Each overload needs its own JSDoc block. Required tags (enforced by ESLint — see `eslint.config.ts`):

| Tag                         | Notes                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Description                 | Present tense, precise vocabulary.                                                                         |
| `@param`                    | One per parameter, hyphen before description.                                                              |
| `@returns`                  | What the function produces.                                                                                |
| `@signature`                | The call signature as it looks in user code (e.g., `filter(data, predicate)` / `filter(predicate)(data)`). |
| `@example`                  | Simple, almost trivial. Data-last examples use `pipe`.                                                     |
| `@dataFirst` or `@dataLast` | One per overload.                                                                                          |
| `@lazy`                     | Only if lazy evaluation is supported.                                                                      |
| `@category`                 | The function's category (e.g., `Array`, `Object`, `String`).                                               |

Tag order is enforced: `@param`, `@returns`, `@signature`, `@example`, `@dataFirst`/`@dataLast`, `@lazy`, `@category`.

## 4. Export

Add `export * from "./functionName";` to `src/index.ts` (alphabetical order).

## 5. Migration Mappings

Check whether the new function is an equivalent of a Lodash or Ramda function. If so, add a mapping file:

- `packages/docs/src/content/mapping/lodash/functionName.md`
- `packages/docs/src/content/mapping/ramda/functionName.md`

Format:

```markdown
---
category: CategoryName
remeda: functionName
---
```

If there's no equivalent, skip this step.
