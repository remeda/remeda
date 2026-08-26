import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { isNullish } from "./isNullish";
import { isNumber } from "./isNumber";
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
});

describe("predicate wider than the item", () => {
  test("data-first", () => {
    expectTypeOf(
      takeLastWhile([] as (string | null)[], isNullish),
    ).toEqualTypeOf<null[]>();
  });

  test("data-last", () => {
    expectTypeOf(
      pipe([] as (string | null)[], takeLastWhile(isNullish)),
    ).toEqualTypeOf<null[]>();
  });
});

test("predicate disjoint from the item", () => {
  expectTypeOf(takeLastWhile([] as string[], isNullish)).toEqualTypeOf<
    never[]
  >();
});
