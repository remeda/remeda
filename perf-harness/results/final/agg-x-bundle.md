# Scope-hoisted bundle

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                 | entry order         | runner | source | pollution | node    | flags | scale | wall |
| ------------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| final/x-bundle-r0-a | main,branch,main-aa | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |
| final/x-bundle-r0-b | main,branch,main-aa | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |
| final/x-bundle-r1-a | branch,main-aa,main | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |
| final/x-bundle-r1-b | branch,main-aa,main | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |

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
| 1    | 64    | 0.006          | 0.032               | 0.095 | 16            | 0 (0.0%)    | 0               |
| 2    | 28    | 0.007          | 0.014               | 0.016 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts          | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | -------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.596 | faster 12, neutral 4 | 0.612 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa | 0.999 | neutral 16           | 0.997 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.61%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.596 | 0.612 | -     | -       |

## Tier 1: branch vs main (16 scenarios, weighted geomean 0.596, floor 0.032)

| scenario                                 | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | S    | high | 50.79 us  | 23.33 us  | 0.461 [0.452..0.467] | 0.462 [0.450..0.466] | 0.464      | 0.456      | 0.989 [0.981..0.996] | -           | **faster** |
| G1 filter+map                            | C    | high | 280.65 us | 111.90 us | 0.399 [0.396..0.401] | 0.400 [0.398..0.402] | 0.397      | 0.401      | 0.991 [0.984..1.007] | -           | **faster** |
| G1 map                                   | S    | high | 36.58 us  | 12.83 us  | 0.350 [0.338..0.361] | 0.350 [0.338..0.359] | 0.359      | 0.341      | 0.985 [0.967..1.028] | -           | **faster** |
| G1 map                                   | C    | high | 206.62 us | 69.40 us  | 0.336 [0.330..0.339] | 0.337 [0.331..0.338] | 0.338      | 0.332      | 1.000 [0.977..1.009] | -           | **faster** |
| G1 map+filter+map                        | S    | high | 80.27 us  | 30.52 us  | 0.382 [0.373..0.386] | 0.383 [0.376..0.387] | 0.384      | 0.377      | 0.996 [0.981..1.004] | -           | **faster** |
| G1 map+filter+map                        | C    | high | 456.48 us | 158.08 us | 0.345 [0.339..0.348] | 0.344 [0.342..0.349] | 0.347      | 0.341      | 0.999 [0.986..1.000] | -           | **faster** |
| G3 pipe(x, add(1))                       | x64  | high | 1.85 us   | 1.08 us   | 0.587 [0.578..0.614] | 0.597 [0.572..0.615] | 0.587      | 0.596      | 1.023 [1.000..1.095] | -           | **faster** |
| G3 scalar arrows depth-3                 | x64  | high | 1.92 us   | 1.17 us   | 0.609 [0.587..0.617] | 0.588 [0.584..0.589] | 0.598      | 0.612      | 1.011 [0.999..1.043] | -           | **faster** |
| G5 data-first filter                     | S    | high | 7.25 us   | 7.27 us   | 1.003 [0.977..1.029] | 1.006 [0.983..1.028] | 0.986      | 1.020      | 1.000 [0.983..1.029] | -           | neutral    |
| G5 data-first filter                     | C    | high | 38.58 us  | 38.65 us  | 1.001 [0.996..1.014] | 0.996 [0.981..1.016] | 1.005      | 1.001      | 0.994 [0.992..1.001] | -           | neutral    |
| G5 data-first map                        | S    | high | 7.42 us   | 7.46 us   | 1.006 [1.000..1.023] | 1.007 [0.998..1.019] | 1.014      | 1.003      | 1.006 [0.994..1.029] | -           | neutral    |
| G5 data-first map                        | C    | high | 36.54 us  | 36.40 us  | 1.002 [0.983..1.018] | 1.001 [0.992..1.014] | 0.992      | 1.010      | 0.998 [0.991..1.021] | -           | neutral    |
| G6 map(fn)(data)                         | S    | high | 8.90 us   | 7.58 us   | 0.857 [0.846..0.867] | 0.850 [0.839..0.860] | 0.848      | 0.865      | 1.002 [0.995..1.009] | -           | **faster** |
| G6 map(fn)(data)                         | C    | high | 38.29 us  | 36.15 us  | 0.945 [0.930..0.958] | 0.944 [0.929..0.958] | 0.935      | 0.954      | 1.001 [0.988..1.017] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy | S    | high | 99.56 us  | 57.85 us  | 0.581 [0.576..0.583] | 0.589 [0.587..0.593] | 0.583      | 0.577      | 0.995 [0.960..1.000] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy | C    | high | 379.23 us | 199.81 us | 0.526 [0.522..0.536] | 0.531 [0.527..0.536] | 0.530      | 0.525      | 0.998 [0.994..1.002] | -           | **faster** |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.612, floor 0.014)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 42.56 us | 17.08 us | 0.400 [0.396..0.403] | 0.396 [0.393..0.399] | 0.400      | 0.400      | 0.990 [0.984..1.008] | -           | **faster** |
| G1 map                                   | M    | high | 32.23 us | 10.79 us | 0.334 [0.332..0.339] | 0.329 [0.328..0.335] | 0.334      | 0.336      | 0.999 [0.990..1.003] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 70.02 us | 23.81 us | 0.340 [0.339..0.341] | 0.336 [0.335..0.337] | 0.340      | 0.340      | 0.996 [0.991..0.998] | -           | **faster** |
| G5 data-first filter                     | M    | high | 6.31 us  | 6.21 us  | 0.984 [0.980..0.987] | 0.988 [0.978..0.993] | 0.987      | 0.980      | 0.997 [0.987..1.007] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.44 us  | 5.44 us  | 1.004 [1.000..1.008] | 1.002 [1.000..1.006] | 1.000      | 1.008      | 1.000 [0.992..1.008] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.52 us  | 5.46 us  | 0.989 [0.985..0.992] | 0.990 [0.974..1.000] | 0.985      | 0.992      | 0.996 [0.985..1.008] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 96.10 us | 70.06 us | 0.727 [0.718..0.734] | 0.717 [0.713..0.723] | 0.726      | 0.727      | 1.000 [0.991..1.006] | -           | **faster** |
