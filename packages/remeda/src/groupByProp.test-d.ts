/* eslint-disable @typescript-eslint/consistent-indexed-object-style --
 * The autofixer for this rule is breaking our tests!
 */

import type { EmptyObject } from "type-fest";
import { describe, expectTypeOf, test } from "vitest";
import { groupByProp } from "./groupByProp";

const SYMBOL = Symbol("sym");

describe("grouping prop types", () => {
  test("primitive strings", () => {
    expectTypeOf(
      groupByProp([] as Array<{ a: string }>, "a"),
    ).branded.toEqualTypeOf<
      Record<string, [{ a: string }, ...Array<{ a: string }>]>
    >();
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
  expectTypeOf(
    groupByProp(
      [{ a: "cat" }] as [{ a: "cat" }, { a: "mouse" }?, ...Array<{ a: "dog" }>],
      "a",
    ),
  ).branded.toEqualTypeOf<{
    cat: [{ a: "cat" }];
    dog?: [{ a: "dog" }, ...Array<{ a: "dog" }>];
    mouse?: [{ a: "mouse" }];
  }>();
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

describe("union of array types", () => {
  test("when they share the grouping prop", () => {
    expectTypeOf(
      groupByProp(
        [] as
          | Array<{ a: "cat"; cat: number }>
          | Array<{ a: "dog"; dog: boolean }>,
        "a",
      ),
    ).branded.toEqualTypeOf<
      | {
          cat?: [
            { a: "cat"; cat: number },
            ...Array<{ a: "cat"; cat: number }>,
          ];
        }
      | {
          dog?: [
            { a: "dog"; dog: boolean },
            ...Array<{ a: "dog"; dog: boolean }>,
          ];
        }
    >();
  });

  test("when they don't share the grouping prop", () => {
    expectTypeOf(
      groupByProp([] as Array<{ a: string }> | Array<{ b: number }>, "a"),
    ).branded.toEqualTypeOf<
      EmptyObject | Record<string, [{ a: string }, ...Array<{ a: string }>]>
    >();
  });

  test("empty tuple", () => {
    expectTypeOf(groupByProp([] as [{ a: string }] | [], "a")).toEqualTypeOf<
      EmptyObject | { [x: string]: [{ a: string }] }
    >();
  });
});

test("all values are undefined", () => {
  expectTypeOf(
    groupByProp([] as Array<{ a: undefined }>, "a"),
  ).toEqualTypeOf<EmptyObject>();
});

describe("issue: typing broken for simple arrays with union types", () => {
  test("simple array with union of literal strings", () => {
    expectTypeOf(
      groupByProp([] as Array<{ a: "cat" | "dog"; b: string }>, "a" as const),
    ).branded.toEqualTypeOf<{
      cat?: [{ a: "cat"; b: string }, ...Array<{ a: "cat"; b: string }>];
      dog?: [{ a: "dog"; b: string }, ...Array<{ a: "dog"; b: string }>];
    }>();
  });

  test("simple array with union of literal numbers", () => {
    expectTypeOf(
      groupByProp([] as Array<{ id: 1 | 2 | 3; name: string }>, "id"),
    ).branded.toEqualTypeOf<{
      1?: [{ id: 1; name: string }, ...Array<{ id: 1; name: string }>];
      2?: [{ id: 2; name: string }, ...Array<{ id: 2; name: string }>];
      3?: [{ id: 3; name: string }, ...Array<{ id: 3; name: string }>];
    }>();
  });

  test("array with union of literal strings and additional props", () => {
    expectTypeOf(
      groupByProp(
        [] as Array<{ type: "user" | "admin"; name: string; age: number }>,
        "type",
      ),
    ).branded.toEqualTypeOf<{
      user?: [
        { type: "user"; name: string; age: number },
        ...Array<{ type: "user"; name: string; age: number }>,
      ];
      admin?: [
        { type: "admin"; name: string; age: number },
        ...Array<{ type: "admin"; name: string; age: number }>,
      ];
    }>();
  });

  test("non-empty array should work too", () => {
    expectTypeOf(
      groupByProp(
        [{ a: "cat", b: "test" }] as Array<{ a: "cat" | "dog"; b: string }>,
        "a",
      ),
    ).branded.toEqualTypeOf<{
      cat?: [{ a: "cat"; b: string }, ...Array<{ a: "cat"; b: string }>];
      dog?: [{ a: "dog"; b: string }, ...Array<{ a: "dog"; b: string }>];
    }>();
  });
});
