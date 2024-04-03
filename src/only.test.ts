import { only } from "./only";
import { pipe } from "./pipe";

describe("runtime", () => {
  describe("dataFirst", () => {
    test("empty array", () => {
      expect(only([])).toBeUndefined();
    });

    test("length 1 array", () => {
      expect(only([1])).toEqual(1);
    });

    test("length 2 array", () => {
      expect(only([1, 2])).toBeUndefined();
    });
  });

  describe("data last", () => {
    test("empty array", () => {
      expect(pipe([], only())).toBeUndefined();
    });

    test("length 1 array", () => {
      expect(pipe([1], only())).toEqual(1);
    });

    test("length 2 array", () => {
      expect(pipe([1, 2], only())).toBeUndefined();
    });
  });

  test("simple tuple", () => {
    expect(only([1, "a"])).toBeUndefined();
  });

  test("tuple with last", () => {
    expect(only(["a", 1])).toBeUndefined();
  });

  test("tuple with two last", () => {
    expect(only(["a", 1, 2])).toBeUndefined();
  });

  test("tuple with first and last", () => {
    expect(only([1, "a", 2])).toBeUndefined();
  });
});

describe("typing", () => {
  test("simple array", () => {
    const result = only([] as Array<number>);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("simple non-empty array", () => {
    const result = only([1] as [number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("simple tuple", () => {
    const result = only([1, "a"] as [number, string]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  test("array with more than one item", () => {
    const result = only([1, 2] as [number, number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  test("trivial empty array", () => {
    const result = only([] as []);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  test("array with last", () => {
    const result = only([1] as [...Array<number>, number]);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("tuple with last", () => {
    const result = only(["a", 1] as [...Array<string>, number]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  test("tuple with two last", () => {
    const result = only(["a", 1, 2] as [...Array<string>, number, number]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  test("tuple with first and last", () => {
    const result = only([1, "a", 2] as [number, ...Array<string>, number]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  test("tuple with optional and array", () => {
    const result = only(["a", 1] as [string?, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  test("tuple with all optional", () => {
    const result = only(["a", 1] as [string?, number?]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  test("simple readonly array", () => {
    const result = only([] as ReadonlyArray<number>);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("simple non-empty readonly array", () => {
    const result = only([1] as readonly [number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("simple readonly tuple", () => {
    const result = only([1, "a"] as readonly [number, string]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  test("readonly array with more than one item", () => {
    const result = only([1, 2] as readonly [number, number, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<undefined>();
  });

  test("readonly trivial empty array", () => {
    const result = only([] as const);
    expectTypeOf(result).toEqualTypeOf(undefined);
  });

  test("readonly array with last", () => {
    const result = only([1] as readonly [...Array<number>, number]);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  test("readonly tuple with last", () => {
    const result = only(["a", 1] as readonly [...Array<string>, number]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  test("readonly tuple with optional and array", () => {
    const result = only(["a", 1] as readonly [string?, ...Array<number>]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });

  test("readonly tuple with all optional", () => {
    const result = only(["a", 1] as readonly [string?, number?]);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
  });
});
