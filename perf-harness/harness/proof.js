// The `[perf setup]` proof line every measuring process prints: which
// runtime and flags are really active, not only which were requested.
//
// `--jitless` also removes WebAssembly, so `wasm=undefined` proves that flag
// took effect. `--max-opt` has no such side effect; its value is read back
// from the process's own arguments.

export function activeFlags() {
  return typeof process.execArgv === "object" ? process.execArgv : [];
}

function maxOptOf(flags) {
  const flag = flags.find((candidate) => candidate.startsWith("--max-opt"));
  return flag === undefined ? "unset" : flag.split("=")[1];
}

export function hasGc() {
  return (
    typeof globalThis.gc === "function" ||
    typeof globalThis.Bun?.gc === "function"
  );
}

/** A full collection: `gc()` under node (--expose-gc), `Bun.gc(true)`. */
export function fullGc() {
  if (typeof globalThis.gc === "function") {
    globalThis.gc();
  } else if (typeof globalThis.Bun?.gc === "function") {
    globalThis.Bun.gc(true);
  }
}

export function runtimeName() {
  return globalThis.Bun === undefined
    ? `node ${process.version}`
    : `bun ${globalThis.Bun.version}`;
}

export function proofLine({
  runner,
  order,
  source,
  loaders,
  pollution,
  pollutionMs,
}) {
  const flags = activeFlags();
  return (
    `[perf setup] pid=${process.pid} runner=${runner} runtime="${runtimeName()}" ` +
    `execArgv=[${flags.join(" ")}] order=${order.join(",")} source=${source} ` +
    `loader=${loaders.join(",")} gc=${hasGc()} ` +
    `jitless=${flags.includes("--jitless")} wasm=${typeof globalThis.WebAssembly} ` +
    `maxOpt=${maxOptOf(flags)} pollution=${pollution} x ${order.length} libs in ` +
    `${pollutionMs.toFixed(0)}ms`
  );
}
