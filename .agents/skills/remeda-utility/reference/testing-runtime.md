Runtime and type tests are **strictly separated** — never mix `expect()` and `expectTypeOf()` in the same test block. Exception: testing callback parameter types inline with `expectTypeOf` inside a callback is acceptable.

- Data-last tests use `pipe` (matches real-world usage)
- Prefer one `expect` per `test` block — failures should pinpoint the exact case
- Keep tests simple and short — more tests are better than tests that do more
- Tests must be self-contained — no shared utilities or helpers; inline everything
- Use Remeda's own utilities in tests when applicable (`prop`, `constant`, etc.)
