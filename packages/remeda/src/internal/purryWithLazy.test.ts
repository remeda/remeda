import { describe, expect, test } from "vitest";
import type { LazyUnaryFunction } from "./lazyDataLastImplementation";
import { purryWithLazy } from "./purryWithLazy";

describe("data-first (delegated)", () => {
  test("exact number of arguments", () => {
    expect(purriedFn([13], 37)).toBe("1337");
  });

  test("excess arguments are passed through", () => {
    expect(purriedFn([1], 33, 7)).toBe("1337");
  });
});

describe("data-last (curried)", () => {
  type Curried = ((...args: readonly unknown[]) => unknown) & LazyUnaryFunction;

  describe("missing a single argument", () => {
    // @ts-expect-error [ts2322] -- `purriedFn` returns `unknown`, like the implementation signature of a utility built on `purryWithLazy`; the tests in this block assert the runtime shape this type describes.
    const curried: Curried = purriedFn(37);

    test("returns a function", () => {
      expect(curried).toBeTypeOf("function");
    });

    test("curried function declares a single parameter", () => {
      expect(curried).toHaveLength(1);
    });

    test("exact number of arguments to curried function", () => {
      expect(curried([13])).toBe("1337");
    });

    test("excess arguments to curried function are ignored", () => {
      expect(curried([1], 3)).toBe("137");
    });

    test("curried function carries the lazy implementation", () => {
      expect(curried.lazy).toBe(lazyImplementation);
    });

    test("curried function carries the arguments for the lazy implementation", () => {
      expect(curried.lazyArgs).toStrictEqual([37]);
    });
  });

  describe("missing more than one argument", () => {
    // @ts-expect-error [ts2322] -- `purriedFn` returns `unknown`, like the implementation signature of a utility built on `purryWithLazy`; the tests in this block assert the runtime shape this type describes.
    const curried: Curried = purriedFn();

    test("returns a function", () => {
      expect(curried).toBeTypeOf("function");
    });

    test("curried function declares a single parameter", () => {
      expect(curried).toHaveLength(1);
    });

    test("exact number of arguments to curried function", () => {
      expect(curried([1337])).toBe("1337<missing>");
    });

    test("excess arguments to curried function are ignored", () => {
      expect(curried([13], 37)).toBe("13<missing>");
    });

    test("curried function carries the lazy implementation", () => {
      expect(curried.lazy).toBe(lazyImplementation);
    });

    test("curried function carries the arguments for the lazy implementation", () => {
      expect(curried.lazyArgs).toStrictEqual([]);
    });
  });
});

const purriedFn = (...args: readonly unknown[]): unknown =>
  purryWithLazy(concatenateNumberArgs, 2, lazyImplementation, args);

function concatenateNumberArgs(
  data: readonly number[],
  other: number | undefined,
): string {
  return `${data.map((x) => x.toString()).join("")}${other?.toString() ?? "<missing>"}${[
    // eslint-disable-next-line prefer-rest-params -- Intentional, the declared parameters keep the fixture shaped like a real utility (so its arity type is the literal `2` that `purryWithLazy` checks), while `arguments` exposes the excess arguments it passes through, which the declared parameters would drop.
    ...arguments,
  ]
    .slice(2)
    .map((x) => (typeof x === "number" ? x.toString() : "<NaN>"))
    .join("")}`;
}

function lazyImplementation(): never {
  throw new Error("Intentional! we don't run the evaluator in these tests");
}
