---
name: remeda-utility
description: Conventions for authoring, modifying, testing, and documenting a Remeda utility function, including the migration mapping pages for Lodash/Ramda/Just users. Use this skill whenever editing a file under `packages/remeda/src/` or `packages/docs/src/content/mapping/{lodash,ramda,just}/`, when reviewing a PR or local changes touching those directories, or whenever an issue, PR, or chat refers to a specific Remeda function or to a migration mapping page.
---

A new or modified Remeda function ships across five surfaces: implementation, tests, JSDoc, the public export, and, when a Lodash/Ramda/Just equivalent exists, migration mappings on the docs site.

# 1. Implementation (`src/functionName.ts`)

Read `reference/implementation.md` before editing a function's runtime implementation, its overload signatures, or any type it uses, directly or through imports.

# 2. Tests

Each function has up to three test files:

- **Runtime tests** (`functionName.test.ts`, Vitest): empty inputs and both calling styles. Read `reference/testing-runtime.md` when editing.
- **Type tests** (`functionName.test-d.ts`, `expectTypeOf`): inferred return types, narrowing, and compile errors on invalid inputs. Read `reference/testing-types.md` when editing.
- **Property tests** (`functionName.test-prop.ts`, `test.prop` from `@fast-check/vitest`): optional, encouraged for functions with algebraic properties (idempotence, involutions, round-trips).

Across all three:

- `expect()` lives only in `.test.ts` and `expectTypeOf()` only in `.test-d.ts`; never mix them in one test or file.
- Test names are terse, in the function's own vocabulary ("lazy early exit with a many control", not "take and flat"), rely on their parent `describe()` blocks instead of repeating them, and needn't read as prose.
- Every test calls the function under test directly, so one failing test shows what failed without learning the file's structure. Helpers live in the test file (the only shared ones are the modules in `test/`, such as `forceFusion` and `$typed`) and may build inputs and fixtures (a `naturals()` generator), never wrap the subject (a `run(...)` that calls it).
- A test for a specific bug references the issue number in its name or a comment.
- Known issues and limitations (an accepted wrong result, an upstream TypeScript bug, a case the types can't express) are pinned in a `describe("known issues!", ...)` block at the end of the file, in every test kind where the issue is observable. Each test pins the desired outcome negated with `.not.` (`expect(result).not.toBe(0)`, `expectTypeOf(result).not.toEqualTypeOf<number[]>()`), then the **current** one under an `// Actual` comment. A red `.not.` assertion means the limitation lifted; a red `// Actual` alone means a third outcome to examine. `// @ts-expect-error [tsNNNN] -- <why, linking the upstream issue when one exists>` is reserved for desired code that doesn't compile yet. The test name states the limitation; a comment in the body says why it exists, without restating the assertions.

# 3. JSDoc

Each overload gets its own JSDoc block with:

- A description: present tense, a one-line summary first and further detail after a blank line.
- `@param`, one per parameter.
- `@signature`: the call as written at the call site, `filter(data, predicate)` (data-first) or `filter(predicate)(data)` (data-last).
- `@example`: simple, almost trivial, showing params and output rather than a usage pattern. Data-last examples use `pipe`, `map` or `filter`.
- `@dataFirst` or `@dataLast`, matching the signature; the docs site labels and groups overloads by them.
- `@lazy`, only if the function supports lazy evaluation in `pipe`.
- `@category` (`Array`, `Object`, `String`, etc.), which drives docs-site navigation.

When users might pick the wrong one among closely related functions (e.g., `indexBy` vs. `fromKeys` vs. `pullObject` vs. `fromEntries`), every overload's description lists the alternatives with a one-line "use this when..." gloss, and the related functions' JSDoc cross-references back, so a user landing on any of them discovers the others.

The description, `@param`, `@returns` and `@deprecated` are identical across overloads, unless there's a strong reason to differ, which both blocks then state clearly.

# 4. Export

Add `export * from "./functionName";` to `src/index.ts` (alphabetical order).

# 5. Migration Mappings

A function that matches or replaces a Lodash, Ramda, or Just function needs a mapping page per library, so migrators searching for the upstream name find a clean answer for their call site; novel functions skip this section. Read `reference/migration.md` when adding such a function, or when editing or reviewing a file under `packages/docs/src/content/mapping/{lodash,ramda,just}/`.
