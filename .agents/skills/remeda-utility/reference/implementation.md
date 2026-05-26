# Function Implementation Conventions

## Purry: the dual-API skeleton

Every function with a data-first / data-last API uses `purry` (`src/purry.ts`). The structure is fixed:

- Two overload signatures: data-first **and** data-last, each with its own JSDoc block.
- One implementation signature — no JSDoc, returns `unknown`. `purry` dispatches by argument count at runtime, not by the typed overloads.
- The body calls `purry(impl, args, lazyImpl?)`. The third arg is the optional lazy evaluator (see below).

Use `purryFromLazy` (`src/internal/purryFromLazy.ts`) when there is no meaningful eager implementation — i.e., the eager path would just iterate and delegate to the lazy one. This avoids writing the eager loop twice.

## Lazy evaluation

A function should support lazy evaluation when it operates on arrays item-by-item inside a `pipe` and would benefit from either short-circuiting (e.g., `take(3)` stops after three items) or skip-filtering without materializing an intermediate array. Existing examples to study: `map`, `filter`, `take`, `first`, `flatMap`.

The lazy evaluator has the shape `(item, index, data) => LazyResult<T>`:

- **Emit one value** — `{ hasNext: true, next: value, done }` (`LazyNext`).
- **Skip the current item, keep going** — use `SKIP_ITEM` from `src/internal/utilityEvaluators.ts` (it expands to `{ done: false, hasNext: false }`).
- **Expand into multiple values** — `{ hasNext: true, hasMany: true, next: values[], done }` (`LazyMany`).

Set `done: true` to short-circuit the pipe — no further items will be requested. For functions that return a single scalar (e.g., `first()`), wrap the evaluator with `toSingle(lazyImpl)` so `pipe` knows to stop after one result.

## Handling `null`, `undefined`, and `NaN`

These three "empty-ish" values are not interchangeable in Remeda:

- `undefined` is the canonical "no value" — return it from operations that have no meaningful result.
- `null` is a real value, not a stand-in for absence. Don't coerce between the two.
- `NaN` is a JavaScript accident. Prefer returning `undefined` instead — that lets the result chain through `??` and other coalescing without false negatives.

## Type System

### Inputs

- Use `IterableContainer` (not `readonly T[]`) for array inputs — it preserves tuple shapes (fixed-length, named-element tuples) through the function instead of widening to a homogeneous array.
- Use `PropertyKey` when you don't care about the specific key type (not `string` or `number`) — matches what TS uses for index signatures.
- Use `unknown` for type slots you don't care about — `Record<string, unknown>` rather than `Record<string, string>` when the value type is irrelevant to the type-level logic.
- Wrap records with bounded keys using `BoundedPartial<T>` — keeps the result partial when keys are a finite union but leaves unbounded records (e.g., `Record<string, V>`) unchanged.
- Use `extends readonly []` to test for empty arrays (not `X["length"] extends 0` — the former works on tuples without widening).

### Outputs and errors

- **Output narrowing** — use `never` to remove a case from the possible return types.
- **Input rejection** — use unsatisfiable constraints (`RemedaTypeError<"message">`) for clear errors at the call site. `RemedaTypeError` uses a branded symbol, not a raw string — raw strings pass through downstream without being caught.

### Shape preservation

- Preserve input shape in output where possible — `{ [K in keyof T]: S }` maintains tuple structure (length, order, named elements).
- Don't widen — `Array<1 | 2 | 3>` stays narrow, not `Array<number>`.

### Generic hygiene

- Minimize type parameters — don't add a generic for items when the type is inferable from the container.
- Single-use types whose parameters duplicate the function's should be inlined — the alias adds indirection without value.
- Extract complex inline conditional types into named utility types for readability.
- Check `type-fest` before writing a new type utility — it covers a lot already.

### Internal types

- Internal types are not exported. They change frequently and are not designed as external API.
- Non-obvious type choices in internal code must have an inline comment explaining the reasoning (the **why**, not the what).
- Complex type utility files should open with a comment describing what each exported utility does.

### Type-level performance

Combinatorial / recursive types can blow `tsc` up 100x+ in symbols, memory, and check time in ways that pass all tests but make consumer editors unusable. Two patterns to reach for, and one technique to confirm:

- **Keep recursion accumulators opaque.** When recursing with an accumulator, track _count_ (a tuple of `unknown`) rather than the actual elements being built. Sibling branches at the same depth share an opaque accumulator's type, which TS dedupes; carrying real types makes every path structurally unique and explodes the intermediate state space from `O(M * N)` to `O(M * 2^M)`. Stitch real elements together on unwind via `[Head, ...recurse]`.

- **Grow accumulators on pick; don't pre-build and shrink.** `Counter["length"] extends N` with a counter that grows by `[unknown, ...Counter]` is cheaper than pre-building `NTuple<unknown, N>` and destructuring `[unknown, ...infer Rest]` at every step. Skips the upfront build (N type-construction steps) and replaces a per-step destructure-and-infer with a constant-cost length lookup. Small win (~1-4% on instantiations) but consistent across N and M.

- **Measure with `tsc --extendedDiagnostics`.** Set up a small consumer-style repro that imports from the _built_ `dist/index.d.ts` (not source - source-mode compiles all of remeda and drowns the signal in ~115K symbols of baseline overhead). Rebuild (`npm run build`), warm up once (discard), then run 2-3 timed passes - numbers are stable across runs. Watch `Symbols`, `Types`, `Instantiations`, `Memory used`, `Check time`. `Instantiations` is the most sensitive early indicator - regressions show up there before time/memory budge.

## File Layout

- Exported items first, then non-exported ("private") items — readers scan top-to-bottom.
- Place constants above the logic that uses them.

## Naming

Most naming guidance is in AGENTS.md (`Design Defaults`). The Remeda-specific terminology precedence, when there's a choice between equivalent words:

1. **ECMAScript spec** terminology (e.g., "receiver", "iterable", "record")
2. **V8** usage — when the spec is silent or ambiguous
3. **MDN** usage — when V8 doesn't clarify
4. **Mathematics / statistics / scientific** terms (e.g., "median", "clamp", "interpolate")
5. **Equivalent concept in Python, Rust, or other mainstream languages**
6. **Lodash / Ramda** naming — last resort, only for legacy migration convenience

Other Remeda-specific naming rules:

- Avoid conflicts with built-in TS/JS types (`Partial`, `Function`, etc.) — they shadow at usage sites.
- Use full disambiguating suffixes: `takeLast`/`dropLast`, not `takeRight`/`dropRight` (Lodash's `Right` is ambiguous for non-array contexts).
- Callback parameter names follow their semantic role: `predicate` (boolean), `mapper` (transforms), `grouper` (categorizes).
- Type parameter names should be descriptive when the role isn't obvious from position — `Value` not `InferredRecord`; communicate **what**, not **how**.

## Code Quality

- Error messages must include the function name and the user-provided values — makes the error self-locating at the call site.
