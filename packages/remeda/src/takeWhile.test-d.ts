import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { isNumber } from "./isNumber";
import { pipe } from "./pipe";
import { takeWhile } from "./takeWhile";

describe("data-first", () => {
  test("empty array", () => {
    const result = takeWhile([] as [], constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  test("regular array", () => {
    const result = takeWhile([] as Array<number>, constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = takeWhile([] as Array<number | string>, constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = takeWhile(
      [1] as [number, ...Array<boolean>],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = takeWhile(
      [1] as [...Array<boolean>, number],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = takeWhile(
      [1, "a"] as [number, ...Array<boolean>, string],
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = takeWhile([1, "a", true] as const, constant(true));

    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = takeWhile(
      [] as Array<boolean> | Array<string>,
      constant(true),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });

  test("assert type using predicate", () => {
    const result = takeWhile([1, "a"], isNumber);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], takeWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  test("regular array", () => {
    const result = pipe([] as Array<number>, takeWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = pipe(
      [] as Array<number | string>,
      takeWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = pipe(
      [1] as [number, ...Array<boolean>],
      takeWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = pipe(
      [1] as [...Array<boolean>, number],
      takeWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...Array<boolean>, string],
      takeWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, takeWhile(constant(true)));

    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = pipe(
      [] as Array<boolean> | Array<string>,
      takeWhile(constant(true)),
    );

    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });

  test("assert type using predicate", () => {
    const result = pipe([1, "a"], takeWhile(isNumber));

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
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
        [] as Array<number>,
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<number>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<Array<number>>();

          return true;
        }),
      );
    });

    test("regular array with union type", () => {
      pipe(
        [] as Array<number | string>,
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<number | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<Array<number | string>>();

          return true;
        }),
      );
    });

    test("prefix array", () => {
      pipe(
        [1] as [number, ...Array<boolean>],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | number>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[number, ...Array<boolean>]>();

          return true;
        }),
      );
    });

    test("suffix array", () => {
      pipe(
        [1] as [...Array<boolean>, number],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | number>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<[...Array<boolean>, number]>();

          return true;
        }),
      );
    });

    test("array with suffix and prefix", () => {
      pipe(
        [1, "a"] as [number, ...Array<boolean>, string],
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | number | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<
            [number, ...Array<boolean>, string]
          >();

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
        [] as Array<boolean> | Array<string>,
        takeWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<Array<boolean> | Array<string>>();

          return true;
        }),
      );
    });
  });
});
