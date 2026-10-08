# Maglev ceiling (--max-opt=2)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run               | entry order         | runner | source | pollution | node    | flags       | scale | wall  |
| ----------------- | ------------------- | ------ | ------ | --------- | ------- | ----------- | ----- | ----- |
| main/x-maxopt2-r0 | main,branch,main-aa | vitest | dist   | P2        | v26.9.0 | --max-opt=2 | 1     | 120 s |
| main/x-maxopt2-r1 | branch,main-aa,main | vitest | dist   | P2        | v26.9.0 | --max-opt=2 | 1     | 120 s |

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
| 3    | 128   | 0.006          | 0.048               | 0.110 | 64            | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts | T2 gm | T2 verdicts | T3 gm | T3 verdicts           | bar violations |
| ------- | ----- | ----------- | ----- | ----------- | ----- | --------------------- | -------------- |
| branch  | -     | -           | -     | -           | 0.768 | faster 30, neutral 34 | 0              |
| main-aa | -     | -           | -     | -           | 0.998 | neutral 64            | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | -     | -     | 0.768 | -       |

## Tier 3: branch vs main (64 scenarios, weighted geomean 0.768, floor 0.048)

| scenario                                        | size | pop            | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ----------------------------------------------- | ---- | -------------- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                                   | S    | high           | 71.75 us  | 45.81 us  | 0.639 [0.634..0.643] | 0.635 [0.630..0.640] | 0.643      | 0.634      | 1.008 [1.006..1.010] | -           | **faster** |
| G1 filter+map                                   | C    | high           | 395.87 us | 218.02 us | 0.551 [0.549..0.553] | 0.549 [0.548..0.550] | 0.549      | 0.553      | 1.012 [1.000..1.024] | -           | **faster** |
| G1 filter+map                                   | M    | high           | 59.83 us  | 33.38 us  | 0.558 [0.552..0.564] | 0.553 [0.547..0.559] | 0.552      | 0.564      | 1.026 [1.021..1.030] | -           | **faster** |
| G1 map                                          | S    | high           | 53.33 us  | 20.02 us  | 0.375 [0.370..0.381] | 0.373 [0.368..0.378] | 0.381      | 0.370      | 1.001 [0.989..1.013] | -           | **faster** |
| G1 map                                          | C    | high           | 299.56 us | 95.33 us  | 0.318 [0.318..0.319] | 0.318 [0.318..0.318] | 0.319      | 0.318      | 1.012 [0.996..1.027] | -           | **faster** |
| G1 map                                          | M    | high           | 45.56 us  | 14.54 us  | 0.319 [0.318..0.321] | 0.316 [0.314..0.317] | 0.318      | 0.321      | 1.004 [0.988..1.020] | -           | **faster** |
| G1 map+filter+map                               | S    | high           | 113.08 us | 50.69 us  | 0.448 [0.446..0.450] | 0.446 [0.443..0.448] | 0.450      | 0.446      | 0.996 [0.990..1.003] | -           | **faster** |
| G1 map+filter+map                               | C    | high           | 654.12 us | 235.25 us | 0.360 [0.359..0.360] | 0.361 [0.360..0.362] | 0.359      | 0.360      | 1.002 [0.998..1.006] | -           | **faster** |
| G1 map+filter+map                               | M    | high           | 97.96 us  | 34.67 us  | 0.354 [0.349..0.359] | 0.351 [0.347..0.355] | 0.349      | 0.359      | 0.996 [0.995..0.998] | -           | **faster** |
| G3 pipe(x, add(1))                              | x64  | high           | 3.25 us   | 2.29 us   | 0.705 [0.705..0.705] | 0.701 [0.697..0.705] | 0.705      | 0.705      | 1.000 [1.000..1.000] | -           | **faster** |
| G3 scalar arrows depth-3                        | x64  | high           | 3.85 us   | 3.87 us   | 1.005 [1.000..1.011] | 1.008 [0.999..1.016] | 1.011      | 1.000      | 0.995 [0.989..1.000] | -           | neutral    |
| G5 data-first difference                        | XS   | mid (override) | 52.87 us  | 30.00 us  | 0.568 [0.557..0.578] | 0.568 [0.559..0.576] | 0.557      | 0.578      | 0.990 [0.978..1.002] | -           | **faster** |
| G5 data-first difference                        | S    | mid (override) | 60.79 us  | 32.10 us  | 0.529 [0.512..0.546] | 0.525 [0.509..0.541] | 0.512      | 0.546      | 0.972 [0.937..1.008] | -           | **faster** |
| G5 data-first difference                        | C    | mid (override) | 361.13 us | 193.92 us | 0.537 [0.528..0.546] | 0.532 [0.524..0.541] | 0.528      | 0.546      | 0.972 [0.940..1.004] | -           | **faster** |
| G5 data-first difference                        | M    | mid (override) | 50.00 us  | 24.60 us  | 0.493 [0.468..0.519] | 0.492 [0.469..0.514] | 0.468      | 0.519      | 0.946 [0.890..1.003] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | XS   | mid (override) | 71.46 us  | 48.50 us  | 0.679 [0.670..0.687] | 0.676 [0.669..0.683] | 0.670      | 0.687      | 0.991 [0.990..0.991] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | S    | mid (override) | 94.67 us  | 56.92 us  | 0.601 [0.594..0.608] | 0.599 [0.593..0.605] | 0.594      | 0.608      | 0.983 [0.973..0.993] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | C    | mid (override) | 546.56 us | 327.15 us | 0.599 [0.594..0.603] | 0.597 [0.592..0.602] | 0.603      | 0.594      | 0.992 [0.991..0.992] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | M    | mid (override) | 88.31 us  | 56.81 us  | 0.643 [0.641..0.646] | 0.640 [0.637..0.643] | 0.646      | 0.641      | 0.997 [0.992..1.003] | -           | **faster** |
| G5 data-first filter                            | XS   | high           | 10.25 us  | 10.31 us  | 1.006 [1.000..1.012] | 1.008 [1.003..1.013] | 1.000      | 1.012      | 0.996 [0.996..0.996] | -           | neutral    |
| G5 data-first filter                            | S    | high           | 7.56 us   | 7.56 us   | 1.000 [1.000..1.000] | 1.002 [0.998..1.005] | 1.000      | 1.000      | 0.997 [0.995..1.000] | -           | neutral    |
| G5 data-first filter                            | C    | high           | 37.92 us  | 37.73 us  | 0.995 [0.994..0.996] | 0.994 [0.992..0.996] | 0.996      | 0.994      | 0.997 [0.997..0.998] | -           | neutral    |
| G5 data-first filter                            | M    | high           | 6.21 us   | 6.21 us   | 1.000 [1.000..1.000] | 0.999 [0.998..0.999] | 1.000      | 1.000      | 1.000 [1.000..1.000] | -           | neutral    |
| G5 data-first map                               | XS   | high           | 9.29 us   | 9.35 us   | 1.007 [1.000..1.014] | 1.004 [1.001..1.007] | 1.000      | 1.014      | 1.009 [0.996..1.022] | -           | neutral    |
| G5 data-first map                               | S    | high           | 7.50 us   | 7.52 us   | 1.003 [1.000..1.006] | 1.005 [1.003..1.007] | 1.006      | 1.000      | 0.997 [0.995..1.000] | -           | neutral    |
| G5 data-first map                               | C    | high           | 35.96 us  | 35.79 us  | 0.995 [0.992..0.999] | 0.988 [0.987..0.989] | 0.999      | 0.992      | 0.998 [0.995..1.001] | -           | neutral    |
| G5 data-first map                               | M    | high           | 5.46 us   | 5.46 us   | 1.000 [1.000..1.000] | 1.000 [0.998..1.003] | 1.000      | 1.000      | 1.008 [1.008..1.008] | -           | neutral    |
| G5 data-first unique                            | XS   | high           | 50.25 us  | 23.46 us  | 0.467 [0.456..0.478] | 0.466 [0.456..0.476] | 0.456      | 0.478      | 0.988 [0.973..1.003] | -           | **faster** |
| G5 data-first unique                            | S    | high           | 73.00 us  | 37.94 us  | 0.520 [0.512..0.528] | 0.519 [0.515..0.523] | 0.512      | 0.528      | 0.991 [0.967..1.016] | -           | **faster** |
| G5 data-first unique                            | C    | high           | 419.92 us | 234.94 us | 0.560 [0.556..0.563] | 0.558 [0.555..0.561] | 0.556      | 0.563      | 0.996 [0.990..1.001] | -           | **faster** |
| G5 data-first uniqueBy                          | XS   | high           | 56.23 us  | 36.50 us  | 0.649 [0.644..0.654] | 0.644 [0.639..0.648] | 0.654      | 0.644      | 0.992 [0.982..1.003] | -           | **faster** |
| G5 data-first uniqueBy                          | S    | high           | 80.81 us  | 53.73 us  | 0.665 [0.660..0.670] | 0.666 [0.665..0.666] | 0.660      | 0.670      | 0.983 [0.967..0.999] | -           | **faster** |
| G5 data-first uniqueBy                          | C    | high           | 450.83 us | 303.31 us | 0.673 [0.668..0.678] | 0.671 [0.668..0.675] | 0.668      | 0.678      | 0.995 [0.979..1.010] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | XS   | high           | 57.58 us  | 41.85 us  | 0.727 [0.720..0.734] | 0.725 [0.717..0.734] | 0.734      | 0.720      | 0.990 [0.984..0.995] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | S    | high           | 83.19 us  | 56.77 us  | 0.683 [0.679..0.687] | 0.683 [0.681..0.684] | 0.679      | 0.687      | 0.990 [0.976..1.004] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | C    | high           | 463.73 us | 319.73 us | 0.689 [0.688..0.691] | 0.688 [0.687..0.688] | 0.691      | 0.688      | 0.998 [0.992..1.005] | -           | **faster** |
| G6 map(fn)(data)                                | S    | high           | 9.17 us   | 9.19 us   | 1.002 [1.000..1.005] | 1.002 [1.002..1.002] | 1.000      | 1.005      | 1.000 [0.995..1.005] | -           | neutral    |
| G6 map(fn)(data)                                | C    | high           | 37.52 us  | 37.46 us  | 0.998 [0.994..1.002] | 0.998 [0.995..1.001] | 1.002      | 0.994      | 1.003 [0.999..1.007] | -           | neutral    |
| G6 map(fn)(data)                                | M    | high           | 5.63 us   | 5.65 us   | 1.004 [1.000..1.007] | 1.003 [1.001..1.006] | 1.007      | 1.000      | 1.000 [1.000..1.000] | -           | neutral    |
| G7 entries data-first                           | XS   | high           | 8.08 us   | 8.04 us   | 0.995 [0.990..1.000] | 0.998 [0.993..1.002] | 1.000      | 0.990      | 1.003 [1.000..1.005] | -           | neutral    |
| G7 entries data-first                           | S    | high           | 5.25 us   | 5.21 us   | 0.992 [0.992..0.992] | 0.995 [0.990..0.999] | 0.992      | 0.992      | 1.000 [1.000..1.000] | -           | neutral    |
| G7 entries data-first                           | C    | high           | 18.44 us  | 18.44 us  | 1.000 [1.000..1.000] | 1.000 [0.999..1.002] | 1.000      | 1.000      | 1.000 [1.000..1.000] | -           | neutral    |
| G7 groupBy data-first                           | XS   | high           | 32.62 us  | 32.33 us  | 0.991 [0.965..1.018] | 0.993 [0.970..1.017] | 1.018      | 0.965      | 0.980 [0.968..0.991] | -           | neutral    |
| G7 groupBy data-first                           | S    | high           | 17.54 us  | 17.50 us  | 0.998 [0.991..1.005] | 0.996 [0.990..1.003] | 1.005      | 0.991      | 1.002 [1.002..1.002] | -           | neutral    |
| G7 groupBy data-first                           | C    | high           | 63.46 us  | 63.44 us  | 1.000 [0.999..1.000] | 0.998 [0.997..0.999] | 0.999      | 1.000      | 1.000 [0.997..1.003] | -           | neutral    |
| G7 isDeepEqual data-first                       | XS   | high           | 26.92 us  | 26.77 us  | 0.995 [0.988..1.002] | 0.991 [0.981..1.000] | 0.988      | 1.002      | 1.001 [0.995..1.006] | -           | neutral    |
| G7 isDeepEqual data-first                       | S    | high           | 30.83 us  | 30.75 us  | 0.997 [0.989..1.005] | 1.000 [0.992..1.007] | 1.005      | 0.989      | 1.016 [1.012..1.019] | -           | neutral    |
| G7 isDeepEqual data-first                       | C    | high           | 423.88 us | 444.10 us | 1.048 [1.014..1.083] | 1.027 [0.994..1.059] | 1.014      | 1.083      | 1.009 [0.947..1.072] | -           | neutral    |
| G7 mapValues data-first                         | XS   | high           | 21.38 us  | 21.38 us  | 1.000 [0.996..1.004] | 0.999 [0.996..1.002] | 1.004      | 0.996      | 1.000 [0.994..1.006] | -           | neutral    |
| G7 mapValues data-first                         | S    | high           | 24.02 us  | 23.92 us  | 0.996 [0.995..0.997] | 0.996 [0.995..0.998] | 0.997      | 0.995      | 0.998 [0.998..0.998] | -           | neutral    |
| G7 mapValues data-first                         | C    | high           | 256.08 us | 257.33 us | 1.005 [0.996..1.014] | 0.992 [0.991..0.993] | 0.996      | 1.014      | 1.016 [0.938..1.094] | -           | neutral    |
| G7 omit data-first                              | XS   | high           | 27.21 us  | 27.38 us  | 1.006 [1.003..1.009] | 1.006 [1.004..1.009] | 1.009      | 1.003      | 1.003 [1.003..1.003] | -           | neutral    |
| G7 omit data-first                              | S    | high           | 31.17 us  | 31.38 us  | 1.007 [1.000..1.013] | 1.004 [0.995..1.012] | 1.013      | 1.000      | 0.997 [0.981..1.013] | -           | neutral    |
| G7 omit data-first                              | C    | high           | 207.40 us | 208.50 us | 1.006 [0.980..1.032] | 1.005 [0.983..1.028] | 1.032      | 0.980      | 0.993 [0.981..1.005] | -           | neutral    |
| G7 pick data-first                              | XS   | high           | 16.75 us  | 16.65 us  | 0.994 [0.988..1.000] | 0.995 [0.986..1.003] | 0.988      | 1.000      | 1.006 [1.002..1.010] | -           | neutral    |
| G7 pick data-first                              | S    | high           | 6.65 us   | 6.65 us   | 1.000 [0.994..1.006] | 1.002 [0.993..1.011] | 1.006      | 0.994      | 0.991 [0.975..1.006] | -           | neutral    |
| G7 pick data-first                              | C    | high           | 8.50 us   | 8.52 us   | 1.002 [0.990..1.015] | 1.002 [0.991..1.014] | 0.990      | 1.015      | 1.000 [0.985..1.015] | -           | neutral    |
| G7 range data-first                             | XS   | mid (override) | 22.67 us  | 22.75 us  | 1.004 [0.998..1.009] | 1.004 [1.000..1.009] | 1.009      | 0.998      | 0.991 [0.987..0.995] | -           | neutral    |
| G7 range data-first                             | S    | mid (override) | 25.44 us  | 25.38 us  | 0.998 [0.995..1.000] | 0.999 [0.998..1.001] | 1.000      | 0.995      | 0.998 [0.997..0.998] | -           | neutral    |
| G7 range data-first                             | C    | mid (override) | 134.65 us | 132.90 us | 0.987 [0.965..1.009] | 0.990 [0.977..1.004] | 1.009      | 0.965      | 0.976 [0.960..0.991] | -           | neutral    |
| G7 sortBy data-first                            | S    | high           | 31.10 us  | 31.10 us  | 1.000 [0.997..1.003] | 0.998 [0.997..0.999] | 1.003      | 0.997      | 0.996 [0.996..0.996] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy        | S    | high           | 131.23 us | 97.96 us  | 0.747 [0.733..0.760] | 0.747 [0.735..0.758] | 0.760      | 0.733      | 0.983 [0.970..0.996] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy        | C    | high           | 504.21 us | 345.79 us | 0.686 [0.686..0.686] | 0.683 [0.682..0.684] | 0.686      | 0.686      | 1.008 [1.004..1.012] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy        | M    | high           | 106.37 us | 83.21 us  | 0.782 [0.778..0.787] | 0.782 [0.778..0.786] | 0.778      | 0.787      | 0.992 [0.991..0.994] | -           | **faster** |
