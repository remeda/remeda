import { groupByProp } from "./groupByProp";

const SYMBOL = Symbol("sym");

describe("grouping prop types", () => {
  test("primitive strings", () => {
    const result = groupByProp([] as Array<{ a: string }>, "a");
    const expected = {} as Record<
      string,
      [{ a: string }, ...Array<{ a: string }>]
    >;

    // @ts-expect-error [ts2344] -- TODO: Vitest is failing to assert that the types match and I don't know why. That's why we do the 'extends' checks below instead, because if two types extend each other, they are effectively equal.
    expectTypeOf(result).toEqualTypeOf<typeof expected>();

    expectTypeOf(result).toExtend<typeof expected>();
    expectTypeOf(expected).toExtend<typeof result>();
  });

  test("literal strings", () => {
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

  test("literal numbers", () => {
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

  test("symbol", () => {
    expectTypeOf(
      groupByProp(
        [
          { [SYMBOL]: "cat", b: 123 },
          { [SYMBOL]: "dog", b: 456 },
        ] as const,
        SYMBOL,
      ),
    ).toEqualTypeOf<{
      cat: [{ readonly [SYMBOL]: "cat"; readonly b: 123 }];
      dog: [{ readonly [SYMBOL]: "dog"; readonly b: 456 }];
    }>();
  });
});

test("values which might not exist in the input are optional in the output", () => {
  const result = groupByProp(
    [{ a: "cat" }] as [
      // 'cat' is required
      { a: "cat" },
      // 'mouse' is optional
      { a: "mouse" }?,
      // 'dog' is a rest element
      ...Array<{ a: "dog" }>,
    ],
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

describe("enforces strong typing on the grouping prop", () => {
  test("typo in prop name", () => {
    groupByProp(
      [{ a: "hello" }] as const,
      // @ts-expect-error [ts2345] -- "typo" isn't a valid prop name
      "typo",
    );
  });

  test("prop is not groupable", () => {
    groupByProp(
      [{ a: new Date() }] as const,
      // @ts-expect-error [ts2345] -- "a" can't be used to group the array
      "a",
    );
  });

  test("prop is only groupable for some of the elements", () => {
    groupByProp(
      [{ a: "hello" }, { a: new Date() }] as const,
      // @ts-expect-error [ts2345] -- "a" cannot be used to group the array
      // because it can sometimes be a Date
      "a",
    );
  });

  test("allows grouping on a prop that isn't in all elements", () => {
    groupByProp([{ a: "hello" }, { b: 123 }] as const, "a");
  });

  test("allows grouping on possibly undefined props", () => {
    groupByProp([] as Array<{ a: string | undefined }>, "a");
  });
});

test("group by prop that doesn't exist on all items", () => {
  expectTypeOf(
    groupByProp([{ a: "cat" }, { b: "dog" }] as const, "a"),
  ).toEqualTypeOf<{ cat: [{ readonly a: "cat" }] }>();
});
