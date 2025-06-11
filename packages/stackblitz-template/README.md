# Welcome to the Remeda StackBlitz sandbox!

This sandbox provides several tools to make testing out Remeda functionality:

- An **interactive** Node REPL session ("console") with all Remeda utilities
  preloaded into the global scope; run automatically when the sandbox is
  started, and could be re-run via `npm start`.
- A pre-configured vitest **testing suite** that provides a surface for reproducing
  complex issues and edge-cases. Available both for
  [runtime (functional) testing](./src/runtime.test.ts), and
  [types testing](./src/typing.test-d.ts). Use `npm test` to run them, or via
  the recommended Vitest VSCode plugin.
- A [TypeScript **Playground**](./src/playground.ts) for checking how input and
  output types relate and affect each other, and configurable via it's own,
  separate, [TypeScript Configuration File](./tsconfig.playground.json).
