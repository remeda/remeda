// Emits one `describe` per selected (scenario, size) of a group, with one
// `bench` per selected library copy in the rotated PERF_LIBS order and
// `native` last.

import { config } from "./env.js";
import { buildRegistry } from "./registry.js";

// Every bench body assigns the measured result here so V8 can't eliminate the
// work.
const sink = { value: undefined };

// Each task starts with a full GC, so garbage left by the previous task (or by
// this task's own warmup) is not collected inside this task's samples.
let gcCalls = 0;
const gcBeforeTask =
  typeof globalThis.gc === "function"
    ? (task, mode) => {
        globalThis.gc();
        gcCalls += 1;
        if (gcCalls === 1) {
          // Proof in the log that tinybench really invokes the hook.
          process.stdout.write(
            `[perf gc] setup hook ran before ${mode} of "${task.name}"\n`,
          );
        }
      }
    : undefined;

let registryPromise;

export async function benchGroup(group, { bench, describe }) {
  registryPromise ??= buildRegistry({ libIds: config.order });
  const { entries } = await registryPromise;
  for (const entry of entries) {
    if (entry.group !== group) {
      continue;
    }
    const options = {
      time: entry.timeMs,
      warmupTime: entry.warmupMs,
      ...(gcBeforeTask === undefined ? {} : { setup: gcBeforeTask }),
    };
    describe(entry.key, () => {
      for (const libId of config.order) {
        const measured = entry.run(libId);
        bench(
          libId,
          () => {
            sink.value = measured();
          },
          options,
        );
      }
      if (config.native && entry.native !== undefined) {
        const measured = entry.native();
        bench(
          "native",
          () => {
            sink.value = measured();
          },
          options,
        );
      }
    });
  }
}
