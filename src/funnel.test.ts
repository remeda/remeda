import { sleep } from "../test/sleep";
import { constant } from "./constant";
import { funnel } from "./funnel";

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter (but the larger it is,
// the longer the tests would take to run). The number is in milliseconds.
const UT = 16;

// We use this reducer to collect arguments from each invocation so we can test
// what the function was invoked with.
const ARGS_COLLECTOR = (
  accumulator: ReadonlyArray<string> | undefined,
  item: string,
): ReadonlyArray<string> =>
  accumulator === undefined ? [item] : [...accumulator, item];

describe("reducer behavior", () => {
  it("passes the reduced arg to the executor", () => {
    const mockFn = vi.fn();
    const foo = funnel(constant("hello world"), mockFn, {
      invokedAt: "start",
      burstCoolDownMs: UT,
    });
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith("hello world");
  });

  it("reduces call args", async () => {
    const mockFn = vi.fn((_total: number): void => {
      /* do nothing */
    });

    const foo = funnel((total, item: number) => (total ?? 0) + item, mockFn, {
      burstCoolDownMs: 2 * UT,
      invokedAt: "end",
    });
    foo.call(1);
    foo.call(2);
    foo.call(3);
    await sleep(UT);
    foo.call(4);
    foo.call(5);
    foo.call(6);
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(21 /* 1 + 2 + ... + 6 */);
  });

  it("does not invoke if reduceArgs returns undefined", async () => {
    const mockFn = vi.fn();
    const foo = funnel(constant(undefined), mockFn, {
      invokedAt: "end",
      burstCoolDownMs: UT,
    });
    foo.call();
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it("supports multiple arguments", () => {
    const mockFn = vi.fn();
    const foo = funnel(
      (ret: unknown, a: number, b: string, c: boolean) => [ret, a, b, c],
      mockFn,
      { invokedAt: "start", burstCoolDownMs: UT },
    );
    foo.call(1, "a", true);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith([undefined, 1, "a", true]);
  });
});

describe("single timer enabled with non-trivial (>0ms) duration", () => {
  describe("delay timer", () => {
    test("invokedAt: start", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "start",
        delayMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);

      foo.call("d");

      expect(mockFn).toHaveBeenCalledTimes(2);
      // "b" and "c" have been ignored because the funnel is only configured to
      // run the function at the start of the delay window, meaning anything
      // after that is simply dropped.
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);
    });

    test("invokedAt: both", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "both",
        delayMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d", "e", "f"]);
    });

    it("never fires when only delay is used and invoked only at end", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "end",
        delayMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(0);

      await sleep(2 * UT);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(0);

      await sleep(2 * UT);

      expect(mockFn).toHaveBeenCalledTimes(0);
    });

    test("invocations in the middle of a window", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "both",
        delayMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(0.75 * UT);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(0.75 * UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c", "d", "e", "f"]);
    });
  });

  describe("burst timer", () => {
    test("invokedAt: start", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "start",
        burstCoolDownMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);

      foo.call("d");

      expect(mockFn).toHaveBeenCalledTimes(2);
      // "b" and "c" have been ignored because the funnel is only configured to
      // run the function at the start of the delay window, meaning anything
      // after that is simply dropped.
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);
    });

    test("invokedAt: both", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "both",
        burstCoolDownMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(mockFn).toHaveBeenLastCalledWith(["e", "f"]);
    });

    test("invokedAt: end", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "end",
        burstCoolDownMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(0);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c"]);

      foo.call("e");
      foo.call("f");
      foo.call("g");

      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["e", "f", "g"]);
    });

    test("invocations in the middle of a window", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "end",
        burstCoolDownMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(0);

      await sleep(0.9 * UT);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(0);

      await sleep(0.1 * UT);

      expect(mockFn).toHaveBeenCalledTimes(0);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c", "d", "e", "f"]);
    });

    test("maxBurstDurationMs limits the burst duration", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        burstCoolDownMs: UT,
        maxBurstDurationMs: 2 * UT,
        invokedAt: "end",
      });
      foo.call("a");
      await sleep(0.75 * UT);
      foo.call("b");
      await sleep(0.75 * UT);
      foo.call("c");

      // Total time is approximately 1.8*UT
      expect(mockFn).toHaveBeenCalledTimes(0);

      // Wait until maxBurstDurationMs is reached
      await sleep(0.5 * UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c"]);
    });
  });
});

describe("zero timeouts", () => {
  describe("delay timer", () => {
    test("invokedAt: start", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "start",
        delayMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(0);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);
      // "b" and "c" have been ignored because the funnel is only configured to
      // run the function at the start of the delay window, meaning anything
      // after that is simply dropped.
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test("invokedAt: both", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "both",
        delayMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(0);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d", "e", "f"]);
    });

    test("with a non-trivial burst timer", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "both",
        delayMs: 0,
        burstCoolDownMs: UT,
      });
      foo.call("a");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      foo.call("b");

      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b"]);
    });
  });

  describe("burst timer", () => {
    test("invokedAt: start", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "start",
        burstCoolDownMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(0);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);
      // "b" and "c" have been ignored because the funnel is only configured to
      // run the function at the start of the delay window, meaning anything
      // after that is simply dropped.
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test("invokedAt: both", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "both",
        burstCoolDownMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(mockFn).toHaveBeenLastCalledWith(["e", "f"]);
    });

    test("invokedAt: end", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "end",
        burstCoolDownMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(0);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c"]);

      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["d", "e", "f"]);
    });

    test("with a non-trivial delay timer", async () => {
      const mockFn = vi.fn();
      const foo = funnel(ARGS_COLLECTOR, mockFn, {
        invokedAt: "both",
        delayMs: UT,
        burstCoolDownMs: 0,
      });
      foo.call("a");
      foo.call("b");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      await sleep(0);

      expect(mockFn).toHaveBeenCalledTimes(1);

      await sleep(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b"]);
    });
  });

  test("both timers", async () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, {
      invokedAt: "both",
      delayMs: 0,
      burstCoolDownMs: 0,
    });
    foo.call("a");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("maxBurstDurationMs = 0 limits the burst immediately", async () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, {
      invokedAt: "end",
      burstCoolDownMs: UT,
      maxBurstDurationMs: 0,
    });
    foo.call("a");
    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);
  });

  test("all timeouts zero", async () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, {
      invokedAt: "both",
      delayMs: 0,
      burstCoolDownMs: 0,
      maxBurstDurationMs: 0,
    });
    foo.call("a");
    foo.call("b");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(["b"]);
  });
});

describe("disabled timers (no defined timeout durations)", () => {
  test("invokedAt: start", () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, { invokedAt: "start" });
    foo.call("a");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    foo.call("b");

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(["b"]);

    foo.call("c");

    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(mockFn).toHaveBeenLastCalledWith(["c"]);
  });

  it("never invokes when set to invoke at end", async () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, { invokedAt: "end" });
    foo.call("a");
    foo.call("b");
    foo.call("c");

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(10 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test("invokedAt: both", () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, { invokedAt: "both" });
    foo.call("a");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    foo.call("b");

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(["b"]);

    foo.call("c");

    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(mockFn).toHaveBeenLastCalledWith(["c"]);
  });

  test("maxBurstDurationMs doesn't enable the burst timer", async () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, {
      invokedAt: "end",
      maxBurstDurationMs: UT,
    });
    foo.call("a");
    foo.call("b");
    foo.call("c");

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(10 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});

describe("utility functions", () => {
  test("flush triggers an immediate invocation", () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, {
      invokedAt: "end",
      burstCoolDownMs: UT,
    });
    foo.call("a");
    foo.flush();

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);
  });

  test("cancel prevents invocation", async () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, {
      invokedAt: "end",
      burstCoolDownMs: UT,
    });
    foo.call("a");
    foo.cancel();
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test("isIdle reflects the funnel's state", () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, {
      invokedAt: "end",
      burstCoolDownMs: UT,
    });

    expect(foo.isIdle).toBe(true);

    foo.call("a");

    expect(foo.isIdle).toBe(false);

    foo.cancel();

    expect(foo.isIdle).toBe(true);
  });
});

describe("edge-cases", () => {
  test("bursts that start late don't prevent delayed invocations", async () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, {
      invokedAt: "both",
      burstCoolDownMs: UT,
      delayMs: 2 * UT,
    });
    foo.call("a");
    foo.call("b");
    foo.call("c");

    // We expect the function to be called once because we invoke it both at
    // the start and end of the blackout periods.
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    await sleep(1.5 * UT);

    // But because our delay time is still longer, we still expect that the
    // function hasn't been called yet again for the end of the blackout period.
    expect(mockFn).toHaveBeenCalledTimes(1);

    foo.call("d");
    foo.call("e");
    foo.call("f");

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(0.5 * UT);

    // After the delay is over we expect the function to be invoked again for
    // the end of the blackout period.
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(["b", "c", "d", "e", "f"]);
  });

  test("delay timeouts don't cause an invocation in the middle of bursts", async () => {
    const mockFn = vi.fn();
    const foo = funnel(ARGS_COLLECTOR, mockFn, {
      invokedAt: "both",
      burstCoolDownMs: 2 * UT,
      delayMs: UT,
    });
    foo.call("a");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    await sleep(UT);
    foo.call("b");

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);
    foo.call("c");

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);
    foo.call("d");

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
