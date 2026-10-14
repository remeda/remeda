// Red check of the callback-trace validation: injects three behavior changes
// into a copy of the branch (a shifted index, an extra callback call, a copied
// item) and requires the trace diff to report each, while the untouched
// branch passes. Not a measurement; needs the built dists.
//
//   node validate/self-test.mjs

process.env.PERF_SOURCE = "dist";
process.env.PERF_LIBS = "";
process.env.PERF_GROUPS = "G1,G9";
process.env.PERF_SIZES = "S";

const { buildRegistry } = await import("../harness/registry.js");
const { validateScenarios } = await import("../harness/validate-core.js");

const { libs, entries } = await buildRegistry({ libIds: ["main", "branch"] });
const branch = libs.get("branch");
const subset = entries.filter((entry) =>
  /^G1 \| (?:map|filter\+map) \||^G9/u.test(entry.key),
);

// Wrappers keep the callback's `length`, which the branch reads.
const keepLength = (wrapper, original) =>
  Object.defineProperty(wrapper, "length", { value: original.length });
const wrapDataLast = (name, makeWrapper) => ({
  [name]: (...args) =>
    args.length === 1
      ? branch[name](keepLength(makeWrapper(args[0]), args[0]))
      : branch[name](...args),
});

const mutations = {
  "shifted index": wrapDataLast(
    "map",
    (callback) => (value, index, data) => callback(value, index + 1, data),
  ),
  "extra call": wrapDataLast("filter", (callback) => (value, index, data) => {
    callback(value, index, data);
    return callback(value, index, data);
  }),
  "copied item": wrapDataLast(
    "map",
    (callback) => (value, index, data) =>
      callback(
        typeof value === "object" && value !== null ? { ...value } : value,
        index,
        data,
      ),
  ),
};

let failures = 0;
for (const [label, overrides] of Object.entries(mutations)) {
  const mutated = new Map(libs);
  mutated.set("branch", { ...branch, ...overrides });
  const report = validateScenarios({
    libs: mutated,
    entries: subset,
    copies: ["main", "branch"],
  });
  const [first] = report.traceMismatches;
  const caught = report.traceMismatches.length > 0;
  failures += caught ? 0 : 1;
  process.stdout.write(
    `[self-test] ${label}: ${caught ? "caught" : "MISSED"} (${report.traceMismatches.length} mismatches` +
      `${first === undefined ? "" : `; first: ${first.key} call ${first.position}: expected ${first.expected} got ${first.actual}`})\n`,
  );
}
const clean = validateScenarios({
  libs,
  entries: subset,
  copies: ["main", "branch"],
});
failures += clean.traceMismatches.length;
process.stdout.write(
  `[self-test] unmodified branch: ${clean.traceMismatches.length} mismatches over ${clean.scenarios} scenarios\n`,
);
process.exitCode = failures === 0 ? 0 : 1;
