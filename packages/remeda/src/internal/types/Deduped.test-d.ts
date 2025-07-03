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
    const result = deduped([1, 2, 3] as Array<number>);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("array with prefix", () => {
    const result = deduped(["a"] as [string, ...Array<number>]);

    expectTypeOf(result).toEqualTypeOf<[string, ...Array<number>]>();
  });

  test("array with suffix", () => {
    const result = deduped(["a"] as [...Array<number>, string]);

    expectTypeOf(result).toEqualTypeOf<
      [number | string, ...Array<number | string>]
    >();
  });

  test("array with both prefix and suffix", () => {
    const result = deduped(["a", true] as [string, ...Array<number>, boolean]);

    expectTypeOf(result).toEqualTypeOf<[string, ...Array<boolean | number>]>();
  });

  test("union of arrays", () => {
    const result = deduped(["a"] as
      | [number, ...Array<number>]
      | [string, ...Array<string>]);

    expectTypeOf(result).toEqualTypeOf<
      [number, ...Array<number>] | [string, ...Array<string>]
    >();
  });
});

describe("readonly", () => {
  test("empty array", () => {
    const result = deduped([] as const);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("simple array", () => {
    const result = deduped([1, 2, 3] as ReadonlyArray<number>);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("array with prefix", () => {
    const result = deduped(["a"] as readonly [string, ...Array<number>]);

    expectTypeOf(result).toEqualTypeOf<[string, ...Array<number>]>();
  });

  test("array with suffix", () => {
    const result = deduped(["a"] as readonly [...Array<number>, string]);

    expectTypeOf(result).toEqualTypeOf<
      [number | string, ...Array<number | string>]
    >();
  });

  test("array with both prefix and suffix", () => {
    const result = deduped(["a", true] as readonly [
      string,
      ...Array<number>,
      boolean,
    ]);

    expectTypeOf(result).toEqualTypeOf<[string, ...Array<boolean | number>]>();
  });

  test("union of arrays", () => {
    const result = deduped(["a"] as
      | readonly [number, ...Array<number>]
      | readonly [string, ...Array<string>]);

    expectTypeOf(result).toEqualTypeOf<
      [number, ...Array<number>] | [string, ...Array<string>]
    >();
  });

  test("constant tuple", () => {
    const result = deduped([1, 2, 3] as const);

    expectTypeOf(result).toEqualTypeOf<[1, ...Array<2 | 3>]>();
  });
});
