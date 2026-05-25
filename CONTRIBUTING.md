# Contributing guide

Every PR is read end-to-end by a maintainer before it merges; No exceptions, but there is only one maintainer, so every PR matters! We use coding agents to help with parts of the review (catching patterns, running checks, drafting feedback), but the decision on what ships is always a human one. Reviewing a PR thoroughly takes hours, and that time is the project's scarcest resource.

## Skin in the game

We look for contributors with a personal stake in the change:

- **You hit a bug** in your own project and figured out the fix.
- **You need a function/feature** the library doesn't have, and you'll use it.
- **You have insights from your personal experience** that you think is valuable to fix, e.g., how we structure our docs site, or something that other libraries have adopted and you think we should too.

What we discourage are "I just want to help out", "this looks cool", or "this is easy/small" PRs: picking low-hanging items off our issues without a personal stake. Adding PR load is the single highest-cost thing a well-intentioned contributor can do on this project.

If you're unsure whether your contribution fits, open an issue (or comment on an existing one) before writing code.

## Working with a coding agent

Using a coding agent to write or polish a PR is fine. Remeda's [`AGENTS.md`](AGENTS.md) and contributor harness are set up for exactly that. What matters is that you, the contributor, are driving: you understand your PR thoroughly! Respond to review comments directly, iterate the PR through to merge, and engage on the underlying issue.

**Please no auto-piloted PRs!**

## Getting started

We use `npm`. The `.nvmrc` has the recommended Node version (we recommend [`nvm`](https://github.com/nvm-sh/nvm)).

```bash
git clone git@github.com:remeda/remeda.git
cd remeda
npm install
```

The library lives in [`packages/remeda/`](packages/remeda/); run scripts from there:

```bash
cd packages/remeda
npm test           # runtime tests, watch mode
npm run test:types # type-level tests
npm run test:prop  # property-based tests
npm run format     # format (also runs on commit)
npm run lint       # lint with auto-fix
```

## What we accept

- **In**: functions providing typing, correctness, or composability that can't be achieved by composing existing functions; Lodash migration blockers (even reluctantly).
- **Out**: simple compositions, native JS/TS equivalents, runtime safety nets, recursive/traversal functions, ambiguous semantics.

We don't ship `reject` because it's `filter(isNot)`, and we don't ship `zipObject` because it's `fromEntries(zip)`. A new function must justify why `fn1(fn2(...))` isn't enough.

## Adding a new function

- Add a JSDoc block with a description, parameters, signature, an example, and tags. This becomes the website docs.
- Add runtime tests in `functionName.test.ts` and type tests in `functionName.test-d.ts`. Cover both data-first and data-last calling styles.
- Add an export to [`packages/remeda/src/index.ts`](packages/remeda/src/index.ts) (alphabetical).
- If a Lodash, Ramda, or Just equivalent exists, add a mapping page under [`packages/docs/src/content/mapping/`](packages/docs/src/content/mapping/).

Pick a recent function as a template; [`packages/remeda/src/`](packages/remeda/src/) is full of small, self-contained examples. For the type-utility conventions used inside implementations (`IterableContainer`, `type-fest`, naming hierarchy), see [`AGENTS.md`](AGENTS.md).

## Writing tests

- Runtime assertions (`expect`) and type assertions (`expectTypeOf`) live in separate files (`.test.ts` and `.test-d.ts`). Never mix them.
- Cover both calling styles. For data-last tests, prefer `pipe`; it matches real-world usage.
- Each `test` block tests one thing; most have a single `expect`.
- Tests must provide 100% coverage. Codecov comments on the PR.
- Use [`expectTypeOf`](https://vitest.dev/api/expect-typeof) for type tests, not [`assertType`](https://vitest.dev/api/assert-type.html).
- Prefer [`@ts-expect-error` over `@ts-ignore`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#ts-ignore-or-ts-expect-error). Include the TS error code and a one-line reason:
  ```ts
  // @ts-expect-error [ts2345] - non-literal numbers can't be used as depth.
  flat([], 1 as number);
  ```
- Regression tests for bug fixes must be **red-green verified**: revert the fix, confirm the test fails, then restore. A test that passes against the buggy code doesn't protect against regression. Reference the issue or PR number in the test name or a comment so the case can be traced back.

### Property tests

Property tests live in `functionName.test-prop.ts` and verify invariants with [fast-check](https://fast-check.dev/). Use them when a function has clear mathematical properties: idempotence (`sort(sort(x))` = `sort(x)`), involutions (`reverse(reverse(x))` = `x`), round-trips (`flat(chunk(x, n))` = `x`), or preservation (every input element appears in output). Run with `npm run test:prop`.

## Commit and PR titles

Format: `<TYPE>(<scope>): description`, where scope is the function name (optional for `chore`).

- `feat` - new function or backwards-compatible capability - releases as **patch**
- `fix` - change to runtime behavior or type refinement - releases as **minor**
- `docs` - documentation changes
- `chore` - anything else not user-visible (tests-only, deps, CI)

> Remeda uses **inverted** `semantic-release` semantics: `feat:` -> patch (additive, safe), `fix:` -> minor (behavior change, risky). See [`packages/remeda/release.config.js`](packages/remeda/release.config.js).

## Documentation

Most documentation is generated from JSDoc comments. For the docs website or migration guides, see [`packages/docs/README.md`](packages/docs/README.md).

## What we value

- **No type annotations needed.** Functions should have good types without callers writing them.
- **Good output types.** `filter(data, isNumber)` exists because it returns a narrower type than `data.filter(item => typeof item === 'number')`.
- **Readability.** `map(add(3))` reads better than `map(item => item + 3)`. That's why we ship `constant`, `doNothing`, `identity`.
- **Minimal implementations.** Importing a function should add less than ~500 B to the bundle in most cases.
