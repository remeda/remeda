// Run selection, read once from the environment so every module of a run
// (setup file, bench files, validation, the portable runner, allocation and
// heap scripts) sees the same choices.
//
//   PERF_LIBS        the copy list, e.g. "main,branch,main-aa" (default) or
//                    with variant copies appended. Any copy under libs/.
//   PERF_ROTATION    k: entries run in the copy list rotated left by k, so a
//                    full rotation set (k = 0..n-1) puts every copy in every
//                    position once. Default 0. Native always runs last.
//   PERF_GROUPS      subset of groups (G1..G10). Default: all.
//   PERF_SIZES       subset of sizes (XS,S,C,M,Mx64,L,x64,x1). Default: all.
//   PERF_IDS         regex matched against the scenario id. Default: all.
//   PERF_TAGS        only scenarios carrying one of these tags.
//   PERF_SUBSET      a named subset: E (extras), H (headline), T1 (tier 1).
//   PERF_TIERS       only these tiers, e.g. "1" or "1,2".
//   PERF_TARGETS     variant names: their target flows from variants/index.json.
//                    With PERF_TIERS, the selection is the union of both.
//   PERF_GUARD       a named subset selected in union with PERF_TIERS and
//                    PERF_TARGETS (a lighter tier 1 guard next to a
//                    variant's targets, e.g. T1G).
//   PERF_TIME_SCALE  multiplier on every time budget. Default: 1 (500ms per
//                    task, 1500ms for L, warmups 100ms / 300ms).
//   PERF_SOURCE      "src" (TS source through vitest's transform), "dist"
//                    (the built ESM, loaded natively), "cjs" (the built CJS
//                    through require) or "bundle" (one scope-hoisted esbuild
//                    bundle per copy). Default: src.
//   PERF_NATIVE      "0" drops the native entries.
//   PERF_POLLUTION   P0 (none), P1 (map/filter/find/take over 10 item shapes)
//                    or P2 (the uniform pass, default).
//   PERF_NODE_FLAGS  extra node flags for the bench worker, e.g. "--jitless"
//                    (read by vitest.config.js).

import {
  BASE_COPIES,
  copyExists,
  PERF_DIR,
  readVariantsIndex,
  rotate,
  targetMatches,
} from "./copies.js";
import { tierOf } from "./tiers.js";

export { PERF_DIR };

export const KNOWN_GROUPS = [
  "G1",
  "G1b",
  "G2",
  "G3",
  "G4",
  "G5",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
];
export const KNOWN_SIZES = ["XS", "S", "C", "M", "Mx64", "L", "x64", "x1"];
export const KNOWN_TAGS = ["data-first-guard", "headline", "traps"];
export const KNOWN_SOURCES = ["src", "dist", "cjs", "bundle"];
export const KNOWN_POLLUTION = ["P0", "P1", "P2"];

// Named subsets, shared by run-bench, run-portable and the stage generator.
export const SUBSETS = {
  // The extras matrix (JIT tiers, pollution profiles, runtimes, loaders).
  E: {
    groups: ["G1", "G3", "G5", "G6", "G7", "G10"],
    sizes: ["XS", "S", "C", "M", "x64", "x1"],
  },
  // Headline scenarios (one-copy-per-process cross-check, portable runner).
  H: { tags: ["headline"], sizes: ["S", "C", "M", "x64"] },
  // Tier 1 only.
  T1: { tiers: [1] },
  // The headline scenarios plus every tier 1 data-first entry: the extras'
  // subset when T1 is too long for the stage budget.
  HD: {
    any: [
      { tags: ["headline"], sizes: ["S", "C", "M", "x64"] },
      { tiers: [1], kinds: ["data-first"] },
    ],
  },
  // A lighter tier 1 guard for variant confirmation (--guard): tier 1 at the
  // sizes where per-call overhead dominates (XS and the scalar pipes) plus the
  // headline entries.
  T1G: {
    any: [
      { tiers: [1], sizes: ["XS", "x64", "x1"] },
      { tiers: [1], tags: ["headline"] },
    ],
  },
};

function parseList(raw, name, known) {
  if (raw === undefined || raw.trim() === "") {
    return undefined;
  }
  const items = raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
  if (known !== undefined) {
    for (const item of items) {
      if (!known.includes(item)) {
        throw new Error(
          `${name}: unknown value "${item}" (known: ${known.join(", ")})`,
        );
      }
    }
  }
  if (new Set(items).size !== items.length) {
    throw new Error(`${name}: duplicate values in "${raw}"`);
  }
  return items;
}

/**
 * The selection a set of PERF_* variables describes (the stage generator
 * evaluates selections for other runs with it).
 */
export function readConfig(environment) {
  const libs = parseList(environment.PERF_LIBS, "PERF_LIBS") ?? BASE_COPIES;
  for (const id of libs) {
    if (!copyExists(id)) {
      throw new Error(`PERF_LIBS: no copy "${id}" under libs/`);
    }
  }
  const rotation = Number(environment.PERF_ROTATION ?? "0");
  if (!Number.isInteger(rotation) || rotation < 0) {
    throw new Error("PERF_ROTATION must be a non-negative integer");
  }
  const groups =
    parseList(environment.PERF_GROUPS, "PERF_GROUPS", KNOWN_GROUPS) ??
    KNOWN_GROUPS;
  const sizes =
    parseList(environment.PERF_SIZES, "PERF_SIZES", KNOWN_SIZES) ?? KNOWN_SIZES;
  const ids =
    environment.PERF_IDS === undefined || environment.PERF_IDS === ""
      ? undefined
      : new RegExp(environment.PERF_IDS, "u");
  const timeScale = Number(environment.PERF_TIME_SCALE ?? "1");
  if (!Number.isFinite(timeScale) || timeScale <= 0) {
    throw new Error("PERF_TIME_SCALE must be a positive number");
  }
  const source = environment.PERF_SOURCE ?? "src";
  if (!KNOWN_SOURCES.includes(source)) {
    throw new Error(`PERF_SOURCE must be one of ${KNOWN_SOURCES.join(", ")}`);
  }
  const pollution = environment.PERF_POLLUTION ?? "P2";
  if (!KNOWN_POLLUTION.includes(pollution)) {
    throw new Error(
      `PERF_POLLUTION must be one of ${KNOWN_POLLUTION.join(", ")}`,
    );
  }
  const subsetName =
    environment.PERF_SUBSET === undefined || environment.PERF_SUBSET === ""
      ? undefined
      : environment.PERF_SUBSET;
  if (subsetName !== undefined && SUBSETS[subsetName] === undefined) {
    throw new Error(
      `PERF_SUBSET: unknown subset "${subsetName}" (known: ${Object.keys(SUBSETS).join(", ")})`,
    );
  }
  const tiers = parseList(environment.PERF_TIERS, "PERF_TIERS", [
    "1",
    "2",
    "3",
  ])?.map(Number);
  const guard =
    environment.PERF_GUARD === undefined || environment.PERF_GUARD === ""
      ? undefined
      : environment.PERF_GUARD;
  if (guard !== undefined && SUBSETS[guard] === undefined) {
    throw new Error(
      `PERF_GUARD: unknown subset "${guard}" (known: ${Object.keys(SUBSETS).join(", ")})`,
    );
  }
  const targetNames = parseList(environment.PERF_TARGETS, "PERF_TARGETS");
  let targets;
  if (targetNames !== undefined) {
    const index = readVariantsIndex();
    targets = targetNames.map((name) => {
      const variant = index.find((candidate) => candidate.name === name);
      if (variant === undefined) {
        throw new Error(
          `PERF_TARGETS: no variant "${name}" in variants/index.json`,
        );
      }
      return variant.targets;
    });
  }
  return {
    libs,
    rotation,
    order: rotate(libs, rotation),
    groups,
    sizes,
    ids,
    tags: parseList(environment.PERF_TAGS, "PERF_TAGS", KNOWN_TAGS),
    subset: subsetName,
    tiers,
    guard,
    targetNames,
    targets,
    timeScale,
    source,
    native: environment.PERF_NATIVE !== "0",
    pollution,
  };
}

export const config = readConfig(process.env);

function matchesSubset(subset, shape) {
  if (
    subset.any !== undefined &&
    !subset.any.some((part) => matchesSubset(part, shape))
  ) {
    return false;
  }
  if (subset.kinds !== undefined && !subset.kinds.includes(shape.kind)) {
    return false;
  }
  if (subset.groups !== undefined && !subset.groups.includes(shape.group)) {
    return false;
  }
  if (subset.sizes !== undefined && !subset.sizes.includes(shape.size)) {
    return false;
  }
  if (
    subset.tags !== undefined &&
    !subset.tags.some((tag) => shape.tags.includes(tag))
  ) {
    return false;
  }
  if (
    subset.tiers !== undefined &&
    !subset.tiers.includes(tierOf(shape).tier)
  ) {
    return false;
  }
  return true;
}

/**
 * `shape` is `{ group, id, size, tags, kind, main }`. The group, size, id, tag
 * and subset filters all apply; tiers and variant targets, when given, select
 * their union on top.
 */
export function isSelected(shape, selection = config) {
  if (
    !selection.groups.includes(shape.group) ||
    !selection.sizes.includes(shape.size) ||
    (selection.ids !== undefined && !selection.ids.test(shape.id)) ||
    (selection.tags !== undefined &&
      !selection.tags.some((tag) => shape.tags.includes(tag)))
  ) {
    return false;
  }
  if (
    selection.subset !== undefined &&
    !matchesSubset(SUBSETS[selection.subset], shape)
  ) {
    return false;
  }
  if (
    selection.tiers === undefined &&
    selection.targets === undefined &&
    selection.guard === undefined
  ) {
    return true;
  }
  return (
    (selection.tiers?.includes(tierOf(shape).tier) ?? false) ||
    (selection.guard !== undefined &&
      matchesSubset(SUBSETS[selection.guard], shape)) ||
    (selection.targets?.some((targets) => targetMatches(targets, shape)) ??
      false)
  );
}
