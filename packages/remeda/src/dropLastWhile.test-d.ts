import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { dropLastWhile } from "./dropLastWhile";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("empty array", () => {
    const result = dropLastWhile([] as [], constant(true));

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = dropLastWhile([] as number[], constant(true));

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = dropLastWhile([] as (number | string)[], constant(true));

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = dropLastWhile([1] as [number, ...boolean[]], constant(true));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = dropLastWhile([1] as [...boolean[], number], constant(true));

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = dropLastWhile(
      [1, "a"] as [number, ...boolean[], string],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = dropLastWhile([1, "a", true] as const, constant(true));

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = dropLastWhile([] as boolean[] | string[], constant(true));

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], dropLastWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<never[]>();
  });

  test("regular array", () => {
    const result = pipe([] as number[], dropLastWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("regular array with union type", () => {
    const result = pipe(
      [] as (number | string)[],
      dropLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(number | string)[]>();
  });

  test("prefix array", () => {
    const result = pipe(
      [1] as [number, ...boolean[]],
      dropLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix array", () => {
    const result = pipe(
      [1] as [...boolean[], number],
      dropLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number)[]>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...boolean[], string],
      dropLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, dropLastWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    const result = pipe(
      [] as boolean[] | string[],
      dropLastWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<(boolean | string)[]>();
  });

  describe("predicate is typed correctly", () => {
    test("empty array", () => {
      pipe(
        [] as [],
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<boolean[] | string[]>();

          return true;
        }),
      );
    });
  });
});
