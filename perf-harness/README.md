# Preserved perf harness for PR #1444

This directory is the benchmark harness that measured PR #1444 (remeda/remeda).
Baseline: main at 8e6e78f6. Branch measured at ad8d37be.

It was committed only to preserve it in history, and it is deleted in the next
commit. Retrieve it with `git archive <commit> perf-harness`.

Raw run outputs, logs, libs/ and node_modules are not included. Large raw
aggregates (variants.json, agg-x-*.json, *.details.md) were left out as well.

To recreate the measurement setup:

1. `git archive` the two SHAs into `libs/main`, `libs/main-aa` (a second copy of
   main, used for A/A noise checks) and `libs/branch`. Extract only
   `packages/remeda` from each archive.
2. Run `npm i` in each of `runtimes/*` and in `probes/`.
3. Run `node scripts/build-dist.mjs`.
4. The stage files in `stages/` are then run by `watch-and-run.sh`.

---

# Remeda perf harness: `eranhirsch/performantPipe` vs `main`

All commands run from this directory (`$PERF`). Nothing here writes outside it.

```sh
PERF=/Users/eranhirsch/code/remeda/.tmp/claude-501/-Users-eranhirsch-code-remeda/3731fd26-f43e-476d-be89-b29b3f9626ed/scratchpad/perf
cd "$PERF"
VITEST=/Users/eranhirsch/code/remeda/node_modules/vitest/vitest.mjs
```

Full-scale measurements run from the maintainer's own terminal through `watch-and-run.sh` (idle-gated stages, see "Stages"). Agents only run smoke-scale checks.

## Layout

- `libs/<copy>/packages/remeda/` - library copies, each a `git archive` snapshot with its own `dist/` (tsdown) and `libs/<copy>/bundle/remeda.bundle.mjs` (one scope-hoisted esbuild bundle of the dist):
  - `main`, `main-aa`: main (8e6e78f6). `main-aa` is the same code as separate module instances (the A/A control).
  - `branch`: the branch at the stage's SHA.
  - `branch-v-<name>`: the branch plus one patch from `variants/index.json`.
  - `branch-v-combo`: the branch plus every surviving variant: one hand-merged patch (`prepare.mjs --combo-patch variants/combo.patch`, what stage `main` uses) or the survivors' patches applied in turn (`prepare.mjs --combine <survivors.json>`).
  - `libs/REVISIONS.txt` (revision per copy), `libs/COPIES.json` (status per copy: `ok`, `apply-failed`, `build-failed`, `validate-failed`, `stale`), `libs/.trash/` (replaced copies are moved here, never deleted; clear it by hand).
- `harness/`
  - `copies.js` - copy discovery, protocol expectation per copy, `variants/index.json` reader, target matching, rotations.
  - `env.js` - run selection from `PERF_*` variables, named subsets.
  - `tiers.js` - the priority model (tier per scenario and size, popularity, overrides).
  - `fixtures.js` - datasets per size (users, orders, records, exotic item kinds, counting Proxy items).
  - `scenarios.js` - every scenario as data: `body: (lib) => (dataset) => result`, `native`, `kind`, `main` (the utility whose popularity counts), `tags`. Imported once per copy (`?instance=<id>`; under Bun a physical copy in `.instances/`), so each copy's closures have their own feedback vectors. Must stay import-free.
  - `registry.js` - expands scenarios x sizes into entries with `run(copy)`; time budgets.
  - `pollution.js` - JIT pollution profiles P0 / P1 / P2.
  - `setup.js`, `benchGroup.js` - the vitest bench project (one `describe` per entry, copies in rotated order, `native` last, `gc()` before every task).
  - `proof.js` - the `[perf setup]` proof line (runtime, flags really active, order, loader, pollution).
  - `trace.js`, `validate-core.js` - callback tracing and validation.
  - `estimate.js` - wall-time estimates.
  - `verdicts.js` - statistics, tier verdicts, the sign-consistent test, the lexicographic comparison.
- `bench/G1..G10.bench.js` - one vitest bench file per group.
- `validate/validate.test.js` (vitest, any source incl. TS `src`), `validate/self-test.mjs` (red check of the trace diff).
- `scripts/` - see "Commands".
- `stages/*.steps.template` - stage templates for the watcher.
- `variants/` - `index.json` (every variant patch, its targets, kind and pairwise conflicts), the patches, `screening.md` (the A6 screen: verdict per variant), `survivors.json` (the screened survivors, their confirmation batch `order`, `separate` for `identity-controls-v2`, the combination's contents and merge choices), `combo.patch` (the hand-merged combination; verified like the single patches, `variants/.verify/combo.log`).
- `agent/` - the A4-A7 agent's tools: `repro.mjs` (plain-node repro over built copies, any pollution, optional preceding scenarios), `screen.mjs` / `screening-md.mjs` (A6 analysis), `slot-g3.sh` / `slot-report.mjs` (the G3 configuration that reproduces the non-lazy pipe slowdown), `regressions.mjs`, `add-fix.py` (adds a fix variant to `index.json` with its conflicts), `a6-run.sh`; `tiers-compare.mjs` (per-tier weighted geomeans against any reference copy), `prof-summary.mjs` (self time per function in a `.cpuprofile`); `agent/abl/` holds dist ablations used in A5.
- `tier-overrides.json` - tier overrides on top of the popularity research.
- `research/popularity.json` - popularity per function (written by the research agent; read-only here).
- `results/` - every output; stage runs write to `results/<stage>/`.

## Scenario matrix

Sizes (items per input x distinct inputs per measured call; time is per call of the batch):

| size     | items                   | inputs per call | used for                       |
| -------- | ----------------------- | --------------- | ------------------------------ |
| XS       | 0, 1 or 3 (cycling)     | 256             | per-call overhead              |
| S        | 16                      | 64              |                                |
| C        | 100                     | 64              | the common case                |
| M        | 1,000                   | 1               |                                |
| Mx64     | 1,000                   | 64              | calls too cheap to time singly |
| L        | 100,000                 | 1               |                                |
| x64 / x1 | scalar or single object | 64 / 1          | G3 scalar pipes                |

For the object utilities in G7, an object's size is its key count (`d.record`, one key per item).

Groups (526 entries; `node scripts/matrix.mjs` prints the current counts per group, tier and size, and previews any selection):

- G1 lazy pipe shapes (1-3 lazy steps), XS/S/C/M/L. G1b every lazy utility in `pipe` alone and with a `map`, XS/S/C/M.
- G2 deep pipes (8-15 consecutive lazy steps, and two mixed ones).
- G3 non-lazy pipes (scalar x64/x1, an array pipe XS/S/C/M).
- G4 other iterables (Set, string, generator).
- G5 data-first lazy utilities XS/S/C/M (`first` also Mx64), cheap calls at M/Mx64, callbacks reading `data`, and the biggest adopter's call shape `difference(range(0, n), used)`.
- G6 data-last outside pipe, `piped`, a module-level `piped(...)` built once and reused, steps built once and reused across `pipe` calls.
- G7 the twelve most used plain-`purry` utilities (`g7Pick` in the research: omit, entries, mapValues, isDeepEqual, groupBy, pick, clone, clamp, chunk, mergeDeep, keys, mapToObj) plus `range`, data-first and data-last at XS/S/C; the earlier G7 utilities outside that list (add, sortBy, sumBy, set, merge, toLowerCase) at S only.
- G8 exotic item kinds at C/M: entries/fromEntries tuples, 3-level class instances, 40-key objects, dictionary-mode objects, frozen objects, fresh `{...u}` literals, pass-through Proxy items (validation reports their `has`/`get` trap counts per copy).
- G9 callbacks whose `length` is 0 (`map(when(isNullish, constant(0)))`, `forEach(constant(undefined))`, `map((...args) => args[0])`, plus a 2-step one), XS/S/C/M.
- G10 interleaved pipes: 5-12 functions, runs of 1-3 lazy steps between non-lazy steps (`sortBy`, `groupBy`, `prop`, `pick`, `entries`/`fromEntries`, `length`, `reverse`, inline arrows), XS/S/C/M.

## Priority model

Every entry has a tier (`harness/tiers.js`):

- Tier 1 (strict): data-first (G5, G7) and data-last outside pipe (G6, G7) at XS/S/C/x64/x1; non-lazy pipes (G3); short lazy pipes and interleaved pipes at XS/S/C.
- Tier 2 (lenient): those shapes at M/Mx64; other lazy pipes (4-7 consecutive lazy steps); other iterables; reused steps and `piped`; length-0 callbacks.
- Tier 3 (report only): long consecutive lazy runs (8-15); size L; exotic item kinds; whole runs under `--jitless` / `--max-opt` (lower JIT tiers).

The main utility's popularity (`research/popularity.json`, `functions.<name>.tier`) drops the tier by one for mid and two for low (never past 3); a function missing from the file counts as high and the outputs say so. `tier-overrides.json` sets tiers outright with a reason (currently: data-first `difference` and `range`, the whole surface of `@prisma/dev`, are tier 1); the aggregation prints every override and what it changed.

Verdicts (per scenario, on the copy/main ratio of each run; `harness/verdicts.js`):

- Tier 1: regression when the median ratio exceeds 1 + floor in both orders (runs where the copy ran before main, and runs where it ran after, each on its own median); one order only is marked "(one order)".
- Tier 2: regression when the median is >= 1.05, every run is > 1.00, and median - 1 exceeds the floor.
- Tier 3: report only (slower / faster); BLOCK when every run (at least two) is >= 1.25.
- Floors: per tier, the p95 of |main-aa/main - 1| over the tier's (scenario, run) pairs, measured in the same processes as the comparison. The same classifier applied to main-aa vs main gives the false-call rate.
- Popularity-weighted geomeans per tier (weights high 4, mid 2, low 1).
- Lexicographic comparison of candidates: any tier 1 regression fails the candidate; then tier 1, 2, 3 weighted geomeans, each deciding when two candidates differ by more than twice the A/A geomean deviation (at least 0.5%).
- Variant rule (sign-consistent): a variant passes when it is faster than branch in every run on its target flow (per-run geomean of variant/branch < 1) with overall geomean <= 0.99, has no tier-bar violation against main, and the same test fires on A/A (main-aa vs main, both directions, 2000 random flows of the same size) under 5% of the time.

## Selection (`PERF_*` variables, set for you by the runners)

| var                          | meaning                                                                                                                                                                                                  | default               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `PERF_LIBS`                  | the copy list                                                                                                                                                                                            | `main,branch,main-aa` |
| `PERF_ROTATION`              | k: entries run in the copy list rotated left by k (native last)                                                                                                                                          | `0`                   |
| `PERF_GROUPS` / `PERF_SIZES` | subsets of G1..G10 / XS,S,C,M,Mx64,L,x64,x1                                                                                                                                                              | all                   |
| `PERF_IDS`                   | regex on the scenario id                                                                                                                                                                                 | all                   |
| `PERF_TAGS`                  | `data-first-guard` (G5, G7), `headline`, `traps`                                                                                                                                                         | no filter             |
| `PERF_SUBSET`                | `E` (extras: G1,G3,G5,G6,G7,G10 at XS..M, x64, x1), `H` (headline at S/C/M/x64), `T1`, `HD` (H plus every tier 1 data-first entry, 64), `T1G` (tier 1 at XS/x64/x1 plus the tier 1 headline entries, 74) | none                  |
| `PERF_TIERS`                 | `1`, `1,2`, ...                                                                                                                                                                                          | all                   |
| `PERF_TARGETS`               | variant names: their target flows (with `PERF_TIERS`: the union)                                                                                                                                         | none                  |
| `PERF_GUARD`                 | a named subset selected in union with `PERF_TIERS` and `PERF_TARGETS` (a lighter tier 1 guard next to targets, e.g. `T1G`)                                                                               | none                  |
| `PERF_TIME_SCALE`            | multiplier on budgets (500ms per task, 1500ms for L; warmups 100 / 300ms)                                                                                                                                | `1`                   |
| `PERF_SOURCE`                | `src` (TS via vitest's transform), `dist` (built ESM), `cjs` (built CJS via `require`), `bundle` (scope-hoisted esbuild bundle)                                                                          | `src`                 |
| `PERF_NATIVE`                | `0` drops native entries                                                                                                                                                                                 | `1`                   |
| `PERF_POLLUTION`             | `P0` none; `P1` only map/filter/find/take over 10 item shapes; `P2` the uniform pass                                                                                                                     | `P2`                  |
| `PERF_NODE_FLAGS`            | extra flags for the vitest bench worker                                                                                                                                                                  | none                  |
| `PERF_VARIANTS_INDEX`        | another variant list instead of `variants/index.json` (testing)                                                                                                                                          | none                  |

Prefer `dist` (or `cjs` / `bundle`) for PR numbers: vitest's transform turns every cross-module call into a getter read, which understates the branch.

## Commands

Preparation (idempotent; the first step of every stage):

```sh
node scripts/prepare.mjs --sha <branch sha>                 # snapshots, variants, dists + bundles, validation
node scripts/prepare.mjs --sha <sha> --combine results/main/survivors.json   # also libs/branch-v-combo
node scripts/prepare.mjs --sha <sha> --variants variants/survivors.json --combo-patch variants/combo.patch   # stage main
node scripts/prepare.mjs --sha <sha> --no-variants          # stage publication: main and the branch only
```

`--variants <file>` prepares only the variants named in the file's `survivors` and `separate` (other variant copies on disk become `stale`); `--no-variants` prepares none. `--combo-patch <patch>` builds `libs/branch-v-combo` from that one patch (applied with `git apply`, so it must apply to the branch without fuzz); `--combine` and `--combo-patch` are exclusive.

It snapshots main / main-aa / branch (`git archive`, read-only on the repo), applies every patch from `variants/index.json` (`[{ name, patch, targets: { groups, ids, sizes }, description }]`; `patch` is a file under `variants/` or the diff text, paths relative to `packages/remeda`) to a fresh branch copy with `git apply` (repository discovery fenced off by `GIT_CEILING_DIRECTORIES`), reports and skips patches that don't apply or don't build, builds what changed (`scripts/build-dist.mjs`), and validates (`dist` in full, `cjs` and `bundle` on G1/G5/G10 at XS/S/C). Validation is skipped when neither the copies nor the harness changed since the last pass. It exits non-zero only when main, main-aa or branch fail.

Validation:

```sh
node --expose-gc scripts/validate.mjs [--source dist | cjs | bundle] [--copies ...] [--groups ...] [--sizes ...]
PERF_SOURCE=src node $VITEST run --config vitest.config.js --project validate # TS sources
node validate/self-test.mjs                                                   # red check of the trace diff
```

Checks, per entry: every copy's output deep-equals main's (and native's); every callback call is traced per copy (step id, call number, arguments up to `data`, values by identity: fixture objects by id, other objects by first appearance plus a shallow summary) and diffed main vs branch, main vs main-aa, branch vs every variant; `data` itself is never read (main passes its prefix buffer, the branch a prefix or a throwing sentinel). The wrappers keep each callback's `length`, which the branch reads. A cross-copy check runs pipes of one branch-protocol copy over steps built by another (branch ESM + branch CJS, branch + each variant), which must recognize each other's control objects through `Symbol.for("$$remedaLazyRef")`. A variant marked `"protocol": "own"` in `variants/index.json` (`identity-controls` and `identity-controls-v2`, which change the control keys on purpose) is paired with its own other build (ESM + CJS) instead of the branch. Any difference fails with the entry, the call index, the expected and actual trace entries and the three before.

Benchmarks under vitest:

```sh
node scripts/run-bench.mjs --name main,branch,main-aa] [--rotation k] [selection...] < run > [--copies
[--scale 1] [--source dist] [--no-native] [--pollution P0 | P1 | P2] [--node < path > ]
[--node-flags=--jitless] [--max-opt 1 | 2] [--per-process] [--if-missing] [--drop-unavailable]
[--skip-unless-copy < copy > ] [--estimate-only]
```

- Rotations: with n copies, k = 0..n-1 puts every copy in every position once. Rotations 0 and 1 of `main,branch,main-aa` give both relative orders of main and branch (and of main and main-aa).
- `--node` runs vitest (and its forked worker) with `runtimes/node22/...` or `runtimes/node24/...`. `--max-opt N` checks `<node> --v8-options` first and adds `--max-opt=N` (1 = Sparkplug ceiling, 2 = Maglev ceiling). `--node-flags=--jitless` (note the `=`) runs the interpreter only. Each bench file's `[perf setup]` line prints the runtime and the worker's real `execArgv`, `jitless=`/`wasm=` (`--jitless` removes WebAssembly) and `maxOpt=`.
- `--per-process`: one vitest process per copy, results merged into one file (the one-copy-per-process cross-check, used with `--subset H`).
- `--if-missing`: a finished result is kept and the run skipped; an unfinished one is moved aside (`*.failed-<time>`) and rerun.
- `--name` may contain one directory (`main/full-r0`).

Vitest-free runner (tinybench over the built copies, same registry, rotation, pollution and per-task GC; `Bun.gc(true)` or `gc()`):

```sh
node --expose-gc scripts/run-portable.mjs --name selection flags] [--per-process] < run > [same
runtimes/bun/node_modules/.bin/bun scripts/run-portable.mjs --name < run > ...
```

Other measurements (all take the lock, `--name` and `--if-missing`):

```sh
node scripts/alloc.mjs [--copies main,branch] [--scale 1]            # bytes/call and GC counts against main (first copy)
node --expose-gc scripts/peak-heap.mjs                               # peak live heap of G1 and G10 shapes at L
node scripts/cold.mjs [--runs 20] [--source dist] [--node < path > ] # cold start
node scripts/reactive.mjs [--runs 3]                                 # Vue computed / MobX autorun probes
node scripts/bundle-size.mjs [--copies main,branch,...]              # min / gzip / brotli, declarations
node scripts/vue-shapes.mjs [--copies main,...]                      # Vue tracked dependencies per pipe shape (counts only)
node scripts/prepub-verdicts.mjs [--dir results/prepub]              # stage prepub: variant rule vs cand-base, Vue gate, extras, composition
```

- Peak heap: per (scenario, copy), a first pass counts each callback's calls; a second runs `gc()` and reads `heapUsed` inside the last call of every callback. Peak = highest reading minus the heap after `gc()` before the call; retained = heap after the call with the result held. Scenarios without callbacks show `-`.
- Cold start: about 20 fresh processes per (copy, probe); each imports one copy and runs one probe 50 times with no warmup (data-first `map`/`unique` at S, `pipe` filter+map at S, a depth-3 arrow pipe, a callback reading `data`). Median and p75 of the import time, the first call and the first 50 calls; copies rotate within each round.
- Reactive probes (`probes/node_modules`): per copy, a Vue `computed` and a MobX `autorun` over `pipe(items, filter, map, take(10))` on 1,000 observable items: re-evaluation time, tracked dependencies (Vue: the computed's dependency links, and `onTrack` in a dev-build process; MobX: `getDependencyTree`, dev names for the key), how many are on `$$remedaLazyRef`, footprint after the first evaluation and heap growth over 1,200 re-evaluations (`--no-flush-bytecode`).

Aggregation:

```sh
node scripts/aggregate.mjs --out results/agg-name [--title ...] [--validate results/validate-dist.json]
[--survivors-out results/main/survivors.json] [--candidates branch,...] [--allow-empty] results/*.json
```

Writes `<out>.md` (runs; popularity and overrides; A/A floors and false-call rate per tier; per-copy weighted geomeans and verdict counts; the lexicographic ranking; the variant report; then tier 1, 2, 3 tables for branch with p75 and mean ratios side by side, per-order medians, A/A and native ratios), `<out>.details.md` (every entry of every run) and `<out>.json`. Sidecar `.meta.json` files matched by globs are skipped.

Matrix and estimates:

```sh
node scripts/matrix.mjs [selection flags] [--list]
node scripts/run-bench.mjs --name x --estimate-only [selection flags]
```

Smoke (about 20ms per task):

```sh
node scripts/run-bench.mjs --name smoke --scale 0.04 --source dist # whole matrix, about 2 minutes
```

## Stages

`watch-and-run.sh` runs a steps file (one command per line, from this directory, with `PERF`, `PERF_SHA`, `PERF_STAGE`), each step after the machine has been idle and on AC power. Steps are resumable.

```sh
node scripts/make-stage.mjs main          # writes stages/main.steps, prints the estimate per step and section
node scripts/make-stage.mjs main --estimate-only   # prints the estimate, writes nothing
node scripts/make-stage.mjs publication
printf 'sha=%s\nsteps=stages/main.steps\n' <sha> > markers/READY-main
```

Regenerate a stage's steps whenever `variants/index.json` or `variants/survivors.json` changes (variant batches are expanded at generation time). Steps are split so each stays under 18 minutes. Template directives: `@prepare [prepare flags]`; `@variants <name> batch=<n> [scale=<s>] [survivors=<file>] [rotations=<r>] [guard=<subset>] <run-bench args>` (`survivors=` batches only the listed variants, in the file's order; `guard=` replaces the full tier 1 next to the targets with that named subset); see `scripts/make-stage.mjs`.

Stages generated for branch 144fdc8b (A7, 2026-10-07; 20 screened survivors, `variants/screening.md`):

- `main` (8.09 h), core results first so that a stage cut short still answers the main questions: prepare (`--variants variants/survivors.json --combo-patch variants/combo.patch`); the full matrix in rotations 0 and 1 (with native, 46.8 min); the combination copy (`variants/combo.patch`) in rotations 0 and 1 on tiers 1 and 2 (27.8 min); the runtime and JIT-tier extras (`--jitless`, `--max-opt` 1 and 2, Node 22 and 24, Bun and Node through the portable runner) on `HD`, P0 and P1 on G1/G2/G10 at C/M, bundle and CJS on `H`, the one-copy-per-process check on `H`; alloc, peak heap, bundle size, cold start, reactive probes; the reports for all of the above; then the variant confirmation (5.89 h): the 20 survivors in `variants/survivors.json` `order` (design candidates `identity-controls-v2` and `sentinel-module` first, then the clear wins in screening order, the 5 borderline survivors last) in 7 batches of up to 3 next to main, branch and main-aa, rotations 0-5 (6 runs per batch, also for the 2-variant batch), scale 0.5, no native, on the batch's targets plus the tier 1 guard `T1G`, at XS/S/C/x64/x1; and last the variant report and `results/main/survivors.json`.
- `prepub` (1.2 h, hand-written `stages/prepub.steps`, A8 2026-10-08): the design-B candidates of `variants/prepub.json` (`cand-base`, `cand-map`, `cand-forof`, `cand-full`, all `protocol: "own"`) next to main and main-aa: prepare; the confirmation in 6 cyclic rotations on the targets of cand-map and cand-forof plus `T1G` (XS/S/C/x64/x1, scale 0.5); reactive probes, `vue-shapes.mjs` and the G8 Proxy-trap validation for every copy; cand-full vs main under P0/P1 (G2, G10 at C/M), Node 24 (HD), Bun (HD) and one copy per process (H), two runs each; allocations and bundle size; the aggregations and `scripts/prepub-verdicts.mjs`, which writes `results/prepub/verdicts.md` (the variant rule for cand-map and cand-forof against cand-base, the Vue gate for cand-forof, and the final composition: cand-full, cand-map, cand-forof or cand-base). The aggregations skip their branch-relative variant report when the runs have no branch copy.
- `publication` (5.01 h): prepare (`--no-variants`); six rotations of the full matrix (every copy in every position twice; native in the two rotation-0 runs, 1.98 h); every extra at two runs per order (rotations 0 and 1, twice each), the runtime and JIT-tier extras on the full tier 1 subset `T1`, P0/P1 on G1/G2/G10 at C/M, the loaders and the one-copy-per-process check on `H`; the reports.

Costs per unit: a confirmation batch costs about 11.7 s per selected entry (6 copies x 6 rotations at scale 0.5); 153 tier 1 entries alone make about 30 min per batch, which is why the confirmation uses `T1G` (74 entries) as its tier 1 guard.

## Notes

- Every measuring script takes `.bench.lock`, so two never overlap; prepare takes it too (its builds would disturb a measurement). Children of a lock holder run under it (`PERF_LOCK_HELD`).
- `build-dist.mjs` keeps npm's cache (`npm_config_cache`) and temp files (`TMPDIR`) inside this directory for tsdown's `attw`/`publint` step.
- The `.instances/` directory holds the per-copy scenario files Bun needs.
