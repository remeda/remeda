# cand-full vs main, Node 24

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                | entry order                     | runner | source | pollution | node     | flags | scale | wall  |
| ------------------ | ------------------------------- | ------ | ------ | --------- | -------- | ----- | ----- | ----- |
| prepub/x-node24-r0 | main,branch-v-cand-full,main-aa | vitest | dist   | P2        | v24.21.0 | -     | 1     | 120 s |
| prepub/x-node24-r1 | branch-v-cand-full,main-aa,main | vitest | dist   | P2        | v24.21.0 | -     | 1     | 120 s |

Popularity: research/popularity.json.

Tier overrides (tier-overrides.json; research/popularity.json is untouched):

| function   | kinds      | sizes | tier | scenarios changed here                                                                                                                                                                                                                                                                                                                                                                                  | reason                                                                                                                                                                                                                      |
| ---------- | ---------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| difference | data-first | all   | 1    | 8: G5 data-first difference XS (2 -> 1); G5 data-first difference S (2 -> 1); G5 data-first difference C (2 -> 1); G5 data-first difference M (3 -> 1); G5 data-first difference(range) (adopter shape) XS (2 -> 1); G5 data-first difference(range) (adopter shape) S (2 -> 1); G5 data-first difference(range) (adopter shape) C (2 -> 1); G5 data-first difference(range) (adopter shape) M (3 -> 1) | Biggest adopter: @prisma/dev (29M downloads/month, 62% of remeda's own) calls only difference and range, both data-first (difference(range(a, b), used)); difference's mid popularity would otherwise drop these to tier 2. |
| range      | data-first | all   | 1    | 3: G7 range data-first XS (2 -> 1); G7 range data-first S (2 -> 1); G7 range data-first C (2 -> 1)                                                                                                                                                                                                                                                                                                      | The other half of the same @prisma/dev call (range data-first); range's mid popularity would otherwise drop it to tier 2.                                                                                                   |

## A/A noise floors and false-call rate

Floor: p95 of |main-aa/main - 1| over the tier's (scenario, run) pairs. False calls: the tier's verdict rule applied to main-aa vs main (anything but neutral is a false call; bar = regression or BLOCK).

| tier | pairs | median abs dev | p95 abs dev (floor) | max   | A/A scenarios | false calls | false bar calls |
| ---- | ----- | -------------- | ------------------- | ----- | ------------- | ----------- | --------------- |
| 1    | 114   | 0.007          | 0.025               | 0.108 | 57            | 0 (0.0%)    | 0               |
| 2    | 14    | 0.006          | 0.022               | 0.023 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy               | T1 gm | T1 verdicts                         | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------------------ | ----- | ----------------------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch-v-cand-full | 0.753 | faster 29, neutral 27, regression 1 | 0.617 | faster 4, neutral 3 | -     | -           | 1              |
| main-aa            | 0.999 | neutral 57                          | 1.000 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy               | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------------------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch-v-cand-full | 1              | 0.753 | 0.617 | -     | -       |

## Tier 1: branch-v-cand-full vs main (57 scenarios, weighted geomean 0.753, floor 0.025)

Bar violations: G7 isDeepEqual data-first C (1.063).

| scenario                                        | size | pop            | main      | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict        |
| ----------------------------------------------- | ---- | -------------- | --------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | -------------- |
| G1 filter+map                                   | S    | high           | 51.00 us  | 25.23 us           | 0.495 [0.491..0.498] | 0.496 [0.492..0.499] | 0.491      | 0.498      | 0.993 [0.992..0.995] | -           | **faster**     |
| G1 filter+map                                   | C    | high           | 274.08 us | 114.71 us          | 0.419 [0.417..0.420] | 0.418 [0.418..0.418] | 0.420      | 0.417      | 1.006 [1.000..1.012] | -           | **faster**     |
| G1 map                                          | S    | high           | 36.29 us  | 13.29 us           | 0.366 [0.359..0.373] | 0.361 [0.356..0.366] | 0.373      | 0.359      | 0.997 [0.981..1.014] | -           | **faster**     |
| G1 map                                          | C    | high           | 203.15 us | 66.48 us           | 0.327 [0.325..0.330] | 0.325 [0.324..0.326] | 0.330      | 0.325      | 1.001 [0.984..1.017] | -           | **faster**     |
| G1 map+filter+map                               | S    | high           | 79.10 us  | 33.21 us           | 0.420 [0.410..0.430] | 0.420 [0.414..0.426] | 0.430      | 0.410      | 0.992 [0.982..1.002] | -           | **faster**     |
| G1 map+filter+map                               | C    | high           | 450.35 us | 160.33 us          | 0.356 [0.353..0.359] | 0.355 [0.351..0.359] | 0.359      | 0.353      | 0.989 [0.977..1.000] | -           | **faster**     |
| G3 pipe(x, add(1))                              | x64  | high           | 1.90 us   | 1.17 us            | 0.617 [0.584..0.651] | 0.635 [0.622..0.647] | 0.651      | 0.584      | 1.011 [1.000..1.021] | -           | **faster**     |
| G3 scalar arrows depth-3                        | x64  | high           | 1.98 us   | 1.17 us            | 0.590 [0.583..0.596] | 0.577 [0.566..0.588] | 0.583      | 0.596      | 1.000 [1.000..1.000] | -           | **faster**     |
| G5 data-first difference                        | XS   | mid (override) | 36.10 us  | 20.71 us           | 0.574 [0.564..0.583] | 0.572 [0.567..0.576] | 0.583      | 0.564      | 0.984 [0.978..0.991] | -           | **faster**     |
| G5 data-first difference                        | S    | mid (override) | 38.92 us  | 18.08 us           | 0.465 [0.459..0.470] | 0.463 [0.458..0.468] | 0.459      | 0.470      | 1.020 [1.006..1.034] | -           | **faster**     |
| G5 data-first difference                        | C    | mid (override) | 236.31 us | 106.52 us          | 0.451 [0.443..0.458] | 0.449 [0.442..0.456] | 0.458      | 0.443      | 0.996 [0.994..0.997] | -           | **faster**     |
| G5 data-first difference                        | M    | mid (override) | 32.33 us  | 13.00 us           | 0.402 [0.397..0.407] | 0.396 [0.394..0.398] | 0.407      | 0.397      | 0.996 [0.978..1.014] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | XS   | mid (override) | 58.40 us  | 42.19 us           | 0.722 [0.714..0.730] | 0.718 [0.706..0.730] | 0.714      | 0.730      | 1.000 [0.994..1.006] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | S    | mid (override) | 72.56 us  | 51.54 us           | 0.710 [0.710..0.711] | 0.707 [0.704..0.709] | 0.711      | 0.710      | 0.998 [0.998..0.998] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | C    | mid (override) | 428.33 us | 278.06 us          | 0.649 [0.647..0.651] | 0.646 [0.646..0.646] | 0.647      | 0.651      | 0.998 [0.992..1.004] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | M    | mid (override) | 67.96 us  | 43.69 us           | 0.643 [0.641..0.644] | 0.644 [0.641..0.647] | 0.641      | 0.644      | 0.999 [0.994..1.003] | -           | **faster**     |
| G5 data-first filter                            | XS   | high           | 10.04 us  | 10.08 us           | 1.004 [1.000..1.008] | 1.003 [0.996..1.009] | 1.008      | 1.000      | 1.002 [1.000..1.004] | -           | neutral        |
| G5 data-first filter                            | S    | high           | 7.29 us   | 7.29 us            | 1.000 [1.000..1.000] | 0.999 [0.997..1.000] | 1.000      | 1.000      | 0.997 [0.994..1.000] | -           | neutral        |
| G5 data-first filter                            | C    | high           | 36.94 us  | 37.29 us           | 1.010 [1.003..1.016] | 1.008 [1.001..1.014] | 1.016      | 1.003      | 0.997 [0.994..1.000] | -           | neutral        |
| G5 data-first map                               | XS   | high           | 9.00 us   | 9.06 us            | 1.007 [0.995..1.019] | 1.007 [0.997..1.018] | 1.019      | 0.995      | 1.007 [1.005..1.009] | -           | neutral        |
| G5 data-first map                               | S    | high           | 7.35 us   | 7.38 us            | 1.003 [1.000..1.006] | 1.000 [0.996..1.005] | 1.006      | 1.000      | 0.997 [0.994..1.000] | -           | neutral        |
| G5 data-first map                               | C    | high           | 35.44 us  | 35.67 us           | 1.007 [0.991..1.023] | 0.999 [0.999..1.000] | 0.991      | 1.023      | 0.999 [0.982..1.017] | -           | neutral        |
| G5 data-first unique                            | XS   | high           | 36.60 us  | 19.17 us           | 0.524 [0.524..0.524] | 0.520 [0.519..0.521] | 0.524      | 0.524      | 1.007 [1.002..1.011] | -           | **faster**     |
| G5 data-first unique                            | S    | high           | 61.96 us  | 32.35 us           | 0.522 [0.520..0.525] | 0.528 [0.520..0.537] | 0.520      | 0.525      | 0.965 [0.943..0.987] | -           | **faster**     |
| G5 data-first unique                            | C    | high           | 360.40 us | 209.19 us          | 0.581 [0.566..0.596] | 0.580 [0.567..0.594] | 0.566      | 0.596      | 1.006 [0.999..1.012] | -           | **faster**     |
| G5 data-first uniqueBy                          | XS   | high           | 41.23 us  | 27.60 us           | 0.670 [0.664..0.675] | 0.668 [0.663..0.673] | 0.675      | 0.664      | 1.008 [1.007..1.008] | -           | **faster**     |
| G5 data-first uniqueBy                          | S    | high           | 65.63 us  | 39.92 us           | 0.608 [0.604..0.612] | 0.606 [0.603..0.609] | 0.612      | 0.604      | 0.989 [0.984..0.994] | -           | **faster**     |
| G5 data-first uniqueBy                          | C    | high           | 387.46 us | 242.98 us          | 0.627 [0.620..0.634] | 0.624 [0.618..0.631] | 0.634      | 0.620      | 1.003 [1.002..1.003] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | XS   | high           | 42.69 us  | 29.73 us           | 0.696 [0.695..0.698] | 0.697 [0.697..0.698] | 0.695      | 0.698      | 0.998 [0.991..1.004] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | S    | high           | 67.25 us  | 42.56 us           | 0.633 [0.628..0.638] | 0.633 [0.631..0.635] | 0.628      | 0.638      | 1.011 [1.000..1.022] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | C    | high           | 400.83 us | 260.15 us          | 0.649 [0.646..0.652] | 0.650 [0.646..0.653] | 0.646      | 0.652      | 1.000 [0.994..1.007] | -           | **faster**     |
| G6 map(fn)(data)                                | S    | high           | 8.85 us   | 7.48 us            | 0.845 [0.843..0.846] | 0.842 [0.842..0.842] | 0.846      | 0.843      | 1.009 [1.005..1.014] | -           | **faster**     |
| G6 map(fn)(data)                                | C    | high           | 37.10 us  | 34.56 us           | 0.932 [0.914..0.949] | 0.935 [0.920..0.951] | 0.914      | 0.949      | 0.969 [0.954..0.985] | -           | **faster**     |
| G7 entries data-first                           | XS   | high           | 7.90 us   | 7.81 us            | 0.989 [0.984..0.995] | 0.987 [0.981..0.994] | 0.984      | 0.995      | 0.995 [0.989..1.000] | -           | neutral        |
| G7 entries data-first                           | S    | high           | 4.75 us   | 4.81 us            | 1.013 [1.000..1.026] | 1.013 [0.999..1.027] | 1.026      | 1.000      | 0.996 [0.991..1.000] | -           | neutral        |
| G7 entries data-first                           | C    | high           | 18.10 us  | 18.21 us           | 1.006 [1.005..1.007] | 0.999 [0.995..1.002] | 1.007      | 1.005      | 1.015 [1.002..1.028] | -           | neutral        |
| G7 groupBy data-first                           | XS   | high           | 29.04 us  | 28.92 us           | 0.996 [0.970..1.022] | 0.994 [0.975..1.014] | 1.022      | 0.970      | 0.983 [0.976..0.990] | -           | neutral        |
| G7 groupBy data-first                           | S    | high           | 16.79 us  | 16.87 us           | 1.005 [0.995..1.015] | 1.005 [0.995..1.016] | 0.995      | 1.015      | 1.001 [0.993..1.010] | -           | neutral        |
| G7 groupBy data-first                           | C    | high           | 61.92 us  | 61.37 us           | 0.991 [0.986..0.997] | 0.991 [0.984..0.997] | 0.986      | 0.997      | 1.003 [0.996..1.011] | -           | neutral        |
| G7 isDeepEqual data-first                       | XS   | high           | 20.56 us  | 20.60 us           | 1.002 [1.002..1.002] | 1.003 [0.999..1.006] | 1.002      | 1.002      | 0.998 [0.996..1.000] | -           | neutral        |
| G7 isDeepEqual data-first                       | S    | high           | 21.54 us  | 21.71 us           | 1.008 [1.002..1.014] | 1.006 [1.002..1.010] | 1.002      | 1.014      | 1.006 [0.990..1.021] | -           | neutral        |
| G7 isDeepEqual data-first                       | C    | high           | 350.67 us | 372.25 us          | 1.063 [1.033..1.092] | 1.035 [1.031..1.039] | 1.033      | 1.092      | 1.015 [1.011..1.019] | -           | **regression** |
| G7 mapValues data-first                         | XS   | high           | 16.77 us  | 16.81 us           | 1.002 [0.992..1.012] | 1.000 [0.993..1.008] | 0.992      | 1.012      | 1.000 [0.998..1.002] | -           | neutral        |
| G7 mapValues data-first                         | S    | high           | 15.81 us  | 15.77 us           | 0.997 [0.992..1.003] | 0.995 [0.990..1.000] | 1.003      | 0.992      | 0.999 [0.984..1.013] | -           | neutral        |
| G7 mapValues data-first                         | C    | high           | 149.77 us | 145.54 us          | 0.975 [0.919..1.030] | 0.988 [0.934..1.043] | 0.919      | 1.030      | 0.975 [0.892..1.057] | -           | neutral        |
| G7 omit data-first                              | XS   | high           | 26.21 us  | 26.40 us           | 1.007 [1.006..1.008] | 1.011 [1.007..1.015] | 1.006      | 1.008      | 0.998 [0.998..0.998] | -           | neutral        |
| G7 omit data-first                              | S    | high           | 29.85 us  | 30.17 us           | 1.011 [1.004..1.017] | 1.009 [1.002..1.016] | 1.017      | 1.004      | 1.013 [1.010..1.015] | -           | neutral        |
| G7 omit data-first                              | C    | high           | 199.31 us | 198.94 us          | 0.999 [0.969..1.029] | 1.000 [0.961..1.039] | 1.029      | 0.969      | 0.993 [0.980..1.005] | -           | neutral        |
| G7 pick data-first                              | XS   | high           | 14.69 us  | 14.67 us           | 0.999 [0.992..1.006] | 0.998 [0.993..1.003] | 1.006      | 0.992      | 0.997 [0.992..1.003] | -           | neutral        |
| G7 pick data-first                              | S    | high           | 5.58 us   | 5.60 us            | 1.004 [1.000..1.007] | 1.007 [1.003..1.010] | 1.000      | 1.007      | 0.996 [0.992..1.000] | -           | neutral        |
| G7 pick data-first                              | C    | high           | 6.98 us   | 6.98 us            | 1.000 [1.000..1.000] | 1.000 [1.000..1.000] | 1.000      | 1.000      | 1.006 [1.000..1.012] | -           | neutral        |
| G7 range data-first                             | XS   | mid (override) | 23.60 us  | 23.38 us           | 0.990 [0.988..0.993] | 0.990 [0.988..0.992] | 0.988      | 0.993      | 0.995 [0.986..1.004] | -           | neutral        |
| G7 range data-first                             | S    | mid (override) | 27.54 us  | 27.46 us           | 0.997 [0.994..1.000] | 0.997 [0.995..1.000] | 0.994      | 1.000      | 0.999 [0.994..1.003] | -           | neutral        |
| G7 range data-first                             | C    | mid (override) | 143.42 us | 142.60 us          | 0.994 [0.989..1.000] | 0.996 [0.991..1.001] | 0.989      | 1.000      | 0.995 [0.983..1.006] | -           | neutral        |
| G7 sortBy data-first                            | S    | high           | 29.98 us  | 30.21 us           | 1.008 [0.997..1.018] | 1.009 [0.998..1.020] | 0.997      | 1.018      | 1.000 [0.996..1.004] | -           | neutral        |
| G10 filter,map / sortBy / take / groupBy        | S    | high           | 100.13 us | 60.04 us           | 0.600 [0.597..0.602] | 0.606 [0.603..0.609] | 0.602      | 0.597      | 1.001 [0.993..1.008] | -           | **faster**     |
| G10 filter,map / sortBy / take / groupBy        | C    | high           | 374.25 us | 204.02 us          | 0.545 [0.545..0.545] | 0.547 [0.546..0.549] | 0.545      | 0.545      | 1.012 [1.000..1.024] | -           | **faster**     |

## Tier 2: branch-v-cand-full vs main (7 scenarios, weighted geomean 0.617, floor 0.022)

| scenario                                 | size | pop  | main     | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 42.15 us | 17.52 us           | 0.416 [0.413..0.419] | 0.412 [0.408..0.416] | 0.413      | 0.419      | 1.001 [0.999..1.003] | -           | **faster** |
| G1 map                                   | M    | high | 32.00 us | 10.31 us           | 0.322 [0.318..0.326] | 0.316 [0.313..0.320] | 0.326      | 0.318      | 0.986 [0.977..0.995] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 68.75 us | 23.83 us           | 0.347 [0.345..0.348] | 0.345 [0.343..0.346] | 0.348      | 0.345      | 0.996 [0.988..1.003] | -           | **faster** |
| G5 data-first filter                     | M    | high | 5.83 us  | 5.90 us            | 1.011 [1.000..1.021] | 1.014 [1.003..1.025] | 1.021      | 1.000      | 1.014 [1.007..1.021] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.40 us  | 5.37 us            | 0.996 [0.992..1.000] | 0.994 [0.985..1.003] | 0.992      | 1.000      | 1.004 [1.000..1.008] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.48 us  | 5.46 us            | 0.996 [0.985..1.008] | 0.983 [0.966..1.001] | 0.985      | 1.008      | 1.004 [1.000..1.008] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 97.17 us | 71.00 us           | 0.731 [0.726..0.736] | 0.724 [0.718..0.731] | 0.736      | 0.726      | 0.993 [0.990..0.996] | -           | **faster** |
