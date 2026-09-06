import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { Cat, Legged } from "../../../test/interfaces";
import type { Assignability } from "./Assignability";

declare function assignability<Item, Condition>(
  item: Item,
  condition: Condition,
): Assignability<
  Item,
  Condition,
  { full: "full"; none: "none"; partial: "partial" }
>;

describe("full", () => {
  test("same type", () => {
    expectTypeOf(
      assignability($typed<string>(), $typed<string>()),
    ).toEqualTypeOf<"full">();
  });

  test("literal item", () => {
    expectTypeOf(
      assignability($typed<"a">(), $typed<string>()),
    ).toEqualTypeOf<"full">();
  });

  test("union item with all members matching", () => {
    expectTypeOf(
      assignability($typed<"a" | "b">(), $typed<string>()),
    ).toEqualTypeOf<"full">();
  });

  test("interface item with a wider condition", () => {
    expectTypeOf(
      assignability($typed<Cat>(), $typed<object>()),
    ).toEqualTypeOf<"full">();
  });
});

describe("none", () => {
  test("disjoint primitives", () => {
    expectTypeOf(
      assignability($typed<number>(), $typed<string>()),
    ).toEqualTypeOf<"none">();
  });

  test("primitive item with an array condition", () => {
    expectTypeOf(
      assignability($typed<number>(), $typed<unknown[]>()),
    ).toEqualTypeOf<"none">();
  });

  test("function item with an array condition", () => {
    expectTypeOf(
      assignability($typed<() => void>(), $typed<unknown[]>()),
    ).toEqualTypeOf<"none">();
  });

  test("`none` condition", () => {
    expectTypeOf(
      assignability($typed<string>(), $typed<never>()),
    ).toEqualTypeOf<"none">();
  });
});

describe("partial", () => {
  test("union item with some members matching", () => {
    expectTypeOf(
      assignability($typed<number | string>(), $typed<string>()),
    ).toEqualTypeOf<"partial">();
  });

  test("condition narrower than the item", () => {
    expectTypeOf(
      assignability($typed<string>(), $typed<"a">()),
    ).toEqualTypeOf<"partial">();
  });

  test("intersecting interfaces", () => {
    expectTypeOf(
      assignability($typed<Cat>(), $typed<Legged>()),
    ).toEqualTypeOf<"partial">();
  });

  test("`unknown` item", () => {
    expectTypeOf(
      assignability($typed<unknown>(), $typed<string>()),
    ).toEqualTypeOf<"partial">();
  });
});
