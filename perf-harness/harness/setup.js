// `setupFiles` entry of the bench project. It shares the bench file's module
// graph, so the copies it loads and pollutes are the very instances the
// benchmarks then measure.

import { config } from "./env.js";
import { describeLoader, detectProtocol, loadLibs } from "./libs.js";
import { pollute, ROUNDS } from "./pollution.js";
import { proofLine } from "./proof.js";

const libs = await loadLibs(config.order);

const started = performance.now();
for (const [id, lib] of libs) {
  pollute(lib, config.pollution);
  if (typeof globalThis.gc === "function") {
    globalThis.gc();
  }
  // A pass that threw would not get here; this also proves each copy still
  // answers after its pass.
  if (detectProtocol(lib) === "unknown") {
    throw new Error(`Lib ${id} is broken after pollution`);
  }
}

process.stdout.write(
  `${proofLine({
    runner: "vitest",
    order: config.order,
    source: config.source,
    loaders: [...libs.values()].map(describeLoader),
    pollution: `${config.pollution}${config.pollution === "P0" ? "" : ` (${ROUNDS} rounds)`}`,
    pollutionMs: performance.now() - started,
  })}\n`,
);
