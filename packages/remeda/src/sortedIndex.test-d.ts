import { describe, expectTypeOf, test } from "vitest";
import { map } from "./map";
import { pipe } from "./pipe";
import { sortedIndex } from "./sortedIndex";

type Status = "active" | "inactive" | "pending";

describe("dataFirst", () => {
  test("a literal item among literal union items", () => {
    expectTypeOf(sortedIndex([] as Status[], "active")).toEqualTypeOf<number>();
  });

  test("an item wider than the items", () => {
    expectTypeOf(sortedIndex([] as ("a" | "b")[], "c")).toEqualTypeOf<number>();
  });

  test("an item narrower than the items", () => {
    expectTypeOf(
      sortedIndex([] as (bigint | number)[], 2),
    ).toEqualTypeOf<number>();
  });

  test("rejects an item unrelated to the items", () => {
    // @ts-expect-error [ts2345] -- The items aren't numbers like the item.
    sortedIndex(["a"], 2);
  });
});

describe("dataLast", () => {
  test("a literal item among wider items", () => {
    expectTypeOf(pipe([1, 3, 5], sortedIndex(2))).toEqualTypeOf<number>();
  });

  test("an item wider than the items", () => {
    expectTypeOf(
      pipe([] as ("a" | "b")[], sortedIndex("c")),
    ).toEqualTypeOf<number>();
  });

  test("as a callback", () => {
    expectTypeOf(
      map([] as (readonly number[])[], sortedIndex(2)),
    ).toEqualTypeOf<number[]>();
  });

  test("a literal item outside a tuple's literal items", () => {
    expectTypeOf(
      pipe([1, 3, 5] as const, sortedIndex(2)),
    ).toEqualTypeOf<number>();
  });

  test("a literal item inside a tuple's literal items", () => {
    expectTypeOf(
      pipe([1, 3, 5] as const, sortedIndex(3)),
    ).toEqualTypeOf<number>();
  });

  test("a literal item among literal union items", () => {
    expectTypeOf(
      pipe([] as Status[], sortedIndex("active")),
    ).toEqualTypeOf<number>();
  });

  test("an item narrower than the items", () => {
    expectTypeOf(
      pipe([] as (bigint | number)[], sortedIndex(2)),
    ).toEqualTypeOf<number>();
  });

  test("an undefined item among possibly undefined items", () => {
    expectTypeOf(
      pipe([] as (number | undefined)[], sortedIndex(undefined)),
    ).toEqualTypeOf<number>();
  });

  test("rejects an item unrelated to the items", () => {
    // @ts-expect-error [ts2322] -- The items aren't numbers like the item.
    pipe(["a"], sortedIndex(2));
  });
});
