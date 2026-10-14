# Map/filter/find/take over 10 item shapes (P1)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                   | entry order         | runner | source | pollution | node    | flags | scale | wall |
| --------------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| publication/x-p1-r0-a | main,branch,main-aa | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |
| publication/x-p1-r0-b | main,branch,main-aa | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |
| publication/x-p1-r1-a | branch,main-aa,main | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |
| publication/x-p1-r1-b | branch,main-aa,main | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |

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
| 1    | 48    | 0.006          | 0.024               | 0.031 | 12            | 0 (0.0%)    | 0               |
| 2    | 84    | 0.005          | 0.024               | 0.031 | 21            | 0 (0.0%)    | 0               |
| 3    | 60    | 0.005          | 0.017               | 0.035 | 15            | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts | T2 gm | T2 verdicts | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | ----------- | ----- | ----------- | ----- | ----------- | -------------- |
| branch  | 0.569 | faster 12   | 0.572 | faster 21   | 0.502 | faster 15   | 0              |
| main-aa | 1.001 | neutral 12  | 1.001 | neutral 21  | 1.000 | neutral 15  | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.569 | 0.572 | 0.502 | -       |

## Tier 1: branch vs main (12 scenarios, weighted geomean 0.569, floor 0.024)

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 3-step middle reads data                                                                 | C    | high | 273.19 us | 141.13 us | 0.518 [0.513..0.531] | 0.517 [0.513..0.529] | 0.526      | 0.513      | 1.001 [0.983..1.014] | -           | **faster** |
| G1 filter+map                                                                               | C    | high | 166.96 us | 88.63 us  | 0.534 [0.527..0.540] | 0.538 [0.527..0.542] | 0.531      | 0.536      | 0.985 [0.969..0.997] | -           | **faster** |
| G1 map                                                                                      | C    | high | 119.83 us | 43.73 us  | 0.365 [0.351..0.376] | 0.363 [0.351..0.373] | 0.374      | 0.355      | 1.002 [0.993..1.007] | -           | **faster** |
| G1 map reading data                                                                         | C    | high | 125.44 us | 58.40 us  | 0.466 [0.462..0.468] | 0.465 [0.461..0.468] | 0.467      | 0.464      | 1.000 [0.992..1.004] | -           | **faster** |
| G1 map+filter+map                                                                           | C    | high | 279.00 us | 130.21 us | 0.468 [0.463..0.471] | 0.465 [0.458..0.468] | 0.467      | 0.468      | 0.999 [0.993..1.006] | -           | **faster** |
| G1 map+unique                                                                               | C    | high | 327.58 us | 216.92 us | 0.664 [0.649..0.675] | 0.663 [0.649..0.675] | 0.672      | 0.655      | 1.003 [0.994..1.012] | -           | **faster** |
| G1 uniqueBy                                                                                 | C    | high | 237.58 us | 149.19 us | 0.632 [0.598..0.636] | 0.624 [0.596..0.627] | 0.633      | 0.616      | 1.008 [0.994..1.018] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | high | 930.98 us | 705.94 us | 0.758 [0.749..0.773] | 0.760 [0.751..0.774] | 0.764      | 0.754      | 1.003 [0.994..1.008] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | high | 223.42 us | 141.21 us | 0.630 [0.621..0.643] | 0.631 [0.624..0.639] | 0.632      | 0.630      | 0.999 [0.983..1.005] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | high | 537.15 us | 454.52 us | 0.843 [0.827..0.855] | 0.838 [0.826..0.849] | 0.837      | 0.847      | 1.009 [0.990..1.029] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | high | 638.52 us | 398.08 us | 0.623 [0.618..0.626] | 0.621 [0.616..0.626] | 0.625      | 0.620      | 0.993 [0.991..0.996] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | high | 96.67 us  | 48.48 us  | 0.501 [0.500..0.505] | 0.498 [0.497..0.503] | 0.500      | 0.503      | 1.003 [1.000..1.006] | -           | **faster** |

## Tier 2: branch vs main (21 scenarios, weighted geomean 0.572, floor 0.024)

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 3-step middle reads data                                                                 | M    | high | 41.69 us  | 21.81 us  | 0.530 [0.515..0.541] | 0.525 [0.510..0.535]   | 0.535      | 0.523      | 1.005 [0.995..1.023] | -           | **faster** |
| G1 filter+first                                                                             | C    | mid  | 31.17 us  | 16.58 us  | 0.532 [0.525..0.541] | 0.530 [0.523..0.536]   | 0.536      | 0.529      | 1.004 [0.997..1.022] | -           | **faster** |
| G1 filter+map                                                                               | M    | high | 24.71 us  | 13.81 us  | 0.559 [0.553..0.571] | 0.553 [0.544..0.561]   | 0.562      | 0.559      | 1.006 [0.997..1.013] | -           | **faster** |
| G1 filter+map+take(10)                                                                      | C    | mid  | 42.94 us  | 24.50 us  | 0.569 [0.564..0.576] | 0.566 [0.562..0.569]   | 0.574      | 0.565      | 0.996 [0.991..1.001] | -           | **faster** |
| G1 find early hit                                                                           | C    | mid  | 8.35 us   | 4.25 us   | 0.508 [0.500..0.510] | 0.509 [0.498..0.512]   | 0.509      | 0.504      | 1.007 [0.990..1.010] | -           | **faster** |
| G1 find late hit                                                                            | C    | mid  | 104.35 us | 50.63 us  | 0.484 [0.482..0.491] | 0.484 [0.480..0.490]   | 0.488      | 0.482      | 1.001 [0.994..1.025] | -           | **faster** |
| G1 find miss                                                                                | C    | mid  | 101.63 us | 49.48 us  | 0.486 [0.484..0.497] | 0.486 [0.484..0.491]   | 0.485      | 0.492      | 1.002 [0.998..1.019] | -           | **faster** |
| G1 flat+map                                                                                 | C    | mid  | 224.46 us | 91.77 us  | 0.410 [0.405..0.418] | 0.409 [0.404..0.417]   | 0.415      | 0.406      | 1.003 [0.996..1.008] | -           | **faster** |
| G1 flatMap+filter+map                                                                       | C    | mid  | 761.90 us | 348.46 us | 0.456 [0.453..0.467] | 0.454 [0.453..0.466]   | 0.462      | 0.454      | 1.004 [0.993..1.018] | -           | **faster** |
| G1 map                                                                                      | M    | high | 18.85 us  | 7.35 us   | 0.389 [0.382..0.403] | 0.381 [0.374..0.395]   | 0.396      | 0.385      | 0.997 [0.993..1.004] | -           | **faster** |
| G1 map reading data                                                                         | M    | high | 19.90 us  | 10.10 us  | 0.508 [0.506..0.514] | 0.503 [0.501..0.513]   | 0.510      | 0.508      | 1.000 [0.996..1.004] | -           | **faster** |
| G1 map+filter+map                                                                           | M    | high | 42.54 us  | 20.17 us  | 0.473 [0.472..0.483] | 0.465 [0.464..0.477]   | 0.472      | 0.478      | 1.001 [0.998..1.002] | -           | **faster** |
| G1 map+unique                                                                               | M    | high | 50.35 us  | 30.60 us  | 0.609 [0.604..0.617] | 0.604 [0.598..0.613]   | 0.612      | 0.608      | 0.992 [0.991..0.994] | -           | **faster** |
| G1 uniqueBy                                                                                 | M    | high | 34.83 us  | 18.37 us  | 0.524 [0.511..0.536] | 0.523 [0.505..0.535]   | 0.524      | 0.524      | 1.002 [0.986..1.024] | -           | **faster** |
| G2 deep-15 mixed                                                                            | M    | high | 136.04 us | 88.02 us  | 0.646 [0.645..0.652] | 0.639 [0.638..0.644]   | 0.649      | 0.646      | 0.993 [0.990..1.008] | -           | **faster** |
| G2 deep-8 mixed                                                                             | M    | high | 81.46 us  | 49.69 us  | 0.609 [0.604..0.614] | 0.604 [0.600..0.608]   | 0.611      | 0.606      | 1.002 [0.994..1.006] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | high | 151.35 us | 122.48 us | 0.806 [0.802..0.813] | 0.803 [0.797..0.811]   | 0.809      | 0.804      | 1.004 [1.002..1.006] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | high | 43.62 us  | 32.56 us  | 0.743 [0.737..0.750] | 0.739 [0.733..0.740]   | 0.746      | 0.740      | 1.004 [0.982..1.025] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | high | 77.21 us  | 65.19 us  | 0.833 [0.821..0.852] | 0.836 [0.823..0.841]   | 0.821      | 0.848      | 1.004 [0.975..1.031] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | high | 87.50 us  | 70.02 us  | 0.799 [0.789..0.802] | 0.796 [0.784..0.798]   | 0.800      | 0.795      | 1.001 [0.995..1.006] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | high | 1.54 us   | 792.0 ns  | 0.514 [0.514..0.514] | 0.503 [0.503..0.506] * | 0.503      | 0.504      | 1.004 [1.000..1.013] | -           | **faster** |

## Tier 3: branch vs main (15 scenarios, weighted geomean 0.502, floor 0.017)

| scenario                 | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------ | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 drop+take             | C    | low  | 110.08 us | 56.40 us  | 0.513 [0.510..0.519] | 0.510 [0.507..0.514]   | 0.517      | 0.510      | 1.002 [0.998..1.007] | -           | **faster** |
| G1 drop+take             | M    | low  | 16.69 us  | 8.04 us   | 0.482 [0.479..0.495] | 0.477 [0.474..0.490]   | 0.489      | 0.481      | 1.001 [0.997..1.002] | -           | **faster** |
| G1 filter+first          | M    | mid  | 1.04 us   | 520.5 ns  | 0.500 [0.480..0.541] | 0.495 [0.487..0.502] * | 0.501      | 0.489      | 1.002 [0.983..1.015] | -           | **faster** |
| G1 filter+map+take(10)   | M    | mid  | 708.0 ns  | 417.0 ns  | 0.589 [0.589..0.589] | 0.580 [0.575..0.585] * | 0.580      | 0.580      | 1.000 [0.998..1.004] | -           | **faster** |
| G1 find early hit        | M    | mid  | 458.0 ns  | 250.0 ns  | 0.546 [0.546..0.600] | 0.528 [0.522..0.535] * | 0.528      | 0.529      | 0.996 [0.975..1.010] | -           | **faster** |
| G1 find late hit         | M    | mid  | 15.96 us  | 7.50 us   | 0.471 [0.464..0.477] | 0.471 [0.466..0.477]   | 0.469      | 0.473      | 1.000 [0.990..1.013] | -           | **faster** |
| G1 find miss             | M    | mid  | 15.92 us  | 7.52 us   | 0.472 [0.464..0.482] | 0.467 [0.460..0.475]   | 0.470      | 0.475      | 0.995 [0.990..1.000] | -           | **faster** |
| G1 flat+map              | M    | mid  | 34.90 us  | 14.33 us  | 0.410 [0.406..0.423] | 0.402 [0.398..0.416]   | 0.416      | 0.408      | 0.996 [0.992..0.999] | -           | **faster** |
| G1 flatMap+filter+map    | M    | mid  | 120.79 us | 58.19 us  | 0.481 [0.475..0.486] | 0.474 [0.469..0.481]   | 0.480      | 0.481      | 0.998 [0.981..1.008] | -           | **faster** |
| G2 deep-15 flatMap-first | M    | high | 371.81 us | 182.04 us | 0.489 [0.483..0.492] | 0.481 [0.479..0.484]   | 0.489      | 0.487      | 1.003 [0.998..1.035] | -           | **faster** |
| G2 deep-15 object        | M    | high | 135.83 us | 72.54 us  | 0.534 [0.523..0.542] | 0.528 [0.517..0.533]   | 0.529      | 0.537      | 1.003 [0.992..1.011] | -           | **faster** |
| G2 deep-15 primitive     | M    | high | 158.90 us | 79.85 us  | 0.503 [0.498..0.514] | 0.496 [0.491..0.507]   | 0.503      | 0.506      | 1.004 [1.001..1.009] | -           | **faster** |
| G2 deep-8 flatMap-first  | M    | high | 241.77 us | 119.75 us | 0.498 [0.492..0.499] | 0.491 [0.488..0.492]   | 0.499      | 0.495      | 1.006 [0.998..1.007] | -           | **faster** |
| G2 deep-8 object         | M    | high | 90.56 us  | 48.60 us  | 0.535 [0.533..0.541] | 0.528 [0.527..0.534]   | 0.537      | 0.535      | 1.002 [0.997..1.005] | -           | **faster** |
| G2 deep-8 primitive      | M    | high | 95.71 us  | 48.13 us  | 0.504 [0.498..0.506] | 0.496 [0.488..0.500]   | 0.505      | 0.501      | 0.991 [0.986..0.993] | -           | **faster** |
