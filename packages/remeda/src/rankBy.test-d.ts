import { describe, expectTypeOf, test } from "vitest";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { rankBy } from "./rankBy";

test("a literal item ranks among wider items", () => {
  expectTypeOf(pipe([5, 1, 3], rankBy(2, identity()))).toEqualTypeOf<number>();
});

test("an item wider than the items", () => {
  expectTypeOf(
    pipe([] as ("a" | "b")[], rankBy("c" as string, identity())),
  ).toEqualTypeOf<number>();
});

test("as a callback", () => {
  expectTypeOf(
    map([] as (readonly number[])[], rankBy(2, identity())),
  ).toEqualTypeOf<number[]>();
});

test("projections receive the items' type", () => {
  pipe(
    [{ a: 5 }, { a: 1 }],
    rankBy({ a: 2 }, (item) => {
      expectTypeOf(item).toEqualTypeOf<{ a: number }>();

      return item.a;
    }),
  );
});

test("an object item with a prop rule", () => {
  expectTypeOf(
    pipe([{ a: 5 }, { a: 1 }], rankBy({ a: 2 }, prop("a"))),
  ).toEqualTypeOf<number>();
});

describe("known issues!", () => {
  test("a literal item outside a tuple's literal items", () => {
    // The literal item is inferred as the item type of the whole pipe, and the
    // tuple's other literals aren't assignable to it.
    // @ts-expect-error [ts2322] -- The call is valid, `rankBy` ranks items that aren't in the data too.
    pipe([5, 1, 3] as const, rankBy(2, identity()));
  });
});
