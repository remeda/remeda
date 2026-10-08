// One cold-start sample, spawned by cold.mjs: a fresh process imports one
// copy, then runs one probe 50 times with no warmup, timing each call.
//
// Usage: node scripts/cold-worker.mjs <copy> <probe> <dist|cjs|bundle>
// Prints one JSON line.

import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const [copy, probe, source = "dist"] = process.argv.slice(2);

// The input is built before the import and without touching any harness
// module, so the only cold code the timings see is the library's.
const ROLES = ["admin", "editor", "viewer"];
const users = [];
for (let index = 0; index < 16; index++) {
  const user = {
    id: index,
    name: `User ${index}`,
    email: `user${index % 11}@example.com`,
    age: 16 + (index % 65),
    isActive: index % 5 < 3,
    role: ROLES[index % ROLES.length],
    tags: ["red"],
    profile: { bio: `Bio ${index}`, score: index, user: null },
  };
  user.profile.user = user;
  users.push(user);
}
const dataset = {
  users,
  emails: users.map((user) => user.email),
  scalar: 17,
};

export const PROBES = {
  "data-first map S": (lib, d) => lib.map(d.users, (user) => user.name),
  "data-first unique S": (lib, d) => lib.unique(d.emails),
  "pipe filter+map S": (lib, d) =>
    lib.pipe(
      d.users,
      lib.filter((user) => user.isActive),
      lib.map((user) => user.name),
    ),
  "arrow pipe depth-3": (lib, d) =>
    lib.pipe(
      d.scalar,
      (value) => value + 1,
      (value) => value * 2,
      (value) => Math.min(Math.max(value, 0), 1000),
    ),
  "pipe map reading data S": (lib, d) =>
    lib.pipe(
      d.users,
      lib.map((user, index, data) => data[index].age + user.id),
    ),
};

// cold.mjs imports this module for the probe list; only a worker process
// (this file as the entry point) measures.
const isEntryPoint =
  process.argv[1] !== undefined &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isEntryPoint) {
  const run = PROBES[probe];
  if (run === undefined) {
    throw new Error(`Unknown probe "${probe}"`);
  }
  const packageDir = path.join(PERF_DIR, "libs", copy, "packages", "remeda");
  const entry =
    source === "cjs"
      ? path.join(packageDir, "dist", "index.cjs")
      : source === "bundle"
        ? path.join(PERF_DIR, "libs", copy, "bundle", "remeda.bundle.mjs")
        : path.join(packageDir, "dist", "index.js");

  const importStarted = performance.now();
  const lib =
    source === "cjs"
      ? createRequire(import.meta.url)(entry)
      : await import(pathToFileURL(entry).href);
  const importMs = performance.now() - importStarted;

  const times = [];
  let sink;
  for (let call = 0; call < 50; call++) {
    const started = performance.now();
    sink = run(lib, dataset);
    times.push(performance.now() - started);
  }
  if (sink === undefined) {
    throw new Error("probe returned nothing");
  }
  process.stdout.write(
    `${JSON.stringify({
      copy,
      probe,
      source,
      importMs,
      firstUs: times[0] * 1000,
      first50Us: times.reduce((total, time) => total + time, 0) * 1000,
      timesUs: times.map((time) => Number((time * 1000).toFixed(3))),
    })}\n`,
  );
}
