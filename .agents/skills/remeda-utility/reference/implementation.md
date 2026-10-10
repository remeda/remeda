# Function Implementation Conventions

## Purry: the dual-API skeleton

Every function with a data-first / data-last API uses `purry` (`src/purry.ts`). The structure is fixed:

- Two overload signatures: data-first **and** data-last, each with its own JSDoc block.
- One implementation signature — no JSDoc, returns `unknown`. `purry` dispatches by argument count at runtime, not by the typed overloads.
- The body calls `purry(impl, args)`, or `purryWithLazy(impl, args, lazyImpl)` (`src/internal/purryWithLazy.ts`) when the function also has a lazy evaluator (see below). The lazy protocol is private to the package, so the public `purry` has no lazy parameter.

A lazy function still gets a plain eager implementation for its data-first call, even when it mirrors the evaluator (`unique`, `difference`): running the evaluator item by item outside `pipe` costs a call and a result classification per item, and bundles the lazy runner into every data-first import.

## Lazy evaluation

A function should support lazy evaluation when it operates on arrays item-by-item inside a `pipe` and would benefit from either short-circuiting (e.g., `take(3)` stops after three items) or skip-filtering without materializing an intermediate array. Existing examples to study: `map`, `filter`, `take`, `first`, `flatMap`.

The lazy evaluator has the shape `(item, index, data, slot) => LazyResult<T>`. The common case is to return the (possibly transformed) item itself. Anything else the evaluator needs to tell `pipe` is a control from `src/internal/lazyControl.ts`: a registered symbol (`Symbol.for`) that `pipe` recognizes by identity. The two controls that carry a payload leave it in `slot` through their helper:

- **Emit one value, keep going** - return the value itself.
- **Skip the current item, keep going** - return `SKIP_ITEM`.
- **Emit one value and stop** - return `lastLazyValue(value, slot)`.
- **Stop without emitting anything** - return `STOP`; an evaluator that stops on the first item is `lazyEmptyEvaluator`, used as the evaluator itself.
- **Expand into multiple values** - return `manyLazyValues(values, slot)`; each element is fed through the rest of the pipe individually, and the pipe then continues with the next item.

`slot` belongs to the pipe that calls the evaluator, which reads the payload as soon as the evaluator returns. Declare it only in evaluators that call one of the two helpers (`(value, _index, _data, slot) => ...`), and hand it only to them.

For functions that return a single scalar (e.g., `first()`), wrap the lazy implementation with `toSingle(lazyImplementation)`. `toSingle` unwraps the result to its first element and ends the fused run at that step; stopping the iteration is the evaluator's job, via `lastLazyValue(value, slot)`.

### Opting into the `data` buffer

Buffering `data` costs an array push per item, so `pipe` only does it for steps that ask for it, via a `requiresData: true` marker on the evaluator. Set it with one of two helpers from `src/internal/requireData.ts`:

- `requireData(evaluator)` - the evaluator always needs `data`: `uniqueWith`'s reads it itself (it compares each item against every item seen so far), and `map`'s wrapper forwards it after `map` has run the arity check itself (see the `map` paragraph below).
- `requireDataByArity(callback, evaluator, { dataParameterIndex })` - the evaluator only forwards `data` to a user-supplied `callback`. `dataParameterIndex` is where `data` sits in that callback's own parameter list: 2 (the default) for `filter`, `flatMap`, `forEach`, `find`, `uniqueBy`; 3 for `mapWithFeedback`, `zipWith`.

`requireDataByArity` buffers when `callback.length === 0` - this covers a callback whose first parameter is a rest parameter (a rest parameter after named parameters instead reports the named count), plus bare mocks (`vi.fn()`) and wrappers that forward `arguments`, neither of which can be inspected further, so we buffer defensively - or when `callback.length > dataParameterIndex` (the callback declares enough named parameters to reach it). Three holes are known and left unguarded: a default value on `data` or any parameter before it truncates `Function.length` (`(x, i = 0, data = []) => ...` reports 1, not 3), a callback that reaches `data` through `arguments[i]` instead of a named parameter, and a trailing rest parameter such as `(value, index, ...rest)` (reports 2, not 3) - all three fall through to the non-buffering path. `bind` with partial application reports the remaining arity, so bound callbacks are gated correctly.

A step that doesn't opt in receives `UNEXPECTED_ACCESS_SENTINEL` (`src/internal/unexpectedAccessSentinel.ts`) as `data`: a `Proxy` that throws a short `Remeda: ...` error when used as an array (an index, `length`, any `Array.prototype` key including `Symbol.iterator`, listing its keys) or written to, so a callback that slips through one of the holes above fails at the line that uses it instead of silently seeing an empty array its type says can't exist. Its target is an array, so type checks (`Array.isArray`, `instanceof Array`) see the array its type claims, and array-consuming built-ins (`concat`, `flat`, deep equality) reach the throwing traps instead of treating it as a single object. Reads of any other key return `undefined`, so code that only probes its arguments keeps working. Only `pipe` and `processSingleLazyStep`, which only `pipe` calls, import it, which keeps it out of bundles that don't use `pipe` (e.g. `import { map }`).

`map` is the one place where the user's callback becomes the evaluator itself: when `canReadData(callback)` (the predicate `requireDataByArity` applies) says the callback can't read `data`, `map` hands it to `pipe` as is, saving a call per item. It stays unmarked, since `requireData` only ever receives the wrapper `map` builds for the other case. Such an evaluator receives `slot` as an undeclared 4th argument, and `pipe` calls every evaluator without a receiver, so a `function` callback never sees `pipe`'s internals as `this`.

### Typing the callback's `data` parameter

Inside `pipe`, only evaluators that opted into the `data` buffer are invoked with the items processed so far as their `data` argument; other steps receive `UNEXPECTED_ACCESS_SENTINEL`. The callback type still has to describe that growing prefix, because those are exactly the callbacks `requireDataByArity` identifies as being able to see it. `NonEmptyPrefix<T>` (`src/internal/types/NonEmptyPrefix.ts`) computes that type from the input: the first element is required (the callback never runs on an empty accumulator), every later element is optional, and the tuple shape is preserved as far as TypeScript allows.

Only the data-last overload is lazy. The data-first overload runs the eager implementation and receives the complete input, so it keeps the standard `(value: T[number], index: number, data: T) => R` shape.

How to type a lazy overload:

- Standard `(value, index, data)` callback: `LazyCallback<T, R>` (`src/internal/types/LazyCallback.ts`). For a type predicate use `LazyTypePredicate<T, S>`; TypeScript can't route `value is S` through a generic return type.
- Any other shape (extra parameters like `mapWithFeedback`'s `previousValue`, or `data` nested inside a tuple like `zipWith`): declare a local alias next to the eager one and type the slot as `Readonly<NonEmptyPrefix<T>>`. Never drop the `Readonly`: `pipe` hands the same array to every invocation, so a callback that mutates it changes what later invocations see.
- Only the array flowing through the pipe is a prefix. Arrays passed as arguments (`zipWith`'s `second`) are complete and keep their type.
- If the implementation signature unions the eager and lazy callback types (as `zipWith` does), include the lazy alias in that union; without it the data-last overload fails with `ts2394`, because a callback accepting the full `T` is not assignable to one accepting only its prefix.

Callbacks that never receive `data` (`uniqueWith`'s comparator, `differenceWith`'s `isEquals`) are unaffected.

Known limitations:

- On tuple inputs the prefix isn't assignable to a plain array (`sum(data)` fails on `[1, 2, 3] as const`) because TypeScript adds `undefined` to reads of optional tuple elements. Pinned in the known issues block of `NonEmptyPrefix.test-d.ts`.
- A data-last call used as a callback outside `pipe` (`map(data, map(fn))`) runs eagerly and receives the complete array, yet is typed as a prefix. A single overload can't tell the two callers apart, so the type is pessimistic there by design.

### Why the protocol looks this way

`pipe` mostly sees short arrays on hot paths, so the protocol is shaped by per-call and per-item cost, and by what items and callbacks can observe. The numbers come from the PR #1444 evaluation; `benchmarking.md` has the method and the harness.

- **Bare items.** The common result is the item itself, so the common path allocates nothing. Against a result object per item, lazy pipes allocate 0.06x-0.77x the bytes per call.
- **Controls are registered symbols, compared by identity.** `pipe` classifies a result with one `typeof result === "symbol"` check followed by `===`, and reads nothing from items. Items can be proxies: an `in` probe fired 11,223 `has` traps per call on 100 proxied items, threw on revoked proxies, and gave reactive computations an extra tracked dependency per probed item. The `typeof` guard keeps the four comparisons off the common path; without it, map-heavy pipes ran 1.09x-1.31x slower. Registered symbols (`Symbol.for`) let separate copies of Remeda in one program (two installed versions, or the ESM and CJS builds) interoperate while they share this protocol. Mixing copies on different protocols in one pipe is unsupported; a protocol change takes new keys, which keeps a future shape change from being read as this one.
- **The payload slot belongs to the calling pipe.** `LAST` and `MANY` leave their payload in `slot`, which the running pipe creates once per run and passes as the 4th argument. An evaluator from another copy writes into the slot of the pipe that calls it, so copies interoperate without shared state, a nested pipe has its own slot, and controls allocate nothing. `MANY`'s values are read before the later steps run, because those steps write to the same slot.
- **`data` is arity-gated.** Buffering costs a push per item, so only steps whose callback can declare `data` get the buffer. The others get `UNEXPECTED_ACCESS_SENTINEL`, which throws when used as an array or written to and finds nothing on any other read, so a curried wrapper that probes its arguments for a placeholder keeps working. It lives in its own module because the published build's minifier strips `/* @__PURE__ */`; as a module of its own, it stays out of bundles that don't use `pipe` (`import { map }`: 1125 B minified with it in `requireData`'s module, 360 B after the move, main 350).
- **Lazy runs are built on demand.** `pipe` builds a run's steps when its loop reaches the run with iterable data, so a pipe with no lazy steps builds nothing. Building every step up front put non-lazy pipes into a bimodal deopt, whose slow mode read 1.24x-1.36x main on scalar pipes of arrow functions and 1.10x-1.16x on scalar pipes of data-last utilities ("The deopt lottery" in `benchmarking.md`). A run of one function, the usual shape between non-lazy steps, goes through `processSingleLazyStep`, which has no step objects and no fan-out recursion.
- **Markers go only on closures created for them.** `requireData` writes `requiresData` onto the evaluator it receives. A module-level evaluator (`first`'s, `flat()`'s, `lazyEmptyEvaluator`) is shared by every pipe, so marking one would make all of them buffer, and a property written onto the user's callback travels with it wherever else the user passes it. Markers and the `lazy`/`lazyArgs` props are direct property writes: 0.85x-0.97x of `Object.assign` on data-reading pipes of 0-3 items, and 0.89x on data-last calls.
- **`map` hands over the user's callback.** When `canReadData` says the callback can't read `data`, the callback itself is the evaluator, which saves a call per item (0.9223 on its flow, faster in all 6 runs). Only the wrapper built for the other case is ever marked. `pipe` calls evaluators without a receiver, so a `function` callback never sees a step as `this`, and the slot arrives as an undeclared 4th argument, visible only through the arity holes (`arguments`, or a trailing rest parameter such as `(value, index, ...rest)`).
- **Arrays get their own `for...of`.** `processIterable` and `processSingleLazyStep` iterate arrays at a dedicated `for...of` site, which the compiler specializes without the iterator protocol, and every other iterable at a second, identical one (0.9654 on its flow, faster in all 6 runs). Reactive arrays track a `for...of` as one dependency, where the faster indexed loops (rejected below) track every index read.

Measured and rejected (candidate/baseline; below 1 is faster):

- Object controls marked under a string key and found with an `in` probe: the traps above; the symbol design ran 0.935x of it on Tier 1 and 0.845x on Tier 2.
- Other object encodings: symbol keys in the literal 1.10x on `flatMap` pipes, prototype identity 1.5x-2.9x, null-prototype objects 5x (dictionary mode).
- Identity comparisons without the `typeof` guard: map-heavy pipes 1.09x-1.31x; the guard alone gave 0.931x on Tier 1.
- Building every step up front: in the deopt mode, scalar pipes of arrow functions 1.24x-1.36x main, and of data-last utilities 1.10x-1.16x.
- Building steps only when some function is lazy: fixed that, but `pipe(x)` ran 2.6x and `pipe(x, arrow)` 1.4x, as `pipe` stopped being inlined.
- Building the up-front step array with `for...of` and `push` instead of `functions.map`: 1.020.
- Indexed loops over arrays: 0.939 and 0.910, but reactive arrays track every index read: a probe pipe went from 31 to 60 dependencies (5.63 -> 9.46 us per re-evaluation), and a lone `find` from 23 to 44.
- With object controls, a `=== SKIP_ITEM` shortcut ahead of the probe: lone `map` steps 1.046-1.059; in `pipe`'s loop, faster in 3 of 6 runs only.
- `purry`'s data-first `fn(...args)` by arity instead of a spread: data-last `clamp` at 100 items 1.067 in all 6 runs.
- No dedicated data-last closure at all (one spread closure): 6-12% slower on scalar data-last pipes.
- Building evaluators by arity (0.9949) and `[length - 1]` instead of `.at(-1)` (0.9957): faster in every run, under the 0.99 bar.
- No effect: a hoisted step count (1.000), reordered control checks (0.993-1.008), a positional `dataParameterIndex` (0.999-1.004), index access in `first` (0.996-1.005).
- `/* @__PURE__ */` on the sentinel: the published build is unchanged (see above).

## Handling `null`, `undefined`, and `NaN`

These three "empty-ish" values are not interchangeable in Remeda:

- `undefined` is the canonical "no value" — return it from operations that have no meaningful result.
- `null` is a real value, not a stand-in for absence. Don't coerce between the two.
- `NaN` is a JavaScript accident. Prefer returning `undefined` instead — that lets the result chain through `??` and other coalescing without false negatives.

## Plain objects first

The vast majority of users pass plain objects: arbitrarily deep, but plain. Correctness for that case is enough. When an implementation choice trades off between behavior that is better for plain objects and behavior that supports prototype chains or class instances, always take the plain-object side (e.g., `Object.hasOwn` over `in` for key-existence checks).

## Type System

### Inputs

- Use `IterableContainer` (not `readonly T[]`) for array inputs — it preserves tuple shapes (fixed-length, named-element tuples) through the function instead of widening to a homogeneous array.
- Use `PropertyKey` when you don't care about the specific key type (not `string` or `number`) — matches what TS uses for index signatures.
- Use `unknown` for type slots you don't care about — `Record<string, unknown>` rather than `Record<string, string>` when the value type is irrelevant to the type-level logic.
- Wrap records with bounded keys using `BoundedPartial<T>` — keeps the result partial when keys are a finite union but leaves unbounded records (e.g., `Record<string, V>`) unchanged.
- Use `extends readonly []` to test for empty arrays (not `X["length"] extends 0` — the former works on tuples without widening).

### Outputs and errors

- **Output narrowing** — use `never` to remove a case from the possible return types.
- **Input rejection** — use unsatisfiable constraints (`RemedaTypeError<"message">`) for clear errors at the call site. `RemedaTypeError` uses a branded symbol, not a raw string — raw strings pass through downstream without being caught. When the error has to survive an intersection with a type parameter (e.g., a data-last predicate that rejects its `data` as `T & Error`), pass the real parameter type (e.g., `string`): `never` would collapse the intersection and drop the inference site for `T`, and the symbol base fails assignability before the tag is reached, hiding the message. `startsWith` is the reference.

### Shape preservation

- Preserve input shape in output where possible — `{ [K in keyof T]: S }` maintains tuple structure (length, order, named elements).
- Don't widen — `Array<1 | 2 | 3>` stays narrow, not `Array<number>`.

### Tuple decomposition

When a type needs to handle tuple **regions** differently (required vs. optional vs. rest vs. suffix elements), reach for `TupleParts` (`src/internal/types/TupleParts.ts`) — the canonical decomposition into `{ required, optional, item, suffix }` covering all 10 TS-supported tuple shapes. Reconstruct with `[...required, ...PartialArray<optional>, ...CoercedArray<item>, ...suffix]`. Always consider it before hand-rolling a tuple-shape check.

### Generic hygiene

- Minimize type parameters — don't add a generic for items when the type is inferable from the container.
- Single-use types whose parameters duplicate the function's should be inlined — the alias adds indirection without value.
- Extract complex inline conditional types into named utility types for readability.
- Check `type-fest` before writing a new type utility — it covers a lot already. But type breadth can inflate type-logic overhead (see Type-level performance).
- For boolean logic in conditional types, write explicit nested ternary `extends` checks rather than type-fest's `Or`/`And`/`OrAll`/`AndAll` which are very expensive to instantiate, and collapse conditions to a `boolean`, losing implicit narrowing in the branches.

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
