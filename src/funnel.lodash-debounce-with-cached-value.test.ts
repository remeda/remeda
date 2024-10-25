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
 * @see Lodash Implementation: https://github.com/lodash/lodash/blob/v5-wip/src/debounce.ts
 * @see Lodash Tests: https://github.com/lodash/lodash/blob/v5-wip/test/debounce.spec.js
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

  const debouncer = funnel(
    (_, ...args: Parameters<F>) => args,
    (args) => {
      cachedValue = func(...args) as ReturnType<F>;
    },
    {
      burstCoolDownMs: wait,
      ...(maxWait !== undefined && { maxBurstDurationMs: maxWait }),
      invokedAt: trailing ? (leading ? "both" : "end") : "start",
    },
  );

  return {
    call: (...args: Parameters<F>): ReturnType<F> | undefined => {
      debouncer.call(...args);
      return cachedValue;
    },

    flush: () => {
      debouncer.flush();
      return cachedValue;
    },

    cancel: debouncer.cancel,

    get cachedValue() {
      return cachedValue;
    },

    get isIdle() {
      return debouncer.isIdle;
    },
  };
}

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter (but the larger it is,
// the longer the tests would take to run); the value used by Lodash is 32.
// The number is in milliseconds.
const UT = 16;

// @see https://github.com/lodash/lodash/blob/v5-wip/test/debounce.spec.js
describe("Lodash: test/debounce.spec.js", () => {
  it("should debounce a function", async () => {
    const debounced = debounceWithCachedValue(identity(), UT);

    expect(debounced.call("a")).toBeUndefined();
    expect(debounced.call("b")).toBeUndefined();
    expect(debounced.call("c")).toBeUndefined();

    await sleep(4 * UT);

    expect(debounced.call("d")).toBe("c");
    expect(debounced.call("e")).toBe("c");
    expect(debounced.call("f")).toBe("c");
  });

  it("subsequent debounced calls return the last `func` result", async () => {
    const debounced = debounceWithCachedValue(identity(), UT);
    debounced.call("a");

    await sleep(2 * UT);

    expect(debounced.call("b")).not.toBe("b");

    await sleep(2 * UT);

    expect(debounced.call("c")).not.toBe("c");
  });

  it("subsequent leading debounced calls return the last `func` result", async () => {
    const debounced = debounceWithCachedValue(identity(), UT, {
      leading: true,
      trailing: false,
    });

    expect(debounced.call("a")).toBe("a");
    expect(debounced.call("b")).toBe("a");

    await sleep(2 * UT);

    expect(debounced.call("c")).toBe("c");
    expect(debounced.call("d")).toBe("c");
  });

  it("should invoke the trailing call with the correct arguments and `this` binding", async () => {
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

    while (debounced.call() ?? true) {
      // eslint-disable-next-line no-await-in-loop -- We sleep to yield execution so that the timeouts in the debouncer have a chance to run.
      await sleep(0);
    }
    await sleep(2 * UT);

    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

describe("Features not tested by Lodash", () => {
  describe("cancel", () => {
    it("can cancel before the timer starts", async () => {
      const debouncer = debounceWithCachedValue(identity(), UT);

      expect(() => {
        debouncer.cancel();
      }).not.toThrow();

      expect(debouncer.call("hello")).toBeUndefined();

      await sleep(UT);

      expect(debouncer.call("world")).toBe("hello");
    });

    it("can cancel the timer", async () => {
      const debouncer = debounceWithCachedValue(constant("Hello, World!"), UT);

      expect(debouncer.call()).toBeUndefined();

      await sleep(1);

      expect(debouncer.call()).toBeUndefined();

      debouncer.cancel();

      await sleep(UT);

      expect(debouncer.call()).toBeUndefined();

      await sleep(UT);

      expect(debouncer.call()).toBe("Hello, World!");
    });

    it("can cancel after the timer ends", async () => {
      const debouncer = debounceWithCachedValue(identity(), UT);

      expect(debouncer.call("hello")).toBeUndefined();

      await sleep(UT);

      expect(debouncer.call("world")).toBe("hello");
      expect(() => {
        debouncer.cancel();
      }).not.toThrow();
    });
  });

  describe("cachedValue", () => {
    it("can return a cached value", () => {
      const debouncer = debounceWithCachedValue(identity(), UT, {
        leading: true,
        trailing: false,
      });

      expect(debouncer.cachedValue).toBeUndefined();
      expect(debouncer.call("hello")).toBe("hello");
      expect(debouncer.cachedValue).toBe("hello");
    });
  });

  describe("isIdle", () => {
    it("can check for inflight timers (leading)", async () => {
      const debouncer = debounceWithCachedValue(identity(), UT, {
        leading: true,
        trailing: false,
      });

      expect(debouncer.isIdle).toBe(true);

      expect(debouncer.call("hello")).toBe("hello");
      expect(debouncer.isIdle).toBe(false);

      await sleep(1);

      expect(debouncer.isIdle).toBe(false);

      await sleep(UT);

      expect(debouncer.isIdle).toBe(true);
    });
  });

  describe("flush", () => {
    it("can flush before a cool-down", async () => {
      const debouncer = debounceWithCachedValue(identity(), UT);

      expect(debouncer.flush()).toBeUndefined();

      expect(debouncer.call("hello")).toBeUndefined();

      await sleep(UT);

      expect(debouncer.call("world")).toBe("hello");
    });

    it("can flush during a cool-down", async () => {
      const debouncer = debounceWithCachedValue(identity(), UT);

      expect(debouncer.call("hello")).toBeUndefined();

      await sleep(1);

      expect(debouncer.call("world")).toBeUndefined();

      await sleep(1);

      expect(debouncer.flush()).toBe("world");
    });

    it("can flush after a cool-down", async () => {
      const debouncer = debounceWithCachedValue(identity(), UT);

      expect(debouncer.call("hello")).toBeUndefined();

      await sleep(UT);

      expect(debouncer.flush()).toBe("hello");
    });
  });
});
