# cand-full vs main, P0

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run            | entry order                     | runner | source | pollution | node    | flags | scale | wall |
| -------------- | ------------------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| prepub/x-p0-r0 | main,branch-v-cand-full,main-aa | vitest | dist   | P0        | v26.9.0 | -     | 1     | 34 s |
| prepub/x-p0-r1 | branch-v-cand-full,main-aa,main | vitest | dist   | P0        | v26.9.0 | -     | 1     | 34 s |

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
| 1    | 10    | 0.006          | 0.023               | 0.030 | 5             | 0 (0.0%)    | 0               |
| 2    | 14    | 0.005          | 0.156               | 0.159 | 7             | 0 (0.0%)    | 0               |
| 3    | 12    | 0.189          | 0.239               | 0.242 | 6             | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy               | T1 gm | T1 verdicts | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------------------ | ----- | ----------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch-v-cand-full | 0.659 | faster 5    | 0.695 | faster 6, neutral 1 | 0.477 | faster 6    | 0              |
| main-aa            | 0.999 | neutral 5   | 1.003 | neutral 7           | 1.013 | neutral 6   | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.56%, T3 2.67%).

| rank | copy               | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------------------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch-v-cand-full | 0              | 0.659 | 0.695 | 0.477 | -       |

## Tier 1: branch-v-cand-full vs main (5 scenarios, weighted geomean 0.659, floor 0.023)

| scenario                                                                                    | size | pop  | main      | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | high | 933.37 us | 707.69 us          | 0.758 [0.749..0.767] | 0.759 [0.750..0.767] | 0.749      | 0.767      | 1.005 [1.002..1.007] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | high | 200.37 us | 123.71 us          | 0.617 [0.612..0.623] | 0.616 [0.611..0.621] | 0.623      | 0.612      | 0.994 [0.987..1.001] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | high | 532.52 us | 441.19 us          | 0.829 [0.820..0.837] | 0.832 [0.826..0.838] | 0.820      | 0.837      | 0.987 [0.970..1.005] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | high | 631.31 us | 398.52 us          | 0.631 [0.628..0.634] | 0.629 [0.624..0.633] | 0.628      | 0.634      | 1.006 [1.002..1.010] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | high | 95.85 us  | 48.50 us           | 0.506 [0.506..0.506] | 0.504 [0.503..0.504] | 0.506      | 0.506      | 1.005 [0.995..1.014] | -           | **faster** |

## Tier 2: branch-v-cand-full vs main (7 scenarios, weighted geomean 0.695, floor 0.156)

| scenario                                                                                    | size | pop  | main      | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G2 deep-15 mixed                                                                            | M    | high | 145.00 us | 88.48 us           | 0.613 [0.570..0.657] | 0.608 [0.563..0.653] | 0.657      | 0.570      | 1.011 [0.868..1.154] | -           | **faster** |
| G2 deep-8 mixed                                                                             | M    | high | 87.06 us  | 54.42 us           | 0.628 [0.585..0.671] | 0.625 [0.584..0.666] | 0.671      | 0.585      | 1.010 [0.861..1.159] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | high | 152.21 us | 121.56 us          | 0.799 [0.798..0.800] | 0.799 [0.797..0.801] | 0.798      | 0.800      | 1.000 [0.995..1.005] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | high | 40.35 us  | 29.90 us           | 0.741 [0.739..0.742] | 0.738 [0.736..0.740] | 0.742      | 0.739      | 0.998 [0.995..1.002] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | high | 76.63 us  | 64.90 us           | 0.847 [0.844..0.850] | 0.838 [0.834..0.842] | 0.844      | 0.850      | 0.994 [0.987..1.001] | -           | neutral    |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | high | 87.67 us  | 69.54 us           | 0.793 [0.789..0.797] | 0.792 [0.789..0.795] | 0.797      | 0.789      | 1.006 [0.999..1.013] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | high | 1.54 us   | 792.0 ns           | 0.514 [0.514..0.514] | 0.516 [0.512..0.520] | 0.514      | 0.514      | 1.000 [1.000..1.001] | -           | **faster** |

## Tier 3: branch-v-cand-full vs main (6 scenarios, weighted geomean 0.477, floor 0.239)

| scenario                 | size | pop  | main      | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------ | ---- | ---- | --------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G2 deep-15 flatMap-first | M    | high | 412.46 us | 180.48 us          | 0.442 [0.397..0.487] | 0.438 [0.393..0.483] | 0.487      | 0.397      | 1.020 [0.812..1.228] | -           | **faster** |
| G2 deep-15 object        | M    | high | 150.21 us | 71.19 us           | 0.480 [0.426..0.533] | 0.480 [0.421..0.539] | 0.533      | 0.426      | 1.023 [0.810..1.236] | -           | **faster** |
| G2 deep-15 primitive     | M    | high | 156.71 us | 77.27 us           | 0.493 [0.488..0.498] | 0.486 [0.481..0.491] | 0.498      | 0.488      | 1.009 [0.994..1.023] | -           | **faster** |
| G2 deep-8 flatMap-first  | M    | high | 267.81 us | 122.58 us          | 0.462 [0.420..0.504] | 0.455 [0.415..0.496] | 0.504      | 0.420      | 1.010 [0.828..1.191] | -           | **faster** |
| G2 deep-8 object         | M    | high | 100.13 us | 48.75 us           | 0.492 [0.441..0.543] | 0.487 [0.437..0.537] | 0.543      | 0.441      | 1.026 [0.810..1.242] | -           | **faster** |
| G2 deep-8 primitive      | M    | high | 94.25 us  | 46.52 us           | 0.494 [0.488..0.499] | 0.485 [0.483..0.486] | 0.488      | 0.499      | 0.993 [0.982..1.004] | -           | **faster** |
