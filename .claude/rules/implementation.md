---
paths:
  - "packages/remeda/src/**/*.ts"
---

# Function Implementation Conventions

## The Purry Pattern

Every dual-API function uses `purry` (see `src/purry.ts`). The pattern:

- Separate overloads for data-first and data-last, each with its own JSDoc block
- The implementation function does NOT get JSDoc
- Implementation signature returns `unknown` — `purry` uses argument counting, not generics
- `purry(implementation, args, lazyImplementation)` — third arg is optional lazy evaluator
- `purryFromLazy` (`src/internal/purryFromLazy.ts`) — for functions with no meaningful eager implementation

`purry` counts `args.length` vs `fn.length`: equal = data-first (calls directly), one less = data-last (returns curried function).

## Lazy Evaluation

The lazy evaluator processes items one-by-one, returning `LazyResult<T>`:

- `LazyNext<T>`: `{ done, hasNext: true, next: T }` — emit a value
- `LazyEmpty`: `{ done, hasNext: false }` — skip (use `SKIP_ITEM` from `utilityEvaluators.ts`)
- `LazyMany<T>`: `{ done, hasNext: true, hasMany: true, next: readonly T[] }` — expand into many

`done: true` stops the pipe (short-circuiting). `toSingle(lazyImpl)` wraps evaluators for scalar-returning functions like `first()`.

## `null`, `undefined`, and `NaN`

- `undefined` means "no value" — Remeda's canonical absent value
- `null` is a proper value, not interchangeable with `undefined`
- `NaN` is a JS accident — return `undefined` instead; it allows chaining and coalescing

## Type System

- Use `IterableContainer` (not `readonly T[]`) for array inputs — preserves tuple shapes
- Use `object` for object inputs — preserves per-key types instead of widening to `Record<string, T>`
- Internal types are not exported — they change frequently and are not designed as external API
- Use `PropertyKey` when you don't care about specific key type, not `string` or `number`
- Use `unknown` for irrelevant type slots and infer positions
- Prefer `readonly` in the type definition itself, not wrapping with `Readonly<>`
- Wrap records with bounded keys using `BoundedPartial<T>` — makes result partial for finite key sets while leaving unbounded records unchanged
- Use `extends readonly []` to check for empty arrays (not `X["length"] extends 0`)
- Minimize type parameter count — don't add a generic for items when inferrable from container
- Extract complex inline conditional types into named utility types for readability
- Inline types used once whose type parameters duplicate the function's — the alias adds indirection without value
- Check if `type-fest` provides a utility before writing a new one

### Output vs. Input Types

- **Output**: use `never` to remove cases from possible return values
- **Input**: use unsatisfiable constraints (e.g., `RemedaTypeError<"message">`) for clear errors
- `RemedaTypeError` uses a branded symbol, not a raw string — raw strings pass through downstream without being caught

### Type Preservation

- Preserve input shape in output — use `{ [K in keyof T]: S }` to maintain tuple structure
- Don't widen unnecessarily — `Array<1 | 2 | 3>` stays narrow, not `Array<number>`
- Compile-time errors over runtime flexibility — this is a deliberate trade-off

## JSDoc Style

- Examples: simple and almost trivial — show params and output, not full usage patterns
- Start with simple case, then build to complex
- Data-last examples use `pipe`
- Use Remeda's own utilities in examples (e.g., `toLowerCase()`)
- Descriptions: present tense, precise vocabulary
- Document behavior differences from Lodash/Ramda explicitly with examples
- Non-obvious type choices in internal code must have inline comments
- Complex type utility files should describe what each utility does

## File Layout

- Exported items first, then non-exported ("private") items — easier to scan
- Place constants above logic

## Code Quality

- Error messages must include the function name and the user-provided values

## Naming

- Names communicate **what**, not **how** — `Value` not `InferredRecord`
- Communicate differences clearly — `takeLast`/`dropLast`, not `takeRight`/`dropRight`
- Avoid conflicts with built-in TS/JS types (`Partial`, `Function`, etc.)
- Callback terminology: "predicate" (boolean), "mapper" (transforms), "grouper" (categorizes)
- Type parameter names should be descriptive when role isn't obvious
- Terminology precedence (highest to lowest):
  1. ECMAScript spec terminology (e.g. "receiver", "iterable", "record")
  2. V8 usage — when the spec is silent or ambiguous
  3. MDN usage — when V8 doesn't clarify
  4. Mathematics / statistics / scientific terms (e.g. "median", "clamp", "interpolate")
  5. Equivalent concept in Python, Rust, or other mainstream languages
  6. Lodash / Ramda naming — last resort, legacy migration convenience only
