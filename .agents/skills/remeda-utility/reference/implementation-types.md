# Function Implementation: Types

## Signatures

A function with a data-first / data-last API has:

- Two overload signatures, data-first **and** data-last, each with its own JSDoc block.
- One implementation signature, without JSDoc, returning `unknown`. Each parameter is named for both styles (`dataOrCallbackfn, callbackfn`) and typed as the union of what the overloads accept there, with type parameters widened to their constraints (`chunk(dataOrSize: IterableContainer | number, size?: number)`), or `unknown` when unconstrained.

## Callbacks

Type callbacks with the aliases in `src/internal/types/Callback.ts`, in the overloads and the implementation signature alike, so neither spells out the parameters (`filter`, `sumBy`, `pickBy`):

- `ArrayCallback<T, R>`: the native array methods' `(value, index, data)`.
- `ObjectCallback<T, R>`: `(value, key, data)` over an object's enumerable string-keyed entries.
- `LazyCallback<T, R>`: `ArrayCallback` for a lazy function's data-last overload (below).
- `ArrayTypePredicate`, `ObjectTypePredicate` and `LazyTypePredicate`: the same callbacks as type predicates.

A callback of another shape (`mapKeys`'s `(key, value, data)`, `mapWithFeedback`'s extra `previousValue`) gets a local alias.

### Lazy callbacks

In a lazily run step, a callback's `data` holds only the items processed so far, so its type describes that growing prefix. `NonEmptyPrefix<T>` (`src/internal/types/NonEmptyPrefix.ts`) computes it: the first element is required (the callback never runs on an empty accumulator), every later one optional, and the tuple shape preserved as far as TypeScript allows.

Only the data-last overload is lazy, so it takes `LazyCallback` or `LazyTypePredicate`; the data-first overload runs eagerly on the complete input and takes `ArrayCallback` or `ArrayTypePredicate`. Beyond that:

- A local alias for a lazy callback (`mapWithFeedback`'s, or `zipWith`'s with `data` nested in a tuple) sits next to the eager one and types the slot as `Readonly<NonEmptyPrefix<T>>`. Keep the `Readonly`: `pipe` hands the same array to every invocation, so a callback mutating it changes what later invocations see.
- Only the array flowing through the pipe is a prefix; arrays passed as arguments (`zipWith`'s `other`) are complete and keep their type.
- If the implementation signature unions the eager and lazy callback types (as `filter`'s and `zipWith`'s do), include the lazy one in the union; otherwise the data-last overload fails with `ts2394`, as a callback accepting the full `T` isn't assignable to one accepting only its prefix.

Callbacks that never receive `data` (`uniqueWith`'s comparator, `differenceWith`'s `isEqual`) are unaffected.

## Inputs

- Use `IterableContainer` for array inputs, not `readonly T[]`: it preserves tuple shapes (fixed length, named elements) instead of widening to a homogeneous array.
- Use `PropertyKey` for keys whose type doesn't matter (not `string` or `number`), matching what TS uses for index signatures.
- Use `unknown` for type slots that don't matter: `Record<string, unknown>`, not `Record<string, string>`, when the value type is irrelevant to the type logic.
- Wrap records with bounded keys in `BoundedPartial<T>`: it keeps the result partial for a finite key union and leaves unbounded records (`Record<string, V>`) unchanged.
- Test for empty arrays with `extends readonly []`, not `X["length"] extends 0`; the former works on tuples without widening.

## Outputs and errors

- **Input rejection**: use unsatisfiable constraints (`RemedaTypeError<"functionName", "message">`) for clear errors at the call site. `RemedaTypeError` uses a branded symbol, since raw strings pass through downstream without being caught. When the error has to survive an intersection with a type parameter (e.g., a data-last predicate that rejects its `data` as `T & Error`), pass the real parameter type as its `type` option (`{ type: string }`): `never` would collapse the intersection and drop the inference site for `T`, and the symbol base fails assignability before the tag is reached, hiding the message. `startsWith` is the reference.

## Shape preservation

- Preserve the input's shape in the output where possible: `{ [K in keyof T]: S }` keeps tuple structure (length, order, named elements).
- Don't widen: `(1 | 2 | 3)[]` stays narrow, not `number[]`.

## Soundness gaps

When an implementation is correct but TypeScript can't prove it (a key it can't tie to `T`, an accumulator typed for the object under construction):

- Suppress the error with `@ts-expect-error` on the line TypeScript flags (`groupByProp`'s `return output`, `omitBy`'s `data[symbol]`).
- When the value is used more than once with the same unproven type, annotate its declaration once and suppress that (`intersection`'s `const result: T & S = value`), instead of suppressing every use.
- Use `as` only where neither fits. A suppression fails the check once TypeScript can follow the code, so it gets removed; a cast stays silent.

## Tuple decomposition

When a type handles tuple **regions** differently (required vs. optional vs. rest vs. suffix elements), use `TupleParts` (`src/internal/types/TupleParts.ts`): the canonical decomposition into `{ required, optional, item, suffix }`, covering all 10 tuple shapes TS supports. Reconstruct with `[...required, ...PartialArray<optional>, ...CoercedArray<item>, ...suffix]`. Consider it before hand-rolling a tuple-shape check.

## Generic hygiene

- Minimize type parameters: no generic for items when the type is inferable from the container.
- Inline single-use types whose parameters duplicate the function's; the alias adds indirection without value.
- Extract complex inline conditional types into named utility types.
- Check `type-fest` before writing a new type utility, but its breadth can inflate type-logic overhead (see Type-level performance).
- For boolean logic in conditional types, write explicit nested ternary `extends` checks instead of type-fest's `Or`/`And`/`OrAll`/`AndAll`, which are very expensive to instantiate and collapse conditions to a `boolean`, losing implicit narrowing in the branches.

## Internal types

- Internal types are not exported: they change frequently and aren't designed as external API.
- Complex type utility files open with a comment describing each exported utility.

## Type-level performance

Combinatorial or recursive types can blow `tsc` up 100x+ in symbols, memory, and check time while passing every test, making consumer editors unusable. Two patterns and a measuring technique:

- **Keep recursion accumulators opaque.** Track the _count_ (a tuple of `unknown`) rather than the elements being built. Sibling branches at the same depth then share the accumulator's type, which TS dedupes; carrying real types makes every path structurally unique and grows the intermediate state space from `O(M * N)` to `O(M * 2^M)`. Stitch the real elements together on unwind via `[Head, ...recurse]`.
- **Grow accumulators on pick instead of pre-building and shrinking.** `Counter["length"] extends N` with a counter grown by `[unknown, ...Counter]` beats pre-building `NTuple<unknown, N>` and destructuring `[unknown, ...infer Rest]` at every step: no upfront build, and a constant-cost length lookup per step. Small (~1-4% of instantiations) but consistent across N and M.
- **Measure with `tsc --extendedDiagnostics`** on a small consumer-style repro importing the _built_ `dist/index.d.ts` (source mode compiles all of remeda, drowning the signal in ~115K symbols of baseline). Rebuild (`npm run build`), warm up once (discard), then run 2-3 timed passes; numbers are stable across runs. Watch `Symbols`, `Types`, `Instantiations`, `Memory used`, `Check time`. `Instantiations` regresses first, before time or memory move.

## Naming

- Avoid names of built-in TS/JS types (`Partial`, `Function`, etc.): they shadow at usage sites.
- Type parameter names are descriptive when the role isn't obvious from position: `Value`, not `InferredRecord`; they say **what**, not **how**.
