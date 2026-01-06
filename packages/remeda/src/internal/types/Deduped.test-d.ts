import { describe, expectTypeOf, test } from "vitest";
import type { Deduped } from "./Deduped";
import type { IterableContainer } from "./IterableContainer";

declare function deduped<T extends IterableContainer>(data: T): Deduped<T>;

describe("mutable", () => {
  test("empty array", () => {
    const result = deduped([] as []);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("simple array", () => {
    const result = deduped([1, 2, 3] as number[]);

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("array with prefix", () => {
    const result = deduped(["a"] as [string, ...number[]]);

    expectTypeOf(result).toEqualTypeOf<[string, ...number[]]>();
  });

  test("array with suffix", () => {
    const result = deduped(["a"] as [...number[], string]);

    expectTypeOf(result).toEqualTypeOf<
      [number | string, ...(number | string)[]]
    >();
  });

  test("array with both prefix and suffix", () => {
    const result = deduped(["a", true] as [string, ...number[], boolean]);

    expectTypeOf(result).toEqualTypeOf<[string, ...(boolean | number)[]]>();
  });

  test("union of arrays", () => {
    const result = deduped(["a"] as
      | [number, ...number[]]
      | [string, ...string[]]);

    expectTypeOf(result).toEqualTypeOf<
      [number, ...number[]] | [string, ...string[]]
    >();
  });
});

describe("readonly", () => {
  test("empty array", () => {
    const result = deduped([] as const);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("simple array", () => {
    const result = deduped([1, 2, 3] as readonly number[]);

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("array with prefix", () => {
    const result = deduped(["a"] as readonly [string, ...number[]]);

    expectTypeOf(result).toEqualTypeOf<[string, ...number[]]>();
  });

  test("array with suffix", () => {
    const result = deduped(["a"] as readonly [...number[], string]);

    expectTypeOf(result).toEqualTypeOf<
      [number | string, ...(number | string)[]]
    >();
  });

  test("array with both prefix and suffix", () => {
    const result = deduped(["a", true] as readonly [
      string,
      ...number[],
      boolean,
    ]);

    expectTypeOf(result).toEqualTypeOf<[string, ...(boolean | number)[]]>();
  });

  test("union of arrays", () => {
    const result = deduped(["a"] as
      | readonly [number, ...number[]]
      | readonly [string, ...string[]]);

    expectTypeOf(result).toEqualTypeOf<
      [number, ...number[]] | [string, ...string[]]
    >();
  });

  test("constant tuple", () => {
    const result = deduped([1, 2, 3] as const);

    expectTypeOf(result).toEqualTypeOf<[1, ...(2 | 3)[]]>();
  });
});
