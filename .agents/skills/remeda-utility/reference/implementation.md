# Function Implementation Conventions

## Dispatch: the dual-API skeleton

Functions with a data-first / data-last API pick the calling style at runtime, in a fixed structure:

- Two overload signatures, data-first **and** data-last, each with its own JSDoc block.
- One implementation signature, without JSDoc, returning `unknown`. Each parameter is named for both styles (`dataOrCallbackfn, callbackfn`) and typed as the union of what the overloads accept there, with type parameters widened to their constraints (`chunk(dataOrSize: IterableContainer | number, size?: number)`), or `unknown` when unconstrained.
- A data-first implementation declaring exactly the function's public parameters, none of them optional, defaulted or rest unless the public one is (`flat`'s `depth`): `purry1`'s data-last function is the implementation itself, so a point-free caller hands it extra arguments (`data.map(reverse())` passes the index and the array). Recursion state goes in a separate helper, as `clone`'s `cloneValue` does.
- For fixed-arity functions, a dispatch passing the arguments to the implementation as parameters, not through an array: the engine inlines only a callback that arrives as a parameter into the implementation's loop, making data-first `map` and `filter` 2-3x faster.

The dispatch takes one of four forms:

- A function as the first data-last argument (`map`, `filter`, `sortedIndexWith`): branch on `typeof dataOrCallbackfn === "function"`, sending a data-last call to a module-level builder right after the dispatch, `const dataLast: DataLastBuilder<typeof mapImplementation> = (callbackfn) => (data) => mapImplementation(data, callbackfn)`. A lazy function returns `withLazyImplementation(dataLast(dataOrCallbackfn), lazyImplementation, dataOrCallbackfn)` (`src/internal/lazyDataLastImplementation.ts`; two arguments go as a tuple). A closure created inside the dispatch allocates a context on every call, data-first included, and a builder shared by several utilities mixes their call feedback.
- Most others pass `arguments.length` and every parameter to `purry1`-`3` (`src/internal/purryByArity.ts`), or `purryWithLazy1`-`3` (`src/internal/purryWithLazyByArity.ts`) with the lazy implementation: at least the arity runs the implementation, fewer builds the data-last function.
- When the argument count can't tell the styles apart (an optional parameter in `flat`, a rest parameter in `dropFirstBy`, a third call style in `zipWith`): a `typeof` check on an argument, with the same builder and `withLazyImplementation`.
- Order-rule functions (`sortBy`, `firstBy`, `nthBy`, `rankBy`, `takeFirstBy`) go through the `purryOrderRules` module, and `splice` and `conditional` through `purryOn`; these, like the variadic `prop` and `when`, take the arguments as an array.

A lazy function still gets a plain eager implementation for its data-first call, even when it mirrors the evaluator (`unique`, `difference`): running the evaluator item by item outside `pipe` costs a call and a result classification per item, and bundles the lazy runner into every data-first import. The two must give the same result for every input, holes aside (a fused sequence reads a hole as `undefined`; the eager implementation does whatever its native method does: `slice` keeps it, `filter` skips it). `pipe` picks between them per sequence and per input kind, so any other mismatch shows up as a pipe whose result changes when an unrelated step is added or removed.

## Lazy evaluation

Every function that can be implemented with the lazy evaluator below supports lazy evaluation, so which functions are lazy stays predictable. Examples to study: `map`, `filter`, `take`, `first`, `flatMap`.

The lazy implementation builds the evaluator from the data-last arguments, received as one value: `undefined` for none, the argument itself for one (`map`'s `callbackfn`, sparing that call an array), a tuple for two (`intersectionWith`'s `[other, isEqual]`).

The evaluator has the shape `(item, index, data, slot) => LazyResult<T>`. Usually it returns the (possibly transformed) item. Anything else it tells `pipe` is a control: a registered symbol (`Symbol.for`) that `pipe` recognizes by identity. The two controls with a payload leave it in `slot` through their helper. From `src/internal/lazyControl.ts`, for any evaluator:

- **Emit one value, keep going**: return the value itself.
- **Skip the current item, keep going**: return `SKIP_ITEM`.
- **Expand into multiple values**: return `manyLazyValues(values, slot)`; each element goes through the rest of the pipe individually before the next item.

From `src/internal/makeStoppable.ts`, only for evaluators that can end the iteration early:

- **Emit one value and stop**: return `lastLazyValue(value, slot)`.
- **Stop without emitting**: return `STOP`; an evaluator that stops on the first item is `LAZY_EMPTY_EVALUATOR`, used as the evaluator itself.

Such evaluators are typed `StoppableLazyEvaluator`, and their lazy implementation is wrapped with `makeStoppable(lazyImplementation)`: `pipe` reads that mark to decide whether to fuse a sequence on an array, and the types reject a `StoppableLazyEvaluator` from an unwrapped implementation.

`slot` belongs to the pipe calling the evaluator, which reads the payload as soon as the evaluator returns. Declare it only in evaluators that call one of the two helpers (`(value, _index, _data, slot) => ...`), and pass it only to them.

For functions that return a single scalar (e.g., `first()`), wrap the lazy implementation with `makeReducing(lazyImplementation)`. `pipe` then ends the lazy sequence at that step and unwraps its output to the first element; stopping the iteration is still the evaluator's job, via `makeStoppable` and `lastLazyValue(value, slot)`.

### Opting into the `data` buffer

Buffering `data` costs an array push per item, so `pipe` does it only for evaluators marked `requiresData: true`, set by one of two helpers from `src/internal/requireData.ts`:

- `requireData(evaluator)`: the evaluator always needs `data`. `uniqueWith`'s reads it itself (comparing each item against every earlier one); `map`'s wrapper forwards it after `map` has run the arity check itself (below).
- `requireDataByArity(callback, dataParameterIndex, evaluator)`: the evaluator only forwards `data` to the user's `callback`. `dataParameterIndex` is where `data` sits in the callback's own parameters: 2 for `filter`, `flatMap`, `forEach`, `find`, `uniqueBy`; 3 for `mapWithFeedback`, `zipWith`.

`requireDataByArity` marks the evaluator when `callback.length === 0` or `callback.length > dataParameterIndex`. Length 0 covers a leading rest parameter, bare mocks (`vi.fn()`) and wrappers that forward `arguments`, which can't be inspected further, so they buffer defensively. Three holes are known and left unguarded, falling through to the non-buffering path: a default value on `data` or an earlier parameter truncates `Function.length` (`(x, i = 0, data = []) => ...` reports 1), a callback reading `data` through `arguments[i]`, and a trailing rest parameter (`(value, index, ...rest)` reports 2). `bind` with partial application reports the remaining arity, so bound callbacks are gated correctly.

An unmarked evaluator receives `UNEXPECTED_ACCESS_SENTINEL` (`src/internal/unexpectedAccessSentinel.ts`) as `data`: a `Proxy` that throws a short `Remeda: ...` error when used as an array (an index, `length`, any `Array.prototype` key including `Symbol.iterator`, listing its keys) or written to, so a callback slipping through a hole fails where it uses `data` instead of silently seeing an empty array its type says can't exist. Its target is an array, so `Array.isArray`, `instanceof Array` and array-consuming built-ins (`concat`, `flat`, deep equality) treat it as one and reach the throwing traps. Reads of any other key return `undefined`, so code that only probes its arguments keeps working. Only `fusedSequence.ts` and `iterableDataFirst.ts`, which only `pipe` imports, import it, keeping it out of bundles without `pipe`.

`map` is the one place where the user's callback becomes the evaluator itself: when `canReadData(callback, 2)` says it can't read `data`, `map` hands it to `pipe` unwrapped and unmarked, saving a call per item. It then also receives `slot` as a 4th argument, visible only through the holes above.

### Typing the callback's `data` parameter

In a lazily run step, a callback that `requireDataByArity` lets see `data` receives the items processed so far, so its type describes that growing prefix. `NonEmptyPrefix<T>` (`src/internal/types/NonEmptyPrefix.ts`) computes it: the first element is required (the callback never runs on an empty accumulator), every later one optional, and the tuple shape preserved as far as TypeScript allows.

Only the data-last overload is lazy. The data-first overload runs eagerly on the complete input and keeps the standard `(value: T[number], index: number, data: T) => R` shape. For the lazy overload:

- Standard `(value, index, data)` callback: `LazyCallback<T, R>` (`src/internal/types/Callback.ts`); for a type predicate, `LazyTypePredicate<T, S>`, since TypeScript can't route `value is S` through a generic return type.
- Any other shape (an extra parameter like `mapWithFeedback`'s `previousValue`, or `data` nested in a tuple like `zipWith`'s): declare a local alias next to the eager one, typing the slot as `Readonly<NonEmptyPrefix<T>>`. Keep the `Readonly`: `pipe` hands the same array to every invocation, so a callback mutating it changes what later invocations see.
- Only the array flowing through the pipe is a prefix; arrays passed as arguments (`zipWith`'s `other`) are complete and keep their type.
- If the implementation signature unions the eager and lazy callback types (as `zipWith`'s does), include the lazy alias in the union; otherwise the data-last overload fails with `ts2394`, as a callback accepting the full `T` isn't assignable to one accepting only its prefix.

Callbacks that never receive `data` (`uniqueWith`'s comparator, `differenceWith`'s `isEqual`) are unaffected.

Known limitations:

- On tuple inputs the prefix isn't assignable to a plain array (`sum(data)` fails on `[1, 2, 3] as const`), because TypeScript adds `undefined` to reads of optional tuple elements. Pinned in `NonEmptyPrefix.test-d.ts`'s known issues block.
- A data-last call that runs eagerly still types `data` as a prefix: as a callback outside `pipe` (`map(data, map(fn))`), or in a `pipe` on an array with no step that can end the iteration early. The callback's type can't see how the step will run, so it's pessimistic by design.

### Why the protocol looks this way

`pipe` mostly runs short arrays on hot paths, so the protocol minimizes per-call and per-item cost, and what items and callbacks can observe. Each choice below was benchmarked against its alternatives; changing one takes new benchmarks.

- **Bare items**: the common result is the item itself, so the common path allocates nothing.
- **Controls are registered symbols compared by identity**, behind a single `typeof result === "symbol"` check that keeps the comparisons off the common path. `pipe` reads nothing from items, which can be proxies: probing them fires traps, throws on revoked proxies, and adds a tracked dependency per item in reactive frameworks. `Symbol.for` lets separate copies of Remeda in one program (two installed versions, or the ESM and CJS builds) interoperate while they share this protocol.
- **The payload slot belongs to the calling pipe**: `runFusedSequence` (or `iterableDataFirst`) creates it once per sequence and passes it as the 4th argument, so copies interoperate without shared state, a nested pipe has its own slot, and controls allocate nothing. `MANY`'s values are read before later steps run, because those steps write to the same slot.
- **Lazy sequences are built when `pipe`'s loop reaches them**, so a pipe without lazy steps builds nothing; building every step up front deoptimizes non-lazy pipes.
- **Markers go only on closures created for them.** `requireData` writes `requiresData` onto the evaluator it receives: a module-level evaluator (`first`'s, `flat()`'s, `LAZY_EMPTY_EVALUATOR`) is shared by every pipe, so marking it would make all of them buffer, and a property written onto the user's callback travels wherever else they pass it. Markers and the `lazy`/`lazyArgument` props are direct property writes, which cost less per call than `Object.assign`. The `makeStoppable` and `makeReducing` marks go on the module-level lazy implementation once, at module load, costing nothing per call.
- **Arrays get their own `for...of`**: `runFusedSequence` (`internal/fusedSequence.ts`) iterates arrays at a dedicated `for...of` site, which the engine specializes without the iterator protocol, and other iterables at a second, identical one. Reactive arrays track a `for...of` as one dependency, where an indexed loop tracks every index read. `iterableDataFirst` never sees arrays, so it has one loop.

## Handling `null`, `undefined`, and `NaN`

- `undefined` is the canonical "no value": return it from operations without a meaningful result.
- `null` is a real value, not a stand-in for absence. Don't coerce between the two.
- `NaN` is a JavaScript accident. Return `undefined` instead, so the result chains through `??` and other coalescing without false negatives.

## Plain objects first

Most users pass plain objects, arbitrarily deep, and correctness for them is enough. When a choice trades better plain-object behavior against support for prototype chains or class instances, take the plain-object side (e.g., `Object.hasOwn` over `in` for key-existence checks).

## Storing computed keys

A function that builds an object from caller-supplied keys (the input's keys, keys listed in an argument, keys a callback returns, values turned into keys) can receive `"__proto__"`. Assigning that key on an object created with `{}` runs the setter inherited from `Object.prototype` and creates no own property: an object or `null` value replaces the result's prototype, and any other value is dropped.

A function that only writes to the object defines that key directly, inlining this block (`mapValues`, `indexBy`):

```ts
if (key === "__proto__") {
  // We want `__proto__` to act just like any other key, but assigning it
  // runs the setter inherited from `Object.prototype` instead of creating
  // a property. Defining it directly creates the same own data property
  // that assigning creates for all *other* keys.
  Object.defineProperty(out, "__proto__", {
    value,
    configurable: true,
    enumerable: true,
    writable: true,
  });
} else {
  out[key] = value;
}
```

A function that reads a key before writing it (`countBy`, `groupBy`, `groupByProp`) starts from `Object.create(null)` and restores the prototype with `Object.setPrototypeOf(out, Object.prototype)` once built. Without a prototype there's no setter, and reads see only the keys the function added, so `__proto__` and `toString` start out `undefined` like any other key.

## Loops and copies

These shapes measured faster than their usual alternatives:

- **Arrays**: iterate with `for...of`, unless another loop measured fastest for that utility (`data.forEach` in `groupBy`, `partition`). When the body needs the index, count it in a `let index = 0` incremented once per iteration (`sumBy`, `meanBy`, `takeWhile`), which beats destructuring `data.entries()`, most of all at startup and in the interpreter. When a closure created in the body captures the index, bind a fresh `index` per iteration with a callback method (`uniqueWith`'s `filter`, whose nested `findIndex` callback reads it) or `data.entries()`.
- **Object entries**: `for (const entry of Object.entries(data))` with positional `entry[0]` and `entry[1]` (`mapValues`, `pickBy`, `evolve`). Destructuring a pair runs the array iterator per entry, which shows at startup and in the interpreter; `@typescript-eslint/prefer-destructuring` allows positional reads for this reason (`array: false`).
- **Copies**: `data.concat()`, whether the copy is then mutated (`reverse`, `sort`, `splice`, `swapIndices`) or returned as is (`takeFirstBy`, `dropFirstBy`). It's the fastest copy, and reactive arrays read it in one step.

Reactive arrays track reads differently: Vue (3.5+) tracks `for...of`, `concat()` and the callback methods as one dependency, but indexed reads, `slice`, `flat` and `flatMap` per index; MobX tracks one dependency however it's read, but `for...of` and indexed loops pass its proxy once per item.

## Type System

### Inputs

- Use `IterableContainer` for array inputs, not `readonly T[]`: it preserves tuple shapes (fixed length, named elements) instead of widening to a homogeneous array.
- Use `PropertyKey` for keys whose type doesn't matter (not `string` or `number`), matching what TS uses for index signatures.
- Use `unknown` for type slots that don't matter: `Record<string, unknown>`, not `Record<string, string>`, when the value type is irrelevant to the type logic.
- Wrap records with bounded keys in `BoundedPartial<T>`: it keeps the result partial for a finite key union and leaves unbounded records (`Record<string, V>`) unchanged.
- Test for empty arrays with `extends readonly []`, not `X["length"] extends 0`; the former works on tuples without widening.

### Outputs and errors

- **Input rejection**: use unsatisfiable constraints (`RemedaTypeError<"functionName", "message">`) for clear errors at the call site. `RemedaTypeError` uses a branded symbol, since raw strings pass through downstream without being caught. When the error has to survive an intersection with a type parameter (e.g., a data-last predicate that rejects its `data` as `T & Error`), pass the real parameter type as its `type` option (`{ type: string }`): `never` would collapse the intersection and drop the inference site for `T`, and the symbol base fails assignability before the tag is reached, hiding the message. `startsWith` is the reference.

### Shape preservation

- Preserve the input's shape in the output where possible: `{ [K in keyof T]: S }` keeps tuple structure (length, order, named elements).
- Don't widen: `Array<1 | 2 | 3>` stays narrow, not `Array<number>`.

### Tuple decomposition

When a type handles tuple **regions** differently (required vs. optional vs. rest vs. suffix elements), use `TupleParts` (`src/internal/types/TupleParts.ts`): the canonical decomposition into `{ required, optional, item, suffix }`, covering all 10 tuple shapes TS supports. Reconstruct with `[...required, ...PartialArray<optional>, ...CoercedArray<item>, ...suffix]`. Consider it before hand-rolling a tuple-shape check.

### Generic hygiene

- Minimize type parameters: no generic for items when the type is inferable from the container.
- Inline single-use types whose parameters duplicate the function's; the alias adds indirection without value.
- Extract complex inline conditional types into named utility types.
- Check `type-fest` before writing a new type utility, but its breadth can inflate type-logic overhead (see Type-level performance).
- For boolean logic in conditional types, write explicit nested ternary `extends` checks instead of type-fest's `Or`/`And`/`OrAll`/`AndAll`, which are very expensive to instantiate and collapse conditions to a `boolean`, losing implicit narrowing in the branches.

### Internal types

- Internal types are not exported: they change frequently and aren't designed as external API.
- Complex type utility files open with a comment describing each exported utility.

### Type-level performance

Combinatorial or recursive types can blow `tsc` up 100x+ in symbols, memory, and check time while passing every test, making consumer editors unusable. Two patterns and a measuring technique:

- **Keep recursion accumulators opaque.** Track the _count_ (a tuple of `unknown`) rather than the elements being built. Sibling branches at the same depth then share the accumulator's type, which TS dedupes; carrying real types makes every path structurally unique and grows the intermediate state space from `O(M * N)` to `O(M * 2^M)`. Stitch the real elements together on unwind via `[Head, ...recurse]`.
- **Grow accumulators on pick instead of pre-building and shrinking.** `Counter["length"] extends N` with a counter grown by `[unknown, ...Counter]` beats pre-building `NTuple<unknown, N>` and destructuring `[unknown, ...infer Rest]` at every step: no upfront build, and a constant-cost length lookup per step. Small (~1-4% of instantiations) but consistent across N and M.
- **Measure with `tsc --extendedDiagnostics`** on a small consumer-style repro importing the _built_ `dist/index.d.ts` (source mode compiles all of remeda, drowning the signal in ~115K symbols of baseline). Rebuild (`npm run build`), warm up once (discard), then run 2-3 timed passes; numbers are stable across runs. Watch `Symbols`, `Types`, `Instantiations`, `Memory used`, `Check time`. `Instantiations` regresses first, before time or memory move.

## File Layout

- Exported items first, then non-exported ("private") ones, as readers scan top to bottom.
- Constants go above the logic that uses them.

## Naming

Terminology precedence when choosing between equivalent words:

1. **ECMAScript spec** terminology (e.g., "receiver", "iterable", "record")
2. **V8** usage, when the spec is silent or ambiguous
3. **MDN** usage, when V8 doesn't clarify
4. **Mathematics / statistics / scientific** terms (e.g., "median", "clamp", "interpolate")
5. **Equivalent concept in Python, Rust, or other mainstream languages**
6. **Lodash / Ramda** naming, as a last resort for migration convenience

Also:

- Avoid names of built-in TS/JS types (`Partial`, `Function`, etc.): they shadow at usage sites.
- Use full disambiguating suffixes: `takeLast`/`dropLast`, not `takeRight`/`dropRight` (Lodash's `Right` is ambiguous outside arrays).
- Callback parameters are named for their role: `predicate` (boolean), `mapper` (transforms), `grouper` (categorizes).
- Type parameter names are descriptive when the role isn't obvious from position: `Value`, not `InferredRecord`; they say **what**, not **how**.

## Code Quality

- Error messages include the function name and the user-provided values, so the error locates itself at the call site.
