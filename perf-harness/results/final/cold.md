# Cold start (dist, node v26.9.0, 40 processes per copy and probe)

Each process imports one copy and calls one probe 50 times with no warmup. Median / p75 across processes. Ratios are copy/main on the medians.

| probe                   | copy    | import ms     | first call us | first 50 calls us | first call / main | first 50 / main |
| ----------------------- | ------- | ------------- | ------------- | ----------------- | ----------------- | --------------- |
| data-first map S        | main    | 14.16 / 14.31 | 41.8 / 42.8   | 70.8 / 75.9       | 1.000             | 1.000           |
| data-first map S        | branch  | 14.56 / 14.70 | 35.4 / 36.6   | 63.0 / 64.3       | 0.846             | 0.890           |
| data-first map S        | main-aa | 14.16 / 14.26 | 42.2 / 44.6   | 74.2 / 76.9       | 1.009             | 1.048           |
| data-first unique S     | main    | 14.22 / 14.31 | 148.2 / 152.4 | 397.1 / 402.8     | 1.000             | 1.000           |
| data-first unique S     | branch  | 14.59 / 14.71 | 44.5 / 45.2   | 115.9 / 120.4     | 0.300             | 0.292           |
| data-first unique S     | main-aa | 14.21 / 14.33 | 147.4 / 150.6 | 395.2 / 399.3     | 0.995             | 0.995           |
| pipe filter+map S       | main    | 14.18 / 14.22 | 169.2 / 175.8 | 462.7 / 472.4     | 1.000             | 1.000           |
| pipe filter+map S       | branch  | 14.60 / 14.73 | 146.8 / 148.7 | 321.6 / 329.1     | 0.868             | 0.695           |
| pipe filter+map S       | main-aa | 14.23 / 14.33 | 167.3 / 171.3 | 461.2 / 466.6     | 0.989             | 0.997           |
| arrow pipe depth-3      | main    | 14.20 / 14.28 | 59.1 / 60.0   | 87.2 / 91.1       | 1.000             | 1.000           |
| arrow pipe depth-3      | branch  | 14.59 / 14.73 | 52.5 / 53.2   | 75.3 / 76.5       | 0.888             | 0.863           |
| arrow pipe depth-3      | main-aa | 14.19 / 14.28 | 58.4 / 60.3   | 89.4 / 93.3       | 0.988             | 1.025           |
| pipe map reading data S | main    | 14.22 / 14.38 | 149.6 / 151.1 | 379.4 / 384.6     | 1.000             | 1.000           |
| pipe map reading data S | branch  | 14.55 / 14.66 | 118.4 / 119.5 | 238.9 / 243.1     | 0.792             | 0.630           |
| pipe map reading data S | main-aa | 14.17 / 14.32 | 149.8 / 152.5 | 376.9 / 383.5     | 1.001             | 0.993           |
| data-first groupBy S    | main    | 14.23 / 14.35 | 56.5 / 58.2   | 138.6 / 141.6     | 1.000             | 1.000           |
| data-first groupBy S    | branch  | 14.58 / 14.72 | 50.4 / 51.4   | 124.2 / 127.3     | 0.891             | 0.896           |
| data-first groupBy S    | main-aa | 14.19 / 14.31 | 56.8 / 59.0   | 136.6 / 142.7     | 1.004             | 0.986           |
| data-last clamp         | main    | 14.17 / 14.29 | 52.6 / 54.0   | 72.6 / 75.6       | 1.000             | 1.000           |
| data-last clamp         | branch  | 14.54 / 14.66 | 44.0 / 44.6   | 63.4 / 64.2       | 0.836             | 0.874           |
| data-last clamp         | main-aa | 14.21 / 14.32 | 52.1 / 52.5   | 72.4 / 77.3       | 0.991             | 0.997           |
