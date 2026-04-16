---
paths:
  - "**/*.test.ts"
  - "**/*.test-d.ts"
  - "**/*.test-prop.ts"
---

# Testing Conventions

## Runtime Tests (`.test.ts`)

- Data-last tests use `pipe` (matches real-world usage)
- One `expect` per `test` block — failures must pinpoint the exact case
- Keep tests simple and short — more tests are better than tests that do more
- Tests must be self-contained — no shared utilities or helpers; inline everything
- Use Remeda's own utilities in tests when applicable (`prop`, `constant`, etc.)

## Type Tests (`.test-d.ts`)

Runtime and type tests are **strictly separated** — never mix `expect()` and `expectTypeOf()` in the same test block. Exception: testing callback parameter types inline with `expectTypeOf` inside a callback is acceptable.

- Use `expectTypeOf(...).toEqualTypeOf<...>()` (not `assertType`)
- Cast empty arrays for type data: `[] as Array<{ name: string }>`
- Prefer casting (`as`) over explicit typing (`: Type`) — they don't always behave the same
- Don't annotate generics explicitly — define types on data, not via `<T>` on the call
- Only test inferred or "magic" types, not trivial signature parts with no inference
- Use `unknown` in type slots you don't care about — `Record<string, unknown>` not `Record<string, string>`
- Use disjoint value types in union tests — `Record<string, number> | Record<string, number>` doesn't test union logic
- Pull type definitions to module level, not inside test blocks
- `as const` is meaningless in runtime tests — don't use it there

## Property Tests (`.test-prop.ts`)

- Use `test.prop([arbitraries])("description", (values) => { expect(...) })` from `@fast-check/vitest`
- Verify invariants: idempotence, involutions, round-trips, preservation

## Test Hygiene

- Tests covering specific bugs should reference the issue number in the test name or a comment
- Test names must be distinct — duplicate names make failure reports ambiguous
- Test names describe what's being tested — "lazy early exit with hasMany" not "take and flat"
- Input arrays need enough variation to produce different outputs — overly simple inputs hide bugs
- `describe("KNOWN ISSUES", ...)` uses uppercase
