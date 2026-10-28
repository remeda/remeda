import { describe, expectTypeOf, test } from "vitest";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { rankBy } from "./rankBy";

type Status = "active" | "inactive" | "pending";

type Task = {
  readonly priority: "high" | "low" | "medium";
  readonly score: number;
};

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

test("projections receive the item's type", () => {
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

test("a literal item outside a tuple's literal items", () => {
  expectTypeOf(
    pipe([5, 1, 3] as const, rankBy(2, identity())),
  ).toEqualTypeOf<number>();
});

test("a literal item inside a tuple's literal items", () => {
  expectTypeOf(
    pipe([5, 1, 3] as const, rankBy(5, identity())),
  ).toEqualTypeOf<number>();
});

test("a literal item among literal union items", () => {
  expectTypeOf(
    pipe([] as Status[], rankBy("active", identity())),
  ).toEqualTypeOf<number>();
});

test("a literal item with an inline projection", () => {
  expectTypeOf(
    pipe(
      [] as Status[],
      rankBy("active", (status) => status.length),
    ),
  ).toEqualTypeOf<number>();
});

test("an object item with a prop rule on a literal union prop", () => {
  expectTypeOf(
    pipe(
      [] as Task[],
      rankBy({ priority: "high", score: 2 }, prop("priority")),
    ),
  ).toEqualTypeOf<number>();
});

test("rejects an item unrelated to the items", () => {
  // @ts-expect-error [ts2322] -- The items aren't numbers like the item.
  pipe(["a"], rankBy(2, identity()));
});

test("rejects a prop rule on a prop the item lacks", () => {
  // @ts-expect-error [ts2345] -- The item has no `a` for the projection to read.
  pipe([{ a: 5, b: 1 }], rankBy({ b: 2 }, prop("a")));
});

describe("known issues!", () => {
  test("a literal item with a projection typed on literal union items", () => {
    // The type is inferred from the item alone, so a literal item widens to its
    // primitive (`string`), which the projection doesn't accept. Typing the
    // item (e.g., `"active" as Status`) avoids the widening.
    pipe(
      [] as Status[],
      // @ts-expect-error [ts2345] -- The call is valid, the projection accepts the item and every one of the items.
      rankBy("active", (status: Status) => status.length),
    );
  });
});
