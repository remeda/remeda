import { join } from "./join";

it("empty tuple", () => {
  const array: [] = [];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<"">();
});

it("empty readonly tuple", () => {
  const array: readonly [] = [];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<"">();
});

it("array", () => {
  const array: Array<number> = [];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<string>();
});

it("readonly array", () => {
  const array: ReadonlyArray<number> = [];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<string>();
});

it("tuple", () => {
  const array: ["a" | "b", "c" | "d", "e" | "f"] = ["a", "c", "e"];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<`${"a" | "b"},${"c" | "d"},${
    | "e"
    | "f"}`>();
});

it("readonly tuple", () => {
  const array: readonly ["a" | "b", "c" | "d", "e" | "f"] = ["a", "c", "e"];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<`${"a" | "b"},${"c" | "d"},${
    | "e"
    | "f"}`>();
});

it("tuple with rest tail", () => {
  const array: ["a" | "b", ...Array<"c" | "d">] = ["a", "c"];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<`${"a" | "b"},${string}`>();
});

it("readonly tuple with rest tail", () => {
  const array: readonly ["a" | "b", ...Array<"c" | "d">] = ["a", "c"];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<`${"a" | "b"},${string}`>();
});

it("tuple with rest head", () => {
  const array: [...Array<"a" | "b">, "c" | "d"] = ["a", "c"];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<`${string},${"c" | "d"}`>();
});

it("readonly tuple with rest head", () => {
  const array: readonly [...Array<"a" | "b">, "c" | "d"] = ["a", "c"];
  const result = join(array, ",");
  expectTypeOf(result).toEqualTypeOf<`${string},${"c" | "d"}`>();
});

describe("tuple item types", () => {
  it("number", () => {
    const array: [number, number] = [1, 2];
    const result = join(array, ",");
    expectTypeOf(result).toEqualTypeOf<`${number},${number}`>();
  });

  it("string", () => {
    const array: [string, string] = ["a", "b"];
    const result = join(array, ",");
    expectTypeOf(result).toEqualTypeOf<`${string},${string}`>();
  });

  it("bigint", () => {
    const array: [bigint, bigint] = [1n, 2n];
    const result = join(array, ",");
    expectTypeOf(result).toEqualTypeOf<`${bigint},${bigint}`>();
  });

  it("boolean", () => {
    const array: [boolean, boolean] = [true, false];
    const result = join(array, ",");
    expectTypeOf(result).toEqualTypeOf<`${boolean},${boolean}`>();
  });

  it("null", () => {
    // eslint-disable-next-line unicorn/no-null -- Intentional
    const array: [null, null] = [null, null];
    const result = join(array, ",");
    expectTypeOf(result).toEqualTypeOf<",">();
  });

  it("undefined", () => {
    const array: [undefined, undefined] = [undefined, undefined];
    const result = join(array, ",");
    expectTypeOf(result).toEqualTypeOf<",">();
  });

  it("mixed", () => {
    const array: [number, undefined, string] = [1, undefined, "a"];
    const result = join(array, ",");
    expectTypeOf(result).toEqualTypeOf<`${number},,${string}`>();
  });

  it("nullish items", () => {
    const array: [
      "prefix" | undefined,
      "midfix" | undefined,
      "suffix" | undefined,
    ] = ["prefix", undefined, "suffix"];
    const result = join(array, ",");
    expectTypeOf(result).toEqualTypeOf<`${"" | "prefix"},${"" | "midfix"},${
      | ""
      | "suffix"}`>();
  });
});
