import { describe, expect, test } from "vitest";
import { purry1, purry2, purry3 } from "./purryByArity";

describe("data-first from the arity on", () => {
  test("purry1", () => {
    expect(
      purry1(collectArguments, 1 /* argumentsLength */, "data"),
    ).toStrictEqual(["data"]);
  });

  test("purry1, undefined data is still data-first", () => {
    expect(
      purry1(collectArguments, 1 /* argumentsLength */, undefined),
    ).toStrictEqual([undefined]);
  });

  test("purry2, an undefined argument is still data-first", () => {
    expect(
      purry2(collectArguments, 2 /* argumentsLength */, "data", undefined),
    ).toStrictEqual(["data", undefined]);
  });

  test("purry3, undefined arguments are still data-first", () => {
    expect(
      purry3(
        collectArguments,
        3 /* argumentsLength */,
        "data",
        undefined,
        undefined,
      ),
    ).toStrictEqual(["data", undefined, undefined]);
  });

  test("purry1, more arguments than its arity", () => {
    expect(
      purry1(collectArguments, 2 /* argumentsLength */, "data"),
    ).toStrictEqual(["data"]);
  });

  test("purry2, more arguments than its arity", () => {
    expect(
      purry2(collectArguments, 3 /* argumentsLength */, "data", 1),
    ).toStrictEqual(["data", 1]);
  });

  test("purry3, more arguments than its arity", () => {
    expect(
      purry3(collectArguments, 4 /* argumentsLength */, "data", 1, 2),
    ).toStrictEqual(["data", 1, 2]);
  });
});

describe("data-last below the arity", () => {
  test("purry1, the implementation itself", () => {
    expect(purry1(collectArguments, 0 /* argumentsLength */, undefined)).toBe(
      collectArguments,
    );
  });

  describe(purry2, () => {
    test("declares a single parameter", () => {
      const dataLast = purry2(
        collectArguments,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(dataLast).toHaveLength(1);
    });

    test("passes the data and the argument", () => {
      const dataLast = purry2(
        collectArguments,
        1 /* argumentsLength */,
        1,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(
        typeof dataLast === "function" &&
          dataLast(
            "data",
            // @ts-expect-error [ts2554] -- Intentional! A point-free caller passes extra arguments (`map` passes the index and the array), which the data-last function must not forward.
            "extra",
          ),
      ).toStrictEqual(["data", 1]);
    });
  });

  describe(purry3, () => {
    test("declares a single parameter", () => {
      const dataLast = purry3(
        collectArguments,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(dataLast).toHaveLength(1);
    });

    test("passes the data and both arguments", () => {
      const dataLast = purry3(
        collectArguments,
        2 /* argumentsLength */,
        1,
        2,
        undefined,
      );

      expect(dataLast).toBeTypeOf("function");
      expect(
        typeof dataLast === "function" &&
          dataLast(
            "data",
            // @ts-expect-error [ts2554] -- Intentional! A point-free caller passes extra arguments (`map` passes the index and the array), which the data-last function must not forward.
            "extra",
          ),
      ).toStrictEqual(["data", 1, 2]);
    });
  });
});

const collectArguments = (...args: readonly unknown[]): readonly unknown[] =>
  args;
