// Prints the scenario matrix: (scenario, size) counts per group, tier and
// size, the popularity source and the tier overrides in effect. Takes the
// same selection flags as run-bench.mjs, so it also previews a selection.
//
//   node scripts/matrix.mjs [--groups ...] [--sizes ...] [--subset E]
//     [--tiers 1] [--targets v1,v2] [--guard <subset>] [--list]

import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    groups: { type: "string", default: "" },
    sizes: { type: "string", default: "" },
    ids: { type: "string", default: "" },
    tags: { type: "string", default: "" },
    subset: { type: "string", default: "" },
    tiers: { type: "string", default: "" },
    targets: { type: "string", default: "" },
    guard: { type: "string", default: "" },
    list: { type: "boolean", default: false },
  },
});

Object.assign(process.env, {
  PERF_LIBS: "",
  PERF_GROUPS: values.groups,
  PERF_SIZES: values.sizes,
  PERF_IDS: values.ids,
  PERF_TAGS: values.tags,
  PERF_SUBSET: values.subset,
  PERF_TIERS: values.tiers,
  PERF_TARGETS: values.targets,
  PERF_GUARD: values.guard,
});

const { isSelected, KNOWN_GROUPS, KNOWN_SIZES } =
  await import("../harness/env.js");
const { SCENARIOS } = await import("../harness/scenarios.js");
const { selectShapes } = await import("../harness/estimate.js");
const { popularityData, tierOf, tierOverrides } =
  await import("../harness/tiers.js");

const shapes = selectShapes(SCENARIOS, isSelected).map((shape) => ({
  ...shape,
  ...tierOf(shape),
}));

const sizes = KNOWN_SIZES.filter((size) =>
  shapes.some((shape) => shape.size === size),
);
const rows = [];
for (const group of KNOWN_GROUPS) {
  const inGroup = shapes.filter((shape) => shape.group === group);
  if (inGroup.length === 0) {
    continue;
  }
  rows.push([
    group,
    String(new Set(inGroup.map((shape) => shape.id)).size),
    ...[1, 2, 3].map((tier) =>
      String(inGroup.filter((shape) => shape.tier === tier).length),
    ),
    ...sizes.map((size) =>
      String(inGroup.filter((shape) => shape.size === size).length || "-"),
    ),
    String(inGroup.length),
  ]);
}
rows.push([
  "all",
  String(new Set(shapes.map((shape) => `${shape.group}|${shape.id}`)).size),
  ...[1, 2, 3].map((tier) =>
    String(shapes.filter((shape) => shape.tier === tier).length),
  ),
  ...sizes.map((size) =>
    String(shapes.filter((shape) => shape.size === size).length),
  ),
  String(shapes.length),
]);

const header = ["group", "scenarios", "T1", "T2", "T3", ...sizes, "entries"];
const widths = header.map((title, index) =>
  Math.max(title.length, ...rows.map((row) => row[index].length)),
);
const format = (row) =>
  row.map((cell, index) => cell.padStart(widths[index])).join("  ");
process.stdout.write(
  `${format(header)}\n${rows.map(format).join("\n")}\n\n` +
    `tier x size:\n${[1, 2, 3]
      .map(
        (tier) =>
          `  T${tier}: ${sizes
            .map(
              (size) =>
                `${size} ${shapes.filter((shape) => shape.tier === tier && shape.size === size).length}`,
            )
            .join(", ")}`,
      )
      .join("\n")}\n` +
    `popularity: ${popularityData().source}; defaulted to high: ${
      [
        ...new Set(
          shapes
            .filter((shape) => shape.popularityDefaulted)
            .map((shape) => shape.main),
        ),
      ].join(", ") || "none"
    }\n` +
    `overrides: ${
      tierOverrides()
        .map(
          (rule) =>
            `${rule.function} [${rule.kinds?.join(",") ?? "all kinds"}] -> tier ${rule.tier} (${shapes.filter((shape) => shape.override?.function === rule.function).length} entries)`,
        )
        .join("; ") || "none"
    }\n`,
);
if (values.list) {
  for (const shape of shapes) {
    process.stdout.write(
      `T${shape.tier} ${shape.key}  (${shape.kind}, ${shape.main}: ${shape.popularity}${shape.override === undefined ? "" : ", override"})\n`,
    );
  }
}
