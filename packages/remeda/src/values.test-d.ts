import { expectTypeOf, test } from "vitest";
import { doNothing } from "./doNothing";
import { values } from "./values";

test("should correctly types indexed types", () => {
  const result = values<Record<string, string>>({ a: "b" });

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

test("should correctly type functions", () => {
  const result = values(doNothing());

  expectTypeOf(result).toEqualTypeOf<Array<never>>();
});

test("should correctly type arrays", () => {
  const results = values([1, 2, 3]);

  expectTypeOf(results).toEqualTypeOf<Array<number>>();
});

test("should correctly type const arrays", () => {
  const results = values([1, 2, 3] as const);

  expectTypeOf(results).toEqualTypeOf<Array<1 | 2 | 3>>();
});

test("should correctly type objects", () => {
  const result = values({ a: true });

  expectTypeOf(result).toEqualTypeOf<Array<boolean>>();
});

test("should correctly type Records", () => {
  const result = values<Record<string, boolean>>({ a: true });

  expectTypeOf(result).toEqualTypeOf<Array<boolean>>();
});

test("should correctly type union of Records", () => {
  const result = values({
    a: "cat",
  } as Record<PropertyKey, "cat"> | Record<PropertyKey, "dog">);

  expectTypeOf(result).toEqualTypeOf<Array<"cat"> | Array<"dog">>();
});

test("should correctly type typed objects", () => {
  const result = values<{ type: "cat" | "dog"; age: number }>({
    type: "cat",
    age: 7,
  });

  expectTypeOf(result).toEqualTypeOf<Array<number | "cat" | "dog">>();
});

test("should skip symbol keys", () => {
  const result = values({ [Symbol("a")]: true, a: "b", 123: 456 });

  expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
});

test("should return a useful type when all keys are symbols", () => {
  const result = values({ [Symbol("a")]: true, [Symbol("b")]: "c" });

  expectTypeOf(result).toEqualTypeOf<Array<never>>();
});
