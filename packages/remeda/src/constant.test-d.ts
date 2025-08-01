import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";

test("supported in any api", () => {
  mockApi({
    onMixOfParams: constant(1),
    onNoParams: constant(true),
    onVariadicParams: constant("cat"),
  });
});

test("doesn't break return typing", () => {
  mockApi({
    // @ts-expect-error [ts2322] - string is not a number.
    onMixOfParams: constant("hello"),
    // @ts-expect-error [ts2322] - number is not a boolean.
    onNoParams: constant(123),
    // @ts-expect-error [ts2322] - "mouse" is not a cat or a dog.
    onVariadicParams: constant("mouse"),
  });
});

// @see https://github.com/remeda/remeda/issues/823
describe("returns narrow types on literals (issue #823)", () => {
  test("strings", () => {
    expectTypeOf(constant("hello")).returns.toEqualTypeOf<"hello">();
  });

  test("objects", () => {
    expectTypeOf(constant({ a: 1, b: 2 })).returns.toEqualTypeOf<{
      readonly a: 1;
      readonly b: 2;
    }>();
  });

  test("arrays", () => {
    expectTypeOf(constant([1, 2, 3])).returns.toEqualTypeOf<
      readonly [1, 2, 3]
    >();
  });

  test("doesn't narrow explicitly defined types", () => {
    expectTypeOf(constant({ a: 1 as number, b: 2 })).returns.toEqualTypeOf<{
      readonly a: number;
      readonly b: 2;
    }>();
  });
});

function mockApi(_options: {
  readonly onMixOfParams: (result: string, isOptionalBoolean?: true) => number;
  readonly onNoParams: () => boolean;
  readonly onVariadicParams: (...args: ReadonlyArray<string>) => "cat" | "dog";
}): void {
  /* do nothing */
}
