import type { EmptyObject } from "type-fest";
import { keys } from "./keys";
import { pick } from "./pick";
import { pipe } from "./pipe";

describe("plain (bounded) object", () => {
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

  describe("array with a singular literal key", () => {
    test("only required picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"a">)).toEqualTypeOf<{
        a?: "required";
      }>();
    });

    test("only optional picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"b">)).toEqualTypeOf<{
        b?: "optional";
      }>();
    });

    test("only undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"c">)).toEqualTypeOf<{
        c?: "undefinable" | undefined;
      }>();
    });

    test("only optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"d">)).toEqualTypeOf<{
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  describe("array with union of literals", () => {
    test("required or optional picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"a" | "b">)).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("required or undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"a" | "c">)).toEqualTypeOf<{
        a?: "required";
        c?: "undefinable" | undefined;
      }>();
    });

    test("required or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"a" | "d">)).toEqualTypeOf<{
        a?: "required";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional or undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"b" | "c">)).toEqualTypeOf<{
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("optional or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"b" | "d">)).toEqualTypeOf<{
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("undefinable or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"c" | "d">)).toEqualTypeOf<{
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("required, optional or undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"a" | "b" | "c">)).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("required, optional or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"a" | "b" | "d">)).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("required, undefinable or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"a" | "c" | "d">)).toEqualTypeOf<{
        a?: "required";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional, undefinable or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as Array<"b" | "c" | "d">)).toEqualTypeOf<{
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
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

  describe("non-empty (prefix) arrays", () => {
    test("all literals, with overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as ["a", ...Array<"a">])).toEqualTypeOf<{
        a: "required";
      }>();
    });

    test("all literals, no overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as ["a", ...Array<"b">])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["b"] as ["b", ...Array<"a">])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("with unions, partial overlap", () => {
      expectTypeOf(
        pick(DATA, ["a"] as ["a", ...Array<"a" | "b">]),
      ).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["b"] as ["b", ...Array<"a" | "b">]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as ["a" | "b", ...Array<"a">]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as ["a" | "b", ...Array<"b">]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as ["a" | "b", ...Array<"b" | "c">]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("with unions, full overlap", () => {
      expectTypeOf(
        pick(DATA, ["a"] as ["a" | "b", ...Array<"a" | "b">]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("with unions, no overlap", () => {
      expectTypeOf(
        pick(DATA, ["a"] as ["a", ...Array<"b" | "c">]),
      ).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["b"] as ["b", ...Array<"a" | "c">]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as ["a" | "b", ...Array<"c">]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["b"] as ["b" | "c", ...Array<"a">]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as ["a" | "b", ...Array<"c" | "d">]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  describe("non-empty (suffix) arrays", () => {
    test("all literals, with overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as [...Array<"a">, "a"])).toEqualTypeOf<{
        a: "required";
      }>();
    });

    test("all literals, no overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as [...Array<"b">, "a"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["b"] as [...Array<"a">, "b"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("with unions, partial overlap", () => {
      expectTypeOf(
        pick(DATA, ["a"] as [...Array<"a" | "b">, "a"]),
      ).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["b"] as [...Array<"a" | "b">, "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as [...Array<"a">, "a" | "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as [...Array<"b">, "a" | "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as [...Array<"b" | "c">, "a" | "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("with unions, full overlap", () => {
      expectTypeOf(
        pick(DATA, ["a"] as [...Array<"a" | "b">, "a" | "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("with unions, no overlap", () => {
      expectTypeOf(
        pick(DATA, ["a"] as [...Array<"b" | "c">, "a"]),
      ).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["b"] as [...Array<"a" | "c">, "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as [...Array<"c">, "a" | "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["b"] as [...Array<"a">, "b" | "c"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as [...Array<"c" | "d">, "a" | "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  test.todo("strip readonlyness");
});

// @see https://github.com/remeda/remeda/issues/1128
describe("primitive (unbounded) records (Issue #1128)", () => {
  const DATA = {} as Record<string, "required">;
  const UNDEFINABLE = {} as Record<string, "undefinable" | undefined>;

  test("keys are empty", () => {
    expectTypeOf(pick(DATA, [])).toEqualTypeOf<EmptyObject>();
  });

  describe("keys are a fixed tuple", () => {
    test("singular literals", () => {
      const picks = ["a", "b"] as const;

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
    });

    test("union of non-overlapping literals", () => {
      const picks = ["a", "c"] as ["a" | "b", "c" | "d"];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
        c?: "required";
        d?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
        c?: "undefinable" | undefined;
        d?: "undefinable" | undefined;
      }>();
    });

    test("union of partially overlapping literals", () => {
      const picks = ["a", "b"] as ["a" | "b", "b" | "c"];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
        c?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
        c?: "undefinable" | undefined;
      }>();
    });

    test("union of fully overlapping literals", () => {
      const picks = ["a", "b"] as ["a" | "b", "a" | "b"];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
    });

    test("literals and overlapping union of literals", () => {
      const picks = ["a", "b"] as ["a", "a" | "b"];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
    });

    test("literals and non-overlapping union of literals", () => {
      const picks = ["a", "b"] as ["a", "b" | "c"];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
        c?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
        c?: "undefinable" | undefined;
      }>();
    });

    test("primitive keys", () => {
      const picks = ["a", "b"] as [string, string];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, "required">
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
    });

    test("primitive and singular literal keys", () => {
      const picks = ["a", "b"] as ["a", string];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, "required">
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
    });

    test("primitive and union of literal", () => {
      const picks = ["a", "b"] as ["a" | "b", string];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, "required">
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
    });
  });

  describe("keys are an array", () => {
    test("singular literals", () => {
      const picks = [] as Array<"a">;

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
      }>();
    });

    test("union of literals", () => {
      const picks = [] as Array<"a" | "b">;

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
    });

    test("primitives", () => {
      const picks = [] as Array<string>;

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, "required">
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
    });
  });

  describe("keys are a non-empty (prefix) array", () => {
    test("singular non-overlapping literals", () => {
      const picks = ["a"] as ["a", ...Array<"b">];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
    });

    test("singular overlapping literals", () => {
      const picks = ["a"] as ["a", ...Array<"a">];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
      }>();
    });

    test("union of non-overlapping literals", () => {
      const picks = ["a"] as ["a" | "b", ...Array<"c" | "d">];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
        c?: "required";
        d?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
        c?: "undefinable" | undefined;
        d?: "undefinable" | undefined;
      }>();
    });

    test("union of partially overlapping literals", () => {
      const picks = ["a"] as ["a" | "b", ...Array<"b" | "c">];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
        c?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
        c?: "undefinable" | undefined;
      }>();
    });

    test("union of fully overlapping literals", () => {
      const picks = ["a"] as ["a" | "b", ...Array<"a" | "b">];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
    });

    test("literals and overlapping union of literals", () => {
      const picks = ["a"] as ["a", ...Array<"a" | "b">];
      const alt = ["a"] as ["a" | "b", ...Array<"b">];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
      expectTypeOf(pick(DATA, alt)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, alt)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
    });

    test("literals and non-overlapping union of literals", () => {
      const picks = ["a"] as ["a", ...Array<"b" | "c">];
      const alt = ["a"] as ["a" | "b", ...Array<"c">];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
        c?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(pick(DATA, alt)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
        c?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, alt)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
        c?: "undefinable" | undefined;
      }>();
    });

    test("primitive keys", () => {
      const picks = ["a"] as [string, ...Array<string>];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, "required">
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
    });

    test("primitive and singular literal keys", () => {
      const picks = ["a"] as ["a", ...Array<string>];
      const alt = ["a"] as [string, ...Array<"a">];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, "required">
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
      expectTypeOf(pick(DATA, alt)).toEqualTypeOf<Record<string, "required">>();
      expectTypeOf(pick(UNDEFINABLE, alt)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
    });

    test("primitive and union of literal", () => {
      const picks = ["a"] as ["a" | "b", ...Array<string>];
      const alt = ["a"] as [string, ...Array<"a" | "b">];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, "required">
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
      expectTypeOf(pick(DATA, alt)).toEqualTypeOf<Record<string, "required">>();
      expectTypeOf(pick(UNDEFINABLE, alt)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
    });
  });

  test.todo("strip readonlyness");
});

describe.todo("unions of data objects and of keys arrays");

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
