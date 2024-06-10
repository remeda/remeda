import { type Branded, type IfSimpleRecord } from "./types";

describe("IfSimpleRecord", () => {
  test("string, number, symbol", () => {
    expectTypeOf<
      IfSimpleRecord<Record<string, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfSimpleRecord<Record<number, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfSimpleRecord<Record<number | string, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfSimpleRecord<Record<symbol, unknown>>
    >().toEqualTypeOf<true>();
  });

  test("string literals and their union", () => {
    expectTypeOf<IfSimpleRecord<Record<"a", unknown>>>().toEqualTypeOf<false>();

    expectTypeOf<
      IfSimpleRecord<Record<"a" | "b", unknown>>
    >().toEqualTypeOf<false>();
  });

  test("number literals and their union", () => {
    expectTypeOf<IfSimpleRecord<Record<1, unknown>>>().toEqualTypeOf<false>();

    expectTypeOf<
      IfSimpleRecord<Record<1 | 2, unknown>>
    >().toEqualTypeOf<false>();
  });

  test("string and number unions", () => {
    expectTypeOf<
      IfSimpleRecord<Record<"a" | 1, unknown>>
    >().toEqualTypeOf<false>();
  });

  test("unions with unbounded types", () => {
    expectTypeOf<
      IfSimpleRecord<Record<number | "a", unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfSimpleRecord<Record<string | 1, unknown>>
    >().toEqualTypeOf<true>();
  });

  test("branded types", () => {
    expectTypeOf<
      IfSimpleRecord<Record<Branded<string, symbol>, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfSimpleRecord<Record<Branded<number, symbol>, unknown>>
    >().toEqualTypeOf<true>();
  });

  test("bounded template strings", () => {
    expectTypeOf<
      IfSimpleRecord<Record<`a_${1 | 2}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfSimpleRecord<Record<`${"a" | "b"}_${1 | 2}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfSimpleRecord<
        Record<`${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}`, unknown>
      >
    >().toEqualTypeOf<false>();
  });

  test("unbounded template strings", () => {
    expectTypeOf<
      IfSimpleRecord<Record<`a_${number}`, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfSimpleRecord<Record<`${"a" | "b"}_${number}`, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfSimpleRecord<Record<`a_${string}`, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfSimpleRecord<
        Record<`${string}_${number}_${string}_${number}_${string}`, unknown>
      >
    >().toEqualTypeOf<true>();
  });
});
