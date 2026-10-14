# CJS through require

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run           | entry order         | runner | source | pollution | node    | flags | scale | wall |
| ------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| main/x-cjs-r0 | main,branch,main-aa | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |
| main/x-cjs-r1 | branch,main-aa,main | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |

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
| 1    | 32    | 0.015          | 0.158               | 0.205 | 16            | 0 (0.0%)    | 0               |
| 2    | 14    | 0.010          | 0.168               | 0.214 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts         | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | ------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.760 | faster 8, neutral 8 | 0.719 | faster 3, neutral 4 | -     | -           | 0              |
| main-aa | 1.040 | neutral 16          | 1.041 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 8.26%, T2 8.35%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.760 | 0.719 | -     | -       |

## Tier 1: branch vs main (16 scenarios, weighted geomean 0.760, floor 0.158)

| scenario                                 | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | S    | high | 54.83 us  | 41.44 us  | 0.761 [0.691..0.830] | 0.755 [0.688..0.822] | 0.691      | 0.830      | 1.097 [1.019..1.174] | -           | **faster** |
| G1 filter+map                            | C    | high | 308.35 us | 201.25 us | 0.658 [0.599..0.717] | 0.656 [0.597..0.714] | 0.599      | 0.717      | 1.110 [1.015..1.205] | -           | **faster** |
| G1 map                                   | S    | high | 38.92 us  | 19.29 us  | 0.497 [0.470..0.524] | 0.496 [0.469..0.524] | 0.470      | 0.524      | 1.066 [1.002..1.129] | -           | **faster** |
| G1 map                                   | C    | high | 225.27 us | 93.83 us  | 0.417 [0.397..0.438] | 0.419 [0.396..0.442] | 0.397      | 0.438      | 1.072 [1.015..1.129] | -           | **faster** |
| G1 map+filter+map                        | S    | high | 83.04 us  | 46.96 us  | 0.567 [0.531..0.602] | 0.565 [0.532..0.599] | 0.531      | 0.602      | 1.040 [1.005..1.075] | -           | **faster** |
| G1 map+filter+map                        | C    | high | 470.88 us | 215.71 us | 0.459 [0.443..0.474] | 0.458 [0.442..0.474] | 0.443      | 0.474      | 1.050 [1.015..1.085] | -           | **faster** |
| G3 pipe(x, add(1))                       | x64  | high | 1.90 us   | 1.35 us   | 0.721 [0.604..0.837] | 0.730 [0.615..0.845] | 0.604      | 0.837      | 1.080 [1.020..1.139] | -           | **faster** |
| G3 scalar arrows depth-3                 | x64  | high | 1.96 us   | 1.81 us   | 0.926 [0.915..0.936] | 0.925 [0.919..0.931] | 0.936      | 0.915      | 1.011 [1.001..1.021] | -           | neutral    |
| G5 data-first filter                     | S    | high | 7.25 us   | 7.56 us   | 1.043 [1.040..1.046] | 1.040 [1.038..1.043] | 1.040      | 1.046      | 1.012 [1.006..1.017] | -           | neutral    |
| G5 data-first filter                     | C    | high | 39.27 us  | 38.79 us  | 0.988 [0.986..0.989] | 0.990 [0.986..0.994] | 0.989      | 0.986      | 0.997 [0.994..1.001] | -           | neutral    |
| G5 data-first map                        | S    | high | 7.62 us   | 7.79 us   | 1.022 [1.022..1.022] | 1.029 [1.026..1.031] | 1.022      | 1.022      | 0.997 [0.994..1.000] | -           | neutral    |
| G5 data-first map                        | C    | high | 37.92 us  | 38.08 us  | 1.004 [1.001..1.008] | 1.008 [1.006..1.010] | 1.001      | 1.008      | 1.005 [1.002..1.008] | -           | neutral    |
| G6 map(fn)(data)                         | S    | high | 9.04 us   | 9.40 us   | 1.040 [1.005..1.075] | 1.041 [1.006..1.076] | 1.005      | 1.075      | 1.012 [0.996..1.028] | -           | neutral    |
| G6 map(fn)(data)                         | C    | high | 39.00 us  | 38.90 us  | 0.997 [0.989..1.005] | 0.997 [0.990..1.004] | 0.989      | 1.005      | 0.996 [0.982..1.011] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | S    | high | 108.96 us | 89.33 us  | 0.821 [0.791..0.851] | 0.823 [0.793..0.853] | 0.791      | 0.851      | 1.037 [0.993..1.082] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | C    | high | 422.56 us | 324.77 us | 0.771 [0.732..0.810] | 0.773 [0.728..0.819] | 0.732      | 0.810      | 1.076 [1.008..1.145] | -           | **faster** |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.719, floor 0.168)

| scenario                                 | size | pop  | main      | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 46.98 us  | 29.37 us | 0.631 [0.570..0.691] | 0.627 [0.567..0.687] | 0.570      | 0.691      | 1.114 [1.014..1.214] | -           | **faster** |
| G1 map                                   | M    | high | 34.35 us  | 14.04 us | 0.410 [0.384..0.437] | 0.407 [0.380..0.434] | 0.384      | 0.437      | 1.072 [1.000..1.144] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 72.04 us  | 31.27 us | 0.435 [0.417..0.452] | 0.430 [0.412..0.449] | 0.417      | 0.452      | 1.043 [1.012..1.074] | -           | **faster** |
| G5 data-first filter                     | M    | high | 6.21 us   | 6.19 us  | 0.997 [0.993..1.000] | 0.994 [0.991..0.996] | 1.000      | 0.993      | 0.997 [0.993..1.000] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.58 us   | 5.58 us  | 1.000 [1.000..1.000] | 1.001 [1.001..1.001] | 1.000      | 1.000      | 1.000 [1.000..1.000] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.56 us   | 5.58 us  | 1.004 [1.000..1.008] | 1.001 [0.991..1.010] | 1.000      | 1.008      | 1.004 [1.000..1.007] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 102.04 us | 89.50 us | 0.879 [0.840..0.917] | 0.869 [0.831..0.907] | 0.840      | 0.917      | 1.063 [1.014..1.111] | -           | neutral    |
