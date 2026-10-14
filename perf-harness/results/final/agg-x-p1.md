# Map/filter/find/take over 10 item shapes (P1)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run             | entry order         | runner | source | pollution | node    | flags | scale | wall |
| --------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| final/x-p1-r0-a | main,branch,main-aa | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |
| final/x-p1-r0-b | main,branch,main-aa | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |
| final/x-p1-r1-a | branch,main-aa,main | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |
| final/x-p1-r1-b | branch,main-aa,main | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |

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
| 1    | 48    | 0.003          | 0.025               | 0.039 | 12            | 0 (0.0%)    | 0               |
| 2    | 84    | 0.005          | 0.022               | 0.049 | 21            | 0 (0.0%)    | 0               |
| 3    | 60    | 0.005          | 0.032               | 0.093 | 15            | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts | T2 gm | T2 verdicts | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | ----------- | ----- | ----------- | ----- | ----------- | -------------- |
| branch  | 0.567 | faster 12   | 0.572 | faster 21   | 0.498 | faster 15   | 0              |
| main-aa | 1.001 | neutral 12  | 0.999 | neutral 21  | 0.999 | neutral 15  | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.567 | 0.572 | 0.498 | -       |

## Tier 1: branch vs main (12 scenarios, weighted geomean 0.567, floor 0.025)

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 3-step middle reads data                                                                 | C    | high | 269.92 us | 141.44 us | 0.525 [0.522..0.534] | 0.523 [0.522..0.532] | 0.529      | 0.523      | 1.001 [0.998..1.007] | -           | **faster** |
| G1 filter+map                                                                               | C    | high | 166.94 us | 87.69 us  | 0.530 [0.522..0.534] | 0.529 [0.519..0.538] | 0.528      | 0.531      | 0.990 [0.961..1.033] | -           | **faster** |
| G1 map                                                                                      | C    | high | 119.50 us | 43.71 us  | 0.367 [0.355..0.372] | 0.364 [0.352..0.365] | 0.369      | 0.361      | 1.002 [0.997..1.003] | -           | **faster** |
| G1 map reading data                                                                         | C    | high | 124.81 us | 57.90 us  | 0.463 [0.461..0.465] | 0.461 [0.460..0.465] | 0.464      | 0.462      | 1.001 [0.995..1.003] | -           | **faster** |
| G1 map+filter+map                                                                           | C    | high | 277.56 us | 129.77 us | 0.468 [0.467..0.468] | 0.465 [0.464..0.466] | 0.468      | 0.467      | 1.002 [1.000..1.004] | -           | **faster** |
| G1 map+unique                                                                               | C    | high | 329.92 us | 217.54 us | 0.659 [0.649..0.669] | 0.658 [0.646..0.666] | 0.659      | 0.659      | 0.994 [0.980..1.003] | -           | **faster** |
| G1 uniqueBy                                                                                 | C    | high | 239.27 us | 148.17 us | 0.619 [0.604..0.635] | 0.616 [0.592..0.629] | 0.620      | 0.619      | 1.010 [0.990..1.025] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | high | 931.02 us | 702.54 us | 0.756 [0.746..0.771] | 0.755 [0.749..0.772] | 0.756      | 0.758      | 1.007 [0.995..1.015] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | high | 221.65 us | 141.00 us | 0.638 [0.627..0.640] | 0.634 [0.632..0.638] | 0.633      | 0.638      | 0.997 [0.980..1.023] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | high | 532.12 us | 446.35 us | 0.837 [0.834..0.844] | 0.835 [0.822..0.838] | 0.841      | 0.835      | 1.005 [1.002..1.021] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | high | 636.50 us | 397.98 us | 0.625 [0.619..0.666] | 0.625 [0.617..0.663] | 0.645      | 0.622      | 0.999 [0.996..1.004] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | high | 96.52 us  | 47.08 us  | 0.487 [0.483..0.492] | 0.486 [0.480..0.491] | 0.492      | 0.483      | 1.003 [1.000..1.018] | -           | **faster** |

## Tier 2: branch vs main (21 scenarios, weighted geomean 0.572, floor 0.022)

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 3-step middle reads data                                                                 | M    | high | 42.54 us  | 23.06 us  | 0.544 [0.517..0.550] | 0.536 [0.511..0.543]   | 0.531      | 0.546      | 1.000 [0.990..1.009] | -           | **faster** |
| G1 filter+first                                                                             | C    | mid  | 30.96 us  | 16.27 us  | 0.526 [0.506..0.532] | 0.522 [0.505..0.527]   | 0.527      | 0.517      | 1.005 [0.978..1.016] | -           | **faster** |
| G1 filter+map                                                                               | M    | high | 25.04 us  | 14.17 us  | 0.559 [0.544..0.579] | 0.553 [0.547..0.570]   | 0.559      | 0.561      | 0.993 [0.951..0.997] | -           | **faster** |
| G1 filter+map+take(10)                                                                      | C    | mid  | 42.94 us  | 23.79 us  | 0.553 [0.552..0.560] | 0.550 [0.548..0.557]   | 0.556      | 0.552      | 0.999 [0.994..1.008] | -           | **faster** |
| G1 find early hit                                                                           | C    | mid  | 8.44 us   | 4.00 us   | 0.474 [0.468..0.478] | 0.476 [0.468..0.479]   | 0.471      | 0.476      | 0.993 [0.981..0.995] | -           | **faster** |
| G1 find late hit                                                                            | C    | mid  | 104.81 us | 51.35 us  | 0.484 [0.476..0.501] | 0.481 [0.473..0.501]   | 0.489      | 0.484      | 0.998 [0.964..1.005] | -           | **faster** |
| G1 find miss                                                                                | C    | mid  | 103.21 us | 49.63 us  | 0.481 [0.473..0.489] | 0.479 [0.474..0.490]   | 0.484      | 0.478      | 0.985 [0.983..1.000] | -           | **faster** |
| G1 flat+map                                                                                 | C    | mid  | 225.10 us | 92.46 us  | 0.410 [0.409..0.413] | 0.409 [0.409..0.413]   | 0.412      | 0.409      | 1.007 [0.999..1.028] | -           | **faster** |
| G1 flatMap+filter+map                                                                       | C    | mid  | 771.08 us | 350.19 us | 0.456 [0.450..0.461] | 0.454 [0.447..0.463]   | 0.456      | 0.455      | 0.998 [0.984..1.001] | -           | **faster** |
| G1 map                                                                                      | M    | high | 18.92 us  | 7.60 us   | 0.402 [0.389..0.406] | 0.396 [0.382..0.400]   | 0.394      | 0.405      | 0.997 [0.991..1.000] | -           | **faster** |
| G1 map reading data                                                                         | M    | high | 19.94 us  | 10.50 us  | 0.528 [0.501..0.534] | 0.524 [0.498..0.536]   | 0.515      | 0.531      | 0.998 [0.990..1.002] | -           | **faster** |
| G1 map+filter+map                                                                           | M    | high | 42.83 us  | 20.52 us  | 0.479 [0.471..0.480] | 0.470 [0.464..0.471]   | 0.475      | 0.479      | 1.000 [0.994..1.004] | -           | **faster** |
| G1 map+unique                                                                               | M    | high | 53.19 us  | 33.04 us  | 0.617 [0.594..0.641] | 0.610 [0.588..0.637]   | 0.605      | 0.629      | 0.997 [0.984..1.004] | -           | **faster** |
| G1 uniqueBy                                                                                 | M    | high | 40.21 us  | 20.73 us  | 0.510 [0.499..0.537] | 0.507 [0.498..0.533]   | 0.508      | 0.520      | 0.997 [0.988..1.029] | -           | **faster** |
| G2 deep-15 mixed                                                                            | M    | high | 135.75 us | 87.04 us  | 0.641 [0.639..0.655] | 0.634 [0.633..0.646]   | 0.647      | 0.641      | 0.994 [0.991..1.006] | -           | **faster** |
| G2 deep-8 mixed                                                                             | M    | high | 81.85 us  | 49.46 us  | 0.606 [0.600..0.607] | 0.601 [0.596..0.603]   | 0.603      | 0.606      | 0.998 [0.990..1.006] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | high | 151.83 us | 121.88 us | 0.801 [0.798..0.812] | 0.800 [0.792..0.809]   | 0.801      | 0.805      | 1.000 [0.993..1.001] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | high | 43.58 us  | 32.54 us  | 0.747 [0.738..0.756] | 0.743 [0.733..0.754]   | 0.747      | 0.747      | 1.003 [1.000..1.006] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | high | 77.27 us  | 64.94 us  | 0.841 [0.826..0.846] | 0.831 [0.829..0.840]   | 0.836      | 0.841      | 1.009 [0.995..1.012] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | high | 87.88 us  | 70.00 us  | 0.796 [0.790..0.802] | 0.794 [0.788..0.798]   | 0.796      | 0.796      | 0.998 [0.995..1.003] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | high | 1.54 us   | 750.0 ns  | 0.486 [0.486..0.486] | 0.488 [0.483..0.491] * | 0.490      | 0.485      | 1.000 [0.992..1.011] | -           | **faster** |

## Tier 3: branch vs main (15 scenarios, weighted geomean 0.498, floor 0.032)

| scenario                 | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------ | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 drop+take             | C    | low  | 110.04 us | 56.13 us  | 0.507 [0.505..0.514] | 0.505 [0.503..0.511]   | 0.510      | 0.507      | 0.998 [0.986..1.011] | -           | **faster** |
| G1 drop+take             | M    | low  | 16.65 us  | 8.00 us   | 0.481 [0.476..0.484] | 0.475 [0.472..0.478]   | 0.481      | 0.479      | 0.999 [0.990..1.008] | -           | **faster** |
| G1 filter+first          | M    | mid  | 1.04 us   | 500.0 ns  | 0.480 [0.480..0.500] | 0.486 [0.481..0.492] * | 0.490      | 0.483      | 1.006 [1.004..1.011] | -           | **faster** |
| G1 filter+map+take(10)   | M    | mid  | 708.0 ns  | 375.0 ns  | 0.530 [0.529..0.562] | 0.554 [0.507..0.561] * | 0.528      | 0.560      | 0.997 [0.907..1.012] | -           | **faster** |
| G1 find early hit        | M    | mid  | 458.0 ns  | 250.0 ns  | 0.546 [0.546..0.546] | 0.513 [0.507..0.515] * | 0.510      | 0.515      | 0.985 [0.968..0.997] | -           | **faster** |
| G1 find late hit         | M    | mid  | 15.94 us  | 7.60 us   | 0.474 [0.468..0.480] | 0.475 [0.469..0.481]   | 0.474      | 0.474      | 1.005 [0.964..1.010] | -           | **faster** |
| G1 find miss             | M    | mid  | 15.94 us  | 7.46 us   | 0.468 [0.455..0.475] | 0.463 [0.457..0.468]   | 0.461      | 0.472      | 0.997 [0.967..1.005] | -           | **faster** |
| G1 flat+map              | M    | mid  | 35.02 us  | 14.81 us  | 0.425 [0.412..0.428] | 0.419 [0.405..0.424]   | 0.417      | 0.428      | 1.005 [0.990..1.007] | -           | **faster** |
| G1 flatMap+filter+map    | M    | mid  | 119.92 us | 58.04 us  | 0.484 [0.472..0.495] | 0.479 [0.466..0.486]   | 0.475      | 0.492      | 0.999 [0.983..1.002] | -           | **faster** |
| G2 deep-15 flatMap-first | M    | high | 372.56 us | 181.50 us | 0.487 [0.484..0.490] | 0.478 [0.476..0.482]   | 0.487      | 0.487      | 1.004 [1.000..1.011] | -           | **faster** |
| G2 deep-15 object        | M    | high | 136.10 us | 71.54 us  | 0.526 [0.525..0.527] | 0.520 [0.519..0.521]   | 0.526      | 0.527      | 1.000 [1.000..1.000] | -           | **faster** |
| G2 deep-15 primitive     | M    | high | 159.58 us | 79.83 us  | 0.500 [0.492..0.502] | 0.493 [0.486..0.495]   | 0.496      | 0.501      | 0.995 [0.981..1.014] | -           | **faster** |
| G2 deep-8 flatMap-first  | M    | high | 241.81 us | 119.79 us | 0.495 [0.495..0.497] | 0.489 [0.488..0.490]   | 0.495      | 0.497      | 1.003 [1.003..1.004] | -           | **faster** |
| G2 deep-8 object         | M    | high | 90.83 us  | 48.10 us  | 0.530 [0.526..0.544] | 0.524 [0.520..0.537]   | 0.528      | 0.537      | 1.002 [0.998..1.005] | -           | **faster** |
| G2 deep-8 primitive      | M    | high | 95.67 us  | 48.13 us  | 0.503 [0.495..0.506] | 0.495 [0.489..0.496]   | 0.499      | 0.504      | 0.990 [0.979..0.998] | -           | **faster** |
