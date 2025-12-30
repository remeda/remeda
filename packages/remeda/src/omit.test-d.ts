import type { EmptyObject } from "type-fest";
import { expectTypeOf, test } from "vitest";
import { omit } from "./omit";
import { pipe } from "./pipe";

test("non existing prop", () => {
  // @ts-expect-error [ts2322] -- should not allow non existing props
  omit({ a: 1, b: 2, c: 3, d: 4 }, ["not", "in"] as const);
});

test("union data with common omitted prop", () => {
  expectTypeOf(
    omit({ a: 1 } as { a: number } | { a?: number; b: string }, ["a"]),
  ).toEqualTypeOf<EmptyObject | { b: string }>();
});

test("omit everything", () => {
  expectTypeOf(
    omit({ aProp: "p1", bProp: "p2" }, ["aProp", "bProp"]),
  ).toEqualTypeOf<EmptyObject>();
});

test("omit unbounded", () => {
  expectTypeOf(
    omit({} as Record<string, string>, ["" as string]),
  ).toEqualTypeOf<Record<string, string>>();
});

test("omit bounded from unbounded", () => {
  expectTypeOf(omit({} as Record<string, string>, ["a"])).toEqualTypeOf<{
    [key: string]: string;
    a: never;
  }>();
});

test("data-last", () => {
  expectTypeOf(
    pipe({ a: 1 } as { a: number } | { a?: number; b: string }, omit(["a"])),
  ).toEqualTypeOf<EmptyObject | { b: string }>();
});
