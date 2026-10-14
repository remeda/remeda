# Node 22

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run              | entry order         | runner | source | pollution | node     | flags | scale | wall  |
| ---------------- | ------------------- | ------ | ------ | --------- | -------- | ----- | ----- | ----- |
| main/x-node22-r0 | main,branch,main-aa | vitest | dist   | P2        | v22.23.3 | -     | 1     | 121 s |
| main/x-node22-r1 | branch,main-aa,main | vitest | dist   | P2        | v22.23.3 | -     | 1     | 121 s |

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
| 1    | 114   | 0.007          | 0.039               | 0.126 | 57            | 0 (0.0%)    | 0               |
| 2    | 14    | 0.007          | 0.010               | 0.012 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts           | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | --------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.874 | faster 26, neutral 31 | 0.745 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa | 1.002 | neutral 57            | 0.999 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.874 | 0.745 | -     | -       |

## Tier 1: branch vs main (57 scenarios, weighted geomean 0.874, floor 0.039)

| scenario                                        | size | pop            | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ----------------------------------------------- | ---- | -------------- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                                   | S    | high           | 51.73 us  | 42.29 us  | 0.818 [0.816..0.820] | 0.809 [0.807..0.811] | 0.816      | 0.820      | 1.004 [1.004..1.005] | -           | **faster** |
| G1 filter+map                                   | C    | high           | 278.19 us | 199.08 us | 0.716 [0.714..0.717] | 0.707 [0.703..0.710] | 0.714      | 0.717      | 1.006 [1.005..1.008] | -           | **faster** |
| G1 map                                          | S    | high           | 37.12 us  | 19.58 us  | 0.527 [0.524..0.531] | 0.523 [0.520..0.526] | 0.531      | 0.524      | 1.011 [1.001..1.021] | -           | **faster** |
| G1 map                                          | C    | high           | 212.37 us | 93.33 us  | 0.440 [0.435..0.444] | 0.440 [0.438..0.441] | 0.444      | 0.435      | 0.987 [0.967..1.008] | -           | **faster** |
| G1 map+filter+map                               | S    | high           | 80.15 us  | 47.35 us  | 0.591 [0.591..0.591] | 0.585 [0.585..0.585] | 0.591      | 0.591      | 1.002 [0.999..1.005] | -           | **faster** |
| G1 map+filter+map                               | C    | high           | 470.27 us | 217.65 us | 0.463 [0.462..0.463] | 0.459 [0.459..0.460] | 0.463      | 0.462      | 0.985 [0.979..0.992] | -           | **faster** |
| G3 pipe(x, add(1))                              | x64  | high           | 1.96 us   | 1.60 us   | 0.819 [0.788..0.851] | 0.801 [0.770..0.832] | 0.851      | 0.788      | 1.000 [0.979..1.021] | -           | **faster** |
| G3 scalar arrows depth-3                        | x64  | high           | 2.35 us   | 2.35 us   | 1.000 [0.982..1.018] | 0.988 [0.973..1.003] | 0.982      | 1.018      | 1.000 [0.983..1.018] | -           | neutral    |
| G5 data-first difference                        | XS   | mid (override) | 36.60 us  | 25.02 us  | 0.684 [0.673..0.694] | 0.678 [0.668..0.688] | 0.673      | 0.694      | 0.997 [0.993..1.000] | -           | **faster** |
| G5 data-first difference                        | S    | mid (override) | 40.23 us  | 29.17 us  | 0.725 [0.717..0.733] | 0.724 [0.713..0.735] | 0.733      | 0.717      | 0.987 [0.985..0.988] | -           | **faster** |
| G5 data-first difference                        | C    | mid (override) | 242.06 us | 176.69 us | 0.730 [0.719..0.741] | 0.723 [0.710..0.735] | 0.719      | 0.741      | 1.005 [1.002..1.009] | -           | **faster** |
| G5 data-first difference                        | M    | mid (override) | 33.19 us  | 23.33 us  | 0.703 [0.687..0.720] | 0.696 [0.684..0.707] | 0.720      | 0.687      | 0.983 [0.975..0.991] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | XS   | mid (override) | 60.88 us  | 46.83 us  | 0.769 [0.761..0.778] | 0.764 [0.756..0.772] | 0.778      | 0.761      | 0.981 [0.975..0.987] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | S    | mid (override) | 73.71 us  | 57.37 us  | 0.778 [0.777..0.780] | 0.775 [0.775..0.775] | 0.780      | 0.777      | 0.999 [0.994..1.005] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | C    | mid (override) | 435.44 us | 318.81 us | 0.732 [0.730..0.734] | 0.728 [0.725..0.731] | 0.734      | 0.730      | 1.021 [1.008..1.034] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | M    | mid (override) | 68.67 us  | 51.94 us  | 0.756 [0.750..0.763] | 0.752 [0.744..0.760] | 0.750      | 0.763      | 1.018 [1.013..1.024] | -           | **faster** |
| G5 data-first filter                            | XS   | high           | 10.71 us  | 10.73 us  | 1.002 [0.996..1.008] | 1.004 [1.001..1.006] | 1.008      | 0.996      | 0.992 [0.988..0.996] | -           | neutral    |
| G5 data-first filter                            | S    | high           | 7.29 us   | 7.27 us   | 0.997 [0.989..1.006] | 0.997 [0.991..1.002] | 0.989      | 1.006      | 1.008 [1.006..1.011] | -           | neutral    |
| G5 data-first filter                            | C    | high           | 36.60 us  | 37.37 us  | 1.022 [0.992..1.051] | 1.019 [0.985..1.053] | 0.992      | 1.051      | 1.023 [1.002..1.044] | -           | neutral    |
| G5 data-first map                               | XS   | high           | 9.44 us   | 9.46 us   | 1.002 [1.000..1.004] | 1.002 [0.999..1.005] | 1.004      | 1.000      | 1.004 [1.000..1.009] | -           | neutral    |
| G5 data-first map                               | S    | high           | 7.44 us   | 7.44 us   | 1.000 [1.000..1.000] | 0.999 [0.995..1.002] | 1.000      | 1.000      | 1.003 [1.000..1.006] | -           | neutral    |
| G5 data-first map                               | C    | high           | 36.08 us  | 36.29 us  | 1.006 [0.999..1.013] | 1.005 [0.997..1.013] | 0.999      | 1.013      | 0.982 [0.964..1.000] | -           | neutral    |
| G5 data-first unique                            | XS   | high           | 36.67 us  | 21.73 us  | 0.593 [0.586..0.599] | 0.586 [0.578..0.593] | 0.599      | 0.586      | 0.990 [0.979..1.001] | -           | **faster** |
| G5 data-first unique                            | S    | high           | 60.85 us  | 41.75 us  | 0.686 [0.681..0.691] | 0.682 [0.679..0.685] | 0.681      | 0.691      | 1.010 [1.001..1.019] | -           | **faster** |
| G5 data-first unique                            | C    | high           | 365.02 us | 268.02 us | 0.734 [0.733..0.735] | 0.730 [0.730..0.730] | 0.733      | 0.735      | 1.015 [0.998..1.032] | -           | **faster** |
| G5 data-first uniqueBy                          | XS   | high           | 41.52 us  | 33.71 us  | 0.812 [0.809..0.815] | 0.801 [0.799..0.803] | 0.815      | 0.809      | 0.989 [0.984..0.993] | -           | **faster** |
| G5 data-first uniqueBy                          | S    | high           | 66.48 us  | 56.23 us  | 0.846 [0.843..0.848] | 0.840 [0.837..0.843] | 0.848      | 0.843      | 1.002 [0.994..1.011] | -           | **faster** |
| G5 data-first uniqueBy                          | C    | high           | 392.94 us | 334.46 us | 0.851 [0.847..0.855] | 0.845 [0.842..0.849] | 0.847      | 0.855      | 1.007 [1.003..1.011] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | XS   | high           | 42.50 us  | 38.85 us  | 0.914 [0.911..0.917] | 0.911 [0.908..0.915] | 0.917      | 0.911      | 0.994 [0.991..0.996] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | S    | high           | 68.44 us  | 58.90 us  | 0.861 [0.853..0.868] | 0.858 [0.852..0.865] | 0.868      | 0.853      | 1.007 [0.999..1.015] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | C    | high           | 407.25 us | 348.42 us | 0.856 [0.853..0.858] | 0.855 [0.853..0.857] | 0.853      | 0.858      | 0.996 [0.988..1.005] | -           | **faster** |
| G6 map(fn)(data)                                | S    | high           | 8.94 us   | 8.94 us   | 1.000 [0.995..1.005] | 1.002 [0.996..1.007] | 0.995      | 1.005      | 1.002 [1.000..1.005] | -           | neutral    |
| G6 map(fn)(data)                                | C    | high           | 37.73 us  | 37.94 us  | 1.006 [1.000..1.011] | 1.004 [1.002..1.005] | 1.000      | 1.011      | 1.011 [1.009..1.013] | -           | neutral    |
| G7 entries data-first                           | XS   | high           | 7.58 us   | 7.65 us   | 1.008 [1.006..1.011] | 1.009 [1.003..1.014] | 1.011      | 1.006      | 1.011 [1.011..1.011] | -           | neutral    |
| G7 entries data-first                           | S    | high           | 4.67 us   | 4.69 us   | 1.004 [1.000..1.009] | 1.001 [0.994..1.008] | 1.009      | 1.000      | 1.004 [1.000..1.009] | -           | neutral    |
| G7 entries data-first                           | C    | high           | 18.02 us  | 18.00 us  | 0.999 [0.998..1.000] | 0.999 [0.998..0.999] | 0.998      | 1.000      | 0.999 [0.998..1.000] | -           | neutral    |
| G7 groupBy data-first                           | XS   | high           | 24.50 us  | 24.48 us  | 1.000 [0.962..1.038] | 1.004 [0.976..1.031] | 1.038      | 0.962      | 0.973 [0.949..0.997] | -           | neutral    |
| G7 groupBy data-first                           | S    | high           | 15.79 us  | 15.73 us  | 0.996 [0.989..1.003] | 0.989 [0.979..1.000] | 1.003      | 0.989      | 0.995 [0.992..0.997] | -           | neutral    |
| G7 groupBy data-first                           | C    | high           | 64.98 us  | 65.33 us  | 1.005 [1.004..1.007] | 1.003 [1.003..1.003] | 1.007      | 1.004      | 1.004 [1.001..1.008] | -           | neutral    |
| G7 isDeepEqual data-first                       | XS   | high           | 19.81 us  | 20.15 us  | 1.017 [1.010..1.024] | 1.017 [1.010..1.025] | 1.010      | 1.024      | 1.002 [1.002..1.002] | -           | neutral    |
| G7 isDeepEqual data-first                       | S    | high           | 22.56 us  | 22.90 us  | 1.015 [1.002..1.028] | 1.014 [1.003..1.024] | 1.002      | 1.028      | 0.994 [0.993..0.994] | -           | neutral    |
| G7 isDeepEqual data-first                       | C    | high           | 366.98 us | 384.10 us | 1.053 [0.960..1.145] | 1.038 [0.970..1.107] | 1.145      | 0.960      | 1.021 [0.916..1.126] | -           | neutral    |
| G7 mapValues data-first                         | XS   | high           | 16.50 us  | 16.67 us  | 1.010 [0.992..1.028] | 1.010 [0.992..1.027] | 1.028      | 0.992      | 1.014 [1.008..1.020] | -           | neutral    |
| G7 mapValues data-first                         | S    | high           | 16.27 us  | 16.17 us  | 0.994 [0.987..1.000] | 1.000 [0.998..1.001] | 1.000      | 0.987      | 0.991 [0.985..0.997] | -           | neutral    |
| G7 mapValues data-first                         | C    | high           | 149.60 us | 161.29 us | 1.080 [0.973..1.187] | 1.033 [0.996..1.070] | 0.973      | 1.187      | 1.021 [0.998..1.045] | -           | neutral    |
| G7 omit data-first                              | XS   | high           | 28.21 us  | 27.94 us  | 0.991 [0.974..1.008] | 0.985 [0.972..0.997] | 0.974      | 1.008      | 1.002 [0.993..1.011] | -           | neutral    |
| G7 omit data-first                              | S    | high           | 31.54 us  | 31.56 us  | 1.001 [1.000..1.001] | 1.000 [1.000..1.001] | 1.001      | 1.000      | 1.003 [1.003..1.004] | -           | neutral    |
| G7 omit data-first                              | C    | high           | 223.73 us | 222.56 us | 0.995 [0.988..1.001] | 0.987 [0.980..0.994] | 0.988      | 1.001      | 1.018 [1.008..1.028] | -           | neutral    |
| G7 pick data-first                              | XS   | high           | 14.19 us  | 14.21 us  | 1.001 [1.000..1.003] | 1.002 [1.001..1.003] | 1.003      | 1.000      | 0.994 [0.988..1.000] | -           | neutral    |
| G7 pick data-first                              | S    | high           | 5.75 us   | 5.75 us   | 1.000 [0.993..1.007] | 1.001 [0.996..1.006] | 1.007      | 0.993      | 1.000 [0.993..1.008] | -           | neutral    |
| G7 pick data-first                              | C    | high           | 7.42 us   | 7.42 us   | 1.000 [0.994..1.006] | 0.998 [0.994..1.003] | 0.994      | 1.006      | 1.008 [1.006..1.011] | -           | neutral    |
| G7 range data-first                             | XS   | mid (override) | 23.60 us  | 23.94 us  | 1.014 [1.009..1.019] | 1.010 [1.003..1.017] | 1.019      | 1.009      | 0.998 [0.996..1.000] | -           | neutral    |
| G7 range data-first                             | S    | mid (override) | 27.81 us  | 27.85 us  | 1.002 [0.999..1.005] | 1.001 [0.998..1.003] | 0.999      | 1.005      | 1.002 [1.000..1.005] | -           | neutral    |
| G7 range data-first                             | C    | mid (override) | 144.62 us | 144.56 us | 1.000 [0.992..1.008] | 1.002 [0.994..1.009] | 1.008      | 0.992      | 1.000 [0.999..1.001] | -           | neutral    |
| G7 sortBy data-first                            | S    | high           | 30.44 us  | 30.40 us  | 0.999 [0.997..1.000] | 0.981 [0.963..0.999] | 1.000      | 0.997      | 0.995 [0.986..1.003] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy        | S    | high           | 98.77 us  | 90.58 us  | 0.917 [0.893..0.942] | 0.915 [0.896..0.934] | 0.942      | 0.893      | 1.029 [0.995..1.063] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy        | C    | high           | 384.71 us | 326.29 us | 0.848 [0.837..0.859] | 0.839 [0.830..0.849] | 0.837      | 0.859      | 1.001 [1.001..1.002] | -           | **faster** |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.745, floor 0.010)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 42.69 us | 29.83 us | 0.699 [0.698..0.700] | 0.689 [0.688..0.690] | 0.700      | 0.698      | 1.001 [0.993..1.009] | -           | **faster** |
| G1 map                                   | M    | high | 31.77 us | 14.00 us | 0.441 [0.437..0.445] | 0.435 [0.432..0.439] | 0.445      | 0.437      | 1.005 [0.999..1.012] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 70.60 us | 32.23 us | 0.457 [0.453..0.460] | 0.448 [0.445..0.451] | 0.453      | 0.460      | 0.992 [0.991..0.993] | -           | **faster** |
| G5 data-first filter                     | M    | high | 6.06 us  | 6.04 us  | 0.996 [0.993..1.000] | 0.996 [0.990..1.002] | 1.000      | 0.993      | 1.000 [1.000..1.000] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.52 us  | 5.52 us  | 1.000 [1.000..1.000] | 1.003 [1.000..1.007] | 1.000      | 1.000      | 1.000 [1.000..1.000] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.58 us  | 5.54 us  | 0.993 [0.992..0.993] | 0.995 [0.994..0.996] | 0.993      | 0.992      | 0.996 [0.993..1.000] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 97.94 us | 89.38 us | 0.913 [0.910..0.915] | 0.894 [0.886..0.902] | 0.915      | 0.910      | 1.001 [0.993..1.009] | -           | **faster** |
