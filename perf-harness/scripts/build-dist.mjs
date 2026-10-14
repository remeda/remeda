// Builds `dist/` for library copies with each copy's own `tsdown.config.ts`,
// then one scope-hoisted esbuild bundle of each dist (`--source bundle`).
// `main-aa` gets a copy of main's dist (same code) instead of its own build.
//
// `tsdown` is installed under the repo's `packages/remeda/node_modules`, which
// upward resolution from the copies can't reach, so each copy gets a real
// `node_modules` directory holding symlinks to just those packages.
// Everything else (typescript, rolldown, type-fest, ...) resolves upward to
// the repo root's `node_modules`. Nothing is written outside this directory.
//
// A build is skipped when the copy's sources hash to the stamp of its last
// successful build (`libs/<id>/.dist-stamp`); --force rebuilds anyway.
//
// Usage: node scripts/build-dist.mjs [--force] [<copy id> ...]
//   (no ids: every copy under libs/)

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const LIBS_DIR = path.join(PERF_DIR, "libs");
const REPO_DIR = findRepo(PERF_DIR);
const REPO_PACKAGE_MODULES = path.join(
  REPO_DIR,
  "packages",
  "remeda",
  "node_modules",
);

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

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { force: { type: "boolean", default: false } },
});

function listCopies() {
  return readdirSync(LIBS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .filter((id) =>
      existsSync(path.join(LIBS_DIR, id, "packages", "remeda", "package.json")),
    );
}

const targets = positionals.length > 0 ? positionals : listCopies();
// main-aa's dist is main's, so main builds first when both are requested.
const ordered = [
  ...targets.filter((id) => id === "main"),
  ...targets.filter((id) => id !== "main"),
];

function hashTree(directory, hash) {
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort(
    (a, b) => a.name.localeCompare(b.name),
  )) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      hashTree(full, hash);
    } else if (entry.isFile()) {
      hash.update(
        path.relative(LIBS_DIR, full).split(path.sep).slice(1).join("/"),
      );
      hash.update(readFileSync(full));
    }
  }
}

function sourceStamp(packageDir) {
  const hash = createHash("sha256");
  hashTree(path.join(packageDir, "src"), hash);
  for (const file of ["package.json", "tsdown.config.ts", "tsconfig.json"]) {
    const full = path.join(packageDir, file);
    if (existsSync(full)) {
      hash.update(file);
      hash.update(readFileSync(full));
    }
  }
  return hash.digest("hex");
}

/** Moves a directory aside instead of deleting it (see README "Disk"). */
function moveAside(directory, label) {
  if (!existsSync(directory)) {
    return;
  }
  const trash = path.join(LIBS_DIR, ".trash");
  mkdirSync(trash, { recursive: true });
  renameSync(
    directory,
    path.join(
      trash,
      `${label}-${new Date().toISOString().replaceAll(/[:.]/gu, "-")}`,
    ),
  );
}

async function buildBundle(id) {
  const esbuild = await import("esbuild");
  const outfile = path.join(LIBS_DIR, id, "bundle", "remeda.bundle.mjs");
  mkdirSync(path.dirname(outfile), { recursive: true });
  await esbuild.build({
    entryPoints: [
      path.join(LIBS_DIR, id, "packages", "remeda", "dist", "index.js"),
    ],
    bundle: true,
    format: "esm",
    platform: "neutral",
    minify: false,
    outfile,
    logLevel: "warning",
  });
  return outfile;
}

const results = {};
for (const id of ordered) {
  const packageDir = path.join(LIBS_DIR, id, "packages", "remeda");
  const distDir = path.join(packageDir, "dist");
  const stampFile = path.join(LIBS_DIR, id, ".dist-stamp");
  const stamp = sourceStamp(packageDir);
  const started = performance.now();

  if (id === "main-aa") {
    const mainDist = path.join(LIBS_DIR, "main", "packages", "remeda", "dist");
    const mainStamp = path.join(LIBS_DIR, "main", ".dist-stamp");
    if (!existsSync(mainStamp) || readFileSync(mainStamp, "utf8") !== stamp) {
      results[id] = {
        status: "failed",
        error:
          "main-aa sources differ from main's built sources (build main first)",
      };
      continue;
    }
    if (
      values.force ||
      !existsSync(stampFile) ||
      readFileSync(stampFile, "utf8") !== stamp ||
      !existsSync(path.join(distDir, "index.js"))
    ) {
      moveAside(distDir, `${id}-dist`);
      cpSync(mainDist, distDir, { recursive: true });
      writeFileSync(stampFile, stamp);
      results[id] = { status: "copied" };
    } else {
      results[id] = { status: "up-to-date" };
    }
  } else if (
    !values.force &&
    existsSync(stampFile) &&
    readFileSync(stampFile, "utf8") === stamp &&
    existsSync(path.join(distDir, "index.js")) &&
    existsSync(path.join(distDir, "index.cjs"))
  ) {
    results[id] = { status: "up-to-date" };
  } else {
    const modulesDir = path.join(packageDir, "node_modules");
    mkdirSync(modulesDir, { recursive: true });
    for (const name of readdirSync(REPO_PACKAGE_MODULES)) {
      if (name.startsWith(".")) {
        continue;
      }
      const link = path.join(modulesDir, name);
      if (!existsSync(link)) {
        symlinkSync(path.join(REPO_PACKAGE_MODULES, name), link, "dir");
      }
    }
    const result = spawnSync(
      process.execPath,
      [path.join(modulesDir, "tsdown", "dist", "run.mjs")],
      {
        cwd: packageDir,
        stdio: "inherit",
        env: {
          ...process.env,
          // The build's `attw`/`publint` step runs `npm pack`; keep npm's
          // cache and every temp file inside this directory.
          npm_config_cache: path.join(PERF_DIR, ".npm-cache"),
          TMPDIR: path.join(PERF_DIR, ".tmp"),
        },
      },
    );
    if (result.status !== 0) {
      results[id] = {
        status: "failed",
        error: `tsdown exited ${result.status}`,
      };
      process.stdout.write(
        `[build-dist] ${id} FAILED (tsdown exit ${result.status})\n`,
      );
      continue;
    }
    writeFileSync(stampFile, stamp);
    results[id] = { status: "built" };
  }

  const bundleFile = path.join(LIBS_DIR, id, "bundle", "remeda.bundle.mjs");
  const bundleStampFile = path.join(LIBS_DIR, id, ".bundle-stamp");
  if (
    values.force ||
    !existsSync(bundleFile) ||
    !existsSync(bundleStampFile) ||
    readFileSync(bundleStampFile, "utf8") !== stamp
  ) {
    try {
      await buildBundle(id);
      writeFileSync(bundleStampFile, stamp);
      results[id].bundle = "built";
    } catch (error) {
      results[id] = {
        status: "failed",
        error: `esbuild bundle: ${String(error)}`,
      };
      continue;
    }
  } else {
    results[id].bundle = "up-to-date";
  }
  results[id].seconds = Number(
    ((performance.now() - started) / 1000).toFixed(1),
  );
  process.stdout.write(
    `[build-dist] ${id}: dist ${results[id].status}, bundle ${results[id].bundle} (${results[id].seconds}s)\n`,
  );
}

process.stdout.write(`[build-dist] result ${JSON.stringify(results)}\n`);
process.exitCode = Object.values(results).some(
  (result) => result.status === "failed",
)
  ? 1
  : 0;
