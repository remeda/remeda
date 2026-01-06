import { expectTypeOf, test } from "vitest";
import { first } from "./first";

test("simple empty array", () => {
  const arr: number[] = [];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("simple array", () => {
  const arr: number[] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("simple non-empty array", () => {
  const arr: [number, ...number[]] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("simple tuple", () => {
  const arr: [number, string] = [1, "a"];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("array with more than one item", () => {
  const arr: [number, number, ...number[]] = [1, 2];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("trivial empty array", () => {
  const arr: [] = [];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf(undefined);
});

test("array with last", () => {
  const arr: [...number[], number] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("tuple with last", () => {
  const arr: [...string[], number] = ["a", 1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | string>();
});

test("simple empty readonly array", () => {
  const arr: readonly number[] = [];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("simple readonly array", () => {
  const arr: readonly number[] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("simple non-empty readonly array", () => {
  const arr: readonly [number, ...number[]] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("simple readonly tuple", () => {
  const arr: readonly [number, string] = [1, "a"];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("readonly array with more than one item", () => {
  const arr: readonly [number, number, ...number[]] = [1, 2];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("readonly trivial empty array", () => {
  const arr: readonly [] = [];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf(undefined);
});

test("readonly array with last", () => {
  const arr: readonly [...number[], number] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("readonly tuple with last", () => {
  const arr: readonly [...string[], number] = ["a", 1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | string>();
});
