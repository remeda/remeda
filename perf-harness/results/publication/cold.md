# Cold start (dist, node v26.9.0, 40 processes per copy and probe)

Each process imports one copy and calls one probe 50 times with no warmup. Median / p75 across processes. Ratios are copy/main on the medians.

| probe                   | copy    | import ms     | first call us | first 50 calls us | first call / main | first 50 / main |
| ----------------------- | ------- | ------------- | ------------- | ----------------- | ----------------- | --------------- |
| data-first map S        | main    | 14.19 / 14.31 | 41.5 / 42.8   | 70.9 / 76.2       | 1.000             | 1.000           |
| data-first map S        | branch  | 14.64 / 14.78 | 35.7 / 36.5   | 63.2 / 65.1       | 0.860             | 0.891           |
| data-first map S        | main-aa | 14.17 / 14.26 | 41.5 / 42.9   | 74.1 / 77.6       | 1.000             | 1.045           |
| data-first unique S     | main    | 14.28 / 14.35 | 147.6 / 149.1 | 395.4 / 403.4     | 1.000             | 1.000           |
| data-first unique S     | branch  | 14.68 / 14.82 | 88.9 / 90.0   | 205.6 / 208.3     | 0.603             | 0.520           |
| data-first unique S     | main-aa | 14.18 / 14.28 | 147.7 / 149.9 | 397.5 / 402.9     | 1.001             | 1.005           |
| pipe filter+map S       | main    | 14.25 / 14.34 | 167.0 / 170.2 | 460.5 / 467.0     | 1.000             | 1.000           |
| pipe filter+map S       | branch  | 14.70 / 14.77 | 175.1 / 177.8 | 356.5 / 362.5     | 1.049             | 0.774           |
| pipe filter+map S       | main-aa | 14.23 / 14.31 | 169.2 / 172.2 | 459.9 / 464.4     | 1.013             | 0.999           |
| arrow pipe depth-3      | main    | 14.21 / 14.30 | 59.1 / 60.1   | 88.2 / 93.5       | 1.000             | 1.000           |
| arrow pipe depth-3      | branch  | 14.70 / 14.77 | 66.7 / 68.0   | 89.5 / 90.5       | 1.128             | 1.014           |
| arrow pipe depth-3      | main-aa | 14.14 / 14.29 | 58.9 / 61.3   | 89.2 / 90.6       | 0.996             | 1.011           |
| pipe map reading data S | main    | 14.19 / 14.25 | 149.1 / 152.2 | 377.6 / 381.9     | 1.000             | 1.000           |
| pipe map reading data S | branch  | 14.77 / 14.82 | 140.5 / 142.7 | 265.6 / 270.7     | 0.942             | 0.703           |
| pipe map reading data S | main-aa | 14.21 / 14.27 | 149.0 / 151.3 | 378.1 / 384.0     | 0.999             | 1.001           |
