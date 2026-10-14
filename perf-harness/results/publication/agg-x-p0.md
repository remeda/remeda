# No pollution (P0)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                   | entry order         | runner | source | pollution | node    | flags | scale | wall |
| --------------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| publication/x-p0-r0-a | main,branch,main-aa | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |
| publication/x-p0-r0-b | main,branch,main-aa | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |
| publication/x-p0-r1-a | branch,main-aa,main | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |
| publication/x-p0-r1-b | branch,main-aa,main | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |

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
| 1    | 48    | 0.005          | 0.026               | 0.053 | 12            | 0 (0.0%)    | 0               |
| 2    | 84    | 0.005          | 0.143               | 0.169 | 21            | 0 (0.0%)    | 0               |
| 3    | 60    | 0.010          | 0.236               | 0.243 | 15            | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts | T2 gm | T2 verdicts | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | ----------- | ----- | ----------- | ----- | ----------- | -------------- |
| branch  | 0.558 | faster 12   | 0.561 | faster 21   | 0.477 | faster 15   | 0              |
| main-aa | 1.000 | neutral 12  | 1.002 | neutral 21  | 1.009 | neutral 15  | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 1.89%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.558 | 0.561 | 0.477 | -       |

## Tier 1: branch vs main (12 scenarios, weighted geomean 0.558, floor 0.026)

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 3-step middle reads data                                                                 | C    | high | 270.79 us | 143.44 us | 0.528 [0.521..0.535] | 0.529 [0.519..0.535] | 0.534      | 0.522      | 0.994 [0.984..1.003] | -           | **faster** |
| G1 filter+map                                                                               | C    | high | 149.29 us | 74.33 us  | 0.496 [0.493..0.503] | 0.492 [0.491..0.500] | 0.495      | 0.499      | 0.998 [0.986..1.053] | -           | **faster** |
| G1 map                                                                                      | C    | high | 82.65 us  | 24.56 us  | 0.298 [0.296..0.299] | 0.296 [0.295..0.297] | 0.298      | 0.297      | 1.002 [0.991..1.005] | -           | **faster** |
| G1 map reading data                                                                         | C    | high | 114.83 us | 58.35 us  | 0.508 [0.499..0.510] | 0.507 [0.500..0.510] | 0.510      | 0.503      | 1.007 [0.995..1.016] | -           | **faster** |
| G1 map+filter+map                                                                           | C    | high | 277.81 us | 126.73 us | 0.456 [0.454..0.459] | 0.453 [0.452..0.456] | 0.455      | 0.457      | 1.000 [0.998..1.006] | -           | **faster** |
| G1 map+unique                                                                               | C    | high | 329.50 us | 216.85 us | 0.662 [0.654..0.665] | 0.661 [0.653..0.662] | 0.662      | 0.659      | 1.006 [0.997..1.020] | -           | **faster** |
| G1 uniqueBy                                                                                 | C    | high | 242.79 us | 149.73 us | 0.616 [0.604..0.649] | 0.602 [0.597..0.631] | 0.635      | 0.607      | 1.004 [0.992..1.009] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | high | 931.48 us | 714.21 us | 0.765 [0.757..0.768] | 0.767 [0.756..0.771] | 0.762      | 0.765      | 1.001 [0.994..1.004] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | high | 201.13 us | 123.69 us | 0.615 [0.602..0.620] | 0.613 [0.604..0.617] | 0.609      | 0.617      | 0.995 [0.971..1.006] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | high | 538.94 us | 450.17 us | 0.830 [0.819..0.846] | 0.831 [0.827..0.842] | 0.838      | 0.824      | 1.002 [0.963..1.013] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | high | 634.79 us | 399.12 us | 0.629 [0.622..0.634] | 0.629 [0.621..0.632] | 0.625      | 0.631      | 1.001 [1.000..1.009] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | high | 96.08 us  | 48.98 us  | 0.509 [0.507..0.512] | 0.508 [0.506..0.510] | 0.507      | 0.511      | 0.996 [0.994..1.000] | -           | **faster** |

## Tier 2: branch vs main (21 scenarios, weighted geomean 0.561, floor 0.143)

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 3-step middle reads data                                                                 | M    | high | 41.60 us  | 21.44 us  | 0.517 [0.509..0.525] | 0.513 [0.506..0.520]   | 0.516      | 0.518      | 0.998 [0.993..1.005] | -           | **faster** |
| G1 filter+first                                                                             | C    | mid  | 31.23 us  | 16.63 us  | 0.531 [0.531..0.542] | 0.528 [0.527..0.538]   | 0.537      | 0.531      | 1.007 [0.997..1.024] | -           | **faster** |
| G1 filter+map                                                                               | M    | high | 22.92 us  | 11.23 us  | 0.490 [0.485..0.500] | 0.482 [0.477..0.492]   | 0.493      | 0.490      | 0.995 [0.991..1.007] | -           | **faster** |
| G1 filter+map+take(10)                                                                      | C    | mid  | 42.90 us  | 24.58 us  | 0.571 [0.566..0.578] | 0.569 [0.562..0.574]   | 0.569      | 0.574      | 0.998 [0.995..1.005] | -           | **faster** |
| G1 find early hit                                                                           | C    | mid  | 7.92 us   | 3.83 us   | 0.484 [0.479..0.487] | 0.482 [0.479..0.485]   | 0.485      | 0.482      | 1.003 [0.995..1.011] | -           | **faster** |
| G1 find late hit                                                                            | C    | mid  | 104.63 us | 51.08 us  | 0.488 [0.478..0.491] | 0.485 [0.480..0.488]   | 0.490      | 0.482      | 0.999 [0.992..1.003] | -           | **faster** |
| G1 find miss                                                                                | C    | mid  | 102.44 us | 50.46 us  | 0.493 [0.479..0.499] | 0.492 [0.481..0.494]   | 0.496      | 0.486      | 0.999 [0.994..1.003] | -           | **faster** |
| G1 flat+map                                                                                 | C    | mid  | 223.94 us | 90.94 us  | 0.406 [0.404..0.407] | 0.405 [0.401..0.406]   | 0.405      | 0.406      | 1.009 [0.997..1.017] | -           | **faster** |
| G1 flatMap+filter+map                                                                       | C    | mid  | 765.42 us | 342.63 us | 0.450 [0.445..0.459] | 0.450 [0.445..0.459]   | 0.454      | 0.448      | 1.007 [0.992..1.020] | -           | **faster** |
| G1 map                                                                                      | M    | high | 13.23 us  | 4.48 us   | 0.337 [0.334..0.344] | 0.326 [0.320..0.336]   | 0.339      | 0.337      | 0.997 [0.987..1.028] | -           | **faster** |
| G1 map reading data                                                                         | M    | high | 18.12 us  | 10.00 us  | 0.551 [0.548..0.554] | 0.545 [0.541..0.551]   | 0.554      | 0.548      | 1.003 [0.989..1.014] | -           | **faster** |
| G1 map+filter+map                                                                           | M    | high | 42.73 us  | 19.33 us  | 0.453 [0.446..0.456] | 0.444 [0.438..0.449]   | 0.456      | 0.448      | 0.997 [0.978..1.001] | -           | **faster** |
| G1 map+unique                                                                               | M    | high | 49.75 us  | 30.48 us  | 0.612 [0.601..0.614] | 0.608 [0.597..0.609]   | 0.612      | 0.607      | 1.005 [1.002..1.012] | -           | **faster** |
| G1 uniqueBy                                                                                 | M    | high | 34.73 us  | 17.58 us  | 0.514 [0.495..0.518] | 0.511 [0.493..0.516]   | 0.516      | 0.505      | 1.007 [0.993..1.018] | -           | **faster** |
| G2 deep-15 mixed                                                                            | M    | high | 145.10 us | 87.08 us  | 0.600 [0.561..0.649] | 0.597 [0.555..0.644]   | 0.642      | 0.563      | 1.013 [0.854..1.159] | -           | **faster** |
| G2 deep-8 mixed                                                                             | M    | high | 87.87 us  | 53.75 us  | 0.616 [0.571..0.663] | 0.612 [0.568..0.658]   | 0.660      | 0.573      | 1.012 [0.859..1.169] | -           | **faster** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | high | 151.27 us | 122.50 us | 0.810 [0.781..0.817] | 0.804 [0.782..0.811]   | 0.815      | 0.793      | 0.999 [0.988..1.001] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | high | 40.48 us  | 30.15 us  | 0.746 [0.736..0.753] | 0.743 [0.732..0.749]   | 0.752      | 0.738      | 1.001 [0.996..1.004] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | high | 77.31 us  | 65.50 us  | 0.843 [0.837..0.851] | 0.838 [0.832..0.847]   | 0.847      | 0.840      | 0.989 [0.976..1.004] | -           | **faster** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | high | 87.75 us  | 69.85 us  | 0.796 [0.790..0.799] | 0.793 [0.786..0.798]   | 0.798      | 0.792      | 1.002 [1.000..1.005] | -           | **faster** |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | high | 1.54 us   | 792.0 ns  | 0.514 [0.514..0.514] | 0.508 [0.504..0.512] * | 0.507      | 0.509      | 0.996 [0.988..1.005] | -           | **faster** |

## Tier 3: branch vs main (15 scenarios, weighted geomean 0.477, floor 0.236)

| scenario                 | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------ | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 drop+take             | C    | low  | 110.94 us | 56.88 us  | 0.513 [0.504..0.524] | 0.510 [0.501..0.517]   | 0.518      | 0.509      | 0.995 [0.989..1.005] | -           | **faster** |
| G1 drop+take             | M    | low  | 16.60 us  | 7.94 us   | 0.477 [0.474..0.481] | 0.474 [0.471..0.477]   | 0.480      | 0.474      | 1.000 [0.997..1.003] | -           | **faster** |
| G1 filter+first          | M    | mid  | 1.04 us   | 541.0 ns  | 0.519 [0.480..0.520] | 0.495 [0.492..0.500] * | 0.496      | 0.495      | 1.003 [0.971..1.011] | -           | **faster** |
| G1 filter+map+take(10)   | M    | mid  | 687.5 ns  | 417.0 ns  | 0.607 [0.589..0.625] | 0.578 [0.575..0.581] * | 0.578      | 0.578      | 1.000 [0.996..1.006] | -           | **faster** |
| G1 find early hit        | M    | mid  | 416.0 ns  | 208.0 ns  | 0.500 [0.500..0.555] | 0.480 [0.476..0.486] * | 0.477      | 0.484      | 1.010 [1.001..1.012] | -           | **faster** |
| G1 find late hit         | M    | mid  | 15.92 us  | 7.48 us   | 0.466 [0.462..0.482] | 0.467 [0.463..0.485]   | 0.476      | 0.462      | 0.999 [0.995..1.010] | -           | **faster** |
| G1 find miss             | M    | mid  | 15.85 us  | 7.46 us   | 0.468 [0.455..0.480] | 0.467 [0.458..0.472]   | 0.476      | 0.460      | 0.989 [0.977..1.000] | -           | **faster** |
| G1 flat+map              | M    | mid  | 34.92 us  | 14.08 us  | 0.404 [0.395..0.408] | 0.394 [0.388..0.401]   | 0.405      | 0.400      | 1.009 [1.005..1.018] | -           | **faster** |
| G1 flatMap+filter+map    | M    | mid  | 119.90 us | 55.98 us  | 0.476 [0.456..0.488] | 0.470 [0.453..0.480]   | 0.476      | 0.472      | 1.006 [0.986..1.014] | -           | **faster** |
| G2 deep-15 flatMap-first | M    | high | 412.31 us | 180.65 us | 0.442 [0.395..0.494] | 0.436 [0.391..0.486]   | 0.491      | 0.395      | 1.015 [0.811..1.235] | -           | **faster** |
| G2 deep-15 object        | M    | high | 149.48 us | 70.69 us  | 0.474 [0.428..0.525] | 0.469 [0.423..0.518]   | 0.521      | 0.429      | 1.029 [0.817..1.243] | -           | **faster** |
| G2 deep-15 primitive     | M    | high | 157.85 us | 77.00 us  | 0.490 [0.487..0.497] | 0.482 [0.480..0.490]   | 0.493      | 0.490      | 1.007 [0.998..1.016] | -           | **faster** |
| G2 deep-8 flatMap-first  | M    | high | 266.42 us | 122.21 us | 0.463 [0.416..0.511] | 0.458 [0.412..0.506]   | 0.509      | 0.418      | 1.014 [0.822..1.217] | -           | **faster** |
| G2 deep-8 object         | M    | high | 99.69 us  | 48.46 us  | 0.493 [0.436..0.542] | 0.487 [0.432..0.537]   | 0.542      | 0.440      | 1.028 [0.801..1.241] | -           | **faster** |
| G2 deep-8 primitive      | M    | high | 94.31 us  | 46.38 us  | 0.492 [0.489..0.494] | 0.484 [0.483..0.485]   | 0.490      | 0.494      | 0.995 [0.987..1.008] | -           | **faster** |
