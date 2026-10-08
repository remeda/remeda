// Expands a stage template (stages/<stage>.steps.template) into the steps
// file the watcher runs (stages/<stage>.steps) and prints a time estimate per
// step and in total.
//
//   node scripts/make-stage.mjs <stage> [--max-step-min 18] [--out <file>]
//     [--estimate-only]
//
// --estimate-only prints the estimate without writing the steps file.
//
// Template lines are kept as they are (shell commands, blank lines, `#`
// comments), except directives, which expand into one or more steps:
//
//   @prepare [prepare args]    node scripts/prepare.mjs --sha "$PERF_SHA" [args]
//   @prepare-combine <file>    the same with --combine <file>
//   @bench <name> rotations=<r> [copies=<list>] [native=<r>] <run-bench args>
//   @variants <name> batch=<n> [scale=<s>] [survivors=<file>] [rotations=<r>]
//     <run-bench args>
//   @portable <name> runtime=<bun|node|node22|node24> rotations=<r> <args>
//   @once <minutes> <command>  a one-shot command with its estimate
//   @aggregate <name> <inputs glob> [aggregate args]
//
// <r> is a comma list (`0,1`), `all` (one rotation per copy) or `all*2` /
// `0,1*2` (every rotation twice). `native=<r>` limits native entries to those
// rotations (default: every rotation). `{stage}` expands to the stage name.
// Bench steps whose estimate exceeds --max-step-min are split by group (and a
// group that alone exceeds it, by size). Every measuring step gets
// --if-missing, so a step that fails or is interrupted resumes where it was.
//
// @variants reads variants/index.json now: batches of `batch` variants, each
// run next to main, branch and main-aa over tier 1 plus the batch's target
// flows, in one rotation per copy (or `rotations=`). With `survivors=<file>`
// the batches hold only the variants that file lists, in its `order` when it
// has one, else its `survivors` then `separate`. Regenerate the steps when the
// variant list changes.

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const PERF_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    "max-step-min": { type: "string", default: "18" },
    out: { type: "string", default: "" },
    "estimate-only": { type: "boolean", default: false },
  },
});
const [stage] = positionals;
if (stage === undefined || !/^[\w-]+$/u.test(stage)) {
  throw new Error("usage: node scripts/make-stage.mjs <stage>");
}
const templateFile = path.join(PERF_DIR, "stages", `${stage}.steps.template`);
const outFile =
  values.out === ""
    ? path.join(PERF_DIR, "stages", `${stage}.steps`)
    : path.resolve(values.out);
const maxStepMs = Number(values["max-step-min"]) * 60_000;

// The selection code reads PERF_* at import; make-stage builds its own
// selections, so start from a neutral environment.
for (const key of Object.keys(process.env)) {
  if (
    key.startsWith("PERF_") &&
    !["PERF_LOCK_HELD", "PERF_VARIANTS_INDEX"].includes(key)
  ) {
    delete process.env[key];
  }
}
const { BASE_COPIES, readVariantsIndex } = await import("../harness/copies.js");
const { isSelected, KNOWN_GROUPS, readConfig } =
  await import("../harness/env.js");
const { SCENARIOS } = await import("../harness/scenarios.js");
const { estimateMs, formatDuration, selectShapes } =
  await import("../harness/estimate.js");
const { popularityData } = await import("../harness/tiers.js");

const RUNTIMES = {
  bun: "runtimes/bun/node_modules/.bin/bun",
  node: "node --expose-gc",
  node22: "runtimes/node22/node_modules/.bin/node --expose-gc",
  node24: "runtimes/node24/node_modules/.bin/node --expose-gc",
};

// --- Argument helpers ------------------------------------------------------------

/** Splits a directive line into words, honoring double quotes. */
function words(text) {
  const result = [];
  const pattern = /"([^"]*)"|(\S+)/gu;
  for (const match of text.matchAll(pattern)) {
    result.push(match[1] ?? match[2]);
  }
  return result;
}

function takeOption(list, key) {
  const index = list.findIndex((word) => word.startsWith(`${key}=`));
  if (index === -1) {
    return undefined;
  }
  const [word] = list.splice(index, 1);
  return word.slice(key.length + 1);
}

function flagValue(list, flag) {
  for (const [index, word] of list.entries()) {
    if (word === flag) {
      return list[index + 1];
    }
    if (word.startsWith(`${flag}=`)) {
      return word.slice(flag.length + 1);
    }
  }
  return undefined;
}

function rotationsOf(spec, copyCount) {
  const [base, times = "1"] = spec.split("*");
  const once =
    base === "all"
      ? Array.from({ length: copyCount }, (_, index) => index)
      : base.split(",").map(Number);
  const result = [];
  for (let repeat = 0; repeat < Number(times); repeat++) {
    result.push(...once.map((rotation) => ({ rotation, repeat })));
  }
  return { list: result, repeated: Number(times) > 1 };
}

function quote(word) {
  return /^[\w.,/:=@+-]+$/u.test(word)
    ? word
    : `'${word.replaceAll("'", "'\\''")}'`;
}

/** The (scenario, size) shapes a run-bench argument list selects. */
function shapesFor(args, copies) {
  const selection = readConfig({
    // Copies don't change the selection; any existing one validates.
    PERF_LIBS: "main",
    PERF_GROUPS: flagValue(args, "--groups") ?? "",
    PERF_SIZES: flagValue(args, "--sizes") ?? "",
    PERF_IDS: flagValue(args, "--ids") ?? "",
    PERF_TAGS: flagValue(args, "--tags") ?? "",
    PERF_SUBSET: flagValue(args, "--subset") ?? "",
    PERF_TIERS: flagValue(args, "--tiers") ?? "",
    PERF_TARGETS: flagValue(args, "--targets") ?? "",
    PERF_GUARD: flagValue(args, "--guard") ?? "",
    PERF_TIME_SCALE: flagValue(args, "--scale") ?? "1",
    PERF_SOURCE: "dist",
  });
  return {
    selection,
    shapes: selectShapes(SCENARIOS, (shape) => isSelected(shape, selection)),
    copies,
  };
}

/**
 * Splits a selection into chunks whose estimate stays under the step limit:
 * whole groups first, and a group that alone is too long by size.
 */
function chunk(shapes, estimateOf) {
  const byGroup = KNOWN_GROUPS.map((group) =>
    shapes.filter((shape) => shape.group === group),
  ).filter((list) => list.length > 0);
  const chunks = [];
  let current = [];
  const flush = () => {
    if (current.length > 0) {
      chunks.push({
        groups: [...new Set(current.map((shape) => shape.group))],
        shapes: current,
      });
      current = [];
    }
  };
  for (const groupShapes of byGroup) {
    if (estimateOf(groupShapes) > maxStepMs) {
      flush();
      const sizes = [...new Set(groupShapes.map((shape) => shape.size))];
      let sizeChunk = [];
      for (const size of sizes) {
        const next = groupShapes.filter((shape) => shape.size === size);
        if (
          sizeChunk.length > 0 &&
          estimateOf([...sizeChunk, ...next]) > maxStepMs
        ) {
          chunks.push({
            groups: [groupShapes[0].group],
            sizes: [...new Set(sizeChunk.map((shape) => shape.size))],
            shapes: sizeChunk,
          });
          sizeChunk = [];
        }
        sizeChunk.push(...next);
      }
      chunks.push({
        groups: [groupShapes[0].group],
        sizes: [...new Set(sizeChunk.map((shape) => shape.size))],
        shapes: sizeChunk,
      });
      continue;
    }
    if (
      current.length > 0 &&
      estimateOf([...current, ...groupShapes]) > maxStepMs
    ) {
      flush();
    }
    current.push(...groupShapes);
  }
  flush();
  return chunks;
}

function withoutFlags(list, flags) {
  const result = [];
  for (let index = 0; index < list.length; index++) {
    const word = list[index];
    const flag = flags.find(
      (candidate) => word === candidate || word.startsWith(`${candidate}=`),
    );
    if (flag === undefined) {
      result.push(word);
    } else if (word === flag) {
      index += 1;
    }
  }
  return result;
}

// --- Expansion -------------------------------------------------------------------

const steps = [];
// Variants the @variants directives batch, for the header.
const confirmed = [];
const sections = [];

function addSection(label) {
  sections.push({ label, ms: 0, steps: 0 });
}

function addStep(command, ms, note = "") {
  steps.push({ command, ms, note });
  const section = sections.at(-1);
  section.ms += ms;
  section.steps += 1;
}

function benchSteps({
  script,
  name,
  copies,
  rotations,
  nativeRotations,
  args,
  runtime,
}) {
  const { list, repeated } = rotationsOf(rotations, copies.length);
  const nativeSet =
    nativeRotations === undefined
      ? undefined
      : new Set(
          rotationsOf(nativeRotations, copies.length).list.map(
            (entry) => entry.rotation,
          ),
        );
  const scale = Number(flagValue(args, "--scale") ?? "1");
  const perProcess = args.includes("--per-process");
  const baseArgs = withoutFlags(args, ["--groups", "--sizes"]);
  const { shapes } = shapesFor(args, copies);
  if (shapes.length === 0) {
    throw new Error(`${name}: the selection matches no scenario`);
  }
  for (const { rotation, repeat } of list) {
    const native =
      !args.includes("--no-native") &&
      (nativeSet === undefined || nativeSet.has(rotation));
    const estimateOf = (subset) =>
      estimateMs(subset, {
        copies: copies.length,
        native,
        timeScale: scale,
        processesPerFile: perProcess ? copies.length : 1,
      });
    const chunks = chunk(shapes, estimateOf);
    for (const [index, part] of chunks.entries()) {
      const runName = `${stage}/${name}-r${rotation}${repeated ? `-${String.fromCharCode(97 + repeat)}` : ""}${chunks.length > 1 ? `-c${index + 1}` : ""}`;
      const groupFlag = flagValue(args, "--groups");
      const sizeFlag = flagValue(args, "--sizes");
      const commandArgs = [
        "--name",
        runName,
        "--copies",
        copies.join(","),
        "--rotation",
        String(rotation),
        ...(chunks.length > 1 || groupFlag !== undefined
          ? ["--groups", part.groups.join(",")]
          : []),
        ...(part.sizes === undefined
          ? sizeFlag === undefined
            ? []
            : ["--sizes", sizeFlag]
          : ["--sizes", part.sizes.join(",")]),
        ...baseArgs.filter((word) => word !== "--no-native"),
        ...(native ? [] : ["--no-native"]),
        "--if-missing",
      ];
      const command =
        script === "run-bench"
          ? `node scripts/run-bench.mjs ${commandArgs.map(quote).join(" ")}`
          : `${RUNTIMES[runtime]} scripts/run-portable.mjs ${commandArgs.map(quote).join(" ")}`;
      addStep(
        command,
        estimateOf(part.shapes),
        `${part.shapes.length} entries`,
      );
    }
  }
}

const template = readFileSync(templateFile, "utf8").split("\n");
const output = [];
for (const rawLine of template) {
  const line = rawLine.replaceAll("{stage}", stage);
  const trimmed = line.trim();
  if (!trimmed.startsWith("@")) {
    if (trimmed.startsWith("## ")) {
      addSection(trimmed.slice(3));
    }
    output.push({ text: line });
    continue;
  }
  const [directive, ...rest] = words(trimmed);
  const before = steps.length;
  switch (directive) {
    case "@prepare": {
      addStep(
        ['node scripts/prepare.mjs --sha "$PERF_SHA"', ...rest.map(quote)].join(
          " ",
        ),
        4 * 60_000,
        "snapshots, builds, validation",
      );
      break;
    }
    case "@prepare-combine": {
      addStep(
        `node scripts/prepare.mjs --sha "$PERF_SHA" --combine ${quote(rest[0])}`,
        2 * 60_000,
        "combination copy",
      );
      break;
    }
    case "@bench": {
      const [name, ...args] = rest;
      const copies = (
        takeOption(args, "copies") ?? BASE_COPIES.join(",")
      ).split(",");
      benchSteps({
        script: "run-bench",
        name,
        copies,
        rotations: takeOption(args, "rotations") ?? "0,1",
        nativeRotations: takeOption(args, "native"),
        args,
      });
      break;
    }
    case "@portable": {
      const [name, ...args] = rest;
      const runtime = takeOption(args, "runtime") ?? "node";
      if (RUNTIMES[runtime] === undefined) {
        throw new Error(`unknown runtime ${runtime}`);
      }
      const copies = (
        takeOption(args, "copies") ?? BASE_COPIES.join(",")
      ).split(",");
      benchSteps({
        script: "run-portable",
        name,
        copies,
        rotations: takeOption(args, "rotations") ?? "0,1",
        nativeRotations: takeOption(args, "native"),
        args,
        runtime,
      });
      break;
    }
    case "@variants": {
      const [name, ...args] = rest;
      const batchSize = Number(takeOption(args, "batch") ?? "3");
      const scale = takeOption(args, "scale");
      const rotations = takeOption(args, "rotations") ?? "all";
      // `guard=<subset>` replaces the full tier 1 next to the targets with a
      // lighter named subset (see SUBSETS in harness/env.js).
      const guard = takeOption(args, "guard");
      const survivorsFile = takeOption(args, "survivors");
      let variants = readVariantsIndex();
      if (survivorsFile !== undefined) {
        const list = JSON.parse(
          readFileSync(path.resolve(PERF_DIR, survivorsFile), "utf8"),
        );
        const listed = [...(list.survivors ?? []), ...(list.separate ?? [])];
        // `order`, when present, is the batch order: the same names as
        // `survivors` and `separate` together, so batches can lead with the
        // variants whose answer matters most.
        const names = list.order ?? listed;
        if (
          names.length !== listed.length ||
          !listed.every((name) => names.includes(name))
        ) {
          throw new Error(
            `${survivorsFile}: \`order\` must list exactly the names in \`survivors\` and \`separate\``,
          );
        }
        variants = names.map((name) => {
          const variant = variants.find((candidate) => candidate.name === name);
          if (variant === undefined) {
            throw new Error(
              `${survivorsFile}: ${name} is not in variants/index.json`,
            );
          }
          return variant;
        });
      }
      if (variants.length === 0) {
        output.push({
          text: "# (no variants in variants/index.json when this file was generated)",
        });
      }
      for (
        let start = 0, batch = 1;
        start < variants.length;
        start += batchSize, batch++
      ) {
        const members = variants.slice(start, start + batchSize);
        confirmed.push(...members.map((variant) => variant.name));
        const copies = [
          ...BASE_COPIES,
          ...members.map((variant) => variant.copyId),
        ];
        output.push({
          text: `# batch ${batch}: ${members.map((variant) => variant.name).join(", ")}`,
        });
        benchSteps({
          script: "run-bench",
          name: `${name}-b${batch}`,
          copies,
          rotations,
          args: [
            ...args,
            ...(guard === undefined ? ["--tiers", "1"] : ["--guard", guard]),
            "--targets",
            members.map((variant) => variant.name).join(","),
            "--no-native",
            "--drop-unavailable",
            ...(scale === undefined ? [] : ["--scale", scale]),
          ],
        });
      }
      break;
    }
    case "@once": {
      const [minutes, ...command] = rest;
      addStep(command.join(" "), Number(minutes) * 60_000);
      break;
    }
    case "@aggregate": {
      const [name, inputs, ...args] = rest;
      const command = [
        "node scripts/aggregate.mjs --allow-empty",
        `--out results/${stage}/${name}`,
        ...args.map(quote),
        `results/${stage}/${inputs}.json`,
      ].join(" ");
      // Aggregations don't measure: consecutive ones share one step, so the
      // watcher waits for an idle machine once for all of them.
      const previous = steps.at(-1);
      if (previous?.aggregate === true && output.at(-1)?.step === previous) {
        previous.command += ` && ${command}`;
        previous.ms += 15_000;
        sections.at(-1).ms += 15_000;
        previous.note = `${previous.note.split(" ")[0] * 1 + 1} aggregations`;
      } else {
        addStep(command, 15_000, "1 aggregations");
        steps.at(-1).aggregate = true;
      }
      break;
    }
    default: {
      throw new Error(`unknown directive ${directive}`);
    }
  }
  for (const step of steps.slice(before)) {
    output.push({ step });
  }
}

// --- Write and report --------------------------------------------------------------

const total = steps.reduce((sum, step) => sum + step.ms, 0);
const popularity = popularityData().source;
const header = [
  `# Generated by scripts/make-stage.mjs from stages/${stage}.steps.template on ${new Date().toISOString()}.`,
  `# ${steps.length} steps, estimated ${formatDuration(total)} of measurement (plus the watcher's idle waits).`,
  `# ${confirmed.length > 0 ? "Confirmed variants" : "Variants in variants/index.json"}: ${
    (confirmed.length > 0
      ? confirmed
      : readVariantsIndex().map((variant) => variant.name)
    ).join(", ") || "none"
  }. Popularity: ${popularity}.`,
  `# Start it with: printf 'sha=%s\\nsteps=stages/${stage}.steps\\n' <sha> > markers/READY-${stage}`,
  "",
];
if (!values["estimate-only"])
  writeFileSync(
    outFile,
    `${[
      ...header,
      ...output.map((entry) =>
        entry.step === undefined
          ? entry.text
          : `# ~${formatDuration(entry.step.ms)}${entry.step.note === "" ? "" : `, ${entry.step.note}`}\n${entry.step.command}`,
      ),
    ].join("\n")}\n`,
  );

const tooLong = steps.filter((step) => step.ms > 20 * 60_000);
process.stdout.write(
  `[make-stage] ${stage}: ${steps.length} steps -> ${values["estimate-only"] ? "(estimate only, not written)" : path.relative(PERF_DIR, outFile)}\n` +
    sections
      .filter((section) => section.steps > 0)
      .map(
        (section) =>
          `  ${section.label.padEnd(56)} ${String(section.steps).padStart(3)} steps  ${formatDuration(section.ms).padStart(9)}`,
      )
      .join("\n") +
    `\n  ${"total".padEnd(56)} ${String(steps.length).padStart(3)} steps  ${formatDuration(total).padStart(9)}\n` +
    (tooLong.length > 0
      ? `  WARNING: ${tooLong.length} steps estimated over 20 min\n`
      : "") +
    `  popularity: ${popularity}; variants: ${readVariantsIndex().length}\n`,
);
