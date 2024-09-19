import { pipe } from "./pipe";
import { splice } from "./splice";

describe("arrays", () => {
  it("reflects the type of `items` in the return value", () => {
    const items: Array<number> = [];
    const result = splice(items, 0, 0, []);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("reflects the type of `replacement` in the return value", () => {
    const replacement: Array<number> = [];
    const result = splice([], 0, 0, replacement);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("reflects the type of `replacement` in the return value (data-last)", () => {
    const replacement: Array<number> = [];
    const result = pipe([], splice(0, 0, replacement));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });
});

describe("tuples", () => {
  it("removes correctly", () => {
    expectTypeOf(splice([1, 2, 3] as const, 0, 1, [4] as const)).toEqualTypeOf<
      [4, 2, 3]
    >();
    expectTypeOf(splice([1, 2, 3] as const, -1, 1, [])).toEqualTypeOf<[1, 2]>();
  });
});
