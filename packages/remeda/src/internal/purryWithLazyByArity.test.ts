import { describe, expect, test } from "vitest";
import {
  purryWithLazy1,
  purryWithLazy2,
  purryWithLazy3,
} from "./purryWithLazyByArity";

describe("data-first from the arity on", () => {
  test("purryWithLazy1", () => {
    expect(
      purryWithLazy1(foo, lazyImplementation, 1 /* argumentsLength */, [
        "data",
      ]),
    ).toStrictEqual([["data"]]);
  });

  test("purryWithLazy2, an undefined argument is still data-first", () => {
    expect(
      purryWithLazy2(
        foo,
        lazyImplementation,
        2 /* argumentsLength */,
        ["data"],
        undefined,
      ),
    ).toStrictEqual([["data"], undefined]);
  });

  test("purryWithLazy3, extra arguments don't reach the implementation", () => {
    expect(
      purryWithLazy3(
        foo,
        lazyImplementation,
        4 /* argumentsLength */,
        ["data"],
        1,
        2,
      ),
    ).toStrictEqual([["data"], 1, 2]);
  });
});

describe("data-last below the arity", () => {
  describe(purryWithLazy1, () => {
    test("declares a single parameter", () => {
      const dataLast = purryWithLazy1(
        foo,
        lazyImplementation,
        0 /* argumentsLength */,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(dataLast).toHaveLength(1);
    });

    test("passes the data alone", () => {
      const dataLast = purryWithLazy1(
        foo,
        lazyImplementation,
        0 /* argumentsLength */,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(
        typeof dataLast === "function" &&
          dataLast(
            ["data"],
            // @ts-expect-error [ts2554] -- Intentional! what we're testing!
            "extra",
          ),
      ).toStrictEqual([["data"]]);
    });

    test("carries the lazy implementation, with no argument for it", () => {
      const dataLast = purryWithLazy1(
        foo,
        lazyImplementation,
        0 /* argumentsLength */,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(typeof dataLast === "function" && dataLast.lazy).toBe(
        lazyImplementation,
      );
      expect(
        typeof dataLast === "function" && dataLast.lazyArgument,
      ).toBeUndefined();
    });
  });

  describe(purryWithLazy2, () => {
    test("declares a single parameter", () => {
      const dataLast = purryWithLazy2(
        foo,
        lazyImplementation,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(dataLast).toHaveLength(1);
    });

    test("passes the data and the argument", () => {
      const dataLast = purryWithLazy2(
        foo,
        lazyImplementation,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(
        typeof dataLast === "function" &&
          dataLast(
            ["data"],
            // @ts-expect-error [ts2554] -- Intentional! what we're testing!
            "extra",
          ),
      ).toStrictEqual([["data"], 1]);
    });

    test("carries the lazy implementation, with the argument itself", () => {
      const dataLast = purryWithLazy2(
        foo,
        lazyImplementation,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(typeof dataLast === "function" && dataLast.lazy).toBe(
        lazyImplementation,
      );
      expect(typeof dataLast === "function" && dataLast.lazyArgument).toBe(1);
    });
  });

  describe(purryWithLazy3, () => {
    test("declares a single parameter", () => {
      const dataLast = purryWithLazy3(
        foo,
        lazyImplementation,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(dataLast).toHaveLength(1);
    });

    test("passes the data and both arguments", () => {
      const dataLast = purryWithLazy3(
        foo,
        lazyImplementation,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(
        typeof dataLast === "function" &&
          dataLast(
            ["data"],
            // @ts-expect-error [ts2554] -- Intentional! what we're testing!
            "extra",
          ),
      ).toStrictEqual([["data"], 1, 2]);
    });

    test("carries the lazy implementation, with the arguments as a tuple", () => {
      const dataLast = purryWithLazy3(
        foo,
        lazyImplementation,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(typeof dataLast === "function" && dataLast.lazy).toBe(
        lazyImplementation,
      );
      expect(
        typeof dataLast === "function" && dataLast.lazyArgument,
      ).toStrictEqual([1, 2]);
    });
  });
});

const foo = (
  ...args: readonly [readonly unknown[], ...(readonly unknown[])]
): readonly unknown[] => args;

function lazyImplementation(): never {
  throw new Error("Intentional! we don't run the evaluator in these tests");
}
