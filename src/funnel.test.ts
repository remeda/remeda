/* eslint-disable @typescript-eslint/explicit-function-return-type -- We want to use the typing returned from funnel itself. */

import { constant } from "./constant";
import { doNothing } from "./doNothing";
import { funnel } from "./funnel";
import { identity } from "./identity";

describe("LEGACY `debounce`", () => {
  describe("Main functionality", () => {
    it("should debounce a function", async () => {
      const mockFn = vi.fn();

      const debouncer = debounce(mockFn, { burstCoolDownMs: 32 });

      debouncer.call("a");
      debouncer.call("b");
      debouncer.call("c");
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(128);

      expect(mockFn).toBeCalledTimes(1);
      debouncer.call("d");
      debouncer.call("e");
      debouncer.call("f");
      expect(mockFn).toBeCalledTimes(1);

      await sleep(256);

      expect(mockFn).toBeCalledTimes(2);
    });

    it("should not immediately call `func` when `wait` is `0`", async () => {
      const mockFn = vi.fn();

      const debouncer = debounce(mockFn, { burstCoolDownMs: 0 });

      debouncer.call();
      debouncer.call();
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(5);
      expect(mockFn).toBeCalledTimes(1);
    });

    it("should apply default options", async () => {
      const mockFn = vi.fn();

      const debouncer = debounce(mockFn, { burstCoolDownMs: 32 });

      debouncer.call();
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(64);
      expect(mockFn).toBeCalledTimes(1);
    });

    it("should support a `leading` option", async () => {
      const leadingMockFn = vi.fn();
      const bothMockFn = vi.fn();

      const withLeading = debounce(leadingMockFn, {
        burstCoolDownMs: 32,
        invokedAt: "start",
      });

      withLeading.call();
      expect(leadingMockFn).toBeCalledTimes(1);

      const withLeadingAndTrailing = debounce(bothMockFn, {
        burstCoolDownMs: 32,
        invokedAt: "both",
      });

      withLeadingAndTrailing.call();
      withLeadingAndTrailing.call();
      expect(bothMockFn).toBeCalledTimes(1);

      await sleep(64);
      expect(bothMockFn).toBeCalledTimes(2);

      withLeading.call();
      expect(leadingMockFn).toBeCalledTimes(2);
    });

    it("should support a `trailing` option", async () => {
      const mockFn = vi.fn();

      const withTrailing = debounce(mockFn, {
        burstCoolDownMs: 32,
        invokedAt: "end",
      });

      withTrailing.call();
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(64);
      expect(mockFn).toBeCalledTimes(1);
    });
  });

  describe("Optional param maxWaitMs", () => {
    it("should support a `maxWait` option", async () => {
      const mockFn = vi.fn();

      const debouncer = debounce(mockFn, {
        burstCoolDownMs: 32,
        maxBurstDurationMs: 64,
      });

      debouncer.call("a");
      debouncer.call("b");
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(128);
      expect(mockFn).toBeCalledTimes(1);
      debouncer.call("c");
      debouncer.call("d");
      expect(mockFn).toBeCalledTimes(1);

      await sleep(256);
      expect(mockFn).toBeCalledTimes(2);
    });

    it("should support `maxWait` in a tight loop", async () => {
      const withMockFn = vi.fn();
      const withoutMockFn = vi.fn();

      const withMaxWait = debounce(withMockFn, {
        burstCoolDownMs: 32,
        maxBurstDurationMs: 128,
      });
      const withoutMaxWait = debounce(withoutMockFn, { burstCoolDownMs: 96 });

      const start = Date.now();
      while (Date.now() - start < 320) {
        withMaxWait.call();
        withoutMaxWait.call();
      }

      await sleep(1);
      expect(withMockFn).toHaveBeenCalled();
      expect(withoutMockFn).not.toHaveBeenCalled();
    });

    it("should queue a trailing call for subsequent debounced calls after `maxWait`", async () => {
      const mockFn = vi.fn();

      const debouncer = debounce(mockFn, {
        burstCoolDownMs: 200,
        maxBurstDurationMs: 200,
      });

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
      expect(mockFn).toBeCalledTimes(2);
    });

    it("should cancel `maxDelayed` when `delayed` is invoked", async () => {
      const mockFn = vi.fn();

      const debouncer = debounce(mockFn, {
        burstCoolDownMs: 32,
        maxBurstDurationMs: 64,
      });

      debouncer.call();

      await sleep(128);
      debouncer.call();
      expect(mockFn).toBeCalledTimes(1);

      await sleep(192);
      expect(mockFn).toBeCalledTimes(2);
    });

    it("works like a leaky bucket when only maxWaitMs is set", async () => {
      const mockFn = vi.fn();

      const debouncer = debounce(mockFn, {
        burstCoolDownMs: 32,
        maxBurstDurationMs: 32,
      });

      debouncer.call();
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(16);

      // Without maxWaitMs this call would cause the actual invocation to be
      // postponed for a full window.
      debouncer.call();
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(17);
      expect(mockFn).toBeCalledTimes(1);
    });
  });

  describe("Additional functionality", () => {
    it("can cancel the timer", async () => {
      const mockFn = vi.fn();
      const debouncer = debounce(mockFn, { burstCoolDownMs: 32 });

      debouncer.call();
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(1);
      debouncer.call();
      expect(mockFn).not.toHaveBeenCalled();
      debouncer.cancel();

      await sleep(32);
      debouncer.call();
      expect(mockFn).not.toHaveBeenCalled();

      await sleep(32);
      debouncer.call();
      expect(mockFn).toBeCalledTimes(1);
    });

    it("can cancel after the timer ends", async () => {
      const debouncer = debounce(doNothing(), { burstCoolDownMs: 32 });
      debouncer.call("hello");
      await sleep(32);

      debouncer.call("world");
      expect(() => {
        debouncer.cancel();
      }).not.toThrow();
    });

    it("can check for inflight timers (trailing)", async () => {
      const debouncer = debounce(doNothing(), { burstCoolDownMs: 32 });
      expect(debouncer.isIdle).toBe(true);

      debouncer.call("hello");
      expect(debouncer.isIdle).toBe(false);

      await sleep(1);
      expect(debouncer.isIdle).toBe(false);

      await sleep(32);
      expect(debouncer.isIdle).toBe(true);
    });

    it("can check for inflight timers (trailing)", async () => {
      const debouncer = debounce(identity(), {
        invokedAt: "start",
        burstCoolDownMs: 32,
      });
      expect(debouncer.isIdle).toBe(true);

      debouncer.call("hello");
      expect(debouncer.isIdle).toBe(false);

      await sleep(1);
      expect(debouncer.isIdle).toBe(false);

      await sleep(32);
      expect(debouncer.isIdle).toBe(true);
    });
  });
});

describe("LEGACY `debounce` with cached value", () => {
  describe("Main functionality", () => {
    it("should debounce a function", async () => {
      const debouncer = debounceWithCachedValue(identity(), {
        burstCoolDownMs: 32,
      });

      expect([
        debouncer.call("a"),
        debouncer.call("b"),
        debouncer.call("c"),
      ]).toEqual([undefined, undefined, undefined]);

      await sleep(128);

      expect([
        debouncer.call("d"),
        debouncer.call("e"),
        debouncer.call("f"),
      ]).toEqual(["c", "c", "c"]);
    });

    it("subsequent debounced calls return the last `func` result", async () => {
      const debouncer = debounceWithCachedValue(identity(), {
        burstCoolDownMs: 32,
      });
      debouncer.call("a");

      await sleep(64);
      expect(debouncer.call("b")).toBe("a");

      await sleep(128);
      expect(debouncer.call("c")).toBe("b");
    });

    it("subsequent leading debounced calls return the last `func` result", async () => {
      const debouncer = debounceWithCachedValue(identity(), {
        burstCoolDownMs: 32,
        invokedAt: "start",
      });

      expect([debouncer.call("a"), debouncer.call("b")]).toEqual(["a", "a"]);

      await sleep(64);
      expect([debouncer.call("c"), debouncer.call("d")]).toEqual(["c", "c"]);
    });
  });

  describe("Additional functionality", () => {
    it("can cancel before the timer starts", async () => {
      const debouncer = debounceWithCachedValue(identity(), {
        burstCoolDownMs: 32,
      });
      expect(() => {
        debouncer.cancel();
      }).not.toThrow();

      expect(debouncer.call("hello")).toBeUndefined();
      await sleep(32);

      expect(debouncer.call("world")).toBe("hello");
    });

    it("can cancel the timer", async () => {
      const debouncer = debounceWithCachedValue(constant("Hello, World!"), {
        burstCoolDownMs: 32,
      });

      expect(debouncer.call()).toBeUndefined();

      await sleep(1);
      expect(debouncer.call()).toBeUndefined();
      debouncer.cancel();

      await sleep(32);
      expect(debouncer.call()).toBeUndefined();

      await sleep(32);
      expect(debouncer.call()).toBe("Hello, World!");
    });

    it("can cancel after the timer ends", async () => {
      const debouncer = debounceWithCachedValue(identity(), {
        burstCoolDownMs: 32,
      });
      expect(debouncer.call("hello")).toBeUndefined();
      await sleep(32);

      expect(debouncer.call("world")).toBe("hello");
      expect(() => {
        debouncer.cancel();
      }).not.toThrow();
    });

    it("can return a cached value", () => {
      const debouncer = debounceWithCachedValue(identity(), {
        invokedAt: "start",
        burstCoolDownMs: 32,
      });
      expect(debouncer.cachedValue).toBeUndefined();
      expect(debouncer.call("hello")).toBe("hello");
      expect(debouncer.cachedValue).toBe("hello");
    });

    it("can check for inflight timers (trailing)", async () => {
      const debouncer = debounceWithCachedValue(identity(), {
        invokedAt: "start",
        burstCoolDownMs: 32,
      });
      expect(debouncer.isIdle).toBe(true);

      expect(debouncer.call("hello")).toBe("hello");
      expect(debouncer.isIdle).toBe(false);

      await sleep(1);
      expect(debouncer.isIdle).toBe(false);

      await sleep(32);
      expect(debouncer.isIdle).toBe(true);
    });

    it("can flush before a cool-down", async () => {
      const debouncer = debounceWithCachedValue(identity(), {
        burstCoolDownMs: 32,
      });
      expect(debouncer.flush()).toBeUndefined();

      expect(debouncer.call("hello")).toBeUndefined();
      await sleep(32);

      expect(debouncer.call("world")).toBe("hello");
    });

    it("can flush during a cool-down", async () => {
      const debouncer = debounceWithCachedValue(identity(), {
        burstCoolDownMs: 32,
      });
      expect(debouncer.call("hello")).toBeUndefined();

      await sleep(1);
      expect(debouncer.call("world")).toBeUndefined();

      await sleep(1);
      expect(debouncer.flush()).toBe("world");
    });

    it("can flush after a cool-down", async () => {
      const debouncer = debounceWithCachedValue(identity(), {
        burstCoolDownMs: 32,
      });
      expect(debouncer.call("hello")).toBeUndefined();

      await sleep(32);
      expect(debouncer.flush()).toBe("hello");
    });
  });
});

const debounce = <F extends (...args: ReadonlyArray<unknown>) => void>(
  func: F,
  timingPolicy: Parameters<typeof funnel>[2],
) => funnel((_, ...args: Parameters<F>) => args, func, timingPolicy);

function debounceWithCachedValue<
  F extends (...args: ReadonlyArray<unknown>) => unknown,
>(func: F, timingPolicy: Parameters<typeof funnel>[2]) {
  let cachedValue: ReturnType<F> | undefined;

  const debouncer = funnel(
    (_, ...args: Parameters<F>) => args,
    (args) => {
      cachedValue = func(...args) as ReturnType<F>;
    },
    timingPolicy,
  );

  return {
    call: (...args: Parameters<F>): ReturnType<F> | undefined => {
      debouncer.call(...args);
      return cachedValue;
    },

    flush: () => {
      debouncer.flush();
      return cachedValue;
    },

    cancel: debouncer.cancel,

    get cachedValue() {
      return cachedValue;
    },

    get isIdle() {
      return debouncer.isIdle;
    },
  };
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}