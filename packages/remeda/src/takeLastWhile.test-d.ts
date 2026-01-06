import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { isNumber } from "./isNumber";
import { pipe } from "./pipe";
import { takeLastWhile } from "./takeLastWhile";

describe("data-first", () => {
  test("empty array", () => {
    const result = takeLastWhile([] as [], constant(true));

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = takeLastWhile([] as number[], constant(true));

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = takeLastWhile([] as (number | string)[], constant(true));

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = takeLastWhile([1] as [number, ...boolean[]], constant(true));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = takeLastWhile([1] as [...boolean[], number], constant(true));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = takeLastWhile(
      [1, "a"] as [number, ...boolean[], string],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = takeLastWhile([1, "a", true] as const, constant(true));

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = takeLastWhile([] as boolean[] | string[], constant(true));

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });

  test("assert type using predicate", () => {
    const result = takeLastWhile([1, "a"], isNumber);

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], takeLastWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = pipe([] as number[], takeLastWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = pipe(
      [] as (number | string)[],
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = pipe(
      [1] as [number, ...boolean[]],
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = pipe(
      [1] as [...boolean[], number],
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...boolean[], string],
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, takeLastWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = pipe(
      [] as boolean[] | string[],
      takeLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });

  test("assert type using predicate", () => {
    const result = pipe([1, "a"], takeLastWhile(isNumber));

    expectTypeOf(result).toEqualTypeOf<number[]>();
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
