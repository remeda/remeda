/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, jsdoc/require-param, jsdoc/require-example --
 * These aren't useful for a reference implementation for a legacy library!
 */

import { sleep } from "../test/sleep";
import { funnel } from "./funnel";

/**
 * A reference implementation of the Lodash `debounce` function using the
 * Remeda `funnel` function. While migrating from Lodash you can copy this
 * function as-is into your code base and use it as a drop-in replacement; but
 * we recommend eventually inlining the call to `funnel` so you can adjust the
 * function to your specific needs.
 *
 * This is a simplified implementation which ignores the Lodash capability to
 * track the return value of the callback function, but it is most likely the
 * more common use-case. For a more complete (and more complex) implementation
 * that also handles that requirement see the reference implementation for
 * `debounceWithCachedValue` in the other test file.
 *
 * The following tests in this file are based on the Lodash tests for debounce.
 * They have been adapted to work with our testing framework, have been fixed
 * or expanded slightly were it felt necessary, and have been modernized for
 * better readability. The names of the test cases have been preserved to ease
 * comparing them to the original tests.
 *
 * Note that this means that whenever Lodash offered a concrete spec, we made
 * sure our reference implementation respects it, but there might be untested
 * use-cases that would have differing runtime behaviors.
 *
 * @see Lodash Documentation: https://lodash.com/docs/4.17.15#debounce
 * @see Lodash Implementation: https://github.com/lodash/lodash/blob/4.17.21/lodash.js#L10372
 * @see Lodash Typing: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/lodash/common/function.d.ts#L374
 */
function debounce<F extends (...args: any) => void>(
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
) {
  const {
    call,
    // Lodash v4 doesn't provide access to the `isIdle` (called `pending` in
    // Lodash v5) information.
    isIdle: _isIdle,
    ...rest
  } = funnel(
    (args: Parameters<F>) => {
      if (!trailing && !leading) {
        // In Lodash you can disable both the trailing and leading edges of the
        // debounce window, effectively causing the function to never be
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
      // Debounce stores the latest args it was called with for the next
      // invocation of the callback.
      reducer: (_, ...args: Parameters<F>) => args,
      burstCoolDownMs: wait,
      ...(maxWait !== undefined && { maxBurstDurationMs: maxWait }),
      invokedAt: trailing ? (leading ? "both" : "end") : "start",
    },
  );

  // Lodash uses a legacy JS-ism to attach helper functions to the main
  // callback of `debounce`. In Remeda we return a proper object where the
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

describe("https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L4187", () => {
  it("should debounce a function", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, UT);
    debounced("a");
    debounced("b");
    debounced("c");

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("c");

    debounced("d");
    debounced("e");
    debounced("f");

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should not immediately call `func` when `wait` is `0`", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 0);
    debounced();
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await yieldExecution();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should apply default options", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, UT, {});
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should support a `leading` option", async () => {
    const mockWithLeading = vi.fn();
    const mockWithLeadingAndTrailing = vi.fn();
    const withLeading = debounce(mockWithLeading, UT, {
      leading: true,
      // This Lodash test configures both debouncers with the same timing
      // options which doesn't seem to be the intent of the test based on the test
      // name and the debouncer names. We fixed it in our test.
      trailing: false,
    });
    const withLeadingAndTrailing = debounce(mockWithLeadingAndTrailing, UT, {
      leading: true,
      trailing: true,
    });
    withLeading();

    expect(mockWithLeading).toHaveBeenCalledTimes(1);

    withLeadingAndTrailing();
    withLeadingAndTrailing();

    expect(mockWithLeadingAndTrailing).toHaveBeenCalledTimes(1);

    await sleep(2 * UT);

    expect(mockWithLeading).toHaveBeenCalledTimes(1);
    expect(mockWithLeadingAndTrailing).toHaveBeenCalledTimes(2);

    withLeading();

    expect(mockWithLeading).toHaveBeenCalledTimes(2);
  });

  it("should support a `trailing` option", async () => {
    const mockWith = vi.fn();
    const mockWithout = vi.fn();
    const withTrailing = debounce(mockWith, UT, { trailing: true });
    // The lodash test disabled `trailing` but doesn't enable `leading`
    // resulting in a debouncer that has no effective timing policy. We handle
    // this situation so we kept the test, but it might be have been what the
    // test was supposed to test.
    const withoutTrailing = debounce(mockWithout, UT, { trailing: false });
    withTrailing();

    expect(mockWith).toHaveBeenCalledTimes(0);

    withoutTrailing();

    expect(mockWithout).toHaveBeenCalledTimes(0);

    await sleep(2 * UT);

    expect(mockWith).toHaveBeenCalledTimes(1);
    expect(mockWithout).toHaveBeenCalledTimes(0);
  });

  it("should support a `maxWait` option", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, UT, { maxWait: 2 * UT });
    debounced();
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);

    debounced();
    debounced();

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
      withMaxWait();
      withoutMaxWait();
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

    await yieldExecution();

    expect(mockWithout).toHaveBeenCalledTimes(0);
    expect(mockWith).toHaveBeenCalledTimes(1);
  });

  it("should queue a trailing call for subsequent debounced calls after `maxWait`", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, 6 * UT, { maxWait: 6 * UT });
    debounced();
    await sleep(5.5 * UT);
    debounced();
    await sleep(0.5 * UT);
    debounced();
    await sleep(0.5 * UT);
    debounced();
    await sleep(9.5 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should cancel `maxDelayed` when `delayed` is invoked", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, UT, { maxWait: 2 * UT });
    debounced();
    await sleep(4 * UT);
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("should invoke the trailing call with the correct arguments and `this` binding", async () => {
    const mockFn = vi.fn();
    const DATA = {};
    const debounced = debounce(mockFn, UT, {
      leading: true,
      maxWait: 2 * UT,
    });
    while (mockFn.mock.calls.length < 2) {
      debounced(DATA, "a");
      // eslint-disable-next-line no-await-in-loop
      await yieldExecution();
    }
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(DATA, "a");
  });
});

describe("https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L23038", () => {
  it("should use a default `wait` of `0`", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn);
    debounced();
    await sleep(UT);
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("supports recursive calls", async () => {
    const actual = [] as Array<string>;
    const queue = ["a", "b", "c"];
    const debounced = debounce((chr: string) => {
      actual.push(chr);
      const next = queue.shift();
      if (next !== undefined) {
        debounced(next);
      }
    }, UT);
    debounced(queue.shift()!);

    expect(actual).toStrictEqual([]);

    await sleep(8 * UT);

    expect(actual).toStrictEqual(["a", "b", "c"]);
  });

  it("should support cancelling delayed calls", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, UT, { leading: false });
    debounced();
    debounced.cancel();
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it("should reset `lastCalled` after cancelling", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, UT, { leading: true });
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(1);

    debounced.cancel();
    debounced();

    expect(mockFn).toHaveBeenCalledTimes(2);

    debounced();
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it("should support flushing delayed calls", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, UT, { leading: false });
    debounced();
    debounced.flush();

    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should noop `cancel` and `flush` when nothing is queued", async () => {
    const mockFn = vi.fn();
    const debounced = debounce(mockFn, UT);
    debounced.cancel();
    debounced.flush();

    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});

/**
 * Funnel relies on letting the timeouts run. To ensure that happens the tests
 * need to yield execution.
 */
const yieldExecution = async () => await sleep(0);
