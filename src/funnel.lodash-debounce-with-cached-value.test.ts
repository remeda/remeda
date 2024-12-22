/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, jsdoc/require-param, jsdoc/require-example --
 * These aren't useful for a reference implementation for a legacy library!
 */

import { sleep } from "../test/sleep";
import { constant } from "./constant";
import { funnel } from "./funnel";
import { identity } from "./identity";

/**
 * A reference implementation of the Lodash `debounce` function using the
 * Remeda `funnel` function. While migrating from Lodash you can copy this
 * function as-is into your codebase and use it as a drop-in replacement; but
 * we recommend eventually inlining the call to `funnel` so you can adjust the
 * function to your specific needs.
 *
 * This is a more complex implementation which respects Lodash capability to
 * track the return value of the callback function. In most cases you are more
 * likely to prefer the simpler reference implementation `debounce` which can
 * be found in the other test file.
 *
 * The following tests in this file are based on the Lodash tests for debounce.
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
 * @see Lodash Documentation: https://lodash.com/docs/4.17.15#debounce
 * @see Lodash Implementation: https://github.com/lodash/lodash/blob/4.17.21/lodash.js#L10372
 * @see Lodash Tests: https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L4187
 * @see Lodash Typing: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/lodash/common/function.d.ts#L374
 */
function debounceWithCachedValue<F extends (...args: any) => any>(
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
  let cachedValue: ReturnType<F> | undefined;

  const { call, flush, cancel } = funnel(
    (args: Parameters<F>) => {
      if (!leading && !trailing) {
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
      // Also, every time the function is invoked the cached value is updated.
      cachedValue = func(...args) as ReturnType<F>;
    },
    {
      // Debounce stores the latest args it was called with for the next
      // invocation of the callback.
      reducer: (_, ...args: Parameters<F>) => args,
      minQuietPeriodMs: wait,
      ...(maxWait !== undefined && { maxBurstDurationMs: maxWait }),
      ...(trailing
        ? leading
          ? { triggerTiming: "both" }
          : { triggerTiming: "end" }
        : { triggerTiming: "start" }),
    },
  );

  // Lodash uses a legacy JS-isms to attach helper functions to the main
  // callback of `debounce`. In Remeda we return a proper object where the
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

describe("https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L4187", () => {
  it("should debounce a function", async () => {
    const mockFn = vi.fn(identity());
    const debounced = debounceWithCachedValue(mockFn, UT);

    expect(debounced("a")).toBeUndefined();
    expect(debounced("b")).toBeUndefined();
    expect(debounced("c")).toBeUndefined();
    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(debounced("d")).toBe("c");
    expect(debounced("e")).toBe("c");
    expect(debounced("f")).toBe("c");
    expect(mockFn).toHaveBeenCalledTimes(1);

    await sleep(4 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it("subsequent debounced calls return the last `func` result", async () => {
    const debounced = debounceWithCachedValue(identity(), UT);
    debounced("a");
    await sleep(2 * UT);

    expect(debounced("b")).not.toBe("b");

    await sleep(2 * UT);

    expect(debounced("c")).not.toBe("c");
  });

  it("subsequent leading debounced calls return the last `func` result", async () => {
    const debounced = debounceWithCachedValue(identity(), UT, {
      leading: true,
      trailing: false,
    });

    expect(debounced("a")).toBe("a");
    expect(debounced("b")).toBe("a");

    await sleep(2 * UT);

    expect(debounced("c")).toBe("c");
    expect(debounced("d")).toBe("c");
  });

  it("should invoke the trailing call with the correct arguments and `this` binding", async () => {
    const DATA = {};
    const mockFn = vi.fn(constant(false));

    // In Lodash the test uses both `leading` and `trailing` timing options
    // for this test, but it only works because the `leading` option in Lodash
    // runs within the same execution frame as the call to the debouncer; the
    // Lodash test also passes when the `leading` option is removed. For our
    // implementation the "leading" option is delayed to the next execution
    // frame, which, when used together with `maxWait` would cause the debouncer
    // to see a "quiet window" and trigger an additional invocation of the
    // mockFn, and the test to fail.
    const debounced = debounceWithCachedValue(mockFn, UT, { maxWait: 2 * UT });

    while (debounced(DATA, "a") ?? true) {
      // eslint-disable-next-line no-await-in-loop -- We sleep to yield execution so that the timeouts in the debouncer have a chance to run.
      await sleep(0);
    }
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenLastCalledWith(DATA, "a");
  });
});

describe("https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L23038", () => {
  it("should reset `lastCalled` after cancelling", async () => {
    let callCount = 0;
    const debounced = debounceWithCachedValue(
      () => {
        callCount += 1;
        return callCount;
      },
      UT,
      { leading: true },
    );

    expect(debounced()).toBe(1);

    debounced.cancel();

    expect(debounced()).toBe(2);

    debounced();
    await sleep(2 * UT);

    expect(callCount).toBe(3);
  });

  it("should support flushing delayed calls", async () => {
    let callCount = 0;
    const debounced = debounceWithCachedValue(
      () => {
        callCount += 1;
        return callCount;
      },
      UT,
      { leading: false },
    );
    debounced();

    expect(debounced.flush()).toBe(1);

    await sleep(2 * UT);

    expect(callCount).toBe(1);
  });

  it("should noop `cancel` and `flush` when nothing is queued", async () => {
    const mockFn = vi.fn(constant("hello"));
    const debounced = debounceWithCachedValue(mockFn, UT);
    debounced.cancel();

    expect(debounced.flush()).toBeUndefined();

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});

describe("Features not tested by Lodash", () => {
  it("does nothing when neither leading nor trailing are enabled", async () => {
    const debounced = debounceWithCachedValue(identity(), UT, {
      leading: false,
      trailing: false,
    });

    expect(debounced("hello")).toBeUndefined();
    expect(debounced("world")).toBeUndefined();

    await sleep(4 * UT);

    expect(debounced("goodbye")).toBeUndefined();
  });
});
