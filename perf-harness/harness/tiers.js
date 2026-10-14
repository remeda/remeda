// The priority model. Every (scenario, size) gets a tier from its shape and
// size, then drops one tier when its main utility has mid popularity and two
// when it has low popularity (never past tier 3).
//
//   Tier 1 (strict)   data-first (G5, G7) and data-last outside pipe (G6, G7)
//                     at XS/S/C/x64/x1; non-lazy pipes (G3); short lazy pipes
//                     (1-3 lazy steps) and interleaved pipes at XS/S/C.
//   Tier 2 (lenient)  the same shapes at M/Mx64; other lazy pipes (4-7
//                     consecutive lazy steps); other iterables (G4); reused
//                     steps and `piped`; length-0 callbacks (G9).
//   Tier 3 (report)   long consecutive lazy runs (8-15 steps); size L; exotic
//                     item kinds (G8). Lower JIT tiers are run modes, so a
//                     whole run under --jitless / --max-opt is reported as
//                     tier 3 by the aggregation.
//
// Popularity comes from research/popularity.json (`functions.<name>.tier`,
// one of high / mid / low). A function missing from it (or the whole file
// missing) counts as "high", and the outputs say so.
//
// tier-overrides.json then sets the tier outright for chosen (function, kind,
// size) combinations, each with its reason (data-first `difference`, the
// biggest adopter's whole surface, is tier 1 despite its mid popularity).

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PERF_DIR } from "./copies.js";

export const POPULARITY_FILE = path.join(
  PERF_DIR,
  "research",
  "popularity.json",
);
export const OVERRIDES_FILE = path.join(PERF_DIR, "tier-overrides.json");

export const KINDS = [
  "data-first",
  "data-last",
  "non-lazy-pipe",
  "lazy-short",
  "interleaved",
  "lazy-other",
  "lazy-long",
  "iterable",
  "reuse",
  "length0",
  "item-kind",
];

// Sizes at which the strict shapes are tier 1.
const SMALL_SIZES = new Set(["XS", "S", "C", "x64", "x1"]);

const POPULARITY_LEVELS = ["high", "mid", "low"];

// Weights for the popularity-weighted geomeans.
export const POPULARITY_WEIGHTS = { high: 4, mid: 2, low: 1 };

let popularityCache;

export function popularityData() {
  if (popularityCache === undefined) {
    if (existsSync(POPULARITY_FILE)) {
      const parsed = JSON.parse(readFileSync(POPULARITY_FILE, "utf8"));
      popularityCache = {
        source: "research/popularity.json",
        functions: parsed.functions ?? {},
      };
    } else {
      popularityCache = { source: "absent", functions: {} };
    }
  }
  return popularityCache;
}

export function popularityOf(name) {
  const entry = popularityData().functions[name];
  const level =
    typeof entry?.tier === "string" ? entry.tier.toLowerCase() : undefined;
  return POPULARITY_LEVELS.includes(level)
    ? { level, defaulted: false }
    : { level: "high", defaulted: true };
}

let overridesCache;

/** `[{ function, kinds?, sizes?, tier, reason }]` from tier-overrides.json. */
export function tierOverrides() {
  if (overridesCache === undefined) {
    overridesCache = existsSync(OVERRIDES_FILE)
      ? (JSON.parse(readFileSync(OVERRIDES_FILE, "utf8")).overrides ?? [])
      : [];
    for (const rule of overridesCache) {
      if (![1, 2, 3].includes(rule.tier) || typeof rule.function !== "string") {
        throw new Error(
          `tier-overrides.json: bad rule ${JSON.stringify(rule)}`,
        );
      }
    }
  }
  return overridesCache;
}

function overrideFor(shape) {
  return tierOverrides().find(
    (rule) =>
      rule.function === shape.main &&
      (rule.kinds === undefined || rule.kinds.includes(shape.kind)) &&
      (rule.sizes === undefined || rule.sizes.includes(shape.size)),
  );
}

export function baseTier(kind, size) {
  if (size === "L") {
    return 3;
  }
  switch (kind) {
    case "data-first":
    case "data-last":
    case "non-lazy-pipe":
    case "lazy-short":
    case "interleaved": {
      return SMALL_SIZES.has(size) ? 1 : 2;
    }
    case "lazy-other":
    case "iterable":
    case "reuse":
    case "length0": {
      return 2;
    }
    case "lazy-long":
    case "item-kind": {
      return 3;
    }
    default: {
      throw new Error(`Unknown scenario kind "${kind}"`);
    }
  }
}

/** `shape` needs `kind`, `main` (the main utility's name) and `size`. */
export function tierOf(shape) {
  const base = baseTier(shape.kind, shape.size);
  const popularity = popularityOf(shape.main);
  const drop =
    popularity.level === "mid" ? 1 : popularity.level === "low" ? 2 : 0;
  const popularityTier = Math.min(3, base + drop);
  const override = overrideFor(shape);
  return {
    tier: override?.tier ?? popularityTier,
    baseTier: base,
    popularity: popularity.level,
    popularityDefaulted: popularity.defaulted,
    ...(override === undefined
      ? {}
      : {
          override: {
            function: override.function,
            tier: override.tier,
            popularityTier,
            reason: override.reason,
          },
        }),
  };
}
