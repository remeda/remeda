---
paths:
  - "packages/remeda/src/**/*.test-d.ts"
---

# Testing Conventions

Runtime and type tests are **strictly separated** — never mix `expect()` and `expectTypeOf()` in the same test block. Exception: testing callback parameter types inline with `expectTypeOf` inside a callback is acceptable.

- Use `expectTypeOf(...).toEqualTypeOf<...>()` (not `assertType`)
- `interface` tests are NOT redundant with `type` tests of the same shape — they exercise different TS-level paths through `Record`-extending constraints (see CLAUDE.md).
- Cast empty arrays for type data: `[] as Array<{ name: string }>`
- Prefer casting (`as`) over explicit typing (`: Type`) — they don't always behave the same
- Don't annotate generics explicitly — define types on data, not via `<T>` on the call
- Only test inferred or "magic" types, not trivial signature parts with no inference
- Use `unknown` in type slots you don't care about — `Record<string, unknown>` not `Record<string, string>`
- Use disjoint value types in union tests — `Record<string, number> | Record<string, boolean>`, not `Record<string, number> | Record<string, number>` (identical sides don't test union logic)
- Pull type definitions to module level, not inside test blocks
- `as const` doesn't affect runtime behavior and isn't needed in `.test.ts` files — only use it in `.test-d.ts` where it narrows types
- When `@typescript-eslint/no-unnecessary-type-assertion` flags an inference-controlling cast, replace `value as T` with `$typed<T>()` from `test/$typed` rather than autofixing
  - Safe when the rule's reason is "This assertion is unnecessary since the receiver accepts the original type of the expression"
  - Proceed cautiously for other reasons; for `interface` types, suppress per-site with a reason comment instead — see `$typed` JSDoc

# Test Hygiene

- Tests covering specific bugs should reference the issue number in the test name or a comment
- Test names must be distinct — duplicate names make failure reports ambiguous
- Test names describe what's being tested — "lazy early exit with hasMany" not "take and flat"
- Input arrays need enough variation to produce different outputs — overly simple inputs hide bugs
