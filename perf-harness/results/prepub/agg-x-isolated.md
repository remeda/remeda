# cand-full vs main, one copy per process

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                  | entry order                     | runner   | source | pollution | node         | flags | scale | wall |
| -------------------- | ------------------------------- | -------- | ------ | --------- | ------------ | ----- | ----- | ---- |
| prepub/x-isolated-r0 | main,branch-v-cand-full,main-aa | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |
| prepub/x-isolated-r1 | branch-v-cand-full,main-aa,main | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |

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
| 1    | 32    | 0.012          | 0.035               | 0.044 | 16            | 0 (0.0%)    | 0               |
| 2    | 14    | 0.012          | 0.051               | 0.065 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy               | T1 gm | T1 verdicts          | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------------------ | ----- | -------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch-v-cand-full | 0.595 | faster 11, neutral 5 | 0.608 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa            | 1.000 | neutral 16           | 0.985 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 2.99%, T3 0.50%).

| rank | copy               | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------------------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch-v-cand-full | 0              | 0.595 | 0.608 | -     | -       |

## Tier 1: branch-v-cand-full vs main (16 scenarios, weighted geomean 0.595, floor 0.035)

| scenario                                 | size | pop  | main      | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | S    | high | 52.69 us  | 24.63 us           | 0.467 [0.463..0.472] | 0.466 [0.463..0.469] | 0.472      | 0.463      | 1.012 [0.998..1.027] | 0.065       | **faster** |
| G1 filter+map                            | C    | high | 280.94 us | 113.83 us          | 0.405 [0.405..0.406] | 0.406 [0.405..0.407] | 0.405      | 0.406      | 1.011 [1.005..1.018] | 0.059       | **faster** |
| G1 map                                   | S    | high | 37.23 us  | 13.40 us           | 0.360 [0.357..0.363] | 0.360 [0.358..0.362] | 0.357      | 0.363      | 1.003 [0.997..1.010] | 0.073       | **faster** |
| G1 map                                   | C    | high | 207.62 us | 69.06 us           | 0.333 [0.326..0.339] | 0.332 [0.323..0.340] | 0.326      | 0.339      | 1.009 [0.993..1.025] | 0.069       | **faster** |
| G1 map+filter+map                        | S    | high | 80.21 us  | 32.44 us           | 0.404 [0.404..0.405] | 0.403 [0.403..0.403] | 0.405      | 0.404      | 1.009 [0.996..1.022] | 0.051       | **faster** |
| G1 map+filter+map                        | C    | high | 453.35 us | 160.44 us          | 0.354 [0.351..0.357] | 0.352 [0.350..0.354] | 0.351      | 0.357      | 1.025 [1.010..1.040] | 0.058       | **faster** |
| G3 pipe(x, add(1))                       | x64  | high | 1.73 us   | 1.04 us            | 0.603 [0.595..0.610] | 0.611 [0.610..0.611] | 0.595      | 0.610      | 1.024 [1.023..1.024] | 0.024       | **faster** |
| G3 scalar arrows depth-3                 | x64  | high | 1.83 us   | 1000.0 ns          | 0.546 [0.546..0.546] | 0.533 [0.531..0.535] | 0.546      | 0.546      | 0.978 [0.978..0.978] | 0.045       | **faster** |
| G5 data-first filter                     | S    | high | 7.33 us   | 7.27 us            | 0.992 [0.977..1.006] | 0.989 [0.975..1.004] | 0.977      | 1.006      | 1.009 [1.000..1.017] | 0.341       | neutral    |
| G5 data-first filter                     | C    | high | 38.35 us  | 37.90 us           | 0.988 [0.975..1.001] | 0.979 [0.966..0.992] | 0.975      | 1.001      | 0.992 [0.981..1.004] | 0.290       | neutral    |
| G5 data-first map                        | S    | high | 7.46 us   | 7.40 us            | 0.992 [0.983..1.000] | 0.994 [0.989..1.000] | 0.983      | 1.000      | 0.997 [0.989..1.005] | 0.371       | neutral    |
| G5 data-first map                        | C    | high | 36.54 us  | 35.94 us           | 0.984 [0.964..1.003] | 0.982 [0.974..0.990] | 1.003      | 0.964      | 0.975 [0.956..0.994] | 0.392       | neutral    |
| G6 map(fn)(data)                         | S    | high | 9.25 us   | 7.75 us            | 0.838 [0.833..0.842] | 0.837 [0.835..0.838] | 0.833      | 0.842      | 0.996 [0.991..1.000] | 0.300       | **faster** |
| G6 map(fn)(data)                         | C    | high | 37.96 us  | 35.38 us           | 0.932 [0.885..0.979] | 0.931 [0.892..0.970] | 0.885      | 0.979      | 0.985 [0.968..1.002] | 0.378       | neutral    |
| G10 filter,map / sortBy / take / groupBy | S    | high | 99.75 us  | 59.23 us           | 0.594 [0.592..0.595] | 0.595 [0.594..0.597] | 0.592      | 0.595      | 0.997 [0.985..1.008] | 0.167       | **faster** |
| G10 filter,map / sortBy / take / groupBy | C    | high | 385.62 us | 203.29 us          | 0.527 [0.523..0.532] | 0.530 [0.528..0.532] | 0.532      | 0.523      | 0.985 [0.984..0.987] | 0.123       | **faster** |

## Tier 2: branch-v-cand-full vs main (7 scenarios, weighted geomean 0.608, floor 0.051)

| scenario                                 | size | pop  | main     | branch-v-cand-full | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | ------------------ | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 43.81 us | 17.38 us           | 0.397 [0.394..0.399] | 0.392 [0.390..0.394] | 0.394      | 0.399      | 0.995 [0.985..1.006] | 0.065       | **faster** |
| G1 map                                   | M    | high | 32.23 us | 11.04 us           | 0.343 [0.342..0.343] | 0.338 [0.337..0.338] | 0.342      | 0.343      | 1.010 [0.999..1.021] | 0.058       | **faster** |
| G1 map+filter+map                        | M    | high | 69.81 us | 24.44 us           | 0.350 [0.346..0.354] | 0.345 [0.343..0.348] | 0.346      | 0.354      | 1.002 [1.001..1.004] | 0.072       | **faster** |
| G5 data-first filter                     | M    | high | 6.19 us  | 6.04 us            | 0.976 [0.973..0.980] | 0.973 [0.970..0.977] | 0.973      | 0.980      | 0.966 [0.966..0.966] | 0.296       | neutral    |
| G5 data-first map                        | M    | high | 5.65 us  | 5.52 us            | 0.978 [0.971..0.985] | 0.976 [0.975..0.976] | 0.985      | 0.971      | 0.967 [0.956..0.978] | 0.336       | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.71 us  | 5.48 us            | 0.960 [0.957..0.963] | 0.952 [0.945..0.959] | 0.963      | 0.957      | 0.964 [0.935..0.993] | 0.328       | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 97.83 us | 68.90 us           | 0.704 [0.687..0.721] | 0.712 [0.699..0.725] | 0.721      | 0.687      | 0.994 [0.992..0.997] | 0.185       | **faster** |
