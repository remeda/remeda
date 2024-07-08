import { chunk } from "./chunk";
import { type NonEmptyArray } from "./internal/types";

test("empty tuple", () => {
  const input: [] = [];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<[]>();
});

test("readonly empty tuple", () => {
  const input = [] as const;
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<[]>();
});

test("array", () => {
  const input: Array<number> = [];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
});

test("readonly array", () => {
  const input: ReadonlyArray<number> = [];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
});

test("tuple", () => {
  const input: [number, number, number] = [123, 456, 789];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
});

test("readonly tuple", () => {
  const input: readonly [number, number, number] = [123, 456, 789];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
});

test("tuple with rest tail", () => {
  const input: [number, ...Array<number>] = [123, 456];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
});

test("readonly tuple with rest tail", () => {
  const input: readonly [number, ...Array<number>] = [123, 456];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
});

test("tuple with rest middle", () => {
  const input: [number, ...Array<number>, number] = [123, 456];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
});

test("readonly tuple with rest middle", () => {
  const input: readonly [number, ...Array<number>, number] = [123, 456];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
});

test("tuple with rest head", () => {
  const input: [...Array<number>, number] = [123, 456];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
});

test("readonly tuple with rest head", () => {
  const input: readonly [...Array<number>, number] = [123, 456];
  const result = chunk(input, 2);
  expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
});
