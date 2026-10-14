# Remeda utility popularity estimate

Generated 2026-10-07. Read-only research for weighting a performance evaluation (common functions matter more than rare ones). Machine-readable twin: `popularity.json`.

## Summary

- Sample: 2,143 remeda-importing files in 121 repo clusters (Sourcegraph public index, de-duplicated). Raw: 2,936 files in 168 repos.
- `pipeShare` = 0.1367 (293 of 2,143 files import `pipe` or use `R.pipe`); 38.8% of repo clusters use it somewhere. Data-first calls dominate.
- Tiers: 12 high, 47 mid, 104 low (all 163 exports tiered).
- `g7Pick` (12 most popular plain-purry utilities): omit, entries, mapValues, isDeepEqual, groupBy, pick, clone, clamp, chunk, mergeDeep, keys, mapToObj.
- 34 of 163 functions never appear in the sample; the long tail rests on the lodash fallback and is low confidence.

## Method

### 1. Remeda-specific usage (primary signal)

1. Source: Sourcegraph stream search API, `context:global`, with `fork:no archived:no`. Queries are multi-line regexes, so complete `import { ... } from "remeda"` statements come back with their full text. Each query is listed under Reproduction.
2. Parsed locally (`build_sample.cjs`): named value imports (skipping `import type` and inline `type` specifiers; `a as b` resolves to `a`), namespace imports (`import * as R`, then `R.name` usage found with an AND query so only files that import remeda as `R`, `_`, or `remeda` qualify; spreads such as `...R.mapToObj(` are handled), plus `require`/dynamic-import forms (3 files).
3. v1 names are folded into the current name: isNil (2), uniqBy (11), noop (2), fromPairs (2), toPairs (4), uniq (4), equals (4), minBy (4). Removed v1 functions (compact, reject) are ignored.
4. Exclusions: remeda's own repo and any repo whose name contains `remeda` or `es-toolkit`; forks; archived repos; `node_modules`, `dist`, `build`, `vendor`, `.d.ts`, `.min.js`; and by manual review five repos that are benchmark/comparison/vendored material (mobily/ts-belt: benchmark of competing libraries; selfrefactor/rambda: comparison spec against remeda; maxdewald/moderndash: benchmarks against competing libraries; rstackjs/build-tools-performance: bundler benchmark fixture; tradecatlabs/fatecat: vendored copies of reference repos), plus vendored paths (`reference-repos/`, `perfxpert/`).
5. De-duplication (`analyze.cjs`): the public index contains many unflagged clones. Repos sharing >= 5 identical (last two path segments + function set) signatures were merged into clone clusters: 36, 2, 2, 2 repos (the 36-repo cluster is the opencode family). Identical files inside a cluster were counted once (722 dropped); identical full-path files with a non-trivial function set across unrelated repos were counted once (6 dropped, e.g. copy-pasted template files).
6. Validation: parsed function sets were compared with the raw file contents for 14 files (8 namespace-import, 6 named-import; heaviest files included): 0 mismatches. A quoted-string coverage query found 2,959 files mentioning `"remeda"`; 2,936 (99.2%) are in the parsed sample, the other 23 are config strings, mocks, re-exports and comparison tables. Direct per-function queries (`select:file`) for pipe and sortBy returned 613 and 341 files against 617 and 341 in the raw parse.

### 2. Metrics and tiers

- `remedaCount` / `remedaShare`: files using the function / deduped files (a file counts once per function).
- `remedaRepoShare`: share of repo clusters in which any file uses the function (breadth).
- `remedaBalancedShare`: mean over repo clusters of the within-cluster file share, weighted by the square root of the cluster's file count, so four giant repos (likec4, pf2e, owid-grapher, sendou.ink: 917 of 2,143 files) do not dominate.
- `score` = mean of the three shares. Bootstrap over repo clusters (1000 resamples, seed 20261007) gives a 90% interval and the probability of each tier.
- Tier: high if score >= 8%; mid if >= 2% and the function appears in at least 4 repo clusters (breadth guard; it moved hasAtLeast to low); otherwise low. tierProbability is the bootstrap probability of this score-based tier, before the lodash fallback and adopter adjustments.
- Lodash fallback (thin samples): fewer than 5 sampled files or fewer than 4 repo clusters, and >= 30,000,000 lodash per-method downloads/month, ignoring packages dominated by a known transitive dependent, means at least mid. It raised: toKebabCase, toSnakeCase, toTitleCase.
- Adopter tie-break: a function within 25% below a tier threshold that is used by an adopter with >= 1M downloads/month moves up one tier. It changed: no function (every function the Prisma packages use is already mid or high).

## Sample sizes

| Stage                                             | Files | Repos        |
| ------------------------------------------------- | ----- | ------------ |
| Named-import query (ts/tsx/mts/cts)               | 2,095 | 139          |
| Named-import query (js/jsx/mjs/cjs)               | 4     | 3            |
| Named-import query (vue/svelte/astro)             | 74    | 5            |
| Namespace-import query (all extensions)           | 771   | 47           |
| Union after parsing (raw)                         | 2,936 | 168          |
| After manual exclusions                           | 2,871 | 162          |
| After clone/copy de-duplication (analysis sample) | 2,143 | 121 clusters |
| Archived-only repos (sensitivity, not in sample)  | 42    | 8            |
| package.json files listing remeda (context)       | 430   | 184          |

Import style in the deduped sample: 1,400 files with named imports, 750 with `import * as R` (alias R: 755 of 771 namespace files in the raw query).
Declared remeda ranges in the 430 package.json hits: v2 213, v1 38, v0 3, workspace/catalog or other 176.

## Top 40 by score

| #   | Function      | Kind        | Tier | Files (share) | Repos (share) | Sqrt-wtd share | Score [90% CI]      | Lodash dl/mo | Adopters                                              |
| --- | ------------- | ----------- | ---- | ------------- | ------------- | -------------- | ------------------- | ------------ | ----------------------------------------------------- |
| 1   | pipe          | composition | high | 293 (13.7%)   | 47 (38.8%)    | 15.6%          | 22.7% [18.0%-27.4%] | 7,417,427    | @opencode-ai/ui, @likec4/diagram                      |
| 2   | sortBy        | other       | high | 192 (9.0%)    | 36 (29.8%)    | 10.2%          | 16.3% [12.8%-19.9%] | 93,376,531   | @convex-dev/better-auth, @snaplet/seed +2             |
| 3   | omit          | plainPurry  | high | 180 (8.4%)    | 37 (30.6%)    | 8.8%           | 15.9% [12.7%-19.5%] | 13,877,091   | @prisma/studio-core, isolate-package, @likec4/diagram |
| 4   | entries       | plainPurry  | high | 107 (5.0%)    | 34 (28.1%)    | 7.1%           | 13.4% [10.6%-16.5%] | 1,274,095    | @opencode-ai/ui, @likec4/diagram                      |
| 5   | mapValues     | plainPurry  | high | 138 (6.4%)    | 31 (25.6%)    | 6.1%           | 12.7% [10.1%-15.5%] | 14,947,429   | @snaplet/seed, @likec4/diagram                        |
| 6   | map           | lazy        | high | 188 (8.8%)    | 27 (22.3%)    | 7.0%           | 12.7% [9.2%-16.3%]  | 13,706,013   | @opencode-ai/ui, @likec4/diagram                      |
| 7   | isDeepEqual   | plainPurry  | high | 125 (5.8%)    | 29 (24.0%)    | 6.8%           | 12.2% [9.2%-15.2%]  | 128,383,958  | @prisma/studio-core, @llm-ui/markdown                 |
| 8   | unique        | lazy        | high | 185 (8.6%)    | 26 (21.5%)    | 5.4%           | 11.8% [8.4%-15.0%]  | 148,658,629  | isolate-package, @likec4/diagram                      |
| 9   | groupBy       | plainPurry  | high | 108 (5.0%)    | 30 (24.8%)    | 5.4%           | 11.8% [9.0%-14.6%]  | 83,256,777   | @opencode-ai/ui, @likec4/diagram                      |
| 10  | pick          | plainPurry  | high | 180 (8.4%)    | 22 (18.2%)    | 6.7%           | 11.1% [7.6%-14.4%]  | 8,780,883    | isolate-package, @likec4/diagram                      |
| 11  | filter        | lazy        | high | 135 (6.3%)    | 23 (19.0%)    | 5.9%           | 10.4% [7.4%-13.5%]  | 10,035,228   | @snaplet/seed, @likec4/diagram                        |
| 12  | uniqueBy      | lazy        | high | 64 (3.0%)     | 24 (19.8%)    | 3.4%           | 8.7% [6.4%-11.3%]   | 28,070,353   | -                                                     |
| 13  | isEmpty       | other       | mid  | 93 (4.3%)     | 16 (13.2%)    | 4.4%           | 7.3% [4.8%-10.1%]   | -            | isolate-package, @likec4/diagram                      |
| 14  | clone         | plainPurry  | mid  | 103 (4.8%)    | 15 (12.4%)    | 4.3%           | 7.2% [4.4%-10.6%]   | 119,758,698  | -                                                     |
| 15  | clamp         | plainPurry  | mid  | 71 (3.3%)     | 15 (12.4%)    | 4.4%           | 6.7% [4.1%-9.4%]    | 1,394,939    | @likec4/diagram                                       |
| 16  | isTruthy      | other       | mid  | 158 (7.4%)    | 10 (8.3%)     | 4.2%           | 6.6% [3.3%-9.7%]    | -            | figma-developer-mcp, @likec4/diagram                  |
| 17  | chunk         | plainPurry  | mid  | 57 (2.7%)     | 17 (14.1%)    | 2.7%           | 6.5% [4.3%-8.9%]    | 7,306,167    | -                                                     |
| 18  | mergeDeep     | plainPurry  | mid  | 64 (3.0%)     | 14 (11.6%)    | 3.8%           | 6.1% [3.5%-8.9%]    | -            | @snaplet/seed, @likec4/diagram                        |
| 19  | isPlainObject | other       | mid  | 129 (6.0%)    | 10 (8.3%)     | 3.6%           | 6.0% [2.8%-9.5%]    | 299,108,113  | @kubb/studio, @likec4/diagram                         |
| 20  | keys          | plainPurry  | mid  | 87 (4.1%)     | 13 (10.7%)    | 3.0%           | 5.9% [3.4%-8.8%]    | 16,342,206   | @likec4/diagram                                       |
| 21  | take          | lazy        | mid  | 31 (1.5%)     | 15 (12.4%)    | 2.7%           | 5.5% [3.5%-7.7%]    | 220,362      | -                                                     |
| 22  | mapToObj      | plainPurry  | mid  | 86 (4.0%)     | 12 (9.9%)     | 2.3%           | 5.4% [3.1%-7.7%]    | -            | @likec4/diagram                                       |
| 23  | isNullish     | other       | mid  | 61 (2.9%)     | 12 (9.9%)     | 2.5%           | 5.1% [2.9%-7.2%]    | 71,230,833   | @likec4/diagram                                       |
| 24  | pickBy        | plainPurry  | mid  | 45 (2.1%)     | 14 (11.6%)    | 1.6%           | 5.1% [3.3%-7.1%]    | 9,732,771    | @likec4/diagram                                       |
| 25  | reverse       | plainPurry  | mid  | 25 (1.2%)     | 14 (11.6%)    | 2.5%           | 5.1% [3.2%-7.2%]    | 19,752       | @likec4/diagram                                       |
| 26  | fromEntries   | plainPurry  | mid  | 22 (1.0%)     | 15 (12.4%)    | 1.8%           | 5.1% [3.3%-7.0%]    | 868,493      | -                                                     |
| 27  | isObjectType  | other       | mid  | 51 (2.4%)     | 12 (9.9%)     | 2.1%           | 4.8% [2.9%-7.1%]    | 199,452      | @prisma/studio-core                                   |
| 28  | flatMap       | lazy        | mid  | 46 (2.1%)     | 12 (9.9%)     | 2.1%           | 4.7% [2.7%-6.8%]    | 3,111,869    | @opencode-ai/ui, @likec4/diagram                      |
| 29  | range         | plainPurry  | mid  | 50 (2.3%)     | 11 (9.1%)     | 2.4%           | 4.6% [2.6%-6.8%]    | 924,970      | @prisma/dev                                           |
| 30  | values        | plainPurry  | mid  | 48 (2.2%)     | 12 (9.9%)     | 1.3%           | 4.5% [2.7%-6.5%]    | 3,138,859    | @likec4/diagram                                       |
| 31  | sumBy         | plainPurry  | mid  | 42 (2.0%)     | 12 (9.9%)     | 1.6%           | 4.5% [2.7%-6.4%]    | 131,477      | -                                                     |
| 32  | prop          | other       | mid  | 63 (2.9%)     | 10 (8.3%)     | 2.2%           | 4.5% [2.2%-6.7%]    | 74,614,021   | @convex-dev/better-auth, @likec4/diagram, kitcn       |
| 33  | isString      | other       | mid  | 76 (3.5%)     | 9 (7.4%)      | 2.2%           | 4.4% [2.3%-6.8%]    | 225,252,061  | @likec4/diagram                                       |
| 34  | firstBy       | other       | mid  | 39 (1.8%)     | 12 (9.9%)     | 1.4%           | 4.4% [2.7%-6.4%]    | 5,066,023    | @likec4/diagram                                       |
| 35  | isDefined     | other       | mid  | 42 (2.0%)     | 11 (9.1%)     | 1.8%           | 4.3% [2.5%-6.3%]    | -            | @likec4/diagram                                       |
| 36  | isNonNullish  | other       | mid  | 41 (1.9%)     | 11 (9.1%)     | 1.7%           | 4.2% [2.3%-6.2%]    | -            | @likec4/diagram                                       |
| 37  | omitBy        | plainPurry  | mid  | 18 (0.8%)     | 13 (10.7%)    | 1.1%           | 4.2% [2.6%-5.9%]    | 3,091,712    | -                                                     |
| 38  | last          | plainPurry  | mid  | 57 (2.7%)     | 9 (7.4%)      | 1.6%           | 3.9% [1.8%-6.1%]    | 1,070,384    | @likec4/diagram                                       |
| 39  | isArray       | other       | mid  | 51 (2.4%)     | 9 (7.4%)      | 1.8%           | 3.9% [2.0%-6.1%]    | 9,955,159    | @likec4/diagram                                       |
| 40  | sort          | plainPurry  | mid  | 45 (2.1%)     | 9 (7.4%)      | 1.8%           | 3.8% [1.8%-6.0%]    | -            | @likec4/diagram                                       |

## Lazy utilities and composition entry points

| Overall # | Function         | Kind        | Tier | Files (share) | Repos | Score [90% CI]      | P(high)/P(mid)/P(low) | Files also using pipe |
| --------- | ---------------- | ----------- | ---- | ------------- | ----- | ------------------- | --------------------- | --------------------- |
| 1         | pipe             | composition | high | 293 (13.7%)   | 47    | 22.7% [18.0%-27.4%] | 1/0/0                 | -                     |
| 6         | map              | lazy        | high | 188 (8.8%)    | 27    | 12.7% [9.2%-16.3%]  | 0.988/0.012/0         | 78%                   |
| 8         | unique           | lazy        | high | 185 (8.6%)    | 26    | 11.8% [8.4%-15.0%]  | 0.971/0.029/0         | 15%                   |
| 11        | filter           | lazy        | high | 135 (6.3%)    | 23    | 10.4% [7.4%-13.5%]  | 0.898/0.102/0         | 89%                   |
| 12        | uniqueBy         | lazy        | high | 64 (3.0%)     | 24    | 8.7% [6.4%-11.3%]   | 0.693/0.307/0         | 25%                   |
| 21        | take             | lazy        | mid  | 31 (1.5%)     | 15    | 5.5% [3.5%-7.7%]    | 0.033/0.966/0.001     | 84%                   |
| 28        | flatMap          | lazy        | mid  | 46 (2.1%)     | 12    | 4.7% [2.7%-6.8%]    | 0.008/0.979/0.013     | 93%                   |
| 44        | difference       | lazy        | mid  | 24 (1.1%)     | 9     | 3.2% [1.6%-5.0%]    | 0/0.886/0.114         | 13%                   |
| 46        | first            | lazy        | mid  | 45 (2.1%)     | 6     | 2.8% [1.0%-4.5%]    | 0/0.756/0.244         | 29%                   |
| 49        | zip              | lazy        | mid  | 14 (0.7%)     | 8     | 2.6% [1.3%-4.1%]    | 0/0.748/0.252         | 36%                   |
| 51        | flat             | lazy        | mid  | 12 (0.6%)     | 7     | 2.4% [1.0%-3.8%]    | 0/0.639/0.361         | 42%                   |
| 54        | find             | lazy        | mid  | 20 (0.9%)     | 6     | 2.3% [0.8%-3.8%]    | 0/0.592/0.408         | 50%                   |
| 70        | piped            | composition | low  | 13 (0.6%)     | 4     | 1.5% [0.4%-2.8%]    | 0/0.223/0.777         | -                     |
| 72        | zipWith          | lazy        | low  | 4 (0.2%)      | 4     | 1.3% [0.3%-2.4%]    | 0/0.139/0.861         | 50%                   |
| 76        | intersection     | lazy        | low  | 7 (0.3%)      | 4     | 1.3% [0.3%-2.5%]    | 0/0.146/0.854         | 14%                   |
| 78        | forEach          | lazy        | low  | 15 (0.7%)     | 3     | 1.2% [0.0%-2.3%]    | 0/0.106/0.894         | 93%                   |
| 90        | drop             | lazy        | low  | 5 (0.2%)      | 3     | 0.9% [0.3%-1.9%]    | 0/0.037/0.963         | 60%                   |
| 111       | uniqueWith       | lazy        | low  | 1 (0.1%)      | 1     | 0.4% [0.0%-1.1%]    | 0/0.002/0.998         | 0%                    |
| 119       | differenceWith   | lazy        | low  | 1 (0.1%)      | 1     | 0.3% [0.0%-0.9%]    | 0/0.001/0.999         | 0%                    |
| 139       | intersectionWith | lazy        | low  | 0 (0.0%)      | 0     | 0.0% [0.0%-0.0%]    | 0/0/1                 | -                     |
| 142       | mapWithFeedback  | lazy        | low  | 0 (0.0%)      | 0     | 0.0% [0.0%-0.0%]    | 0/0/1                 | -                     |

Rank is among all 163 exports. `Files also using pipe` is the share of the function's sampled files that also use `pipe`/`piped` (a proxy for data-last use; the rest are data-first or standalone). `forEach` is rare because native `Array#forEach` exists. `uniqueBy` sits on the high/mid boundary.

## pipeShare

293 of 2,143 deduped remeda-importing files import `pipe` (or call `R.pipe`): **0.1367** (13.7%). Including `piped`: 13.9%.

| Variant                                                                   | Share of files with pipe |
| ------------------------------------------------------------------------- | ------------------------ |
| All deduped files                                                         | 13.7%                    |
| Excluding the 4 largest clusters (likec4, pf2e, owid-grapher, sendou.ink) | 13.1%                    |
| Named-import files only                                                   | 16.2%                    |
| Namespace-import files only                                               | 8.8%                     |
| Repo clusters with at least one pipe file                                 | 38.8% (47 of 121)        |
| Sqrt-weighted by cluster size                                             | 15.6%                    |

Reading: pipe is the single most used export (rank 1), but only about one file in seven that imports remeda uses it; most files call utilities data-first. Roughly four in ten repos use pipe somewhere.

## g7Pick (plain-purry, most popular first)

| #   | Function    | Score | Files | Repos | P(in top-12 plain purry) | Files also using pipe |
| --- | ----------- | ----- | ----- | ----- | ------------------------ | --------------------- |
| 1   | omit        | 15.9% | 180   | 37    | 1.00                     | 6%                    |
| 2   | entries     | 13.4% | 107   | 34    | 1.00                     | 55%                   |
| 3   | mapValues   | 12.7% | 138   | 31    | 1.00                     | 27%                   |
| 4   | isDeepEqual | 12.2% | 125   | 29    | 1.00                     | 8%                    |
| 5   | groupBy     | 11.8% | 108   | 30    | 1.00                     | 48%                   |
| 6   | pick        | 11.1% | 180   | 22    | 1.00                     | 6%                    |
| 7   | clone       | 7.2%  | 103   | 15    | 0.83                     | 4%                    |
| 8   | clamp       | 6.7%  | 71    | 15    | 0.80                     | 30%                   |
| 9   | chunk       | 6.5%  | 57    | 17    | 0.77                     | 4%                    |
| 10  | mergeDeep   | 6.1%  | 64    | 14    | 0.62                     | 25%                   |
| 11  | keys        | 5.9%  | 87    | 13    | 0.62                     | 7%                    |
| 12  | mapToObj    | 5.4%  | 86    | 12    | 0.46                     | 20%                   |

The first six are stable (probability >= 0.99). Slots 7-12 are likely but not certain. Next in line: pickBy (5.1%; P=0.31), reverse (5.1%; P=0.36), fromEntries (5.1%; P=0.34), range (4.6%; P=0.25), values (4.5%; P=0.15). Plain purry here means the source file calls `purry(` and the utility is not one of the 19 lazy ones; `sortBy`, `prop`, `isTruthy`, `isEmpty` and similar use other dispatch and are not eligible.

## Adopter signal (npm dependents)

`@prisma/dev` (latest 0.25.2) has 28,985,936 downloads last month, 62% of remeda's own 46,666,933; `@prisma/studio-core` adds 26,708,827. Their remeda surface is tiny: `difference(range(a, b), used)` in port allocation, plus `isDeepEqual`, `isObjectType`, `omit` bundled into studio-core.

| Package                 | Downloads/mo | How remeda is used                       | Functions found                                                               |
| ----------------------- | ------------ | ---------------------------------------- | ----------------------------------------------------------------------------- |
| @prisma/dev             | 28,985,936   | dependencies (remeda 2.33.4)             | difference, range                                                             |
| @prisma/studio-core     | 26,708,827   | devDependencies (bundled, remeda 2.33.4) | isDeepEqual, isObjectType, omit                                               |
| @convex-dev/better-auth | 992,732      | dependencies (^2.32.0)                   | prop, sortBy                                                                  |
| figma-developer-mcp     | 320,171      | dependencies (^2.20.1)                   | isTruthy                                                                      |
| @snaplet/seed           | 196,217      | dependencies (^1.61.0, remeda v1)        | filter, flat, intersection, isIncludedIn, isNot, mapValues, mergeDeep, sortBy |
| @llm-ui/markdown        | 155,794      | dependencies (^1.57.0, remeda v1)        | isDeepEqual                                                                   |
| isolate-package         | 111,269      | dependencies (^2.33.7)                   | isEmpty, omit, pick, unique                                                   |
| @kubb/studio            | 75,699       | dependencies (^2.50.0)                   | isPlainObject                                                                 |
| @opencode-ai/ui         | 68,995       | dependencies (2.26.0)                    | entries, flatMap, groupBy, map, pipe                                          |
| @likec4/diagram         | 29,747       | dependencies (^2.45.0)                   | 56 functions (see JSON)                                                       |
| kitcn                   | 11,030       | dependencies (^2.33.6)                   | prop, sortBy                                                                  |

Method: registry tarballs scanned for `from "remeda"`, `require("remeda")` and namespace usage; bundled packages via their esbuild metafile. Dependents were discovered through package.json hits in Sourcegraph (the registry exposes no dependents API), then matched to registry packages by repository URL (by name and content for @snaplet/seed and @llm-ui/markdown, whose registry entries list no repository). Several are in the Sourcegraph sample too (likec4, convex, kitcn, isolate-package), so this is a corroboration, not an independent sample, except for the Prisma packages. `rolldown`, `kysely` and `rambda` list remeda only as a devDependency for tooling or benchmarks and were not scanned.

## Lodash proxy

136 lodash functions have a docs mapping page naming a Remeda function (1 has no per-method package: lodash.tap). Downloads are last-month counts from `https://api.npmjs.org/downloads/point/last-month/lodash.<lowercased name>`. Context: lodash 705,719,046, lodash-es 198,783,407, lodash.merge 529,973,268.

Strong confound: the per-method packages are installed mostly as transitive dependencies of old libraries, not chosen by application authors. Verified dependency edges: `jsonwebtoken` pulls lodash.once, includes, isnumber, isstring, isboolean, isinteger and isplainobject; `table` pulls lodash.truncate; `@grpc/proto-loader` pulls lodash.camelcase. Those figures are flagged and excluded from the fallback test. The mapping is also many-to-one (for example filter <- filter, reject, compact, differenceBy) and loose in places (lodash `get` maps to `prop`, `debounce` and `throttle` map to `funnel`), so `lodashDownloads` sums the mapped packages.

| Remeda function | Lodash downloads/mo (sum) | Tier | Files in remeda sample | Note                              |
| --------------- | ------------------------- | ---- | ---------------------- | --------------------------------- |
| isPlainObject   | 299,108,113               | mid  | 129                    | inflated by transitive dependents |
| funnel          | 288,833,534               | low  | 16                     |                                   |
| isBoolean       | 241,431,247               | low  | 21                     | inflated by transitive dependents |
| toCamelCase     | 231,699,488               | low  | 15                     | inflated by transitive dependents |
| isString        | 225,252,061               | mid  | 76                     | inflated by transitive dependents |
| once            | 225,002,419               | low  | 10                     | inflated by transitive dependents |
| isIncludedIn    | 209,760,987               | low  | 5                      | inflated by transitive dependents |
| isNumber        | 209,156,767               | mid  | 33                     | inflated by transitive dependents |
| unique          | 148,658,629               | high | 185                    |                                   |
| flat            | 134,295,562               | mid  | 12                     |                                   |
| isDeepEqual     | 128,383,958               | high | 125                    |                                   |
| clone           | 119,758,698               | mid  | 103                    |                                   |
| sortBy          | 93,376,531                | high | 192                    |                                   |
| difference      | 83,797,863                | mid  | 24                     |                                   |
| groupBy         | 83,256,777                | high | 108                    |                                   |

Published studies: I know of no peer-reviewed study that ranks lodash functions by real-world usage, and I could not verify one (only the allowed domains were reachable), so none is cited. Package-level context that I recall but did not fetch: Abdalkareem, Nourry, Wehaibi, Mujahid and Shihab, "Why do developers use trivial packages? An empirical case study on npm", ESEC/FSE 2017 (micro-packages on npm in general); and Zimmermann, Staicu, Tenny and Pradel, "Small World with High Risks: A Study of Security Threats in the npm Ecosystem", USENIX Security 2019 (dependency concentration in npm). Neither measures function-level popularity.

## Caveats

1. Small, skewed sample. Sourcegraph's public index holds only about 176 repos and 2,959 files that mention remeda, versus tens of thousands of GitHub dependents. It leans toward recent TypeScript projects, especially AI-agent tooling (the opencode family) and a few large monorepos. 34 of 163 functions never appear, and 71 appear in fewer than five files.
2. Presence, not frequency. A file counts once per function; call counts, hot-path use and data sizes are unknown. Import style is the only evidence of data-first versus data-last use.
3. Clone clustering is heuristic (>= 5 identical file signatures). Unrelated repos with copied templates are only caught for identical full paths. Without de-duplication the opencode family alone would be about 27% of the sample (770 of 2871 files).
4. Concentration: four repos hold 917 of 2,143 files. The ranking is stable without them (Spearman rho 0.94 over 106 functions; pipe share 13.1% instead of 13.7%), and the score blends file, repo and sqrt-weighted shares, but several functions are driven by one or two repos (see per-function notes; for example hasAtLeast, isFunction, isTruthy, isPlainObject, only).
5. Tier boundaries are judgement calls. The top 11 are stable (P(high) of roughly 0.9 or more); uniqueBy, isEmpty, clone, clamp, isTruthy, chunk, mergeDeep, isPlainObject and keys are interchangeable around the high/mid line; the g7Pick slots 10-12 (mergeDeep, keys, mapToObj) are the least certain.
6. Lodash proxy is weak for application-level popularity (see above) and the mapping does not cover every Remeda function; unmapped functions have `lodashDownloads: null`.
7. Adopters: download counts measure installs, not call volume. Prisma's runtime use of remeda is minimal.
8. Remeda v1 projects (about 9% of declared package.json ranges) are included; v1-only names without a v2 equivalent are dropped. Deprecated utilities (debounce, pathOr, part of isEmpty) are tiered like any other.
9. Single snapshot (2026-10-07); Sourcegraph index freshness varies per repo.

## Full tier list

**high** (12): pipe, sortBy, omit, entries, mapValues, map, isDeepEqual, unique, groupBy, pick, filter, uniqueBy

**mid** (47): isEmpty, clone, clamp, isTruthy, chunk, mergeDeep, isPlainObject, keys, take, mapToObj, isNullish, pickBy, reverse, fromEntries, isObjectType, flatMap, range, values, sumBy, prop, isString, firstBy, isDefined, isNonNullish, omitBy, last, isArray, sort, pathOr, partition, isFunction, difference, indexBy, first, isNumber, mergeAll, zip, identity, flat, shuffle, mapKeys, find, randomString, concat, toKebabCase*, toSnakeCase*, toTitleCase*

**low** (104): hasAtLeast, funnel, doNothing, capitalize, join, reduce, isNonNull, sample, findLast, round, isBoolean, isShallowEqual, sum, piped, takeWhile, zipWith, countBy, merge, toCamelCase, intersection, forEachObj, forEach, randomInteger, isNot, sortedIndexWith, stringToPath, isEmptyish, isError, isPromise, dropWhile, isIncludedIn, invert, drop, dropLast, splitWhen, fromKeys, anyPass, once, debounce, times, uncapitalize, tap, allPass, groupByProp, only, pullObject, findLastIndex, takeFirstBy, defaultTo, sortedIndex, swapIndices, uniqueWith, meanBy, set, dropLastWhile, hasSubObject, mean, purry, isBigInt, differenceWith, length, split, toLowerCase, addProp, ceil, constant, isSymbol, median, sortedIndexBy, when, add, conditional, divide, dropFirstBy, endsWith, evolve, findIndex, floor, hasProp, intersectionWith, isDate, isStrictEqual, mapWithFeedback, multiply, nthBy, objOf, partialBind, partialLastBind, product, randomBigInt, rankBy, setPath, sliceString, sortedLastIndex, sortedLastIndexBy, splice, splitAt, startsWith, subtract, swapProps, takeLast, takeLastWhile, toUpperCase, truncate

`*` = tier set by the lodash fallback or adopter tie-break.

## Reproduction

All paths are relative to this directory. Scripts run in this order: `sg_search.sh` (fetch), `build_sample.cjs` -> `analyze.cjs` -> `bootstrap.cjs` -> `sensitivity.cjs` -> `adopters_scan.cjs` -> `assemble.cjs`. Raw search output is kept in `raw/*.sse`.

### Sourcegraph queries

Endpoint pattern (one request each, header `Accept: text/event-stream`, query URL-encoded): `https://sourcegraph.com/.api/search/stream?q=<QUERY>&v=V3&t=standard&display=100000&cm=true`

Shared exclusion block EXCL: `-file:\.d\.(ts|mts|cts)$ -file:(^|/)(node_modules|dist|build|vendor)/ -file:\.min\.js$ -repo:remeda -repo:es-toolkit fork:no archived:no`

- `named_ts`: `context:global patterntype:regexp file:\.(ts|tsx|mts|cts)$ EXCL import\s*\{[^}]*\}\s*from\s*["']remeda["'] count:all timeout:120s`
- `named_js`: `context:global patterntype:regexp file:\.(js|jsx|mjs|cjs)$ EXCL import\s*\{[^}]*\}\s*from\s*["']remeda["'] count:all timeout:120s`
- `named_sfc`: `context:global patterntype:regexp file:\.(vue|svelte|astro)$ EXCL import\s*\{[^}]*\}\s*from\s*["']remeda["'] count:all timeout:120s`
- `named_archived (sensitivity)`: `context:global patterntype:regexp file:\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|vue|svelte|astro)$ -file:\.d\.(ts|mts|cts)$ -file:(^|/)(node_modules|dist|build|vendor)/ -file:\.min\.js$ -repo:remeda -repo:es-toolkit fork:no archived:only import\s*\{[^}]*\}\s*from\s*["']remeda["'] count:all timeout:120s`
- `named_forks (check, 0 results)`: `context:global patterntype:regexp file:\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|vue|svelte|astro)$ -file:\.d\.(ts|mts|cts)$ -file:(^|/)(node_modules|dist|build|vendor)/ -repo:remeda archived:no fork:only import\s*\{[^}]*\}\s*from\s*["']remeda["'] count:all timeout:120s`
- `ns_import`: `context:global patterntype:regexp file:\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|vue|svelte|astro)$ EXCL import\s*\*\s*as\s+\w+\s+from\s*["']remeda["'] count:all timeout:120s`
- `ns_usage_R`: `context:global patterntype:regexp file:\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|vue|svelte|astro)$ EXCL import\s*\*\s*as\s+R\s+from\s*["']remeda["'] and \bR\.[a-zA-Z]+ count:all timeout:180s`
- `ns_usage__ (alias _)`: `same as ns_usage_R with alias _ : import\s*\*\s*as\s+_\s+from\s*["']remeda["'] and \b_\.[a-zA-Z]+`
- `ns_usage_remeda (alias remeda)`: `same as ns_usage_R with alias remeda : import\s*\*\s*as\s+remeda\s+from\s*["']remeda["'] and \bremeda\.[a-zA-Z]+`
- `require`: `context:global patterntype:regexp file:\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|vue|svelte|astro)$ EXCL require\(\s*["']remeda["']\s*\) count:all timeout:120s`
- `other_forms`: `context:global patterntype:regexp file:\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|vue|svelte|astro)$ EXCL (import\s+\w+\s*(,|from)\s*["']remeda["']|import\(\s*["']remeda["']\s*\)|export\s*(\*|\{[^}]*\})\s*from\s*["']remeda["']) count:all timeout:120s`
- `cov_quoted (coverage check)`: `context:global patterntype:regexp file:\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|vue|svelte|astro)$ EXCL ["']remeda(/[^"']*)?["'] count:all timeout:180s`
- `xcheck_<fn> (pipe, sortBy)`: `context:global patterntype:regexp select:file file:\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|vue|svelte|astro)$ EXCL import\s*\{[^}]*\b<fn>\b[^}]*\}\s*from\s*["']remeda["'] count:all timeout:120s`
- `pkgjson`: `context:global patterntype:regexp file:(^|/)package\.json$ -file:node_modules -file:(^|/)(dist|build|vendor)/ -repo:remeda -repo:es-toolkit fork:no archived:no ^\s*"remeda"\s*: count:all timeout:120s`
- `pkgjson_name`: `same as pkgjson with extra operand: ^\s*"remeda"\s*: and ^\s*"(name|private)"\s*:`

Raw-file spot checks (14 URLs, listed in `verify_urls.txt` and `verify_urls_named.txt`), pattern: `https://sourcegraph.com/<repo>@<commit>/-/raw/<path>`.

### npm registry and downloads

- Latest metadata: `https://registry.npmjs.org/@prisma%2Fdev/latest`; tarball `https://registry.npmjs.org/@prisma/dev/-/dev-0.25.2.tgz`.
- Dependent candidates: `https://registry.npmjs.org/<name>/latest` for the 140 non-private package names found in the package.json hits (75 exist; `adopters/registry_status.txt`); tarballs from each `dist.tarball`.
- Downloads: `https://api.npmjs.org/downloads/point/last-month/<package>` (period 2026-09-05 to 2026-10-04) for adopters (`adopters/downloads.tsv`, `adopters/key_downloads.txt`), for `lodash.<name>` of each mapped lodash function (`lodash/downloads.tsv`), and for lodash, lodash-es, lodash.merge, lodash.mergewith (`lodash/extra_downloads.txt`).
- Transitive-anchor check: `https://registry.npmjs.org/jsonwebtoken/latest`, `.../table/latest`, `.../@grpc%2Fproto-loader/latest` (`lodash/transitive_anchor_check.txt`).
- Probes that returned nothing useful: `https://registry.npmjs.org/-/_view/dependedUpon?...` (404) and `https://registry.npmjs.org/-/v1/search?text=remeda` (only remeda-named packages).

### Local inputs

- Exports: `packages/remeda/src/index.ts` (163 utilities, `remeda_exports.txt`).
- Lodash mapping: `packages/docs/src/content/mapping/lodash/*.md` frontmatter `remeda:` field (`lodash_mapping_raw.txt`, 136 mapped pairs after dropping blanks).
- Kinds (`kinds.json`): 19 lazy (given), pipe/piped, 93 plain purry (source file calls `purry(`, not lazy, not `purry` itself), 49 other dispatch.
