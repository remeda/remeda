import { describe, expectTypeOf, test } from "vitest";
import { dropFirstBy } from "./dropFirstBy";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";

describe("dataFirst", () => {
  test("a projection typed on a supertype of the items", () => {
    expectTypeOf(
      dropFirstBy([{ a: 5, b: "x" }], 1, ({ a }: { readonly a: number }) => a),
    ).toEqualTypeOf<{ a: number; b: string }[]>();
  });
});

describe("dataLast", () => {
  test("a generic rule", () => {
    expectTypeOf(pipe([5, 1, 3], dropFirstBy(2, identity()))).toEqualTypeOf<
      number[]
    >();
  });

  test("a descending generic rule", () => {
    expectTypeOf(
      pipe([5, 1, 3], dropFirstBy(2, [identity(), "desc"])),
    ).toEqualTypeOf<number[]>();
  });

  test("as a callback", () => {
    expectTypeOf(
      map([] as (readonly number[])[], dropFirstBy(2, identity())),
    ).toEqualTypeOf<number[][]>();
  });

  test("projections receive the items' type", () => {
    pipe(
      [{ a: 5 }, { a: 1 }],
      dropFirstBy(1, (item) => {
        expectTypeOf(item).toEqualTypeOf<{ a: number }>();

        return item.a;
      }),
    );
  });

  test("a projection typed on a supertype of the items", () => {
    expectTypeOf(
      pipe(
        [{ a: 5, b: "x" }],
        dropFirstBy(1, ({ a }: { readonly a: number }) => a),
      ),
    ).toEqualTypeOf<{ a: number; b: string }[]>();
  });

  test("a prop rule", () => {
    expectTypeOf(
      pipe([{ a: 5, b: "x" }], dropFirstBy(1, prop("a"))),
    ).toEqualTypeOf<{ a: number; b: string }[]>();
  });
});
