## Performance

**Verdict.** On Node 26 this branch is faster than main, or within noise of it, in all 526 benchmark scenarios. Weighted by how often each function is used, common usage (tier 1) takes 0.680 of main's time, larger pipes (tier 2) 0.596 and the rest (tier 3) 0.501, and no scenario breaks its tier's bar. Node 22 and 24, Bun, a scope-hoisted bundle and CJS show the same picture. Two things cost more. Bundles grow: data-first imports by 22-78 B gzipped, imports that include `pipe` by about 610-710 B. And a fresh process spends about 0.45 ms more importing the library, and up to 8 us more on the first call of a pipe.

### Changes you may notice

- Callbacks of lazy functions receive `data` only when they declare it as a parameter. Collecting `data` costs an array push per item per step, so the lazy code only does it for callbacks that can read it. This applies inside `pipe`, and to direct calls of `uniqueBy` and `mapWithFeedback`, which run the same lazy code. Using the undeclared argument as an array throws an error that says which parameter to declare.
- `purry` no longer supports lazy implementations: it doesn't look for a `lazy` prop on the data-first implementation, and doesn't take a lazy implementation as a third argument. Lazy evaluation now runs on an internal protocol that we don't export. Functions built with `purry` run eagerly inside `pipe`.

### What most users will notice

Ratios are branch time / main time: lower is faster. Each row is the weighted geomean of its scenarios (each the median of 6 runs on Node 26); "Range" spans those scenario medians. Rows group scenarios by shape, so they also hold rarely used functions, which weigh less and are judged by a lower tier's rules. Tier 1 as a whole: 0.680 over 153 scenarios (104 faster, 49 neutral, 0 slower).

| Area                                                             | Scenarios | Branch / main | Range                     | Faster / neutral / slower |
| ---------------------------------------------------------------- | --------- | ------------- | ------------------------- | ------------------------- |
| Data-first calls, 16-100 items                                   | 114       | 0.885         | 0.388-1.029               | 32 / 82 / 0               |
| Data-first in hot loops, 0-3 items                               | 51        | 0.859         | 0.458-1.021               | 17 / 34 / 0               |
| Non-lazy pipes                                                   | 20        | 0.760         | 0.397-1.001               | 16 / 4 / 0                |
| Short lazy pipes, 0-100 items                                    | 151       | 0.469         | 0.273-0.882               | 151 / 0 / 0               |
| Interleaved pipes, 0-100 items                                   | 16        | 0.582         | 0.400-0.780               | 16 / 0 / 0                |
| Bundle size of data-first imports, gzip (3 imports x 2 bundlers) | 6         | 1.152         | 1.088-1.266               | larger in all 6           |
| Cold start: first call / first 50 calls                          | 5 probes  | 0.896 / 0.761 | 0.603-1.128 / 0.520-1.014 | 7 / 2 / 1                 |

### Larger pipes (tier 2)

Tier 2 as a whole: 0.596 over 173 scenarios (114 faster, 59 neutral, 0 slower).

| Area                                     | Scenarios | Branch / main | Range       | Faster / neutral / slower |
| ---------------------------------------- | --------- | ------------- | ----------- | ------------------------- |
| Lazy and interleaved pipes, 1,000 items  | 60        | 0.469         | 0.276-0.981 | 58 / 2 / 0                |
| Data-first calls, 1,000 items            | 32        | 0.784         | 0.393-1.025 | 15 / 17 / 0               |
| Other iterables (Set, string, generator) | 12        | 0.511         | 0.377-0.682 | 12 / 0 / 0                |
| Reused steps and `piped`                 | 12        | 0.540         | 0.458-0.756 | 12 / 0 / 0                |
| Callbacks that declare no parameters     | 16        | 0.540         | 0.405-0.772 | 16 / 0 / 0                |

### The rest (tier 3)

Tier 3 as a whole: 0.501 over 200 scenarios (169 faster, 31 neutral, 0 slower). The lower JIT tiers rerun the tier 1 scenarios with V8's optimizing compilers capped. Their three slower verdicts are data-last `entries` calls at 0-16 items, 1.05-1.06 of main; tier 3 only reports these.

| Area                                      | Scenarios | Branch / main  | Range       | Faster / neutral / slower    |
| ----------------------------------------- | --------- | -------------- | ----------- | ---------------------------- |
| Long consecutive lazy runs (8-15 steps)   | 9         | 0.359          | 0.325-0.428 | 9 / 0 / 0                    |
| 100,000 items                             | 19        | 0.422          | 0.297-0.690 | 19 / 0 / 0                   |
| Peak memory at 100,000 items              | 15        | 0.506 (median) | 0.007-1.009 | at or below main in 15 of 15 |
| Exotic item kinds                         | 14        | 0.503          | 0.423-0.645 | 14 / 0 / 0                   |
| Interpreter only (`--jitless`)            | 153       | 0.676          | 0.257-1.052 | 95 / 57 / 1                  |
| Baseline compiler ceiling (`--max-opt=1`) | 153       | 0.654          | 0.220-1.063 | 98 / 53 / 2                  |
| Mid-tier compiler ceiling (`--max-opt=2`) | 153       | 0.655          | 0.275-1.039 | 102 / 51 / 0                 |

### Other runtimes and loaders

Four runs each, two in each order, with their own noise floors. Node and Bun ran the 153 tier 1 scenarios, the bundle and CJS runs the 23 headline ones.

| Environment              | Scenarios | Branch / main | Range       | Faster / neutral / slower |
| ------------------------ | --------- | ------------- | ----------- | ------------------------- |
| Node 22 (V8 12.4)        | 153       | 0.703         | 0.338-1.022 | 103 / 50 / 0              |
| Node 24 (V8 13.6)        | 153       | 0.693         | 0.329-1.025 | 103 / 50 / 0              |
| Bun 1.4 (JavaScriptCore) | 153       | 0.587         | 0.202-1.035 | 117 / 36 / 0              |
| One scope-hoisted bundle | 23        | 0.604         | 0.337-1.003 | 16 / 7 / 0                |
| CJS through `require`    | 23        | 0.596         | 0.307-1.034 | 14 / 9 / 0                |

<details><summary>More environments</summary>

| Environment                           | Scenarios | Branch / main | Range       | Faster / neutral / slower |
| ------------------------------------- | --------- | ------------- | ----------- | ------------------------- |
| No warm-up pollution                  | 48        | 0.538         | 0.298-0.843 | 48 / 0 / 0                |
| Narrow warm-up pollution              | 48        | 0.553         | 0.365-0.843 | 48 / 0 / 0                |
| Node 26, second benchmark runner      | 153       | 0.684         | 0.334-1.045 | 105 / 48 / 0              |
| Node 26, one library copy per process | 23        | 0.604         | 0.335-1.014 | 16 / 7 / 0                |

The two warm-up rows rerun G1, G2 and G10 at 100 and 1,000 items with a different warm-up: none, or only `map`, `filter`, `find` and `take` over 10 item shapes.

</details>

### Details per area

<details><summary>How to read the tables</summary>

Sizes: XS = 0, 1 or 3 items (256 calls per measurement), S = 16, C = 100, M = 1,000, Mx64 = 1,000 items x 64 inputs, L = 100,000; x64 and x1 are scalar pipes over 64 inputs and over one. Groups: G1 lazy pipe shapes, G1b every lazy function in `pipe` alone and with a `map`, G2 deep pipes, G3 non-lazy pipes, G4 other iterables, G5 data-first lazy functions, G6 data-last outside `pipe` and reuse, G7 non-lazy functions (the 12 most used, plus 6 more at S), G8 item kinds, G9 callbacks that declare no parameters, G10 interleaved pipes. "Mean" is the ratio of means (`*`: the scenario is judged on it, because a p75 under 1 us is too coarse). Branch / native compares with the same work in plain JS (2 runs; above 1 is slower than native).

</details>

<details><summary>Tier 1: Data-first calls, 16-100 items (114 scenarios)</summary>

Data-first calls (G5, G7) and data-last calls outside `pipe` (G6, G7) at S (16 items) and C (100 items).

| Scenario                                        | Size | Branch / main p75 | Mean   | Branch / native | Verdict |
| ----------------------------------------------- | ---- | ----------------- | ------ | --------------- | ------- |
| G5 data-first difference                        | S    | 0.457             | 0.457  | -               | faster  |
| G5 data-first difference                        | C    | 0.444             | 0.446  | -               | faster  |
| G5 data-first difference(range) (adopter shape) | S    | 0.691             | 0.688  | 1.53            | faster  |
| G5 data-first difference(range) (adopter shape) | C    | 0.635             | 0.635  | 1.41            | faster  |
| G5 data-first differenceWith                    | S    | 0.508             | 0.510  | 6.22            | faster  |
| G5 data-first differenceWith                    | C    | 0.690             | 0.692  | 4.39            | faster  |
| G5 data-first drop                              | S    | 1.000             | 0.999  | 1.65            | neutral |
| G5 data-first drop                              | C    | 1.000             | 1.007  | 1.38            | neutral |
| G5 data-first filter                            | S    | 1.006             | 1.001  | 3.42            | neutral |
| G5 data-first filter                            | C    | 0.996             | 0.995  | 3.54            | neutral |
| G5 data-first find                              | S    | 0.841             | 0.845  | 4.38            | faster  |
| G5 data-first find                              | C    | 0.961             | 0.961  | 3.55            | neutral |
| G5 data-first first                             | S    | 0.620             | 0.609* | 2.45            | faster  |
| G5 data-first first                             | C    | 0.629             | 0.617* | 2.45            | faster  |
| G5 data-first flat                              | S    | 1.006             | 1.007  | 1.04            | neutral |
| G5 data-first flat                              | C    | 1.003             | 1.001  | 1.00            | neutral |
| G5 data-first flatMap                           | S    | 1.001             | 1.002  | 1.01            | neutral |
| G5 data-first flatMap                           | C    | 0.995             | 0.995  | 1.00            | neutral |
| G5 data-first forEach                           | S    | 0.955             | 0.985  | 4.47            | neutral |
| G5 data-first forEach                           | C    | 0.999             | 0.991  | 4.50            | neutral |
| G5 data-first intersection                      | S    | 0.557             | 0.557  | -               | faster  |
| G5 data-first intersection                      | C    | 0.521             | 0.520  | -               | faster  |
| G5 data-first intersectionWith                  | S    | 0.572             | 0.571  | 7.25            | faster  |
| G5 data-first intersectionWith                  | C    | 0.739             | 0.742  | 9.62            | faster  |
| G5 data-first map                               | S    | 0.994             | 0.996  | 2.73            | neutral |
| G5 data-first map                               | C    | 0.980             | 0.989  | 2.45            | neutral |
| G5 data-first mapWithFeedback                   | S    | 0.431             | 0.429  | 6.52            | faster  |
| G5 data-first mapWithFeedback                   | C    | 0.388             | 0.389  | 6.46            | faster  |
| G5 data-first mapWithFeedback (reads data)      | S    | 0.459             | 0.459  | 7.09            | faster  |
| G5 data-first mapWithFeedback (reads data)      | C    | 0.430             | 0.432  | 7.80            | faster  |
| G5 data-first take                              | S    | 1.000             | 1.003  | 1.70            | neutral |
| G5 data-first take                              | C    | 1.000             | 1.009  | 1.52            | neutral |
| G5 data-first unique                            | S    | 0.518             | 0.517  | 1.84            | faster  |
| G5 data-first unique                            | C    | 0.563             | 0.560  | 1.86            | faster  |
| G5 data-first uniqueBy                          | S    | 0.589             | 0.590  | -               | faster  |
| G5 data-first uniqueBy                          | C    | 0.616             | 0.614  | -               | faster  |
| G5 data-first uniqueBy (reads data)             | S    | 0.584             | 0.589  | -               | faster  |
| G5 data-first uniqueBy (reads data)             | C    | 0.636             | 0.641  | -               | faster  |
| G5 data-first uniqueWith                        | S    | 0.680             | 0.680  | 2.67            | faster  |
| G5 data-first uniqueWith                        | C    | 0.906             | 0.900  | 2.45            | faster  |
| G5 data-first zip                               | S    | 1.000             | 1.001  | 2.68            | neutral |
| G5 data-first zip                               | C    | 0.998             | 1.000  | 2.68            | neutral |
| G5 data-first zipWith                           | S    | 1.000             | 0.999  | 5.53            | neutral |
| G5 data-first zipWith                           | C    | 1.002             | 1.001  | 6.15            | neutral |
| G6 filter(fn)(data)                             | S    | 0.831             | 0.833  | 3.54            | faster  |
| G6 filter(fn)(data)                             | C    | 0.946             | 0.945  | 3.48            | faster  |
| G6 map(fn)(data)                                | S    | 0.855             | 0.853  | 2.90            | faster  |
| G6 map(fn)(data)                                | C    | 0.934             | 0.938  | 1.00            | faster  |
| G6 unique()(data)                               | S    | 0.516             | 0.514  | 1.91            | faster  |
| G6 unique()(data)                               | C    | 0.566             | 0.563  | 1.72            | faster  |
| G7 add data-first                               | S    | 1.000             | 1.005* | 3.14            | neutral |
| G7 add data-last                                | S    | 0.926             | 0.941  | 3.57            | faster  |
| G7 chunk data-first                             | S    | 1.000             | 1.008  | 0.27            | neutral |
| G7 chunk data-first                             | C    | 1.003             | 1.005  | 0.33            | neutral |
| G7 chunk data-last                              | S    | 0.975             | 0.973  | 0.28            | neutral |
| G7 chunk data-last                              | C    | 0.993             | 0.995  | 0.35            | neutral |
| G7 clamp data-first                             | S    | 1.021             | 1.002  | 3.57            | neutral |
| G7 clamp data-first                             | C    | 1.001             | 1.008  | 3.57            | neutral |
| G7 clamp data-last                              | S    | 0.965             | 0.959  | 4.00            | neutral |
| G7 clamp data-last                              | C    | 0.965             | 0.963  | 4.00            | neutral |
| G7 clone data-first                             | S    | 1.004             | 1.002  | 16.22           | neutral |
| G7 clone data-first                             | C    | 1.005             | 1.002  | 9.06            | neutral |
| G7 clone data-last                              | S    | 1.000             | 1.000  | 16.15           | neutral |
| G7 clone data-last                              | C    | 0.999             | 0.999  | 9.68            | neutral |
| G7 entries data-first                           | S    | 1.004             | 1.001  | 1.09            | neutral |
| G7 entries data-first                           | C    | 1.000             | 1.001  | 1.01            | neutral |
| G7 entries data-last                            | S    | 1.000             | 0.999  | 1.13            | neutral |
| G7 entries data-last                            | C    | 0.998             | 0.997  | 1.07            | neutral |
| G7 groupBy data-first                           | S    | 1.006             | 1.003  | 1.79            | neutral |
| G7 groupBy data-first                           | C    | 0.998             | 0.999  | 1.49            | neutral |
| G7 groupBy data-last                            | S    | 0.993             | 0.990  | 1.81            | neutral |
| G7 groupBy data-last                            | C    | 0.992             | 0.993  | 1.50            | neutral |
| G7 isDeepEqual data-first                       | S    | 1.002             | 1.001  | 1.54            | neutral |
| G7 isDeepEqual data-first                       | C    | 0.981             | 0.985  | 1.35            | neutral |
| G7 isDeepEqual data-last                        | S    | 0.995             | 0.997  | 1.54            | neutral |
| G7 isDeepEqual data-last                        | C    | 0.956             | 0.973  | 1.29            | neutral |
| G7 keys data-first                              | S    | 1.029             | 1.010  | 1.52            | neutral |
| G7 keys data-first                              | C    | 1.011             | 1.008  | 1.14            | neutral |
| G7 keys data-last                               | S    | 0.975             | 0.978  | 1.65            | neutral |
| G7 keys data-last                               | C    | 1.000             | 1.007  | 1.25            | neutral |
| G7 mapToObj data-first                          | S    | 0.996             | 0.997  | 0.33            | neutral |
| G7 mapToObj data-first                          | C    | 1.000             | 0.999  | 0.35            | neutral |
| G7 mapToObj data-last                           | S    | 0.987             | 0.985  | 0.43            | neutral |
| G7 mapToObj data-last                           | C    | 1.006             | 1.004  | 0.51            | neutral |
| G7 mapValues data-first                         | S    | 0.999             | 0.999  | 0.39            | neutral |
| G7 mapValues data-first                         | C    | 1.015             | 1.033  | 0.63            | neutral |
| G7 mapValues data-last                          | S    | 0.982             | 0.984  | 0.45            | neutral |
| G7 mapValues data-last                          | C    | 0.982             | 0.991  | 0.90            | neutral |
| G7 merge data-first                             | S    | 1.007             | 1.004  | 5.46            | neutral |
| G7 merge data-last                              | S    | 0.982             | 0.984  | 5.60            | neutral |
| G7 mergeDeep data-first                         | S    | 1.004             | 1.002  | 1.16            | neutral |
| G7 mergeDeep data-first                         | C    | 1.003             | 0.997  | 1.15            | neutral |
| G7 mergeDeep data-last                          | S    | 0.995             | 0.995  | 1.15            | neutral |
| G7 mergeDeep data-last                          | C    | 0.989             | 0.993  | 0.97            | neutral |
| G7 omit data-first                              | S    | 0.998             | 0.999  | 0.70            | neutral |
| G7 omit data-first                              | C    | 0.993             | 1.000  | 0.72            | neutral |
| G7 omit data-last                               | S    | 0.997             | 0.998  | 0.81            | neutral |
| G7 omit data-last                               | C    | 1.005             | 1.004  | 0.83            | neutral |
| G7 pick data-first                              | S    | 0.996             | 0.999  | 0.57            | neutral |
| G7 pick data-first                              | C    | 1.015             | 1.009  | 0.43            | neutral |
| G7 pick data-last                               | S    | 0.993             | 0.989  | 0.59            | neutral |
| G7 pick data-last                               | C    | 0.980             | 0.980  | 0.43            | neutral |
| G7 range data-first                             | S    | 0.998             | 0.996  | 1.05            | neutral |
| G7 range data-first                             | C    | 0.996             | 0.996  | 1.02            | neutral |
| G7 range data-last                              | S    | 0.995             | 0.993  | 1.06            | neutral |
| G7 range data-last                              | C    | 0.993             | 0.992  | 1.05            | neutral |
| G7 set data-first                               | S    | 1.003             | 1.004  | 6.94            | neutral |
| G7 set data-last                                | S    | 0.958             | 0.960  | 6.62            | neutral |
| G7 sortBy data-first                            | S    | 0.999             | 0.998  | 2.62            | neutral |
| G7 sortBy data-last                             | S    | 0.994             | 0.996  | 2.47            | neutral |
| G7 sumBy data-first                             | S    | 1.002             | 0.999  | 11.56           | neutral |
| G7 sumBy data-last                              | S    | 0.991             | 0.991  | 12.28           | neutral |
| G7 toLowerCase data-first                       | S    | 1.000             | 0.997  | 1.78            | neutral |
| G7 toLowerCase data-last                        | S    | 0.971             | 0.968  | 1.89            | neutral |

</details>

<details><summary>Tier 1: Data-first in hot loops, 0-3 items (51 scenarios)</summary>

The same calls at XS: 256 calls per measurement on inputs of 0, 1 or 3 items, so per-call overhead dominates.

| Scenario                                        | Size | Branch / main p75 | Mean  | Branch / native | Verdict |
| ----------------------------------------------- | ---- | ----------------- | ----- | --------------- | ------- |
| G5 data-first difference                        | XS   | 0.565             | 0.565 | -               | faster  |
| G5 data-first difference(range) (adopter shape) | XS   | 0.718             | 0.718 | 1.29            | faster  |
| G5 data-first differenceWith                    | XS   | 0.525             | 0.525 | 5.86            | faster  |
| G5 data-first drop                              | XS   | 1.006             | 1.001 | 1.86            | neutral |
| G5 data-first filter                            | XS   | 1.006             | 1.004 | 2.90            | neutral |
| G5 data-first find                              | XS   | 0.691             | 0.690 | 3.82            | faster  |
| G5 data-first first                             | XS   | 0.609             | 0.612 | 2.85            | faster  |
| G5 data-first flat                              | XS   | 1.000             | 1.000 | 1.01            | neutral |
| G5 data-first flatMap                           | XS   | 0.996             | 0.995 | 1.13            | neutral |
| G5 data-first forEach                           | XS   | 0.993             | 0.993 | 3.83            | neutral |
| G5 data-first intersection                      | XS   | 0.592             | 0.591 | -               | faster  |
| G5 data-first intersectionWith                  | XS   | 0.514             | 0.515 | 4.20            | faster  |
| G5 data-first map                               | XS   | 1.000             | 1.005 | 2.89            | neutral |
| G5 data-first mapWithFeedback                   | XS   | 0.563             | 0.561 | 5.51            | faster  |
| G5 data-first mapWithFeedback (reads data)      | XS   | 0.612             | 0.616 | 6.02            | faster  |
| G5 data-first take                              | XS   | 1.000             | 0.999 | 1.83            | neutral |
| G5 data-first unique                            | XS   | 0.514             | 0.513 | 1.65            | faster  |
| G5 data-first uniqueBy                          | XS   | 0.633             | 0.636 | -               | faster  |
| G5 data-first uniqueBy (reads data)             | XS   | 0.652             | 0.655 | -               | faster  |
| G5 data-first uniqueWith                        | XS   | 0.524             | 0.528 | 3.42            | faster  |
| G5 data-first zip                               | XS   | 0.998             | 1.000 | 2.66            | neutral |
| G5 data-first zipWith                           | XS   | 0.997             | 0.997 | 3.12            | neutral |
| G6 filter(fn)(data)                             | XS   | 0.688             | 0.687 | 3.32            | faster  |
| G6 map(fn)(data)                                | XS   | 0.683             | 0.683 | 4.21            | faster  |
| G6 unique()(data)                               | XS   | 0.458             | 0.455 | 1.64            | faster  |
| G7 chunk data-first                             | XS   | 0.996             | 0.994 | 0.20            | neutral |
| G7 chunk data-last                              | XS   | 0.958             | 0.956 | 0.22            | neutral |
| G7 clamp data-first                             | XS   | 1.000             | 1.002 | 3.73            | neutral |
| G7 clamp data-last                              | XS   | 0.953             | 0.955 | 4.23            | neutral |
| G7 clone data-first                             | XS   | 0.990             | 0.989 | 8.95            | neutral |
| G7 clone data-last                              | XS   | 0.997             | 0.998 | 9.19            | neutral |
| G7 entries data-first                           | XS   | 0.997             | 0.999 | 1.53            | neutral |
| G7 entries data-last                            | XS   | 0.995             | 0.993 | 1.82            | neutral |
| G7 groupBy data-first                           | XS   | 1.021             | 1.020 | 3.22            | neutral |
| G7 groupBy data-last                            | XS   | 0.982             | 0.984 | 3.34            | neutral |
| G7 isDeepEqual data-first                       | XS   | 1.007             | 1.006 | 1.73            | neutral |
| G7 isDeepEqual data-last                        | XS   | 0.987             | 0.987 | 1.78            | neutral |
| G7 keys data-first                              | XS   | 1.007             | 1.009 | 1.80            | neutral |
| G7 keys data-last                               | XS   | 0.983             | 0.981 | 2.17            | neutral |
| G7 mapToObj data-first                          | XS   | 1.010             | 1.010 | 0.59            | neutral |
| G7 mapToObj data-last                           | XS   | 0.958             | 0.960 | 0.70            | neutral |
| G7 mapValues data-first                         | XS   | 1.003             | 1.002 | 0.64            | neutral |
| G7 mapValues data-last                          | XS   | 0.953             | 0.953 | 0.70            | faster  |
| G7 mergeDeep data-first                         | XS   | 1.006             | 1.004 | 1.44            | neutral |
| G7 mergeDeep data-last                          | XS   | 0.988             | 0.989 | 1.45            | neutral |
| G7 omit data-first                              | XS   | 0.997             | 0.995 | 1.56            | neutral |
| G7 omit data-last                               | XS   | 0.986             | 0.985 | 1.34            | neutral |
| G7 pick data-first                              | XS   | 1.001             | 1.000 | 0.57            | neutral |
| G7 pick data-last                               | XS   | 0.975             | 0.973 | 0.58            | neutral |
| G7 range data-first                             | XS   | 1.002             | 1.002 | 0.94            | neutral |
| G7 range data-last                              | XS   | 0.983             | 0.982 | 0.97            | neutral |

</details>

<details><summary>Tier 1: Non-lazy pipes (20 scenarios)</summary>

G3: pipes with no lazy step, on scalars (x64: 64 inputs per measurement, x1: one) and on an array (XS-M; the M entry is tier 2).

| Scenario                      | Size | Branch / main p75 | Mean   | Branch / native | Verdict |
| ----------------------------- | ---- | ----------------- | ------ | --------------- | ------- |
| G3 array sortBy+groupBy       | XS   | 0.900             | 0.901  | 2.77            | faster  |
| G3 array sortBy+groupBy       | S    | 0.972             | 0.971  | 2.21            | neutral |
| G3 array sortBy+groupBy       | C    | 1.001             | 1.000  | 2.63            | neutral |
| G3 array sortBy+groupBy       | M    | 0.994             | 0.995  | 3.07            | neutral |
| G3 object pick+omit+set+merge | x64  | 0.900             | 0.896  | 38.92           | faster  |
| G3 object pick+omit+set+merge | x1   | 0.891             | 0.908* | 7.95            | faster  |
| G3 pipe(x, add(1))            | x64  | 0.653             | 0.656  | 4.28            | faster  |
| G3 pipe(x, add(1))            | x1   | 1.000             | 0.765* | 1.00            | faster  |
| G3 pipe(x, arrow)             | x64  | 0.522             | 0.512* | 1.71            | faster  |
| G3 pipe(x, arrow)             | x1   | 1.000             | 0.753* | 1.00            | faster  |
| G3 pipe(x)                    | x64  | 0.428             | 0.397* | 2.98            | faster  |
| G3 pipe(x)                    | x1   | 1.000             | 0.940* | 1.00            | neutral |
| G3 scalar arrows depth-10     | x64  | 0.736             | 0.720  | 13.77           | faster  |
| G3 scalar arrows depth-10     | x1   | 0.672             | 0.743* | 2.00            | faster  |
| G3 scalar arrows depth-3      | x64  | 0.596             | 0.588  | 4.00            | faster  |
| G3 scalar arrows depth-3      | x1   | 1.000             | 0.758* | 1.00            | faster  |
| G3 scalar purry depth-10      | x64  | 0.781             | 0.781  | 40.10           | faster  |
| G3 scalar purry depth-10      | x1   | 0.832             | 0.780* | 4.95            | faster  |
| G3 scalar purry depth-3       | x64  | 0.704             | 0.706  | 11.56           | faster  |
| G3 scalar purry depth-3       | x1   | 0.988             | 0.767* | 1.98            | faster  |

</details>

<details><summary>Tier 1: Short lazy pipes, 0-100 items (151 scenarios)</summary>

G1, G1b: pipes of 1-3 lazy steps (every lazy function alone and with a `map`) at XS, S and C.

| Scenario                      | Size | Branch / main p75 | Mean  | Branch / native | Verdict |
| ----------------------------- | ---- | ----------------- | ----- | --------------- | ------- |
| G1 3-step middle reads data   | XS   | 0.689             | 0.690 | 8.12            | faster  |
| G1 3-step middle reads data   | S    | 0.540             | 0.539 | 9.33            | faster  |
| G1 3-step middle reads data   | C    | 0.480             | 0.483 | 8.48            | faster  |
| G1 drop+take                  | XS   | 0.490             | 0.494 | 5.93            | faster  |
| G1 drop+take                  | S    | 0.449             | 0.447 | 15.98           | faster  |
| G1 drop+take                  | C    | 0.405             | 0.405 | 54.79           | faster  |
| G1 filter+first               | XS   | 0.569             | 0.571 | 16.09           | faster  |
| G1 filter+first               | S    | 0.574             | 0.573 | 19.88           | faster  |
| G1 filter+first               | C    | 0.559             | 0.555 | 16.51           | faster  |
| G1 filter+map                 | XS   | 0.641             | 0.640 | 7.06            | faster  |
| G1 filter+map                 | S    | 0.477             | 0.477 | 7.50            | faster  |
| G1 filter+map                 | C    | 0.410             | 0.411 | 6.84            | faster  |
| G1 filter+map+take(10)        | C    | 0.469             | 0.468 | 1.76            | faster  |
| G1 find early hit             | C    | 0.438             | 0.442 | 11.39           | faster  |
| G1 find late hit              | C    | 0.448             | 0.448 | 10.66           | faster  |
| G1 find miss                  | C    | 0.439             | 0.440 | 10.97           | faster  |
| G1 flat+map                   | XS   | 0.471             | 0.471 | 1.53            | faster  |
| G1 flat+map                   | S    | 0.334             | 0.331 | 1.61            | faster  |
| G1 flat+map                   | C    | 0.287             | 0.288 | 1.49            | faster  |
| G1 flatMap+filter+map         | XS   | 0.511             | 0.510 | 2.22            | faster  |
| G1 flatMap+filter+map         | S    | 0.366             | 0.366 | 2.27            | faster  |
| G1 flatMap+filter+map         | C    | 0.331             | 0.335 | 2.16            | faster  |
| G1 map                        | XS   | 0.442             | 0.440 | 6.80            | faster  |
| G1 map                        | S    | 0.353             | 0.350 | 4.93            | faster  |
| G1 map                        | C    | 0.332             | 0.330 | 1.99            | faster  |
| G1 map reading data           | XS   | 0.525             | 0.526 | 7.70            | faster  |
| G1 map reading data           | S    | 0.434             | 0.431 | 8.67            | faster  |
| G1 map reading data           | C    | 0.417             | 0.425 | 9.17            | faster  |
| G1 map+filter+map             | XS   | 0.577             | 0.578 | 7.54            | faster  |
| G1 map+filter+map             | S    | 0.403             | 0.402 | 7.66            | faster  |
| G1 map+filter+map             | C    | 0.347             | 0.348 | 6.08            | faster  |
| G1 map+unique                 | XS   | 0.601             | 0.603 | 2.83            | faster  |
| G1 map+unique                 | S    | 0.534             | 0.537 | 2.48            | faster  |
| G1 map+unique                 | C    | 0.548             | 0.548 | 2.25            | faster  |
| G1 uniqueBy                   | XS   | 0.546             | 0.545 | 2.17            | faster  |
| G1 uniqueBy                   | S    | 0.558             | 0.557 | 1.79            | faster  |
| G1 uniqueBy                   | C    | 0.617             | 0.616 | 1.89            | faster  |
| G1b pipe difference           | XS   | 0.486             | 0.478 | -               | faster  |
| G1b pipe difference           | S    | 0.439             | 0.437 | -               | faster  |
| G1b pipe difference           | C    | 0.446             | 0.446 | -               | faster  |
| G1b pipe difference+map       | XS   | 0.633             | 0.629 | -               | faster  |
| G1b pipe difference+map       | S    | 0.443             | 0.450 | -               | faster  |
| G1b pipe difference+map       | C    | 0.426             | 0.429 | -               | faster  |
| G1b pipe differenceWith       | XS   | 0.441             | 0.440 | 5.37            | faster  |
| G1b pipe differenceWith       | S    | 0.494             | 0.495 | 6.25            | faster  |
| G1b pipe differenceWith       | C    | 0.677             | 0.682 | 4.21            | faster  |
| G1b pipe differenceWith+map   | XS   | 0.611             | 0.611 | 7.38            | faster  |
| G1b pipe differenceWith+map   | S    | 0.501             | 0.503 | 7.08            | faster  |
| G1b pipe differenceWith+map   | C    | 0.642             | 0.640 | 7.75            | faster  |
| G1b pipe drop                 | XS   | 0.393             | 0.390 | 3.67            | faster  |
| G1b pipe drop                 | S    | 0.351             | 0.349 | 10.81           | faster  |
| G1b pipe drop                 | C    | 0.335             | 0.334 | 31.70           | faster  |
| G1b pipe drop+map             | XS   | 0.527             | 0.526 | 5.71            | faster  |
| G1b pipe drop+map             | S    | 0.414             | 0.414 | 8.76            | faster  |
| G1b pipe drop+map             | C    | 0.366             | 0.370 | 9.86            | faster  |
| G1b pipe filter               | XS   | 0.482             | 0.480 | 5.44            | faster  |
| G1b pipe filter               | S    | 0.424             | 0.423 | 7.67            | faster  |
| G1b pipe filter               | C    | 0.376             | 0.375 | 6.92            | faster  |
| G1b pipe filter+map           | XS   | 0.640             | 0.639 | 7.18            | faster  |
| G1b pipe filter+map           | S    | 0.471             | 0.471 | 7.99            | faster  |
| G1b pipe filter+map           | C    | 0.403             | 0.404 | 7.06            | faster  |
| G1b pipe find                 | XS   | 0.425             | 0.422 | 10.24           | faster  |
| G1b pipe find                 | S    | 0.465             | 0.463 | 13.81           | faster  |
| G1b pipe find                 | C    | 0.446             | 0.445 | 9.87            | faster  |
| G1b pipe find+map             | XS   | 0.585             | 0.583 | 10.79           | faster  |
| G1b pipe find+map             | S    | 0.496             | 0.494 | 7.05            | faster  |
| G1b pipe find+map             | C    | 0.427             | 0.429 | 4.68            | faster  |
| G1b pipe first                | XS   | 0.319             | 0.317 | 7.57            | faster  |
| G1b pipe first                | S    | 0.323             | 0.324 | 7.55            | faster  |
| G1b pipe first                | C    | 0.327             | 0.329 | 7.31            | faster  |
| G1b pipe first+map            | XS   | 0.525             | 0.526 | 9.82            | faster  |
| G1b pipe first+map            | S    | 0.500             | 0.499 | 3.03            | faster  |
| G1b pipe first+map            | C    | 0.500             | 0.499 | 0.56            | faster  |
| G1b pipe flat                 | XS   | 0.393             | 0.391 | 0.91            | faster  |
| G1b pipe flat                 | S    | 0.430             | 0.427 | 1.43            | faster  |
| G1b pipe flat                 | C    | 0.437             | 0.438 | 1.58            | faster  |
| G1b pipe flat+map             | XS   | 0.464             | 0.465 | 1.54            | faster  |
| G1b pipe flat+map             | S    | 0.317             | 0.316 | 1.60            | faster  |
| G1b pipe flat+map             | C    | 0.273             | 0.275 | 1.54            | faster  |
| G1b pipe flatMap              | XS   | 0.505             | 0.504 | 1.23            | faster  |
| G1b pipe flatMap              | S    | 0.468             | 0.468 | 1.51            | faster  |
| G1b pipe flatMap              | C    | 0.467             | 0.466 | 1.55            | faster  |
| G1b pipe flatMap+map          | XS   | 0.482             | 0.482 | 1.70            | faster  |
| G1b pipe flatMap+map          | S    | 0.314             | 0.315 | 1.56            | faster  |
| G1b pipe flatMap+map          | C    | 0.289             | 0.294 | 1.51            | faster  |
| G1b pipe forEach              | XS   | 0.465             | 0.462 | 11.12           | faster  |
| G1b pipe forEach              | S    | 0.409             | 0.407 | 13.40           | faster  |
| G1b pipe forEach              | C    | 0.387             | 0.387 | 11.86           | faster  |
| G1b pipe forEach+map          | XS   | 0.602             | 0.601 | 11.05           | faster  |
| G1b pipe forEach+map          | S    | 0.446             | 0.444 | 9.38            | faster  |
| G1b pipe forEach+map          | C    | 0.389             | 0.392 | 7.89            | faster  |
| G1b pipe intersection         | XS   | 0.525             | 0.523 | -               | faster  |
| G1b pipe intersection         | S    | 0.527             | 0.525 | -               | faster  |
| G1b pipe intersection         | C    | 0.523             | 0.524 | -               | faster  |
| G1b pipe intersection+map     | XS   | 0.606             | 0.606 | -               | faster  |
| G1b pipe intersection+map     | S    | 0.588             | 0.589 | -               | faster  |
| G1b pipe intersection+map     | C    | 0.565             | 0.568 | -               | faster  |
| G1b pipe intersectionWith     | XS   | 0.435             | 0.433 | 3.94            | faster  |
| G1b pipe intersectionWith     | S    | 0.545             | 0.549 | 7.09            | faster  |
| G1b pipe intersectionWith     | C    | 0.729             | 0.733 | 9.30            | faster  |
| G1b pipe intersectionWith+map | XS   | 0.575             | 0.574 | 6.27            | faster  |
| G1b pipe intersectionWith+map | S    | 0.622             | 0.618 | 8.35            | faster  |
| G1b pipe intersectionWith+map | C    | 0.769             | 0.762 | 9.66            | faster  |
| G1b pipe map                  | XS   | 0.450             | 0.447 | 5.65            | faster  |
| G1b pipe map                  | S    | 0.357             | 0.355 | 4.95            | faster  |
| G1b pipe map                  | C    | 0.334             | 0.332 | 4.63            | faster  |
| G1b pipe map+map              | XS   | 0.579             | 0.579 | 7.23            | faster  |
| G1b pipe map+map              | S    | 0.399             | 0.398 | 5.12            | faster  |
| G1b pipe map+map              | C    | 0.346             | 0.350 | 4.66            | faster  |
| G1b pipe mapWithFeedback      | XS   | 0.481             | 0.481 | 5.40            | faster  |
| G1b pipe mapWithFeedback      | S    | 0.412             | 0.409 | 6.46            | faster  |
| G1b pipe mapWithFeedback      | C    | 0.387             | 0.389 | 6.18            | faster  |
| G1b pipe mapWithFeedback+map  | XS   | 0.600             | 0.601 | 7.17            | faster  |
| G1b pipe mapWithFeedback+map  | S    | 0.434             | 0.434 | 7.31            | faster  |
| G1b pipe mapWithFeedback+map  | C    | 0.390             | 0.390 | 7.44            | faster  |
| G1b pipe take                 | XS   | 0.374             | 0.371 | 3.05            | faster  |
| G1b pipe take                 | S    | 0.359             | 0.356 | 7.12            | faster  |
| G1b pipe take                 | C    | 0.343             | 0.343 | 24.46           | faster  |
| G1b pipe take+map             | XS   | 0.547             | 0.550 | 5.80            | faster  |
| G1b pipe take+map             | S    | 0.439             | 0.436 | 7.84            | faster  |
| G1b pipe take+map             | C    | 0.365             | 0.367 | 9.19            | faster  |
| G1b pipe unique               | XS   | 0.453             | 0.451 | 1.67            | faster  |
| G1b pipe unique               | S    | 0.502             | 0.500 | 1.88            | faster  |
| G1b pipe unique               | C    | 0.561             | 0.562 | 1.78            | faster  |
| G1b pipe unique+map           | XS   | 0.590             | 0.589 | 3.01            | faster  |
| G1b pipe unique+map           | S    | 0.531             | 0.534 | 2.50            | faster  |
| G1b pipe unique+map           | C    | 0.563             | 0.562 | 2.22            | faster  |
| G1b pipe uniqueBy             | XS   | 0.547             | 0.546 | -               | faster  |
| G1b pipe uniqueBy             | S    | 0.567             | 0.565 | -               | faster  |
| G1b pipe uniqueBy             | C    | 0.616             | 0.615 | -               | faster  |
| G1b pipe uniqueBy+map         | XS   | 0.658             | 0.656 | -               | faster  |
| G1b pipe uniqueBy+map         | S    | 0.572             | 0.573 | -               | faster  |
| G1b pipe uniqueBy+map         | C    | 0.586             | 0.587 | -               | faster  |
| G1b pipe uniqueWith           | XS   | 0.461             | 0.463 | 3.43            | faster  |
| G1b pipe uniqueWith           | S    | 0.661             | 0.660 | 2.73            | faster  |
| G1b pipe uniqueWith           | C    | 0.881             | 0.882 | 2.23            | faster  |
| G1b pipe uniqueWith+map       | XS   | 0.608             | 0.608 | 5.30            | faster  |
| G1b pipe uniqueWith+map       | S    | 0.649             | 0.650 | 3.22            | faster  |
| G1b pipe uniqueWith+map       | C    | 0.882             | 0.880 | 2.55            | faster  |
| G1b pipe zip                  | XS   | 0.399             | 0.397 | 3.99            | faster  |
| G1b pipe zip                  | S    | 0.377             | 0.376 | 4.31            | faster  |
| G1b pipe zip                  | C    | 0.366             | 0.366 | 4.64            | faster  |
| G1b pipe zip+map              | XS   | 0.553             | 0.556 | 6.25            | faster  |
| G1b pipe zip+map              | S    | 0.420             | 0.419 | 5.16            | faster  |
| G1b pipe zip+map              | C    | 0.378             | 0.378 | 4.89            | faster  |
| G1b pipe zipWith              | XS   | 0.463             | 0.461 | 2.46            | faster  |
| G1b pipe zipWith              | S    | 0.433             | 0.432 | 5.06            | faster  |
| G1b pipe zipWith              | C    | 0.413             | 0.418 | 7.13            | faster  |
| G1b pipe zipWith+map          | XS   | 0.579             | 0.580 | 2.66            | faster  |
| G1b pipe zipWith+map          | S    | 0.446             | 0.446 | 2.62            | faster  |
| G1b pipe zipWith+map          | C    | 0.411             | 0.413 | 2.87            | faster  |

</details>

<details><summary>Tier 1: Interleaved pipes, 0-100 items (16 scenarios)</summary>

G10 and G2 deep-8 mixed: runs of 1-3 lazy steps between non-lazy steps (`sortBy`, `groupBy`, `prop`, `entries`, arrows), XS-C.

| Scenario                                                                                    | Size | Branch / main p75 | Mean  | Branch / native | Verdict |
| ------------------------------------------------------------------------------------------- | ---- | ----------------- | ----- | --------------- | ------- |
| G2 deep-8 mixed                                                                             | S    | 0.517             | 0.521 | 4.84            | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | XS   | 0.638             | 0.646 | 6.90            | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | S    | 0.598             | 0.597 | 4.91            | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | 0.677             | 0.680 | 3.78            | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | XS   | 0.679             | 0.681 | 4.32            | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | S    | 0.585             | 0.592 | 3.50            | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | 0.530             | 0.534 | 4.21            | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | XS   | 0.780             | 0.785 | 4.89            | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | S    | 0.771             | 0.771 | 5.06            | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | 0.734             | 0.735 | 8.77            | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | XS   | 0.598             | 0.602 | 2.77            | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | S    | 0.516             | 0.520 | 2.10            | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | 0.495             | 0.498 | 1.71            | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | XS   | 0.556             | 0.559 | 6.65            | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | S    | 0.409             | 0.410 | 7.66            | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | 0.400             | 0.402 | 2.72            | faster  |

</details>

<details><summary>Tier 1: Bundle size (bytes)</summary>

Minified ESM bundles of each import set with two bundlers (A, B), `sideEffects: false` honored; gzip level 9, brotli quality 11.

| Import                               | Bundler | Main min / gzip / brotli | Branch min / gzip / brotli | Gzip ratio |
| ------------------------------------ | ------- | ------------------------ | -------------------------- | ---------- |
| `import { map }`                     | A       | 350 / 249 / 209          | 448 / 271 / 224            | 1.088      |
| `import { map }`                     | B       | 351 / 247 / 211          | 443 / 271 / 231            | 1.097      |
| `import { filter, map }`             | A       | 500 / 289 / 241          | 634 / 365 / 317            | 1.263      |
| `import { filter, map }`             | B       | 505 / 293 / 253          | 631 / 371 / 326            | 1.266      |
| `import { pipe }`                    | A       | 921 / 520 / 473          | 2475 / 1137 / 1029         | 2.187      |
| `import { pipe }`                    | B       | 922 / 517 / 466          | 2472 / 1124 / 1017         | 2.174      |
| `import { pipe, map, filter, take }` | A       | 1577 / 783 / 714         | 3258 / 1478 / 1341         | 1.888      |
| `import { pipe, map, filter, take }` | B       | 1584 / 770 / 698         | 3265 / 1476 / 1339         | 1.917      |
| `import { unique }`                  | A       | 1248 / 671 / 609         | 1376 / 746 / 649           | 1.112      |
| `import { unique }`                  | B       | 1249 / 661 / 602         | 1373 / 729 / 641           | 1.103      |
| `whole library`                      | A       | 28146 / 9118 / 8221      | 29570 / 9829 / 8853        | 1.078      |
| `whole library`                      | B       | 28166 / 9088 / 8189      | 29598 / 9780 / 8759        | 1.076      |

The error helper behind the `data` change is included with `pipe` and with the functions that run the lazy code directly (`unique` here; also `uniqueBy`, `uniqueWith`, `difference`, `differenceWith`, `intersection`, `intersectionWith`, `mapWithFeedback`), and not with `{ map }` or `{ filter, map }`.

</details>

<details><summary>Tier 1: Cold start</summary>

Fresh processes (40 per library copy and probe) import the library and run one probe 50 times with no warm-up. Medians; counts use a +-5% band (main against itself stays within 4.5%).

| Probe                   | Import ms, main / branch | First call us, main / branch | Ratio | First 50 calls us, main / branch | Ratio |
| ----------------------- | ------------------------ | ---------------------------- | ----- | -------------------------------- | ----- |
| data-first map S        | 14.19 / 14.64            | 41.5 / 35.7                  | 0.860 | 70.9 / 63.2                      | 0.891 |
| data-first unique S     | 14.28 / 14.68            | 147.6 / 88.9                 | 0.603 | 395.4 / 205.6                    | 0.520 |
| pipe filter+map S       | 14.25 / 14.70            | 167.0 / 175.1                | 1.049 | 460.5 / 356.5                    | 0.774 |
| arrow pipe depth-3      | 14.21 / 14.70            | 59.1 / 66.7                  | 1.128 | 88.2 / 89.5                      | 1.014 |
| pipe map reading data S | 14.19 / 14.77            | 149.1 / 140.5                | 0.942 | 377.6 / 265.6                    | 0.703 |

</details>

<details><summary>Tier 2: Lazy and interleaved pipes, 1,000 items (60 scenarios)</summary>

G1, G1b, G10 and the two G2 mixed pipes at M (1,000 items).

| Scenario                                                                                    | Size | Branch / main p75 | Mean   | Branch / native | Verdict |
| ------------------------------------------------------------------------------------------- | ---- | ----------------- | ------ | --------------- | ------- |
| G1 3-step middle reads data                                                                 | M    | 0.479             | 0.478  | 6.19            | faster  |
| G1 drop+take                                                                                | M    | 0.386             | 0.382  | 131.20          | faster  |
| G1 filter+first                                                                             | M    | 0.540             | 0.533* | 16.87           | faster  |
| G1 filter+map                                                                               | M    | 0.412             | 0.407  | 5.32            | faster  |
| G1 filter+map+take(10)                                                                      | M    | 0.480             | 0.469* | 0.15            | faster  |
| G1 find early hit                                                                           | M    | 0.499             | 0.462* | 7.93            | faster  |
| G1 find late hit                                                                            | M    | 0.448             | 0.448  | 10.83           | faster  |
| G1 find miss                                                                                | M    | 0.443             | 0.439  | 17.46           | faster  |
| G1 flat+map                                                                                 | M    | 0.288             | 0.284  | 1.41            | faster  |
| G1 flatMap+filter+map                                                                       | M    | 0.345             | 0.342  | 2.03            | faster  |
| G1 map                                                                                      | M    | 0.337             | 0.331  | 4.36            | faster  |
| G1 map reading data                                                                         | M    | 0.451             | 0.448  | 8.22            | faster  |
| G1 map+filter+map                                                                           | M    | 0.344             | 0.342  | 4.50            | faster  |
| G1 map+unique                                                                               | M    | 0.541             | 0.537  | 2.67            | faster  |
| G1 uniqueBy                                                                                 | M    | 0.586             | 0.585  | 2.26            | faster  |
| G1b pipe difference                                                                         | M    | 0.401             | 0.397  | -               | faster  |
| G1b pipe difference+map                                                                     | M    | 0.392             | 0.387  | -               | faster  |
| G1b pipe differenceWith                                                                     | M    | 0.689             | 0.698  | 6.83            | faster  |
| G1b pipe differenceWith+map                                                                 | M    | 0.620             | 0.621  | 6.70            | faster  |
| G1b pipe drop                                                                               | M    | 0.349             | 0.341  | 76.00           | faster  |
| G1b pipe drop+map                                                                           | M    | 0.367             | 0.364  | 10.39           | faster  |
| G1b pipe filter                                                                             | M    | 0.375             | 0.372  | 5.29            | faster  |
| G1b pipe filter+map                                                                         | M    | 0.404             | 0.399  | 5.66            | faster  |
| G1b pipe find                                                                               | M    | 0.447             | 0.448  | 19.12           | faster  |
| G1b pipe find+map                                                                           | M    | 0.413             | 0.411  | 4.58            | faster  |
| G1b pipe first                                                                              | M    | 0.497             | 0.419* | 1.98            | faster  |
| G1b pipe first+map                                                                          | M    | 0.598             | 0.565* | 0.08            | faster  |
| G1b pipe flat                                                                               | M    | 0.442             | 0.438  | 1.59            | faster  |
| G1b pipe flat+map                                                                           | M    | 0.276             | 0.272  | 1.46            | faster  |
| G1b pipe flatMap                                                                            | M    | 0.462             | 0.461  | 1.53            | faster  |
| G1b pipe flatMap+map                                                                        | M    | 0.296             | 0.291  | 1.48            | faster  |
| G1b pipe forEach                                                                            | M    | 0.391             | 0.384  | 14.51           | faster  |
| G1b pipe forEach+map                                                                        | M    | 0.391             | 0.386  | 8.22            | faster  |
| G1b pipe intersection                                                                       | M    | 0.447             | 0.445  | -               | faster  |
| G1b pipe intersection+map                                                                   | M    | 0.509             | 0.511  | -               | faster  |
| G1b pipe intersectionWith                                                                   | M    | 0.758             | 0.765  | 9.78            | faster  |
| G1b pipe intersectionWith+map                                                               | M    | 0.809             | 0.812  | 10.07           | faster  |
| G1b pipe map                                                                                | M    | 0.335             | 0.329  | 4.41            | faster  |
| G1b pipe map+map                                                                            | M    | 0.346             | 0.342  | 4.41            | faster  |
| G1b pipe mapWithFeedback                                                                    | M    | 0.389             | 0.383  | 6.61            | faster  |
| G1b pipe mapWithFeedback+map                                                                | M    | 0.380             | 0.374  | 6.94            | faster  |
| G1b pipe take                                                                               | M    | 0.337             | 0.328  | 58.77           | faster  |
| G1b pipe take+map                                                                           | M    | 0.350             | 0.347  | 9.29            | faster  |
| G1b pipe unique                                                                             | M    | 0.521             | 0.517  | 2.47            | faster  |
| G1b pipe unique+map                                                                         | M    | 0.557             | 0.552  | 2.99            | faster  |
| G1b pipe uniqueBy                                                                           | M    | 0.584             | 0.584  | -               | faster  |
| G1b pipe uniqueBy+map                                                                       | M    | 0.575             | 0.572  | -               | faster  |
| G1b pipe uniqueWith                                                                         | M    | 0.981             | 0.979  | 2.67            | neutral |
| G1b pipe uniqueWith+map                                                                     | M    | 0.976             | 0.979  | 2.62            | neutral |
| G1b pipe zip                                                                                | M    | 0.365             | 0.366  | 4.49            | faster  |
| G1b pipe zip+map                                                                            | M    | 0.371             | 0.368  | 4.44            | faster  |
| G1b pipe zipWith                                                                            | M    | 0.410             | 0.407  | 6.87            | faster  |
| G1b pipe zipWith+map                                                                        | M    | 0.397             | 0.394  | 2.61            | faster  |
| G2 deep-15 mixed                                                                            | M    | 0.568             | 0.561  | 2.08            | faster  |
| G2 deep-8 mixed                                                                             | M    | 0.622             | 0.613  | 2.47            | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | 0.730             | 0.727  | 3.48            | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | 0.735             | 0.726  | 3.89            | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | 0.734             | 0.731  | 9.15            | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | 0.739             | 0.735  | 2.30            | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | 0.400             | 0.398  | 0.23            | faster  |

</details>

<details><summary>Tier 2: Data-first calls, 1,000 items (32 scenarios)</summary>

G5 and G6 at M and Mx64 (added row: these shapes are tier 2 by size).

| Scenario                                        | Size | Branch / main p75 | Mean   | Branch / native | Verdict |
| ----------------------------------------------- | ---- | ----------------- | ------ | --------------- | ------- |
| G5 data-first difference                        | M    | 0.400             | 0.395  | -               | faster  |
| G5 data-first difference(range) (adopter shape) | M    | 0.650             | 0.648  | 1.49            | faster  |
| G5 data-first differenceWith                    | M    | 0.671             | 0.690  | 6.80            | faster  |
| G5 data-first drop                              | M    | 1.000             | 1.002* | 1.00            | neutral |
| G5 data-first drop(3)                           | M    | 1.000             | 0.998* | 0.93            | neutral |
| G5 data-first drop(3)                           | Mx64 | 1.000             | 1.000  | 1.10            | neutral |
| G5 data-first filter                            | M    | 1.000             | 1.003  | 2.83            | neutral |
| G5 data-first find                              | M    | 0.988             | 0.989  | 6.06            | neutral |
| G5 data-first find early hit                    | M    | 1.000             | 0.912* | 2.98            | faster  |
| G5 data-first find early hit                    | Mx64 | 0.926             | 0.926  | 3.32            | faster  |
| G5 data-first first                             | M    | 1.000             | 0.766* | 1.00            | faster  |
| G5 data-first first                             | Mx64 | 0.627             | 0.629  | 2.29            | faster  |
| G5 data-first flat                              | M    | 1.003             | 1.001  | 0.99            | neutral |
| G5 data-first flatMap                           | M    | 0.992             | 0.994  | 1.00            | neutral |
| G5 data-first forEach                           | M    | 1.000             | 0.993  | 6.33            | neutral |
| G5 data-first intersection                      | M    | 0.444             | 0.444  | -               | faster  |
| G5 data-first intersectionWith                  | M    | 0.765             | 0.773  | 9.63            | faster  |
| G5 data-first map                               | M    | 1.000             | 0.999  | 2.28            | neutral |
| G5 data-first mapWithFeedback                   | M    | 0.393             | 0.387  | 6.80            | faster  |
| G5 data-first mapWithFeedback (reads data)      | M    | 0.464             | 0.458  | 8.35            | faster  |
| G5 data-first take                              | M    | 1.000             | 1.008* | 1.49            | neutral |
| G5 data-first take(3)                           | M    | 1.000             | 1.025* | 1.00            | neutral |
| G5 data-first take(3)                           | Mx64 | 1.000             | 1.008  | 1.62            | neutral |
| G5 data-first unique                            | M    | 0.517             | 0.511  | 2.37            | faster  |
| G5 data-first uniqueBy                          | M    | 0.594             | 0.592  | -               | faster  |
| G5 data-first uniqueBy (reads data)             | M    | 0.642             | 0.644  | -               | faster  |
| G5 data-first uniqueWith                        | M    | 0.985             | 0.983  | 2.63            | neutral |
| G5 data-first zip                               | M    | 1.000             | 0.999  | 2.50            | neutral |
| G5 data-first zipWith                           | M    | 1.008             | 1.004  | 5.79            | neutral |
| G6 filter(fn)(data)                             | M    | 0.981             | 0.985  | 2.95            | neutral |
| G6 map(fn)(data)                                | M    | 0.989             | 0.981  | 2.21            | neutral |
| G6 unique()(data)                               | M    | 0.533             | 0.527  | 2.42            | faster  |

</details>

<details><summary>Tier 2: Other iterables (Set, string, generator) (12 scenarios)</summary>

G4: `map` + `filter` and `unique` over a Set, a string and a generator, at S and M.

| Scenario                | Size | Branch / main p75 | Mean  | Branch / native | Verdict |
| ----------------------- | ---- | ----------------- | ----- | --------------- | ------- |
| G4 generator map+filter | S    | 0.516             | 0.520 | 0.94            | faster  |
| G4 generator map+filter | M    | 0.475             | 0.474 | 0.87            | faster  |
| G4 generator unique     | S    | 0.617             | 0.621 | 1.14            | faster  |
| G4 generator unique     | M    | 0.682             | 0.681 | 1.21            | faster  |
| G4 Set map+filter       | S    | 0.450             | 0.452 | 1.09            | faster  |
| G4 Set map+filter       | M    | 0.377             | 0.375 | 0.95            | faster  |
| G4 Set unique           | S    | 0.487             | 0.488 | 5.77            | faster  |
| G4 Set unique           | M    | 0.524             | 0.513 | 7.48            | faster  |
| G4 string map+filter    | S    | 0.558             | 0.558 | 0.99            | faster  |
| G4 string map+filter    | M    | 0.522             | 0.520 | 0.91            | faster  |
| G4 string unique        | S    | 0.495             | 0.496 | 1.11            | faster  |
| G4 string unique        | M    | 0.488             | 0.487 | 1.37            | faster  |

</details>

<details><summary>Tier 2: Reused steps and `piped` (12 scenarios)</summary>

G6: `piped(...)` built per call and once at module level, and steps built once and reused across `pipe` calls, XS-M.

| Scenario                     | Size | Branch / main p75 | Mean  | Branch / native | Verdict |
| ---------------------------- | ---- | ----------------- | ----- | --------------- | ------- |
| G6 module-level piped reused | XS   | 0.751             | 0.747 | 6.07            | faster  |
| G6 module-level piped reused | S    | 0.538             | 0.534 | 8.02            | faster  |
| G6 module-level piped reused | C    | 0.463             | 0.462 | 7.50            | faster  |
| G6 module-level piped reused | M    | 0.458             | 0.454 | 5.79            | faster  |
| G6 pipe with reused steps    | XS   | 0.756             | 0.754 | 5.82            | faster  |
| G6 pipe with reused steps    | S    | 0.538             | 0.536 | 7.70            | faster  |
| G6 pipe with reused steps    | C    | 0.466             | 0.466 | 7.53            | faster  |
| G6 pipe with reused steps    | M    | 0.458             | 0.454 | 5.77            | faster  |
| G6 piped(filter, map)(data)  | XS   | 0.668             | 0.666 | 7.59            | faster  |
| G6 piped(filter, map)(data)  | S    | 0.538             | 0.532 | 8.58            | faster  |
| G6 piped(filter, map)(data)  | C    | 0.459             | 0.459 | 7.62            | faster  |
| G6 piped(filter, map)(data)  | M    | 0.462             | 0.458 | 5.77            | faster  |

</details>

<details><summary>Tier 2: Callbacks that declare no parameters (16 scenarios)</summary>

G9: `map(when(isNullish, constant(0)))`, `forEach(constant(undefined))`, `map((...args) => args[0])` and a 2-step one, XS-M (added row: a tier 2 shape).

| Scenario                             | Size | Branch / main p75 | Mean  | Branch / native | Verdict |
| ------------------------------------ | ---- | ----------------- | ----- | --------------- | ------- |
| G9 forEach(constant(undefined))      | XS   | 0.475             | 0.476 | 14.16           | faster  |
| G9 forEach(constant(undefined))      | S    | 0.422             | 0.420 | 41.06           | faster  |
| G9 forEach(constant(undefined))      | C    | 0.417             | 0.419 | 75.01           | faster  |
| G9 forEach(constant(undefined))      | M    | 0.456             | 0.448 | 56.92           | faster  |
| G9 map((...args) => args[0])         | XS   | 0.494             | 0.492 | 6.63            | faster  |
| G9 map((...args) => args[0])         | S    | 0.412             | 0.413 | 7.13            | faster  |
| G9 map((...args) => args[0])         | C    | 0.405             | 0.410 | 7.59            | faster  |
| G9 map((...args) => args[0])         | M    | 0.440             | 0.436 | 8.26            | faster  |
| G9 map((...args) => args[0])+filter  | XS   | 0.653             | 0.654 | 7.48            | faster  |
| G9 map((...args) => args[0])+filter  | S    | 0.520             | 0.517 | 7.90            | faster  |
| G9 map((...args) => args[0])+filter  | C    | 0.475             | 0.477 | 7.58            | faster  |
| G9 map((...args) => args[0])+filter  | M    | 0.493             | 0.488 | 6.62            | faster  |
| G9 map(when(isNullish, constant(0))) | XS   | 0.603             | 0.609 | 14.57           | faster  |
| G9 map(when(isNullish, constant(0))) | S    | 0.729             | 0.740 | 22.11           | faster  |
| G9 map(when(isNullish, constant(0))) | C    | 0.772             | 0.779 | 8.87            | faster  |
| G9 map(when(isNullish, constant(0))) | M    | 0.768             | 0.780 | 24.04           | faster  |

</details>

<details><summary>Tier 3: Long consecutive lazy runs (8-15 steps) (9 scenarios)</summary>

G2 deep-8 and deep-15 pipes of primitives, objects and a `flatMap` first, at S and M.

| Scenario                 | Size | Branch / main p75 | Mean  | Branch / native | Verdict |
| ------------------------ | ---- | ----------------- | ----- | --------------- | ------- |
| G2 deep-15 flatMap-first | M    | 0.327             | 0.326 | 1.10            | faster  |
| G2 deep-15 object        | M    | 0.358             | 0.356 | 1.21            | faster  |
| G2 deep-15 primitive     | M    | 0.325             | 0.325 | 1.15            | faster  |
| G2 deep-8 flatMap-first  | S    | 0.371             | 0.371 | 3.22            | faster  |
| G2 deep-8 flatMap-first  | M    | 0.342             | 0.340 | 1.17            | faster  |
| G2 deep-8 object         | S    | 0.428             | 0.430 | 5.62            | faster  |
| G2 deep-8 object         | M    | 0.364             | 0.363 | 1.27            | faster  |
| G2 deep-8 primitive      | S    | 0.392             | 0.396 | 6.65            | faster  |
| G2 deep-8 primitive      | M    | 0.333             | 0.333 | 1.20            | faster  |

</details>

<details><summary>Tier 3: 100,000 items (19 scenarios)</summary>

Every scenario measured at L (G1, G2).

| Scenario                    | Size | Branch / main p75 | Mean   | Branch / native | Verdict |
| --------------------------- | ---- | ----------------- | ------ | --------------- | ------- |
| G1 3-step middle reads data | L    | 0.470             | 0.474  | 1.85            | faster  |
| G1 drop+take                | L    | 0.381             | 0.391  | 62.61           | faster  |
| G1 filter+first             | L    | 0.549             | 0.543* | 16.88           | faster  |
| G1 filter+map               | L    | 0.404             | 0.410  | 1.48            | faster  |
| G1 filter+map+take(10)      | L    | 0.480             | 0.472* | 0.00            | faster  |
| G1 find early hit           | L    | 0.448             | 0.447  | 9.17            | faster  |
| G1 find late hit            | L    | 0.440             | 0.452  | 2.41            | faster  |
| G1 find miss                | L    | 0.432             | 0.443  | 2.34            | faster  |
| G1 flat+map                 | L    | 0.297             | 0.302  | 1.10            | faster  |
| G1 flatMap+filter+map       | L    | 0.321             | 0.315  | 1.15            | faster  |
| G1 map                      | L    | 0.386             | 0.388  | 1.74            | faster  |
| G1 map reading data         | L    | 0.419             | 0.415  | 2.36            | faster  |
| G1 map+filter+map           | L    | 0.330             | 0.329  | 1.51            | faster  |
| G1 map+unique               | L    | 0.567             | 0.566  | 1.47            | faster  |
| G1 uniqueBy                 | L    | 0.640             | 0.636  | 1.44            | faster  |
| G2 deep-8 flatMap-first     | L    | 0.314             | 0.309  | 1.16            | faster  |
| G2 deep-8 mixed             | L    | 0.690             | 0.684  | 2.32            | faster  |
| G2 deep-8 object            | L    | 0.330             | 0.328  | 1.20            | faster  |
| G2 deep-8 primitive         | L    | 0.317             | 0.314  | 1.25            | faster  |

Peak memory: the highest live heap inside the last call of each callback, minus the heap before the call (KiB). Scenarios whose peak is under 100 KiB on main are left out.

| Scenario                                                                                    | Main  | Branch | Ratio |
| ------------------------------------------------------------------------------------------- | ----- | ------ | ----- |
| G1 map                                                                                      | 1,806 | 914    | 0.506 |
| G1 map reading data                                                                         | 1,802 | 1,818  | 1.009 |
| G1 filter+map                                                                               | 2,098 | 626    | 0.298 |
| G1 map+filter+map                                                                           | 3,591 | 904    | 0.252 |
| G1 flatMap+filter+map                                                                       | 6,944 | 2,037  | 0.293 |
| G1 flat+map                                                                                 | 2,193 | 899    | 0.410 |
| G1 map+unique                                                                               | 4,962 | 3,163  | 0.637 |
| G1 uniqueBy                                                                                 | 4,057 | 3,163  | 0.779 |
| G1 find late hit                                                                            | 901   | 6      | 0.007 |
| G1 find miss                                                                                | 901   | 6      | 0.007 |
| G1 3-step middle reads data                                                                 | 2,371 | 885    | 0.373 |
| G10 filter,map / sortBy / take / groupBy                                                    | 3,282 | 1,782  | 0.543 |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | 5,939 | 4,439  | 0.747 |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | 4,427 | 2,636  | 0.595 |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | 4,963 | 2,747  | 0.553 |

Bytes allocated per call (data-first `map` runs the same code on both):

| Scenario                                 | Size | Main       | Branch    | Ratio | GCs per 1,000 calls, main / branch |
| ---------------------------------------- | ---- | ---------- | --------- | ----- | ---------------------------------- |
| G1 map reading data                      | M    | 206.0 KiB  | 96.0 KiB  | 0.466 | 13.48 / 2.93                       |
| G1 filter+map                            | XS   | 495.8 KiB  | 329.8 KiB | 0.665 | 15.11 / 10.06                      |
| G1 filter+map                            | S    | 320.1 KiB  | 123.7 KiB | 0.386 | 9.75 / 3.77                        |
| G1 filter+map                            | C    | 1.60 MiB   | 398.6 KiB | 0.243 | 50.00 / 12.16                      |
| G1 filter+map                            | M    | 261.4 KiB  | 58.2 KiB  | 0.223 | 7.96 / 1.78                        |
| G1 map+filter+map                        | M    | 478.3 KiB  | 68.9 KiB  | 0.144 | 14.55 / 2.09                       |
| G1 map+filter+map                        | L    | 46.75 MiB  | 6.52 MiB  | 0.139 | 1154.61 / 129.63                   |
| G1 flatMap+filter+map                    | M    | 1.18 MiB   | 109.7 KiB | 0.091 | 36.58 / 3.33                       |
| G2 deep-8 primitive                      | M    | 1.05 MiB   | 60.6 KiB  | 0.056 | 32.57 / 1.84                       |
| G2 deep-8 primitive                      | L    | 107.88 MiB | 6.52 MiB  | 0.060 | 2687.50 / 130.21                   |
| G2 deep-8 object                         | M    | 948.5 KiB  | 60.5 KiB  | 0.064 | 28.65 / 1.83                       |
| G2 deep-8 object                         | L    | 93.71 MiB  | 5.65 MiB  | 0.060 | 2381.94 / 130.00                   |
| G5 data-first map                        | S    | 18.5 KiB   | 18.5 KiB  | 1.000 | 0.56 / 0.56                        |
| G5 data-first map                        | C    | 60.7 KiB   | 60.7 KiB  | 1.000 | 1.85 / 1.86                        |
| G5 data-first unique                     | M    | 224.5 KiB  | 98.5 KiB  | 0.438 | 6.79 / 3.00                        |
| G9 map((...args) => args[0])             | C    | 1.33 MiB   | 607.1 KiB | 0.446 | 39.80 / 17.66                      |
| G10 filter,map / sortBy / take / groupBy | C    | 1.91 MiB   | 645.5 KiB | 0.330 | 59.32 / 19.54                      |

</details>

<details><summary>Tier 3: Exotic item kinds (14 scenarios)</summary>

G8 at C and M: entries tuples, 3-level class instances, 40-key objects, dictionary-mode objects, frozen objects, fresh `{...u}` literals, pass-through Proxy items.

| Scenario                                 | Size | Branch / main p75 | Mean  | Branch / native | Verdict |
| ---------------------------------------- | ---- | ----------------- | ----- | --------------- | ------- |
| G8 3-level class instances               | C    | 0.437             | 0.437 | 6.67            | faster  |
| G8 3-level class instances               | M    | 0.423             | 0.420 | 6.09            | faster  |
| G8 40-key objects                        | C    | 0.445             | 0.448 | 5.98            | faster  |
| G8 40-key objects                        | M    | 0.438             | 0.431 | 5.21            | faster  |
| G8 dictionary-mode objects               | C    | 0.517             | 0.514 | 3.32            | faster  |
| G8 dictionary-mode objects               | M    | 0.503             | 0.499 | 2.88            | faster  |
| G8 fresh ({...u}) literals               | C    | 0.470             | 0.463 | 2.50            | faster  |
| G8 fresh ({...u}) literals               | M    | 0.470             | 0.465 | 2.39            | faster  |
| G8 frozen objects                        | C    | 0.460             | 0.461 | 4.09            | faster  |
| G8 frozen objects                        | M    | 0.453             | 0.449 | 3.85            | faster  |
| G8 pass-through Proxy items              | C    | 0.627             | 0.626 | 1.57            | faster  |
| G8 pass-through Proxy items              | M    | 0.627             | 0.627 | 1.47            | faster  |
| G8 tuples entries+filter+map+fromEntries | C    | 0.604             | 0.606 | 1.73            | faster  |
| G8 tuples entries+filter+map+fromEntries | M    | 0.645             | 0.639 | 1.26            | faster  |

Pass-through Proxy items: per call at 100 items, main and the branch both trigger 0 `has` and 10,240 `get` traps.

Two Proxy-based reactive stores, `pipe(items, filter, map, take(10))` over 1,000 observable items:

| Store   | Re-evaluation us, main / branch | Tracked dependencies, main / branch |
| ------- | ------------------------------- | ----------------------------------- |
| Store 1 | 5.71 / 5.42                     | 31 / 31                             |
| Store 2 | 5.21 / 4.87                     | 31 / 31                             |

</details>

<details><summary>Tier 3: Lower JIT tiers, scenarios above 1.02</summary>

The tier 1 scenarios rerun with V8's optimizing compilers capped. Scenarios whose median is above 1.02 in any of the three:

| Run                                       | Scenario                  | Size | Branch / main |
| ----------------------------------------- | ------------------------- | ---- | ------------- |
| Interpreter only (`--jitless`)            | G7 omit data-last         | XS   | 1.033         |
| Interpreter only (`--jitless`)            | G7 entries data-last      | XS   | 1.052         |
| Interpreter only (`--jitless`)            | G7 entries data-last      | S    | 1.044         |
| Interpreter only (`--jitless`)            | G7 mapValues data-last    | XS   | 1.036         |
| Interpreter only (`--jitless`)            | G7 isDeepEqual data-last  | XS   | 1.023         |
| Interpreter only (`--jitless`)            | G7 groupBy data-last      | XS   | 1.026         |
| Interpreter only (`--jitless`)            | G7 pick data-last         | XS   | 1.043         |
| Interpreter only (`--jitless`)            | G7 pick data-last         | S    | 1.039         |
| Interpreter only (`--jitless`)            | G7 pick data-last         | C    | 1.032         |
| Baseline compiler ceiling (`--max-opt=1`) | G7 omit data-last         | XS   | 1.028         |
| Baseline compiler ceiling (`--max-opt=1`) | G7 entries data-last      | XS   | 1.063         |
| Baseline compiler ceiling (`--max-opt=1`) | G7 entries data-last      | S    | 1.060         |
| Baseline compiler ceiling (`--max-opt=1`) | G7 isDeepEqual data-last  | XS   | 1.020         |
| Baseline compiler ceiling (`--max-opt=1`) | G7 groupBy data-first     | XS   | 1.031         |
| Baseline compiler ceiling (`--max-opt=1`) | G7 groupBy data-last      | XS   | 1.036         |
| Baseline compiler ceiling (`--max-opt=1`) | G7 pick data-last         | XS   | 1.040         |
| Baseline compiler ceiling (`--max-opt=1`) | G7 pick data-last         | S    | 1.025         |
| Mid-tier compiler ceiling (`--max-opt=2`) | G7 isDeepEqual data-first | C    | 1.039         |

</details>

### Guard and noise

Tier 1 fails a scenario when its median ratio is beyond 1 plus the A/A noise floor (1.038 on Node 26) in both run orders, branch first and main first. Tier 2 fails at a median of 1.05 or more with every run above 1.00. Tier 3 only blocks at 1.25 or more in every run. No scenario failed, in any environment.

<details><summary>Tier 1 guard table (153 scenarios, noise floor 0.038)</summary>

The 25 tier 1 scenarios closest to the bar of 1.038, by their worse run order; the other 128 are further below it. Branch first: 2 runs; main first: 4 runs. A/A is main against itself on the same scenario.

| Scenario                  | Size | Branch first | Main first | A/A   | Verdict |
| ------------------------- | ---- | ------------ | ---------- | ----- | ------- |
| G7 mapValues data-first   | C    | 1.389        | 1.000      | 0.987 | neutral |
| G7 mapValues data-last    | C    | 1.117        | 0.973      | 0.835 | neutral |
| G7 groupBy data-first     | XS   | 1.051        | 0.997      | 1.007 | neutral |
| G7 isDeepEqual data-first | C    | 1.042        | 0.969      | 1.011 | neutral |
| G7 groupBy data-last      | C    | 1.026        | 0.983      | 0.995 | neutral |
| G7 isDeepEqual data-first | S    | 1.022        | 0.998      | 0.996 | neutral |
| G7 omit data-first        | C    | 1.021        | 0.978      | 1.009 | neutral |
| G7 groupBy data-first     | C    | 1.015        | 0.994      | 0.997 | neutral |
| G7 pick data-first        | C    | 1.012        | 1.015      | 1.006 | neutral |
| G7 groupBy data-first     | S    | 0.993        | 1.012      | 1.004 | neutral |
| G7 omit data-last         | C    | 1.010        | 1.002      | 1.006 | neutral |
| G5 data-first map         | XS   | 0.995        | 1.010      | 1.005 | neutral |
| G7 sortBy data-first      | S    | 1.009        | 0.998      | 0.997 | neutral |
| G7 isDeepEqual data-first | XS   | 1.006        | 1.009      | 1.002 | neutral |
| G5 data-first filter      | XS   | 1.004        | 1.008      | 1.011 | neutral |
| G7 pick data-first        | XS   | 0.996        | 1.008      | 1.003 | neutral |
| G7 sortBy data-last       | S    | 1.007        | 0.988      | 0.999 | neutral |
| G5 data-first filter      | S    | 0.983        | 1.006      | 1.000 | neutral |
| G7 mapValues data-first   | XS   | 0.999        | 1.005      | 0.999 | neutral |
| G7 omit data-first        | S    | 1.005        | 0.998      | 0.999 | neutral |
| G7 entries data-first     | S    | 1.005        | 1.004      | 1.000 | neutral |
| G7 pick data-first        | S    | 0.993        | 1.004      | 1.007 | neutral |
| G7 pick data-last         | S    | 1.004        | 0.989      | 1.004 | neutral |
| G7 range data-first       | XS   | 1.002        | 1.001      | 1.006 | neutral |
| G3 array sortBy+groupBy   | C    | 1.001        | 1.002      | 1.000 | neutral |

</details>

**False calls.** The same rules applied to main against itself flagged 0 of the 526 scenarios in the full matrix, and 2 of 1,762 scenario judgments across all run sets (2 in tier 1, both in the second benchmark runner).

**Weighting.** Common usage counts first: each function's weight (4, 2 or 1) and tier come from how often it appears in 2,143 public source files that import Remeda.

### Method

- Three copies of the library in one process: main, this branch, and main again as separate module instances (the A/A control that sets the noise floors). The full matrix ran 6 times, so every copy took every position twice; each environment ran 4 times, twice in each order.
- Built ESM output, timed per call with GC before every task, after a warm-up that exposes call sites to many shapes, as an app would. Before measuring, every copy's outputs and callback calls (with their arguments) were checked against main in all 526 scenarios: 18.6M traced calls, no difference.
- Tiers, weights and verdict rules were fixed before any run. Apple M4 Pro, macOS 26.6, on AC power and idle, 2026-10-08; Node 26.9 (V8 14.6) unless stated.
- Measured at `ad8d37be` against main `8e6e78f6`. The later commits in this PR change types, comments, tests and docs, plus one flag set once per run, and were not re-measured.
- claude built the harness, picked the weights from public usage, and ran the analysis; the runs themselves ran on my machine. Harness: <HARNESS_COMMIT>.

### Scope

Not measured: the SpiderMonkey and Hermes engines, x64 or Linux machines, and real browsers.

<details><summary>Small wins included</summary>

Each change went in only when it was faster than its reference in every one of 6 runs on the scenarios it targets, with a geomean of 0.99 or lower and no tier-bar loss of its own; three were kept for other reasons (marked). References: an earlier revision of this branch, or for the last two, the final design without that change.

| Change                                                                       | Scenarios targeted | Ratio to reference | Faster runs |
| ---------------------------------------------------------------------------- | ------------------ | ------------------ | ----------- |
| Lazy controls told apart by identity alone, with a per-run payload slot      | 279                | 0.849              | 6/6         |
| `pipe` builds lazy runs on demand; one-function runs skip step objects       | 59                 | 0.973              | 6/6         |
| The iterable check tests `Array.isArray` first                               | 118                | 0.949              | 6/6         |
| Data-last functions get their lazy props by direct writes                    | 138                | 0.886              | 6/6         |
| Data-last functions: one closure per argument count (kept, see below)        | 88                 | 0.991              | 6/6         |
| `unique` and `uniqueBy`: one Set lookup per item                             | 13                 | 0.985              | 6/6         |
| Marking an evaluator that reads `data` with a direct write (kept, see below) | 150                | 1.000              | 3/6         |
| The `data` error helper in its own module (kept, see below)                  | 106                | 1.000              | 4/6         |
| `map` hands a callback that can't read `data` to `pipe` as the step itself   | 71                 | 0.922              | 6/6         |
| Dedicated array `for...of` loops (no indexed reads)                          | 178                | 0.965              | 6/6         |

Kept for other reasons: one closure per argument count (0.991, just short of 0.99; it fixes `clamp` data-last at 100 items), the direct `data` marker write (6 of 6 faster on the 19 scenarios whose callbacks read `data` or declare no parameters, 0.85-0.97 at 0-3 items), and the separate error-helper module (timing-neutral; it keeps the helper out of `{ map }` bundles).

</details>

### Next steps

Candidates for follow-up PRs. None is in this PR, and none is prototyped unless a measurement is given.

- **Direct data-first paths** for the functions that only have lazy code (`unique`, `uniqueBy`, `uniqueWith`, `difference`, `differenceWith`, `intersection`, `intersectionWith`, `mapWithFeedback`). Their data-first calls still run the lazy code item by item (0.39-0.99 of main here). Estimated at 2x or more, and it would keep the lazy code out of their bundles.
- **A two-step path in `pipe`**, like this PR's one-step path: estimated 10-30% on two-step pipes at 16-1,000 items.
- **Composing a run of lazy steps once**, instead of looping over the steps for every item: estimated 10-30% per item from 100 items up.
- **Smaller per-call savings:** a lone `find` or `first` that returns its result without an array, a narrower declared arity from `when` so `map(when(...))` stops collecting `data` (0.60-0.77 of main here), and `piped` working out its lazy runs once.
- **Revisiting the per-arity data-last helper.** It is 143 of the 448 B that `import { map }` bundles to (main: 350 B), its measured gain was small (0.991), and data-last calls are up to 6% slower than main under the interpreter and the baseline compiler.
- **Measured near misses**, on an earlier revision (faster in 6 of 6 runs, but not enough to keep): a switch on the argument count when building lazy steps (0.995), reading a run's last step by index (0.996), and a spread-free data-first call in `purry` (0.973, but 1.067 on `clamp` data-last at 100 items). They need re-measuring on the final code.
- **Native array methods for runs that can't stop early** (no `take`, `find`, `first` and the like). They should approach native speed at small sizes, but this changes the order of callback calls and what `data` contains, so it needs a decision on semantics first.
