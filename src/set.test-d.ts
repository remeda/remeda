import { set } from "./set";

describe("parameter enforcing", () => {
  it("prevents setting the wrong type", () => {
    // @ts-expect-error [ts2345] - 'number' is not assignable to 'string'.
    set({} as { a: string }, "a", 1);
  });

  it("doesn't expand narrow types", () => {
    // @ts-expect-error [ts2345] - 'mouse' is not assignable to 'cat' | 'dog'.
    set({} as { a: "cat" | "dog" }, "a", "mouse");
  });

  it("prevents setting `undefined` on optional fields", () => {
    // @ts-expect-error [ts2345] - 'a' cannot be `undefined`.
    set({} as { a?: string }, "a", undefined);
  });

  it("prevents setting an unknown prop", () => {
    // @ts-expect-error [ts2345] - 'b' does not exist on type '{ a: string; }'.
    set({ a: "foo" }, "b", "bar");
  });
});

it("narrows the prop type", () => {
  const result = set({} as { a?: string }, "a", "hello" as const);
  expectTypeOf(result).toEqualTypeOf<{ a: "hello" }>();
});

it("keeps the prop optional when the key isn't literal", () => {
  const result = set(
    {} as { a?: string; b?: number },
    "a" as "a" | "b",
    "foo" as const,
  );
  expectTypeOf(result).toEqualTypeOf<{ a?: string; b?: number | "foo" }>();
});

it("works on simple objects", () => {
  const result = set({} as Record<string, string>, "a", "foo" as const);
  expectTypeOf(result).toEqualTypeOf<{ [x: string]: string; a: "foo" }>();
});
