/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, jsdoc/require-param, jsdoc/require-example --
 * These aren't useful for a reference implementation for a legacy library!
 */

import { sleep } from "../test/sleep";
import { funnel } from "./funnel";

/**
 * A reference implementation of the Lodash `throttle` function using the
 * Remeda `funnel` function. While migrating from Lodash you can copy this
 * function as-is into your code base and use it as a drop-in replacement; but
 * we recommend eventually inlining the call to `funnel` so you can adjust the
 * function to your specific needs.
 *
 * This is a simplified implementation which ignores the Lodash capability to
 * track the return value of the callback function, but it is most likely the
 * more common use-case. For a more complete (and more complex) implementation
 * that also does that see the reference implementation for
 * `throttleWithCachedValue` in the other test file.
 *
 * The following tests in this file are based on the Lodash tests for throttle.
 * They have been adapted to work with our testing framework, have been fixed
 * or expanded slightly were it felt necessary, and have been modernized for
 * better readability. The names of the test cases have been preserved to ease
 * comparing them to the original tests.
 *
 * Note that this means that whenever Lodash offered a concrete spec, we made
 * sure our reference implementation respects it, but there might be untested
 * use-cases that would have differing runtime behaviors.
 *
 * @see Lodash Documentation: https://lodash.com/docs/4.17.15#throttle
 * @see Lodash Implementation: https://github.com/lodash/lodash/blob/4.17.21/lodash.js#L10965
 * @see Lodash Typing: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/lodash/common/function.d.ts#L1347
 */
function throttle<F extends (...args: any) => void>(
  func: F,
  wait = 0,
  {
    leading = true,
    trailing = true,
  }: { readonly leading?: boolean; readonly trailing?: boolean } = {},
) {
  const {
    call,
    // Lodash v4 doesn't provide access to the `isIdle` (called `pending` in
    // Lodash v5) information.
    isIdle: _isIdle,
    ...rest
  } = funnel(
    (args: Parameters<F>) => {
      if (!leading && !trailing) {
        // In Lodash you can disable both the trailing and leading edges of the
        // throttle window, effectively causing the function to never be
        // invoked. Remeda uses the invokedAt enum exactly to prevent such a
        // situation; so to simulate Lodash we need to only pass the callback
        // when at least one of them is enabled.
        return;
      }

      // Funnel provides more control over the args, but lodash simply passes
      // them through, to replicate this behavior we need to spread the args
      // array maintained via the reducer below.
      func(...args);
    },
    {
      // Throttle stores the latest args it was called with for the next
      // invocation of the callback.
      reducer: (_, ...args: Parameters<F>) => args,
      minQuietPeriodMs: wait,
      maxBurstDurationMs: wait,
      ...(trailing
        ? leading
          ? { triggerAt: "both" }
          : { triggerAt: "end" }
        : { triggerAt: "start" }),
    },
  );
  // Lodash uses a legacy JS-ism to attach helper functions to the main
  // callback of `throttle`. In Remeda we return a proper object where the
  // callback is one of the available properties. Here we destructure and then
  // reconstruct the object to fit the Lodash API.
  return Object.assign(call, rest);
}

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter (but the larger it is,
// the longer the tests would take to run); the value used by Lodash is 32.
// The number is in milliseconds.
const UT = 16;

describe("https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L22768", () => {
  it("should throttle a function", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT);
    throttled();
    throttled();
    throttled();
    const callCount = mockFn.mock.calls.length;

    expect(callCount).toBeGreaterThan(0);

    await sleep(2 * UT);

    expect(mockFn.mock.calls.length).toBeGreaterThan(callCount);
  });

  it("should clear timeout when `func` is called", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT);
    throttled();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(2 * UT);

    throttled();

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should not trigger a trailing call when invoked once", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT);
    throttled();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should trigger a call when invoked repeatedly", () => {
    const mockFn = vi.fn();

    const throttled = throttle(mockFn, UT);

    const end = Date.now() + 10 * UT;
    while (Date.now() < end) {
      throttled();
    }

    expect(mockFn).toHaveBeenCalledWith();
  });

  it("should trigger a call when invoked repeatedly and `leading` is `false`", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT, { leading: false });
    const end = Date.now() + 10 * UT;
    while (Date.now() < end) {
      throttled();
    }
    // Yield execution to allow timeouts to run
    await sleep(0);

    expect(mockFn).toHaveBeenCalledWith();
  });

  it("should trigger a second throttled call as soon as possible", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 4 * UT, { leading: false });
    throttled();
    await sleep(6 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);

    throttled();
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should apply default options", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT, {});
    throttled();
    throttled();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should support a `leading` option", () => {
    const mockWith = vi.fn();
    const mockWithout = vi.fn();
    const withLeading = throttle(mockWith, UT, { leading: true });
    const withoutLeading = throttle(mockWithout, UT, { leading: false });

    withLeading();
    withoutLeading();

    expect(mockWith).toHaveBeenCalledTimes(1);
    expect(mockWithout).toHaveBeenCalledTimes(0);
  });

  it("should support a `trailing` option", async () => {
    const mockWith = vi.fn();
    const mockWithout = vi.fn();
    const withTrailing = throttle(mockWith, 2 * UT, { trailing: true });
    const withoutTrailing = throttle(mockWithout, 2 * UT, { trailing: false });
    withTrailing("a");
    withTrailing("b");
    withoutTrailing("a");
    withoutTrailing("b");

    expect(mockWith).toHaveBeenCalledTimes(1);
    expect(mockWith).toHaveBeenCalledWith("a");
    expect(mockWithout).toHaveBeenCalledTimes(1);
    expect(mockWithout).toHaveBeenCalledWith("a");

    await sleep(8 * UT);

    expect(mockWith).toHaveBeenCalledTimes(2);
    expect(mockWithout).toHaveBeenCalledTimes(1);
  });

  it("should not update `lastCalled`, at the end of the timeout, when `trailing` is `false`", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, 64, { trailing: false });
    throttled();
    throttled();
    await sleep(3 * UT);
    throttled();
    throttled();
    await sleep(3 * UT);

    expect(mockFn).toHaveBeenCalledWith();
  });
});

describe("https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L23038", () => {
  it("should use a default `wait` of `0`", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn);
    throttled();
    await sleep(UT);
    throttled();

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("supports recursive calls", async () => {
    const actual = [] as Array<string>;
    const queue = ["a", "b", "c"];
    const throttled = throttle((chr: string) => {
      actual.push(chr);
      const next = queue.shift();
      if (next !== undefined) {
        throttled(next);
      }
    }, UT);
    throttled(queue.shift()!);

    expect(actual).toStrictEqual(["a"]);

    await sleep(8 * UT);

    expect(actual).toStrictEqual(["a", "b", "c"]);
  });

  it("should support cancelling delayed calls", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT, { leading: false });
    throttled();
    throttled.cancel();
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it("should reset `lastCalled` after cancelling", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT, { leading: true });
    throttled();

    expect(mockFn).toHaveBeenCalledTimes(1);

    throttled.cancel();
    throttled();

    expect(mockFn).toHaveBeenCalledTimes(2);

    throttled();
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it("should support flushing delayed calls", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT, { leading: false });
    throttled();
    throttled.flush();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should noop `cancel` and `flush` when nothing is queued", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT);
    throttled.cancel();
    throttled.flush();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});

describe("Not tested by Lodash", () => {
  it("should do nothing when `leading` and `trailing` are both `disabled`", async () => {
    const mockFn = vi.fn();
    const throttled = throttle(mockFn, UT, { leading: false, trailing: false });
    throttled();
    throttled();
    throttled();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
