import { debounce } from "./debounce";
import { identity } from "./identity";

describe("Main functionality", () => {
  it("should debounce a function", async () => {
    const mockFn = vi.fn(identity);

    const debouncer = debounce(mockFn, { waitMs: 32 });

    expect([
      debouncer.call("a"),
      debouncer.call("b"),
      debouncer.call("c"),
    ]).toEqual([undefined, undefined, undefined]);
    expect(mockFn).toBeCalledTimes(0);

    await sleep(128);

    expect(mockFn).toBeCalledTimes(1);
    expect([
      debouncer.call("d"),
      debouncer.call("e"),
      debouncer.call("f"),
    ]).toEqual(["c", "c", "c"]);
    expect(mockFn).toBeCalledTimes(1);

    await sleep(256);

    expect(mockFn).toBeCalledTimes(2);
  });

  it("subsequent debounced calls return the last `func` result", async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    debouncer.call("a");

    await sleep(64);
    expect(debouncer.call("b")).toEqual("a");

    await sleep(128);
    expect(debouncer.call("c")).toEqual("b");
  });

  it("should not immediately call `func` when `wait` is `0`", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, {});

    debouncer.call();
    debouncer.call();
    expect(mockFn).toBeCalledTimes(0);

    await sleep(5);
    expect(mockFn).toBeCalledTimes(1);
  });

  it("should apply default options", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, { waitMs: 32 });

    debouncer.call();
    expect(mockFn).toBeCalledTimes(0);

    await sleep(64);
    expect(mockFn).toBeCalledTimes(1);
  });

  it("should support a `leading` option", async () => {
    const leadingMockFn = vi.fn();
    const bothMockFn = vi.fn();

    const withLeading = debounce(leadingMockFn, {
      waitMs: 32,
      timing: "leading",
    });

    withLeading.call();
    expect(leadingMockFn).toBeCalledTimes(1);

    const withLeadingAndTrailing = debounce(bothMockFn, {
      waitMs: 32,
      timing: "both",
    });

    withLeadingAndTrailing.call();
    withLeadingAndTrailing.call();
    expect(bothMockFn).toBeCalledTimes(1);

    await sleep(64);
    expect(bothMockFn).toBeCalledTimes(2);

    withLeading.call();
    expect(leadingMockFn).toBeCalledTimes(2);
  });

  it("subsequent leading debounced calls return the last `func` result", async () => {
    const debouncer = debounce(identity, { waitMs: 32, timing: "leading" });

    expect([debouncer.call("a"), debouncer.call("b")]).toEqual(["a", "a"]);

    await sleep(64);
    expect([debouncer.call("c"), debouncer.call("d")]).toEqual(["c", "c"]);
  });

  it("should support a `trailing` option", async () => {
    const mockFn = vi.fn();

    const withTrailing = debounce(mockFn, { waitMs: 32, timing: "trailing" });

    withTrailing.call();
    expect(mockFn).toBeCalledTimes(0);

    await sleep(64);
    expect(mockFn).toBeCalledTimes(1);
  });
});

describe("Optional param maxWaitMs", () => {
  it("should support a `maxWait` option", async () => {
    const mockFn = vi.fn(identity);

    const debouncer = debounce(mockFn, { waitMs: 32, maxWaitMs: 64 });

    debouncer.call("a");
    debouncer.call("b");
    expect(mockFn).toBeCalledTimes(0);

    await sleep(128);
    expect(mockFn).toBeCalledTimes(1);
    debouncer.call("c");
    debouncer.call("d");
    expect(mockFn).toBeCalledTimes(1);

    await sleep(256);
    expect(mockFn).toBeCalledTimes(2);
  });

  it("should support `maxWait` in a tight loop", async () => {
    const withMockFn = vi.fn();
    const withoutMockFn = vi.fn();

    const withMaxWait = debounce(withMockFn, { waitMs: 32, maxWaitMs: 128 });
    const withoutMaxWait = debounce(withoutMockFn, { waitMs: 96 });

    const start = Date.now();
    while (Date.now() - start < 320) {
      withMaxWait.call();
      withoutMaxWait.call();
    }

    await sleep(1);
    expect(withoutMockFn).toBeCalledTimes(0);
    expect(withMockFn).not.toBeCalledTimes(0);
  });

  it("should queue a trailing call for subsequent debounced calls after `maxWait`", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, { waitMs: 200, maxWaitMs: 200 });

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
    expect(mockFn).toBeCalledTimes(2);
  });

  it("should cancel `maxDelayed` when `delayed` is invoked", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, { waitMs: 32, maxWaitMs: 64 });

    debouncer.call();

    await sleep(128);
    debouncer.call();
    expect(mockFn).toBeCalledTimes(1);

    await sleep(192);
    expect(mockFn).toBeCalledTimes(2);
  });

  it("works like a leaky bucket when only maxWaitMs is set", async () => {
    const mockFn = vi.fn();

    const debouncer = debounce(mockFn, { maxWaitMs: 32 });

    debouncer.call();
    expect(mockFn).toBeCalledTimes(0);

    await sleep(16);

    // Without maxWaitMs this call would cause the actual invocation to be
    // postponed for a full window.
    debouncer.call();
    expect(mockFn).toBeCalledTimes(0);

    await sleep(17);
    expect(mockFn).toBeCalledTimes(1);
  });
});

describe("Additional functionality", () => {
  it("can cancel before the timer starts", async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(() => {
      debouncer.cancel();
    }).not.toThrow();

    expect(debouncer.call("hello")).toBeUndefined();
    await sleep(32);

    expect(debouncer.call("world")).toEqual("hello");
  });

  it("can cancel the timer", async () => {
    const data = "Hello, World!";
    const mockFn = vi.fn(() => data);
    const debouncer = debounce(mockFn, { waitMs: 32 });

    expect(debouncer.call()).toBeUndefined();
    expect(mockFn).toBeCalledTimes(0);

    await sleep(1);
    expect(debouncer.call()).toBeUndefined();
    expect(mockFn).toBeCalledTimes(0);
    debouncer.cancel();

    await sleep(32);
    expect(debouncer.call()).toBeUndefined();
    expect(mockFn).toBeCalledTimes(0);

    await sleep(32);
    expect(debouncer.call()).toEqual(data);
    expect(mockFn).toBeCalledTimes(1);
  });

  it("can cancel after the timer ends", async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.call("hello")).toBeUndefined();
    await sleep(32);

    expect(debouncer.call("world")).toEqual("hello");
    expect(() => {
      debouncer.cancel();
    }).not.toThrow();
  });

  it("can cancel maxWait timer", async () => {
    const debouncer = debounce(identity, { waitMs: 16, maxWaitMs: 32 });
    expect(debouncer.call("hello")).toBeUndefined();

    await sleep(1);
    debouncer.cancel();

    await sleep(32);
    expect(debouncer.call("world")).toBeUndefined();
  });

  it("can return a cached value", () => {
    const debouncer = debounce(identity, { timing: "leading", waitMs: 32 });
    expect(debouncer.cachedValue).toBeUndefined();
    expect(debouncer.call("hello")).toEqual("hello");
    expect(debouncer.cachedValue).toEqual("hello");
  });

  it("can check for inflight timers (trailing)", async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.isPending).toEqual(false);

    expect(debouncer.call("hello")).toBeUndefined();
    expect(debouncer.isPending).toEqual(true);

    await sleep(1);
    expect(debouncer.isPending).toEqual(true);

    await sleep(32);
    expect(debouncer.isPending).toEqual(false);
  });

  it("can check for inflight timers (trailing)", async () => {
    const debouncer = debounce(identity, { timing: "leading", waitMs: 32 });
    expect(debouncer.isPending).toEqual(false);

    expect(debouncer.call("hello")).toEqual("hello");
    expect(debouncer.isPending).toEqual(true);

    await sleep(1);
    expect(debouncer.isPending).toEqual(true);

    await sleep(32);
    expect(debouncer.isPending).toEqual(false);
  });

  it("can flush before a cool-down", async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.flush()).toBeUndefined();

    expect(debouncer.call("hello")).toBeUndefined();
    await sleep(32);

    expect(debouncer.call("world")).toEqual("hello");
  });

  it("can flush during a cool-down", async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.call("hello")).toBeUndefined();

    await sleep(1);
    expect(debouncer.call("world")).toBeUndefined();

    await sleep(1);
    expect(debouncer.flush()).toEqual("world");
  });

  it("can flush after a cool-down", async () => {
    const debouncer = debounce(identity, { waitMs: 32 });
    expect(debouncer.call("hello")).toBeUndefined();

    await sleep(32);
    expect(debouncer.flush()).toEqual("hello");
  });
});

describe("errors", () => {
  it("prevents maxWaitMs to be less then waitMs", () => {
    expect(() => debounce(identity, { waitMs: 32, maxWaitMs: 16 })).toThrow();
  });
});

describe("typing", () => {
  it("returns undefined on 'trailing' timing", () => {
    const debouncer = debounce(() => "Hello, World!", {
      waitMs: 32,
      timing: "trailing",
    });
    const result = debouncer.call();
    expectTypeOf(result).toEqualTypeOf<string | undefined>();
  });

  it("doesn't return undefined on 'leading' timing", () => {
    const debouncer = debounce(() => "Hello, World!", {
      waitMs: 32,
      timing: "leading",
    });
    const result = debouncer.call();
    expectTypeOf(result).toEqualTypeOf<string>();
  });

  it("doesn't return undefined on 'both' timing", () => {
    const debouncer = debounce(() => "Hello, World!", {
      waitMs: 32,
      timing: "both",
    });
    const result = debouncer.call();
    expectTypeOf(result).toEqualTypeOf<string>();
  });

  test("argument typing to be good (all required)", () => {
    const debouncer = debounce(
      (a: string, b: number, c: boolean) => `${a}${b}${c}`,
      {},
    );
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 0.
    debouncer.call();
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
    debouncer.call("a");
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 2.
    debouncer.call("a", 1);

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true, 1, true);

    // All good
    debouncer.call("a", 1, true);
  });

  test("argument typing to be good (with optional)", () => {
    const debouncer = debounce(
      (a: string, b?: number, c?: boolean) => `${a}${b}${c}`,
      {},
    );
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
    debouncer.call();

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true, 1, true);

    // All good
    debouncer.call("a");
    debouncer.call("a", 1);
    debouncer.call("a", 1, true);
  });

  test("argument typing to be good (with defaults)", () => {
    const debouncer = debounce(
      (a: string, b = 2, c = true) => `${a}${b}${c}`,
      {},
    );
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
    debouncer.call();

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true, 1, true);

    // All good
    debouncer.call("a");
    debouncer.call("a", 1);
    debouncer.call("a", 1, true);
  });

  test("argument typing to be good (with rest param)", async () => {
    const debouncer = debounce(
      (a: string, ...flags: ReadonlyArray<boolean>) =>
        `${a}${flags.map((flag) => (flag ? "y" : "n")).join()}`,
      { timing: "leading" },
    );
    // @ts-expect-error [ts2554]: Expected 3 arguments, but got 1.
    debouncer.call();

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true);

    // @ts-expect-error [ts2354]: string instead of boolean
    debouncer.call("a", "b");

    // @ts-expect-error [ts2354]: boolean instead of string
    debouncer.call(true, "b");

    // All good
    debouncer.call("a");
    debouncer.call("a", true);
    debouncer.call("a", true, false);

    await sleep(64);

    expect(
      debouncer.call("a", true, true, false, false, true, false, true),
    ).toEqual("ay,y,n,n,y,n,y");
  });

  it("doesn't accept maxWaitMs when timing is 'leading'", () => {
    debounce(identity, { timing: "trailing", maxWaitMs: 32 });
    debounce(identity, { timing: "both", maxWaitMs: 32 });
    // @ts-expect-error [ts2769]: maxWaitMs not supported!
    debounce(identity, { timing: "leading", maxWaitMs: 32 });
  });
});

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
