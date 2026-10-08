# Bun (portable runner)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run           | entry order         | runner   | source | pollution | node      | flags | scale | wall  |
| ------------- | ------------------- | -------- | ------ | --------- | --------- | ----- | ----- | ----- |
| main/x-bun-r0 | main,branch,main-aa | portable | dist   | P2        | bun 1.4.2 | -     | 1     | 118 s |
| main/x-bun-r1 | branch,main-aa,main | portable | dist   | P2        | bun 1.4.2 | -     | 1     | 118 s |

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
| 1    | 114   | 0.008          | 0.064               | 0.108 | 57            | 0 (0.0%)    | 0               |
| 2    | 14    | 0.003          | 0.025               | 0.029 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts                         | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | ----------------------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.807 | faster 32, neutral 24, regression 1 | 0.616 | faster 4, neutral 3 | -     | -           | 1              |
| main-aa | 0.995 | neutral 57                          | 0.995 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 1.02%, T2 0.97%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 1              | 0.807 | 0.616 | -     | -       |

## Tier 1: branch vs main (57 scenarios, weighted geomean 0.807, floor 0.064)

Bar violations: G5 data-first uniqueBy (reads data) XS (1.384).

| scenario                                        | size | pop            | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict        |
| ----------------------------------------------- | ---- | -------------- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | -------------- |
| G1 filter+map                                   | S    | high           | 44.67 us  | 36.12 us  | 0.809 [0.796..0.821] | 0.787 [0.770..0.805] | 0.821      | 0.796      | 0.990 [0.989..0.991] | -           | **faster**     |
| G1 filter+map                                   | C    | high           | 202.54 us | 109.19 us | 0.539 [0.537..0.541] | 0.524 [0.520..0.529] | 0.541      | 0.537      | 0.977 [0.975..0.979] | -           | **faster**     |
| G1 map                                          | S    | high           | 29.31 us  | 15.44 us  | 0.527 [0.521..0.532] | 0.494 [0.486..0.501] | 0.521      | 0.532      | 1.005 [0.996..1.014] | -           | **faster**     |
| G1 map                                          | C    | high           | 140.67 us | 44.96 us  | 0.320 [0.320..0.320] | 0.312 [0.311..0.312] | 0.320      | 0.320      | 1.005 [1.004..1.007] | -           | **faster**     |
| G1 map+filter+map                               | S    | high           | 69.69 us  | 48.85 us  | 0.701 [0.699..0.703] | 0.676 [0.671..0.681] | 0.703      | 0.699      | 1.004 [1.002..1.005] | -           | **faster**     |
| G1 map+filter+map                               | C    | high           | 331.13 us | 139.85 us | 0.422 [0.420..0.425] | 0.407 [0.405..0.409] | 0.425      | 0.420      | 1.002 [0.998..1.006] | -           | **faster**     |
| G3 pipe(x, add(1))                              | x64  | high           | 3.65 us   | 2.48 us   | 0.680 [0.663..0.698] | 0.686 [0.658..0.714] | 0.698      | 0.663      | 1.001 [0.967..1.035] | -           | **faster**     |
| G3 scalar arrows depth-3                        | x64  | high           | 2.12 us   | 1.94 us   | 0.912 [0.902..0.922] | 0.926 [0.912..0.940] | 0.922      | 0.902      | 0.990 [0.981..1.000] | -           | **faster**     |
| G5 data-first difference                        | XS   | mid (override) | 29.46 us  | 18.15 us  | 0.618 [0.585..0.650] | 0.614 [0.578..0.649] | 0.650      | 0.585      | 0.956 [0.910..1.001] | -           | **faster**     |
| G5 data-first difference                        | S    | mid (override) | 29.27 us  | 12.17 us  | 0.416 [0.410..0.421] | 0.406 [0.402..0.409] | 0.421      | 0.410      | 0.983 [0.981..0.984] | -           | **faster**     |
| G5 data-first difference                        | C    | mid (override) | 163.06 us | 65.25 us  | 0.400 [0.399..0.401] | 0.392 [0.392..0.393] | 0.399      | 0.401      | 1.008 [0.999..1.018] | -           | **faster**     |
| G5 data-first difference                        | M    | mid (override) | 21.02 us  | 8.06 us   | 0.384 [0.377..0.390] | 0.367 [0.362..0.373] | 0.390      | 0.377      | 0.991 [0.982..1.000] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | XS   | mid (override) | 39.81 us  | 26.98 us  | 0.678 [0.661..0.696] | 0.675 [0.656..0.694] | 0.696      | 0.661      | 0.967 [0.941..0.994] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | S    | mid (override) | 35.52 us  | 18.94 us  | 0.533 [0.527..0.539] | 0.528 [0.523..0.533] | 0.527      | 0.539      | 1.008 [0.997..1.019] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | C    | mid (override) | 184.85 us | 93.83 us  | 0.508 [0.505..0.510] | 0.501 [0.500..0.501] | 0.510      | 0.505      | 0.989 [0.985..0.992] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | M    | mid (override) | 27.33 us  | 14.88 us  | 0.544 [0.536..0.553] | 0.538 [0.531..0.545] | 0.553      | 0.536      | 0.984 [0.974..0.994] | -           | **faster**     |
| G5 data-first filter                            | XS   | high           | 6.81 us   | 6.71 us   | 0.985 [0.981..0.988] | 0.986 [0.985..0.988] | 0.981      | 0.988      | 1.000 [1.000..1.000] | -           | neutral        |
| G5 data-first filter                            | S    | high           | 4.94 us   | 5.02 us   | 1.017 [1.000..1.034] | 1.011 [0.992..1.029] | 1.034      | 1.000      | 1.025 [1.025..1.025] | -           | neutral        |
| G5 data-first filter                            | C    | high           | 27.52 us  | 27.73 us  | 1.008 [0.992..1.023] | 1.010 [0.997..1.023] | 1.023      | 0.992      | 0.993 [0.992..0.994] | -           | neutral        |
| G5 data-first map                               | XS   | high           | 8.00 us   | 8.00 us   | 1.000 [0.995..1.005] | 1.002 [0.997..1.008] | 0.995      | 1.005      | 1.016 [0.990..1.042] | -           | neutral        |
| G5 data-first map                               | S    | high           | 4.48 us   | 4.44 us   | 0.991 [0.982..1.000] | 0.995 [0.986..1.004] | 0.982      | 1.000      | 1.005 [1.000..1.009] | -           | neutral        |
| G5 data-first map                               | C    | high           | 21.90 us  | 21.52 us  | 0.983 [0.972..0.994] | 0.982 [0.970..0.995] | 0.972      | 0.994      | 0.994 [0.989..1.000] | -           | neutral        |
| G5 data-first unique                            | XS   | high           | 29.29 us  | 18.75 us  | 0.642 [0.616..0.667] | 0.634 [0.610..0.658] | 0.667      | 0.616      | 0.936 [0.892..0.980] | -           | **faster**     |
| G5 data-first unique                            | S    | high           | 36.19 us  | 22.60 us  | 0.625 [0.612..0.638] | 0.617 [0.600..0.635] | 0.612      | 0.638      | 1.005 [1.001..1.008] | -           | **faster**     |
| G5 data-first unique                            | C    | high           | 232.88 us | 149.25 us | 0.641 [0.628..0.654] | 0.643 [0.631..0.655] | 0.628      | 0.654      | 1.004 [1.000..1.008] | -           | **faster**     |
| G5 data-first uniqueBy                          | XS   | high           | 33.06 us  | 34.56 us  | 1.048 [1.000..1.095] | 1.032 [0.985..1.078] | 1.095      | 1.000      | 0.948 [0.905..0.991] | -           | neutral        |
| G5 data-first uniqueBy                          | S    | high           | 41.04 us  | 31.62 us  | 0.771 [0.762..0.780] | 0.750 [0.742..0.758] | 0.780      | 0.762      | 0.992 [0.984..1.000] | -           | **faster**     |
| G5 data-first uniqueBy                          | C    | high           | 257.27 us | 183.58 us | 0.714 [0.712..0.715] | 0.711 [0.708..0.715] | 0.715      | 0.712      | 0.990 [0.986..0.994] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | XS   | high           | 35.06 us  | 48.48 us  | 1.384 [1.333..1.436] | 1.361 [1.308..1.414] | 1.436      | 1.333      | 0.957 [0.924..0.989] | -           | **regression** |
| G5 data-first uniqueBy (reads data)             | S    | high           | 44.81 us  | 39.46 us  | 0.881 [0.880..0.881] | 0.862 [0.862..0.863] | 0.881      | 0.880      | 0.979 [0.974..0.983] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | C    | high           | 271.65 us | 215.58 us | 0.794 [0.787..0.800] | 0.790 [0.787..0.793] | 0.787      | 0.800      | 0.985 [0.971..1.000] | -           | **faster**     |
| G6 map(fn)(data)                                | S    | high           | 9.96 us   | 10.06 us  | 1.010 [1.008..1.012] | 1.010 [1.007..1.012] | 1.012      | 1.008      | 0.994 [0.987..1.000] | -           | neutral        |
| G6 map(fn)(data)                                | C    | high           | 27.65 us  | 28.17 us  | 1.019 [1.008..1.030] | 1.011 [1.006..1.016] | 1.030      | 1.008      | 0.997 [0.997..0.997] | -           | neutral        |
| G7 entries data-first                           | XS   | high           | 15.58 us  | 14.90 us  | 0.956 [0.944..0.968] | 0.957 [0.943..0.970] | 0.968      | 0.944      | 0.997 [0.995..1.000] | -           | neutral        |
| G7 entries data-first                           | S    | high           | 20.10 us  | 20.21 us  | 1.005 [1.004..1.006] | 1.001 [0.999..1.002] | 1.006      | 1.004      | 0.993 [0.990..0.996] | -           | neutral        |
| G7 entries data-first                           | C    | high           | 117.58 us | 117.23 us | 0.997 [0.996..0.998] | 0.999 [0.996..1.003] | 0.998      | 0.996      | 1.002 [0.992..1.011] | -           | neutral        |
| G7 groupBy data-first                           | XS   | high           | 13.00 us  | 12.71 us  | 0.978 [0.958..0.997] | 0.973 [0.953..0.994] | 0.958      | 0.997      | 1.008 [0.997..1.019] | -           | neutral        |
| G7 groupBy data-first                           | S    | high           | 7.21 us   | 7.19 us   | 0.997 [0.977..1.018] | 0.994 [0.977..1.011] | 0.977      | 1.018      | 0.991 [0.988..0.994] | -           | neutral        |
| G7 groupBy data-first                           | C    | high           | 40.35 us  | 39.81 us  | 0.987 [0.981..0.992] | 0.988 [0.982..0.993] | 0.981      | 0.992      | 1.001 [0.993..1.009] | -           | neutral        |
| G7 isDeepEqual data-first                       | XS   | high           | 24.79 us  | 24.63 us  | 0.993 [0.982..1.005] | 0.994 [0.983..1.005] | 1.005      | 0.982      | 1.005 [1.003..1.007] | -           | neutral        |
| G7 isDeepEqual data-first                       | S    | high           | 34.02 us  | 34.15 us  | 1.004 [0.998..1.010] | 1.004 [0.998..1.009] | 1.010      | 0.998      | 1.003 [1.001..1.005] | -           | neutral        |
| G7 isDeepEqual data-first                       | C    | high           | 311.58 us | 313.10 us | 1.005 [1.002..1.008] | 1.006 [1.002..1.009] | 1.008      | 1.002      | 1.000 [0.999..1.002] | -           | neutral        |
| G7 mapValues data-first                         | XS   | high           | 20.15 us  | 19.98 us  | 0.992 [0.979..1.004] | 0.993 [0.981..1.005] | 0.979      | 1.004      | 1.009 [1.002..1.017] | -           | neutral        |
| G7 mapValues data-first                         | S    | high           | 32.94 us  | 32.19 us  | 0.977 [0.975..0.980] | 0.978 [0.975..0.980] | 0.975      | 0.980      | 1.004 [1.001..1.006] | -           | neutral        |
| G7 mapValues data-first                         | C    | high           | 272.29 us | 271.04 us | 0.995 [0.993..0.998] | 0.995 [0.990..1.000] | 0.993      | 0.998      | 1.004 [1.002..1.006] | -           | neutral        |
| G7 omit data-first                              | XS   | high           | 25.60 us  | 22.44 us  | 0.877 [0.865..0.888] | 0.891 [0.873..0.908] | 0.888      | 0.865      | 0.996 [0.984..1.008] | -           | **faster**     |
| G7 omit data-first                              | S    | high           | 8.37 us   | 7.42 us   | 0.887 [0.862..0.912] | 0.899 [0.873..0.924] | 0.912      | 0.862      | 1.018 [1.005..1.031] | -           | **faster**     |
| G7 omit data-first                              | C    | high           | 11.75 us  | 10.90 us  | 0.928 [0.906..0.949] | 0.932 [0.910..0.954] | 0.949      | 0.906      | 1.011 [1.007..1.014] | -           | neutral        |
| G7 pick data-first                              | XS   | high           | 10.58 us  | 8.75 us   | 0.827 [0.823..0.830] | 0.828 [0.828..0.829] | 0.823      | 0.830      | 0.998 [0.992..1.004] | -           | **faster**     |
| G7 pick data-first                              | S    | high           | 2.56 us   | 1.94 us   | 0.757 [0.746..0.767] | 0.749 [0.743..0.756] | 0.767      | 0.746      | 1.001 [0.968..1.034] | -           | **faster**     |
| G7 pick data-first                              | C    | high           | 2.67 us   | 2.12 us   | 0.797 [0.797..0.797] | 0.790 [0.790..0.791] | 0.797      | 0.797      | 1.016 [1.000..1.031] | -           | **faster**     |
| G7 range data-first                             | XS   | mid (override) | 10.23 us  | 8.27 us   | 0.812 [0.755..0.870] | 0.821 [0.766..0.877] | 0.870      | 0.755      | 0.980 [0.946..1.013] | -           | **faster**     |
| G7 range data-first                             | S    | mid (override) | 4.94 us   | 4.19 us   | 0.849 [0.821..0.877] | 0.859 [0.831..0.886] | 0.877      | 0.821      | 0.950 [0.927..0.974] | -           | **faster**     |
| G7 range data-first                             | C    | mid (override) | 18.62 us  | 17.31 us  | 0.931 [0.898..0.963] | 0.933 [0.899..0.967] | 0.898      | 0.963      | 0.990 [0.924..1.056] | -           | neutral        |
| G7 sortBy data-first                            | S    | high           | 13.56 us  | 13.50 us  | 0.995 [0.994..0.997] | 0.998 [0.996..1.000] | 0.994      | 0.997      | 1.006 [0.994..1.019] | -           | neutral        |
| G10 filter,map / sortBy / take / groupBy        | S    | high           | 79.96 us  | 64.98 us  | 0.813 [0.810..0.816] | 0.796 [0.792..0.799] | 0.810      | 0.816      | 0.998 [0.995..1.001] | -           | **faster**     |
| G10 filter,map / sortBy / take / groupBy        | C    | high           | 257.44 us | 157.60 us | 0.612 [0.604..0.621] | 0.597 [0.588..0.605] | 0.604      | 0.621      | 0.991 [0.983..1.000] | -           | **faster**     |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.616, floor 0.025)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 26.83 us | 13.29 us | 0.496 [0.479..0.512] | 0.479 [0.464..0.494] | 0.512      | 0.479      | 0.993 [0.971..1.016] | -           | **faster** |
| G1 map                                   | M    | high | 19.42 us | 5.31 us  | 0.274 [0.273..0.275] | 0.263 [0.262..0.264] | 0.273      | 0.275      | 0.986 [0.977..0.996] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 45.50 us | 17.04 us | 0.375 [0.372..0.378] | 0.358 [0.356..0.361] | 0.372      | 0.378      | 1.003 [1.000..1.006] | -           | **faster** |
| G5 data-first filter                     | M    | high | 4.27 us  | 4.25 us  | 0.995 [0.971..1.020] | 1.008 [0.991..1.025] | 1.020      | 0.971      | 0.990 [0.980..1.000] | -           | neutral    |
| G5 data-first map                        | M    | high | 3.17 us  | 3.17 us  | 1.000 [1.000..1.000] | 1.000 [0.998..1.001] | 1.000      | 1.000      | 1.000 [1.000..1.000] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 3.33 us  | 3.33 us  | 1.000 [1.000..1.000] | 1.002 [1.001..1.003] | 1.000      | 1.000      | 1.000 [1.000..1.000] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 39.27 us | 26.10 us | 0.665 [0.661..0.669] | 0.647 [0.642..0.652] | 0.669      | 0.661      | 0.994 [0.986..1.001] | -           | **faster** |
