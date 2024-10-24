/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/explicit-function-return-type */

import { sleep } from "../test/sleep";
import { constant } from "./constant";
import { funnel } from "./funnel";
import { identity } from "./identity";

// We need some non-trivial duration to use in all our tests, to abstract the
// actual chosen value we use this UnitOfTime (UT) constant. As long as it is a
// positive integer, the actual value doesn't matter. The number represents MS.
const UT = 32;

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

  // eslint-disable-next-line vitest/no-disabled-tests -- TODO: This test might be broken because lodash is broken and the test was over-fitted to their implementation.
  it.skip("should invoke the trailing call with the correct arguments and `this` binding", async () => {
    let callCount = 0;
    const debounced = debounceWithCachedValue(
      () => {
        callCount += 1;
        return callCount > 1;
      },
      UT,
      { leading: true, maxWait: 2 * UT },
    );
    while (!(debounced.call() ?? false)) {
      // eslint-disable-next-line no-await-in-loop -- We sleep to yield execution so that the timeouts in the debouncer have a chance to run.
      await sleep(0);
    }
    await sleep(2 * UT);

    expect(callCount).toBe(2);
  });
});

describe("Features not tested by Lodash", () => {
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

  it("can return a cached value", () => {
    const debouncer = debounceWithCachedValue(identity(), UT, {
      leading: true,
      trailing: false,
    });

    expect(debouncer.cachedValue).toBeUndefined();
    expect(debouncer.call("hello")).toBe("hello");
    expect(debouncer.cachedValue).toBe("hello");
  });

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
