# Benchmarking Conventions

Benchmarks live next to the function as `functionName.bench.ts` and run with `npm run bench` (vitest bench, the `bench` project).

## The pollution pass

`test/benchPollution.ts` is registered as a `setupFiles` entry of the `bench` project and runs before every benchmark file, in that file's own module graph. It drives `pipe` through every lazy utility, over several element and iterable kinds, with callbacks of every arity, until V8 has compiled the generic versions.

Every comparison depends on it. V8 optimizes `pipe`, the evaluators and the step machinery against the feedback it has collected, and the first benchmark of a file is the only one that runs while that feedback still describes a single callback. The second benchmark discards that code with a "wrong feedback cell" bailout, and the replacement stays generic for the rest of the process. Unpolluted, the first benchmark of a file reads 22% to 25% high, and the plateau the rest settle on is itself 14% above the level reached once the whole lazy surface has been exercised. The error favors some pipe shapes over others, so it can flip the sign of a comparison.

`pollutePipeCallSites` is exported for the case where a benchmark compares a candidate implementation against the shipped one: give the candidate the identical pass, since the setup file only drives the real `pipe`.

What it cannot cover is the benchmark file's own fixture shapes. A file that introduces an object shape the pass never used still triggers one `wrong map` re-optimization on the first benchmark that reads it. It fires during the warmup and did not move the measured window, but reuse one fixture shape across a file rather than giving each benchmark its own.

## Comparing implementations

Compare candidates inside one process, as benchmarks of a single file, and run the file a second time with the declaration order reversed. Ordering effects that survive both orders are real; ones that flip are position, not code.

## Reading the numbers

Read **p75**. Across separate processes it was the most reproducible statistic measured (max CV 3.0% over six runs of `pipe.bench.ts`, against 4.4% for the mean and 4.6% for the median), and it is not distorted by the occasional multi-millisecond sample that mean and min pick up.

Mean and median carry two traps. `min` is unusable: fast benchmarks report `0` because the sample is below timer resolution. Median looks perfectly stable on sub-microsecond benchmarks, but that is `performance.now` quantization, not precision - the same handful of discrete values repeat because the timer cannot resolve anything finer.

Between two separate process runs, treat anything under 5% as noise, and require 8% from a single pair before calling a difference real. Whole runs drift (thermal, frequency), and a single benchmark can take a one-off 20% hit while the rest of its run is the fastest of the batch. Within one process the same benchmark repeated in three separate describes ties to within 1-2% on p75 for most pipelines; allocation-heavy ones such as a fan-out `flatMap` need `time: 2000` to get there.
