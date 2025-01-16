import type { SharedUnionFieldsComplement } from "./SharedUnionFieldsComplement";

describe("2/3 all-shared fields fixture", () => {
  type A = { a: string; b: string; c: string };
  type B = { a: string; b: string; c: number };
  type C = { a: string; b: string; d: string };
  type UnionEntity = A | B | C;

  type Result = SharedUnionFieldsComplement<UnionEntity>;

  it("should not have the keys of SharedUnionFields", () => {
    expectTypeOf<Result>().not.toHaveProperty("a");
    expectTypeOf<Result>().not.toHaveProperty("b");
  });

  it("should have the complementary keys of SharedUnionFields", () => {
    expectTypeOf<Result>().toHaveProperty("c");
    expectTypeOf<Result>().toHaveProperty("d");
  });

  it("should have the complement of SharedUnionFields", () => {
    type ExpectedResult = { c: string | number; d: string };

    expectTypeOf<Result>().toEqualTypeOf<ExpectedResult>();
  });
});
