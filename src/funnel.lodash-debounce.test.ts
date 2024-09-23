/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-parameters */

import { sleep } from "../test/sleep";
import { doNothing } from "./doNothing";
import { funnel } from "./funnel";

const debounce = <F extends (...args: any) => void>(
  func: F,
  wait = 0,
  {
    leading = false,
    trailing = true,
    maxWait,
  }: {
    readonly leading?: boolean;
    readonly trailing?: boolean;
    readonly maxWait?: number;
  } = {},
) =>
  funnel(
    (_, ...args: ReadonlyArray<unknown>) => args,
    // In Lodash you can disable both the trailing and leading edges of the
    // debounce window, effectively causing the function to never be invoked.
    // Remeda uses the invokedAt enum exactly to avoid this situation; so to
    // simulate Lodash we need to only pass the callback when at least one of
    // them is enabled.
    trailing || leading ? func : doNothing(),
    {
      burstCoolDownMs: wait,
      ...(maxWait !== undefined && { maxBurstDurationMs: maxWait }),
      invokedAt: trailing ? (leading ? "both" : "end") : "start",
    },
  );

describe("Lodash: test/debounce.spec.js", () => {
  it("should debounce a function", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, 32);
    debounced.call();
    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(128);

    expect(mockFn).toHaveBeenCalledTimes(1);

    debounced.call();
    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(256);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should not immediately call `func` when `wait` is `0`", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, 0);
    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(5);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should apply default options", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, 32, {});
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(64);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should support a `leading` option", async () => {
    const mockWithLeading = vi.fn();
    const mockWithLeadingAndTrailing = vi.fn();

    const withLeading = debounce(mockWithLeading, 32, { leading: true });
    const withLeadingAndTrailing = debounce(mockWithLeadingAndTrailing, 32, {
      leading: true,
    });
    withLeading.call();
    withLeadingAndTrailing.call();
    withLeadingAndTrailing.call();

    expect(mockWithLeading).toHaveBeenCalledTimes(1);
    expect(mockWithLeadingAndTrailing).toHaveBeenCalledTimes(1);

    await sleep(64);

    expect(mockWithLeading).toHaveBeenCalledTimes(1);
    expect(mockWithLeadingAndTrailing).toHaveBeenCalledTimes(2);

    withLeading.call();

    expect(mockWithLeading).toHaveBeenCalledTimes(2);
  });

  it("should support a `trailing` option", async () => {
    const mockWith = vi.fn();
    const mockWithout = vi.fn();

    const withTrailing = debounce(mockWith, 32, { trailing: true });
    const withoutTrailing = debounce(mockWithout, 32, { trailing: false });
    withTrailing.call();
    withoutTrailing.call();

    expect(mockWith).toHaveBeenCalledTimes(0);
    expect(mockWithout).toHaveBeenCalledTimes(0);

    await sleep(64);

    expect(mockWith).toHaveBeenCalledTimes(1);
    expect(mockWithout).toHaveBeenCalledTimes(0);
  });

  it("should support a `maxWait` option", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, 32, { maxWait: 64 });
    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(128);

    expect(mockFn).toHaveBeenCalledTimes(1);

    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(256);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should support `maxWait` in a tight loop", async () => {
    const mockWith = vi.fn();
    const mockWithout = vi.fn();

    const withMaxWait = debounce(mockWith, 64, { maxWait: 128 });
    const withoutMaxWait = debounce(mockWithout, 96);
    const start = Date.now();
    while (Date.now() - start < 320) {
      withMaxWait.call();
      withoutMaxWait.call();
    }

    // There's a bug in the Lodash test where they take the result before the
    // sleep (setTimeout); but it still worked for them coincidentally because
    // of how maxWait is implemented:
    // In Lodash, when the maxWait is reached, the callback is invoked within
    // the same execution frame (without a setTimeout). In Remeda we use a
    // setTimeout even when it's effective delay is 0ms. This means that we fail
    // the lodash test if we don't first yield the execution frame to get the
    // timeout to run; Oddly, the Lodash test already had this yield in place
    // (although removing it won't break the lodash test), so to fix the test we
    // simply added more expects to show the difference in implementations.

    expect(mockWithout).toHaveBeenCalledTimes(0);
    expect(mockWith).toHaveBeenCalledTimes(0);

    await sleep(1);

    expect(mockWithout).toHaveBeenCalledTimes(0);
    expect(mockWith).toHaveBeenCalled();
  });

  // it("should queue a trailing call for subsequent debounced calls after `maxWait`", async () => {
  //   const mockFn = vi.fn();

  //   const debounced = debounce(mockFn, 200, { maxWait: 200 });
  //   debounced.call();
  //   await sleep(190);
  //   debounced.call();
  //   await sleep(200);
  //   debounced.call();
  //   await sleep(210);
  //   debounced.call();
  //   await sleep(500);

  //   expect(mockFn).toHaveBeenCalledTimes(2);
  // });

  it("should cancel `maxDelayed` when `delayed` is invoked", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, 32, { maxWait: 64 });
    debounced.call();
    await sleep(128);
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(192);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should invoke the trailing call with the correct arguments and `this` binding", async () => {
    const mockFn = vi.fn();
    const object = {};

    const debounced = debounce(mockFn, 32, { leading: true, maxWait: 64 });
    while (mockFn.mock.calls.length < 2) {
      debounced.call(object, "a");
      // eslint-disable-next-line no-await-in-loop -- In Lodash, when the maxWait is reached, the callback is invoked within the same execution frame (without a setTimeout). In Remeda we use a setTimeout even when it's effective delay is 0ms. This means that we fail the lodash test if we constantly yield the execution frame within a busy loop, so that the timeout gets a chance to run
      await sleep(0);
    }
    await sleep(64);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith([object, "a"]);
  });
});

describe("Main functionality", () => {
  it("should debounce a function", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, 32);

    debouncer.call();
    debouncer.call();
    debouncer.call();
    expect(mockFn).not.toHaveBeenCalled();

    await sleep(128);

    expect(mockFn).toHaveBeenCalledTimes(1);
    debouncer.call();
    debouncer.call();
    debouncer.call();
    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(256);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should not immediately call `func` when `wait` is `0`", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn);

    debouncer.call();
    debouncer.call();
    expect(mockFn).not.toHaveBeenCalled();

    await sleep(5);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should apply default options", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, 32);

    debouncer.call();
    expect(mockFn).not.toHaveBeenCalled();

    await sleep(64);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("'leading'-only invocation timing", async () => {
    const mockFn = vi.fn();

    const withLeading = debounce(mockFn, 32, {
      leading: true,
      trailing: false,
    });

    withLeading.call();
    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(64);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("'trailing'-only invocation timing", async () => {
    const mockFn = vi.fn();

    const withTrailing = debounce(mockFn, 32, {
      leading: false,
      trailing: true,
    });

    withTrailing.call();
    expect(mockFn).not.toHaveBeenCalled();

    await sleep(64);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("'leading' and 'trailing' invocation timings", async () => {
    const mockFn = vi.fn();

    const withLeadingAndTrailing = debounce(mockFn, 32, {
      leading: true,
      trailing: true,
    });

    withLeadingAndTrailing.call();
    withLeadingAndTrailing.call();
    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(64);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe("Optional param maxWaitMs", () => {
  it("should support a `maxWait` option", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, 32, { maxWait: 64 });

    debouncer.call();
    debouncer.call();
    expect(mockFn).not.toHaveBeenCalled();

    await sleep(128);
    expect(mockFn).toHaveBeenCalledTimes(1);
    debouncer.call();
    debouncer.call();
    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(256);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should support `maxWait` in a tight loop", async () => {
    const withMockFn = vi.fn();
    const withoutMockFn = vi.fn();

    const withMaxWait = debounce(withMockFn, 64, { maxWait: 128 });
    const withoutMaxWait = debounce(withoutMockFn, 96);

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

    const debouncer = debounce(mockFn, 200, { maxWait: 200 });

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

  it("should cancel `maxDelayed` when `delayed` is invoked", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, 32, { maxWait: 64 });

    debouncer.call();

    await sleep(128);
    debouncer.call();
    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(192);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("works like a leaky bucket when only maxWaitMs is set", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, 32, { maxWait: 32 });

    debouncer.call();
    expect(mockFn).not.toHaveBeenCalled();

    await sleep(16);

    // Without maxWaitMs this call would cause the actual invocation to be
    // postponed for a full window.
    debouncer.call();
    expect(mockFn).not.toHaveBeenCalled();

    await sleep(17);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe("Additional functionality", () => {
  it("can cancel the timer", async () => {
    const mockFn = vi.fn();
    const debouncer = debounce(mockFn, 32);

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
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("can cancel after the timer ends", async () => {
    const debouncer = debounce(doNothing(), 32);
    debouncer.call();
    await sleep(32);

    debouncer.call();
    expect(() => {
      debouncer.cancel();
    }).not.toThrow();
  });

  it("can check for inflight timers (trailing)", async () => {
    const debouncer = debounce(doNothing(), 32);
    expect(debouncer.isIdle).toBe(true);

    debouncer.call();
    expect(debouncer.isIdle).toBe(false);

    await sleep(1);
    expect(debouncer.isIdle).toBe(false);

    await sleep(32);
    expect(debouncer.isIdle).toBe(true);
  });

  it("can check for inflight timers (leading)", async () => {
    const debouncer = debounce(doNothing(), 32, {
      leading: true,
      trailing: false,
    });
    expect(debouncer.isIdle).toBe(true);

    debouncer.call();
    expect(debouncer.isIdle).toBe(false);

    await sleep(1);
    expect(debouncer.isIdle).toBe(false);

    await sleep(32);
    expect(debouncer.isIdle).toBe(true);
  });
});
