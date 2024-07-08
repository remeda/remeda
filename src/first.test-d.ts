import { first } from "./first";

test("simple empty array", () => {
  const arr: Array<number> = [];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | undefined>();
  expect(result).toEqual(undefined);
});

test("simple array", () => {
  const arr: Array<number> = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | undefined>();
  expect(result).toEqual(1);
});

test("simple non-empty array", () => {
  const arr: [number, ...Array<number>] = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
  expect(result).toEqual(1);
});

test("simple tuple", () => {
  const arr: [number, string] = [1, "a"];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
  expect(result).toEqual(1);
});

test("array with more than one item", () => {
  const arr: [number, number, ...Array<number>] = [1, 2];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
  expect(result).toEqual(1);
});

test("trivial empty array", () => {
  const arr: [] = [];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf(undefined);
  expect(result).toEqual(undefined);
});

test("array with last", () => {
  const arr: [...Array<number>, number] = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
  expect(result).toEqual(1);
});

test("tuple with last", () => {
  const arr: [...Array<string>, number] = ["a", 1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | string>();
  expect(result).toEqual("a");
});

test("simple empty readonly array", () => {
  const arr: ReadonlyArray<number> = [];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | undefined>();
  expect(result).toEqual(undefined);
});

test("simple readonly array", () => {
  const arr: ReadonlyArray<number> = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | undefined>();
  expect(result).toEqual(1);
});

test("simple non-empty readonly array", () => {
  const arr: readonly [number, ...Array<number>] = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
  expect(result).toEqual(1);
});

test("simple readonly tuple", () => {
  const arr: readonly [number, string] = [1, "a"];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
  expect(result).toEqual(1);
});

test("readonly array with more than one item", () => {
  const arr: readonly [number, number, ...Array<number>] = [1, 2];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
  expect(result).toEqual(1);
});

test("readonly trivial empty array", () => {
  const arr: readonly [] = [];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf(undefined);
  expect(result).toEqual(undefined);
});

test("readonly array with last", () => {
  const arr: readonly [...Array<number>, number] = [1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number>();
  expect(result).toEqual(1);
});

test("readonly tuple with last", () => {
  const arr: readonly [...Array<string>, number] = ["a", 1];
  const result = first(arr);
  expectTypeOf(result).toEqualTypeOf<number | string>();
  expect(result).toEqual("a");
});
