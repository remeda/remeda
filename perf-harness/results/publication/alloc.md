# Allocation: branch vs main (dist, plain node)

Bytes per call: median of 3 GC-free windows (gc(), used_heap_size delta over N calls / N). Per-item divides by the input items per call (XS = 256 x 0/1/3, S = 64 x 16, C = 64 x 100). GC: GCProfiler over a 2s steady loop with default heap flags.

| scenario                                 | size | main B/call | branch B/call | branch/main | GC-free | main GCs (ms) / 1k calls | branch GCs (ms) / 1k calls |
| ---------------------------------------- | ---- | ----------- | ------------- | ----------- | ------- | ------------------------ | -------------------------- |
| G1 map reading data                      | M    | 206.0 KiB   | 96.0 KiB      | 0.466       | yes     | 13.48 (0.48 ms)          | 2.93 (0.11 ms)             |
| G1 filter+map                            | XS   | 495.8 KiB   | 329.8 KiB     | 0.665       | yes     | 15.11 (0.56 ms)          | 10.06 (0.37 ms)            |
| G1 filter+map                            | S    | 320.1 KiB   | 123.7 KiB     | 0.386       | yes     | 9.75 (0.36 ms)           | 3.77 (0.14 ms)             |
| G1 filter+map                            | C    | 1.60 MiB    | 398.6 KiB     | 0.243       | yes     | 50.00 (1.98 ms)          | 12.16 (0.52 ms)            |
| G1 filter+map                            | M    | 261.4 KiB   | 58.2 KiB      | 0.223       | yes     | 7.96 (0.32 ms)           | 1.78 (0.07 ms)             |
| G1 map+filter+map                        | M    | 478.3 KiB   | 68.9 KiB      | 0.144       | yes     | 14.55 (0.61 ms)          | 2.09 (0.09 ms)             |
| G1 map+filter+map                        | L    | 46.75 MiB   | 6.52 MiB      | 0.139       | yes     | 1154.61 (207.82 ms)      | 129.63 (11.68 ms)          |
| G1 flatMap+filter+map                    | M    | 1.18 MiB    | 109.7 KiB     | 0.091       | yes     | 36.58 (1.77 ms)          | 3.33 (0.17 ms)             |
| G2 deep-8 primitive                      | M    | 1.05 MiB    | 60.6 KiB      | 0.056       | yes     | 32.57 (1.60 ms)          | 1.84 (0.13 ms)             |
| G2 deep-8 primitive                      | L    | 107.88 MiB  | 6.52 MiB      | 0.060       | yes     | 2687.50 (824.54 ms)      | 130.21 (17.18 ms)          |
| G2 deep-8 object                         | M    | 948.5 KiB   | 60.5 KiB      | 0.064       | yes     | 28.65 (1.41 ms)          | 1.83 (0.10 ms)             |
| G2 deep-8 object                         | L    | 93.71 MiB   | 5.65 MiB      | 0.060       | yes     | 2381.94 (939.22 ms)      | 130.00 (15.75 ms)          |
| G5 data-first map                        | S    | 18.5 KiB    | 18.5 KiB      | 1.000       | yes     | 0.56 (0.03 ms)           | 0.56 (0.02 ms)             |
| G5 data-first map                        | C    | 60.7 KiB    | 60.7 KiB      | 1.000       | yes     | 1.85 (0.09 ms)           | 1.86 (0.10 ms)             |
| G5 data-first unique                     | M    | 224.5 KiB   | 98.5 KiB      | 0.438       | yes     | 6.79 (0.32 ms)           | 3.00 (0.14 ms)             |
| G9 map((...args) => args[0])             | C    | 1.33 MiB    | 607.1 KiB     | 0.446       | yes     | 39.80 (1.82 ms)          | 17.66 (0.84 ms)            |
| G10 filter,map / sortBy / take / groupBy | C    | 1.91 MiB    | 645.5 KiB     | 0.330       | yes     | 59.32 (2.92 ms)          | 19.54 (0.97 ms)            |

Steady loop totals (2s per entry):

| scenario                                 | size | main calls | main GCs | main GC ms | branch calls | branch GCs | branch GC ms |
| ---------------------------------------- | ---- | ---------- | -------- | ---------- | ------------ | ---------- | ------------ |
| G1 map reading data                      | M    | 61264      | 826      | 29.2       | 138288       | 405        | 15.5         |
| G1 filter+map                            | XS   | 39056      | 590      | 22.0       | 60512        | 609        | 22.5         |
| G1 filter+map                            | S    | 39488      | 385      | 14.1       | 82736        | 312        | 11.5         |
| G1 filter+map                            | C    | 7280       | 364      | 14.4       | 17440        | 212        | 9.1          |
| G1 filter+map                            | M    | 48096      | 383      | 15.6       | 117104       | 208        | 8.6          |
| G1 map+filter+map                        | M    | 29280      | 426      | 17.7       | 83072        | 174        | 7.3          |
| G1 map+filter+map                        | L    | 304        | 351      | 63.2       | 864          | 112        | 10.1         |
| G1 flatMap+filter+map                    | M    | 10880      | 398      | 19.2       | 32400        | 108        | 5.5          |
| G2 deep-8 primitive                      | M    | 13264      | 432      | 21.3       | 38144        | 70         | 4.8          |
| G2 deep-8 primitive                      | L    | 128        | 344      | 105.5      | 384          | 50         | 6.6          |
| G2 deep-8 object                         | M    | 14416      | 413      | 20.3       | 39424        | 72         | 3.8          |
| G2 deep-8 object                         | L    | 144        | 343      | 135.2      | 400          | 52         | 6.3          |
| G5 data-first map                        | S    | 281680     | 159      | 7.2        | 280912       | 158        | 6.8          |
| G5 data-first map                        | C    | 56640      | 105      | 5.1        | 57120        | 106        | 5.8          |
| G5 data-first unique                     | M    | 41840      | 284      | 13.3       | 83248        | 250        | 11.3         |
| G9 map((...args) => args[0])             | C    | 9824       | 391      | 17.9       | 23504        | 415        | 19.7         |
| G10 filter,map / sortBy / take / groupBy | C    | 5344       | 317      | 15.6       | 9824         | 192        | 9.5          |

Calibration (bytes mode):

- emptyClosure: 0.3 B/call (N=2000)
- threeFieldObject: 48.3 B/call (N=2000)
- array16: 32.3 B/call (N=2000)
