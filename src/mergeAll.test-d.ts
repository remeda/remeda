import { mergeAll } from "./mergeAll";

describe("tuple overload", () => {
  describe("the fields of the rightmost item should have the greatest priority in overrides", () => {
    it("1 types", () => {
      type A1 = { a: 1; b: 1 };
      const input: [A1] = [{ a: 1, b: 1 }];
      type ExpectedType = { a: 1; b: 1 };

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<ExpectedType>();
    });

    it("2 types", () => {
      type A1 = { a: 1; b: 1 };
      type A2 = { a: 2 };
      const input: [A1, A2] = [{ a: 1, b: 1 }, { a: 2 }];
      type ExpectedType = { a: 2; b: 1 };

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<ExpectedType>();
    });

    it("3 types", () => {
      type A1 = { a: 1; b: 1 };
      type A2 = { a: 2 };
      type A3 = { a: 3 };
      const input: [A1, A2, A3] = [{ a: 1, b: 1 }, { a: 2 }, { a: 3 }];
      type ExpectedType = { a: 3; b: 1 };

      const result = mergeAll(input);

      expectTypeOf(result).toEqualTypeOf<ExpectedType>();
    });
  });
});
