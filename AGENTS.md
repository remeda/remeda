TypeScript-first utility library with 160+ functions. Dual calling styles via `purry`: data-first (`filter(array, fn)`) and data-last (`pipe(array, filter(fn))`). Many functions support lazy evaluation in `pipe` chains.

## Core Philosophy

1. **Move errors from runtime to compile time.** Types are coupled to the runtime — stricter types over looser flexibility.
2. **Composition over wrapper functions.** A new function must justify why `fn1(fn2(...))` isn't enough. No `reject` — use `filter(isNot)`. No `compact` — use `filter(isDefined)`.
3. **No mutation.** Every function returns a new (shallow) clone.
4. **Prefer not throwing.** Only throw when the algorithm genuinely cannot proceed.
5. **TypeScript-only.** Non-TS usage is unsupported.

### Scope

- **In**: Functions providing meaningful typing, correctness, or composability not achievable by composing existing functions; Lodash migration blockers (even reluctantly)
- **Out**: Simple compositions, native JS/TS equivalents, runtime safety nets, recursive/traversal functions, ambiguous semantics

### Design Defaults

- Type parameters are always inferred, never explicitly provided
- Implementations: small and self-contained
- Optional parameters are a code smell — the complexity is rarely worth it
- Data-last API and lazy evaluation in `pipe` are core identity
- Full names over abbreviations (`conditional` not `cond`, `entries` not `toPairs`)
- Close to native JS naming; override when JS design was historically wrong
- API consistency: if `groupBy` allows `undefined` returns for filtering, similar functions should too
- Functions are differentiated by name, not by overloaded signatures with different behavior
- Type-level constraints over runtime checks when possible

## Tooling

For symbol navigation (go-to-definition, find-references, workspace symbol search) prefer the `LSP` tool over Grep — it follows TypeScript semantics rather than text matches.

For type-checking during development, lean on `LSP` rather than terminal `check` runs:

- After editing a type-heavy file, read diagnostics on it before moving on — don't wait for the turn-end hook to surface errors.
- When iterating on a generic, hover to inspect the inferred type at each step rather than guessing.
- When a `.test-d.ts` type test fails, read diagnostics on the file to see the full type mismatch (often clearer than the test runner output).

### Hooks that run automatically

- **On edit** — prettier formats the touched file; don't run `npm run format` manually.
- **On turn end** — a per-package checks hook runs for each workspace that has dirty files. The turn blocks on the first failure, and any lint auto-fixes are surfaced as a diff to review. Don't run these manually mid-turn.
  - `packages/remeda` — `check` → `lint` (with `--fix`) → `test:coverage` (with 100% thresholds) → `test:types`.
  - `packages/docs` — precondition that `packages/remeda/dist` is fresh relative to `packages/remeda/src` (rebuild remeda if it isn't) → `sync` → `check` → `lint` (with `--fix`) → `build`.

## Commands

Install dependencies from the repo root with `npm install`. All commands run from `packages/remeda/`:

```bash
npm run test:runtime # runtime tests
npm run test:types   # type-level tests
npm run test:prop    # property-based tests
npm run build        # build with tsdown (ESM + CJS)
npm run check        # typecheck source files
npm run lint         # eslint with autofix
```

## Architecture

### Monorepo (npm workspaces)

- `packages/remeda/` — the library (where nearly all work happens)
- `packages/docs/` — Astro docs site (auto-generated from JSDoc)
- `packages/stackblitz-template/` — StackBlitz playground

### Source Layout (`packages/remeda/src/`)

Each function is a single file with up to 3 companion test files:

- `functionName.ts` — implementation
- `functionName.test.ts` — runtime tests (Vitest)
- `functionName.test-d.ts` — type tests (`expectTypeOf` from Vitest)
- `functionName.test-prop.ts` — property-based tests (fast-check)

Internal helpers: `src/internal/`. Type utilities: `src/internal/types/`.

### Purry & Pipe

`purry` enables dual calling styles by counting arguments: all args = data-first (calls directly), one fewer = data-last (returns curried function). Every exported function that operates on data uses `purry`.

`pipe(data, fn1, fn2, fn3)` chains data-last functions. When consecutive functions in a pipe have a `lazy` property (attached by `purry`), `pipe` batches them and processes items **one-by-one** through the batch instead of eagerly running each function on the full array. This enables short-circuiting (e.g., `take(3)` stops after 3 items) and skip-filtering without intermediate arrays.

## Conventions

- `exactOptionalPropertyTypes` is a hard requirement — all types assume it is enabled
- `interface` and `class` types don't extend `Record<PropertyKey, unknown>` the way type literals of the same shape do — TS preserves declaration-merging on them, so they're not on the same lattice as type aliases. Prefer `T extends object` over `T extends Record<…>` in generic constraints so interface/class inputs aren't silently rejected. When auditing type-test redundancy, an `interface`/`class` test is NOT a duplicate of a `type`-literal test of the same shape.
- Prefer `@ts-expect-error` over type assertions (`as`) — suppressions surface when TS improves; casts hide errors silently. Every `@ts-expect-error` must include the TS error code **and** an explanation of why the suppression is safe (e.g., `// @ts-expect-error [ts2345] -- purry infers this correctly at the call site`)
- Every `eslint-disable` comment must include an explanation of why the rule is safe to suppress in that specific case
- Workarounds for known dependency bugs must always link to the upstream GitHub issue or PR (so we know when the fix lands and the workaround can be removed)
- Suspected TS/ESLint false positive bugs (you're confident the code is correct, the tool is wrong): suppress with `@ts-expect-error` / `eslint-disable-next-line` and flag the suspected bug in the reason. Never reshape the code or reach for `as` to dodge it — suppressions surface when the bug is fixed upstream and can then be removed; workarounds silently outlive the bug
- Benchmarks, not intuition, for performance: >=15% improvement, no regressions, same readability
- **Code as copy-paste source**: This is MIT-licensed code that gets copied verbatim into other projects and then expanded or remixed. The base that gets copied must be high quality — clean, idiomatic, well-commented. Variable and parameter names must be descriptive, unabbreviated, and fitting for the algorithm (e.g., `comparator` not `cmp`, `accumulator` not `acc`). Comments explain **why**, never **what**; focus on complex types and non-obvious algorithmic choices. Never state the obvious; this is a canonical utility library, not a tutorial. The code itself should be clear enough that "what" comments are redundant
- **Expiring TODOs**: Use `TODO [>N]` syntax to surface stale TODOs at lint time. **Never use date-based expiration** (those explode unexpectedly for whoever runs lint that day). Two forms:
  - `TODO [>2]` — Remeda package version; marks work for the next major bump (e.g., `[>2]` = "do this for v3")
  - `TODO [typescript@>5.5]` — dependency version; for workarounds tied to bugs/missing features in a specific dep version

### PR & Commit Titles

Format: `<TYPE>(<scope>): description` where scope is the function name.

- `feat` — new function or expanded, backwards-compatible capability (releases as **patch**)
- `fix` — change to runtime behavior or type refinement of an existing function (releases as **minor**)
- `docs` — documentation or docs site changes
- `chore` — anything else not noticeable to library users (tests-only, deps, CI)

* scope is used to communicate which utility function was changed in `feat`, `fix`, and `docs` commits (which touch specific functions). It is optional for `chore` commits where there isn't a specific sub-component that is being changed.

IMPORTANT: Remeda uses **inverted** `semantic-release` semantics — `feat:` -> patch (additive, safe), `fix:` -> minor (behavior change, risky). See `packages/remeda/release.config.js`.
