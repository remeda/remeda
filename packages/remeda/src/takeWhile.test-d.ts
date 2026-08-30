import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { isNumber } from "./isNumber";
import { pipe } from "./pipe";
import { takeWhile } from "./takeWhile";
import { isNullish } from "./isNullish";

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
});
