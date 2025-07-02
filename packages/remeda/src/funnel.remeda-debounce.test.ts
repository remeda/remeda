/* eslint-disable @typescript-eslint/explicit-function-return-type, jsdoc/require-param, jsdoc/require-example, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any --
 * These aren't useful for a reference implementation!
 */

import { describe, expect, test, vi } from "vitest";
import { sleep } from "../test/sleep";
import { constant } from "./constant";
import { funnel } from "./funnel";
import { identity } from "./identity";

type Debouncer<
  F extends (...args: any) => unknown,
  IsNullable extends boolean = true,
> = {
  readonly call: (
    ...args: Parameters<F>
  ) => ReturnType<F> | (true extends IsNullable ? undefined : never);
  readonly cancel: () => void;
  readonly flush: () => ReturnType<F> | undefined;
  readonly isPending: boolean;
  readonly cachedValue: ReturnType<F> | undefined;
};

type DebounceOptions = {
  readonly waitMs?: number;
  readonly maxWaitMs?: number;
};

/**
 * A reference implementation of the now deprecated `debounce` function using
 * the `funnel` function instead. While you update your codebase you can copy
 * this function as-is and use it as a drop-in replacement; but we recommend
 * eventually inlining the call to `funnel` so you can adjust the function to
 * your specific needs.
 *
 * The following tests in this file are the original tests for debounce.
 *
 * @see debounce
 */
function debounce<F extends (...args: any) => any>(
  func: F,
  options: DebounceOptions & { readonly timing?: "trailing" },
): Debouncer<F>;
function debounce<F extends (...args: any) => any>(
  func: F,
  options:
    | (DebounceOptions & { readonly timing: "both" })
    | (Omit<DebounceOptions, "maxWaitMs"> & { readonly timing: "leading" }),
): Debouncer<F, false /* call CAN'T return null */>;
function debounce<F extends (...args: any) => any>(
  func: F,
  {
    timing,
    waitMs,
    maxWaitMs,
  }: DebounceOptions & {
    readonly timing?: "both" | "leading" | "trailing";
  },
) {
  if (maxWaitMs !== undefined && waitMs !== undefined && maxWaitMs < waitMs) {
    throw new Error(
      `debounce: maxWaitMs (${maxWaitMs.toString()}) cannot be less than waitMs (${waitMs.toString()})`,
    );
  }

  let cachedValue: ReturnType<F> | undefined;

  const debouncingFunnel = funnel(
    (args: Parameters<F>) => {
      // Every time the function is invoked the cached value is updated.
      cachedValue = func(...args) as ReturnType<F>;
    },
    {
      // Debounce stores the latest args it was called with for the next
      // invocation of the callback.
      reducer: (_, ...args: Parameters<F>) => args,
      minQuietPeriodMs: waitMs ?? maxWaitMs ?? 0,
      ...(maxWaitMs !== undefined && { maxBurstDurationMs: maxWaitMs }),
      ...(timing === "leading"
        ? { triggerAt: "start" }
        : timing === "both"
          ? { triggerAt: "both" }
          : { triggerAt: "end" }),
    },
  );

  return {
    call: (...args: Parameters<F>) => {
      debouncingFunnel.call(...args);
      return cachedValue;
    },

    flush: () => {
      debouncingFunnel.flush();
      return cachedValue;
    },

    cancel: () => {
      debouncingFunnel.cancel();
    },

    get isPending() {
      return !debouncingFunnel.isIdle;
    },

    get cachedValue() {
      return cachedValue;
    },
  };
}

describe("main functionality", () => {
  test("should debounce a function", async () => {
    const mockFn = vi.fn<(x: string) => string>(identity());
    const debouncer = debounce(mockFn, { waitMs: 32 });

    expect([
      debouncer.call("a"),
      debouncer.call("b"),
      debouncer.call("c"),
    ]).toStrictEqual([undefined, undefined, undefined]);
    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(128);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect([
      debouncer.call("d"),
      debouncer.call("e"),
      debouncer.call("f"),
    ]).toStrictEqual(["c", "c", "c"]);
    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(256);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("subsequent debounced calls return the last `func` result", async () => {
    const debouncer = debounce(identity(), { waitMs: 32 });
    debouncer.call("a");
    await sleep(64);

    expect(debouncer.call("b")).toBe("a");

    await sleep(128);

    expect(debouncer.call("c")).toBe("b");
  });

  test("should not immediately call `func` when `wait` is `0`", async () => {
    const mockFn = vi.fn<() => void>();
    const debouncer = debounce(mockFn, {});
    debouncer.call();
    debouncer.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(5);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("should apply default options", async () => {
    const mockFn = vi.fn<() => void>();
    const debouncer = debounce(mockFn, { waitMs: 32 });
    debouncer.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(64);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("should support a `leading` option", async () => {
    const leadingMockFn = vi.fn<() => void>();
    const bothMockFn = vi.fn<() => void>();
    const withLeading = debounce(leadingMockFn, {
      waitMs: 32,
      timing: "leading",
    });
    withLeading.call();

    expect(leadingMockFn).toHaveBeenCalledTimes(1);

    const withLeadingAndTrailing = debounce(bothMockFn, {
      waitMs: 32,
      timing: "both",
    });
    withLeadingAndTrailing.call();
    withLeadingAndTrailing.call();

    expect(bothMockFn).toHaveBeenCalledTimes(1);

    await sleep(64);

    expect(bothMockFn).toHaveBeenCalledTimes(2);

    withLeading.call();

    expect(leadingMockFn).toHaveBeenCalledTimes(2);
  });

  test("subsequent leading debounced calls return the last `func` result", async () => {
    const debouncer = debounce(identity(), { waitMs: 32, timing: "leading" });

    expect([debouncer.call("a"), debouncer.call("b")]).toStrictEqual([
      "a",
      "a",
    ]);

    await sleep(64);

    expect([debouncer.call("c"), debouncer.call("d")]).toStrictEqual([
      "c",
      "c",
    ]);
  });

  test("should support a `trailing` option", async () => {
    const mockFn = vi.fn<() => void>();
    const withTrailing = debounce(mockFn, { waitMs: 32, timing: "trailing" });
    withTrailing.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(64);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe("optional param maxWaitMs", () => {
  test("should support a `maxWait` option", async () => {
    const mockFn = vi.fn<(x: string) => void>();
    const debouncer = debounce(mockFn, { waitMs: 32, maxWaitMs: 64 });
    debouncer.call("a");
    debouncer.call("b");

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(128);

    expect(mockFn).toHaveBeenCalledTimes(1);

    debouncer.call("c");
    debouncer.call("d");

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(256);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("should support `maxWait` in a tight loop", async () => {
    const withMockFn = vi.fn<() => void>();
    const withoutMockFn = vi.fn<() => void>();
    const withMaxWait = debounce(withMockFn, { waitMs: 32, maxWaitMs: 128 });
    const withoutMaxWait = debounce(withoutMockFn, { waitMs: 96 });
    const start = Date.now();
    while (Date.now() - start < 320) {
      withMaxWait.call();
      withoutMaxWait.call();
    }
    await sleep(1);

    expect(withoutMockFn).toHaveBeenCalledTimes(0);
    expect(withMockFn).not.toHaveBeenCalledTimes(0);
  });

  test("should queue a trailing call for subsequent debounced calls after `maxWait`", async () => {
    const mockFn = vi.fn<() => void>();
    const debouncer = debounce(mockFn, { waitMs: 200, maxWaitMs: 200 });
    debouncer.call();
    setTimeout(() => {
      debouncer.call();
    }, 190);
    setTimeout(() => {
      debouncer.call();
    }, 200);
    setTimeout(() => {
      debouncer.call();
    }, 210);
    await sleep(500);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("should cancel `maxDelayed` when `delayed` is invoked", async () => {
    const mockFn = vi.fn<() => void>();
    const debouncer = debounce(mockFn, { waitMs: 32, maxWaitMs: 64 });
    debouncer.call();
    await sleep(128);
    debouncer.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(192);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("works like a leaky bucket when only maxWaitMs is set", async () => {
    const mockFn = vi.fn<() => void>();
    const debouncer = debounce(mockFn, { maxWaitMs: 32 });
    debouncer.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(16);
    // Without maxWaitMs this call would cause the actual invocation to be
    // postponed for a full window.
    debouncer.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(17);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe("additional functionality", () => {
  test("can cancel before the timer starts", async () => {
    const debouncer = debounce(identity(), { waitMs: 32 });

    expect(() => {
      debouncer.cancel();
    }).not.toThrow();
    expect(debouncer.call("hello")).toBeUndefined();

    await sleep(32);

    expect(debouncer.call("world")).toBe("hello");
  });

  test("can cancel the timer", async () => {
    const mockFn = vi.fn<() => string>(constant("Hello, World!"));
    const debouncer = debounce(mockFn, { waitMs: 32 });

    expect(debouncer.call()).toBeUndefined();
    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(1);

    expect(debouncer.call()).toBeUndefined();
    expect(mockFn).toHaveBeenCalledTimes(0);

    debouncer.cancel();
    await sleep(32);

    expect(debouncer.call()).toBeUndefined();
    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(32);

    expect(debouncer.call()).toBe("Hello, World!");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("can cancel after the timer ends", async () => {
    const debouncer = debounce(identity(), { waitMs: 32 });

    expect(debouncer.call("hello")).toBeUndefined();

    await sleep(32);

    expect(debouncer.call("world")).toBe("hello");
    expect(() => {
      debouncer.cancel();
    }).not.toThrow();
  });

  test("can cancel maxWait timer", async () => {
    const debouncer = debounce(identity(), { waitMs: 16, maxWaitMs: 32 });

    expect(debouncer.call("hello")).toBeUndefined();

    await sleep(1);
    debouncer.cancel();
    await sleep(32);

    expect(debouncer.call("world")).toBeUndefined();
  });

  test("can return a cached value", () => {
    const debouncer = debounce(identity(), { timing: "leading", waitMs: 32 });

    expect(debouncer.cachedValue).toBeUndefined();
    expect(debouncer.call("hello")).toBe("hello");
    expect(debouncer.cachedValue).toBe("hello");
  });

  test("can check for inflight timers (trailing)", async () => {
    const debouncer = debounce(identity(), { waitMs: 32 });

    expect(debouncer.isPending).toBe(false);
    expect(debouncer.call("hello")).toBeUndefined();
    expect(debouncer.isPending).toBe(true);

    await sleep(1);

    expect(debouncer.isPending).toBe(true);

    await sleep(32);

    expect(debouncer.isPending).toBe(false);
  });

  test("can check for inflight timers (leading)", async () => {
    const debouncer = debounce(identity(), { timing: "leading", waitMs: 32 });

    expect(debouncer.isPending).toBe(false);
    expect(debouncer.call("hello")).toBe("hello");
    expect(debouncer.isPending).toBe(true);

    await sleep(1);

    expect(debouncer.isPending).toBe(true);

    await sleep(32);

    expect(debouncer.isPending).toBe(false);
  });

  test("can flush before a cool-down", async () => {
    const debouncer = debounce(identity(), { waitMs: 32 });

    expect(debouncer.flush()).toBeUndefined();
    expect(debouncer.call("hello")).toBeUndefined();

    await sleep(32);

    expect(debouncer.call("world")).toBe("hello");
  });

  test("can flush during a cool-down", async () => {
    const debouncer = debounce(identity(), { waitMs: 32 });

    expect(debouncer.call("hello")).toBeUndefined();

    await sleep(1);

    expect(debouncer.call("world")).toBeUndefined();

    await sleep(1);

    expect(debouncer.flush()).toBe("world");
  });

  test("can flush after a cool-down", async () => {
    const debouncer = debounce(identity(), { waitMs: 32 });

    expect(debouncer.call("hello")).toBeUndefined();

    await sleep(32);

    expect(debouncer.flush()).toBe("hello");
  });
});

describe("errors", () => {
  test("prevents maxWaitMs to be less then waitMs", () => {
    expect(() => debounce(identity(), { waitMs: 32, maxWaitMs: 16 })).toThrow(
      "debounce: maxWaitMs (16) cannot be less than waitMs (32)",
    );
  });
});
