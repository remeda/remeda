# cand-full vs main, Bun

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run             | entry order                     | runner   | source | pollution | node      | flags | scale | wall  |
| --------------- | ------------------------------- | -------- | ------ | --------- | --------- | ----- | ----- | ----- |
| prepub/x-bun-r0 | main,branch-v-cand-full,main-aa | portable | dist   | P2        | bun 1.4.2 | -     | 1     | 118 s |
| prepub/x-bun-r1 | branch-v-cand-full,main-aa,main | portable | dist   | P2        | bun 1.4.2 | -     | 1     | 118 s |

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
| 1    | 114   | 0.009          | 0.046               | 0.118 | 57            | 0 (0.0%)    | 0               |
| 2    | 14    | 0.004          | 0.022               | 0.025 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy               | T1 gm | T1 verdicts           | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------------------ | ----- | --------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch-v-cand-full | 0.704 | faster 35, neutral 22 | 0.565 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa            | 1.000 | neutral 57            | 1.005 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 1.00%, T3 0.50%).

| rank | copy               | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------------------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch-v-cand-full | 0              | 0.704 | 0.565 | -     | -       |

## Tier 1: branch-v-cand-full vs main (57 scenarios, weighted geomean 0.704, floor 0.046)

| scenario                                        | size | pop            | main      | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ----------------------------------------------- | ---- | -------------- | --------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                                   | S    | high           | 41.67 us  | 21.79 us           | 0.523 [0.522..0.524] | 0.509 [0.505..0.513] | 0.524      | 0.522      | 1.038 [1.035..1.041] | -           | **faster** |
| G1 filter+map                                   | C    | high           | 184.83 us | 80.08 us           | 0.433 [0.429..0.437] | 0.422 [0.418..0.426] | 0.429      | 0.437      | 1.037 [1.029..1.045] | -           | **faster** |
| G1 map                                          | S    | high           | 28.54 us  | 7.52 us            | 0.264 [0.263..0.264] | 0.255 [0.255..0.255] | 0.263      | 0.264      | 1.001 [0.990..1.012] | -           | **faster** |
| G1 map                                          | C    | high           | 133.13 us | 26.83 us           | 0.202 [0.200..0.203] | 0.197 [0.195..0.198] | 0.203      | 0.200      | 1.003 [1.003..1.003] | -           | **faster** |
| G1 map+filter+map                               | S    | high           | 67.19 us  | 30.83 us           | 0.459 [0.458..0.460] | 0.448 [0.446..0.449] | 0.458      | 0.460      | 1.010 [1.002..1.018] | -           | **faster** |
| G1 map+filter+map                               | C    | high           | 311.96 us | 116.77 us          | 0.374 [0.372..0.377] | 0.361 [0.359..0.364] | 0.372      | 0.377      | 1.006 [1.005..1.007] | -           | **faster** |
| G3 pipe(x, add(1))                              | x64  | high           | 3.50 us   | 916.0 ns           | 0.262 [0.256..0.268] | 0.258 [0.252..0.264] | 0.256      | 0.268      | 1.005 [0.976..1.035] | -           | **faster** |
| G3 scalar arrows depth-3                        | x64  | high           | 2.04 us   | 1.00 us            | 0.490 [0.490..0.490] | 0.483 [0.483..0.483] | 0.490      | 0.490      | 1.000 [1.000..1.000] | -           | **faster** |
| G5 data-first difference                        | XS   | mid (override) | 27.46 us  | 15.63 us           | 0.569 [0.557..0.582] | 0.570 [0.557..0.582] | 0.582      | 0.557      | 0.988 [0.975..1.002] | -           | **faster** |
| G5 data-first difference                        | S    | mid (override) | 27.83 us  | 9.46 us            | 0.340 [0.328..0.352] | 0.335 [0.324..0.346] | 0.352      | 0.328      | 1.002 [0.993..1.012] | -           | **faster** |
| G5 data-first difference                        | C    | mid (override) | 155.13 us | 51.96 us           | 0.335 [0.329..0.340] | 0.328 [0.322..0.333] | 0.340      | 0.329      | 0.995 [0.986..1.005] | -           | **faster** |
| G5 data-first difference                        | M    | mid (override) | 20.06 us  | 6.06 us            | 0.302 [0.256..0.348] | 0.293 [0.248..0.338] | 0.348      | 0.256      | 0.982 [0.981..0.984] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | XS   | mid (override) | 37.67 us  | 25.71 us           | 0.683 [0.670..0.695] | 0.684 [0.673..0.695] | 0.695      | 0.670      | 0.994 [0.979..1.008] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | S    | mid (override) | 34.46 us  | 17.31 us           | 0.502 [0.499..0.505] | 0.501 [0.499..0.504] | 0.505      | 0.499      | 0.992 [0.990..0.994] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | C    | mid (override) | 175.10 us | 86.19 us           | 0.492 [0.484..0.501] | 0.482 [0.474..0.489] | 0.501      | 0.484      | 0.994 [0.983..1.005] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | M    | mid (override) | 25.75 us  | 13.29 us           | 0.516 [0.516..0.516] | 0.510 [0.510..0.511] | 0.516      | 0.516      | 0.986 [0.981..0.992] | -           | **faster** |
| G5 data-first filter                            | XS   | high           | 6.48 us   | 6.42 us            | 0.992 [0.957..1.027] | 0.998 [0.970..1.026] | 1.027      | 0.957      | 1.003 [1.000..1.006] | -           | neutral    |
| G5 data-first filter                            | S    | high           | 5.31 us   | 5.31 us            | 0.999 [0.991..1.007] | 0.999 [0.991..1.007] | 1.007      | 0.991      | 1.000 [1.000..1.000] | -           | neutral    |
| G5 data-first filter                            | C    | high           | 27.67 us  | 27.83 us           | 1.006 [1.001..1.011] | 1.006 [0.996..1.015] | 1.011      | 1.001      | 1.001 [0.994..1.009] | -           | neutral    |
| G5 data-first map                               | XS   | high           | 8.00 us   | 8.02 us            | 1.003 [0.995..1.011] | 1.004 [0.994..1.015] | 0.995      | 1.011      | 0.982 [0.979..0.984] | -           | neutral    |
| G5 data-first map                               | S    | high           | 4.35 us   | 4.35 us            | 1.000 [0.991..1.009] | 0.997 [0.991..1.003] | 1.009      | 0.991      | 1.005 [1.000..1.009] | -           | neutral    |
| G5 data-first map                               | C    | high           | 21.54 us  | 21.46 us           | 0.996 [0.994..0.998] | 0.994 [0.993..0.995] | 0.998      | 0.994      | 1.004 [1.000..1.008] | -           | neutral    |
| G5 data-first unique                            | XS   | high           | 26.73 us  | 15.08 us           | 0.564 [0.558..0.571] | 0.562 [0.554..0.570] | 0.571      | 0.558      | 0.980 [0.980..0.980] | -           | **faster** |
| G5 data-first unique                            | S    | high           | 34.92 us  | 18.83 us           | 0.539 [0.533..0.545] | 0.532 [0.525..0.540] | 0.545      | 0.533      | 1.001 [0.988..1.013] | -           | **faster** |
| G5 data-first unique                            | C    | high           | 219.90 us | 128.90 us          | 0.586 [0.575..0.598] | 0.587 [0.576..0.598] | 0.598      | 0.575      | 1.003 [0.995..1.011] | -           | **faster** |
| G5 data-first uniqueBy                          | XS   | high           | 30.65 us  | 29.54 us           | 0.964 [0.959..0.969] | 0.959 [0.952..0.967] | 0.969      | 0.959      | 0.991 [0.986..0.996] | -           | neutral    |
| G5 data-first uniqueBy                          | S    | high           | 39.42 us  | 26.94 us           | 0.683 [0.675..0.692] | 0.671 [0.662..0.680] | 0.692      | 0.675      | 1.008 [1.006..1.011] | -           | **faster** |
| G5 data-first uniqueBy                          | C    | high           | 241.40 us | 160.46 us          | 0.665 [0.655..0.675] | 0.661 [0.653..0.670] | 0.675      | 0.655      | 0.992 [0.984..0.999] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | XS   | high           | 32.69 us  | 31.54 us           | 0.965 [0.956..0.974] | 0.972 [0.962..0.982] | 0.974      | 0.956      | 0.990 [0.980..1.000] | -           | neutral    |
| G5 data-first uniqueBy (reads data)             | S    | high           | 43.02 us  | 29.31 us           | 0.681 [0.677..0.686] | 0.672 [0.666..0.678] | 0.686      | 0.677      | 1.007 [1.006..1.008] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | C    | high           | 253.81 us | 181.17 us          | 0.714 [0.707..0.721] | 0.713 [0.705..0.721] | 0.721      | 0.707      | 1.009 [0.991..1.027] | -           | **faster** |
| G6 map(fn)(data)                                | S    | high           | 9.77 us   | 4.21 us            | 0.431 [0.421..0.441] | 0.437 [0.429..0.445] | 0.441      | 0.421      | 0.994 [0.983..1.004] | -           | **faster** |
| G6 map(fn)(data)                                | C    | high           | 27.19 us  | 21.69 us           | 0.798 [0.793..0.803] | 0.797 [0.795..0.799] | 0.803      | 0.793      | 0.998 [0.995..1.002] | -           | **faster** |
| G7 entries data-first                           | XS   | high           | 15.08 us  | 15.10 us           | 1.001 [1.000..1.003] | 1.000 [0.999..1.002] | 1.003      | 1.000      | 0.994 [0.992..0.997] | -           | neutral    |
| G7 entries data-first                           | S    | high           | 19.92 us  | 20.04 us           | 1.006 [0.994..1.019] | 1.003 [0.993..1.013] | 0.994      | 1.019      | 1.017 [1.002..1.031] | -           | neutral    |
| G7 entries data-first                           | C    | high           | 115.42 us | 113.75 us          | 0.986 [0.981..0.990] | 0.989 [0.986..0.991] | 0.990      | 0.981      | 0.988 [0.976..0.999] | -           | neutral    |
| G7 groupBy data-first                           | XS   | high           | 12.67 us  | 12.50 us           | 0.987 [0.964..1.010] | 0.986 [0.965..1.008] | 1.010      | 0.964      | 0.989 [0.987..0.990] | -           | neutral    |
| G7 groupBy data-first                           | S    | high           | 7.00 us   | 6.90 us            | 0.985 [0.971..1.000] | 0.979 [0.957..1.000] | 0.971      | 1.000      | 0.988 [0.971..1.006] | -           | neutral    |
| G7 groupBy data-first                           | C    | high           | 39.40 us  | 38.67 us           | 0.981 [0.970..0.993] | 0.982 [0.967..0.998] | 0.993      | 0.970      | 0.996 [0.994..0.999] | -           | neutral    |
| G7 isDeepEqual data-first                       | XS   | high           | 24.29 us  | 24.25 us           | 0.998 [0.997..1.000] | 0.999 [0.996..1.001] | 0.997      | 1.000      | 0.997 [0.991..1.003] | -           | neutral    |
| G7 isDeepEqual data-first                       | S    | high           | 33.52 us  | 33.83 us           | 1.009 [1.004..1.015] | 1.004 [1.003..1.006] | 1.004      | 1.015      | 1.006 [1.001..1.010] | -           | neutral    |
| G7 isDeepEqual data-first                       | C    | high           | 308.23 us | 308.15 us          | 1.000 [0.998..1.002] | 1.001 [0.997..1.004] | 0.998      | 1.002      | 0.996 [0.992..0.999] | -           | neutral    |
| G7 mapValues data-first                         | XS   | high           | 19.73 us  | 19.71 us           | 0.999 [0.994..1.004] | 0.999 [0.994..1.005] | 0.994      | 1.004      | 0.996 [0.996..0.996] | -           | neutral    |
| G7 mapValues data-first                         | S    | high           | 32.35 us  | 31.73 us           | 0.981 [0.972..0.990] | 0.984 [0.979..0.989] | 0.990      | 0.972      | 0.990 [0.980..1.000] | -           | neutral    |
| G7 mapValues data-first                         | C    | high           | 266.06 us | 265.98 us          | 1.000 [0.993..1.007] | 1.000 [0.993..1.008] | 1.007      | 0.993      | 1.000 [0.992..1.007] | -           | neutral    |
| G7 omit data-first                              | XS   | high           | 24.69 us  | 22.75 us           | 0.922 [0.921..0.922] | 0.925 [0.925..0.925] | 0.921      | 0.922      | 0.986 [0.983..0.990] | -           | **faster** |
| G7 omit data-first                              | S    | high           | 8.21 us   | 7.35 us            | 0.896 [0.871..0.922] | 0.901 [0.876..0.925] | 0.922      | 0.871      | 0.962 [0.935..0.990] | -           | **faster** |
| G7 omit data-first                              | C    | high           | 11.37 us  | 10.37 us           | 0.913 [0.883..0.943] | 0.921 [0.892..0.950] | 0.943      | 0.883      | 0.978 [0.972..0.985] | -           | **faster** |
| G7 pick data-first                              | XS   | high           | 10.10 us  | 8.42 us            | 0.833 [0.814..0.852] | 0.833 [0.809..0.858] | 0.814      | 0.852      | 1.017 [1.004..1.030] | -           | **faster** |
| G7 pick data-first                              | S    | high           | 2.31 us   | 1.83 us            | 0.798 [0.733..0.863] | 0.802 [0.742..0.862] | 0.863      | 0.733      | 1.059 [1.000..1.118] | -           | **faster** |
| G7 pick data-first                              | C    | high           | 2.46 us   | 2.04 us            | 0.831 [0.803..0.860] | 0.841 [0.811..0.870] | 0.860      | 0.803      | 1.043 [1.016..1.070] | -           | **faster** |
| G7 range data-first                             | XS   | mid (override) | 9.46 us   | 8.13 us            | 0.860 [0.836..0.884] | 0.872 [0.846..0.898] | 0.884      | 0.836      | 0.970 [0.945..0.995] | -           | **faster** |
| G7 range data-first                             | S    | mid (override) | 4.46 us   | 4.06 us            | 0.912 [0.880..0.944] | 0.924 [0.891..0.957] | 0.880      | 0.944      | 0.996 [0.954..1.038] | -           | **faster** |
| G7 range data-first                             | C    | mid (override) | 17.90 us  | 17.42 us           | 0.976 [0.897..1.056] | 0.976 [0.901..1.050] | 0.897      | 1.056      | 0.947 [0.904..0.990] | -           | neutral    |
| G7 sortBy data-first                            | S    | high           | 13.06 us  | 13.15 us           | 1.006 [1.003..1.010] | 1.004 [1.001..1.007] | 1.003      | 1.010      | 1.010 [1.006..1.013] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy        | S    | high           | 75.69 us  | 43.06 us           | 0.569 [0.563..0.575] | 0.562 [0.558..0.566] | 0.575      | 0.563      | 0.998 [0.988..1.007] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy        | C    | high           | 236.65 us | 121.44 us          | 0.513 [0.510..0.517] | 0.500 [0.497..0.503] | 0.517      | 0.510      | 1.019 [1.005..1.033] | -           | **faster** |

## Tier 2: branch-v-cand-full vs main (7 scenarios, weighted geomean 0.565, floor 0.022)

| scenario                                 | size | pop  | main     | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 25.08 us | 10.94 us           | 0.436 [0.427..0.446] | 0.421 [0.412..0.431] | 0.427      | 0.446      | 1.020 [1.015..1.025] | -           | **faster** |
| G1 map                                   | M    | high | 18.46 us | 3.50 us            | 0.190 [0.189..0.191] | 0.183 [0.182..0.183] | 0.191      | 0.189      | 0.998 [0.993..1.002] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 43.21 us | 15.96 us           | 0.369 [0.363..0.376] | 0.357 [0.351..0.363] | 0.363      | 0.376      | 0.997 [0.996..0.998] | -           | **faster** |
| G5 data-first filter                     | M    | high | 4.04 us  | 4.04 us            | 1.000 [0.990..1.010] | 1.000 [0.996..1.003] | 0.990      | 1.010      | 1.005 [1.000..1.010] | -           | neutral    |
| G5 data-first map                        | M    | high | 3.13 us  | 3.17 us            | 1.013 [1.013..1.013] | 1.003 [1.002..1.004] | 1.013      | 1.013      | 1.007 [1.000..1.013] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 3.29 us  | 3.17 us            | 0.962 [0.962..0.962] | 0.962 [0.960..0.965] | 0.962      | 0.962      | 1.000 [1.000..1.000] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 37.94 us | 23.35 us           | 0.616 [0.614..0.617] | 0.604 [0.603..0.604] | 0.614      | 0.617      | 1.009 [0.997..1.021] | -           | **faster** |
