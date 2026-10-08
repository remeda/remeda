# Sparkplug ceiling (--max-opt=1)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run               | entry order         | runner | source | pollution | node    | flags       | scale | wall  |
| ----------------- | ------------------- | ------ | ------ | --------- | ------- | ----------- | ----- | ----- |
| main/x-maxopt1-r0 | main,branch,main-aa | vitest | dist   | P2        | v26.9.0 | --max-opt=1 | 1     | 120 s |
| main/x-maxopt1-r1 | branch,main-aa,main | vitest | dist   | P2        | v26.9.0 | --max-opt=1 | 1     | 120 s |

Popularity: research/popularity.json.

Tier overrides (tier-overrides.json; research/popularity.json is untouched):

| function   | kinds      | sizes | tier | scenarios changed here                                                                                                                                                                                                                                                                                                                                                                                  | reason                                                                                                                                                                                                                      |
| ---------- | ---------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| difference | data-first | all   | 1    | 8: G5 data-first difference XS (2 -> 1); G5 data-first difference S (2 -> 1); G5 data-first difference C (2 -> 1); G5 data-first difference M (3 -> 1); G5 data-first difference(range) (adopter shape) XS (2 -> 1); G5 data-first difference(range) (adopter shape) S (2 -> 1); G5 data-first difference(range) (adopter shape) C (2 -> 1); G5 data-first difference(range) (adopter shape) M (3 -> 1) | Biggest adopter: @prisma/dev (29M downloads/month, 62% of remeda's own) calls only difference and range, both data-first (difference(range(a, b), used)); difference's mid popularity would otherwise drop these to tier 2. |
| range      | data-first | all   | 1    | 3: G7 range data-first XS (2 -> 1); G7 range data-first S (2 -> 1); G7 range data-first C (2 -> 1)                                                                                                                                                                                                                                                                                                      | The other half of the same @prisma/dev call (range data-first); range's mid popularity would otherwise drop it to tier 2.                                                                                                   |

Lower JIT tier runs (--jitless / --max-opt): every scenario is reported as tier 3.

## A/A noise floors and false-call rate

Floor: p95 of |main-aa/main - 1| over the tier's (scenario, run) pairs. False calls: the tier's verdict rule applied to main-aa vs main (anything but neutral is a false call; bar = regression or BLOCK).

| tier | pairs | median abs dev | p95 abs dev (floor) | max   | A/A scenarios | false calls | false bar calls |
| ---- | ----- | -------------- | ------------------- | ----- | ------------- | ----------- | --------------- |
| 1    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |
| 2    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |
| 3    | 128   | 0.007          | 0.026               | 0.048 | 64            | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts | T2 gm | T2 verdicts | T3 gm | T3 verdicts           | bar violations |
| ------- | ----- | ----------- | ----- | ----------- | ----- | --------------------- | -------------- |
| branch  | -     | -           | -     | -           | 0.710 | faster 30, neutral 34 | 0              |
| main-aa | -     | -           | -     | -           | 0.999 | neutral 64            | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | -     | -     | 0.710 | -       |

## Tier 3: branch vs main (64 scenarios, weighted geomean 0.710, floor 0.026)

| scenario                                        | size | pop            | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ----------------------------------------------- | ---- | -------------- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                                   | S    | high           | 226.85 us | 123.81 us | 0.546 [0.545..0.546] | 0.545 [0.542..0.547] | 0.545      | 0.546      | 1.004 [0.994..1.013] | -           | **faster** |
| G1 filter+map                                   | C    | high           | 1.33 ms   | 617.00 us | 0.465 [0.458..0.472] | 0.472 [0.472..0.472] | 0.458      | 0.472      | 0.967 [0.952..0.981] | -           | **faster** |
| G1 filter+map                                   | M    | high           | 197.35 us | 95.71 us  | 0.485 [0.481..0.489] | 0.482 [0.479..0.485] | 0.489      | 0.481      | 1.008 [1.005..1.011] | -           | **faster** |
| G1 map                                          | S    | high           | 165.37 us | 48.44 us  | 0.293 [0.292..0.293] | 0.296 [0.295..0.297] | 0.293      | 0.292      | 0.983 [0.974..0.992] | -           | **faster** |
| G1 map                                          | C    | high           | 939.17 us | 236.75 us | 0.252 [0.252..0.252] | 0.254 [0.253..0.255] | 0.252      | 0.252      | 0.996 [0.982..1.011] | -           | **faster** |
| G1 map                                          | M    | high           | 142.98 us | 35.44 us  | 0.248 [0.247..0.249] | 0.249 [0.247..0.251] | 0.249      | 0.247      | 1.004 [0.989..1.019] | -           | **faster** |
| G1 map+filter+map                               | S    | high           | 376.25 us | 171.73 us | 0.456 [0.454..0.459] | 0.457 [0.454..0.460] | 0.459      | 0.454      | 0.993 [0.975..1.010] | -           | **faster** |
| G1 map+filter+map                               | C    | high           | 2.17 ms   | 872.10 us | 0.401 [0.397..0.406] | 0.403 [0.399..0.407] | 0.406      | 0.397      | 1.011 [0.982..1.040] | -           | **faster** |
| G1 map+filter+map                               | M    | high           | 331.08 us | 130.71 us | 0.395 [0.388..0.402] | 0.394 [0.387..0.400] | 0.402      | 0.388      | 0.991 [0.982..0.999] | -           | **faster** |
| G3 pipe(x, add(1))                              | x64  | high           | 6.65 us   | 4.98 us   | 0.749 [0.744..0.755] | 0.750 [0.747..0.752] | 0.744      | 0.755      | 1.003 [1.000..1.006] | -           | **faster** |
| G3 scalar arrows depth-3                        | x64  | high           | 8.83 us   | 9.04 us   | 1.024 [1.009..1.038] | 1.027 [1.015..1.040] | 1.038      | 1.009      | 0.988 [0.977..1.000] | -           | neutral    |
| G5 data-first difference                        | XS   | mid (override) | 140.96 us | 77.19 us  | 0.548 [0.538..0.558] | 0.546 [0.537..0.555] | 0.558      | 0.538      | 0.993 [0.977..1.010] | -           | **faster** |
| G5 data-first difference                        | S    | mid (override) | 178.54 us | 72.37 us  | 0.405 [0.404..0.406] | 0.404 [0.404..0.404] | 0.406      | 0.404      | 0.988 [0.983..0.994] | -           | **faster** |
| G5 data-first difference                        | C    | mid (override) | 1.02 ms   | 393.29 us | 0.387 [0.385..0.388] | 0.387 [0.384..0.390] | 0.388      | 0.385      | 0.992 [0.990..0.994] | -           | **faster** |
| G5 data-first difference                        | M    | mid (override) | 148.69 us | 51.40 us  | 0.346 [0.343..0.348] | 0.345 [0.343..0.347] | 0.348      | 0.343      | 1.003 [0.991..1.014] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | XS   | mid (override) | 179.44 us | 105.37 us | 0.587 [0.581..0.594] | 0.593 [0.591..0.596] | 0.594      | 0.581      | 0.992 [0.966..1.018] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | S    | mid (override) | 227.31 us | 115.42 us | 0.508 [0.505..0.511] | 0.508 [0.506..0.510] | 0.505      | 0.511      | 0.991 [0.990..0.991] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | C    | mid (override) | 1.28 ms   | 626.02 us | 0.490 [0.486..0.494] | 0.489 [0.488..0.491] | 0.486      | 0.494      | 0.997 [0.993..1.002] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | M    | mid (override) | 195.12 us | 97.92 us  | 0.502 [0.500..0.504] | 0.500 [0.497..0.503] | 0.504      | 0.500      | 0.998 [0.993..1.003] | -           | **faster** |
| G5 data-first filter                            | XS   | high           | 20.38 us  | 20.44 us  | 1.003 [1.002..1.004] | 1.002 [1.001..1.003] | 1.004      | 1.002      | 1.004 [1.004..1.004] | -           | neutral    |
| G5 data-first filter                            | S    | high           | 12.75 us  | 12.71 us  | 0.997 [0.993..1.000] | 0.999 [0.996..1.002] | 1.000      | 0.993      | 0.994 [0.990..0.997] | -           | neutral    |
| G5 data-first filter                            | C    | high           | 53.94 us  | 54.15 us  | 1.004 [1.001..1.007] | 1.003 [0.999..1.007] | 1.007      | 1.001      | 0.999 [0.996..1.002] | -           | neutral    |
| G5 data-first filter                            | M    | high           | 8.46 us   | 8.50 us   | 1.005 [1.005..1.005] | 1.002 [0.999..1.006] | 1.005      | 1.005      | 0.998 [0.995..1.000] | -           | neutral    |
| G5 data-first map                               | XS   | high           | 18.35 us  | 18.29 us  | 0.997 [0.989..1.005] | 0.995 [0.988..1.002] | 1.005      | 0.989      | 0.993 [0.984..1.002] | -           | neutral    |
| G5 data-first map                               | S    | high           | 11.35 us  | 11.37 us  | 1.002 [0.996..1.007] | 1.001 [0.996..1.006] | 1.007      | 0.996      | 0.998 [0.996..1.000] | -           | neutral    |
| G5 data-first map                               | C    | high           | 48.96 us  | 48.94 us  | 1.000 [0.999..1.000] | 0.999 [0.997..1.001] | 0.999      | 1.000      | 0.999 [0.997..1.000] | -           | neutral    |
| G5 data-first map                               | M    | high           | 7.40 us   | 7.40 us   | 1.000 [0.994..1.006] | 1.002 [0.997..1.006] | 0.994      | 1.006      | 0.997 [0.994..1.000] | -           | neutral    |
| G5 data-first unique                            | XS   | high           | 128.08 us | 54.79 us  | 0.428 [0.427..0.429] | 0.428 [0.427..0.429] | 0.429      | 0.427      | 0.999 [0.994..1.004] | -           | **faster** |
| G5 data-first unique                            | S    | high           | 190.58 us | 74.69 us  | 0.392 [0.391..0.393] | 0.392 [0.392..0.393] | 0.393      | 0.391      | 1.001 [0.992..1.009] | -           | **faster** |
| G5 data-first unique                            | C    | high           | 1.10 ms   | 429.60 us | 0.392 [0.385..0.399] | 0.393 [0.387..0.399] | 0.399      | 0.385      | 0.992 [0.976..1.007] | -           | **faster** |
| G5 data-first uniqueBy                          | XS   | high           | 136.92 us | 74.37 us  | 0.543 [0.541..0.545] | 0.544 [0.542..0.546] | 0.545      | 0.541      | 0.998 [0.995..1.002] | -           | **faster** |
| G5 data-first uniqueBy                          | S    | high           | 202.65 us | 95.35 us  | 0.471 [0.466..0.475] | 0.472 [0.468..0.476] | 0.475      | 0.466      | 0.994 [0.991..0.997] | -           | **faster** |
| G5 data-first uniqueBy                          | C    | high           | 1.14 ms   | 521.48 us | 0.456 [0.452..0.460] | 0.458 [0.453..0.463] | 0.452      | 0.460      | 0.992 [0.980..1.004] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | XS   | high           | 138.29 us | 86.42 us  | 0.625 [0.619..0.631] | 0.624 [0.620..0.628] | 0.631      | 0.619      | 1.005 [0.997..1.012] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | S    | high           | 203.85 us | 109.06 us | 0.535 [0.532..0.538] | 0.535 [0.533..0.538] | 0.538      | 0.532      | 0.999 [0.991..1.008] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | C    | high           | 1.16 ms   | 603.67 us | 0.523 [0.522..0.523] | 0.524 [0.524..0.525] | 0.522      | 0.523      | 1.012 [1.001..1.023] | -           | **faster** |
| G6 map(fn)(data)                                | S    | high           | 14.48 us  | 14.33 us  | 0.990 [0.986..0.994] | 0.991 [0.988..0.994] | 0.994      | 0.986      | 0.996 [0.991..1.000] | -           | neutral    |
| G6 map(fn)(data)                                | C    | high           | 52.21 us  | 52.10 us  | 0.998 [0.997..0.999] | 0.997 [0.995..0.999] | 0.997      | 0.999      | 1.002 [1.001..1.004] | -           | neutral    |
| G6 map(fn)(data)                                | M    | high           | 7.60 us   | 7.58 us   | 0.997 [0.995..1.000] | 0.998 [0.996..1.001] | 1.000      | 0.995      | 0.997 [0.995..1.000] | -           | neutral    |
| G7 entries data-first                           | XS   | high           | 16.04 us  | 15.92 us  | 0.992 [0.990..0.995] | 0.989 [0.987..0.991] | 0.990      | 0.995      | 0.999 [0.995..1.003] | -           | neutral    |
| G7 entries data-first                           | S    | high           | 6.23 us   | 6.33 us   | 1.017 [1.007..1.027] | 1.014 [1.001..1.027] | 1.027      | 1.007      | 1.007 [1.000..1.013] | -           | neutral    |
| G7 entries data-first                           | C    | high           | 20.23 us  | 20.10 us  | 0.994 [0.986..1.002] | 0.990 [0.983..0.997] | 0.986      | 1.002      | 0.999 [0.996..1.002] | -           | neutral    |
| G7 groupBy data-first                           | XS   | high           | 50.00 us  | 49.75 us  | 0.995 [0.993..0.997] | 0.994 [0.992..0.997] | 0.997      | 0.993      | 1.014 [1.004..1.023] | -           | neutral    |
| G7 groupBy data-first                           | S    | high           | 40.75 us  | 41.00 us  | 1.006 [1.001..1.011] | 1.010 [1.009..1.011] | 1.001      | 1.011      | 1.007 [0.996..1.018] | -           | neutral    |
| G7 groupBy data-first                           | C    | high           | 189.67 us | 188.71 us | 0.994 [0.973..1.015] | 0.999 [0.986..1.012] | 0.973      | 1.015      | 1.010 [0.996..1.024] | -           | neutral    |
| G7 isDeepEqual data-first                       | XS   | high           | 76.21 us  | 75.56 us  | 0.992 [0.989..0.995] | 0.992 [0.989..0.995] | 0.995      | 0.989      | 0.990 [0.987..0.994] | -           | neutral    |
| G7 isDeepEqual data-first                       | S    | high           | 92.35 us  | 92.52 us  | 1.002 [1.001..1.002] | 1.003 [1.003..1.003] | 1.002      | 1.001      | 1.012 [1.004..1.020] | -           | neutral    |
| G7 isDeepEqual data-first                       | C    | high           | 802.54 us | 814.79 us | 1.015 [1.010..1.021] | 1.011 [1.003..1.019] | 1.021      | 1.010      | 1.001 [0.989..1.013] | -           | neutral    |
| G7 mapValues data-first                         | XS   | high           | 51.33 us  | 51.12 us  | 0.996 [0.987..1.005] | 0.997 [0.988..1.006] | 1.005      | 0.987      | 0.995 [0.982..1.008] | -           | neutral    |
| G7 mapValues data-first                         | S    | high           | 76.04 us  | 76.87 us  | 1.011 [1.009..1.013] | 1.011 [1.009..1.013] | 1.013      | 1.009      | 1.008 [1.005..1.010] | -           | neutral    |
| G7 mapValues data-first                         | C    | high           | 625.10 us | 626.42 us | 1.002 [1.002..1.002] | 1.000 [0.997..1.004] | 1.002      | 1.002      | 0.997 [0.995..1.000] | -           | neutral    |
| G7 omit data-first                              | XS   | high           | 48.29 us  | 48.48 us  | 1.004 [1.003..1.005] | 1.000 [0.999..1.002] | 1.003      | 1.005      | 1.014 [1.007..1.021] | -           | neutral    |
| G7 omit data-first                              | S    | high           | 38.23 us  | 38.88 us  | 1.017 [1.004..1.029] | 1.010 [1.003..1.017] | 1.004      | 1.029      | 1.000 [0.988..1.012] | -           | neutral    |
| G7 omit data-first                              | C    | high           | 214.00 us | 215.35 us | 1.006 [0.980..1.033] | 1.011 [0.978..1.045] | 1.033      | 0.980      | 0.980 [0.966..0.995] | -           | neutral    |
| G7 pick data-first                              | XS   | high           | 33.04 us  | 32.92 us  | 0.996 [0.991..1.001] | 0.997 [0.991..1.002] | 1.001      | 0.991      | 0.999 [0.997..1.001] | -           | neutral    |
| G7 pick data-first                              | S    | high           | 10.56 us  | 10.58 us  | 1.002 [0.996..1.008] | 0.999 [0.993..1.006] | 1.008      | 0.996      | 1.006 [1.004..1.008] | -           | neutral    |
| G7 pick data-first                              | C    | high           | 15.98 us  | 15.85 us  | 0.992 [0.992..0.992] | 0.993 [0.992..0.993] | 0.992      | 0.992      | 1.000 [0.997..1.003] | -           | neutral    |
| G7 range data-first                             | XS   | mid (override) | 40.42 us  | 40.52 us  | 1.003 [0.998..1.007] | 1.001 [0.998..1.004] | 1.007      | 0.998      | 1.008 [1.004..1.012] | -           | neutral    |
| G7 range data-first                             | S    | mid (override) | 33.35 us  | 33.46 us  | 1.003 [0.997..1.009] | 1.002 [0.998..1.007] | 0.997      | 1.009      | 1.004 [1.001..1.006] | -           | neutral    |
| G7 range data-first                             | C    | mid (override) | 157.58 us | 162.19 us | 1.029 [1.017..1.042] | 1.011 [1.009..1.012] | 1.042      | 1.017      | 1.008 [0.989..1.027] | -           | neutral    |
| G7 sortBy data-first                            | S    | high           | 63.08 us  | 63.21 us  | 1.002 [1.001..1.003] | 0.999 [0.997..1.001] | 1.003      | 1.001      | 1.001 [0.998..1.004] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy        | S    | high           | 359.56 us | 233.67 us | 0.650 [0.644..0.655] | 0.648 [0.644..0.653] | 0.655      | 0.644      | 0.996 [0.986..1.007] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy        | C    | high           | 1.50 ms   | 837.08 us | 0.559 [0.553..0.565] | 0.558 [0.553..0.563] | 0.565      | 0.553      | 0.995 [0.974..1.016] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy        | M    | high           | 276.50 us | 182.73 us | 0.661 [0.660..0.662] | 0.657 [0.656..0.657] | 0.660      | 0.662      | 1.007 [1.002..1.012] | -           | **faster** |
