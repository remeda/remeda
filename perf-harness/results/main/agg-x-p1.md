# Map/filter/find/take over 10 item shapes (P1)

Ratios are copy/main (< 1 = faster than main). Cells show `median [min..max]` across runs; times are the median across runs of each entry's p75. Each scenario is judged on its p75 ratio, or on its mean ratio when main or branch has a p75 under 1 us (marked `*`).

| run          | entry order         | runner | source | pollution | node    | flags | scale | wall |
| ------------ | ------------------- | ------ | ------ | --------- | ------- | ----- | ----- | ---- |
| main/x-p1-r0 | main,branch,main-aa | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |
| main/x-p1-r1 | branch,main-aa,main | vitest | dist   | P1        | v26.9.0 | -     | 1     | 91 s |

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
| 1    | 24    | 0.007          | 0.022               | 0.029 | 12            | 0 (0.0%)    | 0               |
| 2    | 42    | 0.004          | 0.022               | 0.038 | 21            | 0 (0.0%)    | 0               |
| 3    | 30    | 0.008          | 0.024               | 0.026 | 15            | 0 (0.0%)    | 0               |

## Overview (popularity-weighted geomean of the median ratio, verdict counts)

Weights: high 4, mid 2, low 1.

| copy    | T1 gm | T1 verdicts                       | T2 gm | T2 verdicts                        | T3 gm | T3 verdicts         | bar violations |
| ------- | ----- | --------------------------------- | ----- | ---------------------------------- | ----- | ------------------- | -------------- |
| branch  | 0.823 | faster 8, neutral 3, regression 1 | 0.849 | faster 12, neutral 6, regression 3 | 0.798 | slower 4, faster 11 | 4              |
| main-aa | 1.001 | neutral 12                        | 1.002 | neutral 21                         | 1.004 | neutral 15          | 0              |

## Lexicographic comparison

Tier 1 first (any tier 1 regression fails the candidate), then the popularity-weighted geomeans of tier 1, 2, 3, each deciding only when two candidates differ by more than the tier's tolerance (twice the A/A geomean deviation, at least 0.5%: T1 0.50%, T2 0.50%, T3 0.79%).

| rank | copy   | T1 regressions | T1 gm | T2 gm | T3 gm | vs next |
| ---- | ------ | -------------- | ----- | ----- | ----- | ------- |
| 1    | branch | 1              | 0.823 | 0.849 | 0.798 | -       |

## Tier 1: branch vs main (12 scenarios, weighted geomean 0.823, floor 0.022)

Bar violations: G10 filter,map / sortBy / take / groupBy C (1.107).

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict        |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | -------------- |
| G1 3-step middle reads data                                                                 | C    | high | 271.52 us | 219.08 us | 0.807 [0.806..0.808] | 0.806 [0.805..0.806] | 0.806      | 0.808      | 1.007 [0.998..1.017] | -           | **faster**     |
| G1 filter+map                                                                               | C    | high | 166.73 us | 162.23 us | 0.973 [0.961..0.986] | 0.966 [0.957..0.975] | 0.986      | 0.961      | 1.020 [1.019..1.021] | -           | neutral        |
| G1 map                                                                                      | C    | high | 121.23 us | 63.88 us  | 0.527 [0.522..0.531] | 0.519 [0.516..0.523] | 0.531      | 0.522      | 1.004 [1.002..1.005] | -           | **faster**     |
| G1 map reading data                                                                         | C    | high | 126.79 us | 72.48 us  | 0.572 [0.571..0.573] | 0.572 [0.572..0.573] | 0.573      | 0.571      | 1.000 [0.996..1.004] | -           | **faster**     |
| G1 map+filter+map                                                                           | C    | high | 281.19 us | 172.13 us | 0.612 [0.609..0.616] | 0.608 [0.605..0.611] | 0.609      | 0.616      | 1.001 [1.000..1.002] | -           | **faster**     |
| G1 map+unique                                                                               | C    | high | 331.02 us | 259.90 us | 0.785 [0.785..0.785] | 0.782 [0.781..0.782] | 0.785      | 0.785      | 1.001 [0.999..1.002] | -           | **faster**     |
| G1 uniqueBy                                                                                 | C    | high | 246.21 us | 237.52 us | 0.965 [0.961..0.968] | 0.963 [0.962..0.965] | 0.961      | 0.968      | 0.990 [0.989..0.990] | -           | **faster**     |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | C    | high | 936.81 us | 957.65 us | 1.022 [1.020..1.024] | 1.023 [1.020..1.026] | 1.024      | 1.020      | 1.012 [1.009..1.015] | -           | neutral        |
| G10 filter,map / sortBy / take / groupBy                                                    | C    | high | 228.35 us | 252.87 us | 1.107 [1.105..1.109] | 1.111 [1.110..1.111] | 1.105      | 1.109      | 0.981 [0.971..0.990] | -           | **regression** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | C    | high | 555.81 us | 577.44 us | 1.039 [1.014..1.065] | 1.042 [1.026..1.058] | 1.014      | 1.065      | 0.995 [0.979..1.012] | -           | neutral        |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | C    | high | 661.58 us | 610.67 us | 0.923 [0.921..0.925] | 0.918 [0.916..0.921] | 0.925      | 0.921      | 1.009 [0.995..1.023] | -           | **faster**     |
| G10 prop / filter,map,take / reverse / map / length                                         | C    | high | 98.08 us  | 79.08 us  | 0.806 [0.802..0.810] | 0.801 [0.796..0.806] | 0.802      | 0.810      | 0.998 [0.997..0.999] | -           | **faster**     |

## Tier 2: branch vs main (21 scenarios, weighted geomean 0.849, floor 0.022)

Bar violations: G2 deep-15 mixed M (1.127); G2 deep-8 mixed M (1.115); G10 filter,map / sortBy / take / groupBy M (1.146).

| scenario                                                                                    | size | pop  | main      | branch    | ratio p75            | ratio mean           | copy first | main first | main-aa/main         | native/main | verdict        |
| ------------------------------------------------------------------------------------------- | ---- | ---- | --------- | --------- | -------------------- | -------------------- | ---------- | ---------- | -------------------- | ----------- | -------------- |
| G1 3-step middle reads data                                                                 | M    | high | 41.48 us  | 32.50 us  | 0.783 [0.766..0.800] | 0.778 [0.763..0.792] | 0.800      | 0.766      | 1.011 [1.001..1.022] | -           | **faster**     |
| G1 filter+first                                                                             | C    | mid  | 31.21 us  | 24.77 us  | 0.794 [0.785..0.803] | 0.788 [0.783..0.794] | 0.803      | 0.785      | 1.001 [0.997..1.005] | -           | **faster**     |
| G1 filter+map                                                                               | M    | high | 25.00 us  | 24.73 us  | 0.989 [0.947..1.032] | 0.981 [0.939..1.024] | 1.032      | 0.947      | 1.020 [1.002..1.038] | -           | neutral        |
| G1 filter+map+take(10)                                                                      | C    | mid  | 43.23 us  | 41.38 us  | 0.957 [0.950..0.964] | 0.951 [0.946..0.956] | 0.964      | 0.950      | 1.006 [1.000..1.012] | -           | neutral        |
| G1 find early hit                                                                           | C    | mid  | 8.35 us   | 6.42 us   | 0.768 [0.761..0.775] | 0.763 [0.757..0.770] | 0.761      | 0.775      | 0.993 [0.985..1.000] | -           | **faster**     |
| G1 find late hit                                                                            | C    | mid  | 104.83 us | 83.90 us  | 0.800 [0.796..0.805] | 0.798 [0.795..0.801] | 0.796      | 0.805      | 1.002 [1.001..1.002] | -           | **faster**     |
| G1 find miss                                                                                | C    | mid  | 102.94 us | 83.17 us  | 0.808 [0.794..0.821] | 0.797 [0.796..0.798] | 0.821      | 0.794      | 1.022 [1.021..1.024] | -           | **faster**     |
| G1 flat+map                                                                                 | C    | mid  | 228.90 us | 128.88 us | 0.563 [0.563..0.563] | 0.562 [0.560..0.563] | 0.563      | 0.563      | 1.003 [1.000..1.006] | -           | **faster**     |
| G1 flatMap+filter+map                                                                       | C    | mid  | 783.23 us | 577.81 us | 0.738 [0.734..0.742] | 0.734 [0.731..0.738] | 0.742      | 0.734      | 0.992 [0.988..0.996] | -           | **faster**     |
| G1 map                                                                                      | M    | high | 19.02 us  | 10.04 us  | 0.528 [0.519..0.537] | 0.520 [0.509..0.531] | 0.537      | 0.519      | 1.000 [1.000..1.000] | -           | **faster**     |
| G1 map reading data                                                                         | M    | high | 20.10 us  | 12.40 us  | 0.617 [0.609..0.624] | 0.613 [0.604..0.622] | 0.624      | 0.609      | 0.999 [0.998..1.000] | -           | **faster**     |
| G1 map+filter+map                                                                           | M    | high | 43.02 us  | 25.73 us  | 0.598 [0.590..0.606] | 0.591 [0.584..0.598] | 0.590      | 0.606      | 0.999 [0.996..1.003] | -           | **faster**     |
| G1 map+unique                                                                               | M    | high | 51.98 us  | 39.52 us  | 0.760 [0.743..0.777] | 0.757 [0.739..0.775] | 0.777      | 0.743      | 1.006 [1.002..1.009] | -           | **faster**     |
| G1 uniqueBy                                                                                 | M    | high | 37.88 us  | 37.27 us  | 0.982 [0.952..1.012] | 0.983 [0.955..1.011] | 1.012      | 0.952      | 0.992 [0.989..0.995] | -           | neutral        |
| G2 deep-15 mixed                                                                            | M    | high | 136.12 us | 153.35 us | 1.127 [1.126..1.127] | 1.113 [1.111..1.115] | 1.126      | 1.127      | 1.004 [1.004..1.005] | -           | **regression** |
| G2 deep-8 mixed                                                                             | M    | high | 82.50 us  | 91.96 us  | 1.115 [1.115..1.115] | 1.112 [1.109..1.115] | 1.115      | 1.115      | 0.994 [0.990..0.998] | -           | **regression** |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | M    | high | 154.48 us | 159.23 us | 1.031 [1.030..1.032] | 1.028 [1.027..1.028] | 1.032      | 1.030      | 0.994 [0.991..0.998] | -           | neutral        |
| G10 filter,map / sortBy / take / groupBy                                                    | M    | high | 44.29 us  | 50.77 us  | 1.146 [1.137..1.156] | 1.139 [1.128..1.150] | 1.137      | 1.156      | 0.999 [0.994..1.004] | -           | **regression** |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | M    | high | 79.77 us  | 83.75 us  | 1.050 [1.034..1.066] | 1.035 [1.027..1.043] | 1.066      | 1.034      | 1.008 [0.998..1.017] | -           | neutral        |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | M    | high | 89.10 us  | 92.96 us  | 1.043 [1.041..1.045] | 1.037 [1.034..1.041] | 1.041      | 1.045      | 1.003 [1.001..1.005] | -           | neutral        |
| G10 prop / filter,map,take / reverse / map / length                                         | M    | high | 1.58 us   | 1.25 us   | 0.789 [0.789..0.790] | 0.796 [0.793..0.800] | 0.790      | 0.789      | 1.000 [1.000..1.000] | -           | **faster**     |

## Tier 3: branch vs main (15 scenarios, weighted geomean 0.798, floor 0.024)

| scenario                 | size | pop  | main      | branch    | ratio p75            | ratio mean             | copy first | main first | main-aa/main         | native/main | verdict    |
| ------------------------ | ---- | ---- | --------- | --------- | -------------------- | ---------------------- | ---------- | ---------- | -------------------- | ----------- | ---------- |
| G1 drop+take             | C    | low  | 111.69 us | 127.33 us | 1.140 [1.109..1.171] | 1.122 [1.100..1.144]   | 1.171      | 1.109      | 0.996 [0.990..1.002] | -           | **slower** |
| G1 drop+take             | M    | low  | 16.69 us  | 17.67 us  | 1.059 [1.052..1.065] | 1.054 [1.049..1.058]   | 1.052      | 1.065      | 1.004 [1.003..1.005] | -           | **slower** |
| G1 filter+first          | M    | mid  | 1.04 us   | 792.0 ns  | 0.760 [0.760..0.760] | 0.768 [0.765..0.770] * | 0.765      | 0.770      | 1.002 [1.001..1.002] | -           | **faster** |
| G1 filter+map+take(10)   | M    | mid  | 708.0 ns  | 667.0 ns  | 0.942 [0.942..0.942] | 0.930 [0.925..0.935] * | 0.935      | 0.925      | 0.993 [0.992..0.994] | -           | **faster** |
| G1 find early hit        | M    | mid  | 458.0 ns  | 375.0 ns  | 0.819 [0.819..0.819] | 0.809 [0.805..0.813] * | 0.813      | 0.805      | 1.001 [0.992..1.011] | -           | **faster** |
| G1 find late hit         | M    | mid  | 15.96 us  | 12.35 us  | 0.774 [0.768..0.781] | 0.774 [0.771..0.778]   | 0.768      | 0.781      | 0.991 [0.990..0.992] | -           | **faster** |
| G1 find miss             | M    | mid  | 16.04 us  | 12.13 us  | 0.756 [0.746..0.767] | 0.761 [0.751..0.771]   | 0.746      | 0.767      | 0.998 [0.975..1.021] | -           | **faster** |
| G1 flat+map              | M    | mid  | 35.10 us  | 19.56 us  | 0.557 [0.552..0.563] | 0.551 [0.546..0.557]   | 0.563      | 0.552      | 1.007 [1.004..1.009] | -           | **faster** |
| G1 flatMap+filter+map    | M    | mid  | 120.69 us | 92.60 us  | 0.767 [0.744..0.790] | 0.762 [0.740..0.784]   | 0.744      | 0.790      | 1.007 [1.001..1.013] | -           | **faster** |
| G2 deep-15 flatMap-first | M    | high | 376.69 us | 248.08 us | 0.659 [0.656..0.661] | 0.651 [0.649..0.652]   | 0.661      | 0.656      | 1.004 [1.000..1.008] | -           | **faster** |
| G2 deep-15 object        | M    | high | 137.29 us | 172.87 us | 1.259 [1.227..1.291] | 1.226 [1.209..1.243]   | 1.227      | 1.291      | 1.008 [1.002..1.015] | -           | **slower** |
| G2 deep-15 primitive     | M    | high | 160.21 us | 99.44 us  | 0.621 [0.613..0.628] | 0.615 [0.607..0.623]   | 0.613      | 0.628      | 1.012 [1.005..1.018] | -           | **faster** |
| G2 deep-8 flatMap-first  | M    | high | 245.06 us | 168.10 us | 0.686 [0.683..0.689] | 0.676 [0.674..0.678]   | 0.689      | 0.683      | 1.006 [0.991..1.021] | -           | **faster** |
| G2 deep-8 object         | M    | high | 91.31 us  | 112.21 us | 1.229 [1.228..1.230] | 1.207 [1.204..1.210]   | 1.230      | 1.228      | 1.008 [1.004..1.013] | -           | **slower** |
| G2 deep-8 primitive      | M    | high | 96.69 us  | 58.52 us  | 0.605 [0.593..0.618] | 0.595 [0.590..0.601]   | 0.593      | 0.618      | 1.003 [0.979..1.026] | -           | **faster** |
