/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-parameters */

import { sleep } from "../test/sleep";
import { doNothing } from "./doNothing";
import { funnel } from "./funnel";
import { identity } from "./identity";

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
  funnel((_, ...args: ReadonlyArray<unknown>) => args, func, {
    burstCoolDownMs: wait,
    ...(maxWait !== undefined && { maxBurstDurationMs: maxWait }),
    invokedAt: trailing ? (leading ? "both" : "end") : "start",
  });

describe("Main functionality", () => {
  it("should debounce a function", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, 32);

    debouncer.call("a");
    debouncer.call("b");
    debouncer.call("c");
    expect(mockFn).not.toHaveBeenCalled();

    await sleep(128);

    expect(mockFn).toHaveBeenCalledTimes(1);
    debouncer.call("d");
    debouncer.call("e");
    debouncer.call("f");
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

    debouncer.call("a");
    debouncer.call("b");
    expect(mockFn).not.toHaveBeenCalled();

    await sleep(128);
    expect(mockFn).toHaveBeenCalledTimes(1);
    debouncer.call("c");
    debouncer.call("d");
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
    debouncer.call("hello");
    await sleep(32);

    debouncer.call("world");
    expect(() => {
      debouncer.cancel();
    }).not.toThrow();
  });

  it("can check for inflight timers (trailing)", async () => {
    const debouncer = debounce(doNothing(), 32);
    expect(debouncer.isIdle).toBe(true);

    debouncer.call("hello");
    expect(debouncer.isIdle).toBe(false);

    await sleep(1);
    expect(debouncer.isIdle).toBe(false);

    await sleep(32);
    expect(debouncer.isIdle).toBe(true);
  });

  it("can check for inflight timers (leading)", async () => {
    const debouncer = debounce(identity(), 32, {
      leading: true,
      trailing: false,
    });
    expect(debouncer.isIdle).toBe(true);

    debouncer.call("hello");
    expect(debouncer.isIdle).toBe(false);

    await sleep(1);
    expect(debouncer.isIdle).toBe(false);

    await sleep(32);
    expect(debouncer.isIdle).toBe(true);
  });
});
