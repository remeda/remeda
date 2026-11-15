# StackBlitz Template

`pkg-pr-new` publishes this sandbox with each Remeda PR, so its files are user-facing. `remeda` is a regular dependency: locally the workspace package's `dist`, so rebuild `packages/remeda` to try source changes.

## Commands

```bash
npm test  # runtime + type tests (vitest --typecheck)
npm start # Node REPL with all Remeda exports as globals
```

## Structure

- `src/runtime.test.ts`, `src/typing.test-d.ts` - runtime and type tests
- `src/playground.ts` - type playground with the relaxed `tsconfig.playground.json`, mirroring typescriptlang.org/play
- `interactive.js` - the `npm start` REPL

Everything else uses the strict `tsconfig.project.json`.
