// Library copies. Every directory `libs/<id>/packages/remeda` is a copy:
//
//   main            main (the merge base), the reference
//   main-aa         a second copy of main: same code, separate module
//                   instances (the A/A control)
//   branch          the branch under test
//   branch-v-<name> the branch with one variant patch from variants/index.json
//   branch-v-combo  the branch with every surviving variant patch applied
//
// scripts/prepare.mjs creates them and records what it built (and whether each
// copy applied, built and validated) in libs/COPIES.json.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const LIBS_DIR = path.join(PERF_DIR, "libs");
export const VARIANTS_DIR = path.join(PERF_DIR, "variants");
// PERF_VARIANTS_INDEX points at another list (for testing the variant
// pipeline without touching variants/); patch paths still resolve against
// variants/.
export const VARIANTS_INDEX =
  process.env.PERF_VARIANTS_INDEX === undefined ||
  process.env.PERF_VARIANTS_INDEX === ""
    ? path.join(VARIANTS_DIR, "index.json")
    : path.resolve(PERF_DIR, process.env.PERF_VARIANTS_INDEX);
export const COPIES_FILE = path.join(LIBS_DIR, "COPIES.json");

// Every run includes these three, in this canonical order; rotations start
// from it.
export const BASE_COPIES = ["main", "branch", "main-aa"];

export const COMBO_COPY = "branch-v-combo";

const COPY_ID_RE = /^[\w.-]+$/u;

export function copyRoot(id) {
  return path.join(LIBS_DIR, id);
}

export function copyPackageDir(id) {
  return path.join(LIBS_DIR, id, "packages", "remeda");
}

export function copyExists(id) {
  return (
    COPY_ID_RE.test(id) &&
    existsSync(path.join(copyPackageDir(id), "package.json"))
  );
}

/** Every copy present on disk, base copies first, then the rest sorted. */
export function listCopies() {
  if (!existsSync(LIBS_DIR)) {
    return [];
  }
  const present = readdirSync(LIBS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .filter((id) => copyExists(id));
  return [
    ...BASE_COPIES.filter((id) => present.includes(id)),
    ...present.filter((id) => !BASE_COPIES.includes(id)).sort(),
  ];
}

/**
 * Which lazy protocol a copy must speak: main returns `{ done, hasNext, next }`
 * objects from its evaluators, the branch (and every variant built on it)
 * returns the item itself or a control object.
 */
export function expectedProtocol(id) {
  return id === "main" || id.startsWith("main-") ? "legacy" : "item-or-control";
}

export function isVariantCopy(id) {
  return id.startsWith("branch-v-");
}

/** Copy ids are directory names, so variant names are sanitized. */
export function variantCopyId(name) {
  return `branch-v-${name.replaceAll(/[^\w.-]/gu, "-")}`;
}

/**
 * The variant list written by the variant agent:
 *   [{ name, patch, targets: { groups, ids, sizes }, description }]
 * `patch` is a path (relative to variants/, or to this directory) of a diff
 * whose paths are relative to `packages/remeda`, or the diff text itself.
 * Returns [] when the file is absent.
 */
export function readVariantsIndex() {
  if (!existsSync(VARIANTS_INDEX)) {
    return [];
  }
  const parsed = JSON.parse(readFileSync(VARIANTS_INDEX, "utf8"));
  const list = Array.isArray(parsed) ? parsed : (parsed.variants ?? []);
  return list.map((variant, position) => {
    if (typeof variant?.name !== "string" || variant.name === "") {
      throw new Error(`variants/index.json entry ${position} has no name`);
    }
    if (variant.name === "combo") {
      throw new Error(`variants/index.json: "combo" is a reserved name`);
    }
    return {
      name: variant.name,
      copyId: variantCopyId(variant.name),
      patch: variant.patch,
      description: variant.description ?? "",
      targets: variant.targets ?? {},
      // "own" marks a variant that changes the control protocol itself (new
      // control keys): its control objects are not meant to be understood by
      // the branch's pipe, so validation pairs it with its own other build.
      protocol: variant.protocol ?? "branch",
    };
  });
}

export function readCopiesStatus() {
  if (!existsSync(COPIES_FILE)) {
    return { copies: {} };
  }
  return JSON.parse(readFileSync(COPIES_FILE, "utf8"));
}

/**
 * A copy is usable when it exists and prepare.mjs didn't mark it as failed
 * (copies prepare.mjs never saw, e.g. hand-made ones, count as usable).
 */
export function copyUsable(id) {
  if (!copyExists(id)) {
    return false;
  }
  const status = readCopiesStatus().copies?.[id]?.status;
  return status === undefined || status === "ok";
}

/**
 * Whether a scenario shape `{ group, id, size }` is inside a variant's target
 * flow. Missing fields don't constrain. `ids` is a regex string, or an array
 * of exact scenario ids.
 */
export function targetMatches(targets, shape) {
  if (targets === undefined || targets === null) {
    return false;
  }
  const { groups, ids, sizes } = targets;
  if (
    Array.isArray(groups) &&
    groups.length > 0 &&
    !groups.includes(shape.group)
  ) {
    return false;
  }
  if (Array.isArray(sizes) && sizes.length > 0 && !sizes.includes(shape.size)) {
    return false;
  }
  if (
    typeof ids === "string" &&
    ids !== "" &&
    !new RegExp(ids, "u").test(shape.id)
  ) {
    return false;
  }
  if (Array.isArray(ids) && ids.length > 0 && !ids.includes(shape.id)) {
    return false;
  }
  return true;
}

export function rotate(list, rotation) {
  if (list.length === 0) {
    return [];
  }
  const offset = ((rotation % list.length) + list.length) % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)];
}
