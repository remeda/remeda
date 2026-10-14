// Brings libs/ to the state a stage measures, idempotently. The watcher's
// first step of every stage runs it.
//
//   node scripts/prepare.mjs --sha <branch sha>
//     [--variants <list.json> | --no-variants]
//     [--combine <survivors.json> | --combo-patch <patch>]
//     [--skip-validate] [--force-validate]
//
//   1. Snapshots (`git archive` of `packages/remeda`): libs/main and
//      libs/main-aa at main, libs/branch at --sha. A snapshot already at the
//      right revision (libs/REVISIONS.txt) is kept.
//   2. Variants: every patch listed in variants/index.json is applied to a
//      fresh copy of the branch, libs/branch-v-<name>. A patch that doesn't
//      apply is reported and skipped. With --variants, only the variants
//      named in that file's `survivors` (and `separate`) are prepared, and
//      with --no-variants none; other variant copies on disk are marked
//      stale. With --combine, the variants listed in the file's `survivors`
//      are applied together to libs/branch-v-combo; with --combo-patch, that
//      one (hand-merged) patch is applied to libs/branch-v-combo instead.
//   3. Dists (and bundles) for every copy, via build-dist.mjs (skipped when a
//      copy's sources didn't change).
//   4. Validation (scripts/validate.mjs): dist in full, cjs and bundle on a
//      subset. Skipped when neither the copies nor the harness changed since
//      the last passing validation.
//
// libs/COPIES.json records every copy's revision and status (ok,
// apply-failed, build-failed, validate-failed, stale). Only `ok` copies are
// measured. Replaced directories are moved to libs/.trash, never deleted.
//
// Exits non-zero when main, main-aa or branch can't be prepared or fail
// validation; a failing variant only gets its status.

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { acquireBenchLock } from "./lock.mjs";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const LIBS_DIR = path.join(PERF_DIR, "libs");
const REVISIONS_FILE = path.join(LIBS_DIR, "REVISIONS.txt");
const COPIES_FILE = path.join(LIBS_DIR, "COPIES.json");
const VALIDATE_STAMP_FILE = path.join(LIBS_DIR, ".validate-stamp");
const MAIN_SHA = "8e6e78f6eaf66eaf0b4797d72cc3691823c91335";
const COMBO_ID = "branch-v-combo";

const { values } = parseArgs({
  options: {
    sha: { type: "string" },
    variants: { type: "string" },
    "no-variants": { type: "boolean", default: false },
    combine: { type: "string" },
    "combo-patch": { type: "string" },
    "skip-validate": { type: "boolean", default: false },
    "force-validate": { type: "boolean", default: false },
  },
});
if (values.sha === undefined || values.sha === "") {
  throw new Error("--sha <branch commit> is required");
}
if (values.combine !== undefined && values["combo-patch"] !== undefined) {
  throw new Error(
    "--combine and --combo-patch both build libs/branch-v-combo; pass one",
  );
}

const { readVariantsIndex, variantCopyId, VARIANTS_DIR } =
  await import("../harness/copies.js");

function log(message) {
  process.stdout.write(`[prepare] ${message}\n`);
}

function findRepo(start) {
  let directory = path.dirname(start);
  while (directory !== path.dirname(directory)) {
    if (
      existsSync(path.join(directory, ".git")) &&
      existsSync(path.join(directory, "packages", "remeda", "package.json"))
    ) {
      return directory;
    }
    directory = path.dirname(directory);
  }
  throw new Error(`Could not locate the repo above ${start}`);
}
const REPO_DIR = findRepo(PERF_DIR);

function git(args, options = {}) {
  const result = spawnSync("git", ["-C", REPO_DIR, ...args], {
    encoding: options.encoding ?? "utf8",
    maxBuffer: 512 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  }
  return result.stdout;
}

const sha256 = (text) => createHash("sha256").update(text).digest("hex");

/** Moves a directory into libs/.trash instead of deleting it. */
function moveAside(directory, label) {
  if (!existsSync(directory)) {
    return;
  }
  const trash = path.join(LIBS_DIR, ".trash");
  mkdirSync(trash, { recursive: true });
  const target = path.join(
    trash,
    `${label}-${new Date().toISOString().replaceAll(/[:.]/gu, "-")}`,
  );
  renameSync(directory, target);
  log(
    `moved ${path.relative(PERF_DIR, directory)} to ${path.relative(PERF_DIR, target)}`,
  );
}

function readRevisions() {
  if (!existsSync(REVISIONS_FILE)) {
    return {};
  }
  return Object.fromEntries(
    readFileSync(REVISIONS_FILE, "utf8")
      .split("\n")
      .map((line) => line.trim().split(/\s+/u))
      .filter((parts) => parts.length === 2),
  );
}

function writeRevisions(revisions) {
  writeFileSync(
    REVISIONS_FILE,
    `${Object.entries(revisions)
      .map(([id, revision]) => `${id} ${revision}`)
      .join("\n")}\n`,
  );
}

function readStatus() {
  return existsSync(COPIES_FILE)
    ? JSON.parse(readFileSync(COPIES_FILE, "utf8"))
    : { copies: {} };
}

function packageDirOf(id) {
  return path.join(LIBS_DIR, id, "packages", "remeda");
}

/** `git archive` of packages/remeda at `commit` into libs/<id>. */
function snapshot(id, commit) {
  moveAside(path.join(LIBS_DIR, id), id);
  const tarDir = path.join(PERF_DIR, ".tmp");
  mkdirSync(tarDir, { recursive: true });
  const tarFile = path.join(tarDir, `prepare-${id}-${process.pid}.tar`);
  git([
    "archive",
    "--format=tar",
    `--output=${tarFile}`,
    commit,
    "packages/remeda",
  ]);
  mkdirSync(path.join(LIBS_DIR, id));
  const extract = spawnSync(
    "tar",
    // Editor settings aren't needed, and some sandboxes refuse to write them.
    ["-xf", tarFile, "--exclude", "*/.vscode/*", "-C", path.join(LIBS_DIR, id)],
    {
      encoding: "utf8",
    },
  );
  rmSync(tarFile, { force: true });
  if (extract.status !== 0) {
    throw new Error(`tar failed for ${id}: ${extract.stderr}`);
  }
  log(`snapshot ${id} at ${commit.slice(0, 8)}`);
}

/** A fresh copy of the branch snapshot's sources (no node_modules, no dist). */
function copyBranchSources(id) {
  moveAside(path.join(LIBS_DIR, id), id);
  const source = packageDirOf("branch");
  const target = packageDirOf(id);
  mkdirSync(target, { recursive: true });
  for (const entry of readdirSync(source)) {
    if (entry === "node_modules" || entry === "dist") {
      continue;
    }
    cpSync(path.join(source, entry), path.join(target, entry), {
      recursive: true,
    });
  }
}

function patchTextOf(variant) {
  const candidates = [
    path.resolve(VARIANTS_DIR, variant.patch),
    path.resolve(PERF_DIR, variant.patch),
  ];
  const file = candidates.find(
    (candidate) => existsSync(candidate) && !candidate.endsWith(path.sep),
  );
  if (file !== undefined) {
    return readFileSync(file, "utf8");
  }
  if (/^(?:diff |--- |Index: )/mu.test(variant.patch)) {
    return variant.patch;
  }
  throw new Error(`patch "${variant.patch}" is neither a file nor a diff`);
}

// `git apply` must not see the repo that encloses this directory (it would
// resolve the patch's paths against the repo root): the ceiling stops its
// repository search below PERF_DIR, so it runs as a plain patch tool.
const APPLY_ENVIRONMENT = {
  ...process.env,
  GIT_CEILING_DIRECTORIES: PERF_DIR,
};

function assertNoRepoFrom(directory) {
  const probe = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: directory,
    env: APPLY_ENVIRONMENT,
    encoding: "utf8",
  });
  if (probe.status === 0) {
    throw new Error(
      `git still finds a repository from ${directory} (${probe.stdout.trim()}); refusing to run git apply there`,
    );
  }
}

/** Applies a diff whose paths are relative to packages/remeda. */
function applyPatch(directory, patchText, { check }) {
  assertNoRepoFrom(directory);
  const patchFile = path.join(PERF_DIR, ".tmp", `prepare-${process.pid}.patch`);
  mkdirSync(path.dirname(patchFile), { recursive: true });
  writeFileSync(patchFile, patchText);
  try {
    let lastError = "";
    for (const strip of ["-p1", "-p0"]) {
      const result = spawnSync(
        "git",
        [
          "apply",
          strip,
          "--whitespace=nowarn",
          ...(check ? ["--check"] : []),
          patchFile,
        ],
        { cwd: directory, env: APPLY_ENVIRONMENT, encoding: "utf8" },
      );
      if (result.status === 0) {
        return { ok: true, strip };
      }
      lastError = result.stderr.trim();
    }
    return { ok: false, error: lastError };
  } finally {
    rmSync(patchFile, { force: true });
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: PERF_DIR,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 512 * 1024 * 1024,
    ...options,
  });
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  return result;
}

// ---------------------------------------------------------------------------

acquireBenchLock();
const started = performance.now();

const branchSha = git([
  "rev-parse",
  "--verify",
  `${values.sha}^{commit}`,
]).trim();
const mainSha = git(["rev-parse", "--verify", `${MAIN_SHA}^{commit}`]).trim();
const revisions = readRevisions();
const previous = readStatus();
const status = {
  generatedAt: new Date().toISOString(),
  branchSha,
  mainSha,
  copies: {},
};

// 1. Snapshots.
for (const [id, commit] of [
  ["main", mainSha],
  ["main-aa", mainSha],
  ["branch", branchSha],
]) {
  if (
    revisions[id] === commit &&
    existsSync(path.join(packageDirOf(id), "package.json"))
  ) {
    log(`${id} already at ${commit.slice(0, 8)}`);
  } else {
    snapshot(id, commit);
    revisions[id] = commit;
  }
  status.copies[id] = { revision: commit, status: "pending" };
}

// 2. Variants.
const allVariants = readVariantsIndex();
let variants = allVariants;
if (values["no-variants"]) {
  // The publication stage measures main and the branch only.
  variants = [];
  log("variants: none (--no-variants)");
} else if (values.variants !== undefined) {
  const listFile = path.resolve(PERF_DIR, values.variants);
  const list = JSON.parse(readFileSync(listFile, "utf8"));
  const names = new Set([...(list.survivors ?? []), ...(list.separate ?? [])]);
  const unknown = [...names].filter(
    (name) => !allVariants.some((variant) => variant.name === name),
  );
  if (unknown.length > 0) {
    throw new Error(
      `${values.variants} names variants missing from variants/index.json: ${unknown.join(", ")}`,
    );
  }
  variants = allVariants.filter((variant) => names.has(variant.name));
  log(
    `variants: ${variants.length} of ${allVariants.length} selected by ${values.variants}`,
  );
}
const variantPatches = new Map();
for (const variant of variants) {
  const id = variant.copyId;
  let patchText;
  try {
    patchText = patchTextOf(variant);
  } catch (error) {
    status.copies[id] = {
      variant: variant.name,
      status: "apply-failed",
      error: String(error.message),
    };
    log(`variant ${variant.name}: ${error.message}`);
    continue;
  }
  variantPatches.set(variant.name, patchText);
  const revision = `${branchSha}+${sha256(patchText).slice(0, 12)}`;
  status.copies[id] = { variant: variant.name, revision, status: "pending" };
  if (
    revisions[id] === revision &&
    existsSync(path.join(packageDirOf(id), "package.json"))
  ) {
    log(`variant ${variant.name}: ${id} already at ${revision}`);
    continue;
  }
  const checked = applyPatch(packageDirOf("branch"), patchText, {
    check: true,
  });
  if (!checked.ok) {
    status.copies[id] = {
      ...status.copies[id],
      status: "apply-failed",
      error: checked.error,
    };
    log(
      `variant ${variant.name}: patch does not apply to branch ${branchSha.slice(0, 8)}: ${checked.error.split("\n")[0]}`,
    );
    if (existsSync(path.join(LIBS_DIR, id))) {
      moveAside(path.join(LIBS_DIR, id), id);
    }
    delete revisions[id];
    continue;
  }
  copyBranchSources(id);
  const applied = applyPatch(packageDirOf(id), patchText, { check: false });
  if (!applied.ok) {
    status.copies[id] = {
      ...status.copies[id],
      status: "apply-failed",
      error: applied.error,
    };
    moveAside(path.join(LIBS_DIR, id), id);
    delete revisions[id];
    continue;
  }
  revisions[id] = revision;
  log(`variant ${variant.name}: applied (${applied.strip}) to ${id}`);
}

// Variant copies on disk that variants/index.json no longer lists, or that
// --variants didn't select.
const listedIds = new Set(variants.map((variant) => variant.copyId));
const indexedIds = new Set(allVariants.map((variant) => variant.copyId));
for (const entry of readdirSync(LIBS_DIR, { withFileTypes: true })) {
  if (
    entry.isDirectory() &&
    entry.name.startsWith("branch-v-") &&
    entry.name !== COMBO_ID &&
    !listedIds.has(entry.name)
  ) {
    status.copies[entry.name] = {
      status: "stale",
      error: indexedIds.has(entry.name)
        ? `not selected (${values["no-variants"] ? "--no-variants" : values.variants})`
        : "not in variants/index.json",
    };
  }
}

// The combination of the surviving variants.
if (values.combine !== undefined) {
  const survivorsFile = path.resolve(PERF_DIR, values.combine);
  const survivors = existsSync(survivorsFile)
    ? (JSON.parse(readFileSync(survivorsFile, "utf8")).survivors ?? [])
    : [];
  const usable = survivors.filter((name) => variantPatches.has(name));
  if (usable.length === 0) {
    log(`combine: no survivors in ${values.combine}; no ${COMBO_ID}`);
    if (existsSync(path.join(LIBS_DIR, COMBO_ID))) {
      moveAside(path.join(LIBS_DIR, COMBO_ID), COMBO_ID);
    }
    delete revisions[COMBO_ID];
    status.copies[COMBO_ID] = { status: "none", survivors };
  } else {
    const combined = usable.map((name) => variantPatches.get(name));
    const revision = `${branchSha}+${sha256(combined.join("\n")).slice(0, 12)}`;
    status.copies[COMBO_ID] = {
      survivors: usable,
      revision,
      status: "pending",
    };
    if (
      revisions[COMBO_ID] === revision &&
      existsSync(path.join(packageDirOf(COMBO_ID), "package.json"))
    ) {
      log(`combine: ${COMBO_ID} already at ${revision}`);
    } else {
      copyBranchSources(COMBO_ID);
      const failure = usable
        .map((name, index) => ({
          name,
          result: applyPatch(packageDirOf(COMBO_ID), combined[index], {
            check: false,
          }),
        }))
        .find(({ result }) => !result.ok);
      if (failure === undefined) {
        revisions[COMBO_ID] = revision;
        log(`combine: applied ${usable.join(", ")} to ${COMBO_ID}`);
      } else {
        status.copies[COMBO_ID] = {
          ...status.copies[COMBO_ID],
          status: "apply-failed",
          error: `${failure.name}: ${failure.result.error}`,
        };
        moveAside(path.join(LIBS_DIR, COMBO_ID), COMBO_ID);
        delete revisions[COMBO_ID];
      }
    }
  }
} else if (values["combo-patch"] !== undefined) {
  // One hand-merged patch of the compatible survivors (variants/combo.patch):
  // the survivors' patches don't all apply on top of each other as they are.
  const comboFile = [
    path.resolve(VARIANTS_DIR, values["combo-patch"]),
    path.resolve(PERF_DIR, values["combo-patch"]),
  ].find((candidate) => existsSync(candidate));
  if (comboFile === undefined) {
    throw new Error(`--combo-patch ${values["combo-patch"]}: no such file`);
  }
  const patchText = readFileSync(comboFile, "utf8");
  const revision = `${branchSha}+${sha256(patchText).slice(0, 12)}`;
  status.copies[COMBO_ID] = {
    combo: path.relative(PERF_DIR, comboFile),
    revision,
    status: "pending",
  };
  if (
    revisions[COMBO_ID] === revision &&
    existsSync(path.join(packageDirOf(COMBO_ID), "package.json"))
  ) {
    log(`combo: ${COMBO_ID} already at ${revision}`);
  } else {
    const checked = applyPatch(packageDirOf("branch"), patchText, {
      check: true,
    });
    const applied = checked.ok
      ? (copyBranchSources(COMBO_ID),
        applyPatch(packageDirOf(COMBO_ID), patchText, { check: false }))
      : checked;
    if (applied.ok) {
      revisions[COMBO_ID] = revision;
      log(`combo: applied ${status.copies[COMBO_ID].combo} to ${COMBO_ID}`);
    } else {
      status.copies[COMBO_ID] = {
        ...status.copies[COMBO_ID],
        status: "apply-failed",
        error: applied.error,
      };
      log(
        `combo: ${status.copies[COMBO_ID].combo} does not apply to branch ${branchSha.slice(0, 8)}: ${applied.error.split("\n")[0]}`,
      );
      if (existsSync(path.join(LIBS_DIR, COMBO_ID))) {
        moveAside(path.join(LIBS_DIR, COMBO_ID), COMBO_ID);
      }
      delete revisions[COMBO_ID];
    }
  }
} else if (
  previous.copies?.[COMBO_ID] !== undefined &&
  existsSync(path.join(LIBS_DIR, COMBO_ID))
) {
  // Keep the last combination's record when this run doesn't combine.
  status.copies[COMBO_ID] = { ...previous.copies[COMBO_ID], status: "pending" };
}

// Forget revisions of copies that are gone (moved aside or deleted).
for (const id of Object.keys(revisions)) {
  if (!existsSync(path.join(packageDirOf(id), "package.json"))) {
    delete revisions[id];
  }
}
writeRevisions(revisions);

// 3. Dists.
const toBuild = Object.entries(status.copies)
  .filter(([, copy]) => copy.status === "pending")
  .map(([id]) => id);
for (const id of toBuild) {
  const build = run(process.execPath, [
    path.join(PERF_DIR, "scripts", "build-dist.mjs"),
    id,
  ]);
  const resultLine = build.stdout
    .split("\n")
    .find((line) => line.startsWith("[build-dist] result "));
  const result =
    resultLine === undefined
      ? undefined
      : JSON.parse(resultLine.slice("[build-dist] result ".length))[id];
  if (
    build.status !== 0 ||
    result === undefined ||
    result.status === "failed"
  ) {
    status.copies[id] = {
      ...status.copies[id],
      status: "build-failed",
      error: result?.error ?? `exit ${build.status}`,
    };
    log(`${id}: build FAILED (${status.copies[id].error})`);
  }
}

function writeStatus() {
  writeFileSync(COPIES_FILE, `${JSON.stringify(status, undefined, 2)}\n`);
}

const blockingFailures = () =>
  ["main", "main-aa", "branch"].filter(
    (id) =>
      status.copies[id].status !== "pending" &&
      status.copies[id].status !== "ok",
  );

if (blockingFailures().length > 0) {
  writeStatus();
  log(`FAILED: ${blockingFailures().join(", ")} could not be prepared`);
  process.exit(1);
}

// 4. Validation.
const candidates = Object.entries(status.copies)
  .filter(([, copy]) => copy.status === "pending")
  .map(([id]) => id);

function validationStamp() {
  const hash = createHash("sha256");
  for (const id of [...candidates].sort()) {
    hash.update(id);
    for (const stamp of [".dist-stamp", ".bundle-stamp"]) {
      const file = path.join(LIBS_DIR, id, stamp);
      hash.update(existsSync(file) ? readFileSync(file) : "missing");
    }
  }
  for (const directory of ["harness", "scripts"]) {
    for (const file of readdirSync(path.join(PERF_DIR, directory)).sort()) {
      if (file.endsWith(".js") || file.endsWith(".mjs")) {
        hash.update(file);
        hash.update(readFileSync(path.join(PERF_DIR, directory, file)));
      }
    }
  }
  return hash.digest("hex");
}

const stamp = validationStamp();
let validationBlocked = false;
if (values["skip-validate"]) {
  log("validation skipped (--skip-validate)");
  for (const id of candidates) {
    status.copies[id].status = "ok";
    status.copies[id].validated = false;
  }
} else if (
  !values["force-validate"] &&
  existsSync(VALIDATE_STAMP_FILE) &&
  readFileSync(VALIDATE_STAMP_FILE, "utf8") === stamp
) {
  log(
    "validation up to date (copies and harness unchanged since the last pass)",
  );
  for (const id of candidates) {
    status.copies[id].status =
      previous.copies?.[id]?.status === "validate-failed"
        ? "validate-failed"
        : "ok";
    status.copies[id].validated = true;
  }
} else {
  const passes = [
    { source: "dist", args: [] },
    { source: "cjs", args: ["--groups", "G1,G5,G10", "--sizes", "XS,S,C"] },
    { source: "bundle", args: ["--groups", "G1,G5,G10", "--sizes", "XS,S,C"] },
  ];
  const failed = new Set();
  let blocked = false;
  for (const pass of passes) {
    const outFile = path.join(
      PERF_DIR,
      "results",
      `validate-${pass.source}.json`,
    );
    const result = run(process.execPath, [
      "--expose-gc",
      path.join(PERF_DIR, "scripts", "validate.mjs"),
      "--source",
      pass.source,
      "--copies",
      candidates.join(","),
      "--quiet",
      "--out",
      outFile,
      ...pass.args,
    ]);
    if (!existsSync(outFile)) {
      blocked = true;
      log(
        `validation (${pass.source}) produced no report (exit ${result.status})`,
      );
      continue;
    }
    const report = JSON.parse(readFileSync(outFile, "utf8"));
    for (const id of report.failedCopies) {
      failed.add(id);
    }
    if (result.status !== 0) {
      blocked = true;
    }
  }
  for (const id of candidates) {
    status.copies[id].status = failed.has(id) ? "validate-failed" : "ok";
    status.copies[id].validated = true;
  }
  if (blocked) {
    validationBlocked = true;
  } else {
    writeFileSync(VALIDATE_STAMP_FILE, stamp);
  }
}

writeStatus();
const lines = Object.entries(status.copies).map(
  ([id, copy]) =>
    `  ${id.padEnd(40)} ${copy.status.padEnd(16)} ${copy.revision ?? ""}${copy.error === undefined ? "" : `  (${copy.error.split("\n")[0]})`}`,
);
log(`copies (libs/COPIES.json):\n${lines.join("\n")}`);
log(`done in ${((performance.now() - started) / 1000).toFixed(1)}s`);

const blocking = blockingFailures();
if (blocking.length > 0) {
  log(
    `FAILED: ${blocking.join(", ")} failed validation; see results/validate-*.json`,
  );
  process.exitCode = 1;
} else if (validationBlocked) {
  log(
    "FAILED: a validation pass exited non-zero (a native mismatch or a crash); see results/validate-*.json",
  );
  process.exitCode = 1;
}
