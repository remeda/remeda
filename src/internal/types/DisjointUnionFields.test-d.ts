import type { DisjointUnionFields } from "./DisjointUnionFields";

it("should have the complement of SharedUnionFields", () => {
  type A = { a: string; b: string; c: string };
  type B = { a: string; b: string; c: number };
  type C = { a: string; b: string; d: string };
  type UnionEntity = A | B | C;

  type Result = DisjointUnionFields<UnionEntity>;
  type ExpectedResult = { c: string | number; d: string };

  expectTypeOf<Result>().toEqualTypeOf<ExpectedResult>();
});
