import type { EmptyObject } from "type-fest";
import { mergeAll } from "./mergeAll";

describe("array overload", () => {
  it("custom case", () => {
    // based on https://github.com/remeda/remeda/issues/918
    type UserWithPhone = { id: string; phone: number };
    type UserWithPhoneAsString = { id: string; phone: string };
    type UserWithName = { id: string; name: string; optianalTitle?: string };
    type UserUnion = UserWithName | UserWithPhone | UserWithPhoneAsString;
    const userUnionArray: ReadonlyArray<UserUnion> = [];

    const mergedUserUnion = mergeAll(userUnionArray);

    expectTypeOf(mergedUserUnion).toEqualTypeOf<
      | {
          id: string;
          phone?: string | number;
          name?: string;
          optianalTitle?: string;
        }
      | EmptyObject
    >();
  });

  it("should produce the same type when the type isn't a union", () => {
    type A = { a: string; b: number; c: boolean };
    const input: ReadonlyArray<A> = [];
    const result = mergeAll(input);

    expectTypeOf(result).toEqualTypeOf<A | EmptyObject>();
  });

  describe("optionality", () => {
    it("should keep non-optional fields shared across all union members non-optional, with the rest being converted into optionals", () => {
      type A = { a?: number; b: string; c: number };
      type B = { a?: number; b: string; d?: boolean };
      type C = { a?: number; b: string; c: number; e: string };
      // the only real change is c and e becoming optional, because they aren't shared across all union members and they aren't already optional

      const input: ReadonlyArray<A | B | C> = [];
      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        | { a?: number; b: string; c?: number; d?: boolean; e?: string }
        | EmptyObject
      >();
    });

    it("should preserve undefined in fields when converting fields from non-optional to optional", () => {
      type A = { a: string };
      type B = { a: string; b: string | undefined; c: undefined };
      const input: ReadonlyArray<A | B> = [];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        { a: string; b?: string | undefined; c?: undefined } | EmptyObject
      >();
    });

    it("should prefer optional over non-optional when the same field across all members of the union has different optionalities, because it is type safe", () => {
      type A = { a?: number };
      type B = { a: number };
      type C = { a?: number };
      // there is no "optionality union", we should prefer the safer option for these ambiguities

      const input: ReadonlyArray<A | B | C> = [];
      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<{ a?: number } | EmptyObject>();
    });
  });

  describe("should merge different types on same fields into a union", () => {
    it("when the types are different, they form a union", () => {
      type A = { a: number; b: string };
      type B = { a: string; b: string };
      const input: ReadonlyArray<A | B> = [];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        { a: string | number; b: string } | EmptyObject
      >();
    });

    it("when the fields are unions, they are combined into a single union", () => {
      type A = { a: number | boolean; b: string };
      type B = { a: string | Date; b: string };
      const input: ReadonlyArray<A | B> = [];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        { a: string | number | boolean | Date; b: string } | EmptyObject
      >();
    });

    it("when the field has two different intersections, it becomes the union of the intersections", () => {
      type IntersectionAPart1 = { a1: string };
      type IntersectionAPart2 = { b1: string };
      type IntersectionA = IntersectionAPart1 & IntersectionAPart2;
      type IntersectionBPart1 = { a2: string };
      type IntersectionBPart2 = { b2: string };
      type IntersectionB = IntersectionBPart1 & IntersectionBPart2;
      type A = { a: IntersectionA; b: string };
      type B = { a: IntersectionB; b: string };
      const input: ReadonlyArray<A | B> = [];

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<
        { a: IntersectionA | IntersectionB; b: string } | EmptyObject
      >();
    });
  });
});
