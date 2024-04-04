import { last } from "./last";
import { pipe } from "./pipe";
import type { NonEmptyArray } from "./_types";

describe("last", () => {
  describe("data first", () => {
    test("should return last", () => {
      expect(last([1, 2, 3] as const)).toEqual(3);
    });

    test("empty array", () => {
      expect(last([] as const)).toEqual(undefined);
    });
  });

  describe("data last", () => {
    test("should return last", () => {
      expect(pipe([1, 2, 3] as const, last())).toEqual(3);
    });

    test("empty array", () => {
      expect(pipe([] as const, last())).toEqual(undefined);
    });
  });

  describe("types", () => {
    test("should return T | undefined for Array input", () => {
      const input: Array<number> = [1, 2, 3];
      const actual = last(input);
      expectTypeOf(actual).toEqualTypeOf<number | undefined>();
    });

    test("should not return undefined for non empty arrays", () => {
      const input: NonEmptyArray<number> = [1, 2, 3];
      const data = last(input);
      expectTypeOf(data).toEqualTypeOf<number>();
    });

    test("should infer type in pipes", () => {
      const data = pipe("this is a text", (text) => [...text], last());
      expectTypeOf(data).toEqualTypeOf<string | undefined>();
    });
  });
});
