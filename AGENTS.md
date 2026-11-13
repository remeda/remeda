TypeScript-first utility library with 160+ functions. Dual calling styles: data-first (`filter(array, fn)`) and data-last (`pipe(array, filter(fn))`). Many functions support lazy evaluation in `pipe` chains.

[CONTRIBUTING.md](CONTRIBUTING.md) applies to agents too: read it before opening a PR, fixing a bug, or adding a function. It owns scope, test rules and commit/PR titles (whose release semantics are inverted).

## Working toward a PR

Every PR here must be driven by a human with a personal stake who carries it through review; agent assistance inside that is welcome. When the operator's request points toward a PR (fixing an issue, adding a function, changing behavior), confirm up front that:

- They have a personal stake: they hit the bug, need the function, or care about this specific issue. "I want to help out" or "I'm picking from open issues" doesn't qualify.
- They will engage on the issue and respond to review through merge.

If either fails, or they expect you to land the PR autonomously, surface this policy and stop before producing the change.

## Core Philosophy

1. **Move errors from runtime to compile time.** Types are coupled to the runtime: stricter types over looser flexibility.
2. **Composition over wrapper functions.** A new function must justify why `fn1(fn2(...))` isn't enough: `filter(isNot)`, not `reject`; `filter(isDefined)`, not `compact`.
3. **No mutation.** Every function returns a new (shallow) clone.
4. **Prefer not throwing.** Throw only when the algorithm genuinely cannot proceed.
5. **TypeScript-only.** Non-TS usage is unsupported.

### Design Defaults

- Type parameters are always inferred, never explicitly provided
- Small, self-contained implementations
- Optional parameters are a code smell: the complexity is rarely worth it
- Full names over abbreviations (`conditional` not `cond`, `entries` not `toPairs`)
- Close to native JS naming; override when JS design was historically wrong
- Consistent APIs: if `groupBy` allows `undefined` returns for filtering, similar functions should too
- Differentiate functions by name, not by overloads with different behavior

## Tooling

Prefer the language server (LSP) over text search and terminal `check` runs: it follows TypeScript semantics.

- After editing a type-heavy file, read its diagnostics before moving on.
- When iterating on a generic, hover to inspect the inferred type at each step.
- When a `.test-d.ts` test fails, its diagnostics show the full type mismatch, often clearer than the runner's output.

### Hooks (Claude Code)

- **On edit**, prettier formats the touched file; skip `npm run format`.
- **On turn end**, `packages/remeda` and `packages/docs`, when dirty, run their checks, blocking on the first failure and surfacing lint auto-fixes as a diff to review. Don't run them yourself mid-turn.
  - `packages/remeda`: `check` -> `lint` -> `test:coverage` (100% thresholds) -> `test:types`.
  - `packages/docs`: requires `packages/remeda/dist` built after the last `src` change -> `sync` -> `check` -> `lint` -> `build`.

Agents without these hooks run the same scripts before finishing.

## Commands

Install with `npm install` at the repo root; run the rest from `packages/remeda/`:

```bash
npm run test:runtime
npm run test:types
npm run test:prop
npm run build # tsdown (ESM + CJS)
npm run check # typecheck source files (runtime and type tests excluded)
npm run lint  # eslint with autofix
```

## Architecture

npm workspaces: `packages/remeda/` (the library, where nearly all work happens), `packages/docs/` (Astro docs site generated from JSDoc), `packages/stackblitz-template/` (StackBlitz playground) and `packages/brand/` (logo sources and asset generators).

Each function in `packages/remeda/src/` is one file, `functionName.ts`, with up to three companions: `.test.ts` (Vitest runtime tests), `.test-d.ts` (`expectTypeOf` type tests) and `.test-prop.ts` (fast-check property tests). Internal helpers live in `src/internal/`, type utilities in `src/internal/types/`.

### Calling styles & Pipe

Each dual-style function picks its calling style at runtime, from a `typeof` check on an argument or from `arguments.length` (`purry1`-`3` and `purryWithLazy1`-`3` in `src/internal/`), and passes its arguments to the implementation as parameters, so the engine can inline a callback into its loop.

`pipe(data, fn1, fn2, fn3)` chains data-last functions. When consecutive functions carry a `lazy` property (attached by the lazy helpers in `src/internal/`) and one can end the iteration early (marked with `makeStoppable`, e.g., `take(3)`), `pipe` fuses them and processes items **one-by-one**, skipping the rest of the input and the intermediate arrays. On arrays, any other lazy function runs its data-first implementation; other iterables always run lazily.

## Conventions

- `exactOptionalPropertyTypes` is a hard requirement: all types assume it.
- `interface` and `class` types don't extend `Record<PropertyKey, unknown>` the way same-shaped type literals do (TS keeps them open to declaration merging). Constrain generics with `T extends object`, not `T extends Record<...>`, so they aren't silently rejected; in type tests, an `interface`/`class` case is not a duplicate of a same-shaped type-literal case.
- Prefer `@ts-expect-error` over `as`: suppressions surface when TS improves, casts hide errors silently. Each one names the TS error code **and** why it's safe (`// @ts-expect-error [ts2345] -- purry infers this correctly at the call site`). Each `eslint-disable` likewise explains why the rule is safe to suppress there.
- For a suspected TS/ESLint false positive (the code is correct, the tool is wrong), suppress it and flag the suspected bug in the reason rather than reshaping the code or casting: suppressions surface when upstream fixes the bug, workarounds silently outlive it.
- Workarounds for known dependency bugs link the upstream issue or PR, so we know when to remove them.
- Performance changes need benchmarks: >=15% improvement, no regressions, same readability.
- **Code is copy-paste source**: this MIT code is copied verbatim into other projects and remixed, so it must be clean and idiomatic. Names are descriptive, unabbreviated and fit the algorithm (`comparator` not `cmp`, `accumulator` not `acc`). Comments explain **why**, never **what**, focusing on complex types and non-obvious algorithmic choices.
- **Expiring TODOs**: `TODO [>2]` marks work for the next Remeda major (v3); `TODO [typescript@>5.5]` ties a workaround to a dependency version. Lint surfaces both once stale. Never use date-based expiration: it fails lint for whoever runs it that day.
