import { describe, expectTypeOf, test } from "vitest";
import { map } from "./map";
import { pipe } from "./pipe";
import { sortedLastIndex } from "./sortedLastIndex";

type Status = "active" | "inactive" | "pending";

describe("dataFirst", () => {
  test("a literal item among literal union items", () => {
    expectTypeOf(
      sortedLastIndex([] as Status[], "active"),
    ).toEqualTypeOf<number>();
  });

  test("an item wider than the items", () => {
    expectTypeOf(
      sortedLastIndex([] as ("a" | "b")[], "c"),
    ).toEqualTypeOf<number>();
  });

  test("an item narrower than the items", () => {
    expectTypeOf(
      sortedLastIndex([] as (bigint | number)[], 2),
    ).toEqualTypeOf<number>();
  });

  test("rejects an item unrelated to the items", () => {
    // @ts-expect-error [ts2345] -- The items aren't numbers like the item.
    sortedLastIndex(["a"], 2);
  });
});

describe("dataLast", () => {
  test("a literal item among wider items", () => {
    expectTypeOf(pipe([1, 3, 5], sortedLastIndex(2))).toEqualTypeOf<number>();
  });

  test("an item wider than the items", () => {
    expectTypeOf(
      pipe([] as ("a" | "b")[], sortedLastIndex("c")),
    ).toEqualTypeOf<number>();
  });

  test("as a callback", () => {
    expectTypeOf(
      map([] as (readonly number[])[], sortedLastIndex(2)),
    ).toEqualTypeOf<number[]>();
  });

  test("a literal item outside a tuple's literal items", () => {
    expectTypeOf(
      pipe([1, 3, 5] as const, sortedLastIndex(2)),
    ).toEqualTypeOf<number>();
  });

  test("a literal item inside a tuple's literal items", () => {
    expectTypeOf(
      pipe([1, 3, 5] as const, sortedLastIndex(3)),
    ).toEqualTypeOf<number>();
  });

  test("a literal item among literal union items", () => {
    expectTypeOf(
      pipe([] as Status[], sortedLastIndex("active")),
    ).toEqualTypeOf<number>();
  });

  test("an item narrower than the items", () => {
    expectTypeOf(
      pipe([] as (bigint | number)[], sortedLastIndex(2)),
    ).toEqualTypeOf<number>();
  });

  test("an undefined item among possibly undefined items", () => {
    expectTypeOf(
      pipe([] as (number | undefined)[], sortedLastIndex(undefined)),
    ).toEqualTypeOf<number>();
  });

  test("rejects an item unrelated to the items", () => {
    // @ts-expect-error [ts2322] -- The items aren't numbers like the item.
    pipe(["a"], sortedLastIndex(2));
  });
});
