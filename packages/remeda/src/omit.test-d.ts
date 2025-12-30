import type { EmptyObject } from "type-fest";
import { expectTypeOf, test } from "vitest";
import { omit } from "./omit";
import { pipe } from "./pipe";

test("empty input object", () => {
  expectTypeOf(omit({} as EmptyObject, [])).toEqualTypeOf<EmptyObject>();
});

test("empty keys tuple", () => {
  expectTypeOf(omit({ a: 1, b: 2 }, [] as const)).toEqualTypeOf<{
    a: number;
    b: number;
  }>();
});

test("simple bounded object and keys tuple", () => {
  expectTypeOf(omit({ a: 1, b: 2 }, ["a"])).toEqualTypeOf<{ b: number }>();
});

test("union data with common omitted prop", () => {
  expectTypeOf(
    omit({ a: 1 } as { a: number } | { a?: number; b: string }, ["a"]),
  ).toEqualTypeOf<EmptyObject | { b: string }>();
});

test("union data with distinct omitted props on all elements", () => {
  expectTypeOf(
    omit({ a: "hello" } as { a: string } | { b: string }, ["a", "b"]),
  ).toEqualTypeOf<EmptyObject>();
});

test("union data with distinct omitted prop on a single element", () => {
  expectTypeOf(
    omit({ a: "hello" } as { a: string } | { b: string }, ["a"]),
  ).toEqualTypeOf<EmptyObject | { b: string }>();
});

test("omit everything", () => {
  expectTypeOf(
    omit({ a: "hello", b: "world" }, ["a", "b"]),
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

// @see https://github.com/remeda/remeda/issues/1186
test("unbounded keys with simple array (issue #1186)", () => {
  expectTypeOf(
    omit({} as Record<string, number>, [] as Array<string>),
  ).toEqualTypeOf<Record<string, number>>();
});

test("readonly data becomes writable", () => {
  expectTypeOf(omit({ a: 1, b: 2 } as const, ["a"])).toEqualTypeOf<{ b: 2 }>();
});

test("keys with union type", () => {
  expectTypeOf(omit({ a: 1, b: 2, c: 3 }, ["a" as "a" | "b"])).toEqualTypeOf<{
    a?: number;
    b?: number;
    c: number;
  }>();
});

test("non existing prop", () => {
  // @ts-expect-error [ts2322] -- should not allow non existing props
  omit({ a: 1, b: 2, c: 3, d: 4 }, ["not", "in"] as const);
});
