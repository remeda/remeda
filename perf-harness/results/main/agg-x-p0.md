# No pollution (P0)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run          | entry order         | runner | source | pollution | node    | flags | scale | wall |
| ------------ | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| main/x-p0-r0 | main,branch,main-aa | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |
| main/x-p0-r1 | branch,main-aa,main | vitest | dist   | P0        | v26.9.0 | -     | 1     | 91 s |

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
| 1    | 24    | 0.004          | 0.013               | 0.017 | 12            | 0 (0.0%)    | 0               |
| 2    | 42    | 0.007          | 0.130               | 0.154 | 21            | 0 (0.0%)    | 0               |
| 3    | 30    | 0.010          | 0.225               | 0.239 | 15            | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts                        | T2 gm | T2 verdicts          | T3 gm | T3 verdicts | bar violations |
| ------- | ----- | ---------------------------------- | ----- | -------------------- | ----- | ----------- | -------------- |
| branch  | 0.693 | faster 10, neutral 1, regression 1 | 0.712 | faster 16, neutral 5 | 0.608 | faster 15   | 1              |
| main-aa | 1.003 | neutral 12                         | 1.000 | neutral 21           | 1.011 | neutral 15  | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.59%, T2 0.50%, T3 2.12%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 1              | 0.693 | 0.712 | 0.608 | -       |

## Tier 1: branch vs main (12 scenarios, weighted geomean 0.693, floor 0.013)

Bar violations: G10 filter,map(pick) / groupBy / entries / map / fromEntries C (1.044).

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict        |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | -------------- |
| G1 3-step middle reads data                                                                 | C    | high | 277.63 us | 167.90 us | 0.605 [0.604..0.606] | 0.604 [0.601..0.606] | 0.604      | 0.606      | 1.006 [1.005..1.006] | -           | **faster**     |
| G1 filter+map                                                                               | C    | high | 150.81 us | 97.23 us  | 0.645 [0.643..0.647] | 0.644 [0.640..0.647] | 0.643      | 0.647      | 1.004 [0.996..1.013] | -           | **faster**     |
| G1 map                                                                                      | C    | high | 83.77 us  | 29.31 us  | 0.350 [0.348..0.351] | 0.348 [0.346..0.350] | 0.348      | 0.351      | 0.998 [0.997..1.000] | -           | **faster**     |
| G1 map reading data                                                                         | C    | high | 116.33 us | 59.98 us  | 0.516 [0.511..0.520] | 0.514 [0.511..0.518] | 0.511      | 0.520      | 1.000 [0.996..1.004] | -           | **faster**     |
| G1 map+filter+map                                                                           | C    | high | 280.42 us | 169.63 us | 0.605 [0.603..0.607] | 0.602 [0.600..0.605] | 0.603      | 0.607      | 1.010 [1.007..1.013] | -           | **faster**     |
| G1 map+unique                                                                               | C    | high | 331.62 us | 262.40 us | 0.791 [0.789..0.794] | 0.788 [0.787..0.789] | 0.794      | 0.789      | 0.998 [0.993..1.004] | -           | **faster**     |
| G1 uniqueBy                                                                                 | C    | high | 245.31 us | 171.81 us | 0.701 [0.682..0.719] | 0.699 [0.682..0.716] | 0.682      | 0.719      | 1.006 [0.999..1.013] | -           | **faster**     |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | high | 936.83 us | 951.02 us | 1.015 [1.013..1.017] | 1.015 [1.012..1.019] | 1.017      | 1.013      | 1.007 [1.007..1.007] | -           | neutral        |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | high | 202.23 us | 152.37 us | 0.753 [0.753..0.754] | 0.751 [0.750..0.753] | 0.753      | 0.754      | 1.001 [1.001..1.001] | -           | **faster**     |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | high | 547.58 us | 571.48 us | 1.044 [1.039..1.048] | 1.044 [1.039..1.049] | 1.048      | 1.039      | 1.008 [0.999..1.017] | -           | **regression** |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | high | 662.42 us | 614.69 us | 0.928 [0.922..0.934] | 0.927 [0.927..0.927] | 0.934      | 0.922      | 0.995 [0.991..1.000] | -           | **faster**     |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | high | 96.81 us  | 67.63 us  | 0.699 [0.692..0.705] | 0.696 [0.689..0.703] | 0.705      | 0.692      | 1.002 [1.000..1.004] | -           | **faster**     |

## Tier 2: branch vs main (21 scenarios, weighted geomean 0.712, floor 0.130)

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 3-step middle reads data                                                                 | M    | high | 42.31 us  | 25.00 us  | 0.591 [0.583..0.599] | 0.588 [0.581..0.595] | 0.599      | 0.583      | 0.992 [0.990..0.994] | -           | **faster** |
| G1 filter+first                                                                             | C    | mid  | 31.77 us  | 21.15 us  | 0.666 [0.664..0.667] | 0.666 [0.664..0.668] | 0.667      | 0.664      | 1.011 [1.003..1.019] | -           | **faster** |
| G1 filter+map                                                                               | M    | high | 22.98 us  | 14.46 us  | 0.629 [0.614..0.644] | 0.624 [0.608..0.640] | 0.644      | 0.614      | 1.005 [1.002..1.009] | -           | **faster** |
| G1 filter+map+take(10)                                                                      | C    | mid  | 43.27 us  | 34.37 us  | 0.794 [0.792..0.797] | 0.792 [0.788..0.797] | 0.797      | 0.792      | 1.004 [1.004..1.005] | -           | **faster** |
| G1 find early hit                                                                           | C    | mid  | 8.00 us   | 5.38 us   | 0.672 [0.667..0.677] | 0.675 [0.670..0.681] | 0.677      | 0.667      | 0.997 [0.995..1.000] | -           | **faster** |
| G1 find late hit                                                                            | C    | mid  | 105.54 us | 65.06 us  | 0.616 [0.599..0.634] | 0.621 [0.606..0.636] | 0.634      | 0.599      | 1.016 [1.012..1.019] | -           | **faster** |
| G1 find miss                                                                                | C    | mid  | 105.71 us | 63.06 us  | 0.596 [0.579..0.613] | 0.595 [0.581..0.610] | 0.613      | 0.579      | 0.986 [0.979..0.992] | -           | **faster** |
| G1 flat+map                                                                                 | C    | mid  | 228.98 us | 119.04 us | 0.520 [0.516..0.524] | 0.520 [0.516..0.524] | 0.524      | 0.516      | 0.997 [0.982..1.012] | -           | **faster** |
| G1 flatMap+filter+map                                                                       | C    | mid  | 775.06 us | 436.29 us | 0.563 [0.561..0.565] | 0.564 [0.563..0.565] | 0.565      | 0.561      | 1.001 [0.996..1.006] | -           | **faster** |
| G1 map                                                                                      | M    | high | 13.60 us  | 5.19 us   | 0.381 [0.380..0.383] | 0.372 [0.369..0.374] | 0.380      | 0.383      | 0.983 [0.973..0.994] | -           | **faster** |
| G1 map reading data                                                                         | M    | high | 18.38 us  | 9.92 us   | 0.540 [0.538..0.541] | 0.536 [0.535..0.537] | 0.538      | 0.541      | 0.995 [0.993..0.998] | -           | **faster** |
| G1 map+filter+map                                                                           | M    | high | 43.23 us  | 24.33 us  | 0.563 [0.557..0.569] | 0.555 [0.549..0.561] | 0.569      | 0.557      | 0.992 [0.983..1.001] | -           | **faster** |
| G1 map+unique                                                                               | M    | high | 51.31 us  | 37.50 us  | 0.731 [0.725..0.737] | 0.729 [0.724..0.734] | 0.737      | 0.725      | 1.001 [1.000..1.002] | -           | **faster** |
| G1 uniqueBy                                                                                 | M    | high | 36.37 us  | 22.62 us  | 0.623 [0.604..0.642] | 0.616 [0.607..0.625] | 0.604      | 0.642      | 0.996 [0.988..1.004] | -           | **faster** |
| G2 deep-15 mixed                                                                            | M    | high | 144.77 us | 153.79 us | 1.067 [1.000..1.133] | 1.059 [0.989..1.130] | 1.133      | 1.000      | 1.019 [0.885..1.154] | -           | neutral    |
| G2 deep-8 mixed                                                                             | M    | high | 87.56 us  | 92.15 us  | 1.058 [0.974..1.142] | 1.048 [0.971..1.124] | 1.142      | 0.974      | 1.010 [0.870..1.150] | -           | neutral    |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | high | 151.85 us | 156.60 us | 1.031 [1.030..1.032] | 1.025 [1.024..1.027] | 1.032      | 1.030      | 1.009 [1.007..1.011] | -           | neutral    |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | high | 40.85 us  | 33.04 us  | 0.809 [0.808..0.810] | 0.807 [0.806..0.808] | 0.810      | 0.808      | 0.997 [0.997..0.998] | -           | **faster** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | high | 78.48 us  | 80.65 us  | 1.028 [1.022..1.034] | 1.020 [1.011..1.029] | 1.034      | 1.022      | 0.994 [0.984..1.004] | -           | neutral    |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | high | 88.06 us  | 89.27 us  | 1.014 [1.013..1.015] | 1.008 [1.007..1.009] | 1.015      | 1.013      | 1.007 [1.007..1.007] | -           | neutral    |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | high | 1.56 us   | 1.08 us   | 0.694 [0.685..0.703] | 0.695 [0.694..0.696] | 0.703      | 0.685      | 1.000 [0.974..1.027] | -           | **faster** |

## Tier 3: branch vs main (15 scenarios, weighted geomean 0.608, floor 0.225)

| scenario                 | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------ | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 drop+take             | C    | low  | 111.46 us | 73.35 us  | 0.658 [0.652..0.665] | 0.655 [0.649..0.661]   | 0.665      | 0.652      | 1.009 [1.007..1.012] | -           | **faster** |
| G1 drop+take             | M    | low  | 16.77 us  | 10.02 us  | 0.598 [0.592..0.603] | 0.598 [0.594..0.601]   | 0.603      | 0.592      | 0.995 [0.993..0.997] | -           | **faster** |
| G1 filter+first          | M    | mid  | 1.06 us   | 646.0 ns  | 0.608 [0.600..0.616] | 0.603 [0.596..0.610] * | 0.610      | 0.596      | 1.008 [1.007..1.010] | -           | **faster** |
| G1 filter+map+take(10)   | M    | mid  | 708.5 ns  | 542.0 ns  | 0.765 [0.764..0.766] | 0.781 [0.774..0.787] * | 0.787      | 0.774      | 1.003 [0.997..1.009] | -           | **faster** |
| G1 find early hit        | M    | mid  | 416.5 ns  | 250.0 ns  | 0.600 [0.600..0.601] | 0.625 [0.611..0.639] * | 0.639      | 0.611      | 1.005 [1.000..1.011] | -           | **faster** |
| G1 find late hit         | M    | mid  | 16.08 us  | 9.38 us   | 0.583 [0.563..0.602] | 0.585 [0.567..0.603]   | 0.602      | 0.563      | 1.006 [1.005..1.008] | -           | **faster** |
| G1 find miss             | M    | mid  | 16.10 us  | 9.27 us   | 0.575 [0.561..0.589] | 0.577 [0.562..0.592]   | 0.589      | 0.561      | 0.999 [0.980..1.019] | -           | **faster** |
| G1 flat+map              | M    | mid  | 35.29 us  | 17.81 us  | 0.505 [0.498..0.512] | 0.500 [0.494..0.505]   | 0.512      | 0.498      | 1.006 [0.995..1.017] | -           | **faster** |
| G1 flatMap+filter+map    | M    | mid  | 119.42 us | 69.38 us  | 0.581 [0.580..0.582] | 0.578 [0.576..0.580]   | 0.580      | 0.582      | 1.002 [1.002..1.003] | -           | **faster** |
| G2 deep-15 flatMap-first | M    | high | 411.83 us | 246.79 us | 0.605 [0.550..0.659] | 0.593 [0.540..0.647]   | 0.659      | 0.550      | 1.036 [0.834..1.239] | -           | **faster** |
| G2 deep-15 object        | M    | high | 150.87 us | 91.44 us  | 0.612 [0.554..0.670] | 0.608 [0.550..0.666]   | 0.670      | 0.554      | 1.022 [0.817..1.227] | -           | **faster** |
| G2 deep-15 primitive     | M    | high | 158.65 us | 93.96 us  | 0.592 [0.591..0.593] | 0.585 [0.584..0.585]   | 0.591      | 0.593      | 0.994 [0.993..0.995] | -           | **faster** |
| G2 deep-8 flatMap-first  | M    | high | 267.35 us | 167.40 us | 0.632 [0.572..0.692] | 0.621 [0.565..0.677]   | 0.692      | 0.572      | 1.017 [0.834..1.199] | -           | **faster** |
| G2 deep-8 object         | M    | high | 100.81 us | 62.85 us  | 0.630 [0.568..0.691] | 0.612 [0.553..0.672]   | 0.691      | 0.568      | 1.019 [0.816..1.223] | -           | **faster** |
| G2 deep-8 primitive      | M    | high | 95.27 us  | 55.77 us  | 0.585 [0.577..0.593] | 0.575 [0.571..0.579]   | 0.577      | 0.593      | 1.002 [0.990..1.013] | -           | **faster** |
