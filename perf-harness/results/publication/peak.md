# Peak live heap at L (100,000 items)

Peak: the highest `heapUsed` read after `gc()` inside the last call of each callback, minus the heap after `gc()` before the call. Retained: the heap after the call with its result still referenced, minus the same baseline. KiB.

| scenario                                                                                    | main peak | main retained | branch peak | branch retained | main-aa peak | main-aa retained | branch/main peak |
| ------------------------------------------------------------------------------------------- | --------- | ------------- | ----------- | --------------- | ------------ | ---------------- | ---------------- |
| G1 map                                                                                      | 1806      | 888           | 914         | 897             | 1797         | 895              | 0.506            |
| G1 map reading data                                                                         | 1802      | 894           | 1818        | 903             | 1798         | 895              | 1.009            |
| G1 filter+map                                                                               | 2098      | 596           | 626         | 606             | 2099         | 597              | 0.298            |
| G1 map+filter+map                                                                           | 3591      | 898           | 904         | 895             | 3588         | 895              | 0.252            |
| G1 flatMap+filter+map                                                                       | 6944      | 2013          | 2037        | 2022            | 6945         | 2013             | 0.293            |
| G1 flat+map                                                                                 | 2193      | 895           | 899         | 895             | 2193         | 895              | 0.410            |
| G1 drop+take                                                                                | -         | 390           | -           | 397             | -            | 389              | -                |
| G1 map+unique                                                                               | 4962      | 606           | 3163        | 596             | 4953         | 596              | 0.637            |
| G1 uniqueBy                                                                                 | 4057      | 596           | 3163        | 596             | 4057         | 596              | 0.779            |
| G1 filter+map+take(10)                                                                      | 5         | 1             | 5           | 1               | 5            | 1                | 0.834            |
| G1 find early hit                                                                           | 19        | -6            | 189         | -6              | 211          | -6               | 9.916            |
| G1 find late hit                                                                            | 901       | 0             | 6           | 0               | 901          | 0                | 0.007            |
| G1 find miss                                                                                | 901       | 0             | 6           | 0               | 901          | 0                | 0.007            |
| G1 filter+first                                                                             | -3        | -7            | -4          | -7              | -3           | -7               | -                |
| G1 3-step middle reads data                                                                 | 2371      | 273           | 885         | 274             | 2363         | 265              | 0.373            |
| G10 filter,map / sortBy / take / groupBy                                                    | 3282      | 20            | 1782        | 11              | 3264         | 1                | 0.543            |
| G10 prop / filter,map,take / reverse / map / length                                         | 4         | -5            | 6           | 0               | 1            | -8               | 1.437            |
| G10 filter,map(pick) / groupBy / entries / map / fromEntries                                | 5939      | 8             | 4439        | -0              | 5931         | -0               | 0.747            |
| G10 map,filter / sortBy / uniqueBy,take / arrow / flatMap,filter,map                        | 4427      | 3             | 2636        | 3               | 4427         | 3                | 0.595            |
| G10 filter / sortBy / map,filter / groupBy / arrow / map(prop) / reverse / take,map / arrow | 4963      | 14            | 2747        | 11              | 4953         | 5                | 0.553            |
