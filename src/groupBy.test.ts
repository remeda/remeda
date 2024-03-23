import type { NonEmptyArray } from "./_types";
import { groupBy } from "./groupBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

describe("runtime", () => {
  describe("data first", () => {
    test("groupBy", () => {
      expect(
        groupBy(
          [
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ],
          prop("a"),
        ),
      ).toEqual({
        1: [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        2: [{ a: 2, b: 1 }],
      });
    });
  });

  describe("data last", () => {
    test("groupBy", () => {
      expect(
        pipe(
          [
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ],
          groupBy(prop("a")),
        ),
      ).toEqual({
        1: [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        2: [{ a: 2, b: 1 }],
      });
    });
  });

  describe("Filtering on undefined grouper result", () => {
    // These tests use a contrived example that is basically a simple filter. The
    // goal of these tests is to make sure that all flavours of the function
    // accept an undefined return value for the grouper function, and that it
    // works in all the cases, including the typing.

    test("regular", () => {
      const result = groupBy([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (x) =>
        x % 2 === 0 ? "even" : undefined,
      );
      expect(Object.values(result)).toHaveLength(1);
      expect(result.even).toEqual([0, 2, 4, 6, 8]);
    });

    test("regular indexed", () => {
      const result = groupBy(
        ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
        (_, index) => (index % 2 === 0 ? "even" : undefined),
      );
      expect(Object.values(result)).toHaveLength(1);
      expect(result.even).toEqual(["a", "c", "e", "g", "i"]);
    });
  });
});

describe("typing", () => {
  test("Union of string literals", () => {
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

  test("Union of number literals", () => {
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

  describe("Filtering on undefined grouper result", () => {
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
});
