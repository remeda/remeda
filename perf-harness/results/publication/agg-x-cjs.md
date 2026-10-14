# CJS through require

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                    | entry order         | runner | source | pollution | node    | flags | scale | wall |
| ---------------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| publication/x-cjs-r0-a | main,branch,main-aa | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |
| publication/x-cjs-r0-b | main,branch,main-aa | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |
| publication/x-cjs-r1-a | branch,main-aa,main | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |
| publication/x-cjs-r1-b | branch,main-aa,main | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |

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
| 1    | 64    | 0.009          | 0.155               | 0.185 | 16            | 0 (0.0%)    | 0               |
| 2    | 28    | 0.008          | 0.167               | 0.194 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts          | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | -------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.596 | faster 10, neutral 6 | 0.597 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa | 1.033 | neutral 16           | 1.033 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 6.73%, T2 6.77%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.596 | 0.597 | -     | -       |

## Tier 1: branch vs main (16 scenarios, weighted geomean 0.596, floor 0.155)

| scenario                                 | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | S    | high | 55.54 us  | 26.06 us  | 0.471 [0.422..0.513] | 0.473 [0.426..0.512] | 0.427      | 0.512      | 1.073 [0.996..1.156] | -           | **faster** |
| G1 filter+map                            | C    | high | 310.58 us | 115.17 us | 0.373 [0.327..0.408] | 0.376 [0.330..0.410] | 0.334      | 0.407      | 1.091 [0.993..1.185] | -           | **faster** |
| G1 map                                   | S    | high | 39.85 us  | 13.69 us  | 0.342 [0.318..0.372] | 0.344 [0.317..0.378] | 0.319      | 0.368      | 1.044 [1.002..1.087] | -           | **faster** |
| G1 map                                   | C    | high | 224.06 us | 68.83 us  | 0.307 [0.285..0.330] | 0.308 [0.286..0.330] | 0.290      | 0.324      | 1.060 [0.998..1.135] | -           | **faster** |
| G1 map+filter+map                        | S    | high | 83.94 us  | 34.42 us  | 0.410 [0.385..0.429] | 0.412 [0.388..0.430] | 0.390      | 0.427      | 1.024 [0.998..1.055] | -           | **faster** |
| G1 map+filter+map                        | C    | high | 479.42 us | 161.60 us | 0.337 [0.319..0.350] | 0.339 [0.320..0.351] | 0.324      | 0.348      | 1.019 [1.000..1.077] | -           | **faster** |
| G3 pipe(x, add(1))                       | x64  | high | 1.90 us   | 1.21 us   | 0.643 [0.530..0.762] | 0.647 [0.535..0.773] | 0.536      | 0.753      | 1.080 [1.000..1.143] | -           | **faster** |
| G3 scalar arrows depth-3                 | x64  | high | 1.96 us   | 1.15 us   | 0.585 [0.575..0.609] | 0.584 [0.579..0.591] | 0.592      | 0.585      | 1.000 [0.999..1.000] | -           | **faster** |
| G5 data-first filter                     | S    | high | 7.23 us   | 7.46 us   | 1.034 [1.023..1.041] | 1.036 [1.022..1.042] | 1.026      | 1.040      | 1.006 [0.983..1.023] | -           | neutral    |
| G5 data-first filter                     | C    | high | 38.77 us  | 38.77 us  | 0.996 [0.983..1.001] | 0.996 [0.983..1.003] | 1.001      | 0.987      | 0.987 [0.972..1.006] | -           | neutral    |
| G5 data-first map                        | S    | high | 7.46 us   | 7.65 us   | 1.025 [1.022..1.033] | 1.028 [1.027..1.031] | 1.028      | 1.025      | 1.000 [0.995..1.000] | -           | neutral    |
| G5 data-first map                        | C    | high | 37.12 us  | 37.02 us  | 0.998 [0.991..1.006] | 1.003 [0.994..1.007] | 0.995      | 1.002      | 0.996 [0.987..1.015] | -           | neutral    |
| G6 map(fn)(data)                         | S    | high | 8.94 us   | 7.94 us   | 0.888 [0.853..0.924] | 0.884 [0.842..0.923] | 0.855      | 0.922      | 1.017 [1.000..1.043] | -           | neutral    |
| G6 map(fn)(data)                         | C    | high | 38.79 us  | 36.85 us  | 0.952 [0.940..0.975] | 0.949 [0.940..0.972] | 0.941      | 0.968      | 1.004 [0.996..1.009] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | S    | high | 104.75 us | 61.65 us  | 0.590 [0.548..0.634] | 0.592 [0.549..0.637] | 0.548      | 0.633      | 1.055 [1.005..1.116] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy | C    | high | 418.15 us | 208.44 us | 0.502 [0.462..0.552] | 0.504 [0.464..0.553] | 0.463      | 0.546      | 1.082 [1.003..1.169] | -           | **faster** |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.597, floor 0.167)

| scenario                                 | size | pop  | main      | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 47.15 us  | 17.35 us | 0.371 [0.332..0.404] | 0.365 [0.329..0.397] | 0.338      | 0.401      | 1.093 [1.000..1.194] | -           | **faster** |
| G1 map                                   | M    | high | 34.29 us  | 10.58 us | 0.308 [0.285..0.328] | 0.302 [0.282..0.322] | 0.286      | 0.328      | 1.071 [1.003..1.136] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 72.38 us  | 24.06 us | 0.333 [0.315..0.341] | 0.327 [0.314..0.336] | 0.321      | 0.340      | 1.033 [1.006..1.063] | -           | **faster** |
| G5 data-first filter                     | M    | high | 6.25 us   | 6.23 us  | 0.997 [0.987..1.007] | 1.001 [0.984..1.011] | 1.000      | 0.993      | 0.997 [0.987..1.007] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.52 us   | 5.52 us  | 1.000 [1.000..1.015] | 1.005 [1.001..1.012] | 1.000      | 1.007      | 0.996 [0.992..1.007] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.54 us   | 5.50 us  | 0.992 [0.992..1.000] | 0.997 [0.987..1.002] | 0.996      | 0.992      | 1.000 [1.000..1.000] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 102.10 us | 72.71 us | 0.715 [0.682..0.737] | 0.706 [0.674..0.730] | 0.689      | 0.736      | 1.048 [1.012..1.088] | -           | **faster** |
