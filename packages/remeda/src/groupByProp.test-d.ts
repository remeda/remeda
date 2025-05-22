import { groupByProp } from "./groupByProp";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";

test("string literals readonly", () => {
  expectTypeOf(
    groupByProp(
      [
        { a: "cat", b: 123 },
        { a: "dog", b: 456 },
        { a: "dog", b: 789 },
        { a: "cat", b: 101 },
      ] as const,
      "a",
    ),
  ).toEqualTypeOf<{
    cat: [
      { readonly a: "cat"; readonly b: 123 },
      { readonly a: "cat"; readonly b: 101 },
    ];
    dog: [
      { readonly a: "dog"; readonly b: 456 },
      { readonly a: "dog"; readonly b: 789 },
    ];
  }>();
});

test("string literals", () => {
  expectTypeOf(
    groupByProp(
      [
        { a: "cat", b: 123 },
        { a: "dog", b: 456 },
        { a: "dog", b: 789 },
        { a: "cat", b: 101 },
      ] as [
        { a: "cat"; b: 123 },
        { a: "dog"; b: 456 },
        { a: "dog"; b: 789 },
        { a: "cat"; b: 101 },
      ],
      "a",
    ),
  ).toEqualTypeOf<{
    cat: [{ a: "cat"; b: 123 }, { a: "cat"; b: 101 }];
    dog: [{ a: "dog"; b: 456 }, { a: "dog"; b: 789 }];
  }>();
});

test("number literals", () => {
  expectTypeOf(
    groupByProp(
      [
        { a: "cat", b: 123 },
        { a: "dog", b: 456 },
      ] as const,
      "b",
    ),
  ).toEqualTypeOf<{
    123: [{ readonly a: "cat"; readonly b: 123 }];
    456: [{ readonly a: "dog"; readonly b: 456 }];
  }>();
});

test("values which might not exist in the input are optional in the output", () => {
  const result = groupByProp(
    [{ a: "cat" }] as [{ a: "cat" }, { a: "mouse" }?, ...Array<{ a: "dog" }>],
    "a",
  );
  const expected = {} as {
    // Cat is not optional because the tuple will always have at least one.
    cat: [{ a: "cat" }];
    // Dog is optional because the rest element could have 0 items.
    dog?: [{ a: "dog" }, ...Array<{ a: "dog" }>];
    // Mouse is optional because it's optional in the input type.
    mouse?: [{ a: "mouse" }];
  };

  // @ts-expect-error [ts2344] -- TODO: Vitest is failing to assert that the types match and I don't know why. That's why we do the 'extends' checks below instead, because if two types extend each other, they are effectively equal.
  expectTypeOf(result).toEqualTypeOf<typeof expected>();

  expectTypeOf(result).toExtend<typeof expected>();
  expectTypeOf(expected).toExtend<typeof result>();
});

test("symbol", () => {
  const sym = Symbol("sym");

  expectTypeOf(
    groupByProp(
      [
        { [sym]: "cat", b: 123 },
        { [sym]: "dog", b: 456 },
      ] as const,
      sym,
    ),
  ).toEqualTypeOf<{
    cat: [{ readonly [sym]: "cat"; readonly b: 123 }];
    dog: [{ readonly [sym]: "dog"; readonly b: 456 }];
  }>();
});

test("ambiguous type", () => {
  expectTypeOf(
    groupByProp([] as Array<{ a: string; b: number }>, "a"),
  ).toEqualTypeOf<Record<string, NonEmptyArray<{ a: string; b: number }>>>();
});
