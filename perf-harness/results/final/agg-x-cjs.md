# CJS through require

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run              | entry order         | runner | source | pollution | node    | flags | scale | wall |
| ---------------- | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| final/x-cjs-r0-a | main,branch,main-aa | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |
| final/x-cjs-r0-b | main,branch,main-aa | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |
| final/x-cjs-r1-a | branch,main-aa,main | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |
| final/x-cjs-r1-b | branch,main-aa,main | vitest | cjs    | P2        | v26.9.0 | -     | 1     | 44 s |

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
| 1    | 64    | 0.011          | 0.161               | 0.195 | 16            | 0 (0.0%)    | 0               |
| 2    | 28    | 0.013          | 0.162               | 0.196 | 7             | 0 (0.0%)    | 0               |
| 3    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts          | T2 gm | T2 verdicts         | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | -------------------- | ----- | ------------------- | ----- | ----------- | -------------- |
| branch  | 0.598 | faster 10, neutral 6 | 0.595 | faster 4, neutral 3 | -     | -           | 0              |
| main-aa | 1.032 | neutral 16           | 1.037 | neutral 7           | -     | -           | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 6.56%, T2 7.49%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | 0.598 | 0.595 | -     | -       |

## Tier 1: branch vs main (16 scenarios, weighted geomean 0.598, floor 0.161)

| scenario                                 | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | S    | high | 55.85 us  | 25.48 us  | 0.458 [0.426..0.509] | 0.458 [0.426..0.506] | 0.426      | 0.499      | 1.084 [0.995..1.164] | -           | **faster** |
| G1 filter+map                            | C    | high | 309.67 us | 114.50 us | 0.370 [0.333..0.415] | 0.368 [0.336..0.413] | 0.337      | 0.407      | 1.085 [0.992..1.185] | -           | **faster** |
| G1 map                                   | S    | high | 39.08 us  | 13.77 us  | 0.353 [0.321..0.374] | 0.352 [0.322..0.368] | 0.330      | 0.371      | 1.059 [0.990..1.095] | -           | **faster** |
| G1 map                                   | C    | high | 224.42 us | 69.12 us  | 0.308 [0.285..0.326] | 0.309 [0.286..0.328] | 0.289      | 0.323      | 1.053 [1.000..1.110] | -           | **faster** |
| G1 map+filter+map                        | S    | high | 84.17 us  | 34.08 us  | 0.404 [0.388..0.436] | 0.408 [0.392..0.435] | 0.390      | 0.427      | 1.026 [0.988..1.062] | -           | **faster** |
| G1 map+filter+map                        | C    | high | 481.67 us | 162.42 us | 0.335 [0.326..0.355] | 0.338 [0.326..0.356] | 0.326      | 0.350      | 1.016 [0.995..1.067] | -           | **faster** |
| G3 pipe(x, add(1))                       | x64  | high | 1.88 us   | 1.21 us   | 0.652 [0.541..0.781] | 0.645 [0.537..0.766] | 0.541      | 0.771      | 1.071 [1.000..1.195] | -           | **faster** |
| G3 scalar arrows depth-3                 | x64  | high | 1.92 us   | 1.17 us   | 0.609 [0.587..0.617] | 0.582 [0.576..0.603] | 0.613      | 0.598      | 1.011 [1.000..1.021] | -           | **faster** |
| G5 data-first filter                     | S    | high | 7.17 us   | 7.46 us   | 1.041 [1.029..1.046] | 1.042 [1.025..1.044] | 1.035      | 1.044      | 0.997 [0.983..1.012] | -           | neutral    |
| G5 data-first filter                     | C    | high | 38.58 us  | 38.56 us  | 1.003 [0.977..1.017] | 1.002 [0.981..1.013] | 0.997      | 1.003      | 1.002 [0.976..1.032] | -           | neutral    |
| G5 data-first map                        | S    | high | 7.42 us   | 7.71 us   | 1.037 [1.034..1.051] | 1.044 [1.043..1.047] | 1.042      | 1.037      | 1.003 [1.000..1.006] | -           | neutral    |
| G5 data-first map                        | C    | high | 37.25 us  | 36.46 us  | 0.982 [0.967..1.008] | 0.995 [0.990..1.007] | 0.982      | 0.987      | 0.976 [0.953..1.004] | -           | neutral    |
| G6 map(fn)(data)                         | S    | high | 8.98 us   | 8.33 us   | 0.926 [0.888..0.967] | 0.922 [0.889..0.969] | 0.891      | 0.962      | 1.019 [0.995..1.038] | -           | neutral    |
| G6 map(fn)(data)                         | C    | high | 38.67 us  | 37.02 us  | 0.957 [0.941..0.964] | 0.955 [0.942..0.965] | 0.953      | 0.957      | 1.009 [0.999..1.020] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | S    | high | 106.23 us | 61.48 us  | 0.580 [0.549..0.630] | 0.582 [0.550..0.631] | 0.554      | 0.616      | 1.048 [1.006..1.135] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy | C    | high | 415.65 us | 207.79 us | 0.502 [0.466..0.535] | 0.502 [0.467..0.539] | 0.468      | 0.534      | 1.065 [0.996..1.149] | -           | **faster** |

## Tier 2: branch vs main (7 scenarios, weighted geomean 0.595, floor 0.162)

| scenario                                 | size | pop  | main      | branch   | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ---------------------------------------- | ---- | ---- | --------- | -------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                            | M    | high | 47.38 us  | 17.46 us | 0.371 [0.342..0.412] | 0.365 [0.337..0.404] | 0.344      | 0.404      | 1.098 [1.000..1.196] | -           | **faster** |
| G1 map                                   | M    | high | 34.46 us  | 10.54 us | 0.307 [0.285..0.333] | 0.302 [0.279..0.326] | 0.287      | 0.329      | 1.085 [1.014..1.132] | -           | **faster** |
| G1 map+filter+map                        | M    | high | 72.90 us  | 23.90 us | 0.327 [0.310..0.345] | 0.323 [0.304..0.340] | 0.313      | 0.342      | 1.036 [1.004..1.065] | -           | **faster** |
| G5 data-first filter                     | M    | high | 6.21 us   | 6.23 us  | 1.003 [0.993..1.013] | 1.002 [0.994..1.012] | 1.010      | 0.997      | 1.003 [0.987..1.014] | -           | neutral    |
| G5 data-first map                        | M    | high | 5.48 us   | 5.48 us  | 1.000 [0.992..1.000] | 1.003 [1.001..1.008] | 1.000      | 0.996      | 0.996 [0.985..1.000] | -           | neutral    |
| G6 map(fn)(data)                         | M    | high | 5.56 us   | 5.54 us  | 0.996 [0.992..1.000] | 1.006 [0.984..1.012] | 0.996      | 0.996      | 0.996 [0.993..1.000] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy | M    | high | 102.33 us | 72.52 us | 0.709 [0.676..0.754] | 0.701 [0.674..0.741] | 0.682      | 0.743      | 1.048 [0.994..1.104] | -           | **faster** |
