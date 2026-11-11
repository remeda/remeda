# Contributing guide

Remeda has one maintainer, who reads every PR end-to-end; agents help review, but a human decides what ships. A thorough review takes hours, the project's scarcest resource.

## Skin in the game

We look for contributors with a personal stake in the change:

- **You hit a bug** in your own project and figured out the fix.
- **You need a function or feature** the library doesn't have, and you'll use it.
- **You have insights from your own experience**, e.g., on our docs site's structure, or a practice other libraries adopted that we should too.

We discourage "I just want to help out", "this looks cool" or "this is easy/small" PRs that pick low-hanging issues without a personal stake: adding PR load is the costliest thing a well-intentioned contributor can do here.

If you're unsure whether your contribution fits, open an issue (or comment on an existing one) before writing code.

## Working with a coding agent

Using a coding agent to write or polish a PR is fine; [`AGENTS.md`](AGENTS.md) and our agent skills are set up for it. You drive: understand the PR thoroughly, answer review comments yourself, iterate through to merge, and engage on the underlying issue. **No auto-piloted PRs.**

## Getting started

We use `npm`; `.nvmrc` has the recommended Node version (we recommend [`nvm`](https://github.com/nvm-sh/nvm)). The library lives in [`packages/remeda/`](packages/remeda/); run scripts from there:

```bash
git clone git@github.com:remeda/remeda.git
cd remeda
npm install
cd packages/remeda
npm run test:runtime # runtime tests
npm run test:types   # type-level tests
npm run test:prop    # property-based tests
npm run lint         # lint with auto-fix
```

Formatting, linting and type-checking also run on commit.

## What we accept

- **In**: functions providing typing, correctness, or composability that composing existing functions can't; Lodash migration blockers (even reluctantly).
- **Out**: simple compositions, native JS/TS equivalents, runtime safety nets, recursive/traversal functions, ambiguous semantics.

A new function must justify why `fn1(fn2(...))` isn't enough: we don't ship `reject` (`filter(isNot)`) or `zipObject` (`fromEntries(zip(...))`). We value:

- **No type annotations needed**: functions have good types without callers writing any.
- **Good output types**: `map(tuple, mapper)` keeps the tuple's shape; `tuple.map(mapper)` widens it to an array.
- **Readability**: `map(add(3))` reads better than `map(item => item + 3)`, hence `constant`, `doNothing` and `identity`.
- **Minimal implementations**: importing a function should add less than ~500 B to the bundle in most cases.

## Adding a new function

- Write a JSDoc block with a description, parameters, signature, an example, and tags; it becomes the website docs.
- Export it from [`packages/remeda/src/index.ts`](packages/remeda/src/index.ts) (alphabetically).
- If a Lodash, Ramda, or Just equivalent exists, add a mapping page under [`packages/docs/src/content/mapping/`](packages/docs/src/content/mapping/).

Use a recent function in [`packages/remeda/src/`](packages/remeda/src/) as a template. Implementation conventions (lazy callbacks, `IterableContainer`, `type-fest`, naming) are in [`.agents/skills/remeda-utility/reference/implementation.md`](.agents/skills/remeda-utility/reference/implementation.md).

## Writing tests

- Runtime assertions (`expect`) go in `functionName.test.ts` and type assertions ([`expectTypeOf`](https://vitest.dev/api/expect-typeof), not `assertType`) in `functionName.test-d.ts`. Never mix them.
- Cover both calling styles. For data-last, prefer `pipe`; it matches real-world usage.
- Each `test` block tests one thing; most have a single `expect`.
- Tests must provide 100% coverage; Codecov comments on the PR.
- Prefer `@ts-expect-error` over `@ts-ignore`, with the TS error code and a one-line reason:
  ```ts
  // @ts-expect-error [ts2345] -- non-literal numbers can't be used as depth.
  flat([], 1 as number);
  ```
- Red-green verify regression tests: revert the fix, confirm the test fails, then restore it. Reference the issue or PR number in the test name or a comment.
- Add property tests ([fast-check](https://fast-check.dev/), in `functionName.test-prop.ts`) when a function has clear invariants: idempotence (`sort(sort(x))` = `sort(x)`), involution (`reverse(reverse(x))` = `x`), round-trips (`flat(chunk(x, n))` = `x`), or preservation (every input element appears in the output).

## Commit and PR titles

Format: `<TYPE>(<scope>): description`, where scope is the function name (optional for `chore`). Remeda **inverts** the usual `semantic-release` semantics (see [`release.config.js`](packages/remeda/release.config.js)):

- `feat` - new function or backwards-compatible capability; releases as **patch** (additive, safe)
- `fix` - change to runtime behavior or type refinement; releases as **minor** (behavior change, risky)
- `docs` - documentation changes
- `chore` - anything else not user-visible (tests-only, deps, CI)

## Documentation

For the docs website or migration guides, see [`packages/docs/README.md`](packages/docs/README.md).
