import type { PickUnionValue } from "./PickUnionValue";

it("should get the union of the involved types when there are shared keys with different types", () => {
  type A = { b: string };
  type B = { a: string };
  type C = { a: number };
  type UnionEntity = A | B | C;

  type ExpectedResult = string | number;

  type Result = PickUnionValue<UnionEntity, "a">;

  expectTypeOf<Result>().toEqualTypeOf<ExpectedResult>();
});

it("should return just the single type when only one member of the union has the key", () => {
  type A = { b: boolean };
  type B = { a: string };
  type C = { a: number };
  type UnionEntity = A | B | C;

  type ExpectedResult = boolean;

  type Result = PickUnionValue<UnionEntity, "b">;

  expectTypeOf<Result>().toEqualTypeOf<ExpectedResult>();
});

it("should successfully extract undefined on a shared key", () => {
  type A = { b: boolean };
  type B = { a: string };
  type C = { a: undefined };
  type UnionEntity = A | B | C;

  type ExpectedResult = string | undefined;

  type Result = PickUnionValue<UnionEntity, "a">;

  expectTypeOf<Result>().toEqualTypeOf<ExpectedResult>();
});

it("should include undefined on a partially optional shared key", () => {
  type A = { b: boolean };
  type B = { a: string };
  type C = { a?: number };
  type UnionEntity = A | B | C;

  type ExpectedResult = string | number | undefined;

  type Result = PickUnionValue<UnionEntity, "a">;

  expectTypeOf<Result>().toEqualTypeOf<ExpectedResult>();
});
