# Scope-hoisted bundle

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run                       | entry order         | runner | source | pollution | node    | flags | scale | wall |
| ------------------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| publication/x-bundle-r0-a | main,branch,main-aa | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |
| publication/x-bundle-r0-b | main,branch,main-aa | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |
| publication/x-bundle-r1-a | branch,main-aa,main | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |
| publication/x-bundle-r1-b | branch,main-aa,main | vitest | bundle | P2        | v26.9.0 | -     | 1     | 44 s |

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
| 1    | 64    | 0.009          | 0.037               | 0.095 | 16            | 0 (0.0%)    | 0               |
| 2    | 28    | 0.007          | 0.017               | 0.020 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts          | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | -------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.599 | faster 12, neutral 4 | 0.613 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa | 1.001 | neutral 16           | 1.000 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.599 | 0.613 | -     | -       |

## Tier 1: branch vs main (16 scenarios, weighted geomean 0.599, floor 0.037)

| scenario                                 | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | S    | high | 51.35 us  | 24.17 us  | 0.471 [0.459..0.487] | 0.473 [0.460..0.481] | 0.480      | 0.463      | 0.994 [0.974..1.004] | -           | **faster** |
| G1 filter+map                            | C    | high | 284.25 us | 113.15 us | 0.397 [0.397..0.399] | 0.400 [0.399..0.403] | 0.397      | 0.398      | 0.994 [0.990..1.000] | -           | **faster** |
| G1 map                                   | S    | high | 36.90 us  | 13.15 us  | 0.356 [0.346..0.366] | 0.357 [0.347..0.364] | 0.364      | 0.349      | 0.988 [0.979..1.005] | -           | **faster** |
| G1 map                                   | C    | high | 208.27 us | 70.00 us  | 0.337 [0.332..0.342] | 0.337 [0.334..0.343] | 0.341      | 0.333      | 0.998 [0.992..1.002] | -           | **faster** |
| G1 map+filter+map                        | S    | high | 79.98 us  | 31.77 us  | 0.397 [0.391..0.407] | 0.397 [0.392..0.406] | 0.404      | 0.392      | 0.996 [0.988..1.021] | -           | **faster** |
| G1 map+filter+map                        | C    | high | 459.85 us | 159.21 us | 0.346 [0.344..0.349] | 0.347 [0.345..0.349] | 0.348      | 0.345      | 0.996 [0.992..1.001] | -           | **faster** |
| G3 pipe(x, add(1))                       | x64  | high | 1.81 us   | 1.08 us   | 0.598 [0.565..0.619] | 0.605 [0.569..0.618] | 0.612      | 0.578      | 1.046 [0.934..1.095] | -           | **faster** |
| G3 scalar arrows depth-3                 | x64  | high | 1.96 us   | 1.17 us   | 0.596 [0.587..0.596] | 0.586 [0.577..0.588] | 0.591      | 0.596      | 1.000 [0.979..1.000] | -           | **faster** |
| G5 data-first filter                     | S    | high | 7.21 us   | 7.19 us   | 0.997 [0.966..1.023] | 0.997 [0.963..1.030] | 0.969      | 1.023      | 1.006 [0.971..1.029] | -           | neutral    |
| G5 data-first filter                     | C    | high | 38.50 us  | 38.46 us  | 1.000 [0.999..1.015] | 1.000 [0.997..1.017] | 1.008      | 0.999      | 1.001 [0.992..1.015] | -           | neutral    |
| G5 data-first map                        | S    | high | 7.46 us   | 7.42 us   | 1.000 [0.989..1.006] | 1.006 [0.991..1.013] | 1.003      | 0.994      | 1.000 [1.000..1.011] | -           | neutral    |
| G5 data-first map                        | C    | high | 36.58 us  | 36.81 us  | 1.003 [0.988..1.010] | 1.003 [1.000..1.011] | 0.999      | 1.003      | 0.994 [0.978..1.006] | -           | neutral    |
| G6 map(fn)(data)                         | S    | high | 8.83 us   | 7.63 us   | 0.858 [0.856..0.868] | 0.854 [0.853..0.863] | 0.857      | 0.863      | 1.009 [1.005..1.014] | -           | **faster** |
| G6 map(fn)(data)                         | C    | high | 38.27 us  | 36.35 us  | 0.955 [0.937..0.972] | 0.948 [0.931..0.959] | 0.950      | 0.960      | 1.005 [0.987..1.012] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy | S    | high | 99.44 us  | 58.35 us  | 0.585 [0.577..0.615] | 0.592 [0.587..0.617] | 0.604      | 0.577      | 0.988 [0.961..1.028] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy | C    | high | 380.40 us | 201.00 us | 0.528 [0.517..0.537] | 0.531 [0.521..0.538] | 0.530      | 0.525      | 1.000 [0.971..1.021] | -           | **faster** |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.613, floor 0.017)

| scenario                                 | size | pop  | main     | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | -------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 43.00 us | 17.19 us | 0.400 [0.399..0.401] | 0.395 [0.393..0.396] | 0.401      | 0.400      | 1.003 [0.999..1.004] | -           | **faster** |
| G1 map                                   | M    | high | 32.12 us | 10.83 us | 0.337 [0.330..0.340] | 0.332 [0.327..0.335] | 0.340      | 0.332      | 1.002 [1.000..1.012] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 70.15 us | 23.94 us | 0.341 [0.336..0.347] | 0.338 [0.333..0.342] | 0.344      | 0.339      | 1.000 [0.982..1.007] | -           | **faster** |
| G5 data-first filter                     | M    | high | 6.31 us  | 6.25 us  | 0.990 [0.974..1.000] | 0.994 [0.980..0.998] | 0.993      | 0.984      | 0.997 [0.980..1.007] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.48 us  | 5.46 us  | 0.996 [0.993..1.008] | 1.002 [0.995..1.015] | 1.004      | 0.993      | 0.996 [0.992..1.015] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.50 us  | 5.44 us  | 0.985 [0.977..0.992] | 0.983 [0.972..1.002] | 0.992      | 0.977      | 0.996 [0.985..1.000] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 96.81 us | 70.54 us | 0.728 [0.721..0.741] | 0.716 [0.707..0.728] | 0.736      | 0.723      | 1.005 [0.989..1.009] | -           | **faster** |
