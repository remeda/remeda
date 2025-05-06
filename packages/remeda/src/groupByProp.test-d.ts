import { groupByProp } from "./groupByProp";
import type { NonEmptyArray } from "./internal/types/NonEmptyArray";

test("string literals", () => {
  const data = groupByProp(
    [
      { a: "cat", b: 123 },
      { a: "dog", b: 456 },
      { a: "dog", b: 789 },
      { a: "cat", b: 101 },
    ] as const,
    "a",
  );

  expectTypeOf(data).toEqualTypeOf<{
    cat: [
      {
        readonly a: "cat";
        readonly b: 123;
      },
      {
        readonly a: "cat";
        readonly b: 101;
      },
    ];
    dog: [
      {
        readonly a: "dog";
        readonly b: 456;
      },
      {
        readonly a: "dog";
        readonly b: 789;
      },
    ];
  }>();
});

test("number literals", () => {
  const data = groupByProp(
    [
      { a: "cat", b: 123 },
      { a: "dog", b: 456 },
    ] as const,
    "b",
  );

  expectTypeOf(data).toEqualTypeOf<{
    123: [
      {
        readonly a: "cat";
        readonly b: 123;
      },
    ];
    456: [
      {
        readonly a: "dog";
        readonly b: 456;
      },
    ];
  }>();
});

test("symbol", () => {
  const sym = Symbol("sym");
  const data = groupByProp(
    [
      { [sym]: "cat", b: 123 },
      { [sym]: "dog", b: 456 },
    ] as const,
    sym,
  );

  expectTypeOf(data).toEqualTypeOf<{
    cat: [
      {
        readonly [sym]: "cat";
        readonly b: 123;
      },
    ];
    dog: [
      {
        readonly [sym]: "dog";
        readonly b: 456;
      },
    ];
  }>();
});

test("ambiguous type", () => {
  const data = groupByProp([] as Array<{ a: string; b: number }>, "a");

  expectTypeOf(data).toEqualTypeOf<
    Record<string, NonEmptyArray<{ a: string; b: number }>>
  >();
});
