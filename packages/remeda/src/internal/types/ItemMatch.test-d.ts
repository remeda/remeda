import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { Cat, Legged } from "../../../test/interfaces";
import type { ItemMatch } from "./ItemMatch";

declare function itemMatch<Item, Condition>(
  item: Item,
  condition: Condition,
): ItemMatch<Item, Condition>;

describe("always", () => {
  test("same type", () => {
    expectTypeOf(
      itemMatch($typed<string>(), $typed<string>()),
    ).toEqualTypeOf<"always">();
  });

  test("literal item", () => {
    expectTypeOf(
      itemMatch($typed<"a">(), $typed<string>()),
    ).toEqualTypeOf<"always">();
  });

  test("union item with all members matching", () => {
    expectTypeOf(
      itemMatch($typed<"a" | "b">(), $typed<string>()),
    ).toEqualTypeOf<"always">();
  });

  test("interface item with a wider condition", () => {
    expectTypeOf(
      itemMatch($typed<Cat>(), $typed<object>()),
    ).toEqualTypeOf<"always">();
  });
});

describe("never", () => {
  test("disjoint primitives", () => {
    expectTypeOf(
      itemMatch($typed<number>(), $typed<string>()),
    ).toEqualTypeOf<"never">();
  });

  test("primitive item with an array condition", () => {
    expectTypeOf(
      itemMatch($typed<number>(), $typed<unknown[]>()),
    ).toEqualTypeOf<"never">();
  });

  test("function item with an array condition", () => {
    expectTypeOf(
      itemMatch($typed<() => void>(), $typed<unknown[]>()),
    ).toEqualTypeOf<"never">();
  });

  test("`never` condition", () => {
    expectTypeOf(
      itemMatch($typed<string>(), $typed<never>()),
    ).toEqualTypeOf<"never">();
  });
});

describe("maybe", () => {
  test("union item with some members matching", () => {
    expectTypeOf(
      itemMatch($typed<number | string>(), $typed<string>()),
    ).toEqualTypeOf<"maybe">();
  });

  test("condition narrower than the item", () => {
    expectTypeOf(
      itemMatch($typed<string>(), $typed<"a">()),
    ).toEqualTypeOf<"maybe">();
  });

  test("intersecting interfaces", () => {
    expectTypeOf(
      itemMatch($typed<Cat>(), $typed<Legged>()),
    ).toEqualTypeOf<"maybe">();
  });

  test("`unknown` item", () => {
    expectTypeOf(
      itemMatch($typed<unknown>(), $typed<string>()),
    ).toEqualTypeOf<"maybe">();
  });

  test("`any` item", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      itemMatch($typed<any>(), $typed<string>()),
    ).toEqualTypeOf<"maybe">();
  });
});
