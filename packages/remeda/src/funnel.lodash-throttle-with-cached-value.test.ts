/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, jsdoc/require-param, jsdoc/require-example --
 * These aren't useful for a reference implementation for a legacy library!
 */

import { describe, expect, test, vi } from "vitest";
import { sleep } from "../test/sleep";
import { constant } from "./constant";
import { funnel } from "./funnel";
import { identity } from "./identity";

/**
 * A reference implementation of the Lodash `throttle` function using the
 * Remeda `funnel` function. While migrating from Lodash you can copy this
 * function as-is into your codebase and use it as a drop-in replacement; but
 * we recommend eventually inlining the call to `funnel` so you can adjust the
 * function to your specific needs.
 *
 * This is a more complex implementation which respects Lodash capability to
 * track the return value of the callback function. In most cases you are more
 * likely to prefer the simpler reference implementation `throttle` which can
 * be found in the other test file.
 *
 * The following tests in this file are based on the Lodash tests for throttle.
 * They have been adapted to work with our testing framework, have been fixed
 * or expanded slightly were it felt necessary, and have been modernized for
 * better readability. The names of the test cases have been preserved to ease
 * comparing them to the original tests. Tests that are unrelated to the cache
 * capability have been removed to avoid duplication with the other test file.
 *
 * Note that this means that whenever Lodash offered a concrete spec, we made
 * sure our reference implementation respects it, but there might be untested
 * use-cases that would have differing runtime behaviors.
 *
 * @see Lodash Documentation: https://lodash.com/docs/4.17.15#throttle
 * @see Lodash Implementation: https://github.com/lodash/lodash/blob/4.17.21/lodash.js#L10965
 * @see Lodash Tests: https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L22768
 * @see Lodash Typing: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/lodash/common/function.d.ts#L1347
 */
function throttleWithCachedValue<F extends (...args: any) => any>(
  func: F,
  wait = 0,
  {
    leading = true,
    trailing = true,
  }: { readonly leading?: boolean; readonly trailing?: boolean } = {},
) {
  let cachedValue: ReturnType<F> | undefined;

  const { call, flush, cancel } = funnel(
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
      // Also, every time the function is invoked the cached value is updated.
      cachedValue = func(...args) as ReturnType<F>;
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

  // Lodash uses a legacy JS-isms to attach helper functions to the main
  // callback of `throttle`. In Remeda we return a proper object where the
  // callback is one of the available properties. Here we destructure and then
  // reconstruct the object to fit the Lodash API.
  return Object.assign(
    (...args: Parameters<F>) => {
      call(...args);
      return cachedValue;
    },
    {
      flush: () => {
        flush();
        return cachedValue;
      },

      cancel,
    },
  );
}

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter (but the larger it is,
// the longer the tests would take to run); the value used by Lodash is 32.
// The number is in milliseconds.
const UT = 16;

describe("https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L22768", () => {
  test("subsequent calls should return the result of the first call", async () => {
    const throttled = throttleWithCachedValue(identity(), UT);

    expect(throttled("a")).toBe("a");
    expect(throttled("b")).toBe("a");

    await sleep(2 * UT);
    const resultC = throttled("c");
    const resultD = throttled("d");

    expect(resultC).not.toBe("a");
    expect(resultC).toBeDefined();
    expect(resultD).not.toBe("d");
    expect(resultD).toBeDefined();
  });

  test("should support a `leading` option", () => {
    const withLeading = throttleWithCachedValue(identity(), UT, {
      leading: true,
    });
    const withoutLeading = throttleWithCachedValue(identity(), UT, {
      leading: false,
    });

    expect(withLeading("a")).toBe("a");
    expect(withoutLeading("a")).toBeUndefined();
  });

  test("should support a `trailing` option", async () => {
    const mockWith = vi.fn<<T>(x: T) => T>(identity());
    const mockWithout = vi.fn<<T>(x: T) => T>(identity());
    const withTrailing = throttleWithCachedValue(mockWith, 2 * UT, {
      trailing: true,
    });
    const withoutTrailing = throttleWithCachedValue(mockWithout, 2 * UT, {
      trailing: false,
    });

    expect(withTrailing("a")).toBe("a");
    expect(withTrailing("b")).toBe("a");
    expect(withoutTrailing("a")).toBe("a");
    expect(withoutTrailing("b")).toBe("a");

    await sleep(8 * UT);

    expect(mockWith).toHaveBeenCalledTimes(2);
    expect(mockWithout).toHaveBeenCalledTimes(1);
  });
});

describe("https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L23038", () => {
  test("should reset `lastCalled` after cancelling", async () => {
    let callCount = 0;
    const throttled = throttleWithCachedValue(
      () => {
        callCount += 1;
        return callCount;
      },
      UT,
      { leading: true },
    );

    expect(throttled()).toBe(1);

    throttled.cancel();

    expect(throttled()).toBe(2);

    throttled();
    await sleep(2 * UT);

    expect(callCount).toBe(3);
  });

  test("should support flushing delayed calls", async () => {
    let callCount = 0;
    const throttled = throttleWithCachedValue(
      () => {
        callCount += 1;
        return callCount;
      },
      UT,
      { leading: false },
    );
    throttled();

    expect(throttled.flush()).toBe(1);

    await sleep(2 * UT);

    expect(callCount).toBe(1);
  });

  test("should noop `cancel` and `flush` when nothing is queued", async () => {
    const mockFn = vi.fn<() => string>(constant("hello"));
    const throttled = throttleWithCachedValue(mockFn, UT);
    throttled.cancel();

    expect(throttled.flush()).toBeUndefined();

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});

describe("Features not tested by Lodash", () => {
  test("does nothing when neither leading nor trailing are enabled", async () => {
    const throttled = throttleWithCachedValue(identity(), UT, {
      leading: false,
      trailing: false,
    });

    expect(throttled("hello")).toBeUndefined();
    expect(throttled("world")).toBeUndefined();

    await sleep(4 * UT);

    expect(throttled("goodbye")).toBeUndefined();
  });
});
