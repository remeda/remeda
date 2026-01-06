import type { Tagged } from "type-fest";
import { describe, expectTypeOf, test } from "vitest";
import { keys } from "./keys";
import { pipe } from "./pipe";

describe("arrays", () => {
  test("empty tuple", () => {
    const result = keys([] as []);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("empty readonly tuple", () => {
    const result = keys([] as const);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("array", () => {
    const result = keys([] as number[]);

    expectTypeOf(result).toEqualTypeOf<`${number}`[]>();
  });

  test("readonly array", () => {
    const result = keys([] as readonly number[]);

    expectTypeOf(result).toEqualTypeOf<`${number}`[]>();
  });

  test("tuple", () => {
    const result = keys(["a", 1, true] as ["a", 1, true]);

    expectTypeOf(result).toEqualTypeOf<["0", "1", "2"]>();
  });

  test("readonly tuple", () => {
    const result = keys(["a", 1, true] as const);

    expectTypeOf(result).toEqualTypeOf<["0", "1", "2"]>();
  });

  test("tuple with rest tail", () => {
    const result = keys(["a"] as ["a", ..."b"[]]);

    expectTypeOf(result).toEqualTypeOf<["0", ...`${number}`[]]>();
  });

  test("readonly tuple with rest tail", () => {
    const result = keys(["a"] as readonly ["a", ..."b"[]]);

    expectTypeOf(result).toEqualTypeOf<["0", ...`${number}`[]]>();
  });

  test("tuple with rest head", () => {
    const result = keys(["b"] as [..."a"[], "b"]);

    expectTypeOf(result).toEqualTypeOf<[...`${number}`[], `${number}`]>();
  });

  test("readonly tuple with rest head", () => {
    const result = keys(["b"] as readonly [..."a"[], "b"]);

    expectTypeOf(result).toEqualTypeOf<[...`${number}`[], `${number}`]>();
  });

  test("tuple with rest middle", () => {
    const result = keys(["a", "c"] as ["a", ..."b"[], "c"]);

    expectTypeOf(result).toEqualTypeOf<["0", ...`${number}`[], `${number}`]>();
  });

  test("readonly tuple with rest middle", () => {
    const result = keys(["a", "c"] as readonly ["a", ..."b"[], "c"]);

    expectTypeOf(result).toEqualTypeOf<["0", ...`${number}`[], `${number}`]>();
  });
});

describe("object types", () => {
  test("empty record (string)", () => {
    const result = keys({} as Record<string, never>);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("empty record (number)", () => {
    const result = keys({} as Record<number, never>);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("empty record (const)", () => {
    const result = keys({} as const);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("unions of records", () => {
    const data = {} as Record<number, unknown> | Record<string, unknown>;

    const dataFirst = keys(data);

    expectTypeOf(dataFirst).toEqualTypeOf<`${number}`[] | string[]>();

    const dataLast = pipe(data, keys());

    expectTypeOf(dataLast).toEqualTypeOf<`${number}`[] | string[]>();
  });

  test("simple (required) object", () => {
    const result = keys({ a: "a", b: 1, c: true } as {
      a: string;
      b: number;
      c: boolean;
    });

    expectTypeOf(result).toEqualTypeOf<("a" | "b" | "c")[]>();
  });

  test("simple partial object", () => {
    const result = keys({ a: "a", b: 1, c: true } as {
      a?: string;
      b?: number;
      c?: boolean;
    });

    expectTypeOf(result).toEqualTypeOf<("a" | "b" | "c")[]>();
  });

  test("object with index signature", () => {
    const result = keys({ hello: "world", a: "goodbye" } as {
      [keys: string]: string;
      a: string;
    });

    expectTypeOf(result).toEqualTypeOf<string[]>();
  });

  test("record with literal union", () => {
    const result = keys({ a: 1, b: 2 } as Record<"a" | "b", number>);

    expectTypeOf(result).toEqualTypeOf<("a" | "b")[]>();
  });

  test("record with template string literal", () => {
    const result = keys({ param_123: "hello", param_456: "world" } as Record<
      `param_${number}`,
      string
    >);

    expectTypeOf(result).toEqualTypeOf<`param_${number}`[]>();
  });

  test("object with just symbol keys", () => {
    const actual = keys({ [Symbol("a")]: 1, [Symbol("b")]: "world" });

    expectTypeOf(actual).toEqualTypeOf<never[]>();
  });

  test("object with number keys", () => {
    const actual = keys({ 123: "HELLO" });

    expectTypeOf(actual).toEqualTypeOf<"123"[]>();
  });

  test("object with combined symbols and keys", () => {
    const actual = keys({ a: 1, [Symbol("b")]: "world", 123: true });

    expectTypeOf(actual).toEqualTypeOf<("123" | "a")[]>();
  });
});

// @see https://github.com/remeda/remeda/issues/752
test("branded keys (issue #752)", () => {
  expectTypeOf(
    keys({} as Record<Tagged<string, "color">, string>),
  ).toEqualTypeOf<Tagged<string, "color">[]>();
});
