# Allocation: branch vs main (dist, plain node)

Bytes per call: median of 3 GC-free windows (gc(), used_heap_size delta over N calls / N). Per-item divides by the input items per call (XS = 256 x 0/1/3, S = 64 x 16, C = 64 x 100). GC: GCProfiler over a 2s steady loop with default heap flags.

| scenario                                 | size | main B/call | branch B/call | branch/main | GC-free | main GCs (ms) / 1k calls | branch GCs (ms) / 1k calls |
| ---------------------------------------- | ---- | ----------- | ------------- | ----------- | ------- | ------------------------ | -------------------------- |
| G1 map reading data                      | M    | 205.9 KiB   | 96.0 KiB      | 0.466       | yes     | 13.96 (0.50 ms)          | 2.93 (0.11 ms)             |
| G1 filter+map                            | XS   | 495.8 KiB   | 326.2 KiB     | 0.658       | yes     | 15.11 (0.56 ms)          | 9.94 (0.36 ms)             |
| G1 filter+map                            | S    | 320.1 KiB   | 122.8 KiB     | 0.383       | yes     | 9.74 (0.37 ms)           | 3.74 (0.14 ms)             |
| G1 filter+map                            | C    | 1.60 MiB    | 397.6 KiB     | 0.242       | yes     | 50.06 (1.97 ms)          | 12.10 (0.49 ms)            |
| G1 filter+map                            | M    | 261.5 KiB   | 58.2 KiB      | 0.223       | yes     | 7.96 (0.33 ms)           | 1.77 (0.07 ms)             |
| G1 map+filter+map                        | M    | 478.3 KiB   | 68.9 KiB      | 0.144       | yes     | 14.53 (0.62 ms)          | 2.10 (0.09 ms)             |
| G1 map+filter+map                        | L    | 46.75 MiB   | 6.52 MiB      | 0.139       | yes     | 1154.61 (203.69 ms)      | 129.63 (15.49 ms)          |
| G1 flatMap+filter+map                    | M    | 1.18 MiB    | 109.7 KiB     | 0.091       | yes     | 36.53 (1.76 ms)          | 3.35 (0.16 ms)             |
| G2 deep-8 primitive                      | M    | 1.05 MiB    | 60.5 KiB      | 0.056       | yes     | 32.60 (1.63 ms)          | 1.82 (0.11 ms)             |
| G2 deep-8 primitive                      | L    | 107.89 MiB  | 6.52 MiB      | 0.060       | yes     | 2687.50 (835.89 ms)      | 130.00 (16.16 ms)          |
| G2 deep-8 object                         | M    | 948.5 KiB   | 60.5 KiB      | 0.064       | yes     | 28.61 (1.42 ms)          | 1.84 (0.10 ms)             |
| G2 deep-8 object                         | L    | 93.71 MiB   | 5.65 MiB      | 0.060       | yes     | 2381.94 (942.06 ms)      | 130.00 (14.53 ms)          |
| G5 data-first map                        | S    | 18.5 KiB    | 18.5 KiB      | 1.000       | yes     | 0.56 (0.02 ms)           | 0.56 (0.02 ms)             |
| G5 data-first map                        | C    | 60.7 KiB    | 60.7 KiB      | 1.000       | yes     | 1.84 (0.09 ms)           | 1.84 (0.09 ms)             |
| G5 data-first unique                     | M    | 224.5 KiB   | 59.1 KiB      | 0.263       | yes     | 6.79 (0.32 ms)           | 1.80 (0.08 ms)             |
| G9 map((...args) => args[0])             | C    | 1.33 MiB    | 606.2 KiB     | 0.446       | yes     | 39.83 (1.83 ms)          | 17.66 (0.85 ms)            |
| G10 filter,map / sortBy / take / groupBy | C    | 1.91 MiB    | 644.4 KiB     | 0.330       | yes     | 59.31 (2.78 ms)          | 19.51 (0.95 ms)            |

Steady loop totals (2s per entry):

| scenario                                 | size | main calls | main GCs | main GC ms | branch calls | branch GCs | branch GC ms |
| ---------------------------------------- | ---- | ---------- | -------- | ---------- | ------------ | ---------- | ------------ |
| G1 map reading data                      | M    | 59328      | 828      | 29.5       | 138960       | 407        | 15.9         |
| G1 filter+map                            | XS   | 40112      | 606      | 22.6       | 70496        | 701        | 25.7         |
| G1 filter+map                            | S    | 39216      | 382      | 14.4       | 84864        | 317        | 11.8         |
| G1 filter+map                            | C    | 7232       | 362      | 14.3       | 17440        | 211        | 8.5          |
| G1 filter+map                            | M    | 47968      | 382      | 15.8       | 116992       | 207        | 8.5          |
| G1 map+filter+map                        | M    | 29040      | 422      | 17.9       | 83824        | 176        | 7.2          |
| G1 map+filter+map                        | L    | 304        | 351      | 61.9       | 864          | 112        | 13.4         |
| G1 flatMap+filter+map                    | M    | 10896      | 398      | 19.2       | 31920        | 107        | 5.2          |
| G2 deep-8 primitive                      | M    | 12976      | 423      | 21.1       | 38432        | 70         | 4.3          |
| G2 deep-8 primitive                      | L    | 128        | 344      | 107.0      | 400          | 52         | 6.5          |
| G2 deep-8 object                         | M    | 14368      | 411      | 20.4       | 39088        | 72         | 3.9          |
| G2 deep-8 object                         | L    | 144        | 343      | 135.7      | 400          | 52         | 5.8          |
| G5 data-first map                        | S    | 271104     | 153      | 6.5        | 280016       | 158        | 6.8          |
| G5 data-first map                        | C    | 57008      | 105      | 5.3        | 56992        | 105        | 5.1          |
| G5 data-first unique                     | M    | 41536      | 282      | 13.3       | 187632       | 338        | 15.6         |
| G9 map((...args) => args[0])             | C    | 9792       | 390      | 17.9       | 23728        | 419        | 20.1         |
| G10 filter,map / sortBy / take / groupBy | C    | 5328       | 316      | 14.8       | 9792         | 191        | 9.3          |

Calibration (bytes mode):

- emptyClosure: 0.3 B/call (N=2000)
- threeFieldObject: 48.3 B/call (N=2000)
- array16: 32.3 B/call (N=2000)
