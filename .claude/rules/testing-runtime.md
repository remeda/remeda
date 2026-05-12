---
paths:
  - "packages/remeda/src/**/*.test.ts"
---

# Testing Conventions

- Data-last tests use `pipe` (matches real-world usage)
- Prefer one `expect` per `test` block — failures should pinpoint the exact case
- Keep tests simple and short — more tests are better than tests that do more
- Tests must be self-contained — no shared utilities or helpers; inline everything
- Use Remeda's own utilities in tests when applicable (`prop`, `constant`, etc.)

# Test Hygiene

- Tests covering specific bugs should reference the issue number in the test name or a comment
- Test names must be distinct — duplicate names make failure reports ambiguous
- Test names describe what's being tested — "lazy early exit with hasMany" not "take and flat"
- Input arrays need enough variation to produce different outputs — overly simple inputs hide bugs
