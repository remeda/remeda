# Code Standards — Core (language-neutral)

These rules apply to every language in every repo. Language profiles in `docs/STANDARDS.md` add tool-specific
rules; they never relax these. Deterministic checks (`make lint`) enforce what can be measured; the reviewer
(`/fresh-review`, no-mistakes) enforces the rest. A rule that is not enforced somewhere is a wish, not a standard.

## 1. Naming
- Names say what a thing *is* or *does*, in the domain vocabulary from `docs/domain.md`. No abbreviations the
  domain doesn't use. No `data`, `info`, `manager`, `helper`, `util`, `misc`, `temp`, `foo`.
- Booleans read as predicates (`is_ready`, `has_access`, `can_retry`). Functions are verbs; types are nouns.
- One name per concept across the whole repo. If the code calls it `account` and the spec calls it `customer`,
  fix one of them.

## 2. Functions
- One responsibility. If describing it needs "and", split it.
- ≤ 40 lines, ≤ 4 parameters, cyclomatic complexity ≤ 10, nesting ≤ 3. Enforced by the linter where possible.
- No boolean flag parameters that switch behavior — two functions instead.
- Pure where possible; side effects at the edges, named as such (`save_`, `send_`, `write_`).

## 3. Modules & interfaces
- Deep modules, narrow interfaces (Ousterhout): a module's public surface is small; the complexity lives inside.
- Dependencies point inward: domain logic never imports I/O, frameworks, or transport.
- Files ≤ ~400 lines. Split by responsibility, not by type ("models/", "utils/" are smells).
- Public interfaces are typed and documented. Internal helpers are private by the language's convention.

## 4. Duplication
- Three similar lines is fine; three similar blocks is a function. Check the repo before writing anything that
  sounds generic (parsing, retries, formatting, validation) — it probably exists.
- Copy-pasted-then-edited code is a defect, not a shortcut.

## 5. Errors
- Fail fast at boundaries (input, config, network). Validate once, at the edge; trust typed data inside.
- Never swallow: no empty catch, no `except: pass`, no `_ = err`. Either handle, wrap with context, or propagate.
- Errors carry context (what was attempted, with which identifiers), never secrets.
- Distinguish expected failures (return/Result/typed error) from bugs (throw/panic/assert).

## 6. Types
- Strictest type setting the language offers, on. `any`/`object`/`interface{}`/untyped `dict` at a public
  boundary is a finding.
- Make illegal states unrepresentable where the language allows (enums, unions, newtypes, non-nullable).

## 7. Tests
- Tests describe behavior from the spec, written *before* the code that satisfies them. A test that asserts
  "whatever the code currently does" is not a test.
- One behavior per test; name says the behavior (`rejects_expired_token`, not `test_auth_3`).
- No test may read implementation source text (grep/regex/snapshot of code) as its evidence. Exercise the
  interface; assert observable outcome.
- Bug fixes start with a failing repro test.
- Deleting, skipping, or loosening a test is an escalation, never a fix.

## 8. Comments & docs
- Comments explain *why* (constraints, tradeoffs, links to decisions), never *what*. Dead code is deleted, not
  commented out.
- Every public module has a one-paragraph docstring: purpose, main entry points, invariants.
- `docs/domain.md` is the vocabulary. `docs/adr/` records architectural decisions (one file each, dated).

## 9. Dependencies
- Adding a runtime dependency requires: a one-line justification in the PR, a maintained upstream, a lockfile
  update, and a pass from the vulnerability audit. Prefer stdlib.
- Pin versions in lockfiles; ranges only in library manifests.

## 10. Change hygiene
- Conventional commits; one logical change per commit; no "fix", "wip", "stuff".
- A PR does one thing named in its spec. "While I was here" changes go in their own PR.
- Formatter output is never argued with. Linter findings are fixed, not suppressed; a suppression needs a
  comment naming the reason and an owner.

## Severity guide for reviewers
| Finding | Severity |
|---|---|
| Swallowed error, weakened test, secret in code, untyped public boundary | error → escalate |
| Duplication of existing repo logic, function over limits, dependency without justification | error → fix if local, else escalate |
| Naming outside domain vocabulary, missing docstring on public API, comment explaining *what* | warning → fix |
| Style the formatter didn't catch | nit |


---

# Language profiles

# TypeScript / JavaScript profile
Inherits: Google TypeScript Style; typescript-eslint strict-type-checked. Tooling: **eslint** flat config with
`complexity` / `max-lines-per-function` / `max-depth` / `max-params`, **eslint-plugin-security**, **sonarjs**,
**prettier**, `tsc --noEmit` (strict), **knip** (dead exports/deps), **npm audit**, **vitest**, **gitleaks**.
- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride` on. `any` is an error; use `unknown` and narrow.
- ESM only; named exports; barrel files only at package roots.
- Runtime validation at boundaries (zod/valibot); types derived from schemas, not duplicated.
- Typed error classes or Result-style returns; no empty `catch`; every promise handled (`no-floating-promises`).
- No `console.log` in library code; no `eval` / `new Function` / `innerHTML` with untrusted input.
- Tests: vitest; `*.test.ts` beside the module; test names are behaviors.
Targets: `lint-ts` = eslint + prettier --check + tsc --noEmit + knip; `audit-ts` = npm audit --audit-level=high; `test-ts` = vitest run; `format-ts` = prettier --write.
