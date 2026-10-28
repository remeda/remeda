import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
import { difference } from "./difference";
import { map } from "./map";
import { pipe } from "./pipe";

type Status = "active" | "inactive" | "pending";

type Task = {
  readonly priority: "high" | "low" | "medium";
  readonly score: number;
};

type Animal = { readonly name: string };
type Dog = Animal & { readonly breed: string };

describe("dataFirst", () => {
  test("an undefined value among possibly undefined items", () => {
    expectTypeOf(
      difference([] as (number | undefined)[], [undefined]),
    ).toEqualTypeOf<(number | undefined)[]>();
  });

  test("rejects values unrelated to the items", () => {
    // @ts-expect-error [ts2322] -- The values aren't strings like the items.
    difference(["a"], [2]);
  });
});

describe("dataLast", () => {
  test("a literal value among wider items", () => {
    expectTypeOf(pipe([1, 2, 3], difference([2]))).toEqualTypeOf<number[]>();
  });

  test("values wider than the items", () => {
    expectTypeOf(pipe([] as ("a" | "b")[], difference(["c"]))).toEqualTypeOf<
      ("a" | "b")[]
    >();
  });

  test("as a callback", () => {
    expectTypeOf(
      map([] as (readonly number[])[], difference([2])),
    ).toEqualTypeOf<number[][]>();
  });

  test("as a callback with values wider than the items", () => {
    expectTypeOf(
      map([] as (readonly ("a" | "b")[])[], difference(["c"])),
    ).toEqualTypeOf<("a" | "b")[][]>();
  });

  test("a literal value outside a tuple's literal items", () => {
    expectTypeOf(pipe([1, 3, 5] as const, difference([2]))).toEqualTypeOf<
      (1 | 3 | 5)[]
    >();
  });

  test("a literal value inside a tuple's literal items", () => {
    expectTypeOf(pipe([1, 3, 5] as const, difference([3]))).toEqualTypeOf<
      (1 | 3 | 5)[]
    >();
  });

  test("a literal value among literal union items", () => {
    expectTypeOf(pipe([] as Status[], difference(["active"]))).toEqualTypeOf<
      Status[]
    >();
  });

  test("literal union values narrower than the items", () => {
    expectTypeOf(
      pipe([] as Status[], difference([] as ("active" | "pending")[])),
    ).toEqualTypeOf<Status[]>();
  });

  test("no values", () => {
    expectTypeOf(pipe([] as Status[], difference([]))).toEqualTypeOf<
      Status[]
    >();
  });

  test("an object value with a literal union prop", () => {
    expectTypeOf(
      pipe([] as Task[], difference([{ priority: "high", score: 2 }])),
    ).toEqualTypeOf<Task[]>();
  });

  test("an undefined value among possibly undefined items", () => {
    expectTypeOf(
      pipe([] as (number | undefined)[], difference([undefined])),
    ).toEqualTypeOf<(number | undefined)[]>();
  });

  test("a subtype value among supertype items", () => {
    expectTypeOf(
      pipe([] as Animal[], difference([$typed<Dog>()])),
    ).toEqualTypeOf<Animal[]>();
  });

  test("rejects values unrelated to the items", () => {
    // @ts-expect-error [ts2322] -- The items aren't numbers like the values.
    pipe(["a"], difference([2]));
  });
});
