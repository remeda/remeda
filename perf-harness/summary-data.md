# PR #1444: performance data (publication run)

Branch `eranhirsch/performantPipe` at `ad8d37be` vs main `8e6e78f6`. Source: `results/publication/` (stage `publication`, 59 steps, 2026-10-08 12:08-17:04 IDT, run by `watch-and-run.sh` from the maintainer's terminal). Every number is recomputed from the raw runs with `a8/lib.mjs` (the loading, metric choice, floors and verdicts of `scripts/aggregate.mjs`); the tier numbers match `results/publication/agg-*.md` exactly.

Conventions:

- Ratio: branch time / main time in one run, on the scenario's p75 (on its mean when main's or the branch's median p75 is under 1 us, marked `*`). Below 1 is faster.
- Per scenario: the median over runs (6 for the full matrix, 4 for each extra). `gm`: popularity-weighted geomean of the per-scenario medians (high 4, mid 2, low 1).
- Verdicts: each scenario at its own tier (`harness/verdicts.js`); "slower" counts regression, slower and BLOCK.
- Areas group scenarios by shape and size (README, "Priority model"), whatever tier popularity moved them to; popularity only weights them. Two tier 2 rows were added to the requested list so every scenario lands in exactly one area: data-first calls at 1,000 items, and callbacks that declare no parameters.
- Native: the same work in plain JS, measured in the two rotation-0 runs only. branch/native above 1 means the branch is slower than native.

## 1. Headline

Full matrix (Node 26.9, V8 14.6, built ESM, 526 scenarios, 6 runs): tier 1 0.680, tier 2 0.596, tier 3 0.501; 0 bar violations in any run set.

| tier | area                                                                                             | scenarios | gm branch/main | range of scenario medians | faster / neutral / slower              | scenarios per judged tier |
| ---- | ------------------------------------------------------------------------------------------------ | --------- | -------------- | ------------------------- | -------------------------------------- | ------------------------- |
| 1    | **all tier 1 scenarios, as judged**                                                              | 153       | **0.680**      | 0.332-1.021               | 104 / 49 / 0                           | -                         |
| 1    | Data-first calls, 16-100 items                                                                   | 114       | 0.885          | 0.388-1.029               | 32 / 82 / 0                            | T1 48, T2 40, T3 26       |
| 1    | Data-first in hot loops, 0-3 items                                                               | 51        | 0.859          | 0.458-1.021               | 17 / 34 / 0                            | T1 23, T2 19, T3 9        |
| 1    | Non-lazy pipes                                                                                   | 20        | 0.760          | 0.397-1.001               | 16 / 4 / 0                             | T1 19, T2 1               |
| 1    | Short lazy pipes, 0-100 items                                                                    | 151       | 0.469          | 0.273-0.882               | 151 / 0 / 0                            | T1 45, T2 55, T3 51       |
| 1    | Interleaved pipes, 0-100 items                                                                   | 16        | 0.582          | 0.400-0.780               | 16 / 0 / 0                             | T1 16                     |
| 1    | Bundle size of data-first imports, gzip (`{ map }`, `{ filter, map }`, `{ unique }`; 2 bundlers) | 6         | 1.152          | 1.088-1.266               | larger in 6 of 6                       | -                         |
| 1    | Cold start: first call / first 50 calls (5 probes, 40 processes each)                            | 5         | 0.896 / 0.761  | 0.603-1.128 / 0.520-1.014 | 7 / 2 / 1 (10 readings, +-5% band)     | import 1.033              |
| 2    | **all tier 2 scenarios, as judged**                                                              | 173       | **0.596**      | 0.273-1.029               | 114 / 59 / 0                           | -                         |
| 2    | Lazy and interleaved pipes, 1,000 items                                                          | 60        | 0.469          | 0.276-0.981               | 58 / 2 / 0                             | T2 22, T3 38              |
| 2    | Other iterables (Set, string, generator)                                                         | 12        | 0.511          | 0.377-0.682               | 12 / 0 / 0                             | T2 12                     |
| 2    | Reused steps and `piped`                                                                         | 12        | 0.540          | 0.458-0.756               | 12 / 0 / 0                             | T2 4, T3 8                |
| 2    | Data-first calls, 1,000 items                                                                    | 32        | 0.784          | 0.393-1.025               | 15 / 17 / 0                            | T1 2, T2 8, T3 22         |
| 2    | Callbacks that declare no parameters                                                             | 16        | 0.540          | 0.405-0.772               | 16 / 0 / 0                             | T2 12, T3 4               |
| 3    | **all tier 3 scenarios, as judged**                                                              | 200       | **0.501**      | 0.276-1.025               | 169 / 31 / 0                           | -                         |
| 3    | Long consecutive lazy runs (8-15 steps)                                                          | 9         | 0.359          | 0.325-0.428               | 9 / 0 / 0                              | T3 9                      |
| 3    | 100,000 items                                                                                    | 19        | 0.422          | 0.297-0.690               | 19 / 0 / 0                             | T3 19                     |
| 3    | Exotic item kinds                                                                                | 14        | 0.503          | 0.423-0.645               | 14 / 0 / 0                             | T3 14                     |
| 3    | Peak live heap at 100,000 items (shapes with a peak of 100 KiB or more on main and main-aa)      | 15        | median 0.506   | 0.007-1.009               | at or below main (<= 1.01) in 15 of 15 | -                         |
| 3    | Lower JIT tier: Interpreter only (`--jitless`)                                                   | 153       | 0.676          | 0.257-1.052               | 95 / 57 / 1                            | T3 153                    |
| 3    | Lower JIT tier: Baseline compiler ceiling (`--max-opt=1`, Sparkplug)                             | 153       | 0.654          | 0.220-1.063               | 98 / 53 / 2                            | T3 153                    |
| 3    | Lower JIT tier: Mid-tier compiler ceiling (`--max-opt=2`, Maglev)                                | 153       | 0.655          | 0.275-1.039               | 102 / 51 / 0                           | T3 153                    |

Environments (same rules; each run set has its own floors):

| environment                                                             | subset                   | scenarios | gm branch/main                       | range       | faster / neutral / slower | bar violations | floors T1 / T2 / T3   |
| ----------------------------------------------------------------------- | ------------------------ | --------- | ------------------------------------ | ----------- | ------------------------- | -------------- | --------------------- |
| Node 22.23 (V8 12.4)                                                    | tier 1 (153)             | 153       | 0.703                                | 0.338-1.022 | 103 / 50 / 0              | 0              | 0.037 / - / -         |
| Node 24.21 (V8 13.6)                                                    | tier 1 (153)             | 153       | 0.693                                | 0.329-1.025 | 103 / 50 / 0              | 0              | 0.036 / - / -         |
| Bun 1.4.2 (JavaScriptCore), second runner                               | tier 1 (153)             | 153       | 0.587                                | 0.202-1.035 | 117 / 36 / 0              | 0              | 0.054 / - / -         |
| One scope-hoisted bundle (Node 26)                                      | headline (23)            | 23        | 0.604 (T1 0.599, T2 0.613)           | 0.337-1.003 | 16 / 7 / 0                | 0              | 0.037 / 0.017 / -     |
| CJS through `require` (Node 26)                                         | headline (23)            | 23        | 0.596 (T1 0.596, T2 0.597)           | 0.307-1.034 | 14 / 9 / 0                | 0              | 0.155 / 0.167 / -     |
| No JIT pollution before measuring (P0)                                  | G1, G2, G10 at C, M (48) | 48        | 0.538 (T1 0.558, T2 0.561, T3 0.477) | 0.298-0.843 | 48 / 0 / 0                | 0              | 0.026 / 0.143 / 0.236 |
| Narrow pollution (P1: `map`/`filter`/`find`/`take` over 10 item shapes) | G1, G2, G10 at C, M (48) | 48        | 0.553 (T1 0.569, T2 0.572, T3 0.502) | 0.365-0.843 | 48 / 0 / 0                | 0              | 0.024 / 0.024 / 0.017 |
| Node 26, second runner (no vitest)                                      | tier 1 (153)             | 153       | 0.684                                | 0.334-1.045 | 105 / 48 / 0              | 0              | 0.026 / - / -         |
| Node 26, one library copy per process                                   | headline (23)            | 23        | 0.604 (T1 0.599, T2 0.616)           | 0.335-1.014 | 16 / 7 / 0                | 0              | 0.044 / 0.045 / -     |

Full-matrix gm per run (rotation 0 joins its two parts):

| run       | order                 | T1    | T2    | T3    |
| --------- | --------------------- | ----- | ----- | ----- |
| full-r0-a | main, branch, main-aa | 0.681 | 0.598 | 0.500 |
| full-r0-b | main, branch, main-aa | 0.680 | 0.596 | 0.500 |
| full-r1-a | branch, main-aa, main | 0.681 | 0.592 | 0.502 |
| full-r1-b | branch, main-aa, main | 0.684 | 0.593 | 0.502 |
| full-r2-a | main-aa, main, branch | 0.680 | 0.599 | 0.501 |
| full-r2-b | main-aa, main, branch | 0.679 | 0.597 | 0.503 |

## 2. Per-area detail tables

main and branch: median p75 time per call of the batch. branch/main p75: `median [min..max]` over the 6 runs; mean: the median. branch/native from the 2 rotation-0 runs. A/A: main-aa/main on the judged metric. `*`: judged on the mean.

### Tier 1 (strict): Data-first calls, 16-100 items

Data-first calls (G5, G7) and data-last calls outside `pipe` (G6, G7) at S (16 items) and C (100 items). 114 scenarios; gm 0.885; range 0.388-1.029; faster / neutral / slower 32 / 82 / 0.

| scenario                                        | size | tier | pop  | main      | branch    | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ----------------------------------------------- | ---- | ---- | ---- | --------- | --------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G5 data-first difference                        | S    | 1    | mid  | 39.19 us  | 18.06 us  | 0.457 [0.440..0.470] | 0.457            | -                 | -                  | 1.000 [0.994..1.008] | faster  |
| G5 data-first difference                        | C    | 1    | mid  | 238.73 us | 106.65 us | 0.444 [0.438..0.450] | 0.446            | -                 | -                  | 0.997 [0.959..1.013] | faster  |
| G5 data-first difference(range) (adopter shape) | S    | 1    | mid  | 70.08 us  | 48.35 us  | 0.691 [0.677..0.708] | 0.688            | 1.53              | 1.53               | 0.998 [0.993..1.018] | faster  |
| G5 data-first difference(range) (adopter shape) | C    | 1    | mid  | 412.83 us | 262.04 us | 0.635 [0.629..0.670] | 0.635            | 1.41              | 1.41               | 1.008 [0.994..1.045] | faster  |
| G5 data-first differenceWith                    | S    | 3    | low  | 43.29 us  | 22.35 us  | 0.508 [0.504..0.530] | 0.510            | 6.22              | 5.97               | 0.998 [0.977..1.015] | faster  |
| G5 data-first differenceWith                    | C    | 3    | low  | 438.13 us | 304.92 us | 0.690 [0.681..0.730] | 0.692            | 4.39              | 4.34               | 0.994 [0.976..1.040] | faster  |
| G5 data-first drop                              | S    | 3    | low  | 1.77 us   | 1.75 us   | 1.000 [0.977..1.000] | 0.999            | 1.65              | 1.66               | 1.000 [0.999..1.047] | neutral |
| G5 data-first drop                              | C    | 3    | low  | 2.56 us   | 2.58 us   | 1.000 [0.984..1.033] | 1.007            | 1.38              | 1.41               | 1.000 [0.984..1.017] | neutral |
| G5 data-first filter                            | S    | 1    | high | 7.31 us   | 7.35 us   | 1.006 [0.978..1.017] | 1.001            | 3.42              | 3.40               | 1.000 [0.977..1.023] | neutral |
| G5 data-first filter                            | C    | 1    | high | 38.27 us  | 38.08 us  | 0.996 [0.988..1.006] | 0.995            | 3.54              | 3.54               | 1.005 [0.992..1.016] | neutral |
| G5 data-first find                              | S    | 2    | mid  | 3.79 us   | 3.25 us   | 0.841 [0.808..0.922] | 0.845            | 4.38              | 4.32               | 1.000 [0.980..1.088] | faster  |
| G5 data-first find                              | C    | 2    | mid  | 14.46 us  | 13.92 us  | 0.961 [0.949..0.971] | 0.961            | 3.55              | 3.60               | 0.999 [0.989..1.003] | neutral |
| G5 data-first first                             | S    | 2    | mid  | 1.46 us   | 917 ns    | 0.620 [0.600..0.629] | 0.609 *          | 2.45              | 2.59               | 1.001 [0.995..1.010] | faster  |
| G5 data-first first                             | C    | 2    | mid  | 1.46 us   | 917 ns    | 0.629 [0.611..0.629] | 0.617 *          | 2.45              | 2.60               | 1.003 [0.998..1.004] | faster  |
| G5 data-first flat                              | S    | 2    | mid  | 10.98 us  | 11.06 us  | 1.006 [0.974..1.030] | 1.007            | 1.04              | 1.04               | 0.996 [0.966..1.038] | neutral |
| G5 data-first flat                              | C    | 2    | mid  | 52.77 us  | 52.79 us  | 1.003 [0.963..1.006] | 1.001            | 1.00              | 0.99               | 0.998 [0.986..1.010] | neutral |
| G5 data-first flatMap                           | S    | 2    | mid  | 26.65 us  | 26.58 us  | 1.001 [0.995..1.009] | 1.002            | 1.01              | 1.02               | 1.003 [0.997..1.018] | neutral |
| G5 data-first flatMap                           | C    | 2    | mid  | 149.69 us | 149.44 us | 0.995 [0.979..1.023] | 0.995            | 1.00              | 1.00               | 0.998 [0.983..1.023] | neutral |
| G5 data-first forEach                           | S    | 3    | low  | 5.42 us   | 5.00 us   | 0.955 [0.906..1.026] | 0.985            | 4.47              | 4.43               | 1.008 [0.915..1.128] | neutral |
| G5 data-first forEach                           | C    | 3    | low  | 30.00 us  | 30.00 us  | 0.999 [0.989..1.007] | 0.991            | 4.50              | 4.27               | 1.000 [0.996..1.001] | neutral |
| G5 data-first intersection                      | S    | 3    | low  | 24.10 us  | 13.46 us  | 0.557 [0.550..0.565] | 0.557            | -                 | -                  | 1.001 [0.985..1.009] | faster  |
| G5 data-first intersection                      | C    | 3    | low  | 192.04 us | 99.90 us  | 0.521 [0.503..0.527] | 0.520            | -                 | -                  | 1.000 [0.994..1.007] | faster  |
| G5 data-first intersectionWith                  | S    | 3    | low  | 38.94 us  | 22.35 us  | 0.572 [0.563..0.590] | 0.571            | 7.25              | 7.38               | 0.997 [0.988..1.002] | faster  |
| G5 data-first intersectionWith                  | C    | 3    | low  | 397.31 us | 297.71 us | 0.739 [0.723..0.761] | 0.742            | 9.62              | 9.55               | 0.995 [0.925..1.005] | faster  |
| G5 data-first map                               | S    | 1    | high | 7.54 us   | 7.50 us   | 0.994 [0.989..1.017] | 0.996            | 2.73              | 2.71               | 0.992 [0.978..1.006] | neutral |
| G5 data-first map                               | C    | 1    | high | 36.12 us  | 35.42 us  | 0.980 [0.952..1.000] | 0.989            | 2.45              | 2.42               | 0.977 [0.944..1.002] | neutral |
| G5 data-first mapWithFeedback                   | S    | 3    | low  | 36.46 us  | 15.69 us  | 0.431 [0.427..0.439] | 0.429            | 6.52              | 6.68               | 1.002 [0.993..1.015] | faster  |
| G5 data-first mapWithFeedback                   | C    | 3    | low  | 209.83 us | 82.04 us  | 0.388 [0.385..0.392] | 0.389            | 6.46              | 6.72               | 1.002 [0.994..1.009] | faster  |
| G5 data-first mapWithFeedback (reads data)      | S    | 3    | low  | 37.46 us  | 17.12 us  | 0.459 [0.455..0.465] | 0.459            | 7.09              | 7.41               | 0.999 [0.992..1.011] | faster  |
| G5 data-first mapWithFeedback (reads data)      | C    | 3    | low  | 216.56 us | 92.88 us  | 0.430 [0.425..0.435] | 0.432            | 7.80              | 7.88               | 0.999 [0.994..1.005] | faster  |
| G5 data-first take                              | S    | 2    | mid  | 1.75 us   | 1.75 us   | 1.000 [1.000..1.024] | 1.003            | 1.70              | 1.69               | 1.000 [1.000..1.000] | neutral |
| G5 data-first take                              | C    | 2    | mid  | 2.12 us   | 2.12 us   | 1.000 [1.000..1.020] | 1.009            | 1.52              | 1.52               | 1.000 [0.981..1.020] | neutral |
| G5 data-first unique                            | S    | 1    | high | 53.50 us  | 27.58 us  | 0.518 [0.505..0.526] | 0.517            | 1.84              | 1.87               | 1.002 [0.992..1.012] | faster  |
| G5 data-first unique                            | C    | 1    | high | 327.54 us | 182.58 us | 0.563 [0.540..0.576] | 0.560            | 1.86              | 1.90               | 1.003 [0.990..1.018] | faster  |
| G5 data-first uniqueBy                          | S    | 1    | high | 59.19 us  | 35.19 us  | 0.589 [0.572..0.605] | 0.590            | -                 | -                  | 0.997 [0.982..1.006] | faster  |
| G5 data-first uniqueBy                          | C    | 1    | high | 344.96 us | 212.25 us | 0.616 [0.606..0.631] | 0.614            | -                 | -                  | 1.001 [0.997..1.010] | faster  |
| G5 data-first uniqueBy (reads data)             | S    | 1    | high | 62.56 us  | 36.56 us  | 0.584 [0.575..0.595] | 0.589            | -                 | -                  | 1.002 [0.996..1.008] | faster  |
| G5 data-first uniqueBy (reads data)             | C    | 1    | high | 362.00 us | 229.44 us | 0.636 [0.620..0.646] | 0.641            | -                 | -                  | 1.001 [0.973..1.010] | faster  |
| G5 data-first uniqueWith                        | S    | 3    | low  | 70.35 us  | 47.48 us  | 0.680 [0.656..0.681] | 0.680            | 2.67              | 2.74               | 0.994 [0.978..1.022] | faster  |
| G5 data-first uniqueWith                        | C    | 3    | low  | 1.31 ms   | 1.18 ms   | 0.906 [0.875..0.952] | 0.900            | 2.45              | 2.42               | 1.003 [0.994..1.038] | faster  |
| G5 data-first zip                               | S    | 2    | mid  | 8.38 us   | 8.29 us   | 1.000 [0.966..1.005] | 1.001            | 2.68              | 2.63               | 1.005 [0.971..1.010] | neutral |
| G5 data-first zip                               | C    | 2    | mid  | 41.44 us  | 41.40 us  | 0.998 [0.992..1.009] | 1.000            | 2.68              | 2.57               | 0.994 [0.992..1.007] | neutral |
| G5 data-first zipWith                           | S    | 3    | low  | 9.00 us   | 8.98 us   | 1.000 [0.982..1.009] | 0.999            | 5.53              | 5.47               | 0.998 [0.991..1.000] | neutral |
| G5 data-first zipWith                           | C    | 3    | low  | 46.52 us  | 46.67 us  | 1.002 [0.995..1.011] | 1.001            | 6.15              | 6.16               | 0.998 [0.994..1.006] | neutral |
| G6 filter(fn)(data)                             | S    | 1    | high | 9.08 us   | 7.67 us   | 0.831 [0.819..0.865] | 0.833            | 3.54              | 3.55               | 0.995 [0.986..1.028] | faster  |
| G6 filter(fn)(data)                             | C    | 1    | high | 39.94 us  | 37.69 us  | 0.946 [0.921..0.952] | 0.945            | 3.48              | 3.49               | 0.997 [0.986..1.004] | faster  |
| G6 map(fn)(data)                                | S    | 1    | high | 8.96 us   | 7.65 us   | 0.855 [0.844..0.859] | 0.853            | 2.90              | 2.84               | 1.002 [0.995..1.009] | faster  |
| G6 map(fn)(data)                                | C    | 1    | high | 37.54 us  | 34.85 us  | 0.934 [0.917..0.951] | 0.938            | 1.00              | 1.04               | 0.999 [0.991..1.017] | faster  |
| G6 unique()(data)                               | S    | 1    | high | 54.50 us  | 28.15 us  | 0.516 [0.502..0.526] | 0.514            | 1.91              | 1.94               | 1.001 [0.999..1.043] | faster  |
| G6 unique()(data)                               | C    | 1    | high | 323.83 us | 185.67 us | 0.566 [0.556..0.580] | 0.563            | 1.72              | 1.79               | 1.007 [0.994..1.048] | faster  |
| G7 add data-first                               | S    | 3    | low  | 917 ns    | 917 ns    | 1.000 [1.000..1.001] | 1.005 *          | 3.14              | 3.20               | 1.003 [0.999..1.012] | neutral |
| G7 add data-last                                | S    | 3    | low  | 1.13 us   | 1.04 us   | 0.926 [0.926..0.926] | 0.941            | 3.57              | 3.81               | 1.000 [0.964..1.000] | faster  |
| G7 chunk data-first                             | S    | 2    | mid  | 4.04 us   | 4.06 us   | 1.000 [1.000..1.021] | 1.008            | 0.27              | 0.28               | 1.000 [0.990..1.021] | neutral |
| G7 chunk data-first                             | C    | 2    | mid  | 18.79 us  | 18.94 us  | 1.003 [0.998..1.018] | 1.005            | 0.33              | 0.33               | 1.003 [0.998..1.007] | neutral |
| G7 chunk data-last                              | S    | 2    | mid  | 4.21 us   | 4.12 us   | 0.975 [0.971..0.990] | 0.973            | 0.28              | 0.28               | 1.005 [0.990..1.020] | neutral |
| G7 chunk data-last                              | C    | 2    | mid  | 19.08 us  | 18.96 us  | 0.993 [0.989..1.002] | 0.995            | 0.35              | 0.35               | 1.000 [0.985..1.002] | neutral |
| G7 clamp data-first                             | S    | 2    | mid  | 1.02 us   | 1.04 us   | 1.021 [1.000..1.042] | 1.002            | 3.57              | 3.60               | 1.020 [0.961..1.042] | neutral |
| G7 clamp data-first                             | C    | 2    | mid  | 1.04 us   | 1.04 us   | 1.001 [1.000..1.039] | 1.008            | 3.57              | 3.69               | 1.000 [0.961..1.001] | neutral |
| G7 clamp data-last                              | S    | 2    | mid  | 1.21 us   | 1.17 us   | 0.965 [0.965..0.966] | 0.959            | 4.00              | 4.09               | 1.000 [0.999..1.001] | neutral |
| G7 clamp data-last                              | C    | 2    | mid  | 1.21 us   | 1.17 us   | 0.965 [0.934..0.965] | 0.963            | 4.00              | 4.17               | 1.000 [0.967..1.000] | neutral |
| G7 clone data-first                             | S    | 2    | mid  | 200.42 us | 199.81 us | 1.004 [0.961..1.010] | 1.002            | 16.22             | 16.34              | 1.003 [0.957..1.005] | neutral |
| G7 clone data-first                             | C    | 2    | mid  | 1.39 ms   | 1.40 ms   | 1.005 [0.998..1.021] | 1.002            | 9.06              | 9.58               | 1.000 [0.996..1.008] | neutral |
| G7 clone data-last                              | S    | 2    | mid  | 199.96 us | 200.27 us | 1.000 [0.982..1.003] | 1.000            | 16.15             | 16.31              | 0.999 [0.985..1.006] | neutral |
| G7 clone data-last                              | C    | 2    | mid  | 1.39 ms   | 1.39 ms   | 0.999 [0.960..1.010] | 0.999            | 9.68              | 9.91               | 0.999 [0.976..1.025] | neutral |
| G7 entries data-first                           | S    | 1    | high | 4.50 us   | 4.52 us   | 1.004 [1.000..1.009] | 1.001            | 1.09              | 1.09               | 1.000 [0.991..1.009] | neutral |
| G7 entries data-first                           | C    | 1    | high | 17.75 us  | 17.75 us  | 1.000 [0.998..1.002] | 1.001            | 1.01              | 1.01               | 1.001 [0.998..1.012] | neutral |
| G7 entries data-last                            | S    | 1    | high | 4.81 us   | 4.81 us   | 1.000 [0.982..1.009] | 0.999            | 1.13              | 1.13               | 1.000 [0.982..1.009] | neutral |
| G7 entries data-last                            | C    | 1    | high | 18.71 us  | 18.69 us  | 0.998 [0.996..1.004] | 0.997            | 1.07              | 1.06               | 0.998 [0.996..1.000] | neutral |
| G7 groupBy data-first                           | S    | 1    | high | 17.15 us  | 17.23 us  | 1.006 [0.986..1.017] | 1.003            | 1.79              | 1.79               | 1.004 [0.986..1.007] | neutral |
| G7 groupBy data-first                           | C    | 1    | high | 63.31 us  | 62.87 us  | 0.998 [0.949..1.033] | 0.999            | 1.49              | 1.50               | 0.997 [0.958..1.021] | neutral |
| G7 groupBy data-last                            | S    | 1    | high | 17.54 us  | 17.37 us  | 0.993 [0.983..1.002] | 0.990            | 1.81              | 1.82               | 1.000 [0.993..1.002] | neutral |
| G7 groupBy data-last                            | C    | 1    | high | 63.31 us  | 62.81 us  | 0.992 [0.976..1.050] | 0.993            | 1.50              | 1.50               | 0.995 [0.985..1.021] | neutral |
| G7 isDeepEqual data-first                       | S    | 1    | high | 21.96 us  | 21.96 us  | 1.002 [0.971..1.040] | 1.001            | 1.54              | 1.55               | 0.996 [0.962..1.021] | neutral |
| G7 isDeepEqual data-first                       | C    | 1    | high | 371.04 us | 374.88 us | 0.981 [0.930..1.102] | 0.985            | 1.35              | 1.35               | 1.011 [0.968..1.093] | neutral |
| G7 isDeepEqual data-last                        | S    | 1    | high | 22.17 us  | 22.02 us  | 0.995 [0.985..1.007] | 0.997            | 1.54              | 1.56               | 0.998 [0.969..1.008] | neutral |
| G7 isDeepEqual data-last                        | C    | 1    | high | 386.58 us | 365.46 us | 0.956 [0.910..1.022] | 0.973            | 1.29              | 1.29               | 0.961 [0.901..1.035] | neutral |
| G7 keys data-first                              | S    | 2    | mid  | 1.42 us   | 1.46 us   | 1.029 [0.999..1.029] | 1.010            | 1.52              | 1.53               | 1.000 [1.000..1.030] | neutral |
| G7 keys data-first                              | C    | 2    | mid  | 3.92 us   | 3.96 us   | 1.011 [0.980..1.011] | 1.008            | 1.14              | 1.15               | 1.011 [0.980..1.011] | neutral |
| G7 keys data-last                               | S    | 2    | mid  | 1.63 us   | 1.60 us   | 0.975 [0.974..1.000] | 0.978            | 1.65              | 1.67               | 1.000 [0.976..1.000] | neutral |
| G7 keys data-last                               | C    | 2    | mid  | 4.27 us   | 4.29 us   | 1.000 [1.000..1.030] | 1.007            | 1.25              | 1.25               | 1.000 [0.990..1.010] | neutral |
| G7 mapToObj data-first                          | S    | 2    | mid  | 14.21 us  | 14.10 us  | 0.996 [0.985..1.003] | 0.997            | 0.33              | 0.34               | 1.000 [0.985..1.003] | neutral |
| G7 mapToObj data-first                          | C    | 2    | mid  | 123.08 us | 123.71 us | 1.000 [0.976..1.031] | 0.999            | 0.35              | 0.35               | 1.004 [0.997..1.014] | neutral |
| G7 mapToObj data-last                           | S    | 2    | mid  | 18.77 us  | 18.48 us  | 0.987 [0.980..0.998] | 0.985            | 0.43              | 0.44               | 1.004 [1.000..1.018] | neutral |
| G7 mapToObj data-last                           | C    | 2    | mid  | 157.19 us | 156.69 us | 1.006 [0.981..1.260] | 1.004            | 0.51              | 0.47               | 0.985 [0.935..1.008] | neutral |
| G7 mapValues data-first                         | S    | 1    | high | 15.44 us  | 15.42 us  | 0.999 [0.987..1.014] | 0.999            | 0.39              | 0.39               | 0.999 [0.997..1.003] | neutral |
| G7 mapValues data-first                         | C    | 1    | high | 153.37 us | 156.73 us | 1.015 [0.961..1.394] | 1.033            | 0.63              | 0.62               | 0.987 [0.961..1.028] | neutral |
| G7 mapValues data-last                          | S    | 1    | high | 17.88 us  | 17.63 us  | 0.982 [0.981..0.998] | 0.984            | 0.45              | 0.45               | 0.995 [0.986..0.998] | neutral |
| G7 mapValues data-last                          | C    | 1    | high | 223.42 us | 224.71 us | 0.982 [0.759..1.291] | 0.991            | 0.90              | 0.81               | 0.835 [0.758..1.100] | neutral |
| G7 merge data-first                             | S    | 3    | low  | 5.69 us   | 5.69 us   | 1.007 [0.993..1.015] | 1.004            | 5.46              | 5.41               | 0.996 [0.993..1.030] | neutral |
| G7 merge data-last                              | S    | 3    | low  | 5.92 us   | 5.81 us   | 0.982 [0.958..1.000] | 0.984            | 5.60              | 5.55               | 0.993 [0.972..1.007] | neutral |
| G7 mergeDeep data-first                         | S    | 2    | mid  | 15.90 us  | 15.96 us  | 1.004 [0.995..1.013] | 1.002            | 1.16              | 1.16               | 1.003 [1.003..1.011] | neutral |
| G7 mergeDeep data-first                         | C    | 2    | mid  | 143.52 us | 144.85 us | 1.003 [0.769..1.198] | 0.997            | 1.15              | 1.09               | 1.023 [0.719..1.041] | neutral |
| G7 mergeDeep data-last                          | S    | 2    | mid  | 16.08 us  | 15.98 us  | 0.995 [0.984..1.000] | 0.995            | 1.15              | 1.16               | 0.999 [0.990..1.002] | neutral |
| G7 mergeDeep data-last                          | C    | 2    | mid  | 146.75 us | 145.10 us | 0.989 [0.769..1.064] | 0.993            | 0.97              | 0.99               | 1.009 [0.758..1.025] | neutral |
| G7 omit data-first                              | S    | 1    | high | 30.00 us  | 29.94 us  | 0.998 [0.990..1.020] | 0.999            | 0.70              | 0.69               | 0.999 [0.993..1.011] | neutral |
| G7 omit data-first                              | C    | 1    | high | 201.52 us | 200.54 us | 0.993 [0.957..1.036] | 1.000            | 0.72              | 0.71               | 1.009 [0.952..1.013] | neutral |
| G7 omit data-last                               | S    | 1    | high | 30.31 us  | 30.10 us  | 0.997 [0.989..1.001] | 0.998            | 0.81              | 0.81               | 0.999 [0.994..1.005] | neutral |
| G7 omit data-last                               | C    | 1    | high | 200.02 us | 200.35 us | 1.005 [0.985..1.014] | 1.004            | 0.83              | 0.82               | 1.006 [0.989..1.018] | neutral |
| G7 pick data-first                              | S    | 1    | high | 5.54 us   | 5.54 us   | 0.996 [0.992..1.015] | 0.999            | 0.57              | 0.57               | 1.007 [0.993..1.015] | neutral |
| G7 pick data-first                              | C    | 1    | high | 7.10 us   | 7.19 us   | 1.015 [1.006..1.023] | 1.009            | 0.43              | 0.43               | 1.006 [0.988..1.018] | neutral |
| G7 pick data-last                               | S    | 1    | high | 5.75 us   | 5.73 us   | 0.993 [0.979..1.007] | 0.989            | 0.59              | 0.58               | 1.004 [0.993..1.014] | neutral |
| G7 pick data-last                               | C    | 1    | high | 7.35 us   | 7.23 us   | 0.980 [0.956..0.989] | 0.980            | 0.43              | 0.43               | 1.003 [0.995..1.017] | neutral |
| G7 range data-first                             | S    | 1    | mid  | 26.21 us  | 26.08 us  | 0.998 [0.986..1.003] | 0.996            | 1.05              | 1.06               | 0.998 [0.992..1.002] | neutral |
| G7 range data-first                             | C    | 1    | mid  | 134.10 us | 133.67 us | 0.996 [0.990..1.002] | 0.996            | 1.02              | 1.02               | 1.001 [0.991..1.003] | neutral |
| G7 range data-last                              | S    | 2    | mid  | 26.29 us  | 26.19 us  | 0.995 [0.987..1.000] | 0.993            | 1.06              | 1.07               | 1.000 [0.997..1.003] | neutral |
| G7 range data-last                              | C    | 2    | mid  | 136.73 us | 134.06 us | 0.993 [0.968..1.000] | 0.992            | 1.05              | 1.06               | 0.986 [0.952..1.001] | neutral |
| G7 set data-first                               | S    | 3    | low  | 6.75 us   | 6.79 us   | 1.003 [1.000..1.012] | 1.004            | 6.94              | 6.92               | 1.000 [0.988..1.012] | neutral |
| G7 set data-last                                | S    | 3    | low  | 6.94 us   | 6.62 us   | 0.958 [0.940..0.970] | 0.960            | 6.62              | 6.73               | 1.009 [1.000..1.018] | neutral |
| G7 sortBy data-first                            | S    | 1    | high | 29.65 us  | 29.65 us  | 0.999 [0.993..1.013] | 0.998            | 2.62              | 2.62               | 0.997 [0.990..1.011] | neutral |
| G7 sortBy data-last                             | S    | 1    | high | 28.46 us  | 28.31 us  | 0.994 [0.987..1.012] | 0.996            | 2.47              | 2.47               | 0.999 [0.983..1.009] | neutral |
| G7 sumBy data-first                             | S    | 2    | mid  | 11.54 us  | 11.54 us  | 1.002 [0.982..1.029] | 0.999            | 11.56             | 11.85              | 1.000 [0.993..1.015] | neutral |
| G7 sumBy data-last                              | S    | 2    | mid  | 11.94 us  | 11.87 us  | 0.991 [0.965..1.014] | 0.991            | 12.28             | 12.44              | 1.002 [0.979..1.021] | neutral |
| G7 toLowerCase data-first                       | S    | 3    | low  | 1.33 us   | 1.33 us   | 1.000 [0.969..1.032] | 0.997            | 1.78              | 1.77               | 1.000 [1.000..1.032] | neutral |
| G7 toLowerCase data-last                        | S    | 3    | low  | 1.46 us   | 1.42 us   | 0.971 [0.945..0.972] | 0.968            | 1.89              | 1.92               | 1.000 [0.973..1.028] | neutral |

### Tier 1 (strict): Data-first in hot loops, 0-3 items

The same calls at XS: 256 calls per measurement on inputs of 0, 1 or 3 items, so per-call overhead dominates. 51 scenarios; gm 0.859; range 0.458-1.021; faster / neutral / slower 17 / 34 / 0.

| scenario                                        | size | tier | pop  | main     | branch   | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ----------------------------------------------- | ---- | ---- | ---- | -------- | -------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G5 data-first difference                        | XS   | 1    | mid  | 34.98 us | 19.75 us | 0.565 [0.534..0.588] | 0.565            | -                 | -                  | 1.000 [0.987..1.008] | faster  |
| G5 data-first difference(range) (adopter shape) | XS   | 1    | mid  | 56.38 us | 40.40 us | 0.718 [0.713..0.724] | 0.718            | 1.29              | 1.30               | 1.001 [0.992..1.010] | faster  |
| G5 data-first differenceWith                    | XS   | 3    | low  | 32.33 us | 17.12 us | 0.525 [0.519..0.530] | 0.525            | 5.86              | 5.93               | 0.994 [0.985..1.009] | faster  |
| G5 data-first drop                              | XS   | 3    | low  | 6.60 us  | 6.67 us  | 1.006 [0.994..1.032] | 1.001            | 1.86              | 1.85               | 1.006 [1.000..1.043] | neutral |
| G5 data-first filter                            | XS   | 1    | high | 9.85 us  | 9.94 us  | 1.006 [1.000..1.013] | 1.004            | 2.90              | 2.90               | 1.011 [0.992..1.021] | neutral |
| G5 data-first find                              | XS   | 2    | mid  | 8.19 us  | 5.69 us  | 0.691 [0.685..0.713] | 0.690            | 3.82              | 3.80               | 0.995 [0.990..1.025] | faster  |
| G5 data-first first                             | XS   | 2    | mid  | 5.83 us  | 3.56 us  | 0.609 [0.600..0.636] | 0.612            | 2.85              | 2.88               | 1.000 [0.993..1.007] | faster  |
| G5 data-first flat                              | XS   | 2    | mid  | 16.35 us | 16.33 us | 1.000 [0.997..1.018] | 1.000            | 1.01              | 1.01               | 0.997 [0.990..1.018] | neutral |
| G5 data-first flatMap                           | XS   | 2    | mid  | 25.02 us | 25.00 us | 0.996 [0.993..1.015] | 0.995            | 1.13              | 1.13               | 0.998 [0.993..1.003] | neutral |
| G5 data-first forEach                           | XS   | 3    | low  | 5.92 us  | 5.92 us  | 0.993 [0.986..1.007] | 0.993            | 3.83              | 3.95               | 1.003 [1.000..1.014] | neutral |
| G5 data-first intersection                      | XS   | 3    | low  | 35.77 us | 21.10 us | 0.592 [0.573..0.595] | 0.591            | -                 | -                  | 1.003 [0.954..1.005] | faster  |
| G5 data-first intersectionWith                  | XS   | 3    | low  | 33.56 us | 17.33 us | 0.514 [0.512..0.519] | 0.515            | 4.20              | 4.28               | 1.000 [0.991..1.008] | faster  |
| G5 data-first map                               | XS   | 1    | high | 8.75 us  | 8.83 us  | 1.000 [0.991..1.020] | 1.005            | 2.89              | 2.88               | 1.005 [0.986..1.010] | neutral |
| G5 data-first mapWithFeedback                   | XS   | 3    | low  | 32.44 us | 18.29 us | 0.563 [0.559..0.568] | 0.561            | 5.51              | 5.58               | 0.994 [0.987..1.009] | faster  |
| G5 data-first mapWithFeedback (reads data)      | XS   | 3    | low  | 32.67 us | 20.02 us | 0.612 [0.609..0.622] | 0.616            | 6.02              | 6.18               | 1.002 [0.991..1.006] | faster  |
| G5 data-first take                              | XS   | 2    | mid  | 6.29 us  | 6.29 us  | 1.000 [1.000..1.007] | 0.999            | 1.83              | 1.83               | 1.000 [0.993..1.007] | neutral |
| G5 data-first unique                            | XS   | 1    | high | 34.94 us | 18.04 us | 0.514 [0.510..0.534] | 0.513            | 1.65              | 1.67               | 0.996 [0.983..1.017] | faster  |
| G5 data-first uniqueBy                          | XS   | 1    | high | 39.75 us | 25.31 us | 0.633 [0.627..0.648] | 0.636            | -                 | -                  | 1.000 [0.992..1.013] | faster  |
| G5 data-first uniqueBy (reads data)             | XS   | 1    | high | 41.35 us | 27.02 us | 0.652 [0.650..0.658] | 0.655            | -                 | -                  | 0.997 [0.974..1.011] | faster  |
| G5 data-first uniqueWith                        | XS   | 3    | low  | 35.19 us | 18.35 us | 0.524 [0.506..0.529] | 0.528            | 3.42              | 3.50               | 0.995 [0.967..1.006] | faster  |
| G5 data-first zip                               | XS   | 2    | mid  | 8.81 us  | 8.77 us  | 0.998 [0.991..1.005] | 1.000            | 2.66              | 2.68               | 0.998 [0.995..1.009] | neutral |
| G5 data-first zipWith                           | XS   | 3    | low  | 8.02 us  | 7.96 us  | 0.997 [0.990..1.005] | 0.997            | 3.12              | 3.17               | 0.997 [0.990..1.000] | neutral |
| G6 filter(fn)(data)                             | XS   | 1    | high | 16.50 us | 11.23 us | 0.688 [0.669..0.696] | 0.687            | 3.32              | 3.33               | 1.001 [0.985..1.015] | faster  |
| G6 map(fn)(data)                                | XS   | 1    | high | 14.21 us | 9.85 us  | 0.683 [0.680..0.704] | 0.683            | 4.21              | 4.20               | 1.001 [0.997..1.012] | faster  |
| G6 unique()(data)                               | XS   | 1    | high | 39.67 us | 18.06 us | 0.458 [0.450..0.463] | 0.455            | 1.64              | 1.66               | 1.005 [0.974..1.012] | faster  |
| G7 chunk data-first                             | XS   | 2    | mid  | 6.04 us  | 6.02 us  | 0.996 [0.980..1.000] | 0.994            | 0.20              | 0.20               | 1.000 [0.993..1.007] | neutral |
| G7 chunk data-last                              | XS   | 2    | mid  | 6.94 us  | 6.65 us  | 0.958 [0.952..0.970] | 0.956            | 0.22              | 0.23               | 1.006 [0.994..1.018] | neutral |
| G7 clamp data-first                             | XS   | 2    | mid  | 4.04 us  | 4.06 us  | 1.000 [1.000..1.021] | 1.002            | 3.73              | 3.80               | 1.005 [0.980..1.052] | neutral |
| G7 clamp data-last                              | XS   | 2    | mid  | 4.81 us  | 4.58 us  | 0.953 [0.932..0.965] | 0.955            | 4.23              | 4.36               | 1.004 [0.983..1.026] | neutral |
| G7 clone data-first                             | XS   | 2    | mid  | 86.58 us | 86.13 us | 0.990 [0.983..1.005] | 0.989            | 8.95              | 9.14               | 0.992 [0.985..1.005] | neutral |
| G7 clone data-last                              | XS   | 2    | mid  | 87.31 us | 87.52 us | 0.997 [0.983..1.040] | 0.998            | 9.19              | 9.38               | 1.003 [0.980..1.019] | neutral |
| G7 entries data-first                           | XS   | 1    | high | 7.46 us  | 7.40 us  | 0.997 [0.988..1.012] | 0.999            | 1.53              | 1.54               | 0.992 [0.983..1.006] | neutral |
| G7 entries data-last                            | XS   | 1    | high | 9.10 us  | 8.98 us  | 0.995 [0.973..1.000] | 0.993            | 1.82              | 1.81               | 1.000 [0.995..1.013] | neutral |
| G7 groupBy data-first                           | XS   | 1    | high | 29.33 us | 30.25 us | 1.021 [0.977..1.064] | 1.020            | 3.22              | 3.30               | 1.007 [0.967..1.023] | neutral |
| G7 groupBy data-last                            | XS   | 1    | high | 31.19 us | 30.88 us | 0.982 [0.976..1.032] | 0.984            | 3.34              | 3.41               | 1.003 [0.992..1.021] | neutral |
| G7 isDeepEqual data-first                       | XS   | 1    | high | 19.71 us | 19.90 us | 1.007 [0.996..1.011] | 1.006            | 1.73              | 1.75               | 1.002 [0.998..1.017] | neutral |
| G7 isDeepEqual data-last                        | XS   | 1    | high | 20.37 us | 20.27 us | 0.987 [0.971..0.996] | 0.987            | 1.78              | 1.81               | 1.010 [0.981..1.014] | neutral |
| G7 keys data-first                              | XS   | 2    | mid  | 6.27 us  | 6.31 us  | 1.007 [0.993..1.014] | 1.009            | 1.80              | 1.80               | 1.000 [0.993..1.020] | neutral |
| G7 keys data-last                               | XS   | 2    | mid  | 7.94 us  | 7.83 us  | 0.983 [0.959..1.000] | 0.981            | 2.17              | 2.16               | 0.997 [0.985..1.016] | neutral |
| G7 mapToObj data-first                          | XS   | 2    | mid  | 14.40 us | 14.54 us | 1.010 [0.972..1.044] | 1.010            | 0.59              | 0.59               | 0.982 [0.949..1.017] | neutral |
| G7 mapToObj data-last                           | XS   | 2    | mid  | 17.92 us | 17.04 us | 0.958 [0.940..0.962] | 0.960            | 0.70              | 0.71               | 0.996 [0.984..1.016] | neutral |
| G7 mapValues data-first                         | XS   | 1    | high | 16.33 us | 16.40 us | 1.003 [0.995..1.010] | 1.002            | 0.64              | 0.65               | 0.999 [0.989..1.018] | neutral |
| G7 mapValues data-last                          | XS   | 1    | high | 18.58 us | 17.69 us | 0.953 [0.936..0.963] | 0.953            | 0.70              | 0.70               | 0.996 [0.980..1.007] | faster  |
| G7 mergeDeep data-first                         | XS   | 2    | mid  | 25.87 us | 25.98 us | 1.006 [0.989..1.024] | 1.004            | 1.44              | 1.46               | 1.003 [0.984..1.006] | neutral |
| G7 mergeDeep data-last                          | XS   | 2    | mid  | 26.52 us | 26.15 us | 0.988 [0.976..1.005] | 0.989            | 1.45              | 1.46               | 0.999 [0.994..1.005] | neutral |
| G7 omit data-first                              | XS   | 1    | high | 25.21 us | 24.77 us | 0.997 [0.982..1.005] | 0.995            | 1.56              | 1.59               | 0.997 [0.989..1.007] | neutral |
| G7 omit data-last                               | XS   | 1    | high | 26.75 us | 26.33 us | 0.986 [0.981..0.995] | 0.985            | 1.34              | 1.50               | 0.996 [0.989..1.005] | neutral |
| G7 pick data-first                              | XS   | 1    | high | 14.19 us | 14.21 us | 1.001 [0.991..1.012] | 1.000            | 0.57              | 0.57               | 1.003 [0.991..1.009] | neutral |
| G7 pick data-last                               | XS   | 1    | high | 14.77 us | 14.44 us | 0.975 [0.969..0.997] | 0.973            | 0.58              | 0.57               | 1.000 [0.991..1.006] | neutral |
| G7 range data-first                             | XS   | 1    | mid  | 21.94 us | 21.92 us | 1.002 [0.994..1.006] | 1.002            | 0.94              | 0.94               | 1.006 [0.994..1.023] | neutral |
| G7 range data-last                              | XS   | 2    | mid  | 23.04 us | 22.69 us | 0.983 [0.957..0.993] | 0.982            | 0.97              | 0.97               | 0.999 [0.993..1.009] | neutral |

### Tier 1 (strict): Non-lazy pipes

G3: pipes with no lazy step, on scalars (x64: 64 inputs per measurement, x1: one) and on an array (XS-M; the M entry is tier 2). 20 scenarios; gm 0.760; range 0.397-1.001; faster / neutral / slower 16 / 4 / 0.

| scenario                      | size | tier | pop  | main      | branch    | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ----------------------------- | ---- | ---- | ---- | --------- | --------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G3 array sortBy+groupBy       | XS   | 1    | high | 49.31 us  | 44.48 us  | 0.900 [0.862..0.926] | 0.901            | 2.77              | 2.81               | 1.005 [0.953..1.014] | faster  |
| G3 array sortBy+groupBy       | S    | 1    | high | 46.35 us  | 45.04 us  | 0.972 [0.964..0.976] | 0.971            | 2.21              | 2.23               | 0.996 [0.988..1.007] | neutral |
| G3 array sortBy+groupBy       | C    | 1    | high | 444.81 us | 446.06 us | 1.001 [1.000..1.052] | 1.000            | 2.63              | 2.59               | 1.000 [0.998..1.005] | neutral |
| G3 array sortBy+groupBy       | M    | 2    | high | 105.00 us | 102.77 us | 0.994 [0.946..0.999] | 0.995            | 3.07              | 2.96               | 1.007 [0.974..1.015] | neutral |
| G3 object pick+omit+set+merge | x64  | 1    | high | 21.56 us  | 19.37 us  | 0.900 [0.874..0.921] | 0.896            | 38.92             | 39.47              | 0.995 [0.960..1.008] | faster  |
| G3 object pick+omit+set+merge | x1   | 1    | high | 375 ns    | 334 ns    | 0.891 [0.888..0.891] | 0.908 *          | 7.95              | 11.97              | 1.003 [0.970..1.012] | faster  |
| G3 pipe(x, add(1))            | x64  | 1    | high | 1.96 us   | 1.25 us   | 0.653 [0.625..0.682] | 0.656            | 4.28              | 4.40               | 0.990 [0.917..1.091] | faster  |
| G3 pipe(x, add(1))            | x1   | 1    | high | 42 ns     | 42 ns     | 1.000 [1.000..1.000] | 0.765 *          | 1.00              | 1.75               | 0.994 [0.956..1.021] | faster  |
| G3 pipe(x, arrow)             | x64  | 1    | high | 959 ns    | 500 ns    | 0.522 [0.500..0.545] | 0.512 *          | 1.71              | 1.74               | 0.995 [0.974..1.010] | faster  |
| G3 pipe(x, arrow)             | x1   | 1    | high | 42 ns     | 42 ns     | 1.000 [1.000..1.000] | 0.753 *          | 1.00              | 1.16               | 0.992 [0.962..1.074] | faster  |
| G3 pipe(x)                    | x64  | 1    | high | 292 ns    | 125 ns    | 0.428 [0.428..0.428] | 0.397 *          | 2.98              | 2.74               | 1.000 [0.926..1.080] | faster  |
| G3 pipe(x)                    | x1   | 1    | high | 42 ns     | 42 ns     | 1.000 [1.000..1.000] | 0.940 *          | 1.00              | 1.00               | 0.991 [0.940..1.003] | neutral |
| G3 scalar arrows depth-10     | x64  | 1    | high | 5.46 us   | 4.02 us   | 0.736 [0.722..0.746] | 0.720            | 13.77             | 13.75              | 1.007 [0.992..1.038] | faster  |
| G3 scalar arrows depth-10     | x1   | 1    | high | 125 ns    | 84 ns     | 0.672 [0.672..0.672] | 0.743 *          | 2.00              | 3.63               | 1.006 [0.985..1.019] | faster  |
| G3 scalar arrows depth-3      | x64  | 1    | high | 1.96 us   | 1.17 us   | 0.596 [0.584..0.596] | 0.588            | 4.00              | 4.09               | 1.010 [1.000..1.042] | faster  |
| G3 scalar arrows depth-3      | x1   | 1    | high | 42 ns     | 42 ns     | 1.000 [1.000..1.000] | 0.758 *          | 1.00              | 1.79               | 0.995 [0.951..1.013] | faster  |
| G3 scalar purry depth-10      | x64  | 1    | high | 15.06 us  | 11.73 us  | 0.781 [0.757..0.804] | 0.781            | 40.10             | 41.93              | 1.000 [0.957..1.030] | faster  |
| G3 scalar purry depth-10      | x1   | 1    | high | 250 ns    | 208 ns    | 0.832 [0.832..0.836] | 0.780 *          | 4.95              | 9.17               | 1.006 [0.960..1.011] | faster  |
| G3 scalar purry depth-3       | x64  | 1    | high | 4.79 us   | 3.38 us   | 0.704 [0.692..0.759] | 0.706            | 11.56             | 11.72              | 0.991 [0.915..1.026] | faster  |
| G3 scalar purry depth-3       | x1   | 1    | high | 84 ns     | 83 ns     | 0.988 [0.988..0.988] | 0.767 *          | 1.98              | 3.34               | 1.001 [0.922..1.034] | faster  |

### Tier 1 (strict): Short lazy pipes, 0-100 items

G1, G1b: pipes of 1-3 lazy steps (every lazy function alone and with a `map`) at XS, S and C. 151 scenarios; gm 0.469; range 0.273-0.882; faster / neutral / slower 151 / 0 / 0.

| scenario                      | size | tier | pop  | main      | branch    | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ----------------------------- | ---- | ---- | ---- | --------- | --------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G1 3-step middle reads data   | XS   | 1    | high | 68.27 us  | 47.02 us  | 0.689 [0.678..0.700] | 0.690            | 8.12              | 8.33               | 1.003 [0.993..1.011] | faster  |
| G1 3-step middle reads data   | S    | 1    | high | 66.12 us  | 35.52 us  | 0.540 [0.519..0.546] | 0.539            | 9.33              | 9.54               | 0.997 [0.978..1.017] | faster  |
| G1 3-step middle reads data   | C    | 1    | high | 352.38 us | 168.98 us | 0.480 [0.471..0.494] | 0.483            | 8.48              | 8.54               | 1.003 [0.975..1.027] | faster  |
| G1 drop+take                  | XS   | 3    | low  | 42.19 us  | 20.62 us  | 0.490 [0.485..0.495] | 0.494            | 5.93              | 6.05               | 1.000 [0.990..1.017] | faster  |
| G1 drop+take                  | S    | 3    | low  | 36.98 us  | 16.63 us  | 0.449 [0.439..0.457] | 0.447            | 15.98             | 15.94              | 1.024 [1.007..1.043] | faster  |
| G1 drop+take                  | C    | 3    | low  | 186.98 us | 75.73 us  | 0.405 [0.389..0.418] | 0.405            | 54.79             | 53.63              | 1.005 [0.982..1.015] | faster  |
| G1 filter+first               | XS   | 2    | mid  | 44.77 us  | 25.37 us  | 0.569 [0.556..0.579] | 0.571            | 16.09             | 16.40              | 1.008 [0.997..1.013] | faster  |
| G1 filter+first               | S    | 2    | mid  | 25.27 us  | 14.48 us  | 0.574 [0.566..0.577] | 0.573            | 19.88             | 20.53              | 1.002 [0.992..1.007] | faster  |
| G1 filter+first               | C    | 2    | mid  | 39.50 us  | 22.04 us  | 0.559 [0.543..0.561] | 0.555            | 16.51             | 17.12              | 1.002 [0.993..1.006] | faster  |
| G1 filter+map                 | XS   | 1    | high | 51.08 us  | 32.79 us  | 0.641 [0.631..0.654] | 0.640            | 7.06              | 7.26               | 1.003 [0.994..1.014] | faster  |
| G1 filter+map                 | S    | 1    | high | 51.63 us  | 24.67 us  | 0.477 [0.472..0.495] | 0.477            | 7.50              | 7.67               | 1.001 [0.975..1.025] | faster  |
| G1 filter+map                 | C    | 1    | high | 278.56 us | 113.94 us | 0.410 [0.395..0.416] | 0.411            | 6.84              | 6.88               | 0.996 [0.987..1.012] | faster  |
| G1 filter+map+take(10)        | C    | 2    | mid  | 65.06 us  | 30.52 us  | 0.469 [0.454..0.476] | 0.468            | 1.76              | 1.77               | 1.001 [0.996..1.014] | faster  |
| G1 find early hit             | C    | 2    | mid  | 11.96 us  | 5.25 us   | 0.438 [0.434..0.442] | 0.442            | 11.39             | 11.48              | 0.998 [0.996..1.021] | faster  |
| G1 find late hit              | C    | 2    | mid  | 162.83 us | 73.04 us  | 0.448 [0.444..0.453] | 0.448            | 10.66             | 10.82              | 0.998 [0.991..1.008] | faster  |
| G1 find miss                  | C    | 2    | mid  | 161.46 us | 71.02 us  | 0.439 [0.419..0.451] | 0.440            | 10.97             | 11.37              | 1.003 [0.947..1.012] | faster  |
| G1 flat+map                   | XS   | 2    | mid  | 57.23 us  | 26.90 us  | 0.471 [0.462..0.481] | 0.471            | 1.53              | 1.56               | 1.000 [0.993..1.004] | faster  |
| G1 flat+map                   | S    | 2    | mid  | 64.10 us  | 21.42 us  | 0.334 [0.324..0.342] | 0.331            | 1.61              | 1.63               | 1.001 [0.999..1.024] | faster  |
| G1 flat+map                   | C    | 2    | mid  | 354.92 us | 101.98 us | 0.287 [0.278..0.293] | 0.288            | 1.49              | 1.50               | 1.004 [0.991..1.014] | faster  |
| G1 flatMap+filter+map         | XS   | 2    | mid  | 115.10 us | 58.85 us  | 0.511 [0.508..0.518] | 0.510            | 2.22              | 2.25               | 1.001 [0.989..1.007] | faster  |
| G1 flatMap+filter+map         | S    | 2    | mid  | 201.37 us | 73.54 us  | 0.366 [0.358..0.372] | 0.366            | 2.27              | 2.29               | 1.001 [0.997..1.012] | faster  |
| G1 flatMap+filter+map         | C    | 2    | mid  | 1.22 ms   | 404.50 us | 0.331 [0.327..0.341] | 0.335            | 2.16              | 2.16               | 1.005 [0.984..1.013] | faster  |
| G1 map                        | XS   | 1    | high | 35.38 us  | 15.69 us  | 0.442 [0.438..0.449] | 0.440            | 6.80              | 6.78               | 1.005 [0.995..1.028] | faster  |
| G1 map                        | S    | 1    | high | 36.85 us  | 13.10 us  | 0.353 [0.348..0.360] | 0.350            | 4.93              | 4.83               | 1.001 [0.992..1.022] | faster  |
| G1 map                        | C    | 1    | high | 205.00 us | 68.35 us  | 0.332 [0.322..0.336] | 0.330            | 1.99              | 2.07               | 1.005 [1.000..1.016] | faster  |
| G1 map reading data           | XS   | 1    | high | 36.25 us  | 19.15 us  | 0.525 [0.520..0.552] | 0.526            | 7.70              | 7.85               | 1.009 [0.974..1.020] | faster  |
| G1 map reading data           | S    | 1    | high | 38.12 us  | 16.50 us  | 0.434 [0.423..0.439] | 0.431            | 8.67              | 8.67               | 0.997 [0.985..1.009] | faster  |
| G1 map reading data           | C    | 1    | high | 216.27 us | 90.31 us  | 0.417 [0.402..0.431] | 0.425            | 9.17              | 9.27               | 0.998 [0.977..1.013] | faster  |
| G1 map+filter+map             | XS   | 1    | high | 72.90 us  | 42.06 us  | 0.577 [0.563..0.591] | 0.578            | 7.54              | 7.74               | 1.003 [0.995..1.007] | faster  |
| G1 map+filter+map             | S    | 1    | high | 79.88 us  | 32.17 us  | 0.403 [0.388..0.406] | 0.402            | 7.66              | 7.72               | 1.003 [0.980..1.008] | faster  |
| G1 map+filter+map             | C    | 1    | high | 461.23 us | 159.40 us | 0.347 [0.338..0.353] | 0.348            | 6.08              | 6.05               | 1.002 [0.992..1.004] | faster  |
| G1 map+unique                 | XS   | 1    | high | 59.77 us  | 35.71 us  | 0.601 [0.584..0.612] | 0.603            | 2.83              | 2.89               | 0.998 [0.990..1.026] | faster  |
| G1 map+unique                 | S    | 1    | high | 79.69 us  | 42.73 us  | 0.534 [0.523..0.560] | 0.537            | 2.48              | 2.51               | 1.002 [0.986..1.007] | faster  |
| G1 map+unique                 | C    | 1    | high | 456.13 us | 249.10 us | 0.548 [0.537..0.559] | 0.548            | 2.25              | 2.27               | 1.003 [0.990..1.012] | faster  |
| G1 uniqueBy                   | XS   | 1    | high | 43.87 us  | 24.04 us  | 0.546 [0.539..0.557] | 0.545            | 2.17              | 2.22               | 1.004 [0.980..1.011] | faster  |
| G1 uniqueBy                   | S    | 1    | high | 60.31 us  | 33.81 us  | 0.558 [0.544..0.583] | 0.557            | 1.79              | 1.80               | 0.997 [0.987..1.004] | faster  |
| G1 uniqueBy                   | C    | 1    | high | 344.63 us | 214.02 us | 0.617 [0.612..0.623] | 0.616            | 1.89              | 1.90               | 0.995 [0.990..1.007] | faster  |
| G1b pipe difference           | XS   | 2    | mid  | 39.08 us  | 18.90 us  | 0.486 [0.468..0.501] | 0.478            | -                 | -                  | 1.003 [0.996..1.013] | faster  |
| G1b pipe difference           | S    | 2    | mid  | 40.10 us  | 17.54 us  | 0.439 [0.432..0.459] | 0.437            | -                 | -                  | 1.002 [0.997..1.021] | faster  |
| G1b pipe difference           | C    | 2    | mid  | 239.56 us | 106.35 us | 0.446 [0.434..0.450] | 0.446            | -                 | -                  | 1.002 [0.991..1.011] | faster  |
| G1b pipe difference+map       | XS   | 2    | mid  | 54.02 us  | 34.06 us  | 0.633 [0.607..0.641] | 0.629            | -                 | -                  | 0.996 [0.987..1.009] | faster  |
| G1b pipe difference+map       | S    | 2    | mid  | 62.44 us  | 27.83 us  | 0.443 [0.430..0.469] | 0.450            | -                 | -                  | 1.001 [0.974..1.051] | faster  |
| G1b pipe difference+map       | C    | 2    | mid  | 361.35 us | 153.94 us | 0.426 [0.423..0.433] | 0.429            | -                 | -                  | 1.003 [0.991..1.024] | faster  |
| G1b pipe differenceWith       | XS   | 3    | low  | 35.85 us  | 15.88 us  | 0.441 [0.433..0.448] | 0.440            | 5.37              | 5.46               | 0.997 [0.979..1.019] | faster  |
| G1b pipe differenceWith       | S    | 3    | low  | 44.17 us  | 21.77 us  | 0.494 [0.485..0.536] | 0.495            | 6.25              | 6.04               | 0.998 [0.991..1.007] | faster  |
| G1b pipe differenceWith       | C    | 3    | low  | 440.25 us | 297.75 us | 0.677 [0.667..0.682] | 0.682            | 4.21              | 4.21               | 1.003 [0.986..1.012] | faster  |
| G1b pipe differenceWith+map   | XS   | 3    | low  | 48.73 us  | 29.81 us  | 0.611 [0.601..0.620] | 0.611            | 7.38              | 7.58               | 1.000 [0.976..1.028] | faster  |
| G1b pipe differenceWith+map   | S    | 3    | low  | 63.73 us  | 31.98 us  | 0.501 [0.489..0.523] | 0.503            | 7.08              | 7.17               | 1.002 [0.979..1.011] | faster  |
| G1b pipe differenceWith+map   | C    | 3    | low  | 556.40 us | 357.31 us | 0.642 [0.627..0.654] | 0.640            | 7.75              | 7.70               | 1.004 [0.996..1.029] | faster  |
| G1b pipe drop                 | XS   | 3    | low  | 33.31 us  | 13.08 us  | 0.393 [0.382..0.401] | 0.390            | 3.67              | 3.69               | 1.004 [0.984..1.016] | faster  |
| G1b pipe drop                 | S    | 3    | low  | 33.17 us  | 11.62 us  | 0.351 [0.344..0.359] | 0.349            | 10.81             | 10.70              | 0.993 [0.985..1.003] | faster  |
| G1b pipe drop                 | C    | 3    | low  | 177.42 us | 59.19 us  | 0.335 [0.331..0.338] | 0.334            | 31.70             | 31.87              | 1.006 [0.995..1.046] | faster  |
| G1b pipe drop+map             | XS   | 3    | low  | 51.81 us  | 27.42 us  | 0.527 [0.516..0.551] | 0.526            | 5.71              | 5.81               | 1.004 [0.984..1.030] | faster  |
| G1b pipe drop+map             | S    | 3    | low  | 50.33 us  | 20.69 us  | 0.414 [0.400..0.422] | 0.414            | 8.76              | 8.78               | 0.996 [0.980..1.024] | faster  |
| G1b pipe drop+map             | C    | 3    | low  | 272.63 us | 99.94 us  | 0.366 [0.357..0.375] | 0.370            | 9.86              | 9.94               | 0.994 [0.981..1.021] | faster  |
| G1b pipe filter               | XS   | 1    | high | 36.85 us  | 17.73 us  | 0.482 [0.473..0.489] | 0.480            | 5.44              | 5.47               | 1.000 [0.989..1.009] | faster  |
| G1b pipe filter               | S    | 1    | high | 36.83 us  | 15.67 us  | 0.424 [0.420..0.433] | 0.423            | 7.67              | 7.66               | 1.004 [0.993..1.019] | faster  |
| G1b pipe filter               | C    | 1    | high | 199.54 us | 75.19 us  | 0.376 [0.374..0.382] | 0.375            | 6.92              | 6.93               | 1.004 [0.998..1.028] | faster  |
| G1b pipe filter+map           | XS   | 1    | high | 50.90 us  | 32.50 us  | 0.640 [0.633..0.646] | 0.639            | 7.18              | 7.36               | 1.005 [0.998..1.015] | faster  |
| G1b pipe filter+map           | S    | 1    | high | 51.40 us  | 24.19 us  | 0.471 [0.467..0.485] | 0.471            | 7.99              | 8.03               | 0.999 [0.985..1.007] | faster  |
| G1b pipe filter+map           | C    | 1    | high | 279.31 us | 111.60 us | 0.403 [0.390..0.406] | 0.404            | 7.06              | 7.11               | 0.998 [0.980..1.022] | faster  |
| G1b pipe find                 | XS   | 2    | mid  | 35.29 us  | 14.98 us  | 0.425 [0.415..0.428] | 0.422            | 10.24             | 10.40              | 0.999 [0.974..1.012] | faster  |
| G1b pipe find                 | S    | 2    | mid  | 21.75 us  | 10.08 us  | 0.465 [0.459..0.476] | 0.463            | 13.81             | 14.13              | 0.996 [0.985..1.006] | faster  |
| G1b pipe find                 | C    | 2    | mid  | 88.04 us  | 39.29 us  | 0.446 [0.439..0.456] | 0.445            | 9.87              | 10.02              | 0.999 [0.986..1.008] | faster  |
| G1b pipe find+map             | XS   | 2    | mid  | 50.90 us  | 29.83 us  | 0.585 [0.582..0.593] | 0.583            | 10.79             | 10.96              | 0.997 [0.988..1.004] | faster  |
| G1b pipe find+map             | S    | 2    | mid  | 34.85 us  | 17.23 us  | 0.496 [0.492..0.503] | 0.494            | 7.05              | 7.00               | 1.000 [0.987..1.023] | faster  |
| G1b pipe find+map             | C    | 2    | mid  | 152.44 us | 64.81 us  | 0.427 [0.414..0.434] | 0.429            | 4.68              | 4.71               | 1.005 [0.993..1.013] | faster  |
| G1b pipe first                | XS   | 2    | mid  | 29.58 us  | 9.48 us   | 0.319 [0.314..0.325] | 0.317            | 7.57              | 7.59               | 1.000 [0.986..1.009] | faster  |
| G1b pipe first                | S    | 2    | mid  | 7.85 us   | 2.54 us   | 0.323 [0.317..0.326] | 0.324            | 7.55              | 7.67               | 0.995 [0.989..1.000] | faster  |
| G1b pipe first                | C    | 2    | mid  | 7.90 us   | 2.58 us   | 0.327 [0.316..0.330] | 0.329            | 7.31              | 7.52               | 0.992 [0.979..1.016] | faster  |
| G1b pipe first+map            | XS   | 2    | mid  | 43.71 us  | 22.90 us  | 0.525 [0.517..0.533] | 0.526            | 9.82              | 9.96               | 0.997 [0.992..1.004] | faster  |
| G1b pipe first+map            | S    | 2    | mid  | 12.08 us  | 6.06 us   | 0.500 [0.495..0.512] | 0.499            | 3.03              | 3.00               | 0.993 [0.986..1.003] | faster  |
| G1b pipe first+map            | C    | 2    | mid  | 12.15 us  | 6.04 us   | 0.500 [0.490..0.502] | 0.499            | 0.56              | 0.57               | 1.000 [0.993..1.014] | faster  |
| G1b pipe flat                 | XS   | 2    | mid  | 37.27 us  | 14.62 us  | 0.393 [0.388..0.395] | 0.391            | 0.91              | 0.92               | 0.996 [0.988..1.001] | faster  |
| G1b pipe flat                 | S    | 2    | mid  | 36.00 us  | 15.42 us  | 0.430 [0.423..0.435] | 0.427            | 1.43              | 1.44               | 0.996 [0.990..1.013] | faster  |
| G1b pipe flat                 | C    | 2    | mid  | 190.27 us | 83.00 us  | 0.437 [0.426..0.439] | 0.438            | 1.58              | 1.61               | 1.002 [0.994..1.009] | faster  |
| G1b pipe flat+map             | XS   | 2    | mid  | 56.65 us  | 26.33 us  | 0.464 [0.461..0.466] | 0.465            | 1.54              | 1.57               | 1.000 [0.993..1.004] | faster  |
| G1b pipe flat+map             | S    | 2    | mid  | 64.25 us  | 20.35 us  | 0.317 [0.313..0.325] | 0.316            | 1.60              | 1.62               | 1.001 [0.999..1.008] | faster  |
| G1b pipe flat+map             | C    | 2    | mid  | 355.10 us | 97.06 us  | 0.273 [0.269..0.276] | 0.275            | 1.54              | 1.56               | 1.003 [0.986..1.025] | faster  |
| G1b pipe flatMap              | XS   | 2    | mid  | 53.37 us  | 27.00 us  | 0.505 [0.501..0.509] | 0.504            | 1.23              | 1.24               | 0.998 [0.994..1.005] | faster  |
| G1b pipe flatMap              | S    | 2    | mid  | 82.54 us  | 38.65 us  | 0.468 [0.464..0.475] | 0.468            | 1.51              | 1.53               | 1.001 [0.994..1.016] | faster  |
| G1b pipe flatMap              | C    | 2    | mid  | 492.00 us | 229.48 us | 0.467 [0.461..0.475] | 0.466            | 1.55              | 1.56               | 0.999 [0.984..1.014] | faster  |
| G1b pipe flatMap+map          | XS   | 2    | mid  | 85.04 us  | 40.98 us  | 0.482 [0.472..0.485] | 0.482            | 1.70              | 1.72               | 0.999 [0.977..1.004] | faster  |
| G1b pipe flatMap+map          | S    | 2    | mid  | 149.17 us | 46.77 us  | 0.314 [0.305..0.321] | 0.315            | 1.56              | 1.56               | 1.001 [0.984..1.011] | faster  |
| G1b pipe flatMap+map          | C    | 2    | mid  | 908.50 us | 262.42 us | 0.289 [0.286..0.300] | 0.294            | 1.51              | 1.50               | 0.999 [0.970..1.003] | faster  |
| G1b pipe forEach              | XS   | 3    | low  | 36.06 us  | 16.77 us  | 0.465 [0.461..0.468] | 0.462            | 11.12             | 11.36              | 1.007 [0.994..1.018] | faster  |
| G1b pipe forEach              | S    | 3    | low  | 37.54 us  | 15.42 us  | 0.409 [0.406..0.421] | 0.407            | 13.40             | 13.49              | 1.000 [0.991..1.015] | faster  |
| G1b pipe forEach              | C    | 3    | low  | 210.17 us | 80.94 us  | 0.387 [0.381..0.393] | 0.387            | 11.86             | 12.08              | 1.000 [0.989..1.006] | faster  |
| G1b pipe forEach+map          | XS   | 3    | low  | 53.63 us  | 32.06 us  | 0.602 [0.595..0.607] | 0.601            | 11.05             | 11.17              | 1.005 [0.986..1.014] | faster  |
| G1b pipe forEach+map          | S    | 3    | low  | 58.60 us  | 26.08 us  | 0.446 [0.431..0.454] | 0.444            | 9.38              | 9.45               | 1.010 [0.986..1.018] | faster  |
| G1b pipe forEach+map          | C    | 3    | low  | 339.46 us | 132.04 us | 0.389 [0.384..0.403] | 0.392            | 7.89              | 8.01               | 0.992 [0.980..1.004] | faster  |
| G1b pipe intersection         | XS   | 3    | low  | 39.92 us  | 20.87 us  | 0.525 [0.517..0.528] | 0.523            | -                 | -                  | 0.997 [0.990..1.024] | faster  |
| G1b pipe intersection         | S    | 3    | low  | 25.23 us  | 13.29 us  | 0.527 [0.516..0.535] | 0.525            | -                 | -                  | 1.002 [0.987..1.007] | faster  |
| G1b pipe intersection         | C    | 3    | low  | 193.08 us | 101.23 us | 0.523 [0.513..0.529] | 0.524            | -                 | -                  | 1.008 [1.003..1.028] | faster  |
| G1b pipe intersection+map     | XS   | 3    | low  | 58.83 us  | 35.65 us  | 0.606 [0.599..0.616] | 0.606            | -                 | -                  | 0.996 [0.988..1.003] | faster  |
| G1b pipe intersection+map     | S    | 3    | low  | 31.40 us  | 18.54 us  | 0.588 [0.578..0.603] | 0.589            | -                 | -                  | 0.999 [0.987..1.007] | faster  |
| G1b pipe intersection+map     | C    | 3    | low  | 209.58 us | 118.77 us | 0.565 [0.558..0.582] | 0.568            | -                 | -                  | 1.000 [0.983..1.015] | faster  |
| G1b pipe intersectionWith     | XS   | 3    | low  | 37.44 us  | 16.08 us  | 0.435 [0.414..0.437] | 0.433            | 3.94              | 4.01               | 0.994 [0.975..1.022] | faster  |
| G1b pipe intersectionWith     | S    | 3    | low  | 39.69 us  | 21.73 us  | 0.545 [0.539..0.554] | 0.549            | 7.09              | 7.34               | 1.009 [0.994..1.021] | faster  |
| G1b pipe intersectionWith     | C    | 3    | low  | 398.58 us | 290.88 us | 0.729 [0.722..0.837] | 0.733            | 9.30              | 9.06               | 0.995 [0.986..1.043] | faster  |
| G1b pipe intersectionWith+map | XS   | 3    | low  | 54.15 us  | 31.04 us  | 0.575 [0.563..0.588] | 0.574            | 6.27              | 6.40               | 0.997 [0.989..1.011] | faster  |
| G1b pipe intersectionWith+map | S    | 3    | low  | 45.94 us  | 28.21 us  | 0.622 [0.606..0.638] | 0.618            | 8.35              | 8.47               | 0.994 [0.978..1.018] | faster  |
| G1b pipe intersectionWith+map | C    | 3    | low  | 417.75 us | 323.58 us | 0.769 [0.713..0.790] | 0.762            | 9.66              | 9.60               | 0.998 [0.917..1.024] | faster  |
| G1b pipe map                  | XS   | 1    | high | 36.02 us  | 16.19 us  | 0.450 [0.444..0.457] | 0.447            | 5.65              | 5.68               | 0.999 [0.977..1.016] | faster  |
| G1b pipe map                  | S    | 1    | high | 37.04 us  | 13.17 us  | 0.357 [0.354..0.364] | 0.355            | 4.95              | 4.95               | 1.002 [0.995..1.011] | faster  |
| G1b pipe map                  | C    | 1    | high | 204.81 us | 68.75 us  | 0.334 [0.331..0.337] | 0.332            | 4.63              | 4.66               | 1.004 [0.993..1.017] | faster  |
| G1b pipe map+map              | XS   | 1    | high | 53.08 us  | 30.85 us  | 0.579 [0.577..0.584] | 0.579            | 7.23              | 7.35               | 0.996 [0.987..1.008] | faster  |
| G1b pipe map+map              | S    | 1    | high | 58.23 us  | 23.25 us  | 0.399 [0.395..0.406] | 0.398            | 5.12              | 5.23               | 1.001 [0.996..1.045] | faster  |
| G1b pipe map+map              | C    | 1    | high | 332.54 us | 115.04 us | 0.346 [0.339..0.354] | 0.350            | 4.66              | 4.72               | 0.996 [0.959..1.021] | faster  |
| G1b pipe mapWithFeedback      | XS   | 3    | low  | 35.88 us  | 17.31 us  | 0.481 [0.466..0.495] | 0.481            | 5.40              | 5.46               | 1.007 [1.000..1.021] | faster  |
| G1b pipe mapWithFeedback      | S    | 3    | low  | 37.90 us  | 15.58 us  | 0.412 [0.407..0.418] | 0.409            | 6.46              | 6.79               | 0.993 [0.984..1.001] | faster  |
| G1b pipe mapWithFeedback      | C    | 3    | low  | 211.85 us | 82.27 us  | 0.387 [0.382..0.396] | 0.389            | 6.18              | 6.35               | 1.000 [0.984..1.020] | faster  |
| G1b pipe mapWithFeedback+map  | XS   | 3    | low  | 54.69 us  | 32.92 us  | 0.600 [0.598..0.609] | 0.601            | 7.17              | 7.35               | 0.998 [0.986..1.011] | faster  |
| G1b pipe mapWithFeedback+map  | S    | 3    | low  | 59.29 us  | 25.77 us  | 0.434 [0.424..0.445] | 0.434            | 7.31              | 7.63               | 1.005 [0.977..1.012] | faster  |
| G1b pipe mapWithFeedback+map  | C    | 3    | low  | 331.85 us | 129.27 us | 0.390 [0.383..0.399] | 0.390            | 7.44              | 7.51               | 1.013 [0.981..1.026] | faster  |
| G1b pipe take                 | XS   | 2    | mid  | 28.04 us  | 10.48 us  | 0.374 [0.371..0.376] | 0.371            | 3.05              | 3.05               | 0.999 [0.982..1.009] | faster  |
| G1b pipe take                 | S    | 2    | mid  | 20.58 us  | 7.38 us   | 0.359 [0.352..0.366] | 0.356            | 7.12              | 7.02               | 1.001 [0.994..1.008] | faster  |
| G1b pipe take                 | C    | 2    | mid  | 98.75 us  | 33.79 us  | 0.343 [0.335..0.352] | 0.343            | 24.46             | 24.07              | 0.998 [0.987..1.023] | faster  |
| G1b pipe take+map             | XS   | 2    | mid  | 40.94 us  | 22.35 us  | 0.547 [0.542..0.559] | 0.550            | 5.80              | 5.90               | 0.998 [0.991..1.009] | faster  |
| G1b pipe take+map             | S    | 2    | mid  | 32.96 us  | 14.48 us  | 0.439 [0.433..0.453] | 0.436            | 7.84              | 7.74               | 1.002 [0.992..1.008] | faster  |
| G1b pipe take+map             | C    | 2    | mid  | 164.40 us | 60.15 us  | 0.365 [0.362..0.374] | 0.367            | 9.19              | 9.34               | 1.013 [0.989..1.034] | faster  |
| G1b pipe unique               | XS   | 1    | high | 39.63 us  | 18.04 us  | 0.453 [0.449..0.464] | 0.451            | 1.67              | 1.70               | 1.000 [0.982..1.015] | faster  |
| G1b pipe unique               | S    | 1    | high | 54.46 us  | 27.60 us  | 0.502 [0.493..0.533] | 0.500            | 1.88              | 1.90               | 1.018 [0.967..1.024] | faster  |
| G1b pipe unique               | C    | 1    | high | 329.40 us | 184.90 us | 0.561 [0.550..0.570] | 0.562            | 1.78              | 1.86               | 1.002 [0.980..1.014] | faster  |
| G1b pipe unique+map           | XS   | 1    | high | 58.98 us  | 34.60 us  | 0.590 [0.578..0.610] | 0.589            | 3.01              | 3.06               | 1.003 [0.991..1.016] | faster  |
| G1b pipe unique+map           | S    | 1    | high | 74.52 us  | 39.38 us  | 0.531 [0.516..0.554] | 0.534            | 2.50              | 2.53               | 1.005 [0.978..1.026] | faster  |
| G1b pipe unique+map           | C    | 1    | high | 415.58 us | 234.65 us | 0.563 [0.550..0.579] | 0.562            | 2.22              | 2.29               | 1.005 [0.986..1.036] | faster  |
| G1b pipe uniqueBy             | XS   | 1    | high | 44.12 us  | 24.00 us  | 0.547 [0.539..0.561] | 0.546            | -                 | -                  | 1.006 [0.983..1.010] | faster  |
| G1b pipe uniqueBy             | S    | 1    | high | 60.62 us  | 34.35 us  | 0.567 [0.547..0.574] | 0.565            | -                 | -                  | 1.004 [0.993..1.012] | faster  |
| G1b pipe uniqueBy             | C    | 1    | high | 343.02 us | 212.23 us | 0.616 [0.609..0.624] | 0.615            | -                 | -                  | 1.006 [0.998..1.021] | faster  |
| G1b pipe uniqueBy+map         | XS   | 1    | high | 63.35 us  | 41.65 us  | 0.658 [0.655..0.667] | 0.656            | -                 | -                  | 1.005 [0.974..1.011] | faster  |
| G1b pipe uniqueBy+map         | S    | 1    | high | 79.92 us  | 45.56 us  | 0.572 [0.567..0.582] | 0.573            | -                 | -                  | 1.002 [0.996..1.027] | faster  |
| G1b pipe uniqueBy+map         | C    | 1    | high | 436.63 us | 255.40 us | 0.586 [0.581..0.605] | 0.587            | -                 | -                  | 1.000 [0.996..1.017] | faster  |
| G1b pipe uniqueWith           | XS   | 3    | low  | 38.92 us  | 17.98 us  | 0.461 [0.457..0.465] | 0.463            | 3.43              | 3.51               | 0.998 [0.987..1.016] | faster  |
| G1b pipe uniqueWith           | S    | 3    | low  | 71.08 us  | 46.87 us  | 0.661 [0.638..0.673] | 0.660            | 2.73              | 2.77               | 0.994 [0.979..1.030] | faster  |
| G1b pipe uniqueWith           | C    | 3    | low  | 1.31 ms   | 1.16 ms   | 0.881 [0.834..0.898] | 0.882            | 2.23              | 2.28               | 1.000 [0.979..1.065] | faster  |
| G1b pipe uniqueWith+map       | XS   | 3    | low  | 57.00 us  | 34.65 us  | 0.608 [0.602..0.618] | 0.608            | 5.30              | 5.41               | 0.999 [0.993..1.003] | faster  |
| G1b pipe uniqueWith+map       | S    | 3    | low  | 89.00 us  | 57.56 us  | 0.649 [0.631..0.663] | 0.650            | 3.22              | 3.26               | 1.002 [0.980..1.015] | faster  |
| G1b pipe uniqueWith+map       | C    | 3    | low  | 1.40 ms   | 1.23 ms   | 0.882 [0.861..0.895] | 0.880            | 2.55              | 2.52               | 0.989 [0.962..1.001] | faster  |
| G1b pipe zip                  | XS   | 2    | mid  | 33.77 us  | 13.54 us  | 0.399 [0.396..0.405] | 0.397            | 3.99              | 4.01               | 0.997 [0.983..1.012] | faster  |
| G1b pipe zip                  | S    | 2    | mid  | 36.15 us  | 13.63 us  | 0.377 [0.369..0.379] | 0.376            | 4.31              | 4.25               | 1.001 [0.982..1.007] | faster  |
| G1b pipe zip                  | C    | 2    | mid  | 203.96 us | 74.85 us  | 0.366 [0.362..0.370] | 0.366            | 4.64              | 4.46               | 0.999 [0.988..1.015] | faster  |
| G1b pipe zip+map              | XS   | 2    | mid  | 51.54 us  | 28.52 us  | 0.553 [0.546..0.561] | 0.556            | 6.25              | 6.33               | 1.002 [0.996..1.027] | faster  |
| G1b pipe zip+map              | S    | 2    | mid  | 57.13 us  | 24.00 us  | 0.420 [0.409..0.426] | 0.419            | 5.16              | 5.13               | 1.005 [0.988..1.031] | faster  |
| G1b pipe zip+map              | C    | 2    | mid  | 328.52 us | 123.87 us | 0.378 [0.370..0.386] | 0.378            | 4.89              | 4.82               | 0.999 [0.981..1.015] | faster  |
| G1b pipe zipWith              | XS   | 3    | low  | 35.02 us  | 16.23 us  | 0.463 [0.458..0.468] | 0.461            | 2.46              | 2.49               | 1.010 [0.981..1.023] | faster  |
| G1b pipe zipWith              | S    | 3    | low  | 41.27 us  | 17.79 us  | 0.433 [0.426..0.445] | 0.432            | 5.06              | 5.06               | 1.001 [0.998..1.005] | faster  |
| G1b pipe zipWith              | C    | 3    | low  | 234.75 us | 96.40 us  | 0.413 [0.398..0.417] | 0.418            | 7.13              | 7.19               | 1.000 [0.991..1.005] | faster  |
| G1b pipe zipWith+map          | XS   | 3    | low  | 52.37 us  | 30.31 us  | 0.579 [0.570..0.589] | 0.580            | 2.66              | 2.70               | 1.004 [0.987..1.022] | faster  |
| G1b pipe zipWith+map          | S    | 3    | low  | 63.29 us  | 28.27 us  | 0.446 [0.443..0.456] | 0.446            | 2.62              | 2.64               | 1.011 [0.998..1.033] | faster  |
| G1b pipe zipWith+map          | C    | 3    | low  | 357.06 us | 145.96 us | 0.411 [0.399..0.412] | 0.413            | 2.87              | 2.88               | 1.002 [0.996..1.017] | faster  |

### Tier 1 (strict): Interleaved pipes, 0-100 items

G10 and G2 deep-8 mixed: runs of 1-3 lazy steps between non-lazy steps (`sortBy`, `groupBy`, `prop`, `entries`, arrows), XS-C. 16 scenarios; gm 0.582; range 0.400-0.780; faster / neutral / slower 16 / 0 / 0.

| scenario                                                                                    | size | tier | pop  | main      | branch    | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ------------------------------------------------------------------------------------------- | ---- | ---- | ---- | --------- | --------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G2 deep-8 mixed                                                                             | S    | 1    | high | 142.15 us | 73.56 us  | 0.517 [0.509..0.525] | 0.521            | 4.84              | 4.89               | 0.994 [0.985..1.008] | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | XS   | 1    | high | 227.25 us | 144.60 us | 0.638 [0.619..0.646] | 0.646            | 6.90              | 7.04               | 1.001 [0.978..1.005] | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | S    | 1    | high | 238.35 us | 142.85 us | 0.598 [0.592..0.617] | 0.597            | 4.91              | 4.90               | 0.996 [0.983..1.005] | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | 1    | high | 1.49 ms   | 1.00 ms   | 0.677 [0.673..0.691] | 0.680            | 3.78              | 3.78               | 1.001 [0.994..1.007] | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | XS   | 1    | high | 126.04 us | 85.50 us  | 0.679 [0.671..0.693] | 0.681            | 4.32              | 4.42               | 0.998 [0.987..1.004] | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | S    | 1    | high | 100.04 us | 58.35 us  | 0.585 [0.574..0.591] | 0.592            | 3.50              | 3.56               | 0.998 [0.973..1.013] | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | 1    | high | 381.75 us | 202.48 us | 0.530 [0.521..0.543] | 0.534            | 4.21              | 4.21               | 1.003 [0.987..1.015] | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | XS   | 1    | high | 183.79 us | 143.31 us | 0.780 [0.768..0.802] | 0.785            | 4.89              | 4.94               | 0.998 [0.981..1.005] | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | S    | 1    | high | 154.13 us | 119.75 us | 0.771 [0.758..0.794] | 0.771            | 5.06              | 5.05               | 0.991 [0.976..1.002] | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | 1    | high | 667.13 us | 492.71 us | 0.734 [0.714..0.760] | 0.735            | 8.77              | 8.65               | 0.992 [0.982..1.007] | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | XS   | 1    | high | 214.96 us | 128.33 us | 0.598 [0.592..0.606] | 0.602            | 2.77              | 2.82               | 0.998 [0.981..1.005] | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | S    | 1    | high | 291.02 us | 150.56 us | 0.516 [0.503..0.524] | 0.520            | 2.10              | 2.12               | 1.003 [0.971..1.015] | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | 1    | high | 962.35 us | 478.88 us | 0.495 [0.485..0.507] | 0.498            | 1.71              | 1.73               | 0.999 [0.988..1.005] | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | XS   | 1    | high | 124.94 us | 69.40 us  | 0.556 [0.549..0.563] | 0.559            | 6.65              | 6.78               | 0.996 [0.990..1.006] | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | S    | 1    | high | 119.52 us | 49.27 us  | 0.409 [0.398..0.417] | 0.410            | 7.66              | 7.78               | 0.995 [0.985..1.035] | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | 1    | high | 154.04 us | 61.42 us  | 0.400 [0.391..0.404] | 0.402            | 2.72              | 2.71               | 0.996 [0.980..1.031] | faster  |

### Tier 2 (lenient): Lazy and interleaved pipes, 1,000 items

G1, G1b, G10 and the two G2 mixed pipes at M (1,000 items). 60 scenarios; gm 0.469; range 0.276-0.981; faster / neutral / slower 58 / 2 / 0.

| scenario                                                                                    | size | tier | pop  | main      | branch    | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ------------------------------------------------------------------------------------------- | ---- | ---- | ---- | --------- | --------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G1 3-step middle reads data                                                                 | M    | 2    | high | 53.90 us  | 25.79 us  | 0.479 [0.463..0.498] | 0.478            | 6.19              | 6.41               | 0.988 [0.978..1.032] | faster  |
| G1 drop+take                                                                                | M    | 3    | low  | 28.38 us  | 10.98 us  | 0.386 [0.371..0.392] | 0.382            | 131.20            | 109.42             | 1.002 [0.987..1.027] | faster  |
| G1 filter+first                                                                             | M    | 3    | mid  | 1.31 us   | 709 ns    | 0.540 [0.531..0.549] | 0.533 *          | 16.87             | 17.70              | 1.000 [0.992..1.039] | faster  |
| G1 filter+map                                                                               | M    | 2    | high | 42.42 us  | 17.50 us  | 0.412 [0.408..0.418] | 0.407            | 5.32              | 5.54               | 1.000 [0.987..1.028] | faster  |
| G1 filter+map+take(10)                                                                      | M    | 3    | mid  | 1.04 us   | 500 ns    | 0.480 [0.480..0.480] | 0.469 *          | 0.15              | 0.16               | 1.009 [1.004..1.017] | faster  |
| G1 find early hit                                                                           | M    | 3    | mid  | 667 ns    | 333 ns    | 0.499 [0.438..0.499] | 0.462 *          | 7.93              | 9.49               | 1.000 [0.995..1.040] | faster  |
| G1 find late hit                                                                            | M    | 3    | mid  | 24.23 us  | 10.83 us  | 0.448 [0.440..0.451] | 0.448            | 10.83             | 11.21              | 0.999 [0.988..1.005] | faster  |
| G1 find miss                                                                                | M    | 3    | mid  | 24.40 us  | 10.77 us  | 0.443 [0.436..0.444] | 0.439            | 17.46             | 18.57              | 0.999 [0.991..1.014] | faster  |
| G1 flat+map                                                                                 | M    | 3    | mid  | 54.50 us  | 15.65 us  | 0.288 [0.274..0.290] | 0.284            | 1.41              | 1.43               | 1.002 [0.993..1.008] | faster  |
| G1 flatMap+filter+map                                                                       | M    | 3    | mid  | 184.23 us | 63.38 us  | 0.345 [0.336..0.350] | 0.342            | 2.03              | 2.04               | 1.003 [0.997..1.004] | faster  |
| G1 map                                                                                      | M    | 2    | high | 31.96 us  | 10.73 us  | 0.337 [0.330..0.339] | 0.331            | 4.36              | 4.30               | 1.001 [0.993..1.004] | faster  |
| G1 map reading data                                                                         | M    | 2    | high | 33.44 us  | 15.08 us  | 0.451 [0.438..0.464] | 0.448            | 8.22              | 8.69               | 0.996 [0.968..1.009] | faster  |
| G1 map+filter+map                                                                           | M    | 2    | high | 70.10 us  | 24.10 us  | 0.344 [0.330..0.351] | 0.342            | 4.50              | 4.67               | 1.003 [0.990..1.010] | faster  |
| G1 map+unique                                                                               | M    | 2    | high | 69.35 us  | 37.46 us  | 0.541 [0.518..0.552] | 0.537            | 2.67              | 2.69               | 1.001 [0.994..1.011] | faster  |
| G1 uniqueBy                                                                                 | M    | 2    | high | 52.19 us  | 30.52 us  | 0.586 [0.573..0.602] | 0.585            | 2.26              | 2.27               | 0.996 [0.986..1.008] | faster  |
| G1b pipe difference                                                                         | M    | 3    | mid  | 32.27 us  | 12.88 us  | 0.401 [0.385..0.407] | 0.397            | -                 | -                  | 1.001 [0.985..1.004] | faster  |
| G1b pipe difference+map                                                                     | M    | 3    | mid  | 51.35 us  | 20.23 us  | 0.392 [0.388..0.397] | 0.387            | -                 | -                  | 1.006 [0.989..1.020] | faster  |
| G1b pipe differenceWith                                                                     | M    | 3    | low  | 69.85 us  | 48.12 us  | 0.689 [0.649..0.700] | 0.698            | 6.83              | 6.65               | 1.004 [0.967..1.058] | faster  |
| G1b pipe differenceWith+map                                                                 | M    | 3    | low  | 90.46 us  | 55.79 us  | 0.620 [0.596..0.687] | 0.621            | 6.70              | 6.95               | 1.001 [0.988..1.031] | faster  |
| G1b pipe drop                                                                               | M    | 3    | low  | 27.54 us  | 9.58 us   | 0.349 [0.336..0.360] | 0.341            | 76.00             | 63.92              | 1.004 [0.982..1.029] | faster  |
| G1b pipe drop+map                                                                           | M    | 3    | low  | 41.29 us  | 15.21 us  | 0.367 [0.361..0.375] | 0.364            | 10.39             | 10.35              | 1.000 [0.993..1.010] | faster  |
| G1b pipe filter                                                                             | M    | 2    | high | 31.21 us  | 11.71 us  | 0.375 [0.368..0.381] | 0.372            | 5.29              | 5.53               | 1.001 [0.988..1.015] | faster  |
| G1b pipe filter+map                                                                         | M    | 2    | high | 42.73 us  | 17.23 us  | 0.404 [0.397..0.407] | 0.399            | 5.66              | 5.91               | 1.000 [0.990..1.011] | faster  |
| G1b pipe find                                                                               | M    | 3    | mid  | 12.48 us  | 5.58 us   | 0.447 [0.440..0.453] | 0.448            | 19.12             | 19.48              | 1.002 [0.993..1.007] | faster  |
| G1b pipe find+map                                                                           | M    | 3    | mid  | 22.21 us  | 9.15 us   | 0.413 [0.410..0.424] | 0.411            | 4.58              | 4.54               | 0.996 [0.974..1.004] | faster  |
| G1b pipe first                                                                              | M    | 3    | mid  | 167 ns    | 83 ns     | 0.497 [0.497..0.500] | 0.419 *          | 1.98              | 2.64               | 0.998 [0.962..1.047] | faster  |
| G1b pipe first+map                                                                          | M    | 3    | mid  | 209 ns    | 125 ns    | 0.598 [0.598..0.598] | 0.565 *          | 0.08              | 0.07               | 0.994 [0.986..1.000] | faster  |
| G1b pipe flat                                                                               | M    | 3    | mid  | 29.35 us  | 13.04 us  | 0.442 [0.441..0.451] | 0.438            | 1.59              | 1.62               | 1.004 [0.990..1.018] | faster  |
| G1b pipe flat+map                                                                           | M    | 3    | mid  | 54.40 us  | 15.02 us  | 0.276 [0.271..0.281] | 0.272            | 1.46              | 1.47               | 1.005 [0.989..1.010] | faster  |
| G1b pipe flatMap                                                                            | M    | 3    | mid  | 75.85 us  | 35.10 us  | 0.462 [0.459..0.469] | 0.461            | 1.53              | 1.55               | 1.007 [0.976..1.014] | faster  |
| G1b pipe flatMap+map                                                                        | M    | 3    | mid  | 136.50 us | 40.54 us  | 0.296 [0.294..0.301] | 0.291            | 1.48              | 1.48               | 1.007 [0.981..1.019] | faster  |
| G1b pipe forEach                                                                            | M    | 3    | low  | 32.56 us  | 12.73 us  | 0.391 [0.384..0.402] | 0.384            | 14.51             | 14.77              | 0.998 [0.979..1.009] | faster  |
| G1b pipe forEach+map                                                                        | M    | 3    | low  | 52.50 us  | 20.37 us  | 0.391 [0.384..0.396] | 0.386            | 8.22              | 8.26               | 0.995 [0.985..1.005] | faster  |
| G1b pipe intersection                                                                       | M    | 3    | low  | 22.90 us  | 10.21 us  | 0.447 [0.436..0.454] | 0.445            | -                 | -                  | 1.004 [0.982..1.024] | faster  |
| G1b pipe intersection+map                                                                   | M    | 3    | low  | 23.65 us  | 11.96 us  | 0.509 [0.495..0.518] | 0.511            | -                 | -                  | 1.003 [0.986..1.014] | faster  |
| G1b pipe intersectionWith                                                                   | M    | 3    | low  | 60.54 us  | 45.73 us  | 0.758 [0.693..0.777] | 0.765            | 9.78              | 9.92               | 1.002 [0.905..1.015] | faster  |
| G1b pipe intersectionWith+map                                                               | M    | 3    | low  | 60.73 us  | 49.06 us  | 0.809 [0.803..0.924] | 0.812            | 10.07             | 10.23              | 1.011 [0.986..1.106] | faster  |
| G1b pipe map                                                                                | M    | 2    | high | 32.10 us  | 10.69 us  | 0.335 [0.332..0.339] | 0.329            | 4.41              | 4.38               | 1.003 [0.987..1.012] | faster  |
| G1b pipe map+map                                                                            | M    | 2    | high | 51.29 us  | 17.67 us  | 0.346 [0.339..0.351] | 0.342            | 4.41              | 4.38               | 1.009 [0.978..1.013] | faster  |
| G1b pipe mapWithFeedback                                                                    | M    | 3    | low  | 32.83 us  | 12.73 us  | 0.389 [0.378..0.394] | 0.383            | 6.61              | 6.73               | 0.999 [0.992..1.003] | faster  |
| G1b pipe mapWithFeedback+map                                                                | M    | 3    | low  | 51.87 us  | 19.65 us  | 0.380 [0.374..0.386] | 0.374            | 6.94              | 6.95               | 1.005 [0.978..1.019] | faster  |
| G1b pipe take                                                                               | M    | 3    | mid  | 14.62 us  | 4.92 us   | 0.337 [0.331..0.340] | 0.328            | 58.77             | 47.09              | 1.001 [0.994..1.017] | faster  |
| G1b pipe take+map                                                                           | M    | 3    | mid  | 24.44 us  | 8.54 us   | 0.350 [0.340..0.352] | 0.347            | 9.29              | 9.21               | 1.007 [0.985..1.014] | faster  |
| G1b pipe unique                                                                             | M    | 2    | high | 51.88 us  | 26.94 us  | 0.521 [0.486..0.554] | 0.517            | 2.47              | 2.47               | 1.007 [0.974..1.018] | faster  |
| G1b pipe unique+map                                                                         | M    | 2    | high | 65.31 us  | 36.35 us  | 0.557 [0.546..0.568] | 0.552            | 2.99              | 3.00               | 1.003 [0.991..1.016] | faster  |
| G1b pipe uniqueBy                                                                           | M    | 2    | high | 52.40 us  | 30.25 us  | 0.584 [0.568..0.588] | 0.584            | -                 | -                  | 1.004 [0.994..1.006] | faster  |
| G1b pipe uniqueBy+map                                                                       | M    | 2    | high | 65.90 us  | 37.73 us  | 0.575 [0.565..0.581] | 0.572            | -                 | -                  | 1.007 [0.976..1.011] | faster  |
| G1b pipe uniqueWith                                                                         | M    | 3    | low  | 1.59 ms   | 1.55 ms   | 0.981 [0.965..1.002] | 0.979            | 2.67              | 2.67               | 0.999 [0.988..1.009] | neutral |
| G1b pipe uniqueWith+map                                                                     | M    | 3    | low  | 1.62 ms   | 1.57 ms   | 0.976 [0.958..0.987] | 0.979            | 2.62              | 2.65               | 0.992 [0.972..1.063] | neutral |
| G1b pipe zip                                                                                | M    | 3    | mid  | 31.81 us  | 11.52 us  | 0.365 [0.358..0.370] | 0.366            | 4.49              | 4.47               | 0.999 [0.981..1.012] | faster  |
| G1b pipe zip+map                                                                            | M    | 3    | mid  | 50.60 us  | 18.77 us  | 0.371 [0.357..0.377] | 0.368            | 4.44              | 4.46               | 1.002 [0.984..1.015] | faster  |
| G1b pipe zipWith                                                                            | M    | 3    | low  | 35.90 us  | 14.75 us  | 0.410 [0.396..0.417] | 0.407            | 6.87              | 7.04               | 1.002 [0.994..1.024] | faster  |
| G1b pipe zipWith+map                                                                        | M    | 3    | low  | 55.65 us  | 21.92 us  | 0.397 [0.391..0.398] | 0.394            | 2.61              | 2.63               | 1.005 [0.996..1.018] | faster  |
| G2 deep-15 mixed                                                                            | M    | 2    | high | 205.42 us | 116.73 us | 0.568 [0.562..0.574] | 0.561            | 2.08              | 2.06               | 1.002 [0.993..1.012] | faster  |
| G2 deep-8 mixed                                                                             | M    | 2    | high | 152.87 us | 95.04 us  | 0.622 [0.620..0.626] | 0.613            | 2.47              | 2.43               | 1.000 [0.991..1.010] | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | 2    | high | 241.35 us | 177.10 us | 0.730 [0.722..0.740] | 0.727            | 3.48              | 3.46               | 1.005 [0.989..1.009] | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | 2    | high | 96.77 us  | 71.10 us  | 0.735 [0.729..0.742] | 0.726            | 3.89              | 3.81               | 1.002 [0.994..1.014] | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | 2    | high | 96.04 us  | 70.31 us  | 0.734 [0.718..0.761] | 0.731            | 9.15              | 9.17               | 0.992 [0.990..1.014] | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | 2    | high | 138.60 us | 102.69 us | 0.739 [0.734..0.753] | 0.735            | 2.30              | 2.26               | 1.003 [0.999..1.030] | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | 2    | high | 2.50 us   | 1.00 us   | 0.400 [0.400..0.414] | 0.398            | 0.23              | 0.24               | 1.000 [0.984..1.000] | faster  |

### Tier 2 (lenient): Other iterables (Set, string, generator)

G4: `map` + `filter` and `unique` over a Set, a string and a generator, at S and M. 12 scenarios; gm 0.511; range 0.377-0.682; faster / neutral / slower 12 / 0 / 0.

| scenario                | size | tier | pop  | main     | branch   | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ----------------------- | ---- | ---- | ---- | -------- | -------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G4 generator map+filter | S    | 2    | high | 73.88 us | 38.29 us | 0.516 [0.510..0.536] | 0.520            | 0.94              | 0.96               | 0.990 [0.983..1.034] | faster  |
| G4 generator map+filter | M    | 2    | high | 62.54 us | 29.50 us | 0.475 [0.466..0.482] | 0.474            | 0.87              | 0.88               | 1.002 [0.988..1.008] | faster  |
| G4 generator unique     | S    | 2    | high | 68.60 us | 42.27 us | 0.617 [0.596..0.624] | 0.621            | 1.14              | 1.14               | 1.008 [0.995..1.024] | faster  |
| G4 generator unique     | M    | 2    | high | 40.35 us | 27.56 us | 0.682 [0.673..0.698] | 0.681            | 1.21              | 1.22               | 1.003 [0.996..1.006] | faster  |
| G4 Set map+filter       | S    | 2    | high | 59.15 us | 26.44 us | 0.450 [0.436..0.461] | 0.452            | 1.09              | 1.10               | 0.997 [0.971..1.020] | faster  |
| G4 Set map+filter       | M    | 2    | high | 51.83 us | 19.58 us | 0.377 [0.373..0.389] | 0.375            | 0.95              | 0.95               | 1.000 [0.982..1.011] | faster  |
| G4 Set unique           | S    | 2    | high | 57.23 us | 27.94 us | 0.487 [0.468..0.506] | 0.488            | 5.77              | 5.77               | 0.998 [0.957..1.032] | faster  |
| G4 Set unique           | M    | 2    | high | 51.46 us | 26.88 us | 0.524 [0.449..0.534] | 0.513            | 7.48              | 7.49               | 0.992 [0.915..1.098] | faster  |
| G4 string map+filter    | S    | 2    | high | 73.58 us | 41.02 us | 0.558 [0.543..0.577] | 0.558            | 0.99              | 0.99               | 1.019 [0.978..1.040] | faster  |
| G4 string map+filter    | M    | 2    | high | 66.31 us | 34.46 us | 0.522 [0.505..0.534] | 0.520            | 0.91              | 0.91               | 1.001 [0.992..1.025] | faster  |
| G4 string unique        | S    | 2    | high | 53.96 us | 26.48 us | 0.495 [0.458..0.504] | 0.496            | 1.11              | 1.12               | 1.012 [0.992..1.027] | faster  |
| G4 string unique        | M    | 2    | high | 29.98 us | 14.33 us | 0.488 [0.459..0.558] | 0.487            | 1.37              | 1.37               | 1.001 [0.962..1.034] | faster  |

### Tier 2 (lenient): Reused steps and `piped`

G6: `piped(...)` built per call and once at module level, and steps built once and reused across `pipe` calls, XS-M. 12 scenarios; gm 0.540; range 0.458-0.756; faster / neutral / slower 12 / 0 / 0.

| scenario                     | size | tier | pop  | main      | branch    | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ---------------------------- | ---- | ---- | ---- | --------- | --------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G6 module-level piped reused | XS   | 3    | low  | 38.00 us  | 28.46 us  | 0.751 [0.732..0.756] | 0.747            | 6.07              | 6.14               | 1.001 [0.990..1.014] | faster  |
| G6 module-level piped reused | S    | 3    | low  | 47.10 us  | 25.38 us  | 0.538 [0.530..0.561] | 0.534            | 8.02              | 7.97               | 1.003 [0.993..1.024] | faster  |
| G6 module-level piped reused | C    | 3    | low  | 270.00 us | 124.69 us | 0.463 [0.452..0.466] | 0.462            | 7.50              | 7.53               | 1.000 [0.991..1.017] | faster  |
| G6 module-level piped reused | M    | 3    | low  | 42.21 us  | 19.27 us  | 0.458 [0.447..0.466] | 0.454            | 5.79              | 6.02               | 1.002 [0.981..1.003] | faster  |
| G6 pipe with reused steps    | XS   | 2    | high | 36.17 us  | 27.19 us  | 0.756 [0.740..0.765] | 0.754            | 5.82              | 5.90               | 1.001 [0.987..1.012] | faster  |
| G6 pipe with reused steps    | S    | 2    | high | 46.73 us  | 25.19 us  | 0.538 [0.532..0.568] | 0.536            | 7.70              | 7.74               | 0.998 [0.982..1.012] | faster  |
| G6 pipe with reused steps    | C    | 2    | high | 269.54 us | 125.37 us | 0.466 [0.463..0.507] | 0.466            | 7.53              | 7.59               | 1.000 [0.993..1.014] | faster  |
| G6 pipe with reused steps    | M    | 2    | high | 41.83 us  | 19.12 us  | 0.458 [0.449..0.509] | 0.454            | 5.77              | 6.00               | 0.998 [0.988..1.005] | faster  |
| G6 piped(filter, map)(data)  | XS   | 3    | low  | 53.69 us  | 35.88 us  | 0.668 [0.664..0.673] | 0.666            | 7.59              | 7.73               | 1.007 [0.998..1.019] | faster  |
| G6 piped(filter, map)(data)  | S    | 3    | low  | 51.27 us  | 27.58 us  | 0.538 [0.522..0.559] | 0.532            | 8.58              | 8.55               | 1.000 [0.994..1.004] | faster  |
| G6 piped(filter, map)(data)  | C    | 3    | low  | 274.62 us | 126.65 us | 0.459 [0.454..0.467] | 0.459            | 7.62              | 7.69               | 1.004 [0.980..1.008] | faster  |
| G6 piped(filter, map)(data)  | M    | 3    | low  | 41.77 us  | 19.31 us  | 0.462 [0.455..0.505] | 0.458            | 5.77              | 6.00               | 0.999 [0.973..1.012] | faster  |

### Tier 2 (lenient): Data-first calls, 1,000 items

G5 and G6 at M and Mx64 (added row: these shapes are tier 2 by size). 32 scenarios; gm 0.784; range 0.393-1.025; faster / neutral / slower 15 / 17 / 0.

| scenario                                        | size | tier | pop  | main     | branch   | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ----------------------------------------------- | ---- | ---- | ---- | -------- | -------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G5 data-first difference                        | M    | 1    | mid  | 32.21 us | 12.94 us | 0.400 [0.395..0.405] | 0.395            | -                 | -                  | 1.001 [0.994..1.009] | faster  |
| G5 data-first difference(range) (adopter shape) | M    | 1    | mid  | 65.94 us | 42.85 us | 0.650 [0.642..0.655] | 0.648            | 1.49              | 1.49               | 1.002 [0.995..1.006] | faster  |
| G5 data-first differenceWith                    | M    | 3    | low  | 70.02 us | 46.94 us | 0.671 [0.643..0.690] | 0.690            | 6.80              | 6.60               | 0.994 [0.933..1.018] | faster  |
| G5 data-first drop                              | M    | 3    | low  | 146 ns   | 125 ns   | 1.000 [0.753..1.000] | 1.002 *          | 1.00              | 1.07               | 0.996 [0.968..1.031] | neutral |
| G5 data-first drop(3)                           | M    | 3    | low  | 250 ns   | 250 ns   | 1.000 [1.000..1.000] | 0.998 *          | 0.93              | 0.93               | 1.004 [0.999..1.010] | neutral |
| G5 data-first drop(3)                           | Mx64 | 3    | low  | 16.83 us | 16.83 us | 1.000 [0.985..1.005] | 1.000            | 1.10              | 1.10               | 1.000 [0.993..1.000] | neutral |
| G5 data-first filter                            | M    | 2    | high | 6.27 us  | 6.29 us  | 1.000 [1.000..1.007] | 1.003            | 2.83              | 2.91               | 1.000 [1.000..1.007] | neutral |
| G5 data-first find                              | M    | 3    | mid  | 1.96 us  | 1.79 us  | 0.988 [0.827..1.107] | 0.989            | 6.06              | 6.36               | 0.977 [0.827..1.209] | neutral |
| G5 data-first find early hit                    | M    | 3    | mid  | 125 ns   | 125 ns   | 1.000 [1.000..1.000] | 0.912 *          | 2.98              | 3.36               | 0.993 [0.981..1.021] | faster  |
| G5 data-first find early hit                    | Mx64 | 3    | mid  | 7.85 us  | 7.27 us  | 0.926 [0.838..0.931] | 0.926            | 3.32              | 3.41               | 0.995 [0.902..1.005] | faster  |
| G5 data-first first                             | M    | 3    | mid  | 42 ns    | 42 ns    | 1.000 [1.000..1.000] | 0.766 *          | 1.00              | 1.34               | 0.996 [0.976..1.033] | faster  |
| G5 data-first first                             | Mx64 | 3    | mid  | 1.58 us  | 1.00 us  | 0.627 [0.615..0.658] | 0.629            | 2.29              | 2.35               | 1.000 [0.975..1.001] | faster  |
| G5 data-first flat                              | M    | 3    | mid  | 8.35 us  | 8.23 us  | 1.003 [0.956..1.010] | 1.001            | 0.99              | 0.99               | 1.000 [0.966..1.071] | neutral |
| G5 data-first flatMap                           | M    | 3    | mid  | 23.10 us | 23.15 us | 0.992 [0.977..1.009] | 0.994            | 1.00              | 1.00               | 1.002 [0.987..1.007] | neutral |
| G5 data-first forEach                           | M    | 3    | low  | 4.46 us  | 4.48 us  | 1.000 [0.990..1.010] | 0.993            | 6.33              | 6.12               | 1.000 [0.982..1.009] | neutral |
| G5 data-first intersection                      | M    | 3    | low  | 23.23 us | 10.35 us | 0.444 [0.437..0.459] | 0.444            | -                 | -                  | 0.999 [0.977..1.005] | faster  |
| G5 data-first intersectionWith                  | M    | 3    | low  | 59.52 us | 45.58 us | 0.765 [0.672..0.786] | 0.773            | 9.63              | 9.81               | 1.004 [0.894..1.014] | faster  |
| G5 data-first map                               | M    | 2    | high | 5.50 us  | 5.50 us  | 1.000 [0.993..1.008] | 0.999            | 2.28              | 2.25               | 1.000 [0.993..1.008] | neutral |
| G5 data-first mapWithFeedback                   | M    | 3    | low  | 32.56 us | 12.75 us | 0.393 [0.387..0.395] | 0.387            | 6.80              | 6.91               | 1.001 [0.991..1.008] | faster  |
| G5 data-first mapWithFeedback (reads data)      | M    | 3    | low  | 33.35 us | 15.42 us | 0.464 [0.461..0.464] | 0.458            | 8.35              | 8.55               | 1.000 [0.997..1.027] | faster  |
| G5 data-first take                              | M    | 3    | mid  | 125 ns   | 125 ns   | 1.000 [1.000..1.000] | 1.008 *          | 1.49              | 1.11               | 0.998 [0.992..1.007] | neutral |
| G5 data-first take(3)                           | M    | 3    | mid  | 42 ns    | 42 ns    | 1.000 [1.000..1.000] | 1.025 *          | 1.00              | 1.31               | 1.018 [0.986..1.081] | neutral |
| G5 data-first take(3)                           | Mx64 | 3    | mid  | 1.79 us  | 1.79 us  | 1.000 [1.000..1.023] | 1.008            | 1.62              | 1.63               | 1.000 [0.999..1.024] | neutral |
| G5 data-first unique                            | M    | 2    | high | 51.65 us | 26.69 us | 0.517 [0.496..0.565] | 0.511            | 2.37              | 2.36               | 1.002 [0.987..1.019] | faster  |
| G5 data-first uniqueBy                          | M    | 2    | high | 52.31 us | 30.98 us | 0.594 [0.580..0.596] | 0.592            | -                 | -                  | 1.005 [0.987..1.015] | faster  |
| G5 data-first uniqueBy (reads data)             | M    | 2    | high | 53.69 us | 34.31 us | 0.642 [0.600..0.661] | 0.644            | -                 | -                  | 0.994 [0.928..1.005] | faster  |
| G5 data-first uniqueWith                        | M    | 3    | low  | 1.58 ms  | 1.55 ms  | 0.985 [0.980..0.990] | 0.983            | 2.63              | 2.63               | 0.999 [0.998..1.004] | neutral |
| G5 data-first zip                               | M    | 3    | mid  | 6.21 us  | 6.21 us  | 1.000 [0.993..1.007] | 0.999            | 2.50              | 2.45               | 1.000 [0.993..1.007] | neutral |
| G5 data-first zipWith                           | M    | 3    | low  | 7.44 us  | 7.50 us  | 1.008 [0.989..1.022] | 1.004            | 5.79              | 5.79               | 1.006 [0.989..1.017] | neutral |
| G6 filter(fn)(data)                             | M    | 2    | high | 6.35 us  | 6.21 us  | 0.981 [0.967..0.987] | 0.985            | 2.95              | 2.98               | 0.997 [0.974..1.007] | neutral |
| G6 map(fn)(data)                                | M    | 2    | high | 5.50 us  | 5.42 us  | 0.989 [0.977..0.993] | 0.981            | 2.21              | 2.16               | 1.000 [1.000..1.007] | neutral |
| G6 unique()(data)                               | M    | 2    | high | 51.25 us | 27.40 us | 0.533 [0.500..0.558] | 0.527            | 2.42              | 2.42               | 1.008 [0.998..1.023] | faster  |

### Tier 2 (lenient): Callbacks that declare no parameters

G9: `map(when(isNullish, constant(0)))`, `forEach(constant(undefined))`, `map((...args) => args[0])` and a 2-step one, XS-M (added row: a tier 2 shape). 16 scenarios; gm 0.540; range 0.405-0.772; faster / neutral / slower 16 / 0 / 0.

| scenario                             | size | tier | pop  | main      | branch    | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ------------------------------------ | ---- | ---- | ---- | --------- | --------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G9 forEach(constant(undefined))      | XS   | 3    | low  | 35.92 us  | 17.12 us  | 0.475 [0.467..0.488] | 0.476            | 14.16             | 14.46              | 0.995 [0.977..1.021] | faster  |
| G9 forEach(constant(undefined))      | S    | 3    | low  | 36.46 us  | 15.33 us  | 0.422 [0.417..0.427] | 0.420            | 41.06             | 44.55              | 0.999 [0.993..1.014] | faster  |
| G9 forEach(constant(undefined))      | C    | 3    | low  | 203.40 us | 84.73 us  | 0.417 [0.415..0.430] | 0.419            | 75.01             | 77.40              | 1.002 [1.001..1.026] | faster  |
| G9 forEach(constant(undefined))      | M    | 3    | low  | 31.40 us  | 14.29 us  | 0.456 [0.447..0.460] | 0.448            | 56.92             | 56.77              | 1.004 [1.001..1.008] | faster  |
| G9 map((...args) => args[0])         | XS   | 2    | high | 35.50 us  | 17.63 us  | 0.494 [0.482..0.509] | 0.492            | 6.63              | 6.68               | 1.005 [0.979..1.018] | faster  |
| G9 map((...args) => args[0])         | S    | 2    | high | 36.96 us  | 15.27 us  | 0.412 [0.401..0.421] | 0.413            | 7.13              | 7.14               | 0.996 [0.988..1.006] | faster  |
| G9 map((...args) => args[0])         | C    | 2    | high | 207.29 us | 84.13 us  | 0.405 [0.388..0.413] | 0.410            | 7.59              | 7.69               | 1.003 [0.983..1.024] | faster  |
| G9 map((...args) => args[0])         | M    | 2    | high | 32.04 us  | 14.10 us  | 0.440 [0.431..0.464] | 0.436            | 8.26              | 8.26               | 1.004 [0.999..1.012] | faster  |
| G9 map((...args) => args[0])+filter  | XS   | 2    | high | 54.54 us  | 35.75 us  | 0.653 [0.648..0.680] | 0.654            | 7.48              | 7.64               | 0.996 [0.988..1.006] | faster  |
| G9 map((...args) => args[0])+filter  | S    | 2    | high | 60.44 us  | 31.52 us  | 0.520 [0.507..0.528] | 0.517            | 7.90              | 7.93               | 1.001 [0.995..1.023] | faster  |
| G9 map((...args) => args[0])+filter  | C    | 2    | high | 341.29 us | 162.75 us | 0.475 [0.469..0.485] | 0.477            | 7.58              | 7.62               | 1.002 [0.971..1.009] | faster  |
| G9 map((...args) => args[0])+filter  | M    | 2    | high | 52.40 us  | 25.67 us  | 0.493 [0.474..0.507] | 0.488            | 6.62              | 6.56               | 0.996 [0.991..1.016] | faster  |
| G9 map(when(isNullish, constant(0))) | XS   | 2    | high | 46.27 us  | 28.10 us  | 0.603 [0.601..0.612] | 0.609            | 14.57             | 14.77              | 1.002 [0.994..1.017] | faster  |
| G9 map(when(isNullish, constant(0))) | S    | 2    | high | 61.27 us  | 44.71 us  | 0.729 [0.713..0.739] | 0.740            | 22.11             | 22.26              | 0.993 [0.974..1.031] | faster  |
| G9 map(when(isNullish, constant(0))) | C    | 2    | high | 351.90 us | 273.31 us | 0.772 [0.763..0.787] | 0.779            | 8.87              | 11.20              | 1.008 [0.991..1.043] | faster  |
| G9 map(when(isNullish, constant(0))) | M    | 2    | high | 54.46 us  | 41.40 us  | 0.768 [0.738..0.784] | 0.780            | 24.04             | 24.28              | 1.004 [0.989..1.013] | faster  |

### Tier 3 (report only): Long consecutive lazy runs (8-15 steps)

G2 deep-8 and deep-15 pipes of primitives, objects and a `flatMap` first, at S and M. 9 scenarios; gm 0.359; range 0.325-0.428; faster / neutral / slower 9 / 0 / 0.

| scenario                 | size | tier | pop  | main      | branch    | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ------------------------ | ---- | ---- | ---- | --------- | --------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G2 deep-15 flatMap-first | M    | 3    | high | 567.48 us | 185.92 us | 0.327 [0.326..0.337] | 0.326            | 1.10              | 1.11               | 1.000 [0.986..1.025] | faster  |
| G2 deep-15 object        | M    | 3    | high | 209.56 us | 74.85 us  | 0.358 [0.347..0.364] | 0.356            | 1.21              | 1.22               | 1.000 [0.973..1.019] | faster  |
| G2 deep-15 primitive     | M    | 3    | high | 259.08 us | 84.35 us  | 0.325 [0.314..0.335] | 0.325            | 1.15              | 1.15               | 0.989 [0.978..1.024] | faster  |
| G2 deep-8 flatMap-first  | S    | 3    | high | 416.21 us | 154.13 us | 0.371 [0.364..0.374] | 0.371            | 3.22              | 2.98               | 0.992 [0.984..1.015] | faster  |
| G2 deep-8 flatMap-first  | M    | 3    | high | 372.58 us | 127.27 us | 0.342 [0.334..0.352] | 0.340            | 1.17              | 1.17               | 1.001 [0.996..1.014] | faster  |
| G2 deep-8 object         | S    | 3    | high | 170.44 us | 72.48 us  | 0.428 [0.414..0.441] | 0.430            | 5.62              | 5.69               | 0.994 [0.974..1.004] | faster  |
| G2 deep-8 object         | M    | 3    | high | 140.85 us | 51.31 us  | 0.364 [0.355..0.374] | 0.363            | 1.27              | 1.27               | 1.003 [0.987..1.022] | faster  |
| G2 deep-8 primitive      | S    | 3    | high | 185.98 us | 72.94 us  | 0.392 [0.386..0.413] | 0.396            | 6.65              | 6.76               | 1.005 [0.972..1.020] | faster  |
| G2 deep-8 primitive      | M    | 3    | high | 157.12 us | 52.27 us  | 0.333 [0.328..0.346] | 0.333            | 1.20              | 1.21               | 0.997 [0.979..1.015] | faster  |

### Tier 3 (report only): 100,000 items

Every scenario measured at L (G1, G2). 19 scenarios; gm 0.422; range 0.297-0.690; faster / neutral / slower 19 / 0 / 0.

| scenario                    | size | tier | pop  | main     | branch   | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| --------------------------- | ---- | ---- | ---- | -------- | -------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G1 3-step middle reads data | L    | 3    | high | 5.28 ms  | 2.48 ms  | 0.470 [0.462..0.477] | 0.474            | 1.85              | 1.86               | 0.997 [0.991..1.011] | faster  |
| G1 drop+take                | L    | 3    | low  | 2.88 ms  | 1.10 ms  | 0.381 [0.372..0.387] | 0.391            | 62.61             | 89.99              | 0.994 [0.970..1.010] | faster  |
| G1 filter+first             | L    | 3    | mid  | 1.29 us  | 709 ns   | 0.549 [0.532..0.549] | 0.543 *          | 16.88             | 16.43              | 1.007 [0.998..1.061] | faster  |
| G1 filter+map               | L    | 3    | high | 4.25 ms  | 1.74 ms  | 0.404 [0.401..0.416] | 0.410            | 1.48              | 1.46               | 1.006 [0.995..1.022] | faster  |
| G1 filter+map+take(10)      | L    | 3    | mid  | 1.04 us  | 500 ns   | 0.480 [0.480..0.480] | 0.472 *          | 0.00              | 0.00               | 0.995 [0.982..1.019] | faster  |
| G1 find early hit           | L    | 3    | mid  | 48.88 us | 21.92 us | 0.448 [0.443..0.455] | 0.447            | 9.17              | 9.36               | 1.000 [0.997..1.017] | faster  |
| G1 find late hit            | L    | 3    | mid  | 2.44 ms  | 1.07 ms  | 0.440 [0.432..0.446] | 0.452            | 2.41              | 2.55               | 1.003 [0.986..1.007] | faster  |
| G1 find miss                | L    | 3    | mid  | 2.46 ms  | 1.06 ms  | 0.432 [0.430..0.435] | 0.443            | 2.34              | 2.35               | 0.995 [0.992..1.003] | faster  |
| G1 flat+map                 | L    | 3    | mid  | 5.57 ms  | 1.66 ms  | 0.297 [0.287..0.312] | 0.302            | 1.10              | 1.09               | 1.000 [0.978..1.027] | faster  |
| G1 flatMap+filter+map       | L    | 3    | mid  | 19.04 ms | 6.13 ms  | 0.321 [0.312..0.331] | 0.315            | 1.15              | 1.18               | 1.004 [0.996..1.011] | faster  |
| G1 map                      | L    | 3    | high | 3.22 ms  | 1.23 ms  | 0.386 [0.356..0.411] | 0.388            | 1.74              | 1.73               | 1.012 [0.974..1.023] | faster  |
| G1 map reading data         | L    | 3    | high | 3.23 ms  | 1.36 ms  | 0.419 [0.406..0.426] | 0.415            | 2.36              | 2.32               | 1.001 [0.983..1.007] | faster  |
| G1 map+filter+map           | L    | 3    | high | 7.05 ms  | 2.32 ms  | 0.330 [0.326..0.334] | 0.329            | 1.51              | 1.48               | 0.997 [0.992..1.008] | faster  |
| G1 map+unique               | L    | 3    | high | 8.50 ms  | 4.83 ms  | 0.567 [0.545..0.583] | 0.566            | 1.47              | 1.50               | 0.997 [0.987..1.014] | faster  |
| G1 uniqueBy                 | L    | 3    | high | 6.59 ms  | 4.21 ms  | 0.640 [0.627..0.659] | 0.636            | 1.44              | 1.46               | 0.995 [0.986..1.009] | faster  |
| G2 deep-8 flatMap-first     | L    | 3    | high | 39.65 ms | 12.47 ms | 0.314 [0.308..0.320] | 0.309            | 1.16              | 1.16               | 0.995 [0.977..1.022] | faster  |
| G2 deep-8 mixed             | L    | 3    | high | 20.11 ms | 13.89 ms | 0.690 [0.680..0.698] | 0.684            | 2.32              | 2.33               | 0.994 [0.990..1.002] | faster  |
| G2 deep-8 object            | L    | 3    | high | 15.15 ms | 4.99 ms  | 0.330 [0.325..0.332] | 0.328            | 1.20              | 1.25               | 0.997 [0.981..1.012] | faster  |
| G2 deep-8 primitive         | L    | 3    | high | 16.16 ms | 5.12 ms  | 0.317 [0.315..0.321] | 0.314            | 1.25              | 1.27               | 0.996 [0.992..1.006] | faster  |

### Tier 3 (report only): Exotic item kinds

G8 at C and M: entries tuples, 3-level class instances, 40-key objects, dictionary-mode objects, frozen objects, fresh `{...u}` literals, pass-through Proxy items. 14 scenarios; gm 0.503; range 0.423-0.645; faster / neutral / slower 14 / 0 / 0.

| scenario                                 | size | tier | pop  | main      | branch    | branch/main p75      | branch/main mean | branch/native p75 | branch/native mean | A/A                  | verdict |
| ---------------------------------------- | ---- | ---- | ---- | --------- | --------- | -------------------- | ---------------- | ----------------- | ------------------ | -------------------- | ------- |
| G8 3-level class instances               | C    | 3    | high | 352.04 us | 154.29 us | 0.437 [0.425..0.444] | 0.437            | 6.67              | 6.68               | 1.009 [0.991..1.031] | faster  |
| G8 3-level class instances               | M    | 3    | high | 54.27 us  | 23.02 us  | 0.423 [0.416..0.434] | 0.420            | 6.09              | 6.25               | 0.993 [0.972..1.007] | faster  |
| G8 40-key objects                        | C    | 3    | high | 368.65 us | 164.33 us | 0.445 [0.440..0.467] | 0.448            | 5.98              | 6.00               | 0.996 [0.966..1.010] | faster  |
| G8 40-key objects                        | M    | 3    | high | 55.29 us  | 24.27 us  | 0.438 [0.426..0.441] | 0.431            | 5.21              | 5.30               | 0.993 [0.975..1.007] | faster  |
| G8 dictionary-mode objects               | C    | 3    | high | 409.40 us | 212.71 us | 0.517 [0.499..0.522] | 0.514            | 3.32              | 3.30               | 1.003 [0.973..1.004] | faster  |
| G8 dictionary-mode objects               | M    | 3    | high | 63.88 us  | 31.98 us  | 0.503 [0.487..0.512] | 0.499            | 2.88              | 2.87               | 1.002 [0.992..1.031] | faster  |
| G8 fresh ({...u}) literals               | C    | 3    | high | 466.85 us | 220.17 us | 0.470 [0.438..0.476] | 0.463            | 2.50              | 2.51               | 0.998 [0.984..1.013] | faster  |
| G8 fresh ({...u}) literals               | M    | 3    | high | 74.15 us  | 35.04 us  | 0.470 [0.452..0.477] | 0.465            | 2.39              | 2.40               | 0.995 [0.975..1.017] | faster  |
| G8 frozen objects                        | C    | 3    | high | 383.81 us | 177.06 us | 0.460 [0.450..0.466] | 0.461            | 4.09              | 4.13               | 1.008 [0.983..1.017] | faster  |
| G8 frozen objects                        | M    | 3    | high | 58.40 us  | 26.44 us  | 0.453 [0.439..0.459] | 0.449            | 3.85              | 3.96               | 1.003 [0.989..1.009] | faster  |
| G8 pass-through Proxy items              | C    | 3    | high | 543.04 us | 340.54 us | 0.627 [0.599..0.634] | 0.626            | 1.57              | 1.58               | 1.001 [0.957..1.018] | faster  |
| G8 pass-through Proxy items              | M    | 3    | high | 84.79 us  | 53.56 us  | 0.627 [0.612..0.637] | 0.627            | 1.47              | 1.48               | 1.007 [0.983..1.037] | faster  |
| G8 tuples entries+filter+map+fromEntries | C    | 3    | high | 398.19 us | 240.48 us | 0.604 [0.597..0.613] | 0.606            | 1.73              | 1.74               | 1.001 [0.996..1.021] | faster  |
| G8 tuples entries+filter+map+fromEntries | M    | 3    | high | 65.15 us  | 41.98 us  | 0.645 [0.633..0.646] | 0.639            | 1.26              | 1.25               | 1.004 [0.992..1.015] | faster  |

Per-scenario tables for the environments and lower JIT tiers: `results/publication/agg-x-*.md`. Lower-tier scenarios above 1.02:

| run set                                              | scenario                  | size | median | per run                    | A/A median |
| ---------------------------------------------------- | ------------------------- | ---- | ------ | -------------------------- | ---------- |
| Interpreter only (`--jitless`)                       | G7 omit data-last         | XS   | 1.033  | 1.034, 1.032, 1.033, 1.040 | 1.005      |
| Interpreter only (`--jitless`)                       | G7 entries data-last      | XS   | 1.052  | 1.058, 1.039, 1.053, 1.051 | 1.011      |
| Interpreter only (`--jitless`)                       | G7 entries data-last      | S    | 1.044  | 1.044, 1.028, 1.045, 1.048 | 1.008      |
| Interpreter only (`--jitless`)                       | G7 mapValues data-last    | XS   | 1.036  | 1.039, 1.032, 1.028, 1.045 | 1.004      |
| Interpreter only (`--jitless`)                       | G7 isDeepEqual data-last  | XS   | 1.023  | 1.022, 1.034, 1.024, 1.023 | 1.004      |
| Interpreter only (`--jitless`)                       | G7 groupBy data-last      | XS   | 1.026  | 1.022, 1.010, 1.043, 1.030 | 1.005      |
| Interpreter only (`--jitless`)                       | G7 pick data-last         | XS   | 1.043  | 1.041, 1.042, 1.043, 1.048 | 1.003      |
| Interpreter only (`--jitless`)                       | G7 pick data-last         | S    | 1.039  | 1.040, 1.038, 1.036, 1.041 | 1.007      |
| Interpreter only (`--jitless`)                       | G7 pick data-last         | C    | 1.032  | 1.018, 1.034, 1.033, 1.031 | 1.000      |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 omit data-last         | XS   | 1.028  | 1.027, 1.029, 1.028, 1.025 | 1.003      |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 entries data-last      | XS   | 1.063  | 1.068, 1.058, 1.048, 1.081 | 1.004      |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 entries data-last      | S    | 1.060  | 1.066, 1.054, 1.039, 1.065 | 1.003      |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 isDeepEqual data-last  | XS   | 1.020  | 1.034, 1.019, 1.021, 1.017 | 0.995      |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 groupBy data-first     | XS   | 1.031  | 1.023, 0.998, 1.057, 1.039 | 1.010      |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 groupBy data-last      | XS   | 1.036  | 1.034, 1.025, 1.064, 1.038 | 1.018      |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 pick data-last         | XS   | 1.040  | 1.038, 1.026, 1.047, 1.042 | 0.997      |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 pick data-last         | S    | 1.025  | 1.021, 1.025, 1.025, 1.028 | 0.995      |
| Mid-tier compiler ceiling (`--max-opt=2`, Maglev)    | G7 isDeepEqual data-first | C    | 1.039  | 1.039, 1.040, 1.042, 0.969 | 1.005      |

## 3. Tier 1 guard table and noise

### Tier 1 guard (full matrix, 153 scenarios, floor 0.038, bar 1.038)

A tier 1 scenario fails when its median ratio is beyond the bar in both run orders: branch first (rotation 1, 2 runs) and main first (rotations 0 and 2, 4 runs). Sorted by the worse order; margin = bar - worse order.

| scenario                                                                                    | size | pop  | branch first | main first | worse order | margin | A/A median [min..max] | verdict |
| ------------------------------------------------------------------------------------------- | ---- | ---- | ------------ | ---------- | ----------- | ------ | --------------------- | ------- |
| G7 mapValues data-first                                                                     | C    | high | 1.389        | 1.000      | 1.389       | -0.350 | 0.987 [0.961..1.028]  | neutral |
| G7 mapValues data-last                                                                      | C    | high | 1.117        | 0.973      | 1.117       | -0.079 | 0.835 [0.758..1.100]  | neutral |
| G7 groupBy data-first                                                                       | XS   | high | 1.051        | 0.997      | 1.051       | -0.013 | 1.007 [0.967..1.023]  | neutral |
| G7 isDeepEqual data-first                                                                   | C    | high | 1.042        | 0.969      | 1.042       | -0.004 | 1.011 [0.968..1.093]  | neutral |
| G7 groupBy data-last                                                                        | C    | high | 1.026        | 0.983      | 1.026       | 0.012  | 0.995 [0.985..1.021]  | neutral |
| G7 isDeepEqual data-first                                                                   | S    | high | 1.022        | 0.998      | 1.022       | 0.016  | 0.996 [0.962..1.021]  | neutral |
| G7 omit data-first                                                                          | C    | high | 1.021        | 0.978      | 1.021       | 0.018  | 1.009 [0.952..1.013]  | neutral |
| G7 groupBy data-first                                                                       | C    | high | 1.015        | 0.994      | 1.015       | 0.023  | 0.997 [0.958..1.021]  | neutral |
| G7 pick data-first                                                                          | C    | high | 1.012        | 1.015      | 1.015       | 0.023  | 1.006 [0.988..1.018]  | neutral |
| G7 groupBy data-first                                                                       | S    | high | 0.993        | 1.012      | 1.012       | 0.026  | 1.004 [0.986..1.007]  | neutral |
| G7 omit data-last                                                                           | C    | high | 1.010        | 1.002      | 1.010       | 0.028  | 1.006 [0.989..1.018]  | neutral |
| G5 data-first map                                                                           | XS   | high | 0.995        | 1.010      | 1.010       | 0.028  | 1.005 [0.986..1.010]  | neutral |
| G7 sortBy data-first                                                                        | S    | high | 1.009        | 0.998      | 1.009       | 0.029  | 0.997 [0.990..1.011]  | neutral |
| G7 isDeepEqual data-first                                                                   | XS   | high | 1.006        | 1.009      | 1.009       | 0.030  | 1.002 [0.998..1.017]  | neutral |
| G5 data-first filter                                                                        | XS   | high | 1.004        | 1.008      | 1.008       | 0.030  | 1.011 [0.992..1.021]  | neutral |
| G7 pick data-first                                                                          | XS   | high | 0.996        | 1.008      | 1.008       | 0.031  | 1.003 [0.991..1.009]  | neutral |
| G7 sortBy data-last                                                                         | S    | high | 1.007        | 0.988      | 1.007       | 0.031  | 0.999 [0.983..1.009]  | neutral |
| G5 data-first filter                                                                        | S    | high | 0.983        | 1.006      | 1.006       | 0.032  | 1.000 [0.977..1.023]  | neutral |
| G7 mapValues data-first                                                                     | XS   | high | 0.999        | 1.005      | 1.005       | 0.033  | 0.999 [0.989..1.018]  | neutral |
| G7 omit data-first                                                                          | S    | high | 1.005        | 0.998      | 1.005       | 0.033  | 0.999 [0.993..1.011]  | neutral |
| G7 entries data-first                                                                       | S    | high | 1.005        | 1.004      | 1.005       | 0.033  | 1.000 [0.991..1.009]  | neutral |
| G7 pick data-first                                                                          | S    | high | 0.993        | 1.004      | 1.004       | 0.034  | 1.007 [0.993..1.015]  | neutral |
| G7 pick data-last                                                                           | S    | high | 1.004        | 0.989      | 1.004       | 0.035  | 1.004 [0.993..1.014]  | neutral |
| G7 range data-first                                                                         | XS   | mid  | 1.002        | 1.001      | 1.002       | 0.036  | 1.006 [0.994..1.023]  | neutral |
| G3 array sortBy+groupBy                                                                     | C    | high | 1.001        | 1.002      | 1.002       | 0.037  | 1.000 [0.998..1.005]  | neutral |
| G7 omit data-last                                                                           | S    | high | 1.001        | 0.996      | 1.001       | 0.037  | 0.999 [0.994..1.005]  | neutral |
| G7 entries data-last                                                                        | S    | high | 0.996        | 1.000      | 1.000       | 0.038  | 1.000 [0.982..1.009]  | neutral |
| G7 range data-first                                                                         | S    | mid  | 1.000        | 0.996      | 1.000       | 0.038  | 0.998 [0.992..1.002]  | neutral |
| G7 entries data-last                                                                        | C    | high | 1.000        | 0.998      | 1.000       | 0.038  | 0.998 [0.996..1.000]  | neutral |
| G7 entries data-first                                                                       | C    | high | 1.000        | 1.000      | 1.000       | 0.038  | 1.001 [0.998..1.012]  | neutral |
| G7 entries data-first                                                                       | XS   | high | 0.994        | 1.000      | 1.000       | 0.038  | 0.992 [0.983..1.006]  | neutral |
| G7 mapValues data-first                                                                     | S    | high | 0.996        | 0.999      | 0.999       | 0.039  | 0.999 [0.997..1.003]  | neutral |
| G3 pipe(x)                                                                                  | x1   | high | 0.999        | 0.933      | 0.999       | 0.039  | 0.991 [0.940..1.003]  | neutral |
| G7 groupBy data-last                                                                        | S    | high | 0.998        | 0.991      | 0.998       | 0.041  | 1.000 [0.993..1.002]  | neutral |
| G7 entries data-last                                                                        | XS   | high | 0.998        | 0.993      | 0.998       | 0.041  | 1.000 [0.995..1.013]  | neutral |
| G7 omit data-first                                                                          | XS   | high | 0.991        | 0.997      | 0.997       | 0.041  | 0.997 [0.989..1.007]  | neutral |
| G7 isDeepEqual data-last                                                                    | S    | high | 0.996        | 0.995      | 0.996       | 0.042  | 0.998 [0.969..1.008]  | neutral |
| G7 range data-first                                                                         | C    | mid  | 0.996        | 0.996      | 0.996       | 0.042  | 1.001 [0.991..1.003]  | neutral |
| G5 data-first filter                                                                        | C    | high | 0.992        | 0.996      | 0.996       | 0.042  | 1.005 [0.992..1.016]  | neutral |
| G5 data-first map                                                                           | S    | high | 0.995        | 0.992      | 0.995       | 0.044  | 0.992 [0.978..1.006]  | neutral |
| G7 mapValues data-last                                                                      | S    | high | 0.981        | 0.990      | 0.990       | 0.048  | 0.995 [0.986..0.998]  | neutral |
| G7 omit data-last                                                                           | XS   | high | 0.982        | 0.989      | 0.989       | 0.049  | 0.996 [0.989..1.005]  | neutral |
| G7 isDeepEqual data-last                                                                    | XS   | high | 0.987        | 0.988      | 0.988       | 0.050  | 1.010 [0.981..1.014]  | neutral |
| G7 isDeepEqual data-last                                                                    | C    | high | 0.986        | 0.946      | 0.986       | 0.052  | 0.961 [0.901..1.035]  | neutral |
| G7 pick data-last                                                                           | C    | high | 0.986        | 0.975      | 0.986       | 0.052  | 1.003 [0.995..1.017]  | neutral |
| G7 groupBy data-last                                                                        | XS   | high | 0.986        | 0.979      | 0.986       | 0.052  | 1.003 [0.992..1.021]  | neutral |
| G7 pick data-last                                                                           | XS   | high | 0.984        | 0.975      | 0.984       | 0.054  | 1.000 [0.991..1.006]  | neutral |
| G5 data-first map                                                                           | C    | high | 0.972        | 0.984      | 0.984       | 0.054  | 0.977 [0.944..1.002]  | neutral |
| G3 array sortBy+groupBy                                                                     | S    | high | 0.972        | 0.970      | 0.972       | 0.066  | 0.996 [0.988..1.007]  | neutral |
| G7 mapValues data-last                                                                      | XS   | high | 0.944        | 0.954      | 0.954       | 0.084  | 0.996 [0.980..1.007]  | faster  |
| G6 filter(fn)(data)                                                                         | C    | high | 0.936        | 0.946      | 0.946       | 0.092  | 0.997 [0.986..1.004]  | faster  |
| G6 map(fn)(data)                                                                            | C    | high | 0.938        | 0.934      | 0.938       | 0.100  | 0.999 [0.991..1.017]  | faster  |
| G3 object pick+omit+set+merge                                                               | x1   | high | 0.935        | 0.906      | 0.935       | 0.103  | 1.003 [0.970..1.012]  | faster  |
| G3 array sortBy+groupBy                                                                     | XS   | high | 0.925        | 0.897      | 0.925       | 0.113  | 1.005 [0.953..1.014]  | faster  |
| G3 object pick+omit+set+merge                                                               | x64  | high | 0.916        | 0.892      | 0.916       | 0.122  | 0.995 [0.960..1.008]  | faster  |
| G6 map(fn)(data)                                                                            | S    | high | 0.855        | 0.855      | 0.855       | 0.183  | 1.002 [0.995..1.009]  | faster  |
| G6 filter(fn)(data)                                                                         | S    | high | 0.848        | 0.831      | 0.848       | 0.190  | 0.995 [0.986..1.028]  | faster  |
| G3 scalar purry depth-10                                                                    | x1   | high | 0.799        | 0.779      | 0.799       | 0.239  | 1.006 [0.960..1.011]  | faster  |
| G3 scalar purry depth-10                                                                    | x64  | high | 0.798        | 0.773      | 0.798       | 0.240  | 1.000 [0.957..1.030]  | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | XS   | high | 0.796        | 0.778      | 0.796       | 0.242  | 0.998 [0.981..1.005]  | faster  |
| G3 scalar purry depth-3                                                                     | x1   | high | 0.788        | 0.765      | 0.788       | 0.250  | 1.001 [0.922..1.034]  | faster  |
| G3 pipe(x, add(1))                                                                          | x1   | high | 0.782        | 0.755      | 0.782       | 0.257  | 0.994 [0.956..1.021]  | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | S    | high | 0.778        | 0.767      | 0.778       | 0.260  | 0.991 [0.976..1.002]  | faster  |
| G3 scalar arrows depth-3                                                                    | x1   | high | 0.757        | 0.758      | 0.758       | 0.280  | 0.995 [0.951..1.013]  | faster  |
| G3 pipe(x, arrow)                                                                           | x1   | high | 0.740        | 0.753      | 0.753       | 0.285  | 0.992 [0.962..1.074]  | faster  |
| G3 scalar purry depth-3                                                                     | x64  | high | 0.751        | 0.698      | 0.751       | 0.287  | 0.991 [0.915..1.026]  | faster  |
| G3 scalar arrows depth-10                                                                   | x1   | high | 0.740        | 0.744      | 0.744       | 0.294  | 1.006 [0.985..1.019]  | faster  |
| G3 scalar arrows depth-10                                                                   | x64  | high | 0.726        | 0.739      | 0.739       | 0.299  | 1.007 [0.992..1.038]  | faster  |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | high | 0.739        | 0.734      | 0.739       | 0.299  | 0.992 [0.982..1.007]  | faster  |
| G5 data-first difference(range) (adopter shape)                                             | XS   | mid  | 0.718        | 0.718      | 0.718       | 0.320  | 1.001 [0.992..1.010]  | faster  |
| G5 data-first difference(range) (adopter shape)                                             | S    | mid  | 0.693        | 0.691      | 0.693       | 0.345  | 0.998 [0.993..1.018]  | faster  |
| G6 map(fn)(data)                                                                            | XS   | high | 0.693        | 0.683      | 0.693       | 0.345  | 1.001 [0.997..1.012]  | faster  |
| G6 filter(fn)(data)                                                                         | XS   | high | 0.690        | 0.683      | 0.690       | 0.348  | 1.001 [0.985..1.015]  | faster  |
| G1 3-step middle reads data                                                                 | XS   | high | 0.689        | 0.689      | 0.689       | 0.349  | 1.003 [0.993..1.011]  | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | high | 0.683        | 0.677      | 0.683       | 0.355  | 1.001 [0.994..1.007]  | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | XS   | high | 0.682        | 0.679      | 0.682       | 0.356  | 0.998 [0.987..1.004]  | faster  |
| G1b pipe uniqueBy+map                                                                       | XS   | high | 0.656        | 0.663      | 0.663       | 0.375  | 1.005 [0.974..1.011]  | faster  |
| G3 pipe(x, add(1))                                                                          | x64  | high | 0.653        | 0.660      | 0.660       | 0.378  | 0.990 [0.917..1.091]  | faster  |
| G5 data-first difference(range) (adopter shape)                                             | M    | mid  | 0.655        | 0.646      | 0.655       | 0.383  | 1.002 [0.995..1.006]  | faster  |
| G5 data-first uniqueBy (reads data)                                                         | XS   | high | 0.651        | 0.654      | 0.654       | 0.385  | 0.997 [0.974..1.011]  | faster  |
| G5 data-first difference(range) (adopter shape)                                             | C    | mid  | 0.649        | 0.635      | 0.649       | 0.389  | 1.008 [0.994..1.045]  | faster  |
| G1 filter+map                                                                               | XS   | high | 0.644        | 0.641      | 0.644       | 0.394  | 1.003 [0.994..1.014]  | faster  |
| G5 data-first uniqueBy (reads data)                                                         | C    | high | 0.642        | 0.633      | 0.642       | 0.396  | 1.001 [0.973..1.010]  | faster  |
| G1b pipe filter+map                                                                         | XS   | high | 0.640        | 0.640      | 0.640       | 0.398  | 1.005 [0.998..1.015]  | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | XS   | high | 0.640        | 0.634      | 0.640       | 0.398  | 1.001 [0.978..1.005]  | faster  |
| G5 data-first uniqueBy                                                                      | XS   | high | 0.628        | 0.638      | 0.638       | 0.401  | 1.000 [0.992..1.013]  | faster  |
| G1b pipe uniqueBy                                                                           | C    | high | 0.620        | 0.614      | 0.620       | 0.418  | 1.006 [0.998..1.021]  | faster  |
| G1 uniqueBy                                                                                 | C    | high | 0.617        | 0.618      | 0.618       | 0.420  | 0.995 [0.990..1.007]  | faster  |
| G5 data-first uniqueBy                                                                      | C    | high | 0.617        | 0.616      | 0.617       | 0.421  | 1.001 [0.997..1.010]  | faster  |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | S    | high | 0.608        | 0.596      | 0.608       | 0.430  | 0.996 [0.983..1.005]  | faster  |
| G1 map+unique                                                                               | XS   | high | 0.597        | 0.602      | 0.602       | 0.436  | 0.998 [0.990..1.026]  | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | XS   | high | 0.595        | 0.601      | 0.601       | 0.437  | 0.998 [0.981..1.005]  | faster  |
| G3 scalar arrows depth-3                                                                    | x64  | high | 0.590        | 0.596      | 0.596       | 0.442  | 1.010 [1.000..1.042]  | faster  |
| G1b pipe unique+map                                                                         | XS   | high | 0.582        | 0.592      | 0.592       | 0.447  | 1.003 [0.991..1.016]  | faster  |
| G5 data-first uniqueBy                                                                      | S    | high | 0.588        | 0.589      | 0.589       | 0.450  | 0.997 [0.982..1.006]  | faster  |
| G1b pipe uniqueBy+map                                                                       | C    | high | 0.585        | 0.587      | 0.587       | 0.451  | 1.000 [0.996..1.017]  | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | S    | high | 0.579        | 0.587      | 0.587       | 0.451  | 0.998 [0.973..1.013]  | faster  |
| G5 data-first uniqueBy (reads data)                                                         | S    | high | 0.584        | 0.584      | 0.584       | 0.454  | 1.002 [0.996..1.008]  | faster  |
| G1b pipe map+map                                                                            | XS   | high | 0.578        | 0.582      | 0.582       | 0.456  | 0.996 [0.987..1.008]  | faster  |
| G1 map+filter+map                                                                           | XS   | high | 0.575        | 0.577      | 0.577       | 0.461  | 1.003 [0.995..1.007]  | faster  |
| G1b pipe uniqueBy+map                                                                       | S    | high | 0.571        | 0.572      | 0.572       | 0.466  | 1.002 [0.996..1.027]  | faster  |
| G6 unique()(data)                                                                           | C    | high | 0.565        | 0.568      | 0.568       | 0.471  | 1.007 [0.994..1.048]  | faster  |
| G1b pipe uniqueBy                                                                           | S    | high | 0.567        | 0.562      | 0.567       | 0.471  | 1.004 [0.993..1.012]  | faster  |
| G5 data-first unique                                                                        | C    | high | 0.550        | 0.566      | 0.566       | 0.472  | 1.003 [0.990..1.018]  | faster  |
| G5 data-first difference                                                                    | XS   | mid  | 0.561        | 0.565      | 0.565       | 0.473  | 1.000 [0.987..1.008]  | faster  |
| G1b pipe unique+map                                                                         | C    | high | 0.559        | 0.563      | 0.563       | 0.476  | 1.005 [0.986..1.036]  | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | XS   | high | 0.562        | 0.550      | 0.562       | 0.476  | 0.996 [0.990..1.006]  | faster  |
| G1b pipe unique                                                                             | C    | high | 0.559        | 0.562      | 0.562       | 0.476  | 1.002 [0.980..1.014]  | faster  |
| G1 uniqueBy                                                                                 | S    | high | 0.552        | 0.560      | 0.560       | 0.478  | 0.997 [0.987..1.004]  | faster  |
| G1b pipe uniqueBy                                                                           | XS   | high | 0.544        | 0.551      | 0.551       | 0.487  | 1.006 [0.983..1.010]  | faster  |
| G1 map+unique                                                                               | C    | high | 0.545        | 0.548      | 0.548       | 0.490  | 1.003 [0.990..1.012]  | faster  |
| G1 uniqueBy                                                                                 | XS   | high | 0.543        | 0.548      | 0.548       | 0.490  | 1.004 [0.980..1.011]  | faster  |
| G1 3-step middle reads data                                                                 | S    | high | 0.532        | 0.541      | 0.541       | 0.497  | 0.997 [0.978..1.017]  | faster  |
| G1b pipe unique+map                                                                         | S    | high | 0.521        | 0.539      | 0.539       | 0.499  | 1.005 [0.978..1.026]  | faster  |
| G1 map+unique                                                                               | S    | high | 0.531        | 0.537      | 0.537       | 0.501  | 1.002 [0.986..1.007]  | faster  |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | high | 0.529        | 0.530      | 0.530       | 0.508  | 1.003 [0.987..1.015]  | faster  |
| G1 map reading data                                                                         | XS   | high | 0.520        | 0.526      | 0.526       | 0.512  | 1.009 [0.974..1.020]  | faster  |
| G6 unique()(data)                                                                           | S    | high | 0.505        | 0.525      | 0.525       | 0.513  | 1.001 [0.999..1.043]  | faster  |
| G5 data-first unique                                                                        | S    | high | 0.513        | 0.521      | 0.521       | 0.518  | 1.002 [0.992..1.012]  | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | S    | high | 0.508        | 0.520      | 0.520       | 0.518  | 1.003 [0.971..1.015]  | faster  |
| G5 data-first unique                                                                        | XS   | high | 0.512        | 0.520      | 0.520       | 0.518  | 0.996 [0.983..1.017]  | faster  |
| G2 deep-8 mixed                                                                             | S    | high | 0.513        | 0.518      | 0.518       | 0.520  | 0.994 [0.985..1.008]  | faster  |
| G3 pipe(x, arrow)                                                                           | x64  | high | 0.512        | 0.518      | 0.518       | 0.520  | 0.995 [0.974..1.010]  | faster  |
| G1b pipe unique                                                                             | S    | high | 0.503        | 0.502      | 0.503       | 0.535  | 1.018 [0.967..1.024]  | faster  |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | high | 0.490        | 0.497      | 0.497       | 0.541  | 0.999 [0.988..1.005]  | faster  |
| G1b pipe filter                                                                             | XS   | high | 0.484        | 0.482      | 0.484       | 0.554  | 1.000 [0.989..1.009]  | faster  |
| G1 filter+map                                                                               | S    | high | 0.483        | 0.477      | 0.483       | 0.555  | 1.001 [0.975..1.025]  | faster  |
| G1 3-step middle reads data                                                                 | C    | high | 0.483        | 0.480      | 0.483       | 0.555  | 1.003 [0.975..1.027]  | faster  |
| G1b pipe filter+map                                                                         | S    | high | 0.476        | 0.471      | 0.476       | 0.562  | 0.999 [0.985..1.007]  | faster  |
| G5 data-first difference                                                                    | S    | mid  | 0.465        | 0.449      | 0.465       | 0.573  | 1.000 [0.994..1.008]  | faster  |
| G6 unique()(data)                                                                           | XS   | high | 0.462        | 0.454      | 0.462       | 0.576  | 1.005 [0.974..1.012]  | faster  |
| G1b pipe unique                                                                             | XS   | high | 0.455        | 0.453      | 0.455       | 0.583  | 1.000 [0.982..1.015]  | faster  |
| G1b pipe map                                                                                | XS   | high | 0.449        | 0.453      | 0.453       | 0.585  | 0.999 [0.977..1.016]  | faster  |
| G5 data-first difference                                                                    | C    | mid  | 0.447        | 0.444      | 0.447       | 0.591  | 0.997 [0.959..1.013]  | faster  |
| G1 map                                                                                      | XS   | high | 0.442        | 0.444      | 0.444       | 0.594  | 1.005 [0.995..1.028]  | faster  |
| G1 map reading data                                                                         | S    | high | 0.428        | 0.434      | 0.434       | 0.604  | 0.997 [0.985..1.009]  | faster  |
| G1b pipe filter                                                                             | S    | high | 0.427        | 0.424      | 0.427       | 0.611  | 1.004 [0.993..1.019]  | faster  |
| G1 map reading data                                                                         | C    | high | 0.417        | 0.417      | 0.417       | 0.621  | 0.998 [0.977..1.013]  | faster  |
| G3 pipe(x)                                                                                  | x64  | high | 0.321        | 0.412      | 0.412       | 0.626  | 1.000 [0.926..1.080]  | faster  |
| G1 filter+map                                                                               | C    | high | 0.403        | 0.411      | 0.411       | 0.627  | 0.996 [0.987..1.012]  | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | S    | high | 0.408        | 0.409      | 0.409       | 0.629  | 0.995 [0.985..1.035]  | faster  |
| G1 map+filter+map                                                                           | S    | high | 0.397        | 0.405      | 0.405       | 0.633  | 1.003 [0.980..1.008]  | faster  |
| G1b pipe filter+map                                                                         | C    | high | 0.398        | 0.404      | 0.404       | 0.634  | 0.998 [0.980..1.022]  | faster  |
| G5 data-first difference                                                                    | M    | mid  | 0.397        | 0.402      | 0.402       | 0.636  | 1.001 [0.994..1.009]  | faster  |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | high | 0.397        | 0.400      | 0.400       | 0.638  | 0.996 [0.980..1.031]  | faster  |
| G1b pipe map+map                                                                            | S    | high | 0.397        | 0.400      | 0.400       | 0.638  | 1.001 [0.996..1.045]  | faster  |
| G1b pipe filter                                                                             | C    | high | 0.376        | 0.377      | 0.377       | 0.661  | 1.004 [0.998..1.028]  | faster  |
| G1b pipe map                                                                                | S    | high | 0.356        | 0.358      | 0.358       | 0.680  | 1.002 [0.995..1.011]  | faster  |
| G1 map                                                                                      | S    | high | 0.352        | 0.354      | 0.354       | 0.684  | 1.001 [0.992..1.022]  | faster  |
| G1b pipe map+map                                                                            | C    | high | 0.346        | 0.347      | 0.347       | 0.691  | 0.996 [0.959..1.021]  | faster  |
| G1 map+filter+map                                                                           | C    | high | 0.345        | 0.347      | 0.347       | 0.691  | 1.002 [0.992..1.004]  | faster  |
| G1b pipe map                                                                                | C    | high | 0.333        | 0.336      | 0.336       | 0.703  | 1.004 [0.993..1.017]  | faster  |
| G1 map                                                                                      | C    | high | 0.329        | 0.332      | 0.332       | 0.706  | 1.005 [1.000..1.016]  | faster  |

Beyond the bar in both orders: 0. In one order only: 4 (watch list below).

### A/A false-call rate

The tier rules applied to main-aa vs main (the same code as separate module instances, in the same processes). Any verdict other than neutral is a false call; a false bar call is a regression or BLOCK.

| run set                                                                 | tier | scenarios | floor (p95 abs dev) | false calls                                                                                | false bar calls |
| ----------------------------------------------------------------------- | ---- | --------- | ------------------- | ------------------------------------------------------------------------------------------ | --------------- |
| Node 26 full matrix                                                     | 1    | 153       | 0.038               | 0                                                                                          | 0               |
| Node 26 full matrix                                                     | 2    | 173       | 0.027               | 0                                                                                          | 0               |
| Node 26 full matrix                                                     | 3    | 200       | 0.029               | 0                                                                                          | 0               |
| Node 22.23 (V8 12.4)                                                    | 1    | 153       | 0.037               | 0                                                                                          | 0               |
| Node 24.21 (V8 13.6)                                                    | 1    | 153       | 0.036               | 0                                                                                          | 0               |
| Bun 1.4.2 (JavaScriptCore), second runner                               | 1    | 153       | 0.054               | 0                                                                                          | 0               |
| One scope-hoisted bundle (Node 26)                                      | 1    | 16        | 0.037               | 0                                                                                          | 0               |
| One scope-hoisted bundle (Node 26)                                      | 2    | 7         | 0.017               | 0                                                                                          | 0               |
| CJS through `require` (Node 26)                                         | 1    | 16        | 0.155               | 0                                                                                          | 0               |
| CJS through `require` (Node 26)                                         | 2    | 7         | 0.167               | 0                                                                                          | 0               |
| No JIT pollution before measuring (P0)                                  | 1    | 12        | 0.026               | 0                                                                                          | 0               |
| No JIT pollution before measuring (P0)                                  | 2    | 21        | 0.143               | 0                                                                                          | 0               |
| No JIT pollution before measuring (P0)                                  | 3    | 15        | 0.236               | 0                                                                                          | 0               |
| Narrow pollution (P1: `map`/`filter`/`find`/`take` over 10 item shapes) | 1    | 12        | 0.024               | 0                                                                                          | 0               |
| Narrow pollution (P1: `map`/`filter`/`find`/`take` over 10 item shapes) | 2    | 21        | 0.024               | 0                                                                                          | 0               |
| Narrow pollution (P1: `map`/`filter`/`find`/`take` over 10 item shapes) | 3    | 15        | 0.017               | 0                                                                                          | 0               |
| Node 26, second runner (no vitest)                                      | 1    | 153       | 0.026               | 2 (G7 \| isDeepEqual data-first \| C: regression; G7 \| range data-first \| C: regression) | 2               |
| Node 26, one library copy per process                                   | 1    | 16        | 0.044               | 0                                                                                          | 0               |
| Node 26, one library copy per process                                   | 2    | 7         | 0.045               | 0                                                                                          | 0               |
| Interpreter only (`--jitless`)                                          | 3    | 153       | 0.018               | 0                                                                                          | 0               |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug)                    | 3    | 153       | 0.022               | 0                                                                                          | 0               |
| Mid-tier compiler ceiling (`--max-opt=2`, Maglev)                       | 3    | 153       | 0.021               | 0                                                                                          | 0               |

Totals over all run sets: tier 1 2 false calls in 837 scenario judgments (0.2%; 2 bar calls), tier 2 0 in 236, tier 3 0 in 689. Full matrix alone: 0 in 526.

### Watch list

Everything other than a plain pass: tier 3 "slower" verdicts, tier 1 scenarios with one run order beyond the floor (neutral by the rule), A/A false calls. Readings in `acceptance.md`.

| run set                                              | scenario                  | size | tier | median | branch/main per run                            | A/A per run                              | flags                                                           |
| ---------------------------------------------------- | ------------------------- | ---- | ---- | ------ | ---------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| Node 26 full matrix                                  | G7 mapValues data-first   | C    | 1    | 1.015  | 0.961m, 1.015m, 1.394b, 1.383b, 1.014m, 0.987m | 0.961, 0.983, 1.028, 0.991, 0.982, 1.009 | tier 1: one order beyond the floor                              |
| Node 26 full matrix                                  | G7 mapValues data-last    | C    | 1    | 0.982  | 1.020m, 0.925m, 0.944b, 1.291b, 1.076m, 0.759m | 0.841, 1.100, 0.829, 1.056, 0.826, 0.758 | tier 1: one order beyond the floor                              |
| Node 26 full matrix                                  | G7 isDeepEqual data-first | C    | 1    | 0.981  | 0.957m, 1.090m, 0.982b, 1.102b, 0.930m, 0.981m | 0.983, 1.093, 1.009, 1.012, 0.968, 1.020 | tier 1: one order beyond the floor                              |
| Node 26 full matrix                                  | G7 groupBy data-first     | XS   | 1    | 1.021  | 1.017m, 0.977m, 1.064b, 1.038b, 1.025m, 0.977m | 0.978, 0.967, 1.008, 1.006, 1.023, 1.013 | tier 1: one order beyond the floor                              |
| Node 22.23 (V8 12.4)                                 | G7 mapValues data-first   | C    | 1    | 0.988  | 0.957m, 1.020m, 1.368b, 0.931b                 | 0.988, 1.092, 0.958, 0.962               | tier 1: one order beyond the floor                              |
| Node 24.21 (V8 13.6)                                 | G7 isDeepEqual data-first | C    | 1    | 1.012  | 1.022m, 0.998m, 1.002b, 1.089b                 | 0.955, 0.999, 1.014, 1.103               | tier 1: one order beyond the floor                              |
| Node 24.21 (V8 13.6)                                 | G7 groupBy data-first     | XS   | 1    | 1.001  | 0.963m, 0.979m, 1.058b, 1.023b                 | 0.965, 0.972, 0.997, 0.997               | tier 1: one order beyond the floor                              |
| Bun 1.4.2 (JavaScriptCore), second runner            | G5 data-first filter      | XS   | 1    | 1.035  | 1.026m, 1.209m, 1.045b, 0.943b                 | 1.046, 1.056, 1.018, 0.995               | tier 1: one order beyond the floor                              |
| Node 26, second runner (no vitest)                   | G7 mapValues data-first   | C    | 1    | 1.045  | 0.928m, 1.043m, 1.053b, 1.046b                 | 0.973, 1.000, 1.105, 0.967               | tier 1: one order beyond the floor                              |
| Node 26, second runner (no vitest)                   | G7 isDeepEqual data-first | C    | 1    | 0.995  | 1.018m, 1.000m, 0.982b, 0.989b                 | 1.073, 1.045, 0.988, 1.086               | A/A false call (regression)                                     |
| Node 26, second runner (no vitest)                   | G7 range data-first       | S    | 1    | 1.007  | 1.005m, 1.005m, 1.010b, 1.119b                 | 0.997, 0.957, 0.994, 0.998               | tier 1: one order beyond the floor                              |
| Node 26, second runner (no vitest)                   | G7 range data-first       | C    | 1    | 1.015  | 1.000m, 1.024m, 1.006b, 1.173b                 | 1.003, 1.064, 1.002, 1.139               | tier 1: one order beyond the floor; A/A false call (regression) |
| Node 26, one library copy per process                | G5 data-first map         | S    | 1    | 1.014  | 1.134m, 1.017m, 1.000b, 1.011b                 | 1.006, 0.989, 0.994, 1.000               | tier 1: one order beyond the floor                              |
| Interpreter only (`--jitless`)                       | G7 entries data-last      | XS   | 3    | 1.052  | 1.058m, 1.039m, 1.053b, 1.051b                 | 1.015, 0.985, 1.018, 1.008               | tier 3 slower (report only)                                     |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 entries data-last      | XS   | 3    | 1.063  | 1.068m, 1.058m, 1.048b, 1.081b                 | 0.998, 1.005, 1.002, 1.017               | tier 3 slower (report only)                                     |
| Baseline compiler ceiling (`--max-opt=1`, Sparkplug) | G7 entries data-last      | S    | 3    | 1.060  | 1.066m, 1.054m, 1.039b, 1.065b                 | 1.011, 1.000, 1.000, 1.005               | tier 3 slower (report only)                                     |

Suffix per run: `b` = the branch ran before main, `m` = main ran first.

## 4. Memory, bundle, cold start, reactive stores

### Bytes allocated per call and GC (`results/publication/alloc.md`)

Bytes per call: median of 3 GC-free windows (gc(), used_heap_size delta over N calls / N). Per-item divides by the input items per call (XS = 256 x 0/1/3, S = 64 x 16, C = 64 x 100). GC: GCProfiler over a 2s steady loop with default heap flags.

| scenario                                 | size | main B/call | branch B/call | branch/main | GC-free | main GCs (ms) / 1k calls | branch GCs (ms) / 1k calls |
| ---------------------------------------- | ---- | ----------- | ------------- | ----------- | ------- | ------------------------ | -------------------------- |
| G1 map reading data                      | M    | 206.0 KiB   | 96.0 KiB      | 0.466       | yes     | 13.48 (0.48 ms)          | 2.93 (0.11 ms)             |
| G1 filter+map                            | XS   | 495.8 KiB   | 329.8 KiB     | 0.665       | yes     | 15.11 (0.56 ms)          | 10.06 (0.37 ms)            |
| G1 filter+map                            | S    | 320.1 KiB   | 123.7 KiB     | 0.386       | yes     | 9.75 (0.36 ms)           | 3.77 (0.14 ms)             |
| G1 filter+map                            | C    | 1.60 MiB    | 398.6 KiB     | 0.243       | yes     | 50.00 (1.98 ms)          | 12.16 (0.52 ms)            |
| G1 filter+map                            | M    | 261.4 KiB   | 58.2 KiB      | 0.223       | yes     | 7.96 (0.32 ms)           | 1.78 (0.07 ms)             |
| G1 map+filter+map                        | M    | 478.3 KiB   | 68.9 KiB      | 0.144       | yes     | 14.55 (0.61 ms)          | 2.09 (0.09 ms)             |
| G1 map+filter+map                        | L    | 46.75 MiB   | 6.52 MiB      | 0.139       | yes     | 1154.61 (207.82 ms)      | 129.63 (11.68 ms)          |
| G1 flatMap+filter+map                    | M    | 1.18 MiB    | 109.7 KiB     | 0.091       | yes     | 36.58 (1.77 ms)          | 3.33 (0.17 ms)             |
| G2 deep-8 primitive                      | M    | 1.05 MiB    | 60.6 KiB      | 0.056       | yes     | 32.57 (1.60 ms)          | 1.84 (0.13 ms)             |
| G2 deep-8 primitive                      | L    | 107.88 MiB  | 6.52 MiB      | 0.060       | yes     | 2687.50 (824.54 ms)      | 130.21 (17.18 ms)          |
| G2 deep-8 object                         | M    | 948.5 KiB   | 60.5 KiB      | 0.064       | yes     | 28.65 (1.41 ms)          | 1.83 (0.10 ms)             |
| G2 deep-8 object                         | L    | 93.71 MiB   | 5.65 MiB      | 0.060       | yes     | 2381.94 (939.22 ms)      | 130.00 (15.75 ms)          |
| G5 data-first map                        | S    | 18.5 KiB    | 18.5 KiB      | 1.000       | yes     | 0.56 (0.03 ms)           | 0.56 (0.02 ms)             |
| G5 data-first map                        | C    | 60.7 KiB    | 60.7 KiB      | 1.000       | yes     | 1.85 (0.09 ms)           | 1.86 (0.10 ms)             |
| G5 data-first unique                     | M    | 224.5 KiB   | 98.5 KiB      | 0.438       | yes     | 6.79 (0.32 ms)           | 3.00 (0.14 ms)             |
| G9 map((...args) => args[0])             | C    | 1.33 MiB    | 607.1 KiB     | 0.446       | yes     | 39.80 (1.82 ms)          | 17.66 (0.84 ms)            |
| G10 filter,map / sortBy / take / groupBy | C    | 1.91 MiB    | 645.5 KiB     | 0.330       | yes     | 59.32 (2.92 ms)          | 19.54 (0.97 ms)            |

Steady loop totals (2s per entry):

| scenario                                 | size | main calls | main GCs | main GC ms | branch calls | branch GCs | branch GC ms |
| ---------------------------------------- | ---- | ---------- | -------- | ---------- | ------------ | ---------- | ------------ |
| G1 map reading data                      | M    | 61264      | 826      | 29.2       | 138288       | 405        | 15.5         |
| G1 filter+map                            | XS   | 39056      | 590      | 22.0       | 60512        | 609        | 22.5         |
| G1 filter+map                            | S    | 39488      | 385      | 14.1       | 82736        | 312        | 11.5         |
| G1 filter+map                            | C    | 7280       | 364      | 14.4       | 17440        | 212        | 9.1          |
| G1 filter+map                            | M    | 48096      | 383      | 15.6       | 117104       | 208        | 8.6          |
| G1 map+filter+map                        | M    | 29280      | 426      | 17.7       | 83072        | 174        | 7.3          |
| G1 map+filter+map                        | L    | 304        | 351      | 63.2       | 864          | 112        | 10.1         |
| G1 flatMap+filter+map                    | M    | 10880      | 398      | 19.2       | 32400        | 108        | 5.5          |
| G2 deep-8 primitive                      | M    | 13264      | 432      | 21.3       | 38144        | 70         | 4.8          |
| G2 deep-8 primitive                      | L    | 128        | 344      | 105.5      | 384          | 50         | 6.6          |
| G2 deep-8 object                         | M    | 14416      | 413      | 20.3       | 39424        | 72         | 3.8          |
| G2 deep-8 object                         | L    | 144        | 343      | 135.2      | 400          | 52         | 6.3          |
| G5 data-first map                        | S    | 281680     | 159      | 7.2        | 280912       | 158        | 6.8          |
| G5 data-first map                        | C    | 56640      | 105      | 5.1        | 57120        | 106        | 5.8          |
| G5 data-first unique                     | M    | 41840      | 284      | 13.3       | 83248        | 250        | 11.3         |
| G9 map((...args) => args[0])             | C    | 9824       | 391      | 17.9       | 23504        | 415        | 19.7         |
| G10 filter,map / sortBy / take / groupBy | C    | 5344       | 317      | 15.6       | 9824         | 192        | 9.5          |

Calibration (bytes mode):

- emptyClosure: 0.3 B/call (N=2000)
- threeFieldObject: 48.3 B/call (N=2000)
- array16: 32.3 B/call (N=2000)

### Peak live heap at 100,000 items (`results/publication/peak.json`)

Peak: highest `heapUsed` read inside the last call of each callback after `gc()`, minus the heap before the call. Retained: the heap after the call with the result held. KiB. Scenarios without callbacks have no peak (`-`). Readings under about 20 KiB are within measurement noise (see main-aa).

| scenario                                                                                    | main peak | branch peak | main-aa peak | branch/main | main-aa/main | main retained | branch retained | main-aa retained |
| ------------------------------------------------------------------------------------------- | --------- | ----------- | ------------ | ----------- | ------------ | ------------- | --------------- | ---------------- |
| G1 map                                                                                      | 1,806     | 914         | 1,797        | 0.506       | 0.995        | 888           | 897             | 895              |
| G1 map reading data                                                                         | 1,802     | 1,818       | 1,798        | 1.009       | 0.998        | 894           | 903             | 895              |
| G1 filter+map                                                                               | 2,098     | 626         | 2,099        | 0.298       | 1.001        | 596           | 606             | 597              |
| G1 map+filter+map                                                                           | 3,591     | 904         | 3,588        | 0.252       | 0.999        | 898           | 895             | 895              |
| G1 flatMap+filter+map                                                                       | 6,944     | 2,037       | 6,945        | 0.293       | 1.000        | 2,013         | 2,022           | 2,013            |
| G1 flat+map                                                                                 | 2,193     | 899         | 2,193        | 0.410       | 1.000        | 895           | 895             | 895              |
| G1 drop+take                                                                                | -         | -           | -            | -           | -            | 390           | 397             | 389              |
| G1 map+unique                                                                               | 4,962     | 3,163       | 4,953        | 0.637       | 0.998        | 606           | 596             | 596              |
| G1 uniqueBy                                                                                 | 4,057     | 3,163       | 4,057        | 0.779       | 1.000        | 596           | 596             | 596              |
| G1 filter+map+take(10)                                                                      | 5         | 5           | 5            | -           | -            | 1             | 1               | 1                |
| G1 find early hit                                                                           | 19        | 189         | 211          | -           | -            | -6            | -6              | -6               |
| G1 find late hit                                                                            | 901       | 6           | 901          | 0.007       | 1.000        | 0             | 0               | 0                |
| G1 find miss                                                                                | 901       | 6           | 901          | 0.007       | 1.000        | 0             | 0               | 0                |
| G1 filter+first                                                                             | -3        | -4          | -3           | -           | -            | -7            | -7              | -7               |
| G1 3-step middle reads data                                                                 | 2,371     | 885         | 2,363        | 0.373       | 0.997        | 273           | 274             | 265              |
| G10 filter,map / sortBy / take / groupBy                                                    | 3,282     | 1,782       | 3,264        | 0.543       | 0.994        | 20            | 11              | 1                |
| G10 prop / filter,map,take / reverse / map / length                                         | 4         | 6           | 1            | -           | -            | -5            | 0               | -8               |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | 5,939     | 4,439       | 5,931        | 0.747       | 0.999        | 8             | -0              | -0               |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | 4,427     | 2,636       | 4,427        | 0.595       | 1.000        | 3             | 3               | 3                |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | 4,963     | 2,747       | 4,953        | 0.553       | 0.998        | 14            | 11              | 5                |

Shapes with a peak of 100 KiB or more on main and main-aa: 15; branch/main 0.007-1.009 (median 0.506); at or below main in 15 of 15. `find early hit` (main 19, main-aa 211, branch 189 KiB) is bimodal in main itself.

### Bundle size per import set (`results/publication/bundle.json`)

Minified ESM bundles of each import set against the built dist (`sideEffects: false` honored), gzip level 9, brotli quality 11. Sentinel columns: whether the branch's output contains the `UNEXPECTED_ACCESS_SENTINEL` Proxy (`new Proxy`) and its message, checked directly in `.bundle-work/*.out.js`. `bundle.md` reports the message as absent everywhere because `scripts/bundle-size.mjs` still searches for the old wording ("argument was read, but Remeda didn't provide it"); the direct check uses the final wording. main contains neither anywhere.

| import                               | bundler  | main min / gzip / brotli | branch min / gzip / brotli | min ratio | gzip ratio | brotli ratio | gzip delta | sentinel Proxy | sentinel message |
| ------------------------------------ | -------- | ------------------------ | -------------------------- | --------- | ---------- | ------------ | ---------- | -------------- | ---------------- |
| `import { map }`                     | esbuild  | 350 / 249 / 209          | 448 / 271 / 224            | 1.280     | 1.088      | 1.072        | +22        | no             | no               |
| `import { map }`                     | rolldown | 351 / 247 / 211          | 443 / 271 / 231            | 1.262     | 1.097      | 1.095        | +24        | no             | no               |
| `import { filter, map }`             | esbuild  | 500 / 289 / 241          | 634 / 365 / 317            | 1.268     | 1.263      | 1.315        | +76        | no             | no               |
| `import { filter, map }`             | rolldown | 505 / 293 / 253          | 631 / 371 / 326            | 1.250     | 1.266      | 1.289        | +78        | no             | no               |
| `import { pipe }`                    | esbuild  | 921 / 520 / 473          | 2475 / 1137 / 1029         | 2.687     | 2.187      | 2.175        | +617       | yes            | yes              |
| `import { pipe }`                    | rolldown | 922 / 517 / 466          | 2472 / 1124 / 1017         | 2.681     | 2.174      | 2.182        | +607       | yes            | yes              |
| `import { pipe, map, filter, take }` | esbuild  | 1577 / 783 / 714         | 3258 / 1478 / 1341         | 2.066     | 1.888      | 1.878        | +695       | yes            | yes              |
| `import { pipe, map, filter, take }` | rolldown | 1584 / 770 / 698         | 3265 / 1476 / 1339         | 2.061     | 1.917      | 1.918        | +706       | yes            | yes              |
| `import { unique }`                  | esbuild  | 1248 / 671 / 609         | 1376 / 746 / 649           | 1.103     | 1.112      | 1.066        | +75        | yes            | yes              |
| `import { unique }`                  | rolldown | 1249 / 661 / 602         | 1373 / 729 / 641           | 1.099     | 1.103      | 1.065        | +68        | yes            | yes              |
| `whole library`                      | esbuild  | 28146 / 9118 / 8221      | 29570 / 9829 / 8853        | 1.051     | 1.078      | 1.077        | +711       | yes            | yes              |
| `whole library`                      | rolldown | 28166 / 9088 / 8189      | 29598 / 9780 / 8759        | 1.051     | 1.076      | 1.070        | +692       | yes            | yes              |

In `{ map }` (esbuild), the per-arity data-last helper (`createDataLast`) is 143 of the 448 B; `requireData` and `canReadData` 71 B. In `{ unique }`, the sentinel (message, index pattern, Proxy and its two helpers) is about 500 of the 1376 B (esbuild), about 285 of the 746 gzipped bytes. main's `{ unique }` contains all of `pipe` (main's `purryFromLazy` imports it). Public declarations: the only change is `purry` (no third parameter) and the removed `LazyResult`/`LazyEmpty`/`LazyNext`/`LazyMany`/`LazyEvaluator` types it referenced.

### Cold start (`results/publication/cold.json`, Node 26, dist, 40 processes per copy and probe)

Each process imports one copy (the whole dist entry) and runs one probe 50 times with no warmup. Medians across processes; ratios copy/main. Band for the counts: +-5% (main-aa's largest deviation is 4.5%).

| probe                   | import ms main / branch | import ratio | first call us main / branch | first call ratio | first 50 calls us main / branch | first 50 ratio | main-aa: import / first / first 50 |
| ----------------------- | ----------------------- | ------------ | --------------------------- | ---------------- | ------------------------------- | -------------- | ---------------------------------- |
| data-first map S        | 14.19 / 14.64           | 1.032        | 41.5 / 35.7                 | 0.860            | 70.9 / 63.2                     | 0.891          | 0.999 / 1.000 / 1.045              |
| data-first unique S     | 14.28 / 14.68           | 1.028        | 147.6 / 88.9                | 0.603            | 395.4 / 205.6                   | 0.520          | 0.993 / 1.001 / 1.005              |
| pipe filter+map S       | 14.25 / 14.70           | 1.031        | 167.0 / 175.1               | 1.049            | 460.5 / 356.5                   | 0.774          | 0.999 / 1.013 / 0.999              |
| arrow pipe depth-3      | 14.21 / 14.70           | 1.034        | 59.1 / 66.7                 | 1.128            | 88.2 / 89.5                     | 1.014          | 0.995 / 0.996 / 1.011              |
| pipe map reading data S | 14.19 / 14.77           | 1.041        | 149.1 / 140.5               | 0.942            | 377.6 / 265.6                   | 0.703          | 1.001 / 0.999 / 1.001              |

### Reactive-store probes (`results/publication/reactive.json`, 5 runs, medians)

`pipe(items, filter(active), map(value * 2), take(10))` over 1,000 observable items, inside a Vue `computed` and a MobX `autorun`.

| store | copy    | re-eval median us | vs main | dependencies | on the control key | on absent keys | onTrack events | footprint KiB | growth over 1,200 re-evals KiB |
| ----- | ------- | ----------------- | ------- | ------------ | ------------------ | -------------- | -------------- | ------------- | ------------------------------ |
| vue   | main    | 5.71              | 1.000   | 31           | 0                  | -              | 31             | 31.4          | 27.6                           |
| vue   | branch  | 5.42              | 0.949   | 31           | 0                  | -              | 31             | 35.1          | 24.6                           |
| vue   | main-aa | 5.50              | 0.963   | 31           | 0                  | -              | 31             | 30.8          | 25.8                           |
| mobx  | main    | 5.21              | 1.000   | 31           | 0                  | 0              | -              | 844.7         | 68.6                           |
| mobx  | branch  | 4.87              | 0.936   | 31           | 0                  | 0              | -              | 844.5         | 70.5                           |
| mobx  | main-aa | 5.21              | 1.000   | 31           | 0                  | 0              | -              | 844.5         | 69.6                           |

Footprint varies between runs and stages (prepub: main -2.1, cand-full 6.1 KiB; main stage: main 30.4, branch 32.3 KiB), so the Vue footprint difference (35.1 vs 31.4 KiB, main-aa 30.8) is not a finding.

Proxy-trap counts per call (prepare's validation, `results/validate-dist.json`):

| scenario                            | main               | main-aa            | branch             | native             |
| ----------------------------------- | ------------------ | ------------------ | ------------------ | ------------------ |
| G8 \| pass-through Proxy items \| C | has 0 / get 10,240 | has 0 / get 10,240 | has 0 / get 10,240 | has 0 / get 10,240 |
| G8 \| pass-through Proxy items \| M | has 0 / get 1,600  | has 0 / get 1,600  | has 0 / get 1,600  | has 0 / get 1,600  |

Vue tracked dependencies per pipe shape (`scripts/vue-shapes.mjs`) were not run in this stage. The last reading is prepub's, on cand-full (the composition this branch implements): `pipe(items, filter, map, take(10))` 31, `pipe(items, find(id === 20))` 23, `pipe(items, take(10))` 2, data-first `find` 23, data-first `filter` 1002, all equal to main.

## 5. Small wins

Each change was confirmed by the sign-consistent rule before it went in: faster than its reference in every run on its target flow, geomean 0.99 or lower, no tier-bar loss it causes, and the same test firing on A/A under 5% of the time. Main stage: 6 runs (rotations 0-5), scale 0.5, the variant next to main, main-aa and the branch at `144fdc8b`, target flow plus the `T1G` guard, reference = that branch. Prepub: 6 cyclic rotations, reference = `cand-base` (design B without the change).

| commit     | change                                                                     | variant                                                  | stage  | flow scenarios | per-run gm  | gm    | faster runs | note                                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------- | -------------------------------------------------------- | ------ | -------------- | ----------- | ----- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e3964dfb` | Lazy controls told apart by identity alone, with a per-run payload slot    | identity-controls-v2                                     | main   | 279            | 0.848-0.850 | 0.849 | 6/6         | design B; vs the branch then: T1 0.911, T2 0.832, T3 0.787; Proxy items see no `has` trap                                                             |
| `0d9932d0` | `pipe` builds lazy runs on demand; one-function runs skip step objects     | pipe-single-step-runs (contains pipe-on-demand-segments) | main   | 59             | 0.953-0.982 | 0.973 | 6/6         | also removed the non-lazy pipe slowdown (G3 1.10-1.35x) of the earlier revision                                                                       |
| `81be5b32` | The iterable check tests `Array.isArray` first                             | pipe-isarray-first                                       | main   | 118            | 0.944-0.952 | 0.949 | 6/6         |                                                                                                                                                       |
| `a0e9ffff` | Data-last functions get their lazy props by direct writes                  | datalast-direct-props                                    | main   | 138            | 0.882-0.888 | 0.886 | 6/6         |                                                                                                                                                       |
| `a0e9ffff` | Data-last functions: one closure per argument count                        | datalast-arity-closures                                  | main   | 88             | 0.989-0.994 | 0.991 | 6/6         | near miss (above 0.99), kept by decision: it fixes `clamp` data-last C (1.051 on the earlier revision)                                                |
| `37658b5c` | `unique` and `uniqueBy`: one Set lookup per item                           | unique-single-lookup                                     | main   | 13             | 0.978-0.993 | 0.985 | 6/6         |                                                                                                                                                       |
| `1b8b91e7` | Marking an evaluator that reads `data` with a direct write                 | requiredata-direct-write                                 | main   | 150            | 0.990-1.012 | 1.000 | 3/6         | inconclusive on its declared flow; 6/6 faster on the 19 entries whose callbacks read `data` or declare no parameters (XS 0.85-0.97); kept by decision |
| `951130f5` | The `data` error helper in its own module                                  | sentinel-module                                          | main   | 106            | 0.998-1.003 | 1.000 | 4/6         | timing-neutral; kept for bundle size (keeps the helper out of `{ map }` and `{ filter, map }`)                                                        |
| `475e59f1` | `map` hands a callback that can't read `data` to `pipe` as the step itself | cand-map (map shortcut on the slot protocol)             | prepub | 71             | 0.921-0.924 | 0.922 | 6/6         | vs cand-base                                                                                                                                          |
| `faf0b09b` | Dedicated array `for...of` loops (no indexed reads)                        | cand-forof                                               | prepub | 178            | 0.960-0.971 | 0.965 | 6/6         | vs cand-base; reactive-store dependencies equal main's (31 / 23 / 2 in the three Vue shapes)                                                          |

Combined in prepub (cand-full vs main): T1 0.625, T2 0.496, T3 0.524; vs cand-base: T1 0.941, T2 0.934, T3 0.934. A/A floors there 0.039 / 0.039 / 0.038, false calls 0. Map shortcut and for...of rework both PASS; Vue gate ok. The map-shortcut slot redesign is no longer needed for speed: the shortcut shipped on the slot protocol and passed (0.922).

## 6. Provenance

- Branch: `eranhirsch/performantPipe` at `ad8d37be0d8c23386cf8d2ecba0b5b48eee5c3b3`. Main: `8e6e78f6eaf66eaf0b4797d72cc3691823c91335`. Copies: `libs/main`, `libs/main-aa` (main as separate module instances, the A/A control), `libs/branch` (`git archive` snapshots, built with tsdown).
- Commits measured on top of the earlier revision `144fdc8b`: 951130f5, 1b8b91e7, e3964dfb, 0d9932d0, 81be5b32, faf0b09b, 475e59f1, a0e9ffff, 37658b5c, d2a58af9 (JSDoc), ccba9e2d (scaffolding removal), ad8d37be (skill docs).
- Runtimes: Node v26.9.0 (V8 14.6.202.34-node.32) for everything not marked otherwise; Node v22.23.3 (V8 12.4.254.21-node.57); Node v24.21.0 (V8 13.6.233.17-node.53); Bun 1.4.2 (revision 2e2aa229, JavaScriptCore).
- Machine: Apple M4 Pro, macOS 26.6.2 (25G83). Every run's meta reports AC power ("AC attached; not charging", battery 80%). 1-minute load at run start 0.97-2.62. The watcher's idle counter rose monotonically from 6,077 s to 23,856 s across the stage: no user input during measurement.
- Full matrix: 6 rotations of main / branch / main-aa (each copy in each position twice); rotation 0 in two parts (G1-G6, G7-G10) with native entries; vitest bench runner, built ESM (`dist`), pollution P2, `gc()` before every task, scale 1 (500 ms per task, 1,500 ms at L; warmups 100 / 300 ms).
- Extras: 4 runs each (rotations 0 and 1, twice: both orders of main and branch). Lower JIT tiers, Node 22/24, Bun and the second runner on the tier 1 subset (153); P0/P1 on G1/G2/G10 at C/M (48); bundle, CJS and one copy per process on the headline subset (23). Flags verified in each worker's `[perf setup]` line (`jitless=true`, `maxOpt=1/2`, runtime versions, `source=bundle/cjs`, `pollution=P0/P1`).
- Validation before measuring (prepare, same SHAs): dist 526 scenarios, 18,643,488 traced callback calls, 0 output and 0 trace mismatches, cross-copy 20/20; CJS 118 scenarios, 1,469,288 calls, 0 mismatches; bundle 118 scenarios, 0 mismatches, cross-copy 20/20.
- Rules fixed before the run: `harness/verdicts.js` (2026-10-07 10:33), `harness/tiers.js` (10:23), `tier-overrides.json` (10:22), `research/popularity.json` (10:19), all before the main stage started (2026-10-07 13:15) and before this stage (2026-10-08 12:08). `scripts/aggregate.mjs` last changed 2026-10-08 09:42 (skips the variant report for runs without a branch copy; no rule change). Popularity: 2,143 de-duplicated public files importing remeda (121 repo clusters).
- Dates (IDT, UTC+3): main stage 2026-10-07 13:15-21:59; prepub 2026-10-08 10:06-11:44; publication 2026-10-08 12:08-17:04: prepare 12:08, full matrix 12:08-14:14, extras 14:14-17:02, alloc / peak heap / bundle / cold start / reactive 17:02-17:04, reports 17:04.

| run                  | order                 | runner   | source | pollution | runtime      | flags       | started (UTC)       | wall   | load 1m |
| -------------------- | --------------------- | -------- | ------ | --------- | ------------ | ----------- | ------------------- | ------ | ------- |
| full-r0-a-c1         | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | -           | 2026-10-08 09:08:26 | 1167 s | 1.40    |
| full-r0-a-c2         | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | -           | 2026-10-08 09:27:53 | 354 s  | 1.73    |
| full-r0-b-c1         | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | -           | 2026-10-08 10:11:19 | 1167 s | 1.20    |
| full-r0-b-c2         | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | -           | 2026-10-08 10:30:46 | 354 s  | 1.64    |
| full-r1-a            | branch, main-aa, main | vitest   | dist   | P2        | v26.9.0      | -           | 2026-10-08 09:33:47 | 1125 s | 1.39    |
| full-r1-b            | branch, main-aa, main | vitest   | dist   | P2        | v26.9.0      | -           | 2026-10-08 10:36:41 | 1126 s | 1.37    |
| full-r2-a            | main-aa, main, branch | vitest   | dist   | P2        | v26.9.0      | -           | 2026-10-08 09:52:33 | 1126 s | 1.33    |
| full-r2-b            | main-aa, main, branch | vitest   | dist   | P2        | v26.9.0      | -           | 2026-10-08 10:55:27 | 1124 s | 1.54    |
| x-node22-r0-a        | main, branch, main-aa | vitest   | dist   | P2        | v22.23.3     | -           | 2026-10-08 12:27:10 | 321 s  | 0.99    |
| x-node22-r0-b        | main, branch, main-aa | vitest   | dist   | P2        | v22.23.3     | -           | 2026-10-08 12:37:52 | 321 s  | 1.21    |
| x-node22-r1-a        | branch, main-aa, main | vitest   | dist   | P2        | v22.23.3     | -           | 2026-10-08 12:32:31 | 322 s  | 1.18    |
| x-node22-r1-b        | branch, main-aa, main | vitest   | dist   | P2        | v22.23.3     | -           | 2026-10-08 12:43:14 | 321 s  | 0.97    |
| x-node24-r0-a        | main, branch, main-aa | vitest   | dist   | P2        | v24.21.0     | -           | 2026-10-08 12:48:35 | 328 s  | 1.36    |
| x-node24-r0-b        | main, branch, main-aa | vitest   | dist   | P2        | v24.21.0     | -           | 2026-10-08 12:59:33 | 328 s  | 1.15    |
| x-node24-r1-a        | branch, main-aa, main | vitest   | dist   | P2        | v24.21.0     | -           | 2026-10-08 12:54:03 | 330 s  | 1.25    |
| x-node24-r1-b        | branch, main-aa, main | vitest   | dist   | P2        | v24.21.0     | -           | 2026-10-08 13:05:01 | 330 s  | 1.24    |
| x-bun-r0-a           | main, branch, main-aa | portable | dist   | P2        | bun 1.4.2    | -           | -                   | 305 s  | 1.71    |
| x-bun-r0-b           | main, branch, main-aa | portable | dist   | P2        | bun 1.4.2    | -           | -                   | 305 s  | 2.57    |
| x-bun-r1-a           | branch, main-aa, main | portable | dist   | P2        | bun 1.4.2    | -           | -                   | 305 s  | 1.95    |
| x-bun-r1-b           | branch, main-aa, main | portable | dist   | P2        | bun 1.4.2    | -           | -                   | 305 s  | 2.62    |
| x-bundle-r0-a        | main, branch, main-aa | vitest   | bundle | P2        | v26.9.0      | -           | 2026-10-08 13:10:31 | 44 s   | 1.17    |
| x-bundle-r0-b        | main, branch, main-aa | vitest   | bundle | P2        | v26.9.0      | -           | 2026-10-08 13:11:59 | 44 s   | 1.32    |
| x-bundle-r1-a        | branch, main-aa, main | vitest   | bundle | P2        | v26.9.0      | -           | 2026-10-08 13:11:15 | 44 s   | 1.28    |
| x-bundle-r1-b        | branch, main-aa, main | vitest   | bundle | P2        | v26.9.0      | -           | 2026-10-08 13:12:43 | 44 s   | 1.19    |
| x-cjs-r0-a           | main, branch, main-aa | vitest   | cjs    | P2        | v26.9.0      | -           | 2026-10-08 13:13:27 | 44 s   | 1.17    |
| x-cjs-r0-b           | main, branch, main-aa | vitest   | cjs    | P2        | v26.9.0      | -           | 2026-10-08 13:14:56 | 44 s   | 2.59    |
| x-cjs-r1-a           | branch, main-aa, main | vitest   | cjs    | P2        | v26.9.0      | -           | 2026-10-08 13:14:11 | 44 s   | 1.13    |
| x-cjs-r1-b           | branch, main-aa, main | vitest   | cjs    | P2        | v26.9.0      | -           | 2026-10-08 13:15:40 | 44 s   | 2.34    |
| x-p0-r0-a            | main, branch, main-aa | vitest   | dist   | P0        | v26.9.0      | -           | 2026-10-08 12:15:00 | 91 s   | 1.56    |
| x-p0-r0-b            | main, branch, main-aa | vitest   | dist   | P0        | v26.9.0      | -           | 2026-10-08 12:18:03 | 91 s   | 1.56    |
| x-p0-r1-a            | branch, main-aa, main | vitest   | dist   | P0        | v26.9.0      | -           | 2026-10-08 12:16:32 | 91 s   | 1.50    |
| x-p0-r1-b            | branch, main-aa, main | vitest   | dist   | P0        | v26.9.0      | -           | 2026-10-08 12:19:34 | 91 s   | 1.46    |
| x-p1-r0-a            | main, branch, main-aa | vitest   | dist   | P1        | v26.9.0      | -           | 2026-10-08 12:21:05 | 91 s   | 1.38    |
| x-p1-r0-b            | main, branch, main-aa | vitest   | dist   | P1        | v26.9.0      | -           | 2026-10-08 12:24:07 | 91 s   | 1.16    |
| x-p1-r1-a            | branch, main-aa, main | vitest   | dist   | P1        | v26.9.0      | -           | 2026-10-08 12:22:36 | 91 s   | 1.34    |
| x-p1-r1-b            | branch, main-aa, main | vitest   | dist   | P1        | v26.9.0      | -           | 2026-10-08 12:25:38 | 91 s   | 1.49    |
| x-portable-node-r0-a | main, branch, main-aa | portable | dist   | P2        | node v26.9.0 | -           | -                   | 326 s  | 1.18    |
| x-portable-node-r0-b | main, branch, main-aa | portable | dist   | P2        | node v26.9.0 | -           | -                   | 323 s  | 1.33    |
| x-portable-node-r1-a | branch, main-aa, main | portable | dist   | P2        | node v26.9.0 | -           | -                   | 324 s  | 1.85    |
| x-portable-node-r1-b | branch, main-aa, main | portable | dist   | P2        | node v26.9.0 | -           | -                   | 324 s  | 1.36    |
| x-isolated-r0-a      | main, branch, main-aa | portable | dist   | P2        | node v26.9.0 | per process | -                   | 61 s   | 1.54    |
| x-isolated-r0-b      | main, branch, main-aa | portable | dist   | P2        | node v26.9.0 | per process | -                   | 61 s   | 1.25    |
| x-isolated-r1-a      | branch, main-aa, main | portable | dist   | P2        | node v26.9.0 | per process | -                   | 61 s   | 1.50    |
| x-isolated-r1-b      | branch, main-aa, main | portable | dist   | P2        | node v26.9.0 | per process | -                   | 61 s   | 1.20    |
| x-jitless-r0-a       | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | --jitless   | 2026-10-08 11:14:12 | 300 s  | 1.76    |
| x-jitless-r0-b       | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | --jitless   | 2026-10-08 11:24:11 | 299 s  | 1.60    |
| x-jitless-r1-a       | branch, main-aa, main | vitest   | dist   | P2        | v26.9.0      | --jitless   | 2026-10-08 11:19:11 | 299 s  | 1.30    |
| x-jitless-r1-b       | branch, main-aa, main | vitest   | dist   | P2        | v26.9.0      | --jitless   | 2026-10-08 11:29:10 | 300 s  | 1.06    |
| x-maxopt1-r0-a       | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | --max-opt=1 | 2026-10-08 11:34:10 | 301 s  | 1.11    |
| x-maxopt1-r0-b       | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | --max-opt=1 | 2026-10-08 11:44:13 | 302 s  | 1.46    |
| x-maxopt1-r1-a       | branch, main-aa, main | vitest   | dist   | P2        | v26.9.0      | --max-opt=1 | 2026-10-08 11:39:11 | 301 s  | 1.19    |
| x-maxopt1-r1-b       | branch, main-aa, main | vitest   | dist   | P2        | v26.9.0      | --max-opt=1 | 2026-10-08 11:49:15 | 302 s  | 1.35    |
| x-maxopt2-r0-a       | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | --max-opt=2 | 2026-10-08 11:54:16 | 311 s  | 1.48    |
| x-maxopt2-r0-b       | main, branch, main-aa | vitest   | dist   | P2        | v26.9.0      | --max-opt=2 | 2026-10-08 12:04:38 | 311 s  | 1.31    |
| x-maxopt2-r1-a       | branch, main-aa, main | vitest   | dist   | P2        | v26.9.0      | --max-opt=2 | 2026-10-08 11:59:28 | 311 s  | 1.45    |
| x-maxopt2-r1-b       | branch, main-aa, main | vitest   | dist   | P2        | v26.9.0      | --max-opt=2 | 2026-10-08 12:09:50 | 311 s  | 1.24    |
