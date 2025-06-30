import type { EmptyObject } from "type-fest";
import { keys } from "./keys";
import { pick } from "./pick";
import { pipe } from "./pipe";

describe("plain object", () => {
  const DATA = { a: "required", c: undefined } as {
    a: "required";
    b?: "optional";
    c: "undefinable" | undefined;
    d?: "optional-undefinable" | undefined;
  };

  test("keys are empty", () => {
    expectTypeOf(pick(DATA, [])).toEqualTypeOf<EmptyObject>();
  });

  describe("keys are fixed tuple of singular literals", () => {
    test("only required picked", () => {
      expectTypeOf(pick(DATA, ["a"])).toEqualTypeOf<{
        a: "required";
      }>();
    });

    test("only optional picked", () => {
      expectTypeOf(pick(DATA, ["b"])).toEqualTypeOf<{
        b?: "optional";
      }>();
    });

    test("only undefinable picked", () => {
      expectTypeOf(pick(DATA, ["c"])).toEqualTypeOf<{
        c: "undefinable" | undefined;
      }>();
    });

    test("only optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["d"])).toEqualTypeOf<{
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("require and optional picked", () => {
      expectTypeOf(pick(DATA, ["a", "b"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
    });

    test("required and undefinable picked", () => {
      expectTypeOf(pick(DATA, ["a", "c"])).toEqualTypeOf<{
        a: "required";
        c: "undefinable" | undefined;
      }>();
    });

    test("required and optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["a", "d"])).toEqualTypeOf<{
        a: "required";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional and undefinable picked", () => {
      expectTypeOf(pick(DATA, ["b", "c"])).toEqualTypeOf<{
        b?: "optional";
        c: "undefinable" | undefined;
      }>();
    });

    test("optional and optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["b", "d"])).toEqualTypeOf<{
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("undefinable and optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["c", "d"])).toEqualTypeOf<{
        c: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all picked except optional-undefinable", () => {
      expectTypeOf(pick(DATA, ["a", "b", "c"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        c: "undefinable" | undefined;
      }>();
    });

    test("all picked except undefinable", () => {
      expectTypeOf(pick(DATA, ["a", "b", "d"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all picked except optional", () => {
      expectTypeOf(pick(DATA, ["a", "c", "d"])).toEqualTypeOf<{
        a: "required";
        c: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all picked except required", () => {
      expectTypeOf(pick(DATA, ["b", "c", "d"])).toEqualTypeOf<{
        b?: "optional";
        c: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all picked", () => {
      expectTypeOf(pick(DATA, ["a", "b", "c", "d"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        c: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  describe("keys is a single item which is a union of literals", () => {
    test("required or optional picked", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "b"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("required or undefinable picked", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "c"])).toEqualTypeOf<{
        a?: "required";
        c?: "undefinable" | undefined;
      }>();
    });

    test("required or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "d"])).toEqualTypeOf<{
        a?: "required";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional or undefinable picked", () => {
      expectTypeOf(pick(DATA, ["b" as "b" | "c"])).toEqualTypeOf<{
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("optional or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["b" as "b" | "d"])).toEqualTypeOf<{
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("undefinable or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["c" as "c" | "d"])).toEqualTypeOf<{
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("required, optional or undefinable picked", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "b" | "c"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("required, optional or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "b" | "d"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("required, undefinable or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "c" | "d"])).toEqualTypeOf<{
        a?: "required";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional, undefinable or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, ["b" as "b" | "c" | "d"])).toEqualTypeOf<{
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all picked", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "b" | "c" | "d"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  describe("multiple picked elements typed as union of keys", () => {
    test("with partial overlap", () => {
      expectTypeOf(
        pick(DATA, ["a" as "a" | "b", "b" as "b" | "c"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("with full overlap", () => {
      expectTypeOf(
        pick(DATA, ["a" as "a" | "b", "b" as "a" | "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("without overlap", () => {
      expectTypeOf(
        pick(DATA, ["a" as "a" | "b", "c" as "c" | "d"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  describe("combination of literals and union keys", () => {
    test("with partial overlap", () => {
      expectTypeOf(pick(DATA, ["a", "b" as "a" | "b"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
    });

    test("without overlap", () => {
      expectTypeOf(pick(DATA, ["a", "b" as "b" | "c"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });
  });

  describe("array of keys", () => {
    test("single literal item type", () => {
      expectTypeOf(pick(DATA, [] as Array<"a">)).toEqualTypeOf<{
        a?: "required";
      }>();
    });

    test("union of literals item type", () => {
      expectTypeOf(pick(DATA, [] as Array<"a" | "b">)).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("all keys", () => {
      expectTypeOf(
        pick(DATA, [] as Array<"a" | "b" | "c" | "d">),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });
});

// @see https://github.com/remeda/remeda/issues/1128
describe("unbounded records (Issue #1128)", () => {
  test("single key", () => {
    expectTypeOf(pick({} as Record<string, "world">, ["hello"])).toEqualTypeOf<{
      hello?: "world";
    }>();
  });

  test("multiple keys", () => {
    expectTypeOf(
      pick({} as Record<string, 123>, ["hello", "world"]),
    ).toEqualTypeOf<{ hello?: 123; world?: 123 }>();
  });

  test("array of primitive keys", () => {
    expectTypeOf(
      pick({} as Record<string, "world">, [] as Array<string>),
    ).toEqualTypeOf<Record<string, "world">>();
  });

  test("array of literals", () => {
    expectTypeOf(
      pick({} as Record<string, 123>, [] as Array<"hello" | "world">),
    ).toEqualTypeOf<{ hello: 123; world: 123 }>();
  });
});

describe("data first", () => {
  test("non existing prop", () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    pick({ a: 1, b: 2, c: 3, d: 4 }, ["not", "in"]);
  });

  test("union with common prop", () => {
    expectTypeOf(
      pick({ a: 1 } as { a: number } | { a?: number; b: string }, ["a"]),
    ).toEqualTypeOf<Pick<{ a: number } | { a?: number; b: string }, "a">>();
  });

  describe("infers the key types from the keys array (issue #886)", () => {
    test("base", () => {
      expectTypeOf(
        pick({ foo: "hello", bar: "world" }, ["foo"]),
      ).toEqualTypeOf<{ foo: string }>();
    });

    test("wrapped", () => {
      expectTypeOf(
        keys(pick({ foo: "hello", bar: "world" }, ["foo"])),
      ).toEqualTypeOf<Array<"foo">>();
    });

    test("with const key", () => {
      expectTypeOf(
        keys(pick({ foo: "hello", bar: "world" }, ["foo"] as const)),
      ).toEqualTypeOf<Array<"foo">>();
    });
  });
});

it("handles optional keys (issue #911)", () => {
  expectTypeOf(
    pick({ foo: "hello", bar: "world" }, [] as Array<"foo" | "bar">),
  ).toEqualTypeOf<{ foo?: string; bar?: string }>();
});

describe("data last", () => {
  test("non existing prop", () => {
    pipe(
      { a: 1, b: 2, c: 3, d: 4 },
      // @ts-expect-error [ts2345] -- should not allow non existing props
      pick(["not", "in"]),
    );
  });

  test("union with common prop", () => {
    expectTypeOf(
      pipe({ a: 1 } as { a: number } | { a?: number; b: string }, pick(["a"])),
    ).toEqualTypeOf<Pick<{ a: number } | { a?: number; b: string }, "a">>();
  });
});

test("multiple keys", () => {
  expectTypeOf(pipe({ a: "p1", b: "p2" }, pick(["a", "b"]))).toEqualTypeOf<{
    a: string;
    b: string;
  }>();
});

test("support inherited properties", () => {
  class BaseClass {
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this -- This is fine...
    public testProp(): string {
      return "abc";
    }
  }
  class TestClass extends BaseClass {}

  expectTypeOf(pick(new TestClass(), ["testProp"])).toEqualTypeOf<{
    testProp: () => string;
  }>();
});
