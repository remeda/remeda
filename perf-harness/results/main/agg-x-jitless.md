# Interpreter only (--jitless)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run               | entry order         | runner | source | pollution | node    | flags     | scale | wall  |
| ----------------- | ------------------- | ------ | ------ | --------- | ------- | --------- | ----- | ----- |
| main/x-jitless-r0 | main,branch,main-aa | vitest | dist   | P2        | v26.9.0 | --jitless | 1     | 121 s |
| main/x-jitless-r1 | branch,main-aa,main | vitest | dist   | P2        | v26.9.0 | --jitless | 1     | 121 s |

Popularity: research/popularity.json.

Tier overrides (tier-overrides.json; research/popularity.json is untouched):

| function   | kinds      | sizes | tier | scenarios changed here                                                                                                                                                                                                                                                                                                                                                                                  | reason                                                                                                                                                                                                                      |
| ---------- | ---------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| difference | data-first | all   | 1    | 8: G5 data-first difference XS (2 -> 1); G5 data-first difference S (2 -> 1); G5 data-first difference C (2 -> 1); G5 data-first difference M (3 -> 1); G5 data-first difference(range) (adopter shape) XS (2 -> 1); G5 data-first difference(range) (adopter shape) S (2 -> 1); G5 data-first difference(range) (adopter shape) C (2 -> 1); G5 data-first difference(range) (adopter shape) M (3 -> 1) | Biggest adopter: @prisma/dev (29M downloads/month, 62% of remeda's own) calls only difference and range, both data-first (difference(range(a, b), used)); difference's mid popularity would otherwise drop these to tier 2. |
| range      | data-first | all   | 1    | 3: G7 range data-first XS (2 -> 1); G7 range data-first S (2 -> 1); G7 range data-first C (2 -> 1)                                                                                                                                                                                                                                                                                                      | The other half of the same @prisma/dev call (range data-first); range's mid popularity would otherwise drop it to tier 2.                                                                                                   |

Lower JIT tier runs (--jitless / --max-opt): every scenario is reported as tier 3.

## A/A noise floors and false-call rate

Floor: p95 of |main-aa/main - 1| over the tier's (scenario, run) pairs. False calls: the tier's verdict rule applied to main-aa vs main (anything but neutral is a false call; bar = regression or BLOCK).

| tier | pairs | median abs dev | p95 abs dev (floor) | max   | A/A scenarios | false calls | false bar calls |
| ---- | ----- | -------------- | ------------------- | ----- | ------------- | ----------- | --------------- |
| 1    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |
| 2    | 0     | -              | -                   | -     | 0             | 0 (-)       | 0               |
| 3    | 128   | 0.004          | 0.015               | 0.047 | 64            | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts | T2 gm | T2 verdicts | T3 gm | T3 verdicts           | bar violations |
| ------- | ----- | ----------- | ----- | ----------- | ----- | --------------------- | -------------- |
| branch  | -     | -           | -     | -           | 0.724 | faster 30, neutral 34 | 0              |
| main-aa | -     | -           | -     | -           | 1.001 | neutral 64            | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.50%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 0              | -     | -     | 0.724 | -       |

## Tier 3: branch vs main (64 scenarios, weighted geomean 0.724, floor 0.015)

| scenario                                        | size | pop            | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ----------------------------------------------- | ---- | -------------- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 filter+map                                   | S    | high           | 370.23 us | 218.50 us | 0.590 [0.584..0.596] | 0.590 [0.585..0.595] | 0.596      | 0.584      | 1.004 [1.001..1.008] | -           | **faster** |
| G1 filter+map                                   | C    | high           | 2.10 ms   | 1.10 ms   | 0.525 [0.519..0.532] | 0.529 [0.523..0.534] | 0.532      | 0.519      | 0.993 [0.978..1.009] | -           | **faster** |
| G1 filter+map                                   | M    | high           | 318.94 us | 168.31 us | 0.528 [0.526..0.530] | 0.526 [0.524..0.528] | 0.530      | 0.526      | 1.001 [0.997..1.004] | -           | **faster** |
| G1 map                                          | S    | high           | 274.35 us | 91.15 us  | 0.332 [0.329..0.336] | 0.332 [0.329..0.335] | 0.336      | 0.329      | 0.997 [0.991..1.002] | -           | **faster** |
| G1 map                                          | C    | high           | 1.57 ms   | 462.33 us | 0.295 [0.293..0.296] | 0.294 [0.292..0.296] | 0.296      | 0.293      | 0.996 [0.992..1.000] | -           | **faster** |
| G1 map                                          | M    | high           | 239.63 us | 69.02 us  | 0.288 [0.287..0.289] | 0.288 [0.287..0.289] | 0.289      | 0.287      | 1.005 [0.995..1.014] | -           | **faster** |
| G1 map+filter+map                               | S    | high           | 600.94 us | 316.21 us | 0.526 [0.524..0.528] | 0.524 [0.522..0.526] | 0.528      | 0.524      | 1.000 [0.994..1.007] | -           | **faster** |
| G1 map+filter+map                               | C    | high           | 3.48 ms   | 1.64 ms   | 0.471 [0.471..0.472] | 0.472 [0.472..0.472] | 0.472      | 0.471      | 1.001 [0.995..1.007] | -           | **faster** |
| G1 map+filter+map                               | M    | high           | 529.54 us | 247.00 us | 0.466 [0.466..0.467] | 0.464 [0.463..0.465] | 0.467      | 0.466      | 1.000 [0.996..1.004] | -           | **faster** |
| G3 pipe(x, add(1))                              | x64  | high           | 12.27 us  | 9.50 us   | 0.774 [0.770..0.778] | 0.778 [0.771..0.785] | 0.778      | 0.770      | 0.997 [0.990..1.003] | -           | **faster** |
| G3 scalar arrows depth-3                        | x64  | high           | 14.21 us  | 14.56 us  | 1.025 [1.023..1.026] | 1.024 [1.022..1.026] | 1.023      | 1.026      | 0.998 [0.997..1.000] | -           | neutral    |
| G5 data-first difference                        | XS   | mid (override) | 218.69 us | 119.27 us | 0.545 [0.541..0.550] | 0.541 [0.538..0.545] | 0.550      | 0.541      | 1.009 [1.003..1.016] | -           | **faster** |
| G5 data-first difference                        | S    | mid (override) | 281.92 us | 113.54 us | 0.403 [0.402..0.403] | 0.403 [0.402..0.404] | 0.402      | 0.403      | 0.997 [0.997..0.998] | -           | **faster** |
| G5 data-first difference                        | C    | mid (override) | 1.59 ms   | 604.40 us | 0.381 [0.378..0.383] | 0.380 [0.378..0.382] | 0.378      | 0.383      | 1.000 [0.997..1.003] | -           | **faster** |
| G5 data-first difference                        | M    | mid (override) | 236.21 us | 81.40 us  | 0.345 [0.343..0.346] | 0.344 [0.342..0.345] | 0.343      | 0.346      | 0.997 [0.996..0.997] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | XS   | mid (override) | 277.29 us | 163.75 us | 0.591 [0.590..0.591] | 0.590 [0.590..0.591] | 0.591      | 0.590      | 0.999 [0.996..1.001] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | S    | mid (override) | 345.12 us | 177.08 us | 0.513 [0.511..0.516] | 0.512 [0.510..0.514] | 0.516      | 0.511      | 1.004 [1.003..1.004] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | C    | mid (override) | 1.91 ms   | 930.10 us | 0.488 [0.486..0.490] | 0.487 [0.486..0.489] | 0.486      | 0.490      | 1.002 [1.001..1.003] | -           | **faster** |
| G5 data-first difference(range) (adopter shape) | M    | mid (override) | 290.13 us | 139.08 us | 0.479 [0.475..0.484] | 0.481 [0.477..0.485] | 0.484      | 0.475      | 0.993 [0.986..1.000] | -           | **faster** |
| G5 data-first filter                            | XS   | high           | 30.46 us  | 29.96 us  | 0.984 [0.984..0.984] | 0.983 [0.983..0.984] | 0.984      | 0.984      | 0.997 [0.996..0.997] | -           | neutral    |
| G5 data-first filter                            | S    | high           | 20.21 us  | 20.19 us  | 0.999 [0.996..1.002] | 0.999 [0.998..1.001] | 1.002      | 0.996      | 1.006 [1.004..1.008] | -           | neutral    |
| G5 data-first filter                            | C    | high           | 92.15 us  | 92.56 us  | 1.005 [1.002..1.007] | 1.008 [1.001..1.014] | 1.007      | 1.002      | 1.003 [0.998..1.008] | -           | neutral    |
| G5 data-first filter                            | M    | high           | 12.63 us  | 12.63 us  | 1.000 [0.997..1.003] | 0.996 [0.990..1.001] | 0.997      | 1.003      | 0.998 [0.987..1.010] | -           | neutral    |
| G5 data-first map                               | XS   | high           | 28.79 us  | 28.25 us  | 0.981 [0.974..0.988] | 0.982 [0.977..0.988] | 0.974      | 0.988      | 0.998 [0.990..1.006] | -           | neutral    |
| G5 data-first map                               | S    | high           | 17.90 us  | 18.19 us  | 1.016 [0.993..1.040] | 1.001 [0.995..1.007] | 1.040      | 0.993      | 1.020 [0.993..1.047] | -           | neutral    |
| G5 data-first map                               | C    | high           | 77.60 us  | 77.69 us  | 1.001 [0.990..1.012] | 0.997 [0.986..1.008] | 0.990      | 1.012      | 1.006 [0.998..1.015] | -           | neutral    |
| G5 data-first map                               | M    | high           | 11.23 us  | 11.25 us  | 1.002 [0.993..1.011] | 1.001 [0.992..1.009] | 1.011      | 0.993      | 0.996 [0.993..1.000] | -           | neutral    |
| G5 data-first unique                            | XS   | high           | 205.06 us | 86.00 us  | 0.419 [0.413..0.425] | 0.421 [0.415..0.427] | 0.413      | 0.425      | 0.997 [0.988..1.007] | -           | **faster** |
| G5 data-first unique                            | S    | high           | 292.29 us | 114.58 us | 0.392 [0.391..0.393] | 0.392 [0.391..0.394] | 0.391      | 0.393      | 1.002 [1.000..1.003] | -           | **faster** |
| G5 data-first unique                            | C    | high           | 1.64 ms   | 634.60 us | 0.387 [0.386..0.389] | 0.387 [0.385..0.389] | 0.386      | 0.389      | 1.000 [0.998..1.001] | -           | **faster** |
| G5 data-first uniqueBy                          | XS   | high           | 217.33 us | 113.38 us | 0.522 [0.520..0.523] | 0.522 [0.520..0.523] | 0.520      | 0.523      | 1.006 [0.997..1.015] | -           | **faster** |
| G5 data-first uniqueBy                          | S    | high           | 310.96 us | 148.54 us | 0.478 [0.475..0.481] | 0.475 [0.471..0.478] | 0.475      | 0.481      | 1.001 [0.995..1.006] | -           | **faster** |
| G5 data-first uniqueBy                          | C    | high           | 1.74 ms   | 804.04 us | 0.462 [0.458..0.466] | 0.461 [0.456..0.465] | 0.458      | 0.466      | 1.002 [1.000..1.003] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | XS   | high           | 218.71 us | 129.31 us | 0.591 [0.590..0.593] | 0.592 [0.591..0.594] | 0.590      | 0.593      | 1.006 [0.998..1.015] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | S    | high           | 315.63 us | 167.96 us | 0.532 [0.532..0.533] | 0.532 [0.532..0.532] | 0.532      | 0.533      | 1.003 [1.000..1.006] | -           | **faster** |
| G5 data-first uniqueBy (reads data)             | C    | high           | 1.77 ms   | 922.65 us | 0.523 [0.522..0.523] | 0.522 [0.520..0.524] | 0.522      | 0.523      | 1.002 [0.998..1.007] | -           | **faster** |
| G6 map(fn)(data)                                | S    | high           | 22.92 us  | 22.85 us  | 0.997 [0.991..1.004] | 0.998 [0.990..1.006] | 1.004      | 0.991      | 1.003 [0.996..1.009] | -           | neutral    |
| G6 map(fn)(data)                                | C    | high           | 82.27 us  | 82.31 us  | 1.001 [0.996..1.005] | 1.000 [0.996..1.005] | 1.005      | 0.996      | 1.003 [0.996..1.011] | -           | neutral    |
| G6 map(fn)(data)                                | M    | high           | 11.31 us  | 11.33 us  | 1.002 [1.000..1.004] | 1.001 [0.994..1.007] | 1.000      | 1.004      | 1.002 [1.000..1.004] | -           | neutral    |
| G7 entries data-first                           | XS   | high           | 23.29 us  | 22.58 us  | 0.970 [0.962..0.977] | 0.970 [0.964..0.977] | 0.977      | 0.962      | 0.996 [0.993..0.998] | -           | neutral    |
| G7 entries data-first                           | S    | high           | 8.08 us   | 7.98 us   | 0.987 [0.984..0.990] | 0.987 [0.980..0.994] | 0.990      | 0.984      | 1.000 [0.995..1.005] | -           | neutral    |
| G7 entries data-first                           | C    | high           | 22.17 us  | 21.85 us  | 0.986 [0.983..0.989] | 0.987 [0.985..0.989] | 0.983      | 0.989      | 1.000 [0.998..1.002] | -           | neutral    |
| G7 groupBy data-first                           | XS   | high           | 71.92 us  | 70.90 us  | 0.986 [0.984..0.987] | 0.984 [0.979..0.988] | 0.987      | 0.984      | 1.002 [0.999..1.004] | -           | neutral    |
| G7 groupBy data-first                           | S    | high           | 65.31 us  | 65.06 us  | 0.996 [0.994..0.999] | 0.996 [0.994..0.998] | 0.999      | 0.994      | 1.004 [1.000..1.008] | -           | neutral    |
| G7 groupBy data-first                           | C    | high           | 310.27 us | 310.81 us | 1.002 [1.001..1.002] | 1.002 [1.001..1.003] | 1.002      | 1.001      | 1.007 [1.005..1.010] | -           | neutral    |
| G7 isDeepEqual data-first                       | XS   | high           | 110.46 us | 109.85 us | 0.995 [0.989..1.000] | 0.992 [0.989..0.996] | 1.000      | 0.989      | 1.004 [1.001..1.006] | -           | neutral    |
| G7 isDeepEqual data-first                       | S    | high           | 136.15 us | 135.90 us | 0.998 [0.997..1.000] | 0.998 [0.997..1.000] | 1.000      | 0.997      | 0.998 [0.995..1.002] | -           | neutral    |
| G7 isDeepEqual data-first                       | C    | high           | 1.05 ms   | 1.05 ms   | 0.998 [0.993..1.002] | 0.997 [0.993..1.001] | 1.002      | 0.993      | 0.999 [0.993..1.005] | -           | neutral    |
| G7 mapValues data-first                         | XS   | high           | 76.23 us  | 75.81 us  | 0.995 [0.988..1.001] | 0.995 [0.988..1.002] | 1.001      | 0.988      | 0.999 [0.998..0.999] | -           | neutral    |
| G7 mapValues data-first                         | S    | high           | 119.52 us | 119.81 us | 1.002 [0.993..1.012] | 1.003 [0.994..1.011] | 1.012      | 0.993      | 0.997 [0.993..1.001] | -           | neutral    |
| G7 mapValues data-first                         | C    | high           | 877.27 us | 881.21 us | 1.005 [0.995..1.014] | 1.007 [1.001..1.013] | 1.014      | 0.995      | 0.997 [0.992..1.002] | -           | neutral    |
| G7 omit data-first                              | XS   | high           | 69.92 us  | 68.42 us  | 0.979 [0.973..0.984] | 0.979 [0.975..0.984] | 0.984      | 0.973      | 0.997 [0.995..1.000] | -           | neutral    |
| G7 omit data-first                              | S    | high           | 47.19 us  | 46.29 us  | 0.981 [0.975..0.987] | 0.982 [0.978..0.986] | 0.987      | 0.975      | 1.000 [0.998..1.003] | -           | neutral    |
| G7 omit data-first                              | C    | high           | 224.37 us | 234.56 us | 1.046 [1.033..1.058] | 1.039 [1.028..1.050] | 1.058      | 1.033      | 1.006 [0.990..1.021] | -           | neutral    |
| G7 pick data-first                              | XS   | high           | 46.19 us  | 45.60 us  | 0.987 [0.986..0.988] | 0.992 [0.986..0.997] | 0.988      | 0.986      | 0.994 [0.990..0.997] | -           | neutral    |
| G7 pick data-first                              | S    | high           | 15.04 us  | 14.90 us  | 0.990 [0.986..0.994] | 0.990 [0.986..0.995] | 0.994      | 0.986      | 0.996 [0.992..1.000] | -           | neutral    |
| G7 pick data-first                              | C    | high           | 20.65 us  | 20.44 us  | 0.990 [0.988..0.992] | 0.990 [0.989..0.992] | 0.988      | 0.992      | 0.999 [0.998..1.000] | -           | neutral    |
| G7 range data-first                             | XS   | mid (override) | 60.52 us  | 59.10 us  | 0.977 [0.969..0.984] | 0.978 [0.971..0.985] | 0.984      | 0.969      | 1.002 [0.997..1.008] | -           | neutral    |
| G7 range data-first                             | S    | mid (override) | 47.42 us  | 47.27 us  | 0.997 [0.990..1.004] | 0.997 [0.991..1.003] | 1.004      | 0.990      | 1.004 [1.002..1.005] | -           | neutral    |
| G7 range data-first                             | C    | mid (override) | 218.19 us | 218.48 us | 1.001 [0.996..1.007] | 1.001 [0.995..1.006] | 1.007      | 0.996      | 1.001 [0.998..1.003] | -           | neutral    |
| G7 sortBy data-first                            | S    | high           | 113.54 us | 113.88 us | 1.003 [1.000..1.005] | 1.003 [1.001..1.005] | 1.005      | 1.000      | 1.004 [1.003..1.004] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy        | S    | high           | 580.67 us | 399.60 us | 0.688 [0.687..0.689] | 0.686 [0.684..0.689] | 0.689      | 0.687      | 1.006 [1.000..1.012] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy        | C    | high           | 2.45 ms   | 1.50 ms   | 0.614 [0.613..0.615] | 0.612 [0.612..0.613] | 0.613      | 0.615      | 1.011 [1.008..1.013] | -           | **faster** |
| G10 filter,map / sortBy / take / groupBy        | M    | high           | 486.37 us | 344.83 us | 0.709 [0.705..0.713] | 0.705 [0.701..0.709] | 0.705      | 0.713      | 1.003 [1.002..1.005] | -           | **faster** |
