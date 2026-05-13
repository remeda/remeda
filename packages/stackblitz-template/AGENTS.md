# StackBlitz Template

## Purpose

This is a StackBlitz sandbox template that gets created for each Remeda PR, allowing contributors to validate changes in a live environment. It is NOT a development package — it consumes `remeda` as a dependency.

## Commands

```bash
npm test  # run runtime + type tests (vitest --typecheck)
npm start # launch interactive REPL with all Remeda utilities in global scope
```

## Structure

- `src/runtime.test.ts` — runtime tests using Vitest expect/assert APIs
- `src/typing.test-d.ts` — type-level tests using `expectTypeOf`
- `src/playground.ts` — TypeScript playground with relaxed tsconfig (mirrors typescriptlang.org/play settings)
- `interactive.js` — Node REPL that loads all Remeda exports into global scope

Two separate tsconfig projects: `tsconfig.project.json` (strict, used for tests and REPL) and `tsconfig.playground.json` (relaxed, playground only).
