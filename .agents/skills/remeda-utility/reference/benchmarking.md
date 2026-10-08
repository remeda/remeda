# Benchmarking

Performance work on Remeda runs in an out-of-tree harness (see "The harness") and follows the method below. Both come from the evaluation of PR #1444, the rewrite of `pipe`'s lazy engine.

## When to benchmark

A performance claim needs measurements: a rewrite justified by speed, a choice between candidate algorithms, any change to `purry`, `pipe` or the lazy machinery (every utility runs through them), and anything that adds code to a hot path or to the bundle.

The bar for a performance change in a normal contribution is at least 15% faster on its target, no regression elsewhere (no tier-bar violation in the Priority model below), and code as readable as before. Smaller wins land only through the sign-consistent rule below, inside a deliberate performance effort that already runs the full matrix.

## The Priority model

Every change trades some flows against others, so decisions follow how the library is used:

- **Data-first dominates.** Most code calls one utility at a time and never uses `pipe`: of 2,143 public files importing Remeda, 13.7% import `pipe`.
- **Pipes are short.** Even long pipes are mostly runs of 1-3 lazy steps between non-lazy steps (`sortBy`, `groupBy`, `prop`, inline arrows). Long consecutive lazy runs are rare.
- **Arrays hold dozens to low hundreds of items.** 100 items is the common case; 100k is an edge.
- **Hot paths are common.** A large per-call slowdown on a hot path is a deal breaker, so per-call overhead on tiny inputs counts as much as throughput.
- **Some functions matter far more than others.** Popularity comes from public code search (named and namespace imports, with clone clusters de-duplicated), with download counts of equivalent per-method packages as the fallback for functions too rare in the sample. Twelve functions rank high: `pipe`, `sortBy`, `omit`, `entries`, `mapValues`, `map`, `isDeepEqual`, `unique`, `groupBy`, `pick`, `filter`, `uniqueBy`.

Every scenario gets a tier:

| Tier | Scenarios                                                                                                                                                                                                | Bar                                                                            |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1    | Data-first calls and data-last calls outside `pipe` at 0-100 items; non-lazy pipes; short lazy pipes (1-3 steps) and interleaved pipes at 0-100 items; cold start; bundle size of data-first import sets | Strict: a regression is a median ratio beyond the A/A floor in both run orders |
| 2    | The same shapes at 1k items; lazy runs of 4-7 steps; other iterables (Set, string, generator); reused steps and `piped`; callbacks whose `length` is 0                                                   | Lenient: median >= 1.05, above 1.00 in every run, and beyond the floor         |
| 3    | Lazy runs of 8-15 steps; 100k items and peak heap; exotic item kinds; lower JIT tiers                                                                                                                    | Report only; blocks when every run is >= 1.25                                  |

A scenario whose main utility has mid popularity drops one tier, and low popularity two (never past 3). A call shape a major adopter depends on can be pinned to Tier 1. Within a tier, aggregate with popularity-weighted geomeans (high 4, mid 2, low 1).

Trade-offs are lexicographic, Tier 1 first:

- Any Tier 1 loss beyond the floor rejects a change, whatever it wins elsewhere.
- A Tier 1 win beats a bigger Tier 2 or Tier 3 win.
- Tier 2 decides only between choices that tie on Tier 1 (within twice the A/A geomean deviation), and Tier 3 only between choices that tie on both.

Environments form a separate axis. The newest Node line with its full JIT is the gate. Older Node LTS lines, Bun, and the bundle and CJS loading modes apply the same bars, and a failure there goes to the maintainer as a judgment call.

## Comparing implementations

Measure candidates side by side in one process, each as its own copy of the library:

- **Snapshots.** Take each implementation from a commit (`git archive`), build it, and load it from its own path. Every copy then has its own module instances: its own `pipe`, `purry` and evaluators, each with its own type feedback. A patch under test is one more copy: the baseline plus the patch.
- **Scenario instances.** Import the scenario module once per copy (a `?instance=<id>` query, or a physical copy on runtimes that key modules by path only), so the closures driving each copy collect their own feedback.
- **An A/A copy.** Load the baseline twice. Its ratio against itself is the noise floor of that exact run: per tier, the p95 of |A/A - 1| over the tier's (scenario, run) pairs. The verdict rules applied to A/A give the false-call rate.
- **Cyclic rotations.** With n copies, run rotations 0 to n-1 so every copy runs in every position; rotations 0 and 1 already give both relative orders of two copies. Position can move a whole run: in some PR #1444 runs, every A/A scenario was offset by 3-5% whenever the variant copies ran between the two baseline copies. Floors therefore come from the same processes as the comparison.
- **Native last.** A native baseline (`[...new Set(data)]` next to `unique(data)`) anchors the numbers to something the implementation can't move.
- **One copy per process** as a cross-check on a headline subset, to catch effects that exist only because copies share a process.

Read the p75 and the mean side by side. The p75 resists the occasional multi-millisecond sample and was the most reproducible statistic across processes; the mean takes over where the p75 is under about 1 us and moves in timer steps. A disagreement between the two is a reason to look at the samples.

Scenario hygiene:

- Assign each measured result to a module-level sink object, so the engine keeps the work.
- Build fixtures once, outside the measured function, with enough variation to produce distinct outputs.
- Keep data-first calls and `pipe` usage as separate scenarios: the `pipe` form adds the step machinery on top of the utility.
- Tag every scenario with its tier and its main utility, so the Priority model applies mechanically.

## Noise floors

- **Timer resolution.** On Apple Silicon `performance.now()` ticks every 41.67 ns, so a call of a few hundred nanoseconds moves in steps of several percent, and its median looks perfectly stable. Batch small inputs into one measured call: 256 distinct inputs of 0, 1 or 3 items, 64 inputs of 16 or 100 items, and 64 arrays of 1,000 items for calls too cheap to time singly. Use the mean when the p75 is under 1 us, and ignore `min`, which reads `0` there.
- **GC between tasks.** Run with `--expose-gc` and call `gc()` before every task, so garbage left by the previous task (or by this task's warmup) is collected outside this task's samples. Print a proof line from the hook, so the log shows it ran.
- **The machine.** Measure on AC power, with no user input and nothing else CPU-heavy, under a lock so two measurements never overlap. A quiet machine gives an A/A floor of about 3%.

## The pollution pass

V8 optimizes against the type feedback its call sites have collected. In a fresh benchmark process the shared machinery (`purry`, `pipe`, the evaluators, any utility that invokes a callback) has seen only the first benchmark's callback and data shape. That benchmark runs on specialized code, and the second one replaces it with generic code for the rest of the process. On a single-step `map` pipe, the first benchmark of a file read 22-25% high, and the plateau after it was still 14% above the level reached once every lazy utility had run. Applications hold these sites in the generic state. The error favors some pipe shapes over others, and has flipped the sign of a comparison.

Before anything is measured, the pass drives each copy into the state an application keeps it in:

- every lazy utility through `pipe`, plus data-first calls, data-last calls outside `pipe`, `piped`, and the non-lazy utilities the scenarios use;
- integers, doubles, strings, records and mixed arrays, plus a Set, a string, a generator and a non-iterable input;
- seven object shapes (distinct hidden classes), so property reads go megamorphic;
- callbacks of one, two and three parameters (three turns on the `data` buffer), and non-lazy steps between lazy ones;
- 300 rounds, then `gc()`.

Apply it identically to every copy, in the module graph the benchmarks use. Check it with `--trace-deopt`: once the first benchmark starts, `pipe`, the step machinery and the evaluators should take no call-target or feedback-cell bailout. A fixture shape the pass never used can still cost one "wrong map" re-optimization on the first benchmark that reads it, inside the warmup.

Run three profiles. P2 is the full pass and the default. P1 drives only `map`, `filter`, `find` and `take` over items of 10 hidden classes, so the item-facing sites go megamorphic while everything else stays clean. P0 skips the pass. P0 and P1 run as extras under the same tier bars: in PR #1444 they surfaced Tier 1 regressions that P2 didn't flag.

## Loading mode

How the library is loaded changes the numbers:

- **Built dist** (ESM, loaded natively): the default for verdicts.
- **vitest's transform of `src`**: every cross-module call becomes a getter read on a module namespace, which the published build lacks. It understated the PR #1444 branch and reshuffled per-scenario results, so it serves only for a quick look.
- **Bundle**: one scope-hoisted esbuild bundle of the dist, the way most applications ship.
- **CJS** through `require`, the other published entry point. Its floors run wider.

Run the bundle and CJS modes as extras on a headline subset.

## Validation

Before timing anything, prove that every copy computes the same thing:

- **Output equality.** Every copy's output deep-equals the baseline's and the native one's.
- **Callback-trace equality.** Wrap every callback to record each call (step, call number, arguments up to `data`, values by identity) and diff the traces between copies. A candidate that calls a callback more often, in another order, or with other indices changes behavior even when its outputs match. The wrapper leaves `data` unread (it may be the throwing sentinel) and keeps the callback's `length`, which `pipe` reads.
- **Cross-copy.** Run pipes of one copy over steps built by another (the ESM and CJS builds, the baseline and each variant), to prove they recognize each other's controls.
- **A red self-test** of the trace diff, so a validator that passes everything gets caught.

## Beyond timing

- **Allocations.** Bytes per call: `gc()`, read the heap, run the call N times, read it again, all inside a window that must see no GC (watch `gc` performance entries; halve N and retry when one fires), with a large fixed semi-space so the windows fit. A second process with default heap flags counts GCs and GC time over a steady loop.
- **Peak heap.** At 100k items, run `gc()` before the call, read the heap inside the last call of every callback, and report the highest reading above the post-GC heap, plus what the result retains.
- **Bundle size** per import set (`{ map }`, `{ filter, map }`, `{ pipe }`, the whole library) with esbuild and rolldown: minified, gzip and brotli. Check that module-level side effects stay out of import sets that don't use them. tsdown's minifier strips `/* @__PURE__ */` annotations from the published build, so tree-shaking relies on module boundaries: a module of its own under `sideEffects: false`. Diff the public declaration files too.
- **Cold start.** About 20 fresh processes per copy, rotating which copy starts first: the import time, the first call and the first 50 calls, with no warmup.
- **Lower JIT tiers.** `--jitless` (interpreter only), `--max-opt=1` (baseline compiler ceiling) and `--max-opt=2` (mid-tier ceiling); confirm the flag in `node --v8-options` first. Every scenario of these runs is Tier 3.
- **Other runtimes.** The older Node LTS lines, and Bun for JavaScriptCore through a runner independent of vitest; that runner also runs under Node, as a check on the runner itself.
- **Reactive stores.** Run a pipe inside a reactive computation over a reactive array of observable items (the probes use Vue's `computed` and MobX's `autorun`), and record tracked dependencies, re-evaluation time and heap growth. Vue tracks every indexed read of an array as its own dependency, and a `for...of` as one: an indexed loop took a probe pipe from 31 to 60 dependencies. Any `in` probe or property read on items fires a proxy's traps, so also count `has` and `get` traps per call on pass-through Proxy items.

## Small wins: the sign-consistent rule

A change below the 15% bar lands only inside a performance effort that already runs the matrix, and only when, as its own copy next to the baseline:

- it is faster in all 6 cyclic rotations on its target flow (the per-run geomean of candidate/baseline is below 1);
- its overall geomean on that flow is <= 0.99;
- it causes no tier-bar violation against the reference; it is charged only with what it causes, and a violation it shares with the baseline stays the baseline's;
- the same test, applied to A/A on 2,000 random flows of the same size in both directions, fires under 5% of the time;
- it still holds inside a combination copy with every other survivor.

Screen first (two rotations, short budgets, dropping only clear losers), then confirm the survivors in batches next to the baseline and the A/A copy. A candidate that is faster in every run but misses 0.99 is rejected: a gain under 1% doesn't pay for the change.

## The deopt lottery

In PR #1444's main run, every multi-function non-lazy pipe of the branch read either 1.24-1.36x main or 0.88-0.95x, nothing in between, and all of them switched together. Which copies landed in the slow mode changed with the rotation, independently of their code: a variant that never touched the code path looked about 30% faster than the branch whenever its position put it in the fast mode. The slow mode showed on Node 24 too, and never on Node 22, Bun, the bundle, CJS, the vitest-free runner, `--jitless` or `--max-opt`; one copy per process read 1.045x.

Signs of a lottery:

- a bimodal entry: two tight clusters of ratios across runs, with nothing between them;
- a whole group of scenarios switching mode together;
- the mode following the position across rotations rather than the copy;
- the effect vanishing under other loaders, runtimes or JIT tiers.

Tabulate the mode per (run, position, copy), and confirm it on a minimal repro with `--trace-opt --trace-deopt`. Keep it out of variant verdicts, and treat it as a hazard of the code shape: production processes have a history too. Here the cause was the step array `pipe` built up front for every pipe of two or more functions. Building each lazy run on demand removed the slow mode from every run (0.58-0.60x main).

## The harness

The harness from PR #1444 is preserved at [`perf-harness/` in `<HARNESS_COMMIT>`](https://github.com/remeda/remeda/tree/<HARNESS_COMMIT>/perf-harness). Restore it outside the package (`git archive <HARNESS_COMMIT> perf-harness | tar -x -C <scratch-dir>`) and follow its README, which lists every command and the SHAs it measured. It holds:

- `harness/`: copy loading per source mode, the scenario matrix as data (groups G1-G10, from lazy pipe shapes to interleaved pipes, at 0 to 100k items), fixtures, the pollution profiles, the tiers, and the verdict statistics;
- `bench/` and `scripts/`: the vitest bench project and the vitest-free runner, snapshot preparation and builds, aggregation into per-tier reports, and the allocation, peak-heap, bundle-size, cold-start and reactive-store probes;
- `validate/`: output and callback-trace validation, with the self-test;
- `variants/`: every patch measured, with its target flow, and the screening and confirmation verdicts;
- `research/popularity.json` and `tier-overrides.json`: the popularity table and the tier pins;
- `stages/` and `watch-and-run.sh`: the stage files and the runner that waits for AC power and an idle machine;
- the final aggregates and the PR's performance summary.

The commit carries code and final results; the README rebuilds the snapshots and dependencies.
