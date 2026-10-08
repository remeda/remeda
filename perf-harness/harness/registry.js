// The scenario registry: one entry per (scenario, size), each able to build
// the measured closure for any library copy and for the native baseline.
//
//   { key, group, id, size, tags, kind, main, tier, timeMs, warmupMs,
//     run: (libId, { lib }?) => () => result,  // closure for that copy, built
//                                              // from the copy's own instance
//                                              // of scenarios.js; `lib`
//                                              // replaces the copy (tracing)
//     runEach: (libId, { lib, beforeEach }) => () => result,
//                                              // like run, with a hook before
//                                              // every input of the batch
//     native?: () => () => result }

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { config, isSelected, KNOWN_GROUPS, PERF_DIR } from "./env.js";
import { datasetsFor } from "./fixtures.js";
import { loadLibs } from "./libs.js";
import { tierOf } from "./tiers.js";

const BASE_TIME_MS = {
  XS: 500,
  S: 500,
  C: 500,
  M: 500,
  Mx64: 500,
  L: 1500,
  x64: 500,
  x1: 500,
};
const BASE_WARMUP_MS = {
  XS: 100,
  S: 100,
  C: 100,
  M: 100,
  Mx64: 100,
  L: 300,
  x64: 100,
  x1: 100,
};

export function budgetsFor(size, timeScale = config.timeScale) {
  return {
    timeMs: BASE_TIME_MS[size] * timeScale,
    warmupMs: BASE_WARMUP_MS[size] * timeScale,
  };
}

const SCENARIOS_FILE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "scenarios.js",
);

async function scenarioInstance(instanceId) {
  if (globalThis.Bun !== undefined) {
    // Bun keys modules by path and ignores the query, so every copy gets a
    // physical copy of the file instead.
    const directory = path.join(PERF_DIR, ".instances");
    mkdirSync(directory, { recursive: true });
    const file = path.join(directory, `scenarios.${instanceId}.js`);
    if (
      !existsSync(file) ||
      readFileSync(file, "utf8") !== readFileSync(SCENARIOS_FILE, "utf8")
    ) {
      copyFileSync(SCENARIOS_FILE, file);
    }
    return import(pathToFileURL(file).href);
  }
  // Built as a URL (not a template literal inside `import()`) so vite's
  // dynamic-import-vars transform leaves it alone; the query is what makes the
  // module loader create a separate instance per copy.
  const specifier = new URL(
    `./scenarios.js?instance=${instanceId}`,
    import.meta.url,
  ).href;
  return import(/* @vite-ignore */ specifier);
}

export function shapeOf(definition, size) {
  return {
    group: definition.group,
    id: definition.id,
    size,
    tags: definition.tags ?? [],
    kind: definition.kind,
    main: definition.main,
  };
}

export function keyOf(shape) {
  // Tags travel in the describe name, so result files are self-describing.
  return [
    shape.group,
    shape.id,
    shape.size,
    ...(shape.tags.length > 0 ? [shape.tags.join(",")] : []),
  ].join(" | ");
}

/**
 * @param {object} options
 * @param {readonly string[]} options.libIds - copies to prepare closures for.
 * @param {(shape) => boolean} [options.filter] - defaults to the PERF_* env
 *   selection.
 * @param {string} [options.source] - defaults to PERF_SOURCE.
 * @param {(definition) => readonly string[]} [options.extraSizes] - sizes to
 *   add to a definition's own (the peak-heap script runs G10 at L).
 * @param {number} [options.timeScale] - defaults to PERF_TIME_SCALE.
 */
export async function buildRegistry({
  libIds,
  filter = isSelected,
  source = config.source,
  extraSizes,
  timeScale = config.timeScale,
}) {
  const libs = await loadLibs(libIds, source);
  const instances = new Map();
  for (const instanceId of [...libIds, "native"]) {
    instances.set(instanceId, await scenarioInstance(instanceId));
  }

  const canonical = instances.get("native").SCENARIOS;
  for (const [instanceId, instance] of instances) {
    if (instance.SCENARIOS.length !== canonical.length) {
      throw new Error(`Instance ${instanceId} has a different scenario list`);
    }
    if (
      instanceId !== "native" &&
      instance.SCENARIOS[0].body === canonical[0].body
    ) {
      throw new Error(`Instance ${instanceId} shares functions with native`);
    }
  }

  const instanceOf = (libId) => {
    const instance = instances.get(libId);
    if (instance === undefined) {
      throw new Error(`Lib ${libId} was not loaded`);
    }
    return instance;
  };

  const entries = [];
  for (const [index, definition] of canonical.entries()) {
    const sizes = [
      ...definition.sizes,
      ...(extraSizes?.(definition) ?? []).filter(
        (size) => !definition.sizes.includes(size),
      ),
    ];
    for (const size of sizes) {
      const shape = shapeOf(definition, size);
      if (!filter(shape)) {
        continue;
      }
      entries.push({
        ...shape,
        ...tierOf(shape),
        definitionIndex: index,
        key: keyOf(shape),
        ...budgetsFor(size, timeScale),
        run: (libId, { lib } = {}) => {
          const instance = instanceOf(libId);
          const body = instance.SCENARIOS[index].body(lib ?? libs.get(libId));
          return instance.makeMeasured(body, datasetsFor(size));
        },
        runEach: (libId, { lib, beforeEach }) => {
          const instance = instanceOf(libId);
          const body = instance.SCENARIOS[index].body(lib ?? libs.get(libId));
          return instance.makeMeasuredWithHook(
            body,
            datasetsFor(size),
            beforeEach,
          );
        },
        native:
          definition.native === undefined
            ? undefined
            : () => {
                const instance = instances.get("native");
                return instance.makeMeasured(
                  instance.SCENARIOS[index].native,
                  datasetsFor(size),
                );
              },
      });
    }
  }

  entries.sort(
    (a, b) => KNOWN_GROUPS.indexOf(a.group) - KNOWN_GROUPS.indexOf(b.group),
  );
  return { libs, entries };
}
