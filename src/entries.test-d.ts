import { entries } from "./entries";

describe("typing", () => {
  test("with known properties", () => {
    const actual = entries({ a: 1, b: 2, c: 3 });
    expectTypeOf(actual).toEqualTypeOf<
      Array<["a", number] | ["b", number] | ["c", number]>
    >();
  });

  test("with different value types", () => {
    const actual = entries({ a: 1, b: "2", c: true });
    expectTypeOf(actual).toEqualTypeOf<
      Array<["a", number] | ["b", string] | ["c", boolean]>
    >();
  });

  test("with const object", () => {
    const actual = entries({ a: 1, b: 2, c: 3 } as const);
    expectTypeOf(actual).toEqualTypeOf<Array<["a", 1] | ["b", 2] | ["c", 3]>>();
  });

  test("with optional properties", () => {
    const actual = entries({} as { a?: string });
    expectTypeOf(actual).toEqualTypeOf<Array<["a", string]>>();
  });

  test("with undefined properties", () => {
    const actual = entries({ a: undefined } as {
      a: string | undefined;
    });
    expectTypeOf(actual).toEqualTypeOf<Array<["a", string | undefined]>>();
  });

  test("with unknown properties", () => {
    const actual = entries({} as Record<string, unknown>);
    expectTypeOf(actual).toEqualTypeOf<Array<[string, unknown]>>();
  });

  test("object with just symbol keys", () => {
    const actual = entries({ [Symbol("a")]: 1, [Symbol("b")]: "world" });
    expectTypeOf(actual).toEqualTypeOf<Array<never>>();
  });

  test("object with number keys", () => {
    const actual = entries({ 123: "HELLO" });
    expectTypeOf(actual).toEqualTypeOf<Array<["123", string]>>();
  });

  test("object with combined symbols and keys", () => {
    const actual = entries({ a: 1, [Symbol("b")]: "world", 123: true });
    expectTypeOf(actual).toEqualTypeOf<
      Array<["123", boolean] | ["a", number]>
    >();
  });
});
