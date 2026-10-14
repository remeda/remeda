// Wall-time estimates for a selection, without loading any library copy.
//
// A task (one copy, or native, in one (scenario, size)) costs its warmup plus
// its time budget, plus a fixed overhead for tinybench's bookkeeping, the
// per-task gc() and slow calls that overrun the budget; every bench file adds
// a process start, fixture building and the pollution pass. The overheads are
// fitted to the earlier runs: the 244-entry matrix with two copies and native
// (712 tasks, 8.3 min of budgets) took about 9 minutes at scale 1; at scale
// 0.04 the per-task overhead measured 4-13ms, so small-scale estimates run
// high.

import { KNOWN_GROUPS } from "./env.js";
import { budgetsFor, keyOf, shapeOf } from "./registry.js";

export const OVERHEAD_PER_TASK_MS = 25;
export const OVERHEAD_PER_FILE_MS = 2000;

/** The selected (scenario, size) shapes, from the canonical definitions. */
export function selectShapes(definitions, filter, extraSizes) {
  const shapes = [];
  for (const definition of definitions) {
    const sizes = [
      ...definition.sizes,
      ...(extraSizes?.(definition) ?? []).filter(
        (size) => !definition.sizes.includes(size),
      ),
    ];
    for (const size of sizes) {
      const shape = shapeOf(definition, size);
      if (filter(shape)) {
        shapes.push({
          ...shape,
          key: keyOf(shape),
          hasNative: definition.native !== undefined,
        });
      }
    }
  }
  return shapes.sort(
    (a, b) => KNOWN_GROUPS.indexOf(a.group) - KNOWN_GROUPS.indexOf(b.group),
  );
}

/**
 * @param {readonly object[]} shapes - from selectShapes.
 * @param {object} options
 * @param {number} options.copies - copies per entry.
 * @param {boolean} options.native - whether native entries run.
 * @param {number} options.timeScale
 * @param {number} [options.processesPerFile] - 1, or the copy count in
 *   one-copy-per-process mode.
 */
export function estimateMs(
  shapes,
  { copies, native, timeScale, processesPerFile = 1 },
) {
  let total = 0;
  const groups = new Set();
  for (const shape of shapes) {
    const { timeMs, warmupMs } = budgetsFor(shape.size, timeScale);
    const tasks = copies + (native && shape.hasNative ? 1 : 0);
    total += tasks * (timeMs + warmupMs + OVERHEAD_PER_TASK_MS);
    groups.add(shape.group);
  }
  return total + groups.size * processesPerFile * OVERHEAD_PER_FILE_MS;
}

export function formatDuration(milliseconds) {
  const minutes = milliseconds / 60_000;
  if (minutes < 1) {
    return `${Math.round(milliseconds / 1000)}s`;
  }
  if (minutes < 90) {
    return `${minutes.toFixed(1)} min`;
  }
  return `${(minutes / 60).toFixed(2)} h`;
}
