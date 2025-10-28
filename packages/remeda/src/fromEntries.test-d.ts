import type { EmptyObject } from "type-fest";
import { describe, expectTypeOf, test } from "vitest";
import { fromEntries } from "./fromEntries";

test("no entries", () => {
  expectTypeOf(fromEntries([] as const)).toEqualTypeOf<EmptyObject>();
});

describe("one entry of single type", () => {
  describe("key is of single type", () => {
    test("literal", () => {
      expectTypeOf(fromEntries([["a", 1]] as const)).toEqualTypeOf<{ a: 1 }>();
    });

    test("primitive", () => {
      expectTypeOf(fromEntries([["a", 1]])).toEqualTypeOf<
        Record<string, number>
      >();
    });

    test("unbounded", () => {
      expectTypeOf(fromEntries([["pre_" as `pre_${number}`, 1]])).toEqualTypeOf<
        Record<`pre_${number}`, number>
      >();
    });
  });

  describe("key is union of same type", () => {
    test("literal keys", () => {
      expectTypeOf(fromEntries([["a" as "a" | "b" | "c", 1]])).toEqualTypeOf<
        { a: number } | { b: number } | { c: number }
      >();
    });

    test("primitive keys", () => {
      expectTypeOf(fromEntries([["a" as string | number, 1]])).toEqualTypeOf<
        Record<string, number> | Record<number, number>
      >();
    });

    test("unbounded keys", () => {
      expectTypeOf(
        fromEntries([["pre_1" as `pre_${number}` | `${number}_post`, 1]]),
      ).toEqualTypeOf<
        Record<`pre_${number}`, number> | Record<`${number}_post`, number>
      >();
    });
  });

  describe("key is union of different types", () => {
    test("literal and primitive", () => {
      expectTypeOf(fromEntries([["a" as "a" | number, 1]])).toEqualTypeOf<
        { a: number } | Record<number, number>
      >();
    });

    test("literal and unbounded", () => {
      expectTypeOf(
        fromEntries([["a" as "a" | `pre_${number}`, 1]]),
      ).toEqualTypeOf<{ a: number } | Record<`pre_${number}`, number>>();
    });

    test("primitive and unbounded", () => {
      expectTypeOf(
        fromEntries([[123 as number | `pre_${number}`, 1]]),
      ).toEqualTypeOf<
        Record<number, number> | Record<`pre_${number}`, number>
      >();
    });
  });
});

describe("array of single type", () => {
  describe("key is of single type", () => {
    test("literal", () => {
      expectTypeOf(fromEntries([] as Array<["a", 1]>)).toEqualTypeOf<{
        a?: 1;
      }>();
    });

    test("primitive", () => {
      expectTypeOf(fromEntries([] as Array<[string, number]>)).toEqualTypeOf<
        Record<string, number>
      >();
    });

    test("unbounded", () => {
      expectTypeOf(
        fromEntries([] as Array<[`pre_${number}`, number]>),
      ).toEqualTypeOf<Record<`pre_${number}`, number>>();
    });
  });

  describe("key is union of same type", () => {
    test("literal keys", () => {
      expectTypeOf(
        fromEntries([] as Array<["a" | "b" | "c", number]>),
      ).toEqualTypeOf<{ a?: number; b?: number; c?: number }>();
    });

    test("primitive keys", () => {
      expectTypeOf(
        fromEntries([] as Array<[string | number, number]>),
      ).toEqualTypeOf<Record<string | number, number>>();
    });

    test("unbounded keys", () => {
      expectTypeOf(
        fromEntries([] as Array<[`pre_${number}` | `${number}_post`, number]>),
      ).toEqualTypeOf<Record<`pre_${number}` | `${number}_post`, number>>();
    });
  });

  describe("key is union of different types", () => {
    test("literal and primitive", () => {
      expectTypeOf(
        fromEntries([] as Array<["a" | number, number]>),
      ).toEqualTypeOf<{ a?: number; [key: number]: number }>();
    });

    test("literal and unbounded", () => {
      expectTypeOf(
        fromEntries([] as Array<["a" | `pre_${number}`, number]>),
      ).toEqualTypeOf<{ a?: number; [key: `pre_${number}`]: number }>();
    });

    test("primitive and unbounded", () => {
      expectTypeOf(
        fromEntries([] as Array<[number | `pre_${number}`, number]>),
      ).toEqualTypeOf<Record<number | `pre_${number}`, number>>();
    });
  });
});
