# Scope-hoisted bundle

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run              | entry order         | runner | source | pollution | node    | flags | scale | wall |
| ---------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| main/x-bundle-r0 | main,branch,main-aa | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |
| main/x-bundle-r1 | branch,main-aa,main | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |

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
| 1    | 32    | 0.010          | 0.045               | 0.068 | 16            | 0 (0.0%)    | 0               |
| 2    | 14    | 0.007          | 0.013               | 0.022 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts          | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | -------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.768 | faster 10, neutral 6 | 0.738 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa | 1.000 | neutral 16           | 0.999 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.768 | 0.738 | -     | -       |

## Tier 1: branch vs main (16 scenarios, weighted geomean 0.768, floor 0.045)

| scenario                                 | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | S    | high | 50.75 us  | 39.60 us  | 0.781 [0.764..0.798] | 0.777 [0.763..0.791] | 0.798      | 0.764      | 1.005 [0.988..1.023] | -           | **faster** |
| G1 filter+map                            | C    | high | 281.42 us | 195.94 us | 0.697 [0.683..0.710] | 0.693 [0.681..0.705] | 0.710      | 0.683      | 1.006 [0.995..1.017] | -           | **faster** |
| G1 map                                   | S    | high | 36.94 us  | 18.31 us  | 0.496 [0.480..0.512] | 0.495 [0.478..0.512] | 0.512      | 0.480      | 0.996 [0.986..1.007] | -           | **faster** |
| G1 map                                   | C    | high | 210.92 us | 92.81 us  | 0.440 [0.432..0.448] | 0.444 [0.438..0.450] | 0.448      | 0.432      | 0.999 [0.997..1.002] | -           | **faster** |
| G1 map+filter+map                        | S    | high | 80.67 us  | 43.90 us  | 0.544 [0.533..0.556] | 0.545 [0.533..0.557] | 0.556      | 0.533      | 0.999 [0.999..0.999] | -           | **faster** |
| G1 map+filter+map                        | C    | high | 458.21 us | 206.75 us | 0.451 [0.450..0.453] | 0.451 [0.448..0.453] | 0.453      | 0.450      | 0.986 [0.983..0.990] | -           | **faster** |
| G3 pipe(x, add(1))                       | x64  | high | 1.85 us   | 1.29 us   | 0.697 [0.689..0.705] | 0.713 [0.712..0.713] | 0.705      | 0.689      | 1.001 [0.933..1.068] | -           | **faster** |
| G3 scalar arrows depth-3                 | x64  | high | 1.96 us   | 1.83 us   | 0.936 [0.936..0.936] | 0.932 [0.930..0.934] | 0.936      | 0.936      | 1.000 [0.999..1.000] | -           | **faster** |
| G5 data-first filter                     | S    | high | 7.29 us   | 7.31 us   | 1.003 [0.994..1.011] | 1.002 [0.994..1.010] | 0.994      | 1.011      | 1.014 [1.011..1.017] | -           | neutral    |
| G5 data-first filter                     | C    | high | 38.90 us  | 38.79 us  | 0.997 [0.997..0.998] | 0.998 [0.997..0.998] | 0.997      | 0.998      | 0.989 [0.983..0.995] | -           | neutral    |
| G5 data-first map                        | S    | high | 7.42 us   | 7.48 us   | 1.009 [1.006..1.011] | 1.012 [1.007..1.016] | 1.011      | 1.006      | 1.003 [0.995..1.011] | -           | neutral    |
| G5 data-first map                        | C    | high | 36.29 us  | 36.50 us  | 1.006 [0.990..1.022] | 1.001 [0.988..1.013] | 1.022      | 0.990      | 1.005 [0.994..1.016] | -           | neutral    |
| G6 map(fn)(data)                         | S    | high | 8.85 us   | 8.92 us   | 1.007 [1.005..1.010] | 1.007 [1.001..1.013] | 1.005      | 1.010      | 1.000 [1.000..1.000] | -           | neutral    |
| G6 map(fn)(data)                         | C    | high | 38.23 us  | 38.73 us  | 1.013 [0.996..1.031] | 1.012 [0.996..1.029] | 0.996      | 1.031      | 1.004 [0.995..1.014] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | S    | high | 98.83 us  | 87.04 us  | 0.881 [0.866..0.896] | 0.884 [0.866..0.903] | 0.896      | 0.866      | 0.999 [0.990..1.007] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy | C    | high | 386.21 us | 323.06 us | 0.837 [0.819..0.854] | 0.834 [0.818..0.850] | 0.819      | 0.854      | 0.995 [0.972..1.017] | -           | **faster** |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.738, floor 0.013)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 42.79 us | 29.29 us | 0.685 [0.681..0.688] | 0.683 [0.679..0.688] | 0.688      | 0.681      | 0.997 [0.993..1.000] | -           | **faster** |
| G1 map                                   | M    | high | 32.23 us | 14.00 us | 0.434 [0.431..0.438] | 0.432 [0.428..0.436] | 0.438      | 0.431      | 1.005 [1.003..1.008] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 70.15 us | 31.00 us | 0.442 [0.438..0.446] | 0.438 [0.434..0.442] | 0.446      | 0.438      | 0.993 [0.978..1.008] | -           | **faster** |
| G5 data-first filter                     | M    | high | 6.21 us  | 6.21 us  | 1.000 [1.000..1.000] | 0.999 [0.995..1.004] | 1.000      | 1.000      | 1.000 [0.993..1.007] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.50 us  | 5.48 us  | 0.996 [0.993..1.000] | 0.997 [0.989..1.004] | 0.993      | 1.000      | 1.000 [0.992..1.007] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.58 us  | 5.56 us  | 0.996 [0.993..1.000] | 0.995 [0.989..1.001] | 1.000      | 0.993      | 0.996 [0.993..1.000] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 96.83 us | 88.58 us | 0.915 [0.912..0.917] | 0.902 [0.896..0.907] | 0.912      | 0.917      | 1.004 [1.000..1.009] | -           | **faster** |
