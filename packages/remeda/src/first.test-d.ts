import { expectTypeOf, test } from "vitest";
import { first } from "./first";

test("simple empty array", () => {
  const arr: Array<number> = [];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("simple array", () => {
  const arr: Array<number> = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("simple non-empty array", () => {
  const arr: [number, ...Array<number>] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("simple tuple", () => {
  const arr: [number, string] = [1, "a"];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("array with more than one item", () => {
  const arr: [number, number, ...Array<number>] = [1, 2];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("trivial empty array", () => {
  const arr: [] = [];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf(undefined);
});

test("array with last", () => {
  const arr: [...Array<number>, number] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("tuple with last", () => {
  const arr: [...Array<string>, number] = ["a", 1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | string>();
});

test("simple empty readonly array", () => {
  const arr: ReadonlyArray<number> = [];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("simple readonly array", () => {
  const arr: ReadonlyArray<number> = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("simple non-empty readonly array", () => {
  const arr: readonly [number, ...Array<number>] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("simple readonly tuple", () => {
  const arr: readonly [number, string] = [1, "a"];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("readonly array with more than one item", () => {
  const arr: readonly [number, number, ...Array<number>] = [1, 2];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("readonly trivial empty array", () => {
  const arr: readonly [] = [];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf(undefined);
});

test("readonly array with last", () => {
  const arr: readonly [...Array<number>, number] = [1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number>();
});

test("readonly tuple with last", () => {
  const arr: readonly [...Array<string>, number] = ["a", 1];
  const result = first(arr);

  expectTypeOf(result).toEqualTypeOf<number | string>();
});
