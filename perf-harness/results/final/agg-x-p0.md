# No pollution (P0)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run             | entry order         | runner | source | pollution | node    | flags | scale | wall |
| --------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| final/x-p0-r0-a | main,branch,main-aa | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |
| final/x-p0-r0-b | main,branch,main-aa | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |
| final/x-p0-r1-a | branch,main-aa,main | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |
| final/x-p0-r1-b | branch,main-aa,main | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |

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
| 1    | 48    | 0.005          | 0.028               | 0.047 | 12            | 0 (0.0%)    | 0               |
| 2    | 84    | 0.005          | 0.141               | 0.166 | 21            | 0 (0.0%)    | 0               |
| 3    | 60    | 0.010          | 0.230               | 0.241 | 15            | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts | T2 gm | T2 verdicts | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | ----------- | ----- | ----------- | ----- | ----------- | -------------- |
| branch  | 0.554 | faster 12   | 0.558 | faster 21   | 0.476 | faster 15   | 0              |
| main-aa | 1.001 | neutral 12  | 1.002 | neutral 21  | 1.008 | neutral 15  | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 1.55%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.554 | 0.558 | 0.476 | -       |

## Tier 1: branch vs main (12 scenarios, weighted geomean 0.554, floor 0.028)

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 3-step middle reads data                                                                 | C    | high | 271.81 us | 142.12 us | 0.524 [0.516..0.530] | 0.524 [0.514..0.529] | 0.525      | 0.522      | 1.005 [0.997..1.008] | -           | **faster** |
| G1 filter+map                                                                               | C    | high | 149.65 us | 73.81 us  | 0.493 [0.470..0.495] | 0.488 [0.477..0.492] | 0.495      | 0.481      | 0.995 [0.969..1.009] | -           | **faster** |
| G1 map                                                                                      | C    | high | 82.38 us  | 24.54 us  | 0.297 [0.289..0.298] | 0.295 [0.289..0.296] | 0.297      | 0.294      | 1.001 [0.968..1.005] | -           | **faster** |
| G1 map reading data                                                                         | C    | high | 114.77 us | 57.19 us  | 0.498 [0.496..0.500] | 0.500 [0.497..0.501] | 0.498      | 0.498      | 0.997 [0.994..1.006] | -           | **faster** |
| G1 map+filter+map                                                                           | C    | high | 277.56 us | 126.50 us | 0.456 [0.452..0.457] | 0.453 [0.445..0.455] | 0.455      | 0.456      | 1.000 [0.998..1.001] | -           | **faster** |
| G1 map+unique                                                                               | C    | high | 330.08 us | 218.44 us | 0.661 [0.655..0.669] | 0.660 [0.654..0.665] | 0.660      | 0.663      | 1.001 [0.988..1.005] | -           | **faster** |
| G1 uniqueBy                                                                                 | C    | high | 244.06 us | 150.83 us | 0.617 [0.613..0.632] | 0.613 [0.603..0.616] | 0.625      | 0.615      | 1.006 [0.992..1.022] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | high | 939.27 us | 704.90 us | 0.754 [0.747..0.760] | 0.752 [0.748..0.761] | 0.756      | 0.752      | 1.007 [0.998..1.009] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | high | 200.37 us | 122.92 us | 0.614 [0.613..0.617] | 0.612 [0.611..0.614] | 0.616      | 0.613      | 0.998 [0.997..1.000] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | high | 532.21 us | 449.06 us | 0.844 [0.842..0.858] | 0.847 [0.841..0.853] | 0.844      | 0.850      | 1.008 [0.989..1.047] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | high | 635.71 us | 395.54 us | 0.622 [0.620..0.626] | 0.621 [0.617..0.624] | 0.623      | 0.622      | 0.997 [0.991..1.019] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | high | 96.33 us  | 46.69 us  | 0.484 [0.484..0.489] | 0.483 [0.483..0.487] | 0.484      | 0.486      | 0.996 [0.994..0.998] | -           | **faster** |

## Tier 2: branch vs main (21 scenarios, weighted geomean 0.558, floor 0.141)

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 3-step middle reads data                                                                 | M    | high | 41.42 us  | 21.48 us  | 0.521 [0.509..0.524] | 0.514 [0.504..0.521]   | 0.517      | 0.521      | 1.000 [0.994..1.017] | -           | **faster** |
| G1 filter+first                                                                             | C    | mid  | 31.50 us  | 16.42 us  | 0.521 [0.496..0.532] | 0.518 [0.492..0.530]   | 0.510      | 0.525      | 1.002 [0.951..1.008] | -           | **faster** |
| G1 filter+map                                                                               | M    | high | 22.90 us  | 11.15 us  | 0.488 [0.481..0.493] | 0.478 [0.473..0.484]   | 0.486      | 0.489      | 0.999 [0.995..1.007] | -           | **faster** |
| G1 filter+map+take(10)                                                                      | C    | mid  | 42.92 us  | 23.67 us  | 0.552 [0.551..0.555] | 0.548 [0.547..0.551]   | 0.552      | 0.553      | 0.997 [0.996..1.000] | -           | **faster** |
| G1 find early hit                                                                           | C    | mid  | 7.90 us   | 3.62 us   | 0.457 [0.450..0.460] | 0.457 [0.451..0.460]   | 0.459      | 0.453      | 1.000 [0.990..1.005] | -           | **faster** |
| G1 find late hit                                                                            | C    | mid  | 106.38 us | 51.77 us  | 0.487 [0.481..0.494] | 0.486 [0.481..0.490]   | 0.488      | 0.487      | 0.979 [0.955..0.999] | -           | **faster** |
| G1 find miss                                                                                | C    | mid  | 102.54 us | 49.85 us  | 0.486 [0.483..0.488] | 0.486 [0.480..0.490]   | 0.488      | 0.483      | 1.001 [0.984..1.007] | -           | **faster** |
| G1 flat+map                                                                                 | C    | mid  | 223.23 us | 92.21 us  | 0.414 [0.407..0.415] | 0.412 [0.408..0.414]   | 0.410      | 0.414      | 1.006 [1.001..1.010] | -           | **faster** |
| G1 flatMap+filter+map                                                                       | C    | mid  | 769.67 us | 347.10 us | 0.451 [0.444..0.456] | 0.448 [0.446..0.454]   | 0.451      | 0.450      | 1.000 [0.989..1.011] | -           | **faster** |
| G1 map                                                                                      | M    | high | 13.21 us  | 4.46 us   | 0.338 [0.330..0.344] | 0.324 [0.319..0.332]   | 0.341      | 0.334      | 1.000 [0.988..1.016] | -           | **faster** |
| G1 map reading data                                                                         | M    | high | 18.10 us  | 9.98 us   | 0.550 [0.547..0.556] | 0.545 [0.541..0.552]   | 0.549      | 0.553      | 1.002 [1.000..1.012] | -           | **faster** |
| G1 map+filter+map                                                                           | M    | high | 42.40 us  | 19.27 us  | 0.455 [0.451..0.465] | 0.446 [0.443..0.456]   | 0.459      | 0.453      | 1.002 [0.999..1.010] | -           | **faster** |
| G1 map+unique                                                                               | M    | high | 50.02 us  | 30.37 us  | 0.613 [0.601..0.617] | 0.610 [0.596..0.613]   | 0.616      | 0.606      | 1.000 [0.994..1.009] | -           | **faster** |
| G1 uniqueBy                                                                                 | M    | high | 33.88 us  | 17.33 us  | 0.509 [0.496..0.516] | 0.505 [0.496..0.515]   | 0.506      | 0.509      | 1.006 [0.999..1.026] | -           | **faster** |
| G2 deep-15 mixed                                                                            | M    | high | 145.15 us | 87.69 us  | 0.605 [0.562..0.655] | 0.599 [0.557..0.648]   | 0.648      | 0.565      | 1.009 [0.863..1.148] | -           | **faster** |
| G2 deep-8 mixed                                                                             | M    | high | 86.67 us  | 54.40 us  | 0.631 [0.582..0.675] | 0.625 [0.577..0.669]   | 0.675      | 0.585      | 1.013 [0.858..1.166] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | high | 151.25 us | 121.46 us | 0.797 [0.784..0.810] | 0.792 [0.782..0.804]   | 0.792      | 0.802      | 0.998 [0.995..1.005] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | high | 40.48 us  | 30.08 us  | 0.745 [0.732..0.752] | 0.742 [0.729..0.747]   | 0.746      | 0.741      | 0.998 [0.997..1.004] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | high | 77.44 us  | 64.71 us  | 0.836 [0.829..0.844] | 0.833 [0.822..0.839]   | 0.829      | 0.843      | 1.003 [0.993..1.010] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | high | 87.85 us  | 69.56 us  | 0.792 [0.789..0.796] | 0.789 [0.785..0.793]   | 0.792      | 0.792      | 1.007 [0.995..1.009] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | high | 1.54 us   | 750.0 ns  | 0.486 [0.486..0.486] | 0.488 [0.487..0.493] * | 0.488      | 0.490      | 1.001 [0.997..1.009] | -           | **faster** |

## Tier 3: branch vs main (15 scenarios, weighted geomean 0.476, floor 0.230)

| scenario                 | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------ | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 drop+take             | C    | low  | 110.52 us | 56.52 us  | 0.513 [0.509..0.522] | 0.510 [0.506..0.516]   | 0.512      | 0.517      | 1.003 [0.996..1.009] | -           | **faster** |
| G1 drop+take             | M    | low  | 16.63 us  | 7.92 us   | 0.477 [0.476..0.481] | 0.476 [0.474..0.480]   | 0.479      | 0.477      | 1.000 [0.993..1.008] | -           | **faster** |
| G1 filter+first          | M    | mid  | 1.04 us   | 500.0 ns  | 0.480 [0.480..0.500] | 0.480 [0.474..0.495] * | 0.479      | 0.486      | 0.997 [0.992..1.016] | -           | **faster** |
| G1 filter+map+take(10)   | M    | mid  | 708.0 ns  | 375.0 ns  | 0.530 [0.530..0.530] | 0.555 [0.546..0.559] * | 0.548      | 0.559      | 0.997 [0.986..1.000] | -           | **faster** |
| G1 find early hit        | M    | mid  | 375.0 ns  | 208.0 ns  | 0.555 [0.499..0.555] | 0.471 [0.460..0.474] * | 0.471      | 0.467      | 1.007 [0.973..1.042] | -           | **faster** |
| G1 find late hit         | M    | mid  | 15.94 us  | 7.46 us   | 0.466 [0.461..0.472] | 0.466 [0.462..0.476]   | 0.466      | 0.466      | 0.999 [0.987..1.008] | -           | **faster** |
| G1 find miss             | M    | mid  | 15.96 us  | 7.38 us   | 0.460 [0.454..0.465] | 0.457 [0.451..0.463]   | 0.463      | 0.457      | 0.996 [0.964..1.010] | -           | **faster** |
| G1 flat+map              | M    | mid  | 34.85 us  | 14.06 us  | 0.402 [0.401..0.407] | 0.392 [0.392..0.397]   | 0.405      | 0.401      | 0.996 [0.992..1.001] | -           | **faster** |
| G1 flatMap+filter+map    | M    | mid  | 120.96 us | 56.10 us  | 0.464 [0.461..0.469] | 0.461 [0.455..0.464]   | 0.465      | 0.464      | 0.998 [0.989..1.003] | -           | **faster** |
| G2 deep-15 flatMap-first | M    | high | 408.06 us | 181.44 us | 0.450 [0.397..0.494] | 0.443 [0.393..0.486]   | 0.492      | 0.403      | 1.024 [0.812..1.230] | -           | **faster** |
| G2 deep-15 object        | M    | high | 150.21 us | 71.10 us  | 0.479 [0.429..0.529] | 0.471 [0.424..0.520]   | 0.526      | 0.431      | 1.018 [0.807..1.241] | -           | **faster** |
| G2 deep-15 primitive     | M    | high | 157.56 us | 76.96 us  | 0.491 [0.486..0.494] | 0.483 [0.479..0.487]   | 0.491      | 0.490      | 0.999 [0.980..1.013] | -           | **faster** |
| G2 deep-8 flatMap-first  | M    | high | 265.54 us | 122.25 us | 0.467 [0.417..0.509] | 0.461 [0.413..0.503]   | 0.508      | 0.422      | 1.014 [0.812..1.219] | -           | **faster** |
| G2 deep-8 object         | M    | high | 99.25 us  | 48.81 us  | 0.495 [0.437..0.553] | 0.489 [0.432..0.545]   | 0.548      | 0.442      | 1.025 [0.802..1.240] | -           | **faster** |
| G2 deep-8 primitive      | M    | high | 94.48 us  | 46.29 us  | 0.489 [0.487..0.498] | 0.483 [0.476..0.487]   | 0.489      | 0.492      | 1.002 [0.989..1.015] | -           | **faster** |
