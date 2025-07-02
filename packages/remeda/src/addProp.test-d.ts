import { expectTypeOf, test } from "vitest";
import { addProp } from "./addProp";

test("allows redefining prop types", () => {
  const result = addProp({} as { a: string }, "a", 1);

  expectTypeOf(result).toEqualTypeOf<{ a: number }>();
});

test("makes optional fields required", () => {
  const result = addProp({} as { a?: string }, "a", "hello");

  expectTypeOf(result).toEqualTypeOf<{ a: string }>();
});

test("allows setting an unknown prop", () => {
  const result = addProp({ a: "foo" }, "b", "bar");

  expectTypeOf(result).toEqualTypeOf<{ a: string; b: string }>();
});

test("sets literal unions as optional", () => {
  const result = addProp({} as { a: string }, "b" as "b" | "c", 123);

  expectTypeOf(result).toEqualTypeOf<{ a: string; b?: number; c?: number }>();
});

test("keeps the prop optional when the key isn't literal", () => {
  const result = addProp(
    {} as { a?: string; b?: number },
    "a" as "a" | "b",
    "foo" as const,
  );

  expectTypeOf(result).toEqualTypeOf<{ a?: string; b?: number | "foo" }>();
});

test("works on simple objects", () => {
  const result = addProp({} as Record<string, string>, "a", "foo" as const);

  expectTypeOf(result).toEqualTypeOf<{ [x: string]: string; a: "foo" }>();
});
