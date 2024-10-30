import { sleep } from "../test/sleep";
import { constant } from "./constant";
import { funnel } from "./funnel";

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter (but the larger it is,
// the longer the tests would take to run). The number is in milliseconds.
const UT = 16;

describe("simple cases", () => {
  test("reduces call args", async () => {
    const mockFn = vi.fn();

    const foo = funnel(
      (total: number | undefined, item: number) => (total ?? 0) + item,
      mockFn,
      {
        burstCoolDownMs: 2 * UT,
        invokedAt: "end",
      },
    );
    foo.call(1);
    foo.call(2);
    foo.call(3);

    await sleep(UT);

    foo.call(4);
    foo.call(5);
    foo.call(6);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(21 /* 1 + 2 + ... + 6 */);
  });

  describe("invokedAt: start", () => {
    test("invokes immediately", () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, { invokedAt: "start" });
      foo.call();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("throttles invocations based on delayMs", async () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, {
        invokedAt: "start",
        delayMs: UT,
      });
      foo.call();

      expect(mockFn).toHaveBeenCalledTimes(1);

      foo.call();

      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(2 * UT);
      foo.call();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe("invokedAt: end", () => {
    test("invokes after burstCoolDownMs", async () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, {
        invokedAt: "end",
        burstCoolDownMs: UT,
      });
      foo.call();

      expect(mockFn).toHaveBeenCalledTimes(0);

      await sleep(2 * UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("does not invoke if reduceArgs returns undefined", async () => {
      const mockFn = vi.fn();
      const foo = funnel(constant(undefined), mockFn, {
        invokedAt: "end",
        burstCoolDownMs: UT,
      });
      foo.call();
      await sleep(2 * UT);

      expect(mockFn).toHaveBeenCalledTimes(0);
    });

    test("maxBurstDurationMs limits the burst duration", async () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, {
        burstCoolDownMs: UT,
        maxBurstDurationMs: 2 * UT,
        invokedAt: "end",
      });
      foo.call();
      await sleep(0.9 * UT);
      foo.call();
      await sleep(0.9 * UT);
      foo.call();
      // Total time is approximately 1.8*UT

      expect(mockFn).toHaveBeenCalledTimes(0);

      // Wait until maxBurstDurationMs is reached
      await sleep(0.2 * UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("flush triggers an immediate invocation", () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, {
        invokedAt: "end",
        burstCoolDownMs: UT,
      });
      foo.call();
      foo.flush();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("cancel prevents invocation", async () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, {
        invokedAt: "end",
        burstCoolDownMs: UT,
      });
      foo.call();
      foo.cancel();
      await sleep(2 * UT);

      expect(mockFn).toHaveBeenCalledTimes(0);
    });

    test("isIdle reflects the funnel's state", () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, {
        invokedAt: "end",
        burstCoolDownMs: UT,
      });

      expect(foo.isIdle).toBe(true);

      foo.call();

      expect(foo.isIdle).toBe(false);

      foo.cancel();

      expect(foo.isIdle).toBe(true);
    });
  });

  describe("invokedAt: both", () => {
    test("invokes immediately and after burstCoolDownMs", async () => {
      const mockFn = vi.fn();
      const foo = funnel(constant("data"), mockFn, {
        invokedAt: "both",
        burstCoolDownMs: UT,
      });

      foo.call();

      // Should have been called immediately
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("data");

      foo.call();

      // Should not have been called again yet
      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(2 * UT);

      // Should have been called again after burstCoolDownMs
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith("data");
    });

    test("invokes immediately and respects delayMs", async () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, {
        invokedAt: "both",
        delayMs: UT,
      });

      foo.call();

      // Should have been called immediately
      expect(mockFn).toHaveBeenCalledTimes(1);

      foo.call();

      // Should not have been called again yet
      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(2 * UT);

      // Should have been called again after delayMs
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});

describe("edge-cases", () => {
  test("bursts that start late don't prevent delayed invocations", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "both",
      burstCoolDownMs: UT,
      delayMs: 2 * UT,
    });
    foo.call();
    foo.call();
    foo.call();

    // We expect the function to be called once because we invoke it both at
    // the start and end of the blackout periods.
    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(1.5 * UT);

    // But because our delay time is still longer, we still expect that the
    // function hasn't been called yet again for the end of the blackout period.
    expect(mockFn).toHaveBeenCalledTimes(1);

    foo.call();
    foo.call();
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(0.5 * UT);

    // After the delay is over we expect the function to be invoked again for
    // the end of the blackout period.
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("delay timeouts don't cause an invocation in the middle of bursts", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "both",
      burstCoolDownMs: 2 * UT,
      delayMs: UT,
    });
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  // eslint-disable-next-line vitest/prefer-lowercase-title
  test("KNOWN ISSUE: never fires when only delay is used and invoked only at end", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "end",
      delayMs: UT,
    });
    foo.call();
    foo.call();
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(2 * UT);
    foo.call();
    foo.call();
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});

describe("zero timeouts", () => {
  describe("delayMs = 0", () => {
    test("invokedAt: start", async () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, {
        invokedAt: "start",
        delayMs: 0,
      });
      foo.call();
      foo.call();
      foo.call();

      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(0);
      foo.call();
      foo.call();
      foo.call();

      expect(mockFn).toHaveBeenCalledTimes(2);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test("invokedAt: both", async () => {
      const mockFn = vi.fn();
      const foo = funnel(constant([]), mockFn, {
        invokedAt: "both",
        delayMs: 0,
      });
      foo.call();
      foo.call();
      foo.call();

      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(0);
      foo.call();
      foo.call();
      foo.call();

      expect(mockFn).toHaveBeenCalledTimes(2);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  test("burstCoolDownMs = 0", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "end",
      burstCoolDownMs: 0,
    });

    foo.call();

    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("delayMs = 0 and burstCoolDownMs = 0", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "both",
      delayMs: 0,
      burstCoolDownMs: 0,
    });

    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("maxBurstDurationMs = 0 limits the burst immediately", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "end",
      burstCoolDownMs: UT,
      maxBurstDurationMs: 0,
    });

    foo.call();

    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("delayMs = 0 and burstCoolDownMs > 0", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "both",
      delayMs: 0,
      burstCoolDownMs: UT,
    });

    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("delayMs > 0 and burstCoolDownMs = 0", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "both",
      delayMs: UT,
      burstCoolDownMs: 0,
    });

    foo.call();
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test("all timeouts zero", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant([]), mockFn, {
      invokedAt: "both",
      delayMs: 0,
      burstCoolDownMs: 0,
      maxBurstDurationMs: 0,
    });

    foo.call();
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
