import type { EmptyObject } from "type-fest";
import { keys } from "./keys";
import { pick } from "./pick";

describe("plain (bounded) object", () => {
  const DATA = { a: "required", c: undefined } as {
    a: "required";
    b?: "optional";
    c: "undefinable" | undefined;
    d?: "optional-undefinable" | undefined;
  };

  it("enforces props can be picked from object", () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    pick(DATA, ["not", "in"]);
  });

  it("doesn't widen type for props", () => {
    // @ts-expect-error [ts2345] -- string is too wide for object
    pick(DATA, ["a"] as [string]);
  });

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
});

// @see https://github.com/remeda/remeda/issues/1128
describe("primitive (unbounded) records (Issue #1128)", () => {
  const DATA = {} as Record<string, "required">;
  const UNDEFINABLE = {} as Record<string, "undefinable" | undefined>;

  it("enforces props can be picked from object", () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    pick(DATA, [1, 2]);
  });

  it("doesn't widen type for props", () => {
    // @ts-expect-error [ts2345] -- string is too wide for object
    pick(DATA, ["a"] as [PropertyKey]);
  });

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

  it("narrows on unbounded keys but doesn't make it partial", () => {
    const picks = [] as Array<`prefix_${string}`>;

    expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
      Record<`prefix_${string}`, "required">
    >();
    expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
      Record<`prefix_${string}`, "undefinable" | undefined>
    >();
  });
});

describe("data is a union of object types", () => {
  describe("both picked props exist in both objects", () => {
    test("same type", () => {
      expectTypeOf(
        pick(
          { a: "a", b: "b", c: "c" } as
            | { a: "a"; b: "b"; c: "c" }
            | { a: "a"; b: "b"; d: "d" },
          ["a", "b"],
        ),
      ).toEqualTypeOf<{ a: "a"; b: "b" }>();
    });

    test("different optionality", () => {
      expectTypeOf(
        pick(
          { a: "a", b: "b", c: "c" } as
            | { a: "a"; b: "b"; c: "c" }
            | { a?: "a"; b: "b"; d: "d" },
          ["a", "b"],
        ),
      ).toEqualTypeOf<{ a: "a"; b: "b" } | { a?: "a"; b: "b" }>();
    });

    test("different types", () => {
      expectTypeOf(
        pick(
          { a: "a", b: "b", c: "c" } as
            | { a: "a"; b: "b"; c: "c" }
            | { a: "alt_a"; b: "alt_b"; d: "d" },
          ["a", "b"],
        ),
      ).toEqualTypeOf<{ a: "a"; b: "b" } | { a: "alt_a"; b: "alt_b" }>();
    });
  });

  describe("partial overlap of picked props", () => {
    test("same type", () => {
      const DATA = { a: "a", b: "b", c: "c" } as
        | { a: "a"; b: "b"; c: "c" }
        | { a: "a"; b: "b"; d: "d" };

      expectTypeOf(pick(DATA, ["a", "c"])).toEqualTypeOf<
        { a: "a"; c: "c" } | { a: "a" }
      >();
      expectTypeOf(pick(DATA, ["a", "d"])).toEqualTypeOf<
        { a: "a" } | { a: "a"; d: "d" }
      >();
    });

    test("different optionality", () => {
      const DATA = { a: "a", b: "b", c: "c" } as
        | { a: "a"; b: "b"; c: "c" }
        | { a?: "a"; b: "b"; d: "d" };

      expectTypeOf(pick(DATA, ["a", "c"])).toEqualTypeOf<
        { a: "a"; c: "c" } | { a?: "a" }
      >();
      expectTypeOf(pick(DATA, ["a", "d"])).toEqualTypeOf<
        { a: "a" } | { a?: "a"; d: "d" }
      >();
    });

    test("different types", () => {
      const DATA = { a: "a", b: "b", c: "c" } as
        | { a: "a"; b: "b"; c: "c" }
        | { a: "alt_a"; b: "alt_b"; d: "alt_d" };

      expectTypeOf(pick(DATA, ["a", "c"])).toEqualTypeOf<
        { a: "a"; c: "c" } | { a: "alt_a" }
      >();
      expectTypeOf(pick(DATA, ["a", "d"])).toEqualTypeOf<
        { a: "a" } | { a: "alt_a"; d: "alt_d" }
      >();
    });
  });

  test("props are disjoint, and belong to a single object", () => {
    expectTypeOf(
      pick(
        { a: "a", b: "b", c: "c" } as
          | { a: "a"; b: "b"; c: "c" }
          | { d: "d"; e: "e"; f: "f" },
        ["a", "b"],
      ),
    ).toEqualTypeOf<{ a: "a"; b: "b" } | EmptyObject>();
  });

  test("props are disjoint, but picked from both objects", () => {
    expectTypeOf(
      pick({ a: "a", b: "b" } as { a: "a"; b: "b" } | { c: "c"; d: "d" }, [
        "a",
        "d",
      ]),
    ).toEqualTypeOf<{ a: "a" } | { d: "d" }>();
  });
});

describe.todo("keys is a union of array types");

it("strips readonly modifiers", () => {
  expectTypeOf(pick({ a: 1 } as const, ["a"])).toEqualTypeOf<{
    a: 1;
  }>();

  expectTypeOf(
    pick({} as Readonly<Record<string, "something">>, [] as Array<string>),
  ).toEqualTypeOf<Record<string, "something">>();
});

// @see https://github.com/remeda/remeda/issues/886
describe("infers the key types from the keys array (issue #886)", () => {
  test("base", () => {
    expectTypeOf(pick({ foo: "hello", bar: "world" }, ["foo"])).toEqualTypeOf<{
      foo: string;
    }>();
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
