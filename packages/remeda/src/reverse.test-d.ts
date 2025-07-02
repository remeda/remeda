import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { reverse } from "./reverse";

describe("data first", () => {
  test("arrays", () => {
    const actual = reverse([1, 2, 3]);

    expectTypeOf(actual).toEqualTypeOf<Array<number>>();
  });

  test("tuples", () => {
    const actual = reverse([1, 2, [true], "a"] as const);

    expectTypeOf(actual).toEqualTypeOf<["a", readonly [true], 2, 1]>();
  });

  test("variadic tuples", () => {
    const input: [number, ...Array<string>] = [1, "two", "three"];
    const actual = reverse(input);

    expectTypeOf(actual).toEqualTypeOf<[...Array<string>, number]>();
  });
});

describe("data last", () => {
  test("arrays", () => {
    const actual = pipe([1, 2, 3], reverse());

    expectTypeOf(actual).toEqualTypeOf<Array<number>>();
  });

  test("tuples", () => {
    const actual = pipe([1, 2, [true], "a"] as const, reverse());

    expectTypeOf(actual).toEqualTypeOf<["a", readonly [true], 2, 1]>();
  });

  test("variadic tuples", () => {
    const input: [number, ...Array<string>] = [1, "two", "three"];
    const actual = pipe(input, reverse());

    expectTypeOf(actual).toEqualTypeOf<[...Array<string>, number]>();
  });
});
