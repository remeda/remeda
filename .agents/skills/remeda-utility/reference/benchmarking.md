# Benchmarking Conventions

Benchmarks live next to the function as `functionName.bench.ts` and run with `npm run bench` (vitest bench, the `bench` project). Append a name filter to run one file: `npm run bench -- unique`.

## When to benchmark

A benchmark backs a performance claim: a rewrite of an existing implementation, or a choice between two candidate algorithms. The bar for landing a performance change is a 15% improvement with every other benchmark of the function holding level and the code staying as readable as it was.

## Writing a benchmark file

- One `describe` per scenario, with the implementations being compared as the `bench` entries inside it. vitest ranks entries within a `describe`, so the grouping is the comparison.
- Include a native baseline (`[...new Set(data)]` next to `unique(data)`) whenever one exists. It anchors the numbers to something that stays fixed while the implementation changes.
- The bench body performs the measured call and assigns the result to a module-level `sink` object (see `unique.bench.ts`). The escaping write keeps V8 from eliminating the work.
- Build fixtures once at module level, sized so there is real work to measure (`unique.bench.ts` uses 1000 items with 30% duplicates). Scenarios that scale differently (short-circuiting, hash-based vs. quadratic) get a `describe` per input size or hit position.
- Reuse one fixture object shape across the file. Each new hidden class costs the first benchmark that reads it a `wrong map` re-optimization.
- Data-first calls and `pipe` usage are separate scenarios; the `pipe` form adds the step machinery on top of the utility itself, and users call data-first far more often, so each gets its own `describe`.
- Allocation-heavy bodies (a fan-out `flatMap`, anything building large intermediate arrays) need `{ time: 2000 }` for their samples to settle.

## Comparing implementations

Compare candidates inside one process, as benchmarks of a single file, and run the file a second time with the declaration order reversed. Ordering effects that survive both orders are real; ones that flip are position.

## Reading the numbers

Read **p75**. Across separate processes it was the most reproducible statistic measured (max CV 3.0% over six runs of `pipe.bench.ts`, against 4.4% for the mean and 4.6% for the median), and the occasional multi-millisecond sample that skews the mean leaves it alone.

The other columns carry traps. `min` reports `0` on fast benchmarks because the sample is below timer resolution. Median looks perfectly stable on sub-microsecond benchmarks because of `performance.now` quantization: the same handful of discrete values repeat since the timer resolves nothing finer.

Between two separate process runs, treat anything under 5% as noise, and require 8% from a single pair before calling a difference real. Whole runs drift (thermal, frequency), and a single benchmark can take a one-off 20% hit while the rest of its run is the fastest of the batch. Within one process, the same benchmark repeated in three separate describes ties to within 1-2% on p75.

## The pollution pass

V8 optimizes a function against the type feedback its call sites have collected. In a benchmark process, shared library code (`purry`, `pipe`, the lazy evaluators, any utility that invokes a callback) has only ever seen the one callback and the one data shape of the first benchmark, so that benchmark runs on specialized code. The second benchmark invalidates it, and the generic replacement stays for the rest of the process. Applications hold these call sites in the generic state permanently, so the specialized numbers describe a program nobody ships, and because the error lands on whichever benchmark is declared first it can flip the sign of a comparison.

`test/benchPollution.ts` closes that gap. It is a `setupFiles` entry of the `bench` project, so it runs before every benchmark file, inside that file's own module graph, and drives the library with several element kinds, iterable kinds, object shapes and callback arities until the generic versions are compiled. Its header comment records the measurements behind it.

The pass currently drives `pipe` with every lazy utility, plus the data-first form of the `purryFromLazy` utilities (which runs their lazy evaluator too). When a benchmark targets a callback-taking utility outside that set, add the utility to the pass with a few distinct callbacks and data shapes, so that its first benchmark starts from the same generic state as the rest.

`pollutePipeCallSites` is exported for benchmarks that compare a candidate `pipe` implementation against the shipped one: the setup file only drives the shipped `pipe`, so give the candidate the identical pass.
