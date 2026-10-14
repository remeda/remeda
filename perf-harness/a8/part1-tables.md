TABLE floors

| runs                             | T1 floor       | T2 floor       | T3 floor       | T1 A/A false calls  | T2 A/A false calls  | T3 A/A false calls  |
| -------------------------------- | -------------- | -------------- | -------------- | ------------------- | ------------------- | ------------------- |
| full matrix (2 runs)             | 0.031 (n=306)  | 0.031 (n=346)  | 0.033 (n=400)  | 1/153 (0.7%), bar 0 | 1/173 (0.6%), bar 1 | 0/200 (0.0%), bar 0 |
| combo.patch (2 runs, T1+T2)      | 0.099 (n=306)  | 0.105 (n=346)  | -              | 0/153 (0.0%), bar 0 | 5/173 (2.9%), bar 3 | -                   |
| variant batches pooled (42 runs) | 0.044 (n=4842) | 0.056 (n=2928) | 0.052 (n=2874) | 1/151 (0.7%), bar 0 | 0/132 (0.0%), bar 0 | 0/105 (0.0%), bar 0 |
| batch b1 (6 runs)                | 0.036 (n=738)  | 0.029 (n=546)  | 0.036 (n=582)  | 0/123 (0.0%), bar 0 | 0/91 (0.0%), bar 0  | 0/97 (0.0%), bar 0  |
| batch b2 (6 runs)                | 0.096 (n=654)  | 0.100 (n=366)  | 0.084 (n=324)  | 0/109 (0.0%), bar 0 | 0/61 (0.0%), bar 0  | 0/54 (0.0%), bar 0  |
| batch b3 (6 runs)                | 0.091 (n=708)  | 0.103 (n=498)  | 0.106 (n=504)  | 0/118 (0.0%), bar 0 | 0/83 (0.0%), bar 0  | 0/84 (0.0%), bar 0  |
| batch b4 (6 runs)                | 0.030 (n=678)  | 0.032 (n=324)  | 0.029 (n=384)  | 0/113 (0.0%), bar 0 | 0/54 (0.0%), bar 0  | 0/64 (0.0%), bar 0  |
| batch b5 (6 runs)                | 0.037 (n=792)  | 0.034 (n=606)  | 0.030 (n=456)  | 1/132 (0.8%), bar 0 | 0/101 (0.0%), bar 0 | 0/76 (0.0%), bar 0  |
| batch b6 (6 runs)                | 0.031 (n=672)  | 0.028 (n=402)  | 0.031 (n=432)  | 0/112 (0.0%), bar 0 | 0/67 (0.0%), bar 0  | 0/72 (0.0%), bar 0  |
| batch b7 (6 runs)                | 0.037 (n=600)  | 0.043 (n=186)  | 0.041 (n=192)  | 0/100 (0.0%), bar 0 | 0/31 (0.0%), bar 0  | 0/32 (0.0%), bar 0  |
| extra x-jitless (2 runs)         | -              | -              | 0.015 (n=128)  | -                   | -                   | 0/64 (0.0%), bar 0  |
| extra x-maxopt1 (2 runs)         | -              | -              | 0.026 (n=128)  | -                   | -                   | 0/64 (0.0%), bar 0  |
| extra x-maxopt2 (2 runs)         | -              | -              | 0.048 (n=128)  | -                   | -                   | 0/64 (0.0%), bar 0  |
| extra x-p0 (2 runs)              | 0.013 (n=24)   | 0.130 (n=42)   | 0.225 (n=30)   | 0/12 (0.0%), bar 0  | 0/21 (0.0%), bar 0  | 0/15 (0.0%), bar 0  |
| extra x-p1 (2 runs)              | 0.022 (n=24)   | 0.022 (n=42)   | 0.024 (n=30)   | 0/12 (0.0%), bar 0  | 0/21 (0.0%), bar 0  | 0/15 (0.0%), bar 0  |
| extra x-node22 (2 runs)          | 0.039 (n=114)  | 0.010 (n=14)   | -              | 0/57 (0.0%), bar 0  | 0/7 (0.0%), bar 0   | -                   |
| extra x-node24 (2 runs)          | 0.046 (n=114)  | 0.012 (n=14)   | -              | 1/57 (1.8%), bar 1  | 0/7 (0.0%), bar 0   | -                   |
| extra x-bundle (2 runs)          | 0.045 (n=32)   | 0.013 (n=14)   | -              | 0/16 (0.0%), bar 0  | 0/7 (0.0%), bar 0   | -                   |
| extra x-cjs (2 runs)             | 0.158 (n=32)   | 0.168 (n=14)   | -              | 0/16 (0.0%), bar 0  | 0/7 (0.0%), bar 0   | -                   |
| extra x-bun (2 runs)             | 0.064 (n=114)  | 0.025 (n=14)   | -              | 0/57 (0.0%), bar 0  | 0/7 (0.0%), bar 0   | -                   |
| extra x-portable-node (2 runs)   | 0.048 (n=114)  | 0.015 (n=14)   | -              | 1/57 (1.8%), bar 1  | 0/7 (0.0%), bar 0   | -                   |
| extra x-isolated (2 runs)        | 0.040 (n=32)   | 0.032 (n=14)   | -              | 0/16 (0.0%), bar 0  | 0/7 (0.0%), bar 0   | -                   |

TABLE branch-main-groups

| tier / group | n   | weighted gm | verdicts                             | bar |
| ------------ | --- | ----------- | ------------------------------------ | --- |
| **T1 all**   | 153 | **0.854**   | faster 79, neutral 64, regression 10 | 10  |
| T1 G1        | 21  | 0.702       | faster 19, neutral 1, regression 1   | 1   |
| T1 G1b       | 24  | 0.741       | faster 22, neutral 2                 | 0   |
| T1 G2        | 1   | 0.875       | faster 1                             | 0   |
| T1 G3        | 19  | 0.976       | faster 5, neutral 5, regression 9    | 9   |
| T1 G5        | 23  | 0.809       | faster 17, neutral 6                 | 0   |
| T1 G6        | 9   | 0.861       | neutral 6, faster 3                  | 0   |
| T1 G7        | 41  | 1.000       | neutral 41                           | 0   |
| T1 G10       | 15  | 0.841       | neutral 3, faster 12                 | 0   |
| **T2 all**   | 173 | **0.789**   | faster 105, neutral 64, regression 4 | 4   |
| T2 G1        | 20  | 0.627       | faster 19, neutral 1                 | 0   |
| T2 G1b       | 50  | 0.734       | faster 45, neutral 4, regression 1   | 1   |
| T2 G2        | 2   | 0.871       | faster 2                             | 0   |
| T2 G3        | 1   | 1.020       | neutral 1                            | 0   |
| T2 G4        | 12  | 0.614       | faster 12                            | 0   |
| T2 G5        | 23  | 0.878       | neutral 15, faster 8                 | 0   |
| T2 G6        | 7   | 0.806       | neutral 3, faster 4                  | 0   |
| T2 G7        | 41  | 1.006       | neutral 39, regression 2             | 2   |
| T2 G9        | 12  | 0.852       | faster 10, neutral 1, regression 1   | 1   |
| T2 G10       | 5   | 0.838       | faster 5                             | 0   |
| **T3 all**   | 200 | **0.738**   | faster 148, neutral 50, slower 2     | 0   |
| T3 G1        | 26  | 0.625       | faster 25, neutral 1                 | 0   |
| T3 G1b       | 78  | 0.743       | faster 67, neutral 11                | 0   |
| T3 G2        | 13  | 0.564       | faster 13                            | 0   |
| T3 G5        | 49  | 0.832       | faster 26, neutral 23                | 0   |
| T3 G6        | 8   | 0.757       | neutral 2, faster 6                  | 0   |
| T3 G7        | 8   | 1.011       | neutral 8                            | 0   |
| T3 G8        | 14  | 0.934       | neutral 5, faster 7, slower 2        | 0   |
| T3 G9        | 4   | 0.813       | faster 4                             | 0   |

TABLE branch-violations

| tier | scenario                               | metric | median | branch first | main first | floor | per run (r0, r1) |
| ---- | -------------------------------------- | ------ | ------ | ------------ | ---------- | ----- | ---------------- |
| 1    | G1 3-step middle reads data XS         | p75    | 1.075  | 1.081        | 1.068      | 0.031 | 1.068, 1.081     |
| 2    | G1b pipe zip+map S                     | p75    | 1.070  | 1.098        | 1.041      | 0.031 | 1.041, 1.098     |
| 1    | G3 scalar purry depth-3 x64            | p75    | 1.148  | 1.148        | 1.148      | 0.031 | 1.148, 1.148     |
| 1    | G3 scalar purry depth-3 x1             | mean   | 1.138  | 1.119        | 1.158      | 0.031 | 1.158, 1.119     |
| 1    | G3 scalar purry depth-10 x64           | p75    | 1.105  | 1.115        | 1.094      | 0.031 | 1.094, 1.115     |
| 1    | G3 scalar purry depth-10 x1            | mean   | 1.108  | 1.117        | 1.100      | 0.031 | 1.100, 1.117     |
| 1    | G3 scalar arrows depth-3 x64           | p75    | 1.350  | 1.347        | 1.354      | 0.031 | 1.354, 1.347     |
| 1    | G3 scalar arrows depth-3 x1            | mean   | 1.243  | 1.224        | 1.262      | 0.031 | 1.262, 1.224     |
| 1    | G3 scalar arrows depth-10 x64          | p75    | 1.351  | 1.356        | 1.346      | 0.031 | 1.346, 1.356     |
| 1    | G3 scalar arrows depth-10 x1           | mean   | 1.281  | 1.288        | 1.274      | 0.031 | 1.274, 1.288     |
| 1    | G3 object pick+omit+set+merge x64      | p75    | 1.055  | 1.048        | 1.062      | 0.031 | 1.062, 1.048     |
| 2    | G7 clamp data-last C                   | p75    | 1.051  | 1.033        | 1.069      | 0.031 | 1.069, 1.033     |
| 2    | G7 mergeDeep data-last C               | p75    | 1.230  | 1.423        | 1.037      | 0.031 | 1.037, 1.423     |
| 2    | G9 map((...args) => args[0])+filter XS | p75    | 1.127  | 1.121        | 1.133      | 0.031 | 1.133, 1.121     |

TABLE g3-modes

| configuration                            | copies                                                                 | deopt mode (runs) | fast mode (runs) | gm deopt | gm fast |
| ---------------------------------------- | ---------------------------------------------------------------------- | ----------------- | ---------------- | -------- | ------- |
| combo runs (4 copies, vitest, dist)      | branch                                                                 | 2                 | 0                | 1.365    | -       |
| combo runs (4 copies, vitest, dist)      | on-demand pipe (combo, pipe-on-demand-segments, pipe-single-step-runs) | 0                 | 2                | -        | 0.583   |
| full matrix (3 copies, vitest, dist)     | branch                                                                 | 2                 | 0                | 1.350    | -       |
| variant batches (6 copies, vitest, dist) | branch                                                                 | 39                | 3                | 1.354    | 0.930   |
| variant batches (6 copies, vitest, dist) | other branch-pipe copies (variants)                                    | 90                | 18               | 1.355    | 0.909   |
| variant batches (6 copies, vitest, dist) | on-demand pipe (combo, pipe-on-demand-segments, pipe-single-step-runs) | 0                 | 12               | -        | 0.602   |
| extra bun                                | branch                                                                 | 0                 | 2                | -        | 0.912   |
| extra bundle                             | branch                                                                 | 0                 | 2                | -        | 0.936   |
| extra cjs                                | branch                                                                 | 0                 | 2                | -        | 0.926   |
| extra isolated                           | branch                                                                 | 0                 | 2                | -        | 1.045   |
| extra jitless                            | branch                                                                 | 0                 | 2                | -        | 1.025   |
| extra maxopt1                            | branch                                                                 | 0                 | 2                | -        | 1.024   |
| extra maxopt2                            | branch                                                                 | 0                 | 2                | -        | 1.005   |
| extra node22                             | branch                                                                 | 0                 | 2                | -        | 1.000   |
| extra node24                             | branch                                                                 | 2                 | 0                | 1.347    | -       |
| extra portable-node                      | branch                                                                 | 0                 | 2                | -        | 0.965   |

TABLE combo-main-groups

| combo/main | n   | weighted gm | verdicts                             | bar |
| ---------- | --- | ----------- | ------------------------------------ | --- |
| **T1 all** | 153 | **0.694**   | faster 105, neutral 47, regression 1 | 1   |
| T1 G1      | 21  | 0.492       | faster 21                            | 0   |
| T1 G1b     | 24  | 0.519       | faster 24                            | 0   |
| T1 G2      | 1   | 0.700       | faster 1                             | 0   |
| T1 G3      | 19  | 0.762       | faster 15, neutral 4                 | 0   |
| T1 G5      | 23  | 0.697       | faster 19, neutral 4                 | 0   |
| T1 G6      | 9   | 0.648       | faster 8, neutral 1                  | 0   |
| T1 G7      | 41  | 0.984       | faster 2, neutral 38, regression 1   | 1   |
| T1 G10     | 15  | 0.658       | faster 15                            | 0   |
| **T2 all** | 173 | **0.640**   | faster 126, neutral 47               | 0   |
| T2 G1      | 20  | 0.451       | faster 20                            | 0   |
| T2 G1b     | 50  | 0.520       | faster 50                            | 0   |
| T2 G2      | 2   | 0.802       | faster 2                             | 0   |
| T2 G3      | 1   | 1.001       | neutral 1                            | 0   |
| T2 G4      | 12  | 0.542       | faster 12                            | 0   |
| T2 G5      | 23  | 0.761       | neutral 9, faster 14                 | 0   |
| T2 G6      | 7   | 0.644       | neutral 2, faster 5                  | 0   |
| T2 G7      | 41  | 0.957       | neutral 35, faster 6                 | 0   |
| T2 G9      | 12  | 0.668       | faster 12                            | 0   |
| T2 G10     | 5   | 0.726       | faster 5                             | 0   |

TABLE combo-branch-groups

| combo/branch | n   | weighted gm | verdicts               | bar |
| ------------ | --- | ----------- | ---------------------- | --- |
| **T1 all**   | 153 | **0.800**   | faster 105, neutral 48 | 0   |
| T1 G1        | 21  | 0.687       | faster 21              | 0   |
| T1 G1b       | 24  | 0.682       | faster 24              | 0   |
| T1 G2        | 1   | 0.799       | faster 1               | 0   |
| T1 G3        | 19  | 0.785       | neutral 8, faster 11   | 0   |
| T1 G5        | 23  | 0.829       | faster 21, neutral 2   | 0   |
| T1 G6        | 9   | 0.717       | faster 9               | 0   |
| T1 G7        | 41  | 0.979       | faster 3, neutral 38   | 0   |
| T1 G10       | 15  | 0.784       | faster 15              | 0   |
| **T2 all**   | 173 | **0.798**   | faster 111, neutral 62 | 0   |
| T2 G1        | 20  | 0.713       | faster 19, neutral 1   | 0   |
| T2 G1b       | 50  | 0.691       | faster 50              | 0   |
| T2 G2        | 2   | 0.916       | neutral 2              | 0   |
| T2 G3        | 1   | 1.008       | neutral 1              | 0   |
| T2 G4        | 12  | 0.887       | faster 5, neutral 7    | 0   |
| T2 G5        | 23  | 0.828       | neutral 10, faster 13  | 0   |
| T2 G6        | 7   | 0.775       | neutral 2, faster 5    | 0   |
| T2 G7        | 41  | 0.947       | neutral 35, faster 6   | 0   |
| T2 G9        | 12  | 0.772       | faster 11, neutral 1   | 0   |
| T2 G10       | 5   | 0.878       | neutral 3, faster 2    | 0   |

TABLE combo-fate

| tier | branch violation in the combo runs     | branch/main | combo/main | combo verdict |
| ---- | -------------------------------------- | ----------- | ---------- | ------------- |
| 1    | G3 scalar purry depth-3 x64            | 1.157       | 0.792      | faster        |
| 1    | G3 scalar purry depth-3 x1             | 1.127       | 0.817      | faster        |
| 1    | G3 scalar purry depth-10 x1            | 1.103       | 0.820      | faster        |
| 1    | G3 scalar arrows depth-3 x64           | 1.365       | 0.583      | faster        |
| 1    | G3 scalar arrows depth-3 x1            | 1.236       | 0.737      | faster        |
| 1    | G3 scalar arrows depth-10 x64          | 1.342       | 0.724      | faster        |
| 1    | G3 scalar arrows depth-10 x1           | 1.272       | 0.739      | faster        |
| 1    | G7 mapValues data-first C              | 1.176       | 1.241      | regression    |
| 2    | G7 sumBy data-first S                  | 1.233       | 0.830      | faster        |
| 2    | G9 map((...args) => args[0])+filter XS | 1.170       | 0.740      | faster        |

TABLE combo-entries

| tier | scenario                               | branch/main (r0, r1) | combo/main (r0, r1)  |
| ---- | -------------------------------------- | -------------------- | -------------------- |
| 1    | G1 filter+map XS                       | 1.059 (1.019, 1.098) | 0.681 (0.662, 0.699) |
| 1    | G1 3-step middle reads data XS         | 1.065 (1.024, 1.106) | 0.696 (0.676, 0.715) |
| 2    | G1b pipe difference+map XS             | 1.063 (1.068, 1.058) | 0.625 (0.612, 0.637) |
| 1    | G1b pipe filter+map XS                 | 1.053 (1.019, 1.086) | 0.695 (0.674, 0.716) |
| 2    | G1b pipe zip+map XS                    | 1.048 (1.000, 1.096) | 0.684 (0.646, 0.721) |
| 2    | G1b pipe zip+map S                     | 1.042 (1.011, 1.072) | 0.891 (0.862, 0.919) |
| 1    | G7 mapValues data-first C              | 1.176 (1.208, 1.144) | 1.241 (1.128, 1.355) |
| 1    | G7 mapValues data-last C               | 0.994 (0.975, 1.013) | 0.895 (0.808, 0.981) |
| 1    | G7 isDeepEqual data-last C             | 1.057 (1.025, 1.088) | 1.021 (0.925, 1.117) |
| 2    | G7 clamp data-last C                   | 1.051 (1.034, 1.069) | 0.999 (0.999, 0.999) |
| 2    | G7 mergeDeep data-last C               | 0.946 (0.959, 0.934) | 1.030 (0.717, 1.343) |
| 2    | G9 map((...args) => args[0])+filter XS | 1.170 (1.131, 1.209) | 0.740 (0.717, 0.764) |

TABLE variants

| variant                      | batch | flow n | flow gm per run (r0..r5)                 | overall | faster runs | T1 / T2 / T3 v/branch (no G3 cluster) | bar violations vs main (official) | inherited from the branch / new in the G3 cluster / other new | losses vs branch (tier rule)                                                                                                               | A/A fire |
| ---------------------------- | ----- | ------ | ---------------------------------------- | ------- | ----------- | ------------------------------------- | --------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| datalast-arity-closures      | b5    | 88     | 0.989, 0.991, 0.994, 0.991, 0.991, 0.990 | 0.9911  | 6/6         | 0.997 / 0.997 / 0.999                 | 8                                 | 8 / 0 / 0                                                     | none                                                                                                                                       | 0.0%     |
| datalast-direct-props        | b4    | 138    | 0.884, 0.884, 0.888, 0.882, 0.888, 0.887 | 0.8856  | 6/6         | 0.939 / 0.908 / 0.925                 | 9                                 | 8 / 1 / 0                                                     | none                                                                                                                                       | 0.0%     |
| first-index-access           | b7    | 3      | 0.997, 0.999, 0.999, 1.004, 1.003, 1.001 | 1.0004  | 3/6         | 1.001 / 0.998 / 0.999                 | 8                                 | 8 / 0 / 0                                                     | none                                                                                                                                       | 0.1%     |
| identity-controls-v2         | b1    | 279    | 0.849, 0.849, 0.848, 0.850, 0.849, 0.850 | 0.8491  | 6/6         | 0.911 / 0.832 / 0.787                 | 8                                 | 0 / 8 / 0                                                     | none                                                                                                                                       | 0.0%     |
| lazy-args-arity              | b5    | 174    | 0.994, 0.997, 0.993, 0.993, 0.997, 0.996 | 0.9949  | 6/6         | 0.997 / 0.996 / 0.997                 | 9                                 | 8 / 1 / 0                                                     | T1 G7 mapValues data-first C 1.106                                                                                                         | 0.0%     |
| map-callback-as-evaluator    | b3    | 71     | 0.943, 0.940, 0.943, 0.944, 0.941, 0.942 | 0.9421  | 6/6         | 0.978 / 0.980 / 0.987                 | 14                                | 14 / 0 / 0                                                    | none                                                                                                                                       | 0.8%     |
| pipe-array-index-loop        | b2    | 122    | 0.927, 0.940, 0.944, 0.943, 0.943, 0.940 | 0.9394  | 6/6         | 0.948 / 0.960 / 0.945                 | 5                                 | 5 / 0 / 0                                                     | none                                                                                                                                       | 0.0%     |
| pipe-isarray-first           | b2    | 118    | 0.949, 0.944, 0.949, 0.952, 0.950, 0.949 | 0.9489  | 6/6         | 0.974 / 0.962 / 0.969                 | 9                                 | 8 / 1 / 0                                                     | none                                                                                                                                       | 0.0%     |
| pipe-last-index              | b6    | 36     | 0.993, 0.998, 0.994, 0.995, 0.995, 0.999 | 0.9957  | 6/6         | 0.999 / 0.997 / 1.001                 | 4                                 | 4 / 0 / 0                                                     | none                                                                                                                                       | 0.0%     |
| pipe-on-demand-segments      | b1    | 59     | 0.984, 0.984, 0.982, 0.980, 0.989, 0.987 | 0.9845  | 6/6         | 0.992 / 0.994 / 0.995                 | 1                                 | 1 / 0 / 0                                                     | none                                                                                                                                       | 0.0%     |
| pipe-single-step-runs        | b2    | 59     | 0.960, 0.980, 0.981, 0.982, 0.953, 0.982 | 0.9729  | 6/6         | 0.990 / 0.993 / 0.991                 | 0                                 | 0 / 0 / 0                                                     | none                                                                                                                                       | 0.0%     |
| pipe-skip-identity           | b6    | 116    | 0.999, 0.999, 1.003, 0.999, 1.002, 1.003 | 1.0008  | 3/6         | 1.002 / 1.003 / 1.006                 | 10                                | 9 / 0 / T2 G1b pipe zip+map S 1.078 (v/b 1.042)               | T1 G1 map+filter+map C 1.054; T2 G1 flat+map S 1.057; T2 G1 flat+map C 1.102; T2 G1b pipe flatMap+map C 1.060; T1 G1b pipe map+map C 1.076 | 0.0%     |
| purry-arity-calls            | b5    | 156    | 0.972, 0.970, 0.975, 0.972, 0.975, 0.972 | 0.9727  | 6/6         | 0.991 / 0.980 / 0.989                 | 10                                | 9 / 0 / T2 G7 clamp data-last C 1.085 (v/b 1.067)             | T1 G7 mapValues data-first C 1.142; T2 G7 clamp data-last C 1.067                                                                          | 0.0%     |
| requiredata-direct-write     | b3    | 150    | 0.991, 0.991, 1.007, 1.012, 1.009, 0.990 | 1.0001  | 3/6         | 1.003 / 1.010 / 0.997                 | 13                                | 12 / 0 / T2 G1b pipe take+map XS 1.090 (v/b 1.008)            | T2 G5 data-first zip C 1.767                                                                                                               | 0.2%     |
| requiredata-positional-index | b6    | 156    | 1.000, 1.001, 1.002, 1.000, 0.998, 1.002 | 1.0007  | 2/6         | 1.000 / 1.000 / 0.999                 | 9                                 | 9 / 0 / 0                                                     | none                                                                                                                                       | 0.0%     |
| sentinel-module              | b1    | 106    | 1.001, 0.999, 0.998, 1.003, 1.000, 0.999 | 1.0001  | 4/6         | 1.000 / 1.000 / 0.999                 | 6                                 | 2 / 4 / 0                                                     | none                                                                                                                                       | 0.0%     |
| single-array-index-loop      | b3    | 138    | 0.893, 0.891, 0.920, 0.918, 0.919, 0.920 | 0.9100  | 6/6         | 0.933 / 0.952 / 0.912                 | 12                                | 11 / 0 / T2 G1b pipe zip+map S 1.059 (v/b 1.005)              | none                                                                                                                                       | 0.5%     |
| single-skip-first            | b7    | 88     | 0.999, 0.992, 1.004, 1.011, 0.996, 1.002 | 1.0007  | 3/6         | 1.000 / 0.996 / 1.001                 | 8                                 | 8 / 0 / 0                                                     | none                                                                                                                                       | 0.0%     |
| single-skip-identity         | b4    | 76     | 0.973, 0.972, 0.971, 0.970, 0.970, 0.976 | 0.9719  | 6/6         | 0.996 / 0.997 / 0.981                 | 9                                 | 9 / 0 / 0                                                     | T1 G1 map C 1.059; T1 G1b pipe map S 1.046; T2 G4 string unique S 1.075                                                                    | 0.0%     |
| unique-single-lookup         | b4    | 13     | 0.993, 0.986, 0.983, 0.986, 0.978, 0.984 | 0.9849  | 6/6         | 0.995 / 0.992 / 1.001                 | 7                                 | 7 / 0 / 0                                                     | none                                                                                                                                       | 0.0%     |

TABLE extras

| environment   | runtime             | T1 gm (n)  | T2 gm (n)  | T3 gm (n)  | floors T1/T2/T3   | bar violations (median; branch first / main first)                                                                                                                                                                        |
| ------------- | ------------------- | ---------- | ---------- | ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| jitless       | v26.9.0 --jitless   | -          | -          | 0.724 (64) | -/-/0.015         | none                                                                                                                                                                                                                      |
| maxopt1       | v26.9.0 --max-opt=1 | -          | -          | 0.710 (64) | -/-/0.026         | none                                                                                                                                                                                                                      |
| maxopt2       | v26.9.0 --max-opt=2 | -          | -          | 0.768 (64) | -/-/0.048         | none                                                                                                                                                                                                                      |
| p0            | v26.9.0             | 0.693 (12) | 0.712 (21) | 0.608 (15) | 0.013/0.130/0.225 | T1 G10 filter,map(pick) / groupBy / entries / map / fromEntries C 1.044 (1.048/1.039)                                                                                                                                     |
| p1            | v26.9.0             | 0.823 (12) | 0.849 (21) | 0.798 (15) | 0.022/0.022/0.024 | T1 G10 filter,map / sortBy / take / groupBy C 1.107 (1.105/1.109); T2 G10 filter,map / sortBy / take / groupBy M 1.146 (1.137/1.156); T2 G2 deep-8 mixed M 1.115 (1.115/1.115); T2 G2 deep-15 mixed M 1.127 (1.126/1.127) |
| node22        | v22.23.3            | 0.874 (57) | 0.745 (7)  | -          | 0.039/0.010/-     | none                                                                                                                                                                                                                      |
| node24        | v24.21.0            | 0.870 (57) | 0.738 (7)  | -          | 0.046/0.012/-     | T1 G3 scalar arrows depth-3 x64 1.347 (1.347/1.347); T1 G7 mapValues data-first C 1.171 (1.223/1.120)                                                                                                                     |
| bundle        | v26.9.0             | 0.768 (16) | 0.738 (7)  | -          | 0.045/0.013/-     | none                                                                                                                                                                                                                      |
| cjs           | v26.9.0             | 0.760 (16) | 0.719 (7)  | -          | 0.158/0.168/-     | none                                                                                                                                                                                                                      |
| bun           | bun 1.4.2           | 0.807 (57) | 0.616 (7)  | -          | 0.064/0.025/-     | T1 G5 data-first uniqueBy (reads data) XS 1.384 (1.436/1.333)                                                                                                                                                             |
| portable-node | node v26.9.0        | 0.857 (57) | 0.745 (7)  | -          | 0.048/0.015/-     | T1 G7 mapValues data-first C 1.053 (1.056/1.050)                                                                                                                                                                          |
| isolated      | node v26.9.0        | 0.780 (16) | 0.745 (7)  | -          | 0.040/0.032/-     | T1 G3 scalar arrows depth-3 x64 1.045 (1.045/1.045)                                                                                                                                                                       |

TABLE bundle

| import                             | bundler  | main min/gzip | branch min/gzip       | sentinel-module min/gzip | identity-controls-v2 min/gzip | combo min/gzip        |
| ---------------------------------- | -------- | ------------- | --------------------- | ------------------------ | ----------------------------- | --------------------- |
| import { map }                     | esbuild  | 350/249       | 1125/635 (sentinel)   | 360/249                  | 1125/635 (sentinel)           | 603/303               |
| import { map }                     | rolldown | 351/247       | 1134/636 (sentinel)   | 359/248                  | 1134/636 (sentinel)           | 598/302               |
| import { filter, map }             | esbuild  | 500/289       | 1310/722 (sentinel)   | 545/335                  | 1264/697 (sentinel)           | 811/408               |
| import { filter, map }             | rolldown | 505/293       | 1313/722 (sentinel)   | 538/334                  | 1271/701 (sentinel)           | 804/404               |
| import { pipe }                    | esbuild  | 921/520       | 2317/1151 (sentinel)  | 2051/1040 (sentinel)     | 2424/1189 (sentinel)          | 2627/1222 (sentinel)  |
| import { pipe }                    | rolldown | 922/517       | 2310/1135 (sentinel)  | 2044/1019 (sentinel)     | 2421/1166 (sentinel)          | 2620/1202 (sentinel)  |
| import { pipe, map, filter, take } | esbuild  | 1577/783      | 3071/1453 (sentinel)  | 2809/1340 (sentinel)     | 3068/1464 (sentinel)          | 3448/1525 (sentinel)  |
| import { pipe, map, filter, take } | rolldown | 1584/770      | 3072/1427 (sentinel)  | 2806/1313 (sentinel)     | 3079/1454 (sentinel)          | 3445/1502 (sentinel)  |
| import { unique }                  | esbuild  | 1248/671      | 1447/826 (sentinel)   | 1181/722 (sentinel)      | 1480/815 (sentinel)           | 1527/844 (sentinel)   |
| import { unique }                  | rolldown | 1249/661      | 1440/804 (sentinel)   | 1174/700 (sentinel)      | 1477/801 (sentinel)           | 1520/821 (sentinel)   |
| whole library                      | esbuild  | 28146/9118    | 29287/9770 (sentinel) | 29030/9631 (sentinel)    | 29339/9817 (sentinel)         | 29663/9834 (sentinel) |
| whole library                      | rolldown | 28166/9088    | 29307/9695 (sentinel) | 29052/9562 (sentinel)    | 29365/9757 (sentinel)         | 29685/9768 (sentinel) |
