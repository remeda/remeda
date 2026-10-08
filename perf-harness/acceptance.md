# PR #1444 publication run: acceptance

Run: stage `publication`, 59 steps, 2026-10-08 12:08-17:04 IDT, launched from the maintainer's terminal through `watch-and-run.sh`. Branch `ad8d37be` vs main `8e6e78f6`. Inputs: `results/publication/*`, `logs/publication.log`, `logs/watch.log`. All numbers recomputed from the raw runs with `a8/lib.mjs`; they match `agg-*.md`. Tables behind every number: `summary-data.md`.

Run health:

- Every step finished (`DONE-publication`), every run's meta has `exitCode` 0, and the log has no errors.
- Each worker's `[perf setup]` line confirms what its step asked for: `jitless=true` (32 workers), `maxOpt=1` and `maxOpt=2` (32 each), Node 22.23.3 and 24.21.0 (32 each), Bun 1.4.2, `source=bundle` and `source=cjs` (20 each), `pollution=P0` and `P1` (12 each).
- Validation before measuring: dist 526 scenarios, 18,643,488 traced calls, 0 output and 0 trace mismatches, cross-copy 20/20. CJS and bundle: 118 scenarios each, 0 mismatches.
- Machine: AC power in every run. 1-minute load 0.97-2.62. The watcher's idle counter rose monotonically from 6,077 s to 23,856 s, so there was no user input during the stage.

## Verdict: NEEDS-DECISION

Every tier bar passes on Node 26 and in every environment: 0 bar violations in 13 run sets. The reactive counts are recorded and equal main's. One criterion fails as written: `import { unique }`, which has no `pipe`, bundles the sentinel Proxy and its message with both bundlers. This is structural, not noise. `unique` and the other lazy-only functions run the single-step lazy runner, which imports the sentinel. Every candidate since `sentinel-module` (main stage) has done this, cand-full (prepub) included. If the criterion meant data-first imports that don't run lazy code, this run passes. If it meant every import set without `pipe`, the run fails until the code changes. The maintainer decides (F1).

## 1. Criteria

| criterion                                                                                           | result               | evidence                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tier bars, Node 26 V8 (full matrix, 6 runs)                                                         | PASS                 | Tier 1: 153 scenarios, 0 regressions (floor 0.038, gm 0.680). Tier 2: 173 scenarios, 0 regressions (floor 0.027, gm 0.596). Tier 3: 200 scenarios, 0 BLOCK and 0 slower (gm 0.501). A/A false calls: 0 in 526. Per-run tier 1 gm 0.679-0.684.                                                                                                                                                                     |
| Bundle: no import set without `pipe` contains the sentinel Proxy or its message (esbuild, rolldown) | FAIL as written (F1) | `{ map }` and `{ filter, map }` contain neither. `{ unique }` contains both, with both bundlers. `bundle.md` shows "sentinel message: no" everywhere, which is a false negative (see F1).                                                                                                                                                                                                                         |
| Reactive probes: counts recorded                                                                    | PASS (recorded)      | Vue: 31 dependencies (main 31), 0 on the control key, 31 onTrack events. MobX: 31 (main 31), 0 on absent keys. Re-evaluation 0.949 (Vue) and 0.935 (MobX) of main. G8 Proxy items: `has` 0, `get` 10,240 per call at C and 1,600 at M, equal to main. Gap: `vue-shapes.mjs` (per-shape Vue dependencies) did not run at this SHA. The last reading is prepub's cand-full: 31 / 23 / 2 / 23 / 1002, equal to main. |
| Environments: same bars, failures to the maintainer                                                 | nothing to triage    | 0 bar violations in Node 22, Node 24, Bun, the bundle, CJS, P0, P1, the second runner, one copy per process, `--jitless`, `--max-opt=1` and `--max-opt=2`. The only non-neutral, non-faster verdicts are tier 3 "slower" (report only) on `G7 entries data-last` in the lower JIT tiers (F2).                                                                                                                     |

Environment caveats (no effect on the verdict):

- **CJS floors are wide (T1 0.155, T2 0.167).** A position offset in rotation 0 put main-aa/main at a geomean of 1.064 and 1.067 in the two r0 runs (1.00 in r1). The highest branch median in CJS is 1.034 (`G5 data-first filter S`), so the wide floor hid nothing above 3.4%.
- **P0 tier 2 and 3 floors are wide (0.143, 0.236)** from a similar offset: A/A tier 3 gm 0.922 in r0 and 1.084-1.089 in r1. Every P0 scenario is faster (worst 0.843).
- **Bun and the second runner cover tier 1 only, by design** (subset `T1`). The bundle, CJS and one-copy-per-process runs cover the 23 headline scenarios.

## 2. Flagged scenarios

### F1. `import { unique }` bundles the sentinel (bundle criterion)

| import            | bundler            | main min / gzip      | branch min / gzip    | sentinel Proxy | sentinel message |
| ----------------- | ------------------ | -------------------- | -------------------- | -------------- | ---------------- |
| `{ unique }`      | esbuild            | 1248 / 671           | 1376 / 746           | yes            | yes              |
| `{ unique }`      | rolldown           | 1249 / 661           | 1373 / 729           | yes            | yes              |
| `{ map }`         | esbuild / rolldown | 350 / 249, 351 / 247 | 448 / 271, 443 / 271 | no             | no               |
| `{ filter, map }` | esbuild / rolldown | 500 / 289, 505 / 293 | 634 / 365, 631 / 371 | no             | no               |

- **Per-run and A/A ratios:** none. This is a deterministic build output, checked directly in `.bundle-work/branch-import_unique_.*.out.js`. main has neither marker in any import set.
- **The message column in `bundle.md` is a false negative.** `scripts/bundle-size.mjs` searches for the old wording ("argument was read, but Remeda didn't provide it"), which the final message no longer contains. A direct search for the final wording finds the message in exactly the outputs that have the Proxy: `{ pipe }`, `{ pipe, map, filter, take }`, `{ unique }` and the whole library.
- **Known bimodal noise entry:** no.
- **PR touches the path:** yes.
  - The chain: `processSingleLazyStep.ts` imports `unexpectedAccessSentinel.ts`, and `purryFromLazy` imports `processSingleLazyStep`.
  - Every lazy-only function therefore carries the sentinel in its bundle: `unique`, `uniqueBy`, `uniqueWith`, `difference`, `differenceWith`, `intersection`, `intersectionWith`, `mapWithFeedback`.
  - A user callback can only reach the sentinel through `uniqueBy` and `mapWithFeedback`; for the others it is dead weight.
  - Size: the sentinel code is about 500 B minified of the 1376 B `{ unique }` bundle, and about 285 B of its 746 B gzipped. Without it, `{ unique }` would be about 460 B gzipped, against main's 671.
  - On main, `{ unique }` pulled in all of `pipe`, because main's `purryFromLazy` imported `pipe`.
- **History:** "sentinel Proxy: yes" for `{ unique }` in every copy since the main stage, including `branch-v-sentinel-module`, and in all four prepub candidates.
- **Verdict: needs the maintainer.** Options:
  - (a) Accept, and restate the criterion as "no import set that doesn't run lazy code". The non-lazy data-first imports (`map`, `filter`, every plain-`purry` function) are clean.
  - (b) Keep the sentinel out of `processSingleLazyStep`, for example by letting the lazy implementation choose the placeholder for `data`. It only matters for `uniqueBy` and `mapWithFeedback`.
  - (c) Follow-up idea 2 (direct data-first paths for the lazy-only functions). That removes the runner from their data-first calls, but not from their data-last calls outside `pipe`.
- **PR text:** `summary-1444.md`'s bundle details block says the error helper ships with `pipe` and with the lazy-only functions. Change it if the code changes.

### F2. `G7 entries data-last` in the lower JIT tiers (tier 3 "slower", report only)

| run set       | size | median | branch/main per run            | A/A per run                |
| ------------- | ---- | ------ | ------------------------------ | -------------------------- |
| `--jitless`   | XS   | 1.052  | 1.058m, 1.039m, 1.053b, 1.051b | 1.015, 0.985, 1.018, 1.008 |
| `--max-opt=1` | XS   | 1.063  | 1.068m, 1.058m, 1.048b, 1.081b | 0.998, 1.005, 1.002, 1.017 |
| `--max-opt=1` | S    | 1.060  | 1.066m, 1.054m, 1.039b, 1.065b | 1.011, 1.000, 1.000, 1.005 |

`m` = main ran first, `b` = the branch ran first.

- **Known bimodal noise entry:** no. The ratio is consistent in both orders, and A/A stays within 1.8%.
- **PR touches the path:** yes. Data-last calls of the plain-`purry` functions now go through `lazyDataLastImpl`, which builds the closure in `createDataLast` (a switch on the argument count; commit `a0e9ffff`).
  - The pattern is wider than `entries`: plain-`purry` data-last calls at XS and S (and `pick` at C) are 1.02-1.06 under `--jitless` and `--max-opt=1` (`omit`, `mapValues`, `isDeepEqual`, `groupBy`, `pick`; table in `summary-data.md` section 2).
  - With Maglev or full JIT they are 0.95-1.01: `entries` XS/S is 1.004 / 1.000 at `--max-opt=2` and 0.995 / 1.000 on Node 26.
  - The per-arity helper is the likely cause: one extra call and a switch per data-last creation, which only the optimizing tiers inline. Not verified by ablation.
- **Verdict: real, small, accepted by the tier 3 rule.** No BLOCK: that needs every run at 1.25 or more, and the worst run is 1.081. The PR summary mentions it under "Next steps" (revisiting the per-arity helper).

### F3. A/A false calls (second runner on Node 26)

| scenario                    | size | A/A median | A/A per run                | branch/main per run                           |
| --------------------------- | ---- | ---------- | -------------------------- | --------------------------------------------- |
| `G7 isDeepEqual data-first` | C    | 1.059      | 1.073, 1.045, 0.988, 1.086 | 1.018m, 1.000m, 0.982b, 0.989b (median 0.995) |
| `G7 range data-first`       | C    | 1.034      | 1.003, 1.064, 1.002, 1.139 | 1.000m, 1.024m, 1.006b, 1.173b (median 1.015) |

- **Known bimodal noise entry:** `isDeepEqual` C is one.
  - `range` C: in run r1-b, main-aa (154 us) and the branch (158 us) were both slow against main (135 us), a slow mode shared within one process.
- **PR touches the path:** only `purry`'s dispatch line, which every plain-`purry` function shares. The A/A calls are main against main, so they can't come from the PR.
- **Verdict: noise.** These two false calls are the only ones in 1,762 scenario judgments across all run sets. Both are tier 1 bar calls, the false-call rate is 0.2% in tier 1, and the branch's own verdicts here are neutral.

### F4. Tier 1 scenarios with one run order beyond the floor (neutral by the rule; watch list)

| run set              | scenario                  | size | median | branch/main per run                            | A/A per run                              | known bimodal     | touches                                                          | verdict        |
| -------------------- | ------------------------- | ---- | ------ | ---------------------------------------------- | ---------------------------------------- | ----------------- | ---------------------------------------------------------------- | -------------- |
| Node 26              | G7 mapValues data-first   | C    | 1.015  | 0.961m, 1.015m, 1.394b, 1.383b, 1.014m, 0.987m | 0.961, 0.983, 1.028, 0.991, 0.982, 1.009 | yes               | `purry` dispatch only                                            | noise          |
| Node 26              | G7 mapValues data-last    | C    | 0.982  | 1.020m, 0.925m, 0.944b, 1.291b, 1.076m, 0.759m | 0.841, 1.100, 0.829, 1.056, 0.826, 0.758 | yes (same family) | `purry` data-last path                                           | noise          |
| Node 26              | G7 isDeepEqual data-first | C    | 0.981  | 0.957m, 1.090m, 0.982b, 1.102b, 0.930m, 0.981m | 0.983, 1.093, 1.009, 1.012, 0.968, 1.020 | yes               | `purry` dispatch only                                            | noise          |
| Node 26              | G7 groupBy data-first     | XS   | 1.021  | 1.017m, 0.977m, 1.064b, 1.038b, 1.025m, 0.977m | 0.978, 0.967, 1.008, 1.006, 1.023, 1.013 | no                | `purry` dispatch only                                            | noise          |
| Node 22              | G7 mapValues data-first   | C    | 0.988  | 0.957m, 1.020m, 1.368b, 0.931b                 | 0.988, 1.092, 0.958, 0.962               | yes               | `purry` dispatch only                                            | noise          |
| Node 24              | G7 isDeepEqual data-first | C    | 1.012  | 1.022m, 0.998m, 1.002b, 1.089b                 | 0.955, 0.999, 1.014, 1.103               | yes               | `purry` dispatch only                                            | noise          |
| Node 24              | G7 groupBy data-first     | XS   | 1.001  | 0.963m, 0.979m, 1.058b, 1.023b                 | 0.965, 0.972, 0.997, 0.997               | no                | `purry` dispatch only                                            | noise          |
| Bun                  | G5 data-first filter      | XS   | 1.035  | 1.026m, 1.209m, 1.045b, 0.943b                 | 1.046, 1.056, 1.018, 0.995               | no                | `purry` dispatch only (`filter` data-first is `data.filter(fn)`) | noise          |
| second runner        | G7 mapValues data-first   | C    | 1.045  | 0.928m, 1.043m, 1.053b, 1.046b                 | 0.973, 1.000, 1.105, 0.967               | yes               | `purry` dispatch only                                            | noise          |
| second runner        | G7 range data-first       | S    | 1.007  | 1.005m, 1.005m, 1.010b, 1.119b                 | 0.997, 0.957, 0.994, 0.998               | no                | `purry` dispatch only                                            | noise          |
| second runner        | G7 range data-first       | C    | 1.015  | 1.000m, 1.024m, 1.006b, 1.173b                 | 1.003, 1.064, 1.002, 1.139               | no                | `purry` dispatch only                                            | noise (see F3) |
| one copy per process | G5 data-first map         | S    | 1.014  | 1.134m, 1.017m, 1.000b, 1.011b                 | 1.006, 0.989, 0.994, 1.000               | no                | `purry` dispatch only                                            | noise          |

Readings:

- **`mapValues`, `isDeepEqual` at C.** These are the known bimodal entries: about 150 vs 210 us, at random, for every copy.
  - Here the slow mode hit the branch in both rotation-1 runs (205-212 us against main's 147-153).
  - In the main stage the same mode hit main (210, 214, 204, 193 us), main-aa (202, 204) and variants.
  - In the main-first order their medians are 0.97-1.01.
- **`groupBy data-first XS`** is not on the known list. Its spread is 1-2 us on 29 us, with no consistent sign across run sets:
  - Node 26 1.021, Node 22 0.990, Node 24 1.001, Bun 0.987, second runner 1.005;
  - lower tiers 0.980 / 1.031 / 1.016;
  - earlier stages: 0.989 in the main stage, 1.004 over 6 runs in prepub (cand-full).
  - The code path is one comparison in `purry` that every non-lazy data-first call shares, and the other G7 data-first entries at XS are 0.98-1.01.
  - Noise; worth a glance in the next run.
- **Single-run outliers.** In Bun's `filter` XS, the second runner's `range` S and the one-copy-per-process `map` S, the high median comes from one run (1.12-1.21) while the other runs are near 1.00. For Bun's `filter` XS, A/A shows the same spread (1.046, 1.056).

## 3. Observations outside the criteria (for the summary, not the verdict)

- **Bundle size of data-first imports grows.**
  - `{ map }` +98 B minified / +22 B gzip.
  - `{ filter, map }` +134 / +76.
  - `{ unique }` +128 / +75.
  - Of `{ map }`'s 448 B, the per-arity data-last helper is 143 B.
- **Cold start, import.** Importing the whole dist entry takes 1.028-1.041 of main's time in all five probes (+0.40 to +0.58 ms on about 14.2 ms). main-aa is 0.993-1.001. Real.
- **Cold start, first call of a pipe.** The arrow pipe of depth 3 is 1.128 (+7.6 us) and `pipe` filter+map S is 1.049 (+8.1 us); main-aa is 0.996 / 1.013. Real and one-time. The first 50 calls are 0.77 and 1.01.
  - The main stage's branch (`144fdc8b`) had 0.925 / 0.920 here, so the later `pipe` restructuring (on-demand runs, one-step path) costs more to compile on the first call.
  - Data-first first calls are faster (`map` 0.860, `unique` 0.603).
- **Peak heap.** At or below main in all 15 shapes with a measurable peak. `map reading data` is 1.009: it collects `data` as asked, the same as main.
- **Reactive footprint.** Vue 35.1 vs 31.4 KiB (main-aa 30.8). This reading varies between stages (prepub: main -2.1, cand-full 6.1 KiB), so it is not a finding.
- **Not recomputed here:** per-shape Vue dependencies at this SHA (see section 1).
