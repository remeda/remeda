import type { ConditionalArray } from "./ConditionalArray";
import type { IterableContainer } from "./IterableContainer";

declare function conditionalArray<T extends IterableContainer, C>(
  data: T,
  condition: C,
): ConditionalArray<T, C>;

describe("primitive conditions", () => {
  test("empty array", () => {
    const result = conditionalArray([], "");

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("all strings", () => {
    const result = conditionalArray([] as Array<string>, "");

    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("mixed types", () => {
    const result = conditionalArray([] as Array<string | number | boolean>, "");

    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });
});

describe("literal conditions", () => {
  test("empty array", () => {
    const result = conditionalArray([], 1 as number);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("all numbers", () => {
    const result = conditionalArray([1, 2, 3] as Array<number>, 1 as const);

    expectTypeOf(result).toEqualTypeOf<Array<1>>();
  });

  test("mixed types", () => {
    const result = conditionalArray(
      [1, "a", true] as Array<string | number | boolean>,
      1 as const,
    );

    expectTypeOf(result).toEqualTypeOf<Array<1>>();
  });
});

describe("union of literals", () => {
  test("empty array", () => {
    const result = conditionalArray([], 1 as 1 | 2);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("all numbers", () => {
    const result = conditionalArray(
      [1, 2, 3] as Array<number>,
      1 as number | string,
    );

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("mixed types", () => {
    const result = conditionalArray(
      [1, "a", true] as Array<string | number | boolean>,
      1 as number | string,
    );

    expectTypeOf(result).toEqualTypeOf<Array<string | number>>();
  });
});

// TODO: Continue this file...
