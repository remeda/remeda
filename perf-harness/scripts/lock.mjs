// A lock directory shared by every measuring script (and prepare.mjs, whose
// builds would disturb a measurement), so two of them never run at the same
// time.
//
// A script that holds the lock exports PERF_LOCK_HELD=<its pid> to its child
// processes; a child that finds the lock held by that pid runs under it
// instead of refusing to start.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LOCK_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  ".bench.lock",
);

function readHolder() {
  try {
    return Number(readFileSync(path.join(LOCK_DIR, "pid"), "utf8"));
  } catch {
    // Lock directory without a pid file: its owner died mid-acquire.
    return Number.NaN;
  }
}

function isAlive(pid) {
  try {
    return Number.isInteger(pid) && process.kill(pid, 0);
  } catch {
    return false;
  }
}

export function acquireBenchLock() {
  const inherited = Number(process.env.PERF_LOCK_HELD);
  if (
    Number.isInteger(inherited) &&
    inherited === readHolder() &&
    isAlive(inherited)
  ) {
    return;
  }
  try {
    mkdirSync(LOCK_DIR);
  } catch {
    const holder = readHolder();
    if (isAlive(holder)) {
      throw new Error(`Another benchmark (pid ${holder}) is running`);
    }
    // A stale lock from a crashed run. The directory is the lock itself,
    // created and removed only by this module.
    rmSync(LOCK_DIR, { recursive: true, force: true });
    mkdirSync(LOCK_DIR);
  }
  writeFileSync(path.join(LOCK_DIR, "pid"), String(process.pid));
  process.env.PERF_LOCK_HELD = String(process.pid);
  const release = () => {
    if (readHolder() === process.pid) {
      rmSync(LOCK_DIR, { recursive: true, force: true });
    }
  };
  process.on("exit", release);
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      release();
      process.exit(130);
    });
  }
}
