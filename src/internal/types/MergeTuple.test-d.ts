import type { MergeTuple } from "./MergeTuple";

describe("the fields of the rightmost item should have the greatest priority in overrides", () => {
  it("2 items", () => {
    type A1 = { a: 1; b: 1 };
    type A2 = { a: 2 };
    type Input = [A1, A2];
    type ExpectedType = { a: 2; b: 1 };
    type Result = MergeTuple<Input>;

    expectTypeOf<Result>().toEqualTypeOf<ExpectedType>();
  });

  it("3 items", () => {
    type A1 = { a: 1; b: 1 };
    type A2 = { a: 2 };
    type A3 = { a: 3 };
    type Input = [A1, A2, A3];
    type ExpectedType = { a: 3; b: 1 };

    type Result = MergeTuple<Input>;

    expectTypeOf<Result>().toEqualTypeOf<ExpectedType>();
  });
});
