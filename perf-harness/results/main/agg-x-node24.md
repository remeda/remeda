# Node 24

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run              | entry order         | runner | source | pollution | node     | flags | scale | wall  |
| ---------------- | ------------------- | ------ | ------ | --------- | -------- | ----- | ----- | ----- |
| main/x-node24-r0 | main,branch,main-aa | vitest | dist   | P2        | v24.21.0 | -     | 1     | 120 s |
| main/x-node24-r1 | branch,main-aa,main | vitest | dist   | P2        | v24.21.0 | -     | 1     | 120 s |

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
| 1    | 114   | 0.008          | 0.046               | 0.407 | 57            | 1 (1.8%)    | 1               |
| 2    | 14    | 0.001          | 0.012               | 0.020 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

A/A false calls: G7 | mapValues data-first | C | data-first-guard (regression).

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts                         | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | ----------------------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.870 | faster 26, regression 2, neutral 29 | 0.738 | faster 4, neutral 3 | -     | -           | 2              |
| main-aa | 1.004 | neutral 56, regression 1            | 0.998 | neutral 7           | -     | -           | 1              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.89%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 2              | 0.870 | 0.738 | -     | -       |

## Tier 1: branch vs main (57 scenarios, weighted geomean 0.870, floor 0.046)

Bar violations: G3 scalar arrows depth-3 x64 (1.347); G7 mapValues data-first C (1.171).

| scenario                                        | size | pop            | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict        |
| ----------------------------------------------- | ---- | -------------- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | -------------- |
| G1 filter+map                                   | S    | high           | 51.40 us  | 41.31 us  | 0.804 [0.800..0.808] | 0.804 [0.801..0.808] | 0.800      | 0.808      | 0.996 [0.990..1.003] | -           | **faster**     |
| G1 filter+map                                   | C    | high           | 277.02 us | 194.94 us | 0.704 [0.699..0.709] | 0.700 [0.695..0.705] | 0.699      | 0.709      | 0.999 [0.998..1.001] | -           | **faster**     |
| G1 map                                          | S    | high           | 37.19 us  | 18.98 us  | 0.510 [0.506..0.515] | 0.510 [0.510..0.511] | 0.515      | 0.506      | 0.980 [0.974..0.986] | -           | **faster**     |
| G1 map                                          | C    | high           | 207.56 us | 91.48 us  | 0.441 [0.437..0.445] | 0.440 [0.438..0.442] | 0.445      | 0.437      | 0.998 [0.988..1.007] | -           | **faster**     |
| G1 map+filter+map                               | S    | high           | 78.96 us  | 46.35 us  | 0.587 [0.586..0.588] | 0.585 [0.583..0.587] | 0.586      | 0.588      | 0.996 [0.993..0.998] | -           | **faster**     |
| G1 map+filter+map                               | C    | high           | 452.85 us | 213.85 us | 0.472 [0.470..0.474] | 0.473 [0.472..0.474] | 0.474      | 0.470      | 1.000 [0.992..1.008] | -           | **faster**     |
| G3 pipe(x, add(1))                              | x64  | high           | 1.98 us   | 1.38 us   | 0.696 [0.680..0.711] | 0.708 [0.694..0.722] | 0.711      | 0.680      | 1.043 [1.020..1.067] | -           | **faster**     |
| G3 scalar arrows depth-3                        | x64  | high           | 2.04 us   | 2.75 us   | 1.347 [1.347..1.347] | 1.327 [1.322..1.332] | 1.347      | 1.347      | 1.000 [1.000..1.000] | -           | **regression** |
| G5 data-first difference                        | XS   | mid (override) | 36.79 us  | 25.13 us  | 0.684 [0.646..0.721] | 0.682 [0.651..0.712] | 0.721      | 0.646      | 0.980 [0.955..1.005] | -           | **faster**     |
| G5 data-first difference                        | S    | mid (override) | 40.31 us  | 29.10 us  | 0.722 [0.714..0.730] | 0.717 [0.717..0.717] | 0.730      | 0.714      | 0.989 [0.980..0.998] | -           | **faster**     |
| G5 data-first difference                        | C    | mid (override) | 247.50 us | 175.73 us | 0.710 [0.690..0.730] | 0.704 [0.686..0.721] | 0.730      | 0.690      | 1.000 [0.982..1.017] | -           | **faster**     |
| G5 data-first difference                        | M    | mid (override) | 32.52 us  | 22.52 us  | 0.693 [0.689..0.696] | 0.698 [0.695..0.702] | 0.689      | 0.696      | 1.001 [0.995..1.006] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | XS   | mid (override) | 59.15 us  | 46.81 us  | 0.791 [0.784..0.799] | 0.789 [0.782..0.796] | 0.799      | 0.784      | 1.005 [1.001..1.009] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | S    | mid (override) | 73.00 us  | 55.27 us  | 0.757 [0.753..0.761] | 0.756 [0.751..0.761] | 0.753      | 0.761      | 1.005 [0.983..1.027] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | C    | mid (override) | 439.88 us | 308.87 us | 0.702 [0.698..0.707] | 0.702 [0.696..0.709] | 0.698      | 0.707      | 0.998 [0.994..1.002] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | M    | mid (override) | 68.94 us  | 50.69 us  | 0.735 [0.731..0.740] | 0.734 [0.730..0.737] | 0.740      | 0.731      | 1.011 [1.006..1.016] | -           | **faster**     |
| G5 data-first filter                            | XS   | high           | 10.17 us  | 10.21 us  | 1.004 [1.004..1.004] | 1.004 [1.001..1.006] | 1.004      | 1.004      | 0.996 [0.992..1.000] | -           | neutral        |
| G5 data-first filter                            | S    | high           | 7.38 us   | 7.35 us   | 0.997 [0.994..1.000] | 0.997 [0.994..1.001] | 1.000      | 0.994      | 0.997 [0.994..1.000] | -           | neutral        |
| G5 data-first filter                            | C    | high           | 37.52 us  | 37.90 us  | 1.010 [1.008..1.012] | 1.011 [1.010..1.012] | 1.012      | 1.008      | 1.001 [1.000..1.001] | -           | neutral        |
| G5 data-first map                               | XS   | high           | 9.21 us   | 9.08 us   | 0.987 [0.969..1.005] | 0.987 [0.973..1.001] | 1.005      | 0.969      | 1.007 [1.000..1.014] | -           | neutral        |
| G5 data-first map                               | S    | high           | 7.48 us   | 7.46 us   | 0.997 [0.989..1.005] | 0.998 [0.991..1.004] | 1.005      | 0.989      | 0.997 [0.994..1.000] | -           | neutral        |
| G5 data-first map                               | C    | high           | 35.77 us  | 35.75 us  | 0.999 [0.992..1.007] | 1.001 [1.000..1.002] | 1.007      | 0.992      | 1.008 [1.006..1.010] | -           | neutral        |
| G5 data-first unique                            | XS   | high           | 36.40 us  | 21.52 us  | 0.591 [0.587..0.595] | 0.591 [0.585..0.596] | 0.587      | 0.595      | 1.002 [0.991..1.014] | -           | **faster**     |
| G5 data-first unique                            | S    | high           | 61.83 us  | 42.48 us  | 0.688 [0.668..0.707] | 0.684 [0.661..0.708] | 0.707      | 0.668      | 1.016 [0.986..1.046] | -           | **faster**     |
| G5 data-first unique                            | C    | high           | 374.27 us | 264.02 us | 0.706 [0.680..0.732] | 0.708 [0.683..0.733] | 0.732      | 0.680      | 0.993 [0.992..0.993] | -           | **faster**     |
| G5 data-first uniqueBy                          | XS   | high           | 41.42 us  | 33.15 us  | 0.800 [0.799..0.801] | 0.798 [0.798..0.798] | 0.799      | 0.801      | 1.012 [1.011..1.012] | -           | **faster**     |
| G5 data-first uniqueBy                          | S    | high           | 66.92 us  | 55.29 us  | 0.826 [0.823..0.830] | 0.826 [0.823..0.828] | 0.830      | 0.823      | 0.992 [0.988..0.997] | -           | **faster**     |
| G5 data-first uniqueBy                          | C    | high           | 397.58 us | 332.85 us | 0.837 [0.814..0.860] | 0.835 [0.815..0.856] | 0.860      | 0.814      | 1.003 [0.989..1.016] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | XS   | high           | 42.90 us  | 38.67 us  | 0.901 [0.896..0.907] | 0.906 [0.903..0.909] | 0.896      | 0.907      | 0.998 [0.996..1.000] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | S    | high           | 69.56 us  | 58.71 us  | 0.844 [0.841..0.847] | 0.845 [0.844..0.846] | 0.841      | 0.847      | 1.000 [0.992..1.008] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | C    | high           | 411.69 us | 348.94 us | 0.848 [0.840..0.856] | 0.848 [0.838..0.857] | 0.856      | 0.840      | 0.990 [0.972..1.009] | -           | **faster**     |
| G6 map(fn)(data)                                | S    | high           | 8.98 us   | 8.98 us   | 1.000 [0.995..1.005] | 0.997 [0.990..1.005] | 0.995      | 1.005      | 1.005 [1.000..1.009] | -           | neutral        |
| G6 map(fn)(data)                                | C    | high           | 36.52 us  | 36.42 us  | 0.997 [0.991..1.003] | 0.997 [0.985..1.010] | 0.991      | 1.003      | 1.010 [0.997..1.024] | -           | neutral        |
| G7 entries data-first                           | XS   | high           | 7.81 us   | 7.77 us   | 0.995 [0.989..1.000] | 0.994 [0.992..0.995] | 0.989      | 1.000      | 1.000 [0.995..1.005] | -           | neutral        |
| G7 entries data-first                           | S    | high           | 5.04 us   | 5.02 us   | 0.996 [0.992..1.000] | 0.996 [0.994..0.998] | 0.992      | 1.000      | 1.004 [1.000..1.008] | -           | neutral        |
| G7 entries data-first                           | C    | high           | 18.77 us  | 18.90 us  | 1.007 [1.002..1.011] | 1.007 [1.004..1.010] | 1.002      | 1.011      | 0.991 [0.980..1.002] | -           | neutral        |
| G7 groupBy data-first                           | XS   | high           | 29.42 us  | 29.38 us  | 0.999 [0.967..1.032] | 1.000 [0.973..1.027] | 1.032      | 0.967      | 0.990 [0.971..1.009] | -           | neutral        |
| G7 groupBy data-first                           | S    | high           | 16.94 us  | 16.87 us  | 0.996 [0.995..0.997] | 0.997 [0.997..0.998] | 0.997      | 0.995      | 1.000 [1.000..1.000] | -           | neutral        |
| G7 groupBy data-first                           | C    | high           | 63.15 us  | 61.65 us  | 0.976 [0.961..0.991] | 0.984 [0.971..0.998] | 0.961      | 0.991      | 0.972 [0.967..0.978] | -           | neutral        |
| G7 isDeepEqual data-first                       | XS   | high           | 20.60 us  | 20.65 us  | 1.002 [0.998..1.006] | 1.002 [0.995..1.008] | 0.998      | 1.006      | 1.001 [0.998..1.004] | -           | neutral        |
| G7 isDeepEqual data-first                       | S    | high           | 22.08 us  | 22.23 us  | 1.007 [0.996..1.017] | 1.003 [0.999..1.007] | 1.017      | 0.996      | 0.995 [0.964..1.025] | -           | neutral        |
| G7 isDeepEqual data-first                       | C    | high           | 350.21 us | 356.44 us | 1.018 [0.971..1.065] | 1.010 [0.982..1.037] | 0.971      | 1.065      | 1.032 [1.005..1.058] | -           | neutral        |
| G7 mapValues data-first                         | XS   | high           | 16.71 us  | 16.92 us  | 1.013 [0.993..1.033] | 1.014 [0.996..1.032] | 1.033      | 0.993      | 0.994 [0.970..1.018] | -           | neutral        |
| G7 mapValues data-first                         | S    | high           | 15.63 us  | 15.52 us  | 0.993 [0.987..1.000] | 0.993 [0.985..1.001] | 0.987      | 1.000      | 0.999 [0.989..1.008] | -           | neutral        |
| G7 mapValues data-first                         | C    | high           | 140.21 us | 164.33 us | 1.171 [1.120..1.223] | 1.132 [1.125..1.139] | 1.223      | 1.120      | 1.337 [1.267..1.407] | -           | **regression** |
| G7 omit data-first                              | XS   | high           | 26.31 us  | 26.31 us  | 1.000 [0.994..1.006] | 1.004 [0.996..1.012] | 1.006      | 0.994      | 0.994 [0.994..0.995] | -           | neutral        |
| G7 omit data-first                              | S    | high           | 30.42 us  | 30.23 us  | 0.994 [0.990..0.997] | 0.995 [0.992..0.999] | 0.990      | 0.997      | 0.996 [0.992..1.000] | -           | neutral        |
| G7 omit data-first                              | C    | high           | 205.25 us | 206.04 us | 1.004 [0.996..1.012] | 0.995 [0.963..1.027] | 1.012      | 0.996      | 1.008 [0.999..1.017] | -           | neutral        |
| G7 pick data-first                              | XS   | high           | 14.58 us  | 14.48 us  | 0.993 [0.986..1.000] | 0.993 [0.988..0.999] | 1.000      | 0.986      | 0.999 [0.994..1.003] | -           | neutral        |
| G7 pick data-first                              | S    | high           | 5.62 us   | 5.56 us   | 0.989 [0.971..1.008] | 0.991 [0.975..1.008] | 1.008      | 0.971      | 0.985 [0.971..1.000] | -           | neutral        |
| G7 pick data-first                              | C    | high           | 7.23 us   | 7.17 us   | 0.992 [0.977..1.006] | 0.995 [0.984..1.006] | 0.977      | 1.006      | 0.994 [0.989..1.000] | -           | neutral        |
| G7 range data-first                             | XS   | mid (override) | 23.96 us  | 24.06 us  | 1.004 [1.000..1.009] | 1.003 [0.999..1.007] | 1.009      | 1.000      | 1.013 [1.011..1.016] | -           | neutral        |
| G7 range data-first                             | S    | mid (override) | 27.98 us  | 27.85 us  | 0.996 [0.991..1.000] | 0.997 [0.994..0.999] | 0.991      | 1.000      | 0.996 [0.988..1.003] | -           | neutral        |
| G7 range data-first                             | C    | mid (override) | 144.42 us | 144.23 us | 0.999 [0.999..0.999] | 0.999 [0.998..0.999] | 0.999      | 0.999      | 0.999 [0.999..0.999] | -           | neutral        |
| G7 sortBy data-first                            | S    | high           | 30.25 us  | 30.29 us  | 1.001 [0.999..1.004] | 1.002 [1.000..1.004] | 0.999      | 1.004      | 1.001 [0.999..1.004] | -           | neutral        |
| G10 filter,map / sortBy / take / groupBy        | S    | high           | 102.87 us | 88.08 us  | 0.856 [0.834..0.879] | 0.856 [0.836..0.875] | 0.879      | 0.834      | 0.967 [0.951..0.983] | -           | **faster**     |
| G10 filter,map / sortBy / take / groupBy        | C    | high           | 393.00 us | 326.29 us | 0.830 [0.816..0.845] | 0.825 [0.817..0.833] | 0.816      | 0.845      | 0.981 [0.977..0.985] | -           | **faster**     |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.738, floor 0.012)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 42.10 us | 28.98 us | 0.688 [0.687..0.689] | 0.685 [0.684..0.686] | 0.687      | 0.689      | 1.004 [1.000..1.008] | -           | **faster** |
| G1 map                                   | M    | high | 31.65 us | 13.50 us | 0.427 [0.426..0.427] | 0.420 [0.420..0.421] | 0.426      | 0.427      | 1.001 [1.000..1.003] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 69.54 us | 31.48 us | 0.453 [0.452..0.453] | 0.450 [0.449..0.451] | 0.453      | 0.452      | 0.996 [0.995..0.998] | -           | **faster** |
| G5 data-first filter                     | M    | high | 5.87 us  | 5.90 us  | 1.004 [1.000..1.007] | 1.002 [1.002..1.002] | 1.000      | 1.007      | 0.997 [0.993..1.000] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.52 us  | 5.50 us  | 0.996 [0.985..1.007] | 0.996 [0.980..1.013] | 1.007      | 0.985      | 1.000 [1.000..1.000] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.56 us  | 5.54 us  | 0.996 [0.993..1.000] | 0.996 [0.983..1.009] | 1.000      | 0.993      | 1.000 [1.000..1.000] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 97.62 us | 87.69 us | 0.898 [0.880..0.916] | 0.887 [0.877..0.898] | 0.916      | 0.880      | 0.989 [0.980..0.997] | -           | **faster** |
