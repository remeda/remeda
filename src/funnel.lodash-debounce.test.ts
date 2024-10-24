/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/explicit-function-return-type */

import { sleep } from "../test/sleep";
import { doNothing } from "./doNothing";
import { funnel } from "./funnel";

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter. The number represents MS.
const UT = 32;

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

// @see https://github.com/lodash/lodash/blob/v5-wip/test/debounce.spec.js
describe("Lodash: test/debounce.spec.js", () => {
  it("should debounce a function", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, UT);
    debounced.call();
    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);

    debounced.call();
    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should not immediately call `func` when `wait` is `0`", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, 0);
    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    // Yield execution to allow the timeouts in the debouncer to run.
    await sleep(0);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should apply default options", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, UT, {});
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should support a `leading` option", async () => {
    const mockWithLeading = vi.fn();
    const mockWithLeadingAndTrailing = vi.fn();

    // This Lodash test configures both debouncers with the same timing
    // options which doesn't seem to be the intent of the test based on the test
    // name and the debouncer names. We fixed it in our test.
    const withLeading = debounce(mockWithLeading, UT, {
      leading: true,
      trailing: false,
    });
    const withLeadingAndTrailing = debounce(mockWithLeadingAndTrailing, UT, {
      leading: true,
      trailing: true,
    });
    withLeading.call();
    withLeadingAndTrailing.call();
    withLeadingAndTrailing.call();

    expect(mockWithLeading).toHaveBeenCalledTimes(1);
    expect(mockWithLeadingAndTrailing).toHaveBeenCalledTimes(1);

    await sleep(2 * UT);

    expect(mockWithLeading).toHaveBeenCalledTimes(1);
    expect(mockWithLeadingAndTrailing).toHaveBeenCalledTimes(2);

    withLeading.call();

    expect(mockWithLeading).toHaveBeenCalledTimes(2);
  });

  it("should support a `trailing` option", async () => {
    const mockWith = vi.fn();
    const mockWithout = vi.fn();

    const withTrailing = debounce(mockWith, UT, { trailing: true });
    const withoutTrailing = debounce(mockWithout, UT, { trailing: false });
    withTrailing.call();
    withoutTrailing.call();

    expect(mockWith).toHaveBeenCalledTimes(0);
    expect(mockWithout).toHaveBeenCalledTimes(0);

    await sleep(2 * UT);

    expect(mockWith).toHaveBeenCalledTimes(1);
    expect(mockWithout).toHaveBeenCalledTimes(0);
  });

  it("should support a `maxWait` option", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, UT, { maxWait: 2 * UT });
    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);

    debounced.call();
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should support `maxWait` in a tight loop", async () => {
    const mockWith = vi.fn();
    const mockWithout = vi.fn();

    const withMaxWait = debounce(mockWith, 2 * UT, { maxWait: 4 * UT });
    const withoutMaxWait = debounce(mockWithout, 3 * UT);
    const end = Date.now() + 10 * UT;
    while (Date.now() < end) {
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
    expect(mockWith).toHaveBeenCalledTimes(1);
  });

  it("should queue a trailing call for subsequent debounced calls after `maxWait`", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, 6 * UT, { maxWait: 6 * UT });
    debounced.call();
    await sleep(5.5 * UT);
    debounced.call();
    await sleep(0.5 * UT);
    debounced.call();
    await sleep(0.5 * UT);
    debounced.call();
    await sleep(9.5 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should cancel `maxDelayed` when `delayed` is invoked", async () => {
    const mockFn = vi.fn();

    const debounced = debounce(mockFn, UT, { maxWait: 2 * UT });
    debounced.call();
    await sleep(4 * UT);
    debounced.call();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should invoke the trailing call with the correct arguments and `this` binding", async () => {
    const mockFn = vi.fn();
    const DATA = {};

    const debounced = debounce(mockFn, UT, { leading: true, maxWait: 2 * UT });
    while (mockFn.mock.calls.length < 2) {
      debounced.call(DATA, "a");
      // eslint-disable-next-line no-await-in-loop -- In Lodash, when the maxWait is reached, the callback is invoked within the same execution frame (without a setTimeout). In Remeda we use a setTimeout even when it's effective delay is 0ms. This means that we fail the lodash test if we constantly yield the execution frame within a busy loop, so that the timeout gets a chance to run
      await sleep(0);
    }
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith([DATA, "a"]);
  });
});

describe("Additional tests missing from Lodash", () => {
  it("works like a leaky bucket when only maxWaitMs is set", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, UT, { maxWait: UT });

    debouncer.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(0.5 * UT);

    // Without maxWaitMs this call would cause the actual invocation to be
    // postponed for a full window.
    debouncer.call();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(0.5 * UT + 1);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});

describe("Features not tested by Lodash", () => {
  it("can cancel the timer", async () => {
    const mockFn = vi.fn();
    const debouncer = debounce(mockFn, UT);

    debouncer.call();

    expect(mockFn).not.toHaveBeenCalled();

    await sleep(1);
    debouncer.call();

    expect(mockFn).not.toHaveBeenCalled();

    debouncer.cancel();

    await sleep(UT);
    debouncer.call();

    expect(mockFn).not.toHaveBeenCalled();

    await sleep(UT);
    debouncer.call();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("can cancel after the timer ends", async () => {
    const debouncer = debounce(doNothing(), UT);
    debouncer.call();
    await sleep(UT);

    debouncer.call();

    expect(() => {
      debouncer.cancel();
    }).not.toThrow();
  });

  it("can check for inflight timers (trailing)", async () => {
    const debouncer = debounce(doNothing(), UT);

    expect(debouncer.isIdle).toBe(true);

    debouncer.call();

    expect(debouncer.isIdle).toBe(false);

    await sleep(1);

    expect(debouncer.isIdle).toBe(false);

    await sleep(UT);

    expect(debouncer.isIdle).toBe(true);
  });

  it("can check for inflight timers (leading)", async () => {
    const debouncer = debounce(doNothing(), UT, {
      leading: true,
      trailing: false,
    });

    expect(debouncer.isIdle).toBe(true);

    debouncer.call();

    expect(debouncer.isIdle).toBe(false);

    await sleep(1);

    expect(debouncer.isIdle).toBe(false);

    await sleep(UT);

    expect(debouncer.isIdle).toBe(true);
  });
});
