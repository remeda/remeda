# PR #1444 main stage: analysis and design A/B (A8)

Branch `eranhirsch/performantPipe` at 144fdc8b vs main 8e6e78f6. Inputs: the 76-step `main` stage (run by `watch-and-run.sh`, 2026-10-07 13:15-21:59), `results/main/*`, `logs/`, `variants/`, `research/popularity.json`, `tier-overrides.json`. Part 2 adds two builds and one relative screen run in the agent sandbox (relative numbers only).

Every number is recomputed by the scripts in `a8/`. They reproduce the official aggregates exactly (full matrix T1 0.854 / T2 0.789 / T3 0.738, with 10 / 4 / 0 bar violations).

- Key numbers: `analysis-main.json`.
- Raw: `a8/part1.json`, `a8/part1b.json`, `a8/part2.json`, `a8/part2-sens.json`, `a8/part1-tables.md`.

Conventions:

- Ratios are copy/reference; below 1 = faster.
- "gm" is the popularity-weighted geomean of the per-scenario median ratio (weights high 4, mid 2, low 1).
- "Floor" is the p95 of |main-aa/main - 1| over the tier's (scenario, run) pairs, in the same runs.

## Summary

- **Branch vs main (full matrix).** T1 0.854, T2 0.789, T3 0.738.
  - 10 tier 1 bar violations: 9 are one G3 deopt cluster, 1 is `3-step middle reads data XS`.
  - 4 tier 2 bar violations, 1 of them noise.
- **combo.patch (18 survivors).** T1 0.694 / T2 0.640 vs main. Every branch regression is gone except one bimodal noise entry.
- **Variants.** 7 ADOPT (plus pipe-on-demand-segments, contained in pipe-single-step-runs), 1 INCONCLUSIVE, 10 REJECT.
- **Part 2.** combo-A T1 0.702 / T2 0.661; combo-B T1 0.657 / T2 0.559; B/A 0.935 / 0.845. Neither has a tier-bar violation vs main.
  - By the agreed rule, design B ranks first.
  - The trade-offs are map-heavy pipes (A is faster) and Vue tracking (both regress, through the indexed loops).

## Part 1: digest of the main stage

### 1. Data quality

**A/A floors (T1/T2/T3) and false calls:**

- **Full matrix:** 0.031/0.031/0.033. False calls: 1 tier 1 (`G3 pipe(x, add(1)) x64`, faster) and 1 tier 2 (`G3 array sortBy+groupBy M`, a bar call at 1.065).
- **combo runs:** 0.099/0.105, inflated by a position interaction.
- **Batches:**
  - b1 and b4-b7: 0.030-0.037;
  - b2 and b3: about 0.09-0.10, from the position interaction;
  - pooled: 0.044/0.056/0.052;
  - A/A false calls 0-1 per batch, never a bar call.
- **Extras:** 0.013-0.064 (CJS 0.158).

**Position interaction:**

- In b2/b3 rotations 1-2, and in combo-r1 and the A8 screen r0, A/A is offset by +3-5% over every scenario. There, main-aa runs before the batch's variant copies and main after them.
- Load is normal, so it isn't the machine. It inflates the floors (lenient bars vs main).
- Variant-vs-branch sign tests are unaffected.

**Bimodal noise entries, for every copy including main-aa:** `G7 mapValues/mergeDeep/isDeepEqual` at C (about 150 vs 210 us at random), and `G5 data-first zip` at S/C (1x vs 2.5x).

**Load and idle:** all on AC power. There was user input during 7 measuring steps; only vb-b7-r5 is visibly noisier. Details: `a8/watch-activity.txt`.

**The G3 deopt is bimodal.** Every multi-function G3 entry flips together:

- deopt mode: 1.24-1.36x main for scalar arrows, 1.10-1.16x for scalar purry;
- fast mode: 0.88-0.95x.

It hits the branch in both full-matrix rotations, in 39 of 42 batch runs, and on Node 24 vitest+dist. It doesn't show on Node 22, Bun, bundle, CJS, the portable runner, jitless or max-opt 1/2. One copy per process gives 1.045x. On-demand segments (pipe-on-demand-segments, pipe-single-step-runs, combo) never deopt: 0.58-0.60x main.

### 2. Branch vs main (full matrix)

**T1 0.854** (faster 79, neutral 64, regression 10), **T2 0.789** (faster 105, neutral 64, regression 4), **T3 0.738** (faster 148, slower 2, no BLOCK). Without the G3 cluster, T1 is 0.831.

T1 by group:

| G1    | G1b   | G3    | G5    | G6    | G7    | G10   |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 0.702 | 0.741 | 0.976 | 0.809 | 0.861 | 1.000 | 0.841 |

**Bar violations** (floor 0.031):

- **T1:**
  - G1 `3-step middle reads data XS` 1.075;
  - G3 scalar arrows depth-3 x64/x1 1.350/1.243, depth-10 x64/x1 1.351/1.281;
  - G3 scalar purry depth-3 x64/x1 1.148/1.138, depth-10 x64/x1 1.105/1.108;
  - G3 object pick+omit+set+merge x64 1.055.
- **T2:**
  - G1b `pipe zip+map S` 1.070;
  - G7 `clamp data-last C` 1.051 (p75 on a timer step; means 1.015/1.041);
  - G7 `mergeDeep data-last C` 1.230 (noise: runs 1.037/1.423, a function the branch doesn't touch);
  - G9 `map((...args) => args[0])+filter XS` 1.127.

**Clusters:**

1. **G3, the deopt** on the up-front step array that the branch builds for every 2+ function pipe.
2. **Fixed per-call setup of short lazy runs at XS:** the step array, the run array, step objects, and the `Object.assign` stamp plus the items buffer for data-reading evaluators. The same entries are 0.55-0.79x main at S and C.
3. **`pipe zip+map S`:** a pair allocated per item, a `lastLazyValue` at the end, and the `in` probe on every pair.
4. **`clamp data-last C`:** purry's data-last path changed shape. datalast-arity-closures takes it to 0.94x the branch.

**Tier 3:** G8 pass-through Proxy items C/M are slower (1.129/1.089). The `in` probe fires 11,223 `has` traps per call at C, against 0 for main and for identity-controls-v2.

### 3. combo.patch (18 variants) vs main and branch

**T1 0.694 / T2 0.640 vs main; 0.800 / 0.798 vs branch.**

T1 by group vs main:

| G1    | G1b   | G3    | G5    | G6    | G7    | G10   |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| 0.492 | 0.519 | 0.762 | 0.697 | 0.648 | 0.984 | 0.658 |

**The branch's regressions disappear:**

- G3 0.58-0.82x;
- G9 0.740;
- the data-reading XS cluster 0.63-0.74x;
- `clamp data-last C` 0.999.

Left: `G7 mapValues data-first C` 1.241, the bimodal noise entry (combo/branch 1.059, neutral).

### 4. Variant confirmation

There were 42 runs: 7 batches next to main/branch/main-aa, rotations 0-5, scale 0.5, T1G + targets.

**How the bar was applied:** each variant is charged only with (a) its own losses vs the branch, and (b) violations vs main the branch doesn't share, excluding the G3 position lottery. Read literally ("no tier-bar violation vs main"), only pipe-single-step-runs passes. This reading is for the maintainer to confirm.

**ADOPT** (6/6 on their flow, no loss vs branch):

| variant                   | flow geomean | notes                                                                                 |
| ------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| pipe-single-step-runs     | 0.973        | no violation at all; removes the G3 cluster; contains pipe-on-demand-segments (0.984) |
| pipe-array-index-loop     | 0.939        | Vue cost, see Part 2                                                                  |
| pipe-isarray-first        | 0.949        |                                                                                       |
| map-callback-as-evaluator | 0.942        | incompatible with identity-controls-v2                                                |
| single-array-index-loop   | 0.910        | the largest T1 gain (0.933); Vue cost                                                 |
| datalast-direct-props     | 0.886        |                                                                                       |
| unique-single-lookup      | 0.985        | on a 13-entry flow                                                                    |

**INCONCLUSIVE:** `requiredata-direct-write`. It fails on its declared 150-entry flow (3/6, 1.0001), which is mostly off its code path, but it is 6/6 faster on the 19 entries whose callbacks read `data` or have length 0 (XS 0.85-0.97).

**REJECT:**

- `datalast-arity-closures`: 6/6 at 0.9911, under the bar. It would repair `clamp data-last C` (0.94x), which is outside its declared flow.
- `lazy-args-arity` (0.9949) and `pipe-last-index` (0.9957): under the bar.
- `purry-arity-calls`: T2 `clamp data-last C` 1.067 vs branch in all 6 runs.
- `single-skip-identity`: T1 `map C` 1.059 and `pipe map S` 1.046.
- `pipe-skip-identity`: 3/6, with losses on map-heavy pipes.
- `single-skip-first`, `requiredata-positional-index`, `first-index-access`: no effect.

**Design candidates:**

- **identity-controls-v2:** 6/6 at 0.849 on its flow; vs branch 0.911 / 0.832 / 0.787 (T1/T2/T3), with no loss in any tier.
  - G8 item kinds at C: 0.47-0.66x main.
  - Proxy items: 0 `has` traps, the same as main.
- **sentinel-module:** timing-neutral (1.0001). Bundle, min/gz:

| import            | main       | branch     | sentinel-module |
| ----------------- | ---------- | ---------- | --------------- |
| `{ map }`         | 350/249    | 1125/635   | 360/249         |
| `{ filter, map }` | 500/289    | 1310/722   | 545/335         |
| `{ pipe }`        | 921/520    | 2317/1151  | 2051/1040       |
| whole library     | 28146/9118 | 29287/9770 | 29030/9631      |

### 5. Extras (branch vs main only; combos weren't run here)

- **Lower tiers** (`--jitless`, `--max-opt=1`, `--max-opt=2`): T3 0.724 / 0.710 / 0.768, with no violations.
- **Pollution profiles:**
  - **P0:** T1 0.693, with a T1 violation on `G10 filter,map(pick)/groupBy/entries/map/fromEntries C` at 1.044.
  - **P1:** T1 0.823, with violations on T1 `G10 filter,map/sortBy/take/groupBy C` 1.107, T2 the same at M 1.146, and T2 G2 deep-8 and deep-15 mixed at M 1.115 / 1.127. Tier 3: G2 deep object at M 1.23 / 1.26, and G1 drop+take 1.14 / 1.06.
- **Node versions:** Node 22 T1 0.874, with no violations. Node 24 T1 0.870, with the G3 deopt at 1.347.
- **Loading modes:** bundle 0.768 and CJS 0.760; no violations (the CJS floors are wide).
- **Bun:** T1 0.807, with a T1 violation on `G5 data-first uniqueBy (reads data) XS` at 1.384.
- **Portable runner on Node:** T1 0.857.
- **One copy per process:** T1 0.780, with G3 depth-3 x64 at 1.045.
- **Memory:** allocation 0.06-0.77x main's bytes per call (data-first map 1.00x); GC time equal to 57x lower. Peak heap at or below main everywhere except `map reading data` (1.005).
- **Cold start:** import +2%; first call 0.56-0.93x; first 50 calls 0.49-0.93x.
- **Reactive probes:** 41 tracked dependencies vs 31 in Vue and MobX; the extra 10 are on `$$remedaLazyRef`. Re-evaluation +5-6%.

### 6. Conflicts with the design candidates

- **No conflict with identity-controls-v2:** pipe-single-step-runs, datalast-direct-props, unique-single-lookup.
- **Portable onto identity-controls-v2:** pipe-array-index-loop, pipe-isarray-first, single-array-index-loop, sentinel-module.
- **Incompatible:** map-callback-as-evaluator. v2 calls every evaluator as (item, index, data, slot), so the user's callback would receive the slot as a 4th argument.
- **Sentinel-module:** conflicts textually with map-callback-as-evaluator and single-array-index-loop, and both are portable.

## Part 2: design A vs design B

- **combo-A** (`variants/combo-a.patch`): the 7 ADOPT variants plus sentinel-module, on the current controls.
- **combo-B** (`variants/combo-b.patch`): identity-controls-v2, plus every compatible ADOPT variant (ported by hand), plus sentinel-module. map-callback-as-evaluator is dropped.
- **Both:** pass the full checks (100% coverage, prop, types, tsc, eslint, prettier, ASCII) and validate with 0 output and 0 trace mismatches (233M traced calls). Cross-copy 480/480.

**Screen** (sandbox, relative): main, combo-a, combo-b, main-aa, branch; rotations 0-2; T1+T2 plus G8 Proxy; scale 0.5. r0 shows the position offset; r1 and r2 are clean (floors 0.035/0.036).

| comparison        | T1 gm (per run)             | T2 gm | G8 Proxy C / M |
| ----------------- | --------------------------- | ----- | -------------- |
| combo-A / main    | 0.702 (0.684, 0.703, 0.705) | 0.661 | 0.993 / 1.036  |
| combo-B / main    | 0.657 (0.639, 0.658, 0.660) | 0.559 | 0.589 / 0.607  |
| combo-B / combo-A | 0.935 (0.934, 0.936, 0.936) | 0.845 | 0.576 / 0.586  |
| branch / main     | 0.868                       | 0.799 | 1.094 / 1.112  |

**No tier 1 violation vs main for either design.** Both show only `clamp data-last C` at 1.051 (T2, the branch's own quantization entry).

**Where each design is slower than the other:**

- **B is slower than A** on 13 T1 and 6 T2 entries: map-heavy pipes (map, map+map, map+filter+map at XS-M, up to 1.31x at C), `pipe unique+map XS` 1.05, and `generator map+filter S/M` 1.06/1.09. Cause: map-callback-as-evaluator, which is in A only.
- **A is slower than B** on 144 entries:
  - pipe zip S/C 2.35x / 2.55x;
  - pipe take C 2.24x;
  - pipe filter C 1.83x;
  - data-first difference S-M 1.67-1.89x;
  - uniqueBy 1.35-1.55x;
  - G8 Proxy items 1.7x;
  - the Prisma shape `difference(range)` at C/M 1.08x / 1.11x.

**Traps:** combo-A 11,223 `has` per call at C, like the branch; combo-B 0, like main.

**Reactive probes:**

| copy                 | Vue deps | Vue re-eval (us) | MobX deps |
| -------------------- | -------- | ---------------- | --------- |
| main                 | 31       | 5.63             | 31        |
| branch               | 41       | 5.87             | 41        |
| identity-controls-v2 | 31       | 5.29             | 31        |
| combo-A              | 60       | 9.37             | 41        |
| combo-B              | 50       | 8.79             | 31        |

- **Cause of the extra Vue dependencies:** pipe-array-index-loop (alone it reads 60 deps and 9.46 us) and single-array-index-loop (`pipe(items, find(...))` 44 vs 23 deps). Indexed reads of a Vue reactive array are tracked per index, where for...of tracks one iteration dependency. MobX is unaffected.
- **An untested fix:** an array-only for...of loop.

**Bundle (min/gz):**

- `{ map }`: A 324/229, B 348/248 (main 350/249).
- `{ pipe }`: A 2368/1132, B 2493/1169 (main 921/520).
- Whole library: A 29391/9769, B 29435/9798 (main 28146/9118).
- Public declarations are identical to the branch's.

**Lexicographic, Tier 1 first: B ranks first.** Neither design has a Tier 1 violation vs main, and B's Tier 1 gm is 6.5% lower in every run; Tier 2 agrees. A's case is map-heavy lazy pipes. Neither combo has been run under P0/P1, Node 24, Bun or one copy per process, where the branch has Tier 1 violations; the publication pass covers that.
