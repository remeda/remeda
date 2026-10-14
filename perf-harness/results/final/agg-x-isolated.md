# One copy per process (headline)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                   | entry order         | runner   | source | pollution | node         | flags | scale | wall |
| --------------------- | ------------------- | -------- | ------ | --------- | ------------ | ----- | ----- | ---- |
| final/x-isolated-r0-a | main,branch,main-aa | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |
| final/x-isolated-r0-b | main,branch,main-aa | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |
| final/x-isolated-r1-a | branch,main-aa,main | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |
| final/x-isolated-r1-b | branch,main-aa,main | portable | dist   | P2        | node v26.9.0 | -     | 1     | 61 s |

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
| 1    | 64    | 0.013          | 0.071               | 0.119 | 16            | 0 (0.0%)    | 0               |
| 2    | 28    | 0.021          | 0.067               | 0.103 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts          | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | -------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.592 | faster 11, neutral 5 | 0.623 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa | 1.006 | neutral 16           | 0.999 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 1.23%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.592 | 0.623 | -     | -       |

## Tier 1: branch vs main (16 scenarios, weighted geomean 0.592, floor 0.071)

| scenario                                 | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | S    | high | 52.33 us  | 23.83 us  | 0.455 [0.454..0.463] | 0.455 [0.454..0.474] | 0.458      | 0.455      | 0.998 [0.986..1.008] | 0.067       | **faster** |
| G1 filter+map                            | C    | high | 279.56 us | 114.21 us | 0.409 [0.404..0.421] | 0.408 [0.405..0.415] | 0.412      | 0.409      | 1.002 [0.984..1.011] | 0.059       | **faster** |
| G1 map                                   | S    | high | 36.94 us  | 13.29 us  | 0.359 [0.355..0.362] | 0.358 [0.354..0.365] | 0.357      | 0.360      | 0.998 [0.996..1.002] | 0.074       | **faster** |
| G1 map                                   | C    | high | 207.75 us | 67.98 us  | 0.328 [0.318..0.346] | 0.328 [0.317..0.334] | 0.332      | 0.328      | 1.000 [0.983..1.014] | 0.068       | **faster** |
| G1 map+filter+map                        | S    | high | 79.52 us  | 30.96 us  | 0.391 [0.387..0.416] | 0.390 [0.386..0.399] | 0.401      | 0.391      | 1.001 [0.979..1.070] | 0.053       | **faster** |
| G1 map+filter+map                        | C    | high | 455.35 us | 158.27 us | 0.351 [0.347..0.362] | 0.352 [0.349..0.357] | 0.355      | 0.351      | 1.008 [0.992..1.013] | 0.059       | **faster** |
| G3 pipe(x, add(1))                       | x64  | high | 1.75 us   | 1.04 us   | 0.595 [0.595..0.634] | 0.614 [0.604..0.630] | 0.595      | 0.615      | 1.072 [1.000..1.119] | 0.036       | **faster** |
| G3 scalar arrows depth-3                 | x64  | high | 1.79 us   | 1.00 us   | 0.552 [0.535..0.558] | 0.538 [0.530..0.554] | 0.547      | 0.552      | 1.000 [0.977..1.023] | 0.046       | **faster** |
| G5 data-first filter                     | S    | high | 7.42 us   | 7.31 us   | 0.989 [0.961..1.023] | 0.988 [0.969..1.030] | 1.014      | 0.966      | 0.989 [0.978..1.017] | 0.348       | neutral    |
| G5 data-first filter                     | C    | high | 37.98 us  | 37.40 us  | 0.985 [0.977..0.999] | 0.982 [0.967..1.012] | 0.996      | 0.978      | 1.007 [0.995..1.013] | 0.283       | neutral    |
| G5 data-first map                        | S    | high | 7.50 us   | 7.46 us   | 0.987 [0.961..1.011] | 0.988 [0.956..1.017] | 1.008      | 0.964      | 0.975 [0.961..0.989] | 0.372       | neutral    |
| G5 data-first map                        | C    | high | 36.44 us  | 35.31 us  | 0.964 [0.941..1.052] | 0.955 [0.945..1.012] | 1.014      | 0.948      | 1.012 [0.954..1.093] | 0.391       | neutral    |
| G6 map(fn)(data)                         | S    | high | 9.27 us   | 7.79 us   | 0.847 [0.822..0.850] | 0.841 [0.819..0.849] | 0.849      | 0.834      | 0.986 [0.978..0.991] | 0.299       | **faster** |
| G6 map(fn)(data)                         | C    | high | 37.62 us  | 35.31 us  | 0.928 [0.908..0.956] | 0.916 [0.906..0.932] | 0.932      | 0.928      | 1.023 [1.009..1.036] | 0.378       | neutral    |
| G10 filter,map / sortBy / take / groupBy | S    | high | 98.94 us  | 58.29 us  | 0.595 [0.582..0.598] | 0.597 [0.589..0.599] | 0.597      | 0.588      | 1.015 [1.009..1.061] | 0.167       | **faster** |
| G10 filter,map / sortBy / take / groupBy | C    | high | 379.92 us | 201.60 us | 0.531 [0.520..0.538] | 0.535 [0.522..0.541] | 0.529      | 0.531      | 1.015 [0.982..1.050] | 0.125       | **faster** |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.623, floor 0.067)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 43.69 us | 17.56 us | 0.402 [0.399..0.421] | 0.403 [0.397..0.417] | 0.401      | 0.411      | 1.003 [0.966..1.103] | 0.066       | **faster** |
| G1 map                                   | M    | high | 31.79 us | 11.00 us | 0.346 [0.342..0.350] | 0.345 [0.340..0.348] | 0.344      | 0.349      | 1.002 [0.997..1.025] | 0.058       | **faster** |
| G1 map+filter+map                        | M    | high | 69.33 us | 24.46 us | 0.352 [0.337..0.357] | 0.349 [0.344..0.352] | 0.347      | 0.352      | 1.003 [0.957..1.022] | 0.071       | **faster** |
| G5 data-first filter                     | M    | high | 6.06 us  | 6.17 us  | 1.014 [0.993..1.021] | 1.009 [1.004..1.011] | 1.014      | 1.007      | 0.993 [0.966..1.020] | 0.302       | neutral    |
| G5 data-first map                        | M    | high | 5.50 us  | 5.50 us  | 1.000 [0.985..1.031] | 1.000 [0.983..1.034] | 0.996      | 1.012      | 0.993 [0.955..1.023] | 0.331       | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.54 us  | 5.52 us  | 0.993 [0.978..1.015] | 0.992 [0.970..1.010] | 0.993      | 0.997      | 0.996 [0.956..1.030] | 0.327       | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 97.23 us | 71.46 us | 0.736 [0.688..0.760] | 0.724 [0.683..0.750] | 0.713      | 0.747      | 1.001 [0.946..1.074] | 0.184       | **faster** |
