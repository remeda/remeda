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
import { takeLastWhile } from "./takeLastWhile";

describe("data-first", () => {
  test("empty array", () => {
    expectTypeOf(takeLastWhile([] as [], constant(true))).toEqualTypeOf<
      never[]
    >();
  });

  test("regular array", () => {
    expectTypeOf(takeLastWhile([] as number[], constant(true))).toEqualTypeOf<
      number[]
    >();
  });

  test("regular array with union type", () => {
    expectTypeOf(
      takeLastWhile([] as (number | string)[], constant(true)),
    ).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    expectTypeOf(
      takeLastWhile([1] as [number, ...boolean[]], constant(true)),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    expectTypeOf(
      takeLastWhile([1] as [...boolean[], number], constant(true)),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    expectTypeOf(
      takeLastWhile([1, "a"] as [number, ...boolean[], string], constant(true)),
    ).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    expectTypeOf(
      takeLastWhile([1, "a", true] as const, constant(true)),
    ).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    expectTypeOf(
      takeLastWhile([] as boolean[] | string[], constant(true)),
    ).toEqualTypeOf<(boolean | string)[]>();
  });

  test("assert type using predicate", () => {
    expectTypeOf(takeLastWhile([1, "a"], isNumber)).toEqualTypeOf<number[]>();
  });

  test("guard on a tuple", () => {
    expectTypeOf(
      takeLastWhile([1, "a", true] as const, isNumber),
    ).toEqualTypeOf<1[]>();
  });

  test("guard on a union of arrays", () => {
    expectTypeOf(
      takeLastWhile([] as string[] | number[], isString),
    ).toEqualTypeOf<string[]>();
  });

  test("predicate is typed correctly", () => {
    takeLastWhile([] as (number | string)[], (item, index, array) => {
      expectTypeOf(item).toEqualTypeOf<number | string>();
      expectTypeOf(index).toEqualTypeOf<number>();
      expectTypeOf(array).toEqualTypeOf<(number | string)[]>();

      return true;
    });
  });

  test("predicate wider than the item", () => {
    expectTypeOf(
      takeLastWhile([] as (string | null)[], isNullish),
    ).toEqualTypeOf<null[]>();
  });

  test("predicate disjoint from the item", () => {
    expectTypeOf(takeLastWhile([] as string[], isNullish)).toEqualTypeOf<
      never[]
    >();
  });

  test("generic guard", () => {
    expectTypeOf(
      takeLastWhile(["a", 0] as (string | 0)[], isTruthy),
    ).toEqualTypeOf<string[]>();
  });

  test("negated guard", () => {
    expectTypeOf(
      takeLastWhile([1, "a"] as (number | string)[], isNot(isString)),
    ).toEqualTypeOf<number[]>();
  });

  test("guard incomparable to the item", () => {
    expectTypeOf(takeLastWhile([] as Cat[], isLegged)).toEqualTypeOf<
      (Cat & Legged)[]
    >();
  });

  test("object guard sharing no keys with the item", () => {
    expectTypeOf(takeLastWhile([] as Cat[], isNamed)).toEqualTypeOf<
      (Cat & Named)[]
    >();
  });

  test("`any` data", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      takeLastWhile([] as any[], isString),
    ).toEqualTypeOf<string[]>();
  });

  test("`unknown` data", () => {
    expectTypeOf(takeLastWhile([] as unknown[], isString)).toEqualTypeOf<
      string[]
    >();
  });

  test("predicate with a mismatched param is an error", () => {
    // @ts-expect-error [ts2769] -- The predicate must accept the item type.
    takeLastWhile([] as number[], (x: string) => x.length > 0);
  });
});

describe("data-last", () => {
  test("empty array", () => {
    expectTypeOf(pipe([] as [], takeLastWhile(constant(true)))).toEqualTypeOf<
      never[]
    >();
  });

  test("regular array", () => {
    expectTypeOf(
      pipe([] as number[], takeLastWhile(constant(true))),
    ).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    expectTypeOf(
      pipe([] as (number | string)[], takeLastWhile(constant(true))),
    ).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    expectTypeOf(
      pipe([1] as [number, ...boolean[]], takeLastWhile(constant(true))),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    expectTypeOf(
      pipe([1] as [...boolean[], number], takeLastWhile(constant(true))),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    expectTypeOf(
      pipe(
        [1, "a"] as [number, ...boolean[], string],
        takeLastWhile(constant(true)),
      ),
    ).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    expectTypeOf(
      pipe([1, "a", true] as const, takeLastWhile(constant(true))),
    ).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    expectTypeOf(
      pipe([] as boolean[] | string[], takeLastWhile(constant(true))),
    ).toEqualTypeOf<(boolean | string)[]>();
  });

  test("assert type using predicate", () => {
    expectTypeOf(pipe([1, "a"], takeLastWhile(isNumber))).toEqualTypeOf<
      number[]
    >();
  });

  test("guard on a tuple", () => {
    expectTypeOf(
      pipe([1, "a", true] as const, takeLastWhile(isNumber)),
    ).toEqualTypeOf<1[]>();
  });

  test("guard on a union of arrays", () => {
    expectTypeOf(
      pipe([] as string[] | number[], takeLastWhile(isString)),
    ).toEqualTypeOf<string[]>();
  });

  describe("predicate is typed correctly", () => {
    test("empty array", () => {
      pipe(
        [] as [],
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
        takeLastWhile((item, index, array) => {
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
      pipe([] as (string | null)[], takeLastWhile(isNullish)),
    ).toEqualTypeOf<null[]>();
  });

  test("predicate disjoint from the item", () => {
    expectTypeOf(pipe([] as string[], takeLastWhile(isNullish))).toEqualTypeOf<
      never[]
    >();
  });

  test("generic guard", () => {
    expectTypeOf(
      pipe(["a", 0] as (string | 0)[], takeLastWhile(isTruthy)),
    ).toEqualTypeOf<string[]>();
  });

  test("negated guard", () => {
    expectTypeOf(
      pipe([1, "a"] as (number | string)[], takeLastWhile(isNot(isString))),
    ).toEqualTypeOf<number[]>();
  });

  test("guard incomparable to the item", () => {
    expectTypeOf(pipe([] as Cat[], takeLastWhile(isLegged))).toEqualTypeOf<
      (Cat & Legged)[]
    >();
  });

  test("object guard sharing no keys with the item", () => {
    expectTypeOf(pipe([] as Cat[], takeLastWhile(isNamed))).toEqualTypeOf<
      (Cat & Named)[]
    >();
  });

  test("`any` data", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      pipe([] as any[], takeLastWhile(isString)),
    ).toEqualTypeOf<string[]>();
  });
});
