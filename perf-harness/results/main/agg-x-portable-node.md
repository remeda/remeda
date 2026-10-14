# Node (portable runner)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                     | entry order         | runner   | source | pollution | node         | flags | scale | wall  |
| ----------------------- | ------------------- | -------- | ------ | --------- | ------------ | ----- | ----- | ----- |
| main/x-portable-node-r0 | main,branch,main-aa | portable | dist   | P2        | node v26.9.0 | -     | 1     | 118 s |
| main/x-portable-node-r1 | branch,main-aa,main | portable | dist   | P2        | node v26.9.0 | -     | 1     | 118 s |

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
| 1    | 114   | 0.007          | 0.048               | 0.137 | 57            | 1 (1.8%)    | 1               |
| 2    | 14    | 0.003          | 0.015               | 0.016 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

A/A false calls: G7 | mapValues data-first | C | data-first-guard (regression).

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts                         | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | ----------------------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.857 | faster 26, neutral 30, regression 1 | 0.745 | faster 4, neutral 3 | -     | -           | 1              |
| main-aa | 0.998 | neutral 56, regression 1            | 0.997 | neutral 7           | -     | -           | 1              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.62%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 1              | 0.857 | 0.745 | -     | -       |

## Tier 1: branch vs main (57 scenarios, weighted geomean 0.857, floor 0.048)

Bar violations: G7 mapValues data-first C (1.053).

| scenario                                        | size | pop            | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict        |
| ----------------------------------------------- | ---- | -------------- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | -------------- |
| G1 filter+map                                   | S    | high           | 51.48 us  | 41.33 us  | 0.803 [0.768..0.839] | 0.797 [0.765..0.828] | 0.839      | 0.768      | 0.992 [0.990..0.993] | -           | **faster**     |
| G1 filter+map                                   | C    | high           | 277.87 us | 194.96 us | 0.702 [0.687..0.717] | 0.701 [0.688..0.713] | 0.717      | 0.687      | 0.992 [0.984..1.000] | -           | **faster**     |
| G1 map                                          | S    | high           | 36.58 us  | 18.71 us  | 0.512 [0.499..0.524] | 0.508 [0.490..0.526] | 0.524      | 0.499      | 1.000 [0.991..1.008] | -           | **faster**     |
| G1 map                                          | C    | high           | 205.77 us | 91.08 us  | 0.443 [0.440..0.446] | 0.441 [0.435..0.447] | 0.446      | 0.440      | 1.003 [0.996..1.010] | -           | **faster**     |
| G1 map+filter+map                               | S    | high           | 80.29 us  | 43.85 us  | 0.546 [0.541..0.552] | 0.550 [0.542..0.558] | 0.552      | 0.541      | 0.986 [0.984..0.988] | -           | **faster**     |
| G1 map+filter+map                               | C    | high           | 454.44 us | 208.81 us | 0.459 [0.459..0.460] | 0.459 [0.457..0.461] | 0.460      | 0.459      | 0.994 [0.991..0.997] | -           | **faster**     |
| G3 pipe(x, add(1))                              | x64  | high           | 1.85 us   | 1.33 us   | 0.724 [0.638..0.810] | 0.729 [0.649..0.809] | 0.638      | 0.810      | 1.035 [0.999..1.071] | -           | **faster**     |
| G3 scalar arrows depth-3                        | x64  | high           | 1.83 us   | 1.77 us   | 0.966 [0.909..1.023] | 0.956 [0.909..1.003] | 0.909      | 1.023      | 1.001 [1.001..1.001] | -           | neutral        |
| G5 data-first difference                        | XS   | mid (override) | 33.60 us  | 24.02 us  | 0.717 [0.673..0.760] | 0.714 [0.671..0.756] | 0.760      | 0.673      | 0.957 [0.908..1.006] | -           | **faster**     |
| G5 data-first difference                        | S    | mid (override) | 38.90 us  | 29.31 us  | 0.754 [0.736..0.772] | 0.748 [0.730..0.766] | 0.772      | 0.736      | 0.991 [0.967..1.015] | -           | **faster**     |
| G5 data-first difference                        | C    | mid (override) | 237.52 us | 175.60 us | 0.739 [0.735..0.744] | 0.729 [0.726..0.732] | 0.744      | 0.735      | 1.002 [0.995..1.008] | -           | **faster**     |
| G5 data-first difference                        | M    | mid (override) | 31.44 us  | 22.44 us  | 0.714 [0.708..0.720] | 0.708 [0.703..0.713] | 0.708      | 0.720      | 1.009 [1.001..1.016] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | XS   | mid (override) | 55.67 us  | 44.23 us  | 0.795 [0.789..0.800] | 0.793 [0.787..0.798] | 0.789      | 0.800      | 1.008 [1.006..1.010] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | S    | mid (override) | 70.17 us  | 52.92 us  | 0.754 [0.747..0.762] | 0.752 [0.745..0.758] | 0.762      | 0.747      | 0.992 [0.981..1.003] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | C    | mid (override) | 415.83 us | 296.35 us | 0.713 [0.710..0.716] | 0.712 [0.710..0.713] | 0.710      | 0.716      | 0.992 [0.984..0.999] | -           | **faster**     |
| G5 data-first difference(range) (adopter shape) | M    | mid (override) | 65.85 us  | 49.29 us  | 0.748 [0.748..0.749] | 0.743 [0.742..0.743] | 0.749      | 0.748      | 0.997 [0.994..1.001] | -           | **faster**     |
| G5 data-first filter                            | XS   | high           | 9.31 us   | 9.25 us   | 0.993 [0.991..0.996] | 0.995 [0.994..0.996] | 0.996      | 0.991      | 0.969 [0.969..0.969] | -           | neutral        |
| G5 data-first filter                            | S    | high           | 7.33 us   | 7.37 us   | 1.006 [1.000..1.011] | 1.004 [1.002..1.006] | 1.011      | 1.000      | 1.003 [1.000..1.006] | -           | neutral        |
| G5 data-first filter                            | C    | high           | 37.83 us  | 38.10 us  | 1.007 [0.993..1.021] | 1.001 [0.982..1.020] | 1.021      | 0.993      | 1.004 [0.999..1.010] | -           | neutral        |
| G5 data-first map                               | XS   | high           | 8.15 us   | 8.15 us   | 1.000 [0.995..1.005] | 1.005 [1.003..1.007] | 1.005      | 0.995      | 0.998 [0.990..1.005] | -           | neutral        |
| G5 data-first map                               | S    | high           | 7.48 us   | 7.42 us   | 0.992 [0.989..0.995] | 1.001 [0.998..1.004] | 0.995      | 0.989      | 0.994 [0.994..0.995] | -           | neutral        |
| G5 data-first map                               | C    | high           | 35.27 us  | 34.85 us  | 0.990 [0.948..1.032] | 0.989 [0.957..1.020] | 0.948      | 1.032      | 1.016 [0.998..1.034] | -           | neutral        |
| G5 data-first unique                            | XS   | high           | 35.27 us  | 19.21 us  | 0.545 [0.535..0.555] | 0.543 [0.532..0.553] | 0.535      | 0.555      | 1.001 [0.990..1.012] | -           | **faster**     |
| G5 data-first unique                            | S    | high           | 56.75 us  | 37.15 us  | 0.655 [0.650..0.659] | 0.651 [0.649..0.653] | 0.659      | 0.650      | 1.008 [1.006..1.011] | -           | **faster**     |
| G5 data-first unique                            | C    | high           | 327.19 us | 216.23 us | 0.661 [0.653..0.669] | 0.659 [0.653..0.665] | 0.653      | 0.669      | 0.984 [0.963..1.005] | -           | **faster**     |
| G5 data-first uniqueBy                          | XS   | high           | 40.23 us  | 30.46 us  | 0.757 [0.753..0.762] | 0.753 [0.748..0.759] | 0.762      | 0.753      | 0.999 [0.995..1.003] | -           | **faster**     |
| G5 data-first uniqueBy                          | S    | high           | 68.56 us  | 58.00 us  | 0.846 [0.832..0.861] | 0.844 [0.833..0.856] | 0.861      | 0.832      | 0.995 [0.987..1.003] | -           | **faster**     |
| G5 data-first uniqueBy                          | C    | high           | 352.52 us | 278.96 us | 0.792 [0.769..0.815] | 0.792 [0.772..0.813] | 0.815      | 0.769      | 0.998 [0.981..1.014] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | XS   | high           | 41.31 us  | 35.77 us  | 0.866 [0.851..0.881] | 0.873 [0.858..0.889] | 0.881      | 0.851      | 0.998 [0.985..1.010] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | S    | high           | 72.71 us  | 59.21 us  | 0.814 [0.808..0.821] | 0.811 [0.808..0.814] | 0.808      | 0.821      | 0.988 [0.977..0.998] | -           | **faster**     |
| G5 data-first uniqueBy (reads data)             | C    | high           | 363.98 us | 291.25 us | 0.800 [0.789..0.812] | 0.806 [0.797..0.814] | 0.789      | 0.812      | 1.000 [0.964..1.035] | -           | **faster**     |
| G6 map(fn)(data)                                | S    | high           | 9.19 us   | 9.21 us   | 1.002 [1.000..1.005] | 0.999 [0.996..1.002] | 1.005      | 1.000      | 0.998 [0.996..1.000] | -           | neutral        |
| G6 map(fn)(data)                                | C    | high           | 36.75 us  | 36.75 us  | 1.000 [1.000..1.000] | 1.000 [0.998..1.001] | 1.000      | 1.000      | 1.001 [1.000..1.002] | -           | neutral        |
| G7 entries data-first                           | XS   | high           | 6.98 us   | 6.98 us   | 1.000 [1.000..1.000] | 1.001 [1.000..1.001] | 1.000      | 1.000      | 0.997 [0.994..1.000] | -           | neutral        |
| G7 entries data-first                           | S    | high           | 4.85 us   | 4.83 us   | 0.996 [0.991..1.000] | 0.999 [0.994..1.004] | 0.991      | 1.000      | 0.996 [0.991..1.000] | -           | neutral        |
| G7 entries data-first                           | C    | high           | 18.44 us  | 18.60 us  | 1.009 [1.007..1.011] | 1.009 [1.008..1.010] | 1.011      | 1.007      | 0.999 [0.998..1.000] | -           | neutral        |
| G7 groupBy data-first                           | XS   | high           | 31.23 us  | 30.54 us  | 0.978 [0.967..0.989] | 0.978 [0.968..0.989] | 0.989      | 0.967      | 0.973 [0.966..0.980] | -           | neutral        |
| G7 groupBy data-first                           | S    | high           | 18.56 us  | 18.52 us  | 0.998 [0.996..1.000] | 1.000 [0.999..1.001] | 1.000      | 0.996      | 0.996 [0.995..0.996] | -           | neutral        |
| G7 groupBy data-first                           | C    | high           | 62.33 us  | 62.29 us  | 0.999 [0.992..1.007] | 0.997 [0.995..0.998] | 0.992      | 1.007      | 1.002 [0.992..1.013] | -           | neutral        |
| G7 isDeepEqual data-first                       | XS   | high           | 20.00 us  | 20.17 us  | 1.008 [1.000..1.017] | 1.007 [1.001..1.012] | 1.000      | 1.017      | 1.008 [1.004..1.013] | -           | neutral        |
| G7 isDeepEqual data-first                       | S    | high           | 22.38 us  | 22.17 us  | 0.991 [0.989..0.993] | 0.985 [0.981..0.989] | 0.989      | 0.993      | 0.989 [0.980..0.998] | -           | neutral        |
| G7 isDeepEqual data-first                       | C    | high           | 387.71 us | 386.27 us | 0.999 [0.957..1.041] | 0.995 [0.994..0.995] | 1.041      | 0.957      | 1.020 [0.902..1.137] | -           | neutral        |
| G7 mapValues data-first                         | XS   | high           | 16.25 us  | 16.02 us  | 0.986 [0.977..0.995] | 0.976 [0.957..0.995] | 0.977      | 0.995      | 0.973 [0.959..0.987] | -           | neutral        |
| G7 mapValues data-first                         | S    | high           | 15.44 us  | 15.56 us  | 1.008 [1.003..1.014] | 1.009 [1.004..1.015] | 1.014      | 1.003      | 0.996 [0.987..1.005] | -           | neutral        |
| G7 mapValues data-first                         | C    | high           | 151.29 us | 159.27 us | 1.053 [1.050..1.056] | 1.059 [1.055..1.064] | 1.056      | 1.050      | 1.074 [1.056..1.093] | -           | **regression** |
| G7 omit data-first                              | XS   | high           | 25.92 us  | 26.10 us  | 1.007 [1.005..1.010] | 1.006 [1.003..1.009] | 1.005      | 1.010      | 1.004 [1.003..1.005] | -           | neutral        |
| G7 omit data-first                              | S    | high           | 30.42 us  | 30.54 us  | 1.004 [1.000..1.008] | 1.006 [1.000..1.011] | 1.000      | 1.008      | 0.999 [0.996..1.001] | -           | neutral        |
| G7 omit data-first                              | C    | high           | 209.79 us | 211.69 us | 1.009 [0.994..1.024] | 1.013 [0.994..1.031] | 1.024      | 0.994      | 0.984 [0.967..1.000] | -           | neutral        |
| G7 pick data-first                              | XS   | high           | 13.56 us  | 13.48 us  | 0.994 [0.991..0.997] | 0.996 [0.988..1.004] | 0.997      | 0.991      | 0.992 [0.985..1.000] | -           | neutral        |
| G7 pick data-first                              | S    | high           | 5.42 us   | 5.35 us   | 0.988 [0.984..0.992] | 0.986 [0.984..0.988] | 0.992      | 0.984      | 0.988 [0.977..1.000] | -           | neutral        |
| G7 pick data-first                              | C    | high           | 6.79 us   | 6.81 us   | 1.003 [0.994..1.012] | 1.001 [0.995..1.008] | 1.012      | 0.994      | 1.003 [1.000..1.006] | -           | neutral        |
| G7 range data-first                             | XS   | mid (override) | 21.94 us  | 21.79 us  | 0.993 [0.989..0.998] | 0.996 [0.991..1.001] | 0.998      | 0.989      | 0.995 [0.994..0.996] | -           | neutral        |
| G7 range data-first                             | S    | mid (override) | 25.79 us  | 25.94 us  | 1.006 [1.005..1.006] | 1.003 [1.001..1.005] | 1.005      | 1.006      | 1.000 [0.992..1.008] | -           | neutral        |
| G7 range data-first                             | C    | mid (override) | 138.29 us | 135.96 us | 0.983 [0.981..0.985] | 0.977 [0.969..0.986] | 0.981      | 0.985      | 0.983 [0.980..0.986] | -           | neutral        |
| G7 sortBy data-first                            | S    | high           | 29.83 us  | 29.71 us  | 0.996 [0.990..1.001] | 0.997 [0.991..1.002] | 0.990      | 1.001      | 1.003 [1.003..1.003] | -           | neutral        |
| G10 filter,map / sortBy / take / groupBy        | S    | high           | 101.58 us | 90.69 us  | 0.894 [0.853..0.934] | 0.898 [0.863..0.932] | 0.934      | 0.853      | 0.974 [0.955..0.993] | -           | **faster**     |
| G10 filter,map / sortBy / take / groupBy        | C    | high           | 384.35 us | 325.33 us | 0.847 [0.835..0.858] | 0.846 [0.834..0.857] | 0.858      | 0.835      | 0.993 [0.981..1.005] | -           | **faster**     |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.745, floor 0.015)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 43.10 us | 29.96 us | 0.695 [0.673..0.717] | 0.692 [0.672..0.712] | 0.717      | 0.673      | 0.991 [0.988..0.993] | -           | **faster** |
| G1 map                                   | M    | high | 31.71 us | 13.94 us | 0.440 [0.435..0.444] | 0.436 [0.431..0.441] | 0.444      | 0.435      | 1.002 [0.999..1.005] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 69.58 us | 31.60 us | 0.454 [0.454..0.455] | 0.451 [0.450..0.451] | 0.455      | 0.454      | 0.996 [0.984..1.008] | -           | **faster** |
| G5 data-first filter                     | M    | high | 5.90 us  | 5.92 us  | 1.004 [1.000..1.007] | 1.001 [0.997..1.005] | 1.000      | 1.007      | 1.000 [1.000..1.000] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.48 us  | 5.48 us  | 1.000 [1.000..1.000] | 1.003 [1.002..1.003] | 1.000      | 1.000      | 1.000 [1.000..1.000] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.56 us  | 5.54 us  | 0.996 [0.992..1.000] | 0.991 [0.981..1.001] | 1.000      | 0.992      | 0.992 [0.985..1.000] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 97.54 us | 89.73 us | 0.920 [0.915..0.925] | 0.915 [0.908..0.922] | 0.925      | 0.915      | 0.997 [0.997..0.998] | -           | **faster** |
