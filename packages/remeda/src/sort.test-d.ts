import { expectTypeOf, test } from "vitest";
import { sort } from "./sort";

test("on empty tuple", () => {
  const result = sort([] as [], (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<[]>();
});

test("on empty readonly tuple", () => {
  const result = sort([] as const, (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<[]>();
});

test("on array", () => {
  const result = sort([] as number[], (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<number[]>();
});

test("on readonly array", () => {
  const result = sort([] as readonly number[], (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<number[]>();
});

test("on tuple", () => {
  const result = sort([1, 2, 3] as [1, 2, 3], (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
});

test("on readonly tuple", () => {
  const result = sort([1, 2, 3] as const, (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
});

test("on tuple with rest tail", () => {
  const result = sort([1] as [number, ...number[]], (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<[number, ...number[]]>();
});

test("on readonly tuple with rest tail", () => {
  const result = sort([1] as readonly [number, ...number[]], (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<[number, ...number[]]>();
});

test("on tuple with rest head", () => {
  const result = sort([1] as [...number[], number], (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<[...number[], number]>();
});

test("on readonly tuple with rest head", () => {
  const result = sort([1] as readonly [...number[], number], (a, b) => a - b);

  expectTypeOf(result).toEqualTypeOf<[...number[], number]>();
});

test("on mixed types tuple", () => {
  const result = sort([1, "hello", true] as [number, string, boolean], () => 1);

  expectTypeOf(result).toEqualTypeOf<
    [
      boolean | number | string,
      boolean | number | string,
      boolean | number | string,
    ]
  >();
});
