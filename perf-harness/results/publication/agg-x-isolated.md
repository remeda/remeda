# One copy per process (headline)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                         | entry order         | runner   | source | pollution | node         | flags | scale | wall |
| --------------------------- | ------------------- | -------- | ------ | --------- | ------------ | ----- | ----- | ---- |
| publication/x-isolated-r0-a | main,branch,main-aa | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |
| publication/x-isolated-r0-b | main,branch,main-aa | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |
| publication/x-isolated-r1-a | branch,main-aa,main | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |
| publication/x-isolated-r1-b | branch,main-aa,main | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |

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
| 1    | 64    | 0.011          | 0.044               | 0.073 | 16            | 0 (0.0%)    | 0               |
| 2    | 28    | 0.012          | 0.045               | 0.051 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts          | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | -------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.599 | faster 12, neutral 4 | 0.616 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa | 1.003 | neutral 16           | 0.991 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.53%, T2 1.89%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.599 | 0.616 | -     | -       |

## Tier 1: branch vs main (16 scenarios, weighted geomean 0.599, floor 0.044)

| scenario                                 | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | S    | high | 52.15 us  | 24.52 us  | 0.468 [0.458..0.482] | 0.467 [0.460..0.480] | 0.473      | 0.465      | 1.002 [0.966..1.032] | 0.066       | **faster** |
| G1 filter+map                            | C    | high | 278.25 us | 113.88 us | 0.406 [0.398..0.418] | 0.408 [0.400..0.417] | 0.409      | 0.405      | 1.017 [0.954..1.044] | 0.059       | **faster** |
| G1 map                                   | S    | high | 36.90 us  | 13.52 us  | 0.365 [0.363..0.368] | 0.365 [0.362..0.370] | 0.367      | 0.364      | 1.003 [0.985..1.027] | 0.075       | **faster** |
| G1 map                                   | C    | high | 207.83 us | 69.19 us  | 0.335 [0.326..0.338] | 0.333 [0.331..0.340] | 0.332      | 0.335      | 0.998 [0.980..1.014] | 0.068       | **faster** |
| G1 map+filter+map                        | S    | high | 79.48 us  | 32.37 us  | 0.407 [0.405..0.410] | 0.408 [0.405..0.410] | 0.408      | 0.407      | 1.007 [0.987..1.024] | 0.052       | **faster** |
| G1 map+filter+map                        | C    | high | 455.73 us | 159.54 us | 0.350 [0.347..0.352] | 0.351 [0.349..0.354] | 0.351      | 0.349      | 0.992 [0.984..1.013] | 0.058       | **faster** |
| G3 pipe(x, add(1))                       | x64  | high | 1.71 us   | 1.04 us   | 0.610 [0.568..0.610] | 0.611 [0.584..0.616] | 0.589      | 0.610      | 1.036 [1.000..1.073] | 0.049       | **faster** |
| G3 scalar arrows depth-3                 | x64  | high | 1.81 us   | 1.00 us   | 0.552 [0.546..0.558] | 0.550 [0.540..0.554] | 0.552      | 0.552      | 1.000 [1.000..1.023] | 0.046       | **faster** |
| G5 data-first filter                     | S    | high | 7.31 us   | 7.35 us   | 1.012 [0.989..1.023] | 1.010 [0.986..1.025] | 1.020      | 0.997      | 1.011 [1.006..1.017] | 0.354       | neutral    |
| G5 data-first filter                     | C    | high | 38.23 us  | 37.92 us  | 0.997 [0.983..1.004] | 0.991 [0.982..1.009] | 0.987      | 1.003      | 0.999 [0.985..1.002] | 0.282       | neutral    |
| G5 data-first map                        | S    | high | 7.42 us   | 7.52 us   | 1.014 [1.000..1.134] | 1.017 [1.009..1.120] | 1.006      | 1.076      | 0.997 [0.989..1.006] | 0.376       | neutral    |
| G5 data-first map                        | C    | high | 35.85 us  | 35.13 us  | 0.976 [0.927..1.043] | 0.972 [0.947..1.021] | 0.965      | 0.996      | 0.991 [0.990..1.026] | 0.396       | neutral    |
| G6 map(fn)(data)                         | S    | high | 9.23 us   | 7.85 us   | 0.851 [0.846..0.910] | 0.847 [0.843..0.906] | 0.850      | 0.879      | 0.998 [0.986..1.000] | 0.302       | **faster** |
| G6 map(fn)(data)                         | C    | high | 37.96 us  | 34.48 us  | 0.916 [0.894..0.974] | 0.923 [0.893..0.950] | 0.908      | 0.942      | 1.002 [0.960..1.015] | 0.377       | **faster** |
| G10 filter,map / sortBy / take / groupBy | S    | high | 100.44 us | 59.15 us  | 0.590 [0.577..0.603] | 0.595 [0.586..0.603] | 0.594      | 0.586      | 0.991 [0.964..1.021] | 0.167       | **faster** |
| G10 filter,map / sortBy / take / groupBy | C    | high | 378.87 us | 203.04 us | 0.536 [0.519..0.540] | 0.537 [0.521..0.541] | 0.527      | 0.539      | 0.997 [0.984..1.005] | 0.124       | **faster** |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.616, floor 0.045)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 43.67 us | 17.52 us | 0.401 [0.397..0.404] | 0.397 [0.392..0.402] | 0.401      | 0.400      | 0.999 [0.988..1.016] | 0.064       | **faster** |
| G1 map                                   | M    | high | 31.98 us | 11.12 us | 0.347 [0.343..0.354] | 0.343 [0.338..0.350] | 0.347      | 0.349      | 1.009 [0.992..1.012] | 0.059       | **faster** |
| G1 map+filter+map                        | M    | high | 70.31 us | 24.52 us | 0.349 [0.346..0.352] | 0.347 [0.345..0.351] | 0.347      | 0.352      | 0.988 [0.978..1.009] | 0.072       | **faster** |
| G5 data-first filter                     | M    | high | 6.21 us  | 6.17 us  | 0.993 [0.960..1.042] | 0.994 [0.970..1.047] | 0.967      | 1.028      | 0.990 [0.974..1.007] | 0.285       | neutral    |
| G5 data-first map                        | M    | high | 5.62 us  | 5.54 us  | 0.985 [0.957..1.062] | 0.988 [0.966..1.057] | 0.964      | 1.031      | 0.978 [0.949..1.015] | 0.334       | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.69 us  | 5.54 us  | 0.975 [0.943..1.277] | 0.973 [0.955..1.221] | 0.953      | 1.131      | 0.975 [0.950..1.023] | 0.332       | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 97.88 us | 71.23 us | 0.728 [0.717..0.731] | 0.719 [0.714..0.722] | 0.729      | 0.723      | 0.997 [0.978..1.005] | 0.183       | **faster** |
