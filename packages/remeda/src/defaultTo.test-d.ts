import { expectTypeOf, test, describe } from "vitest";
import { defaultTo } from "./defaultTo";
import { pipe } from "./pipe";

describe("primitive types (string)", () => {
  describe("data-first", () => {
    test("undefinable primitive", () => {
      expectTypeOf(
        defaultTo("a" as string | undefined, "value" as string),
      ).toEqualTypeOf<string>();
    });

    test("nullable primitive", () => {
      expectTypeOf(
        defaultTo("a" as string | null, "value" as string),
      ).toEqualTypeOf<string>();
    });

    test("undefinable primitive with literal fallback", () => {
      expectTypeOf(
        defaultTo("a" as string | undefined, "value"),
      ).toEqualTypeOf<string>();
    });

    test("nullable primitive with literal fallback", () => {
      expectTypeOf(
        defaultTo("a" as string | null, "value"),
      ).toEqualTypeOf<string>();
    });

    test("undefinable literal union", () => {
      expectTypeOf(defaultTo("a" as "a" | "b" | undefined, "a")).toEqualTypeOf<
        "a" | "b"
      >();
    });

    test("nullable literal", () => {
      expectTypeOf(defaultTo("a" as "a" | "b" | null, "a")).toEqualTypeOf<
        "a" | "b"
      >();
    });

    describe("error cases", () => {
      test("non-nullish primitive", () => {
        // @ts-expect-error [ts2345] -- the fallback is never because it will
        // never be used.
        defaultTo("a" as string, "b" as string);
      });

      test("non-nullish literal union", () => {
        // @ts-expect-error [ts2345] -- the fallback is never because it will
        // never be used.
        defaultTo("a" as "a" | "b", "b");
      });

      test("incompatible primitive fallback", () => {
        // @ts-expect-error [ts2345] -- the fallback is incompatible with the
        // data type.
        defaultTo("a" as string | undefined, 1 as number);
      });

      test("incompatible literal fallback", () => {
        // @ts-expect-error [ts2345] -- the fallback is incompatible with the
        // data type.
        defaultTo("a" as "a" | "b" | undefined, "c");
      });

      test("incompatible widening", () => {
        // @ts-expect-error [ts2345] -- the fallback is incompatible with the
        // data type.
        defaultTo("a" as "a" | "b" | undefined, "c" as string);
      });
    });
  });

  describe("data-last", () => {
    test("undefinable primitive", () => {
      expectTypeOf(
        pipe("a" as string | undefined, defaultTo("value" as string)),
      ).toEqualTypeOf<string>();
    });

    test("nullable primitive", () => {
      expectTypeOf(
        pipe("a" as string | null, defaultTo("value" as string)),
      ).toEqualTypeOf<string>();
    });

    test("undefinable literal union", () => {
      expectTypeOf(
        pipe("a" as "a" | "b" | undefined, defaultTo("a")),
      ).toEqualTypeOf<"a" | "b">();
    });

    test("nullable literal", () => {
      expectTypeOf(pipe("a" as "a" | "b" | null, defaultTo("a"))).toEqualTypeOf<
        "a" | "b"
      >();
    });

    describe("error cases", () => {
      test("non-nullish primitive", () => {
        // @ts-expect-error [ts2345] -- the fallback is never because it will
        // never be used.
        pipe("a" as string, defaultTo("b" as string));
      });

      test("non-nullish literal union", () => {
        // @ts-expect-error [ts2345] -- the fallback is never because it will
        // never be used.
        pipe("a" as "a" | "b", defaultTo("b"));
      });

      test("incompatible primitive fallback", () => {
        // @ts-expect-error [ts2345] -- the fallback is incompatible with the
        // data type.
        pipe("a" as string | undefined, defaultTo(1 as number));
      });

      test("incompatible literal fallback", () => {
        // @ts-expect-error [ts2345] -- the fallback is incompatible with the
        // data type.
        pipe("a" as "a" | "b" | undefined, defaultTo("c"));
      });

      test("incompatible widening", () => {
        // @ts-expect-error [ts2345] -- the fallback is incompatible with the
        // data type.
        pipe("a" as "a" | "b" | undefined, defaultTo("c" as string));
      });
    });
  });
});

describe("object types", () => {
  describe("data-first", () => {
    test("undefinable object", () => {
      expectTypeOf(
        defaultTo({ a: "a" } as { a: string } | undefined, { a: "b" }),
      ).toEqualTypeOf<{ a: string }>();
    });

    test("nullable object", () => {
      expectTypeOf(
        defaultTo({ a: "a" } as { a: string } | null, { a: "b" }),
      ).toEqualTypeOf<{ a: string }>();
    });

    test("undefinable object with literal fallback", () => {
      expectTypeOf(
        defaultTo({ a: "a" } as { a: string } | undefined, { a: "b" } as const),
      ).toEqualTypeOf<{ a: string } | { readonly a: "b" }>();
    });

    test("nullable object with literal fallback", () => {
      expectTypeOf(
        defaultTo({ a: "a" } as { a: string } | null, { a: "b" } as const),
      ).toEqualTypeOf<{ a: string } | { readonly a: "b" }>();
    });

    describe("error cases", () => {
      test("non-nullish object", () => {
        // @ts-expect-error [ts2345] -- the fallback is never because it will
        // never be used.
        defaultTo({ a: "a" } as { a: string }, { a: "b" });
      });

      test("incompatible object fallback", () => {
        // @ts-expect-error [ts2322] -- the fallback is incompatible with the
        // data type.
        defaultTo({ a: "a" } as { a: "a" } | undefined, { a: "b" });
      });
    });
  });

  describe("data-last", () => {
    test("undefinable object", () => {
      expectTypeOf(
        pipe({ a: "a" } as { a: string } | undefined, defaultTo({ a: "b" })),
      ).toEqualTypeOf<{ a: string }>();
    });

    test("nullable object", () => {
      expectTypeOf(
        pipe({ a: "a" } as { a: string } | null, defaultTo({ a: "b" })),
      ).toEqualTypeOf<{ a: string }>();
    });

    describe("error cases", () => {
      test("non-nullish object", () => {
        // @ts-expect-error [ts2345] -- the fallback is never because it will
        // never be used.
        pipe({ a: "a" } as { a: string }, defaultTo({ a: "b" }));
      });

      test("incompatible object fallback", () => {
        // @ts-expect-error [ts2322] -- the fallback is incompatible with the
        // data type.
        pipe({ a: "a" } as { a: "a" } | undefined, defaultTo({ a: "b" }));
      });
    });
  });
});
