/* eslint-disable vitest/no-hooks --
 * Most tests in this file need a mocked clock, and it has to be restored even
 * when a test fails; both are done via hooks.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { doNothing } from "./doNothing";
import { funnel } from "./funnel";

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter. The number is in
// milliseconds.
const UT = 16;

// The tests assert the funnel's state at exact offsets from each call. That
// only holds on a clock that moves when the test moves it: with real timers a
// late event loop wake-up can run timers in a different order.
beforeEach(() => {
  // Faking everything breaks on Node 18, where `performance.now` is derived from
  // `process.hrtime`: restoring the clock looks like a huge time jump to the
  // duration check vitest wraps hooks with, which then fails them as timed out.
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
});

afterEach(() => {
  // Test files share a worker (`isolate: false`) so the fake clock would leak
  // into whichever file runs next.
  vi.useRealTimers();
});

// We use this reducer to collect arguments from each invocation so we can test
// what the function was invoked with.
const ARGS_COLLECTOR = (
  accumulator: readonly string[] | undefined,
  item: string,
): readonly string[] =>
  accumulator === undefined ? [item] : [...accumulator, item];

describe("without a reducer", () => {
  test("still calls the executor", () => {
    const mockFn = vi.fn<() => void>();
    const foo = funnel(mockFn, { triggerAt: "start" });
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith();
  });

  test("handles multiple calls", () => {
    const mockFn = vi.fn<() => void>();
    const foo = funnel(mockFn, { triggerAt: "both", minQuietPeriodMs: UT });
    foo.call();
    foo.call();
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith();

    vi.advanceTimersByTime(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith();
  });
});

describe("reducer behavior", () => {
  test("passes the reduced arg to the executor", () => {
    const mockFn = vi.fn<(x: string) => void>();
    const foo = funnel(mockFn, {
      reducer: constant("hello world"),
      triggerAt: "start",
      minQuietPeriodMs: UT,
    });
    foo.call();

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith("hello world");
  });

  test("reduces call args", () => {
    const mockFn = vi.fn<(x: number) => void>();

    const foo = funnel(mockFn, {
      reducer: (total, item: number) => (total ?? 0) + item,
      minQuietPeriodMs: 2 * UT,
      triggerAt: "end",
    });
    foo.call(1);
    foo.call(2);
    foo.call(3);
    vi.advanceTimersByTime(UT);
    foo.call(4);
    foo.call(5);
    foo.call(6);
    vi.advanceTimersByTime(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(21 /* 1 + 2 + ... + 6 */);
  });

  test("does not invoke if reduceArgs returns undefined", () => {
    const mockFn = vi.fn<(x: unknown) => void>();
    const foo = funnel(mockFn, {
      reducer: constant(undefined),
      triggerAt: "end",
      minQuietPeriodMs: UT,
    });
    foo.call();
    vi.advanceTimersByTime(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  test("supports multiple arguments", () => {
    const mockFn = vi.fn<(x: unknown) => void>();
    const foo = funnel(mockFn, {
      reducer: (ret: unknown, a: number, b: string, isC: boolean) => [
        ret,
        a,
        b,
        isC,
      ],
      triggerAt: "start",
      minQuietPeriodMs: UT,
    });
    foo.call(1, "a", true);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith([undefined, 1, "a", true]);
  });

  test("reducer isn't called again when 'invokedAt: start'", () => {
    // eslint-disable-next-line vitest/require-mock-type-parameters -- We provide a fully typed mock implementation which allows the type parameter to be fully inferred. There's no point in re-defining it, and anyway, that triggers a different eslint error.
    const mockFn = vi.fn(ARGS_COLLECTOR);
    const foo = funnel(doNothing(), {
      reducer: mockFn,
      triggerAt: "start",
      minQuietPeriodMs: UT,
    });
    foo.call("a");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(undefined, "a");

    foo.call("b");
    foo.call("c");

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe("non-trivial (>0ms) timer duration", () => {
  describe("delay timer", () => {
    test("invokedAt: start", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "start",
        minGapMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);

      foo.call("d");

      expect(mockFn).toHaveBeenCalledTimes(2);
      // "b" and "c" have been ignored because the funnel is only configured to
      // run the function at the start of the delay window, meaning anything
      // after that is simply dropped.
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);
    });

    test("invokedAt: both", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "both",
        minGapMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d", "e", "f"]);
    });

    test("invocations in the middle of a window", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "both",
        minGapMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(0.75 * UT);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(0.75 * UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c", "d", "e", "f"]);
    });
  });

  describe("burst timer", () => {
    test("invokedAt: start", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "start",
        minQuietPeriodMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);

      foo.call("d");

      expect(mockFn).toHaveBeenCalledTimes(2);
      // "b" and "c" have been ignored because the funnel is only configured to
      // run the function at the start of the delay window, meaning anything
      // after that is simply dropped.
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);
    });

    test("invokedAt: both", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "both",
        minQuietPeriodMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(mockFn).toHaveBeenLastCalledWith(["e", "f"]);
    });

    test("invokedAt: end", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "end",
        minQuietPeriodMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c"]);

      foo.call("e");
      foo.call("f");
      foo.call("g");

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["e", "f", "g"]);
    });

    test("invocations in the middle of a window", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "end",
        minQuietPeriodMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(0.9 * UT);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(0.1 * UT);

      expect(mockFn).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c", "d", "e", "f"]);
    });

    test("maxBurstDurationMs limits the burst duration", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        minQuietPeriodMs: UT,
        maxBurstDurationMs: 2 * UT,
        triggerAt: "end",
      });
      foo.call("a");
      vi.advanceTimersByTime(0.75 * UT);
      foo.call("b");
      vi.advanceTimersByTime(0.75 * UT);
      foo.call("c");

      // Total time is 1.5*UT, less than 2UT which is maxBurstDurationMs
      expect(mockFn).toHaveBeenCalledTimes(0);

      // We advance less than minQuietPeriodMs but past our maxBurstDurationMs
      // so that we validate that the burst is being ended prematurely.
      vi.advanceTimersByTime(0.75 * UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c"]);
    });
  });

  describe("both timers", () => {
    test("delay is longer than burst", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        minGapMs: 2 * UT,
        minQuietPeriodMs: UT,
        triggerAt: "both",
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(UT);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c", "d", "e", "f"]);
    });

    test("burst is longer than delay", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        minGapMs: UT,
        minQuietPeriodMs: 2 * UT,
        triggerAt: "both",
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(UT);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c", "d", "e", "f"]);
    });

    test("burst and delay are equal", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        minGapMs: UT,
        minQuietPeriodMs: UT,
        triggerAt: "both",
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(UT);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d", "e", "f"]);
    });

    test("delay and maxBurstDurationMs are equal", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        minGapMs: UT,
        minQuietPeriodMs: 2 * UT,
        maxBurstDurationMs: UT,
        triggerAt: "both",
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(UT);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d", "e", "f"]);
    });
  });
});

describe("immediate (===0) timer durations", () => {
  describe("delay timer", () => {
    test("invokedAt: start", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "start",
        minGapMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(0);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);
      // "b" and "c" have been ignored because the funnel is only configured to
      // run the function at the start of the delay window, meaning anything
      // after that is simply dropped.
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);

      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test("invokedAt: both", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "both",
        minGapMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(0);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      // The last invocation started its 0ms timer from inside a timer callback,
      // where the fake clock enforces a 1ms minimum delay.
      vi.advanceTimersByTime(1);

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d", "e", "f"]);
    });

    test("with a non-trivial burst timer", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "both",
        minGapMs: 0,
        minQuietPeriodMs: UT,
      });
      foo.call("a");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      foo.call("b");

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b"]);
    });
  });

  describe("burst timer", () => {
    test("invokedAt: start", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "start",
        minQuietPeriodMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(0);
      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(2);
      // "b" and "c" have been ignored because the funnel is only configured to
      // run the function at the start of the delay window, meaning anything
      // after that is simply dropped.
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);

      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    test("invokedAt: both", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "both",
        minQuietPeriodMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b", "c"]);

      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(3);
      expect(mockFn).toHaveBeenLastCalledWith(["d"]);

      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(4);
      expect(mockFn).toHaveBeenLastCalledWith(["e", "f"]);
    });

    test("invokedAt: end", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "end",
        minQuietPeriodMs: 0,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c"]);

      foo.call("d");
      foo.call("e");
      foo.call("f");

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["d", "e", "f"]);
    });

    test("with a non-trivial delay timer", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "both",
        minGapMs: UT,
        minQuietPeriodMs: 0,
      });
      foo.call("a");
      foo.call("b");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a"]);

      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(["b"]);
    });

    test("burst timer with non-trivial maxBurstDuration", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        minQuietPeriodMs: 0,
        maxBurstDurationMs: UT,
        triggerAt: "end",
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(mockFn).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(0);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c"]);
    });
  });

  test("both timers", () => {
    const mockFn = vi.fn<(x: readonly string[]) => void>();
    const foo = funnel(mockFn, {
      reducer: ARGS_COLLECTOR,
      triggerAt: "both",
      minGapMs: 0,
      minQuietPeriodMs: 0,
    });
    foo.call("a");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    vi.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("maxBurstDurationMs = 0 limits the burst immediately", () => {
    const mockFn = vi.fn<(x: readonly string[]) => void>();
    const foo = funnel(mockFn, {
      reducer: ARGS_COLLECTOR,
      triggerAt: "end",
      minQuietPeriodMs: UT,
      maxBurstDurationMs: 0,
    });
    foo.call("a");
    vi.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);
  });

  test("all timeouts zero", () => {
    const mockFn = vi.fn<(x: readonly string[]) => void>();
    const foo = funnel(mockFn, {
      reducer: ARGS_COLLECTOR,
      triggerAt: "both",
      minGapMs: 0,
      minQuietPeriodMs: 0,
      maxBurstDurationMs: 0,
    });
    foo.call("a");
    foo.call("b");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    vi.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(["b"]);
  });
});

describe("default minQuietPeriodMs === 0 when minGapMs is not defined", () => {
  test("invokedAt: start", () => {
    const mockFn = vi.fn<(x: readonly string[]) => void>();
    const foo = funnel(mockFn, {
      reducer: ARGS_COLLECTOR,
      triggerAt: "start",
    });
    foo.call("a");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    foo.call("b");

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(1);

    foo.call("c");

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(["c"]);
  });

  test("invokedAt: both", () => {
    const mockFn = vi.fn<(x: readonly string[]) => void>();
    const foo = funnel(mockFn, {
      reducer: ARGS_COLLECTOR,
      triggerAt: "both",
    });
    foo.call("a");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    foo.call("b");

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(0);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(["b"]);

    foo.call("c");

    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(mockFn).toHaveBeenLastCalledWith(["c"]);
  });
});

describe("utility functions", () => {
  describe("flush", () => {
    test("flush triggers an immediate invocation", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "end",
        minQuietPeriodMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");
      foo.flush();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c"]);

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("flush during active burst", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "end",
        minQuietPeriodMs: 2 * UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");

      vi.advanceTimersByTime(UT);

      foo.flush();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenLastCalledWith(["a", "b", "c"]);

      vi.advanceTimersByTime(2 * UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("cancel", () => {
    test("cancel prevents invocation", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "end",
        minQuietPeriodMs: UT,
      });
      foo.call("a");
      foo.call("b");
      foo.call("c");
      foo.cancel();
      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(0);
    });

    test("cancel during delay period", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "start",
        minGapMs: 2 * UT,
      });
      foo.call("a");
      foo.call("b");

      vi.advanceTimersByTime(UT);
      foo.cancel();

      vi.advanceTimersByTime(UT);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("isIdle", () => {
    test("isIdle reflects the funnel's state", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "end",
        minQuietPeriodMs: UT,
      });

      expect(foo.isIdle).toBe(true);

      foo.call("a");

      expect(foo.isIdle).toBe(false);

      foo.cancel();

      expect(foo.isIdle).toBe(true);
    });

    test("isIdle works when burst duration is 0", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "end",
        minQuietPeriodMs: 0,
      });

      expect(foo.isIdle).toBe(true);

      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(foo.isIdle).toBe(false);

      vi.advanceTimersByTime(0);

      expect(foo.isIdle).toBe(true);
    });
  });

  describe("pendingData", () => {
    test("pendingData reflects preparedData when reducer passed", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        reducer: ARGS_COLLECTOR,
        triggerAt: "end",
        minQuietPeriodMs: UT,
      });

      expect(foo.pendingData).toBeUndefined();

      foo.call("a");
      foo.call("b");
      foo.call("c");

      expect(foo.pendingData).toStrictEqual(["a", "b", "c"]);

      foo.flush();

      expect(foo.pendingData).toBeUndefined();
    });

    test("pendingData is undefined when reducer omitted", () => {
      const mockFn = vi.fn<(x: readonly string[]) => void>();
      const foo = funnel(mockFn, {
        triggerAt: "end",
        minQuietPeriodMs: UT,
      });

      expect(foo.pendingData).toBeUndefined();

      foo.call();
      foo.call();
      foo.call();

      expect(foo.pendingData).toBeUndefined();
    });
  });
});

describe("edge-cases", () => {
  test("bursts that start late don't prevent delayed invocations", () => {
    const mockFn = vi.fn<(x: readonly string[]) => void>();
    const foo = funnel(mockFn, {
      reducer: ARGS_COLLECTOR,
      triggerAt: "both",
      minQuietPeriodMs: UT,
      minGapMs: 2 * UT,
    });
    foo.call("a");
    foo.call("b");
    foo.call("c");

    // We expect the function to be called once because we invoke it both at
    // the start and end of the blackout periods.
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    vi.advanceTimersByTime(1.5 * UT);

    // But because our delay time is still longer, we still expect that the
    // function hasn't been called yet again for the end of the blackout period.
    expect(mockFn).toHaveBeenCalledTimes(1);

    foo.call("d");
    foo.call("e");
    foo.call("f");

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(0.5 * UT);

    // After the delay is over we expect the function to be invoked again for
    // the end of the blackout period.
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(["b", "c", "d", "e", "f"]);
  });

  test("delay timeouts don't cause an invocation in the middle of bursts", () => {
    const mockFn = vi.fn<(x: readonly string[]) => void>();
    const foo = funnel(mockFn, {
      reducer: ARGS_COLLECTOR,
      triggerAt: "both",
      minQuietPeriodMs: 2 * UT,
      minGapMs: UT,
    });
    foo.call("a");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith(["a"]);

    vi.advanceTimersByTime(UT);
    foo.call("b");

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(UT);
    foo.call("c");

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(UT);
    foo.call("d");

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(UT);

    expect(mockFn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
