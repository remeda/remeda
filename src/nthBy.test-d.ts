import { identity } from "./identity";
import { nthBy } from "./nthBy";

it("works with regular arrays", () => {
  const result = nthBy([1, 2, 3], 0, identity());

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

it("works with negative indices", () => {
  const result = nthBy([1, 2, 3], -1, identity());

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

it("works with tuples", () => {
  const data: [string, boolean, number] = ["a", true, 1];
  const result = nthBy(data, 1, identity());

  expectTypeOf(result).toEqualTypeOf<boolean | number | string | undefined>();
});
