# Function Implementation: Runtime

A change that alters what a function accepts or returns, or makes it lazy (its data-last callback's `data` becomes a prefix), changes its overloads too: read `implementation-types.md` as well.

## Dispatch

Functions with a data-first / data-last API pick the calling style at runtime. Their data-first implementation takes exactly the public signature's parameters. Recursion state goes in a separate helper, as `clone`'s `cloneValue` does.

The dispatch takes one of four forms:

- A function as the first data-last argument (`map`, `filter`, `sortedIndexWith`): branch on `typeof dataOrCallbackfn === "function"`, sending a data-last call to a module-level builder right after the dispatch, `const dataLast: DataLastBuilder<typeof mapImplementation> = (callbackfn) => (data) => mapImplementation(data, callbackfn)`. A lazy function returns `withLazyImplementation(dataLast(dataOrCallbackfn), lazyImplementation, dataOrCallbackfn)` (`src/internal/lazyDataLastImplementation.ts`; two arguments go as a tuple). A closure created inside the dispatch allocates a context on every call, data-first included, and a builder shared by several utilities makes its call to the implementation polymorphic.
- Most others pass `arguments.length` and every parameter to `purry1`-`3` (`src/internal/purryByArity.ts`), or `purryWithLazy1`-`3` (`src/internal/purryWithLazyByArity.ts`) with the lazy implementation: at least the arity runs the implementation, fewer builds the data-last function.
- When the argument count can't tell the styles apart (an optional parameter in `flat` and `splice`, a rest parameter in `dropFirstBy` and `conditional`, a third call style in `zipWith`): a check on the first argument's type or shape, with the same builder and `withLazyImplementation`.
- Order-rule functions (`sortBy`, `firstBy`, `nthBy`, `rankBy`, `takeFirstBy`) go through the `purryOrderRules` module; these, like the variadic `prop` and `when`, take the arguments as an array.

A lazy function still gets a plain eager implementation for its data-first call, even when it mirrors the evaluator (`unique`, `difference`): running the evaluator item by item outside `pipe` costs a call and a result classification per item, and bundles the lazy runner into every data-first import. The two must give the same result for every input. `pipe` picks between them per sequence and per input kind, so a mismatch shows up as a pipe whose result changes when an unrelated step is added or removed.

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

Buffering `data` costs an array push per item, so `pipe` does it only for evaluators marked `requiresData: true`, set by one of two helpers from `src/internal/requireData.ts`, which mark the evaluator they receive, so pass them a closure created for the call:

- `requireData(evaluator)`: the evaluator always needs `data`, as `uniqueWith`'s does (comparing each item against every earlier one).
- `requireDataByArity(callback, dataParameterIndex, evaluator)`: the evaluator only forwards `data` to the user's `callback`. `dataParameterIndex` is where `data` sits in the callback's own parameters: 2 for `filter`, `flatMap`, `forEach`, `find`, `uniqueBy`; 3 for `mapWithFeedback`, `zipWith`.

An unmarked evaluator receives `UNEXPECTED_ACCESS_SENTINEL` (`src/internal/unexpectedAccessSentinel.ts`) as `data`, which throws a `Remeda: ...` error when its contents are read or written.

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

## Errors

Error messages include the function name and the user-provided values, so the error locates itself at the call site.

## Naming

Terminology precedence when choosing between equivalent words:

1. **ECMAScript spec** terminology (e.g., "receiver", "iterable", "record")
2. **V8** usage, when the spec is silent or ambiguous
3. **MDN** usage, when V8 doesn't clarify
4. **Mathematics / statistics / scientific** terms (e.g., "median", "clamp", "interpolate")
5. **Equivalent concept in Python, Rust, or other mainstream languages**
6. **Lodash / Ramda** naming, as a last resort for migration convenience

Also:

- Use full disambiguating suffixes: `takeLast`/`dropLast`, not `takeRight`/`dropRight` (Lodash's `Right` is ambiguous outside arrays).
- Callback parameters are named for their role: `predicate` (boolean), `mapper` (transforms), `grouper` (categorizes).
