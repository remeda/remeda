import { only } from "./only";
import { pipe } from "./pipe";

describe("data first", () => {
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

describe("strict typing", () => {
  test("simple empty array", () => {
    const arr: Array<number> = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toBeUndefined();
  });

  test("simple array", () => {
    const arr: Array<number> = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test("simple non-empty array", () => {
    const arr: [number, ...Array<number>] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test("simple tuple", () => {
    const arr: [number, string] = [1, "a"];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  test("array with more than one item", () => {
    const arr: [number, number, ...Array<number>] = [1, 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  test("trivial empty array", () => {
    const arr: [] = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf(undefined);
    expect(result).toBeUndefined();
  });

  test("array with last", () => {
    const arr: [...Array<number>, number] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test("tuple with last", () => {
    const arr: [...Array<string>, number] = ["a", 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  test("tuple with two last", () => {
    const arr: [...Array<string>, number, number] = ["a", 1, 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  test("tuple with first and last", () => {
    const arr: [number, ...Array<string>, number] = [1, "a", 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  test("tuple with optional and array", () => {
    const arr: [string?, ...Array<number>] = ["a", 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  test("tuple with all optional", () => {
    const arr: [string?, number?] = ["a", 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  test("simple empty readonly array", () => {
    const arr: ReadonlyArray<number> = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toBeUndefined();
  });

  test("simple readonly array", () => {
    const arr: ReadonlyArray<number> = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test("simple non-empty readonly array", () => {
    const arr: readonly [number, ...Array<number>] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test("simple readonly tuple", () => {
    const arr: readonly [number, string] = [1, "a"];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  test("readonly array with more than one item", () => {
    const arr: readonly [number, number, ...Array<number>] = [1, 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toBeUndefined();
  });

  test("readonly trivial empty array", () => {
    const arr: readonly [] = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf(undefined);
    expect(result).toBeUndefined();
  });

  test("readonly array with last", () => {
    const arr: readonly [...Array<number>, number] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test("readonly tuple with last", () => {
    const arr: readonly [...Array<string>, number] = ["a", 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  test("readonly tuple with optional and array", () => {
    const arr: readonly [string?, ...Array<number>] = ["a", 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });

  test("readonly tuple with all optional", () => {
    const arr: readonly [string?, number?] = ["a", 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | string | undefined>();
    expect(result).toBeUndefined();
  });
});
