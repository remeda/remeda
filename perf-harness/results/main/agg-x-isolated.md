# One copy per process (headline)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                | entry order         | runner   | source | pollution | node         | flags | scale | wall |
| ------------------ | ------------------- | -------- | ------ | --------- | ------------ | ----- | ----- | ---- |
| main/x-isolated-r0 | main,branch,main-aa | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |
| main/x-isolated-r1 | branch,main-aa,main | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |

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
| 1    | 32    | 0.009          | 0.040               | 0.087 | 16            | 0 (0.0%)    | 0               |
| 2    | 14    | 0.009          | 0.032               | 0.036 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts                       | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | --------------------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.780 | faster 9, regression 1, neutral 6 | 0.745 | faster 4, neutral 3 | -     | -           | 1              |
| main-aa | 1.003 | neutral 16                        | 0.997 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.54%, T2 0.51%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 1              | 0.780 | 0.745 | -     | -       |

## Tier 1: branch vs main (16 scenarios, weighted geomean 0.780, floor 0.040)

Bar violations: G3 scalar arrows depth-3 x64 (1.045).

| scenario                                 | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict        |
| ---------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | -------------- |
| G1 filter+map                            | S    | high | 52.15 us  | 41.69 us  | 0.799 [0.791..0.808] | 0.796 [0.787..0.806] | 0.808      | 0.791      | 1.015 [1.010..1.020] | 0.066       | **faster**     |
| G1 filter+map                            | C    | high | 280.35 us | 197.08 us | 0.703 [0.675..0.732] | 0.702 [0.677..0.727] | 0.675      | 0.732      | 1.024 [1.015..1.033] | 0.059       | **faster**     |
| G1 map                                   | S    | high | 37.29 us  | 19.21 us  | 0.515 [0.514..0.516] | 0.511 [0.509..0.512] | 0.516      | 0.514      | 1.007 [1.003..1.010] | 0.075       | **faster**     |
| G1 map                                   | C    | high | 209.90 us | 92.35 us  | 0.440 [0.434..0.446] | 0.442 [0.432..0.452] | 0.434      | 0.446      | 1.003 [0.996..1.010] | 0.068       | **faster**     |
| G1 map+filter+map                        | S    | high | 79.98 us  | 44.40 us  | 0.555 [0.552..0.558] | 0.554 [0.550..0.558] | 0.552      | 0.558      | 1.012 [1.005..1.020] | 0.053       | **faster**     |
| G1 map+filter+map                        | C    | high | 461.94 us | 211.23 us | 0.457 [0.451..0.464] | 0.457 [0.452..0.463] | 0.451      | 0.464      | 1.004 [0.997..1.010] | 0.056       | **faster**     |
| G3 pipe(x, add(1))                       | x64  | high | 1.88 us   | 1.42 us   | 0.756 [0.739..0.772] | 0.767 [0.748..0.786] | 0.772      | 0.739      | 0.945 [0.913..0.977] | 0.033       | **faster**     |
| G3 scalar arrows depth-3                 | x64  | high | 1.83 us   | 1.92 us   | 1.045 [1.045..1.045] | 1.027 [1.024..1.030] | 1.045      | 1.045      | 1.000 [1.000..1.000] | 0.045       | **regression** |
| G5 data-first filter                     | S    | high | 7.33 us   | 7.27 us   | 0.992 [0.966..1.017] | 0.990 [0.973..1.006] | 1.017      | 0.966      | 1.017 [1.006..1.029] | 0.361       | neutral        |
| G5 data-first filter                     | C    | high | 38.42 us  | 38.27 us  | 0.996 [0.991..1.001] | 0.999 [0.998..0.999] | 0.991      | 1.001      | 1.006 [1.003..1.009] | 0.281       | neutral        |
| G5 data-first map                        | S    | high | 7.46 us   | 7.40 us   | 0.992 [0.961..1.023] | 0.993 [0.968..1.018] | 1.023      | 0.961      | 0.981 [0.951..1.011] | 0.372       | neutral        |
| G5 data-first map                        | C    | high | 36.23 us  | 35.54 us  | 0.981 [0.963..1.000] | 1.001 [0.985..1.016] | 0.963      | 1.000      | 1.013 [0.999..1.028] | 0.396       | neutral        |
| G6 map(fn)(data)                         | S    | high | 9.23 us   | 9.23 us   | 1.000 [0.991..1.009] | 1.001 [0.993..1.008] | 1.009      | 0.991      | 0.996 [0.991..1.000] | 0.303       | neutral        |
| G6 map(fn)(data)                         | C    | high | 38.21 us  | 37.48 us  | 0.981 [0.961..1.001] | 0.990 [0.984..0.995] | 0.961      | 1.001      | 1.013 [0.995..1.031] | 0.374       | neutral        |
| G10 filter,map / sortBy / take / groupBy | S    | high | 100.75 us | 90.71 us  | 0.900 [0.896..0.905] | 0.901 [0.897..0.905] | 0.896      | 0.905      | 1.006 [0.997..1.016] | 0.165       | **faster**     |
| G10 filter,map / sortBy / take / groupBy | C    | high | 385.46 us | 331.27 us | 0.860 [0.838..0.881] | 0.855 [0.834..0.877] | 0.838      | 0.881      | 1.005 [1.005..1.005] | 0.122       | **faster**     |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.745, floor 0.032)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 44.04 us | 30.92 us | 0.702 [0.700..0.704] | 0.700 [0.698..0.701] | 0.704      | 0.700      | 0.998 [0.992..1.005] | 0.065       | **faster** |
| G1 map                                   | M    | high | 32.06 us | 14.10 us | 0.440 [0.437..0.443] | 0.436 [0.433..0.440] | 0.437      | 0.443      | 1.005 [1.001..1.009] | 0.060       | **faster** |
| G1 map+filter+map                        | M    | high | 69.50 us | 31.75 us | 0.457 [0.452..0.461] | 0.453 [0.448..0.457] | 0.452      | 0.461      | 1.010 [1.010..1.010] | 0.075       | **faster** |
| G5 data-first filter                     | M    | high | 6.13 us  | 6.02 us  | 0.984 [0.954..1.014] | 0.987 [0.961..1.013] | 1.014      | 0.954      | 1.001 [0.973..1.028] | 0.303       | neutral    |
| G5 data-first map                        | M    | high | 5.63 us  | 5.58 us  | 0.993 [0.985..1.000] | 0.992 [0.984..1.000] | 0.985      | 1.000      | 0.985 [0.971..1.000] | 0.341       | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.71 us  | 5.65 us  | 0.989 [0.985..0.993] | 0.985 [0.978..0.991] | 0.993      | 0.985      | 0.982 [0.964..1.000] | 0.339       | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 98.25 us | 91.65 us | 0.933 [0.931..0.935] | 0.928 [0.925..0.931] | 0.931      | 0.935      | 1.001 [0.992..1.011] | 0.185       | **faster** |
