---
paths:
  - "packages/remeda/src/**/*.test-prop.ts"
---

# Testing Conventions

- Use `test.prop([arbitraries])("description", (values) => { expect(...) })` from `@fast-check/vitest`
- Verify invariants: idempotence, involutions, round-trips, preservation

# Test Hygiene

- Tests covering specific bugs should reference the issue number in the test name or a comment
- Test names must be distinct — duplicate names make failure reports ambiguous
- Test names describe what's being tested — "lazy early exit with hasMany" not "take and flat"
- Input arrays need enough variation to produce different outputs — overly simple inputs hide bugs
