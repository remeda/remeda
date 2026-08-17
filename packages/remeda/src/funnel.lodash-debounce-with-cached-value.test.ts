/* eslint-disable @typescript-eslint/explicit-function-return-type --
 * These aren't useful for a reference implementation for a legacy library!
 */

import { describe, expect, test, vi } from "vitest";
import { sleep } from "../test/sleep";
import { constant } from "./constant";
import { identity } from "./identity";

// Copy everything between the REFERENCE START and REFERENCE END markers into
// your project.
// --- REFERENCE START -------------------------------------------------------
import { funnel } from "remeda";

// `never` is intentional; function params are contravariant.
type StrictFunction = (...args: never) => unknown;

/**
 * A drop-in replacement for the Lodash `debounce` function, implemented on
 * top of Remeda's `funnel`. This is a more complex implementation which
 * respects Lodash's capability to track the return value of the callback
 * function; in most cases you are more likely to prefer the simpler variant
 * available in the migration docs. Whenever Lodash offered a concrete spec
 * this implementation respects it, but there might be untested use-cases that
 * would have differing runtime behaviors.
 *
 * We recommend eventually inlining the call to `funnel` and adjusting the
 * implementation to your specific needs.
 *
 * @see https://remedajs.com/migrate/lodash#debounce
 * @see Lodash Documentation: https://lodash.com/docs/4.17.15#debounce
 * @see Lodash Implementation: https://github.com/lodash/lodash/blob/4.17.21/lodash.js#L10372
 * @see Lodash Typing: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/lodash/common/function.d.ts#L374
 */
function debounceWithCachedValue<F extends StrictFunction>(
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
      // @ts-expect-error [ts2345, ts2322] -- TypeScript infers the generic sub-
      // types too eagerly, making itself blind to the fact that the types
      // match here.
      cachedValue = func(...args);
    },
    {
      // Debounce stores the latest args it was called with for the next
      // invocation of the callback.
      reducer: (_, ...args: Parameters<F>) => args,
      minQuietPeriodMs: wait,
      ...(maxWait !== undefined && { maxBurstDurationMs: maxWait }),
      ...(trailing
        ? leading
          ? { triggerAt: "both" }
          : { triggerAt: "end" }
        : { triggerAt: "start" }),
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
// --- REFERENCE END ---------------------------------------------------------

// The following tests are based on the Lodash tests for debounce
// (https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L4187). They
// have been adapted to work with our testing framework, have been fixed or
// expanded slightly where it felt necessary, and have been modernized for
// better readability. The names of the test cases have been preserved to ease
// comparing them to the original tests. Tests that are unrelated to the cache
// capability have been removed to avoid duplication with the other test file.

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter (but the larger it is,
// the longer the tests would take to run); the value used by Lodash is 32.
// The number is in milliseconds.
const UT = 16;

describe("https://github.com/lodash/lodash/blob/4.17.21/test/test.js#L4187", () => {
  test("should debounce a function", async () => {
    const mockFn = vi.fn<(x: string) => string>(identity());
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

  test("subsequent debounced calls return the last `func` result", async () => {
    const debounced = debounceWithCachedValue(identity(), UT);
    debounced("a");
    await sleep(2 * UT);

    expect(debounced("b")).not.toBe("b");

    await sleep(2 * UT);

    expect(debounced("c")).not.toBe("c");
  });

  test("subsequent leading debounced calls return the last `func` result", async () => {
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

  test("should invoke the trailing call with the correct arguments and `this` binding", async () => {
    const DATA = {};
    const mockFn = vi.fn<(a: object, b: string) => boolean>(constant(false));

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
  test("should reset `lastCalled` after cancelling", async () => {
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

  test("should support flushing delayed calls", async () => {
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

  test("should noop `cancel` and `flush` when nothing is queued", async () => {
    const mockFn = vi.fn<() => string>(constant("hello"));
    const debounced = debounceWithCachedValue(mockFn, UT);
    debounced.cancel();

    expect(debounced.flush()).toBeUndefined();

    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});

describe("features not tested by Lodash", () => {
  test("does nothing when neither leading nor trailing are enabled", async () => {
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
