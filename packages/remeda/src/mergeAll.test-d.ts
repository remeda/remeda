import type { EmptyObject } from "type-fest";
import { mergeAll } from "./mergeAll";

describe("arrays", () => {
  it("custom case", () => {
    // based on https://github.com/remeda/remeda/issues/918

    const userUnionArray: ReadonlyArray<
      | { id: string; phone: number }
      | { id: string; phone: string }
      | { id: string; name: string; optionalTitle?: string }
    > = [];

    const mergedUserUnion = mergeAll(userUnionArray);

    expectTypeOf(mergedUserUnion).toEqualTypeOf<
      | {
          id: string;
          phone?: string | number;
          name?: string;
          optionalTitle?: string;
        }
      | EmptyObject
    >();
  });

  it("should produce the same type when the type isn't a union", () => {
    const input: ReadonlyArray<{ a: string; b: number; c: boolean }> = [];
    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<
      { a: string; b: number; c: boolean } | EmptyObject
    >();
  });

  describe("optionality", () => {
    it("should keep non-optional fields shared across all union members non-optional, with the rest being converted into optionals", () => {
      // the only real change is c and e becoming optional, because they aren't shared across all union members and they aren't already optional

      const input: ReadonlyArray<
        | { a?: number; b: string; c: number }
        | { a?: number; b: string; d?: boolean }
        | { a?: number; b: string; c: number; e: string }
      > = [];
      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        | { a?: number; b: string; c?: number; d?: boolean; e?: string }
        | EmptyObject
      >();
    });

    it("should preserve undefined in fields when converting fields from non-optional to optional", () => {
      const input: ReadonlyArray<
        { a: string } | { a: string; b: string | undefined; c: undefined }
      > = [];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        { a: string; b?: string | undefined; c?: undefined } | EmptyObject
      >();
    });

    it("should prefer optional over non-optional when the same field across all members of the union has different optionalities, because it is type safe", () => {
      // there is no "optionality union", we should prefer the safer option for these ambiguities
      const input: ReadonlyArray<
        { a?: number } | { a: number } | { a?: number; b: string }
      > = [];
      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        { a?: number; b?: string } | EmptyObject
      >();
    });
  });

  describe("should merge different types on same fields into a union", () => {
    it("when the types are different, they form a union", () => {
      const input: ReadonlyArray<
        { a: number; b: string } | { a: string; b: string }
      > = [];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        { a: string | number; b: string } | EmptyObject
      >();
    });

    it("when the fields are unions, they are combined into a single union", () => {
      const input: ReadonlyArray<
        { a: number | boolean; b: string } | { a: string | Date; b: string }
      > = [];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        { a: string | number | boolean | Date; b: string } | EmptyObject
      >();
    });

    it("when the field has two different intersections, it becomes the union of the intersections", () => {
      const input: ReadonlyArray<
        | { a: { a1: string } & { b1: string }; b: string }
        | { a: { a2: string } & { b2: string }; b: string }
      > = [];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        | {
            a:
              | ({ a1: string } & { b1: string })
              | ({ a2: string } & { b2: string });
            b: string;
          }
        | EmptyObject
      >();
    });
  });
});

describe("nonempty arrays", () => {
  it("the return type should not include the possibility of returning a nonempty object given a nonempty array with nonempty objects", () => {
    const input: [
      { a: number; b: string } | { a: string; b: string },
      ...ReadonlyArray<{ a: number; b: string } | { a: string; b: string }>,
    ] = [{ a: 1, b: "b" }];

    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<{ a: string | number; b: string }>();
  });
});

describe("tuples", () => {
  describe("the fields of the rightmost item should have the greatest priority in overrides", () => {
    it("0 types", () => {
      const input: [] = [];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<EmptyObject>();
    });

    it("1 types", () => {
      const input: [{ a: 1; b: 1 }] = [{ a: 1, b: 1 }];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<{ a: 1; b: 1 }>();
    });

    it("2 types", () => {
      const input: [{ a: 1; b: 1 }, { a: 2 }] = [{ a: 1, b: 1 }, { a: 2 }];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<{ a: 2; b: 1 }>();
    });

    it("3 types", () => {
      const input: [{ a: 1; b: 1 }, { a: 2 }, { a: 3 }] = [
        { a: 1, b: 1 },
        { a: 2 },
        { a: 3 },
      ];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<{ a: 3; b: 1 }>();
    });
  });
});
