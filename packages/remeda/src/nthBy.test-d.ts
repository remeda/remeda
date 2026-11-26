import { expectTypeOf, test } from "vitest";
import { identity } from "./identity";
import { nthBy } from "./nthBy";

test("works with regular arrays", () => {
  const result = nthBy([1, 2, 3], 0, identity());

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("works with negative indices", () => {
  const result = nthBy([1, 2, 3], -1, identity());

  expectTypeOf(result).toEqualTypeOf<number | undefined>();
});

test("works with tuples", () => {
  const data: [string, boolean, number] = ["a", true, 1];
  const result = nthBy(data, 1, identity());

  expectTypeOf(result).toEqualTypeOf<boolean | number | string | undefined>();
});

// @see https://github.com/remeda/remeda/pull/1507
test("inline array of differently-shaped objects", () => {
  nthBy([{ a: 1 }, { a: 2, b: "x" }], 0, (item) => {
    expectTypeOf(item.b).toEqualTypeOf<string | undefined>();

    return item.a;
  });
});
