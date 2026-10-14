# Larger ideas (not implemented)

Noticed while preparing the A3 variants, out of scope for small patches. Each is a candidate "next step"; none is benchmarked.

## 1. Don't fuse runs that can't stop early

A run like `map + filter + map` has no step that can short-circuit (no `take`, `find`, `first`, `zip`, `intersection`, `take(0)`), so fusion buys nothing but the skipped intermediate arrays, while every item pays the step machinery (`processItem`, step object loads and stores, the control check per step). For the common sizes (dozens to low hundreds of items) the intermediate arrays are cheap, and running each step through its data-first implementation (native `Array.prototype.map` / `filter`) would likely beat the fused loop. Rule: fuse only when the run contains a step whose lazy implementation can stop the pipe (a static flag on the lazy implementation, like `single`). Expected: G1/G2 non-short-circuiting shapes at XS-C approach native chained-array speed; L costs memory. Observable changes: callbacks would run step by step instead of item by item (side-effect order), and a `data`-reading callback would see the whole array instead of the prefix, so this needs a documented semantics decision first.

## 2. Eager data-first paths for `purryFromLazy` utilities

`unique(data)`, `uniqueBy(data, fn)`, `uniqueWith`, `difference(With)`, `intersection(With)` and `mapWithFeedback` run their lazy evaluator item by item through `processSingleLazyStep` even though the whole array is in hand: per call they build the evaluator, slice the arguments, allocate an accumulator, and per item they pay an evaluator call, a control check and a push. A data-first implementation per utility (a tight loop, or `[...new Set(data)]` for `unique`) removes all of that on the most common call style. Expected: 2x or more on G5 data-first `unique` / `difference` / `intersection` at S-M. Cost: two implementations per utility, which is what `purryFromLazy` exists to avoid; a property test comparing the eager and lazy paths (`test-prop`) would keep them in sync.

## 3. A dedicated two-step path in `pipe`

Two-function pipes (`pipe(data, map(f), filter(g))`, `pipe(data, filter(f), first())`) are the most common multi-step shape, and they pay the general path's step array, step objects, recursion-ready `processItem` and per-step field traffic. A path for exactly two fused steps (mirroring `processSingleLazyStep`: locals instead of step objects, the second evaluator called directly) would cut the per-item overhead roughly in half for that shape. Expected: G1/G1b two-step shapes 10% to 30% faster at S-M. Cost: a third processing loop to keep in sync with the other two (and the note in `pipe` that a second processing call in the loop body measured 7% slower on multi-step pipes applies to how it is dispatched).

## 4. Purry dispatch without rest arrays or `fn.length`

Every data-first call allocates the rest-parameter array (`map(...args)`), reads `fn.length` (an accessor, on a site that sees every utility, so megamorphic), and spreads the array back into the call. Utilities could pass their data-first arity as a constant (`purry(impl, args, 2)`), or dispatch on `arguments.length` with declared parameters and no rest array at all. Expected: a few nanoseconds per data-first call, which is a double-digit percentage of G5/G7 at XS (scalar utilities like `add`, `clamp`). Cost: touches the implementation signature of every purried utility; the `purry-arity-calls` variant measures the spread part alone.

## 5. Build-time composition of consecutive evaluators

Instead of a step loop that calls one evaluator per step per item, compose a run's evaluators once at build time into a single closure (e.g. `map` then `filter` becomes one function that calls both callbacks), so the per-item work is one call plus the user callbacks. Controls compose naturally for skip/stop/last; fan-out (`flatMap`, `flat`) would end a composed run. Expected: 10% to 30% per item on multi-step runs at C-L. Cost: a combinator per control kind; the index and `data` bookkeeping per step must be preserved, so composed evaluators need the step state the loop keeps today.

## 6. Reusable fan-out control per evaluator (if `identity-controls` is not adopted)

`flatMap` and `flat` allocate a `many` control object for every item that expands. With the object protocol, an evaluator could own one mutable `many` control and overwrite its `value` per item: `pipe` consumes the value before the evaluator can run again (fan-out only recurses into later steps). Expected: one allocation less per expanded item on G1 `flatMap+filter+map` and `flat+map` shapes. Cost: a mutable control type and a comment-backed invariant about re-entrancy; `identity-controls` gets the same effect structurally.

## 7. Pure annotations don't reach the published dist

`tsdown`'s minified output drops `/* @__PURE__ */` and `/* #__PURE__ */` annotations, also with rolldown's `outputOptions.comments.annotation: true` (checked on this branch's config with rolldown 1.2.4), so annotating module-level side effects in the source helps only consumers who bundle the TypeScript source (JSR). The only packaging that tree-shakes today is a module of its own under `sideEffects: false` (see `sentinel-module`: an esbuild bundle of data-first `map` alone goes from 1150 B to 385 B; rollup without a `sideEffects`-aware resolver keeps it either way). Worth finding a minifier setting that keeps annotations, then auditing the other module-level side effects.

## 8. Reported arity of function-returning utilities

`when(...)` returns a function whose `length` is 0 on purpose, so that `requireDataByArity` always hands it `data`; every lazy step it is used in therefore buffers `data` (the G9 shape), as do `vi.fn()` mocks and memoized wrappers. `when` could return a 1- or 2-parameter function when neither the predicate nor the branches declare more than `(data, index)`, so the common `map(when(isString, toUpperCase))` skips the buffer. Expected: G9 shapes drop the per-item push. Cost: the arity bookkeeping in `when` (and any similar utility) must mirror `requireDataByArity`'s rules exactly.

## 9. Return the first emission of single-result steps directly

`find` and `first` alone in a pipe allocate an accumulator array only to return `accumulator[0]`; the same holds for a run that ends in a single-result step. A loop that returns the first emitted value would save the array (and the `lazy.single` read). Dropped as a small variant because `processSingleLazyStep` would need a second copy of its loop; worth revisiting together with idea 2 or 3, which restructure those loops anyway. Expected: one allocation less per lone `find`/`first` pipe (G1b at XS-S).

## 10. Precompute segmentation in `piped`

`piped(...functions)` re-derives on every call which functions are lazy and where the runs end. Evaluators must stay fresh per run (they hold state), but the run boundaries and the "is the next function lazy" checks could be computed once when `piped` is called. Expected: small, per call, on G6 `piped(...)` shapes at XS-S.
