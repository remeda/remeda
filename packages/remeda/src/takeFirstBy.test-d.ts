import { describe, expectTypeOf, test } from "vitest";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { takeFirstBy } from "./takeFirstBy";

describe("dataFirst", () => {
  test("a projection typed on a supertype of the items", () => {
    expectTypeOf(
      takeFirstBy(
        [{ a: 5, b: "x" }],
        1,
        (item: { readonly a: number }) => item.a,
      ),
    ).toEqualTypeOf<{ a: number; b: string }[]>();
  });
});

describe("dataLast", () => {
  test("a generic rule", () => {
    expectTypeOf(pipe([5, 1, 3], takeFirstBy(2, identity()))).toEqualTypeOf<
      number[]
    >();
  });

  test("a descending generic rule", () => {
    expectTypeOf(
      pipe([5, 1, 3], takeFirstBy(2, [identity(), "desc"])),
    ).toEqualTypeOf<number[]>();
  });

  test("as a callback", () => {
    expectTypeOf(
      map([] as (readonly number[])[], takeFirstBy(2, identity())),
    ).toEqualTypeOf<number[][]>();
  });

  test("projections receive the items' type", () => {
    pipe(
      [{ a: 5 }, { a: 1 }],
      takeFirstBy(1, (item) => {
        expectTypeOf(item).toEqualTypeOf<{ a: number }>();

        return item.a;
      }),
    );
  });

  test("a projection typed on a supertype of the items", () => {
    expectTypeOf(
      pipe(
        [{ a: 5, b: "x" }],
        takeFirstBy(1, (item: { readonly a: number }) => item.a),
      ),
    ).toEqualTypeOf<{ a: number; b: string }[]>();
  });

  test("a prop rule", () => {
    expectTypeOf(
      pipe([{ a: 5, b: "x" }], takeFirstBy(1, prop("a"))),
    ).toEqualTypeOf<{ a: number; b: string }[]>();
  });
});

describe("union of arrays", () => {
  test("data-first", () => {
    expectTypeOf(
      takeFirstBy([] as number[] | string[], 1, identity()),
    ).toEqualTypeOf<(number | string)[]>();
  });

  test("data-last", () => {
    expectTypeOf(
      pipe([] as number[] | string[], takeFirstBy(1, identity())),
    ).toEqualTypeOf<(number | string)[]>();
  });
});

// @see https://github.com/remeda/remeda/pull/1507
test("inline array of differently-shaped objects", () => {
  takeFirstBy([{ a: 1 }, { a: 2, b: "x" }], 1, (item) => {
    expectTypeOf(item.b).toEqualTypeOf<string | undefined>();

    return item.a;
  });
});
