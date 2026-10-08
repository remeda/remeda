# PR #1444 decision brief (Touchpoint 1)

Full evidence is in `analysis-main.md` (numbers in `analysis-main.json`).

- **Main run:** 76 steps, 2026-10-07, branch 144fdc8b vs main 8e6e78f6.
- **Ratios:** time/main, lower is faster.
- **Tiers:** T1 = common usage (strict); T2 = lenient (1.05 bar); T3 = report only.

## Where things stand

| copy                                                                             | T1    | T2    | T1 violations vs main                                                                |
| -------------------------------------------------------------------------------- | ----- | ----- | ------------------------------------------------------------------------------------ |
| branch as committed                                                              | 0.854 | 0.789 | 10. Nine are the G3 non-lazy pipe deopt (1.10-1.35x); one is data-reading XS (1.075) |
| design A: current controls + 7 adopted variants + sentinel-module                | 0.702 | 0.661 | none                                                                                 |
| design B: identity-only controls + compatible adopted variants + sentinel-module | 0.657 | 0.559 | none                                                                                 |

A and B come from a relative screen in the agent sandbox. The final numbers come from the publication pass.

- **B vs A:**
  - B is 6.5% better on T1 in every run and 15.5% on T2.
  - B never probes items: 0 Proxy `has` traps vs 11,223 per call, and no extra reactive dependencies.
  - B is up to 1.31x slower than A on map-heavy pipes (still faster than main). The reason is that A also uses the user's `map` callback directly as the evaluator, which B's 4th-argument slot doesn't allow as built.
- **Vue:** the two indexed-loop variants make Vue track every array index they read (+19 dependencies in the probe, +52% re-evaluation time). With a full scan the cost grows with array length. MobX is unaffected.
- **Bundle:** sentinel-module brings `import { map }` back to main's size (360/249 B vs 350/249).
- **Not yet measured with any combined patch:** pollution profiles P0/P1, Node 24, Bun and one-copy-per-process. The branch alone has T1 violations in each of those.

## Variant verdicts

Rule: 6/6 rotations faster, geomean <= 0.99, and no violation caused by the variant.

- **Adopt (7):**
  - pipe-single-step-runs (fixes G3; 0.973);
  - pipe-array-index-loop (0.939; Vue cost);
  - pipe-isarray-first (0.949);
  - map-callback-as-evaluator (0.942; A only);
  - single-array-index-loop (0.910; Vue cost);
  - datalast-direct-props (0.886);
  - unique-single-lookup (0.985).
- **Near misses:**
  - requiredata-direct-write: inconclusive on its declared flow, but 6/6 faster on the data-reading entries it targets, XS 0.85-0.97. It fixes that T1 cluster, and probably Bun's 1.38x.
  - datalast-arity-closures: 6/6 at 0.991. It fixes `clamp data-last C`, a T2 entry at 1.051 in the branch and in both designs.
- **Rejected (10):** under the bar, a T1 loss, or no effect. See the analysis.

## Decisions requested now

1. Design: A or B, and whether to port the map shortcut onto B.
2. Indexed loops vs Vue tracking.
3. The two near-miss fixes.
4. How the variant rule is read.
5. The sentinel message wording.

## What happens next (no further input)

1. **Agents prepare in scratch** whatever the answers leave conditional: the map shortcut on B, and the loop rework.
2. **A short pre-publication watcher stage, about 1-1.5 h:**
   - confirms the conditional variants with the 6/6 rule;
   - runs the final candidate under P0/P1, Node 24, Bun and one-copy-per-process, where the branch failed.
3. **Implement in the repo** as local commits, one change each, then run the scaffolding removal, the skill docs and the validation checklist.
4. **Publication pass, about 5 h**, then the summary, the harness commits and the review.
5. **Touchpoint 2: final review.**

## Decisions taken (2026-10-08)

1. Design B (identity-only controls), plus the map shortcut ported onto it. The shortcut is kept only if it passes the variant rule in the pre-publication stage.
2. Indexed loops are reworked into an array-only for...of. Kept only if it passes the variant rule AND Vue dependencies return to main's level; otherwise there are no loop variants.
3. requiredata-direct-write and datalast-arity-closures are both in.
4. Variant rule: a variant is charged with what it causes.
5. Sentinel message: the patch wording ("...so Remeda didn't provide it. Declare it, e.g. `(value, index, data) => ...`.").
