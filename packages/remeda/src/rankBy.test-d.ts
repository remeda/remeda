import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
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

type Animal = { readonly name: string };
type Dog = Animal & { readonly breed: string };

describe("dataFirst", () => {
  test("a literal item among wider items", () => {
    expectTypeOf(rankBy([5, 1, 3], 2, identity())).toEqualTypeOf<number>();
  });

  test("a literal item with a tuple of literal items", () => {
    expectTypeOf(
      rankBy([5, 1, 3] as const, 2, identity()),
    ).toEqualTypeOf<number>();
  });

  test("a literal item among literal union items", () => {
    expectTypeOf(
      rankBy([] as Status[], "active", identity()),
    ).toEqualTypeOf<number>();
  });

  test("a projection typed on literal union items", () => {
    expectTypeOf(
      rankBy([] as Status[], "active", (status: Status) => status.length),
    ).toEqualTypeOf<number>();
  });

  test("an item wider than the items", () => {
    expectTypeOf(
      rankBy([] as ("a" | "b")[], "c", identity()),
    ).toEqualTypeOf<number>();
  });

  test("rejects an item unrelated to the items", () => {
    // @ts-expect-error [ts2769] -- The items aren't numbers like the item.
    rankBy(["a"], 2, identity());
  });
});

describe("dataLast", () => {
  test("a literal item ranks among wider items", () => {
    expectTypeOf(
      pipe([5, 1, 3], rankBy(2, identity())),
    ).toEqualTypeOf<number>();
  });

  test("an item wider than the items", () => {
    expectTypeOf(
      pipe([] as ("a" | "b")[], rankBy("c", identity())),
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

  test("a literal item with a projection typed on literal union items", () => {
    expectTypeOf(
      pipe(
        [] as Status[],
        rankBy("active", (status: Status) => status.length),
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

  test("an undefined item among possibly undefined items", () => {
    expectTypeOf(
      pipe(
        [] as (number | undefined)[],
        rankBy(undefined, (item) => item ?? 0),
      ),
    ).toEqualTypeOf<number>();
  });

  test("a subtype item among supertype items", () => {
    expectTypeOf(
      pipe([] as Animal[], rankBy($typed<Dog>(), prop("name"))),
    ).toEqualTypeOf<number>();
  });

  test("rejects an item unrelated to the items", () => {
    // @ts-expect-error [ts2322] -- The items aren't numbers like the item.
    pipe(["a"], rankBy(2, identity()));
  });

  test("rejects a prop rule on a prop the item lacks", () => {
    // @ts-expect-error [ts2769] -- The item has no `a` for the projection to read.
    pipe([{ a: 5, b: 1 }], rankBy({ b: 2 }, prop("a")));
  });
});

describe("known issues!", () => {
  test("a projection typed on an item wider than the items", () => {
    // The item isn't one of the items, so `T` is inferred from the item alone,
    // widening the literal to its primitive (`string`), which the projection's
    // parameter doesn't accept. Typing the item (`"c" as "a" | "b" | "c"`)
    // avoids the widening, and an unannotated projection takes the widened
    // type.
    pipe(
      [] as ("a" | "b")[],
      // @ts-expect-error [ts2769] -- The call is valid, the projection accepts the item and every one of the items.
      rankBy("c", (letter: "a" | "b" | "c") => letter.length),
    );
  });
});
