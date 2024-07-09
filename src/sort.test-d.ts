import { sort } from "./sort";

it("on empty tuple", () => {
  const result = sort([] as [], (a, b) => a - b);
  expectTypeOf(result).toEqualTypeOf<[]>();
});

it("on empty readonly tuple", () => {
  const result = sort([] as const, (a, b) => a - b);
  expectTypeOf(result).toEqualTypeOf<[]>();
});

it("on array", () => {
  const result = sort([] as Array<number>, (a, b) => a - b);
  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

it("on readonly array", () => {
  const result = sort([] as ReadonlyArray<number>, (a, b) => a - b);
  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

it("on tuple", () => {
  const result = sort([1, 2, 3] as [1, 2, 3], (a, b) => a - b);
  expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
});

it("on readonly tuple", () => {
  const result = sort([1, 2, 3] as const, (a, b) => a - b);
  expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
});

it("on tuple with rest tail", () => {
  const result = sort([1] as [number, ...Array<number>], (a, b) => a - b);
  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
});

it("on readonly tuple with rest tail", () => {
  const result = sort(
    [1] as readonly [number, ...Array<number>],
    (a, b) => a - b,
  );
  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
});

it("on tuple with rest head", () => {
  const result = sort([1] as [...Array<number>, number], (a, b) => a - b);
  expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
});

it("on readonly tuple with rest head", () => {
  const result = sort(
    [1] as readonly [...Array<number>, number],
    (a, b) => a - b,
  );
  expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
});

it("on mixed types tuple", () => {
  const result = sort([1, "hello", true] as [number, string, boolean], () => 1);
  expectTypeOf(result).toEqualTypeOf<
    [
      boolean | number | string,
      boolean | number | string,
      boolean | number | string,
    ]
  >();
});
