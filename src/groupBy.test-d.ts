import { groupBy } from "./groupBy";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";
import { prop } from "./prop";

test("union of string literals", () => {
  const data = groupBy(
    [
      { a: "cat", b: 123 },
      { a: "dog", b: 456 },
    ] as const,
    prop("a"),
  );

  expectTypeOf(data).toEqualTypeOf<
    Partial<
      Record<
        "cat" | "dog",
        NonEmptyArray<
          | { readonly a: "cat"; readonly b: 123 }
          | { readonly a: "dog"; readonly b: 456 }
        >
      >
    >
  >();
});

test("union of number literals", () => {
  const data = groupBy(
    [
      { a: "cat", b: 123 },
      { a: "dog", b: 456 },
    ] as const,
    prop("b"),
  );
  expectTypeOf(data).toEqualTypeOf<
    Partial<
      Record<
        123 | 456,
        NonEmptyArray<
          | { readonly a: "cat"; readonly b: 123 }
          | { readonly a: "dog"; readonly b: 456 }
        >
      >
    >
  >();
});

test("string", () => {
  const data = groupBy(
    [
      { a: "cat", b: 123 },
      { a: "dog", b: 456 },
    ] as const,
    (x): string => x.a,
  );
  expectTypeOf(data).toEqualTypeOf<
    Record<
      string,
      NonEmptyArray<
        | { readonly a: "cat"; readonly b: 123 }
        | { readonly a: "dog"; readonly b: 456 }
      >
    >
  >();
});

test("number", () => {
  const data = groupBy(
    [
      { a: "cat", b: 123 },
      { a: "dog", b: 456 },
    ] as const,
    (x): number => x.b,
  );
  expectTypeOf(data).toEqualTypeOf<
    Record<
      number,
      NonEmptyArray<
        | { readonly a: "cat"; readonly b: 123 }
        | { readonly a: "dog"; readonly b: 456 }
      >
    >
  >();
});

test("string | number", () => {
  const data = groupBy(
    [
      { a: "cat", b: 123 },
      { a: "dog", b: 456 },
    ] as const,
    (x): number | string => x.b,
  );
  expectTypeOf(data).toEqualTypeOf<
    Record<
      number | string,
      NonEmptyArray<
        | { readonly a: "cat"; readonly b: 123 }
        | { readonly a: "dog"; readonly b: 456 }
      >
    >
  >();
});

describe("filtering on undefined grouper result", () => {
  test("regular", () => {
    const { even, ...rest } = groupBy([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (x) =>
      x % 2 === 0 ? "even" : undefined,
    );
    expectTypeOf(rest).toEqualTypeOf({} as const);
  });

  test("indexed", () => {
    const { even, ...rest } = groupBy(
      ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
      (_, index) => (index % 2 === 0 ? "even" : undefined),
    );
    expectTypeOf(rest).toEqualTypeOf({} as const);
  });
});
