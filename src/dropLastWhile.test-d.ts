import { constant } from "./constant";
import { dropLastWhile } from "./dropLastWhile";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("empty array", () => {
    const result = dropLastWhile([] as [], constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  test("regular array", () => {
    const result = dropLastWhile([] as Array<number>, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = dropLastWhile([] as Array<number | string>, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = dropLastWhile(
      [1] as [number, ...Array<boolean>],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = dropLastWhile(
      [1] as [...Array<boolean>, number],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = dropLastWhile(
      [1, "a"] as [number, ...Array<boolean>, string],
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = dropLastWhile([1, "a", true] as const, constant(true));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = dropLastWhile(
      [] as Array<boolean> | Array<string>,
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
  });
});

describe("data-last", () => {
  test("empty array", () => {
    const result = pipe([] as [], dropLastWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<never>>();
  });

  test("regular array", () => {
    const result = pipe([] as Array<number>, dropLastWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("regular array with union type", () => {
    const result = pipe(
      [] as Array<number | string>,
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  test("prefix array", () => {
    const result = pipe(
      [1] as [number, ...Array<boolean>],
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("suffix array", () => {
    const result = pipe(
      [1] as [...Array<boolean>, number],
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number>>();
  });

  test("array with suffix and prefix", () => {
    const result = pipe(
      [1, "a"] as [number, ...Array<boolean>, string],
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | number | string>>();
  });

  test("tuple", () => {
    const result = pipe([1, "a", true] as const, dropLastWhile(constant(true)));
    expectTypeOf(result).toEqualTypeOf<Array<"a" | 1 | true>>();
  });

  test("union of arrays", () => {
    const result = pipe(
      [] as Array<boolean> | Array<string>,
      dropLastWhile(constant(true)),
    );
    expectTypeOf(result).toEqualTypeOf<Array<boolean | string>>();
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
        [] as Array<number>,
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        dropLastWhile((item, index, array) => {
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
        [] as Array<boolean> | Array<string>,
        dropLastWhile((item, index, array) => {
          expectTypeOf(item).toEqualTypeOf<boolean | string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<Array<boolean> | Array<string>>();
          return true;
        }),
      );
    });
  });
});
