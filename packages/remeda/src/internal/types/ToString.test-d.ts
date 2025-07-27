import type { Tagged } from "type-fest";
import { expectTypeOf, test, describe } from "vitest";
import type { ToString } from "./ToString";

declare function toString<const T>(data: T): ToString<T>;

test("primitive strings", () => {
  expectTypeOf(toString("" as string)).toEqualTypeOf<string>();
});

test("literal string", () => {
  expectTypeOf(toString("hello")).toEqualTypeOf<"hello">();
});

test("primitive numbers", () => {
  expectTypeOf(toString(123 as number)).toEqualTypeOf<`${number}`>();
});

test("literal number", () => {
  expectTypeOf(toString(123)).toEqualTypeOf<"123">();
});

test("template string", () => {
  expectTypeOf(
    toString("prefix_123" as `prefix_${number}`),
  ).toEqualTypeOf<`prefix_${number}`>();
});

test("union of literal numbers", () => {
  expectTypeOf(toString(123 as 123 | 456)).toEqualTypeOf<"123" | "456">();
});

test("union of number and template string", () => {
  expectTypeOf(toString(123 as number | `prefix_${number}`)).toEqualTypeOf<
    `${number}` | `prefix_${number}`
  >();
});

test("branded type", () => {
  expectTypeOf(toString("hello" as Tagged<string, "greeting">)).toEqualTypeOf<
    Tagged<string, "greeting">
  >();
});

test("union of branded types", () => {
  expectTypeOf(
    toString("cola" as Tagged<string, "coke"> | Tagged<string, "pepsi">),
  ).toEqualTypeOf<Tagged<string, "coke"> | Tagged<string, "pepsi">>();
});

test("union with a mix of branded and number keys", () => {
  expectTypeOf(toString(123 as 123 | Tagged<string, "brand">)).toEqualTypeOf<
    "123" | Tagged<string, "brand">
  >();
});

describe("symbols", () => {
  test("primitive", () => {
    expectTypeOf(toString(Symbol("foo"))).toEqualTypeOf<never>();
  });

  test("union with primitive string", () => {
    expectTypeOf(toString("hello" as string | symbol)).toEqualTypeOf<string>();
  });

  test("union with primitive number", () => {
    expectTypeOf(toString(123 as number | symbol)).toEqualTypeOf<`${number}`>();
  });

  test("union with literal number", () => {
    expectTypeOf(toString(123 as 123 | symbol)).toEqualTypeOf<"123">();
  });

  test("union with template string", () => {
    expectTypeOf(
      toString("prefix_123" as `prefix_${number}` | symbol),
    ).toEqualTypeOf<`prefix_${number}`>();
  });

  test("union with branded type", () => {
    expectTypeOf(
      toString("hello" as Tagged<string, "greeting"> | symbol),
    ).toEqualTypeOf<Tagged<string, "greeting">>();
  });
});
