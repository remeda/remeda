import { describe, expectTypeOf, test } from "vitest";
import {
  isLegged,
  isNamed,
  type Cat,
  type Legged,
  type Named,
} from "../test/interfaces";
import { constant } from "./constant";
import { isNot } from "./isNot";
import { isNullish } from "./isNullish";
import { isNumber } from "./isNumber";
import { isString } from "./isString";
import { isTruthy } from "./isTruthy";
import { pipe } from "./pipe";
import { takeWhile } from "./takeWhile";

describe("data-first", () => {
  test("empty array", () => {
    expectTypeOf(takeWhile([] as [], constant(true))).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    expectTypeOf(takeWhile([] as number[], constant(true))).toEqualTypeOf<
      number[]
    >();
  });

  test("regular array with union type", () => {
    expectTypeOf(
      takeWhile([] as (number | string)[], constant(true)),
    ).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    expectTypeOf(
      takeWhile([1] as [number, ...boolean[]], constant(true)),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    expectTypeOf(
      takeWhile([1] as [...boolean[], number], constant(true)),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    expectTypeOf(
      takeWhile([1, "a"] as [number, ...boolean[], string], constant(true)),
    ).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    expectTypeOf(
      takeWhile([1, "a", true] as const, constant(true)),
    ).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    expectTypeOf(
      takeWhile([] as boolean[] | string[], constant(true)),
    ).toEqualTypeOf<(boolean | string)[]>();
  });

  test("assert type using predicate", () => {
    expectTypeOf(takeWhile([1, "a"], isNumber)).toEqualTypeOf<number[]>();
  });

  test("guard on a tuple", () => {
    expectTypeOf(takeWhile([1, "a", true] as const, isNumber)).toEqualTypeOf<
      1[]
    >();
  });

  test("guard on a union of arrays", () => {
    expectTypeOf(takeWhile([] as string[] | number[], isString)).toEqualTypeOf<
      string[]
    >();
  });

  test("predicate is typed correctly", () => {
    takeWhile([] as (number | string)[], (item, index, array) => {
      expectTypeOf(item).toEqualTypeOf<number | string>();
      expectTypeOf(index).toEqualTypeOf<number>();
      expectTypeOf(array).toEqualTypeOf<(number | string)[]>();

      return true;
    });
  });

  test("predicate wider than the item", () => {
    expectTypeOf(takeWhile([] as (string | null)[], isNullish)).toEqualTypeOf<
      null[]
    >();
  });

  test("predicate disjoint from the item", () => {
    expectTypeOf(takeWhile([] as string[], isNullish)).toEqualTypeOf<never[]>();
  });

  test("generic guard", () => {
    expectTypeOf(takeWhile(["a", 0] as (string | 0)[], isTruthy)).toEqualTypeOf<
      string[]
    >();
  });

  test("negated guard", () => {
    expectTypeOf(
      takeWhile([1, "a"] as (number | string)[], isNot(isString)),
    ).toEqualTypeOf<number[]>();
  });

  test("guard incomparable to the item", () => {
    expectTypeOf(takeWhile([] as Cat[], isLegged)).toEqualTypeOf<
      (Cat & Legged)[]
    >();
  });

  test("object guard sharing no keys with the item", () => {
    expectTypeOf(takeWhile([] as Cat[], isNamed)).toEqualTypeOf<
      (Cat & Named)[]
    >();
  });

  test("`any` data", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      takeWhile([] as any[], isString),
    ).toEqualTypeOf<string[]>();
  });

  test("`unknown` data", () => {
    expectTypeOf(takeWhile([] as unknown[], isString)).toEqualTypeOf<
      string[]
    >();
  });

  test("predicate with a mismatched param is an error", () => {
    // @ts-expect-error [ts2769] -- The predicate must accept the item type.
    takeWhile([] as number[], (x: string) => x.length > 0);
  });
});

describe("data-last", () => {
  test("empty array", () => {
    expectTypeOf(pipe([] as [], takeWhile(constant(true)))).toEqualTypeOf<
      never[]
    >();
  });

  test("regular array", () => {
    expectTypeOf(pipe([] as number[], takeWhile(constant(true)))).toEqualTypeOf<
      number[]
    >();
  });

  test("regular array with union type", () => {
    expectTypeOf(
      pipe([] as (number | string)[], takeWhile(constant(true))),
    ).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    expectTypeOf(
      pipe([1] as [number, ...boolean[]], takeWhile(constant(true))),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    expectTypeOf(
      pipe([1] as [...boolean[], number], takeWhile(constant(true))),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    expectTypeOf(
      pipe(
        [1, "a"] as [number, ...boolean[], string],
        takeWhile(constant(true)),
      ),
    ).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    expectTypeOf(
      pipe([1, "a", true] as const, takeWhile(constant(true))),
    ).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    expectTypeOf(
      pipe([] as boolean[] | string[], takeWhile(constant(true))),
    ).toEqualTypeOf<(boolean | string)[]>();
  });

  test("assert type using predicate", () => {
    expectTypeOf(pipe([1, "a"], takeWhile(isNumber))).toEqualTypeOf<number[]>();
  });

  test("guard on a tuple", () => {
    expectTypeOf(
      pipe([1, "a", true] as const, takeWhile(isNumber)),
    ).toEqualTypeOf<1[]>();
  });

  test("guard on a union of arrays", () => {
    expectTypeOf(
      pipe([] as string[] | number[], takeWhile(isString)),
    ).toEqualTypeOf<string[]>();
  });

  describe("predicate is typed correctly", () => {
    test("empty array", () => {
      pipe(
        [] as [],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<never>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[]>();

          return true;
        }),
      );
    });

    test("regular array", () => {
      pipe(
        [] as number[],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<number>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<number[]>();

          return true;
        }),
      );
    });

    test("regular array with union type", () => {
      pipe(
        [] as (number | string)[],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<number | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<(number | string)[]>();

          return true;
        }),
      );
    });

    test("prefix array", () => {
      pipe(
        [1] as [number, ...boolean[]],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | number>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[number, ...boolean[]]>();

          return true;
        }),
      );
    });

    test("suffix array", () => {
      pipe(
        [1] as [...boolean[], number],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | number>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[...boolean[], number]>();

          return true;
        }),
      );
    });

    test("array with suffix and prefix", () => {
      pipe(
        [1, "a"] as [number, ...boolean[], string],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | number | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[number, ...boolean[], string]>();

          return true;
        }),
      );
    });

    test("tuple", () => {
      pipe(
        [1, "a", true] as const,
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<"a" | 1 | true>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<readonly [1, "a", true]>();

          return true;
        }),
      );
    });

    test("union of arrays", () => {
      pipe(
        [] as boolean[] | string[],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<boolean[] | string[]>();

          return true;
        }),
      );
    });
  });

  test("predicate wider than the item", () => {
    expectTypeOf(
      pipe([] as (string | null)[], takeWhile(isNullish)),
    ).toEqualTypeOf<null[]>();
  });

  test("predicate disjoint from the item", () => {
    expectTypeOf(pipe([] as string[], takeWhile(isNullish))).toEqualTypeOf<
      never[]
    >();
  });

  test("generic guard", () => {
    expectTypeOf(
      pipe(["a", 0] as (string | 0)[], takeWhile(isTruthy)),
    ).toEqualTypeOf<string[]>();
  });

  test("negated guard", () => {
    expectTypeOf(
      pipe([1, "a"] as (number | string)[], takeWhile(isNot(isString))),
    ).toEqualTypeOf<number[]>();
  });

  test("guard incomparable to the item", () => {
    expectTypeOf(pipe([] as Cat[], takeWhile(isLegged))).toEqualTypeOf<
      (Cat & Legged)[]
    >();
  });

  test("object guard sharing no keys with the item", () => {
    expectTypeOf(pipe([] as Cat[], takeWhile(isNamed))).toEqualTypeOf<
      (Cat & Named)[]
    >();
  });

  test("`any` data", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      pipe([] as any[], takeWhile(isString)),
    ).toEqualTypeOf<string[]>();
  });
});
