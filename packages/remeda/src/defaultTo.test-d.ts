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

    test("nullish primitive", () => {
      expectTypeOf(
        defaultTo("a" as string | null | undefined, "value"),
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

    test("nullish literal with literal fallback", () => {
      expectTypeOf(
        defaultTo("a" as "a" | "b" | null | undefined, "a"),
      ).toEqualTypeOf<"a" | "b">();
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
        defaultTo(
          "a" as string,
          // @ts-expect-error [ts2345] -- the fallback is never because it will
          // never be used.
          "b" as string,
        );
      });

      test("non-nullish literal union", () => {
        defaultTo(
          "a" as "a" | "b",
          // @ts-expect-error [ts2345] -- the fallback is never because it will
          // never be used.
          "b",
        );
      });

      test("incompatible primitive fallback", () => {
        defaultTo(
          "a" as string | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          1 as number,
        );
      });

      test("incompatible literal fallback", () => {
        defaultTo(
          "a" as "a" | "b" | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          "c",
        );
      });

      test("incompatible widening", () => {
        defaultTo(
          "a" as "a" | "b" | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          "c" as string,
        );
      });

      test("null for undefinable primitive", () => {
        defaultTo(
          "a" as string | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          null,
        );
      });

      test("undefined for nullable primitive", () => {
        defaultTo(
          "a" as string | null,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          undefined,
        );
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

    test("nullish primitive", () => {
      expectTypeOf(
        pipe("a" as string | null | undefined, defaultTo("value")),
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

    test("nullish literal", () => {
      expectTypeOf(
        pipe("a" as "a" | "b" | null | undefined, defaultTo("a")),
      ).toEqualTypeOf<"a" | "b">();
    });

    describe("error cases", () => {
      test("non-nullish primitive", () => {
        pipe(
          "a" as string,
          // @ts-expect-error [ts2345] -- the fallback is never because it will
          // never be used.
          defaultTo("b" as string),
        );
      });

      test("non-nullish literal union", () => {
        pipe(
          "a" as "a" | "b",
          // @ts-expect-error [ts2345] -- the fallback is never because it will
          // never be used.
          defaultTo("b"),
        );
      });

      test("incompatible primitive fallback", () => {
        pipe(
          "a" as string | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo(1 as number),
        );
      });

      test("incompatible literal fallback", () => {
        pipe(
          "a" as "a" | "b" | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo("c"),
        );
      });

      test("incompatible widening", () => {
        pipe(
          "a" as "a" | "b" | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo("c" as string),
        );
      });

      test("null for undefinable primitive", () => {
        pipe(
          "a" as string | undefined,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo(null),
        );
      });

      test("undefined for nullable primitive", () => {
        pipe(
          "a" as string | null,
          // @ts-expect-error [ts2345] -- the fallback is incompatible with the
          // data type.
          defaultTo(undefined),
        );
      });
    });
  });
});

describe("object types", () => {
  describe("data-first", () => {
    test("undefinable object", () => {
      expectTypeOf(
        defaultTo(
          { a: "a" } as { a: string } | undefined,
          { a: "b" } as { a: string },
        ),
      ).toEqualTypeOf<{ a: string }>();
    });

    test("nullable object", () => {
      expectTypeOf(
        defaultTo(
          { a: "a" } as { a: string } | null,
          { a: "b" } as { a: string },
        ),
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
        pipe(
          { a: "a" } as { a: string } | undefined,
          defaultTo({ a: "b" } as { a: string }),
        ),
      ).toEqualTypeOf<{ a: string }>();
    });

    test("nullable object", () => {
      expectTypeOf(
        pipe(
          { a: "a" } as { a: string } | null,
          defaultTo({ a: "b" } as { a: string }),
        ),
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

describe("nullish fallbacks", () => {
  describe("data-first", () => {
    test("undefined fallback", () => {
      expectTypeOf(
        defaultTo(
          { a: "a" } as { a: string } | undefined,
          { a: "b" } as { a: string } | undefined,
        ),
      ).toEqualTypeOf<{ a: string } | undefined>();
    });

    test("null fallback", () => {
      expectTypeOf(
        defaultTo(
          { a: "a" } as { a: string } | null,
          { a: "b" } as { a: string } | null,
        ),
      ).toEqualTypeOf<{ a: string } | null>();
    });

    test("nullish fallback", () => {
      expectTypeOf(
        defaultTo(
          { a: "a" } as { a: string } | null | undefined,
          { a: "b" } as { a: string } | null | undefined,
        ),
      ).toEqualTypeOf<{ a: string } | null | undefined>();
    });

    test("narrowing nullish fallback to undefined", () => {
      expectTypeOf(
        defaultTo(
          { a: "a" } as { a: string } | null | undefined,
          { a: "b" } as { a: string } | undefined,
        ),
      ).toEqualTypeOf<{ a: string } | undefined>();
    });

    test("narrowing nullish fallback to null", () => {
      expectTypeOf(
        defaultTo(
          { a: "a" } as { a: string } | null | undefined,
          { a: "b" } as { a: string } | null,
        ),
      ).toEqualTypeOf<{ a: string } | null>();
    });
  });

  describe("data-last", () => {
    test("undefined fallback", () => {
      expectTypeOf(
        pipe(
          { a: "a" } as { a: string } | undefined,
          defaultTo({ a: "b" } as { a: string } | undefined),
        ),
      ).toEqualTypeOf<{ a: string } | undefined>();
    });

    test("null fallback", () => {
      expectTypeOf(
        pipe(
          { a: "a" } as { a: string } | null,
          defaultTo({ a: "b" } as { a: string } | null),
        ),
      ).toEqualTypeOf<{ a: string } | null>();
    });

    test("nullish fallback", () => {
      expectTypeOf(
        pipe(
          { a: "a" } as { a: string } | null | undefined,
          defaultTo({ a: "b" } as { a: string } | null | undefined),
        ),
      ).toEqualTypeOf<{ a: string } | null | undefined>();
    });

    test("narrowing nullish fallback to undefined", () => {
      expectTypeOf(
        pipe(
          { a: "a" } as { a: string } | null | undefined,
          defaultTo({ a: "b" } as { a: string } | undefined),
        ),
      ).toEqualTypeOf<{ a: string } | undefined>();
    });

    test("narrowing nullish fallback to null", () => {
      expectTypeOf(
        pipe(
          { a: "a" } as { a: string } | null | undefined,
          defaultTo({ a: "b" } as { a: string } | null),
        ),
      ).toEqualTypeOf<{ a: string } | null>();
    });
  });
});
