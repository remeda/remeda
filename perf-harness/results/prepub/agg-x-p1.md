# cand-full vs main, P1

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run            | entry order                     | runner | source | pollution | node    | flags | scale | wall |
| -------------- | ------------------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| prepub/x-p1-r0 | main,branch-v-cand-full,main-aa | vitest | dist   | P1        | v26.9.0 | -     | 1     | 34 s |
| prepub/x-p1-r1 | branch-v-cand-full,main-aa,main | vitest | dist   | P1        | v26.9.0 | -     | 1     | 34 s |

Popularity: research/popularity.json.

Tier overrides (tier-overrides.json; research/popularity.json is untouched):

| function   | kinds      | sizes | tier | scenarios changed here | reason                                                                                                                                                                                                                      |
| ---------- | ---------- | ----- | ---- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| difference | data-first | all   | 1    | 0                      | Biggest adopter: @prisma/dev (29M downloads/month, 62% of remeda's own) calls only difference and range, both data-first (difference(range(a, b), used)); difference's mid popularity would otherwise drop these to tier 2. |
| range      | data-first | all   | 1    | 0                      | The other half of the same @prisma/dev call (range data-first); range's mid popularity would otherwise drop it to tier 2.                                                                                                   |

## A/A noise floors and false-call rate

Floor: p95 of |main-aa/main - 1| over the tier's (scenario, run) pairs. False calls: the tier's verdict rule applied to main-aa vs main (anything but neutral is a false call; bar = regression or BLOCK).

| tier | pairs | median abs dev | p95 abs dev (floor) | max   | A/A scenarios | false calls | false bar calls |
| ---- | ----- | -------------- | ------------------- | ----- | ------------- | ----------- | --------------- |
| 1    | 10    | 0.005          | 0.029               | 0.030 | 5             | 0 (0.0%)    | 0               |
| 2    | 14    | 0.002          | 0.011               | 0.013 | 7             | 0 (0.0%)    | 0               |
| 3    | 12    | 0.006          | 0.009               | 0.010 | 6             | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy               | T1 gm | T1 verdicts | T2 gm | T2 verdicts | T3 gm | T3 verdicts | bar violations |
| ------------------ | ----- | ----------- | ----- | ----------- | ----- | ----------- | -------------- |
| branch-v-cand-full | 0.658 | faster 5    | 0.702 | faster 7    | 0.510 | faster 6    | 0              |
| main-aa            | 0.999 | neutral 5   | 1.001 | neutral 7   | 0.998 | neutral 6   | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy               | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------------------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch-v-cand-full | 0              | 0.658 | 0.702 | 0.510 | -       |

## Tier 1: branch-v-cand-full vs main (5 scenarios, weighted geomean 0.658, floor 0.029)

| scenario                                                                                    | size | pop  | main      | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | high | 927.21 us | 706.25 us          | 0.762 [0.755..0.768] | 0.762 [0.756..0.768] | 0.768      | 0.755      | 1.002 [1.001..1.002] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | high | 221.81 us | 141.31 us          | 0.637 [0.630..0.644] | 0.635 [0.629..0.642] | 0.644      | 0.630      | 1.012 [0.994..1.030] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | high | 537.83 us | 442.81 us          | 0.823 [0.798..0.848] | 0.816 [0.799..0.834] | 0.848      | 0.798      | 0.988 [0.971..1.005] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | high | 634.92 us | 394.46 us          | 0.621 [0.621..0.622] | 0.620 [0.619..0.621] | 0.621      | 0.622      | 0.993 [0.993..0.994] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | high | 96.98 us  | 48.25 us           | 0.498 [0.490..0.505] | 0.496 [0.489..0.504] | 0.505      | 0.490      | 1.000 [1.000..1.000] | -           | **faster** |

## Tier 2: branch-v-cand-full vs main (7 scenarios, weighted geomean 0.702, floor 0.011)

| scenario                                                                                    | size | pop  | main      | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G2 deep-15 mixed                                                                            | M    | high | 135.08 us | 88.46 us           | 0.655 [0.650..0.660] | 0.647 [0.644..0.650] | 0.660      | 0.650      | 1.005 [0.997..1.013] | -           | **faster** |
| G2 deep-8 mixed                                                                             | M    | high | 81.56 us  | 50.31 us           | 0.617 [0.616..0.618] | 0.609 [0.606..0.611] | 0.618      | 0.616      | 1.004 [1.000..1.008] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | high | 152.17 us | 122.48 us          | 0.805 [0.803..0.806] | 0.801 [0.799..0.804] | 0.806      | 0.803      | 1.003 [0.999..1.007] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | high | 43.75 us  | 32.90 us           | 0.752 [0.752..0.752] | 0.746 [0.746..0.747] | 0.752      | 0.752      | 0.999 [0.997..1.000] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | high | 78.02 us  | 66.40 us           | 0.851 [0.843..0.859] | 0.845 [0.834..0.857] | 0.859      | 0.843      | 1.003 [0.998..1.008] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | high | 88.27 us  | 70.25 us           | 0.796 [0.789..0.803] | 0.790 [0.784..0.797] | 0.803      | 0.789      | 0.995 [0.990..1.000] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | high | 1.56 us   | 792.0 ns           | 0.507 [0.500..0.514] | 0.499 [0.494..0.503] | 0.514      | 0.500      | 1.000 [1.000..1.000] | -           | **faster** |

## Tier 3: branch-v-cand-full vs main (6 scenarios, weighted geomean 0.510, floor 0.009)

| scenario                 | size | pop  | main      | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------ | ---- | ---- | --------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G2 deep-15 flatMap-first | M    | high | 375.56 us | 182.50 us          | 0.486 [0.484..0.488] | 0.478 [0.478..0.479] | 0.488      | 0.484      | 0.994 [0.991..0.998] | -           | **faster** |
| G2 deep-15 object        | M    | high | 135.81 us | 72.54 us           | 0.534 [0.532..0.536] | 0.527 [0.525..0.529] | 0.532      | 0.536      | 1.006 [1.005..1.007] | -           | **faster** |
| G2 deep-15 primitive     | M    | high | 158.33 us | 79.81 us           | 0.504 [0.502..0.506] | 0.497 [0.496..0.499] | 0.502      | 0.506      | 1.002 [1.001..1.004] | -           | **faster** |
| G2 deep-8 flatMap-first  | M    | high | 243.19 us | 120.60 us          | 0.496 [0.494..0.498] | 0.491 [0.488..0.493] | 0.494      | 0.498      | 0.996 [0.993..1.000] | -           | **faster** |
| G2 deep-8 object         | M    | high | 90.83 us  | 48.90 us           | 0.538 [0.534..0.542] | 0.533 [0.529..0.536] | 0.542      | 0.534      | 0.999 [0.993..1.005] | -           | **faster** |
| G2 deep-8 primitive      | M    | high | 95.73 us  | 48.21 us           | 0.504 [0.500..0.507] | 0.496 [0.492..0.501] | 0.507      | 0.500      | 0.991 [0.990..0.992] | -           | **faster** |
