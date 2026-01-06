import { expectTypeOf, test } from "vitest";
import { entries } from "./entries";
import type { Tagged } from "type-fest";

test("with known properties", () => {
  const actual = entries({ a: 1, b: 2, c: 3 });

  expectTypeOf(actual).toEqualTypeOf<
    (["a", number] | ["b", number] | ["c", number])[]
  >();
});

test("with different value types", () => {
  const actual = entries({ a: 1, b: "2", c: true });

  expectTypeOf(actual).toEqualTypeOf<
    (["a", number] | ["b", string] | ["c", boolean])[]
  >();
});

test("with const object", () => {
  const actual = entries({ a: 1, b: 2, c: 3 } as const);

  expectTypeOf(actual).toEqualTypeOf<(["a", 1] | ["b", 2] | ["c", 3])[]>();
});

test("with optional properties", () => {
  const actual = entries({} as { a?: string });

  expectTypeOf(actual).toEqualTypeOf<["a", string][]>();
});

test("with undefined properties", () => {
  const actual = entries({ a: undefined } as {
    a: string | undefined;
  });

  expectTypeOf(actual).toEqualTypeOf<["a", string | undefined][]>();
});

test("with unknown properties", () => {
  const actual = entries({} as Record<string, unknown>);

  expectTypeOf(actual).toEqualTypeOf<[string, unknown][]>();
});

test("object with just symbol keys", () => {
  const actual = entries({ [Symbol("a")]: 1, [Symbol("b")]: "world" });

  expectTypeOf(actual).toEqualTypeOf<never[]>();
});

test("object with number keys", () => {
  const actual = entries({ 123: "HELLO" });

  expectTypeOf(actual).toEqualTypeOf<["123", string][]>();
});

test("object with combined symbols and keys", () => {
  const actual = entries({ a: 1, [Symbol("b")]: "world", 123: true });

  expectTypeOf(actual).toEqualTypeOf<(["123", boolean] | ["a", number])[]>();
});

// @see https://github.com/remeda/remeda/issues/752
test("branded keys (issue #752)", () => {
  expectTypeOf(
    entries({} as Record<Tagged<string, "color">, string>),
  ).toEqualTypeOf<[Tagged<string, "color">, string][]>();
});
