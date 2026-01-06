import type { EmptyObject } from "type-fest";
import { describe, expectTypeOf, test } from "vitest";
import { keys } from "./keys";
import { pick } from "./pick";

describe("bounded object types", () => {
  const DATA = { a: "required", c: undefined } as {
    a: "required";
    b?: "optional";
    c: "undefinable" | undefined;
    d?: "optional-undefinable" | undefined;
  };

  test("enforces keys must exist on object", () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    pick(DATA, ["not", "in"]);
  });

  test("doesn't widen key types", () => {
    // @ts-expect-error [ts2345] -- string is too wide for object
    pick(DATA, ["a"] as [string]);
  });

  test("empty keys tuple", () => {
    expectTypeOf(pick(DATA, [])).toEqualTypeOf<EmptyObject>();
  });

  describe("fixed tuple of literal keys", () => {
    test("required key only", () => {
      expectTypeOf(pick(DATA, ["a"])).toEqualTypeOf<{
        a: "required";
      }>();
    });

    test("optional key only", () => {
      expectTypeOf(pick(DATA, ["b"])).toEqualTypeOf<{
        b?: "optional";
      }>();
    });

    test("undefinable key only", () => {
      expectTypeOf(pick(DATA, ["c"])).toEqualTypeOf<{
        c: "undefinable" | undefined;
      }>();
    });

    test("optional-undefinable key only", () => {
      expectTypeOf(pick(DATA, ["d"])).toEqualTypeOf<{
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("required and optional keys", () => {
      expectTypeOf(pick(DATA, ["a", "b"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
    });

    test("required and undefinable keys", () => {
      expectTypeOf(pick(DATA, ["a", "c"])).toEqualTypeOf<{
        a: "required";
        c: "undefinable" | undefined;
      }>();
    });

    test("required and optional-undefinable keys", () => {
      expectTypeOf(pick(DATA, ["a", "d"])).toEqualTypeOf<{
        a: "required";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional and undefinable keys", () => {
      expectTypeOf(pick(DATA, ["b", "c"])).toEqualTypeOf<{
        b?: "optional";
        c: "undefinable" | undefined;
      }>();
    });

    test("optional and optional-undefinable keys", () => {
      expectTypeOf(pick(DATA, ["b", "d"])).toEqualTypeOf<{
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("undefinable and optional-undefinable keys", () => {
      expectTypeOf(pick(DATA, ["c", "d"])).toEqualTypeOf<{
        c: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all except optional-undefinable", () => {
      expectTypeOf(pick(DATA, ["a", "b", "c"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        c: "undefinable" | undefined;
      }>();
    });

    test("all except undefinable", () => {
      expectTypeOf(pick(DATA, ["a", "b", "d"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all except optional", () => {
      expectTypeOf(pick(DATA, ["a", "c", "d"])).toEqualTypeOf<{
        a: "required";
        c: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all except required", () => {
      expectTypeOf(pick(DATA, ["b", "c", "d"])).toEqualTypeOf<{
        b?: "optional";
        c: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all keys", () => {
      expectTypeOf(pick(DATA, ["a", "b", "c", "d"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        c: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  describe("single union key", () => {
    test("required or optional", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "b"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("required or undefinable", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "c"])).toEqualTypeOf<{
        a?: "required";
        c?: "undefinable" | undefined;
      }>();
    });

    test("required or optional-undefinable", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "d"])).toEqualTypeOf<{
        a?: "required";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional or undefinable", () => {
      expectTypeOf(pick(DATA, ["b" as "b" | "c"])).toEqualTypeOf<{
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("optional or optional-undefinable", () => {
      expectTypeOf(pick(DATA, ["b" as "b" | "d"])).toEqualTypeOf<{
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("undefinable or optional-undefinable", () => {
      expectTypeOf(pick(DATA, ["c" as "c" | "d"])).toEqualTypeOf<{
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("required, optional, and undefinable", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "b" | "c"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("required, optional, and optional-undefinable", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "b" | "d"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("required, undefinable, and optional-undefinable", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "c" | "d"])).toEqualTypeOf<{
        a?: "required";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional, undefinable, and optional-undefinable", () => {
      expectTypeOf(pick(DATA, ["b" as "b" | "c" | "d"])).toEqualTypeOf<{
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all key types", () => {
      expectTypeOf(pick(DATA, ["a" as "a" | "b" | "c" | "d"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  describe("multiple union keys", () => {
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

  describe("mixed literal and union keys", () => {
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

  describe("array with literal key", () => {
    test("required key", () => {
      expectTypeOf(pick(DATA, [] as "a"[])).toEqualTypeOf<{
        a?: "required";
      }>();
    });

    test("optional key", () => {
      expectTypeOf(pick(DATA, [] as "b"[])).toEqualTypeOf<{
        b?: "optional";
      }>();
    });

    test("undefinable key", () => {
      expectTypeOf(pick(DATA, [] as "c"[])).toEqualTypeOf<{
        c?: "undefinable" | undefined;
      }>();
    });

    test("optional-undefinable key", () => {
      expectTypeOf(pick(DATA, [] as "d"[])).toEqualTypeOf<{
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  describe("array with union keys", () => {
    test("required or optional", () => {
      expectTypeOf(pick(DATA, [] as ("a" | "b")[])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("required or undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as ("a" | "c")[])).toEqualTypeOf<{
        a?: "required";
        c?: "undefinable" | undefined;
      }>();
    });

    test("required or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as ("a" | "d")[])).toEqualTypeOf<{
        a?: "required";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional or undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as ("b" | "c")[])).toEqualTypeOf<{
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("optional or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as ("b" | "d")[])).toEqualTypeOf<{
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("undefinable or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as ("c" | "d")[])).toEqualTypeOf<{
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("required, optional or undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as ("a" | "b" | "c")[])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("required, optional or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as ("a" | "b" | "d")[])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("required, undefinable or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as ("a" | "c" | "d")[])).toEqualTypeOf<{
        a?: "required";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("optional, undefinable or optional-undefinable picked", () => {
      expectTypeOf(pick(DATA, [] as ("b" | "c" | "d")[])).toEqualTypeOf<{
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });

    test("all keys", () => {
      expectTypeOf(pick(DATA, [] as ("a" | "b" | "c" | "d")[])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
        d?: "optional-undefinable" | undefined;
      }>();
    });
  });

  describe("non-empty (prefix) arrays", () => {
    test("all literals, with overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as ["a", ..."a"[]])).toEqualTypeOf<{
        a: "required";
      }>();
    });

    test("all literals, no overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as ["a", ..."b"[]])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["b"] as ["b", ..."a"[]])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("with unions, partial overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as ["a", ...("a" | "b")[]])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["b"] as ["b", ...("a" | "b")[]])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["a"] as ["a" | "b", ..."a"[]])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["a"] as ["a" | "b", ..."b"[]])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as ["a" | "b", ...("b" | "c")[]]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("with unions, full overlap", () => {
      expectTypeOf(
        pick(DATA, ["a"] as ["a" | "b", ...("a" | "b")[]]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("with unions, no overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as ["a", ...("b" | "c")[]])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(pick(DATA, ["b"] as ["b", ...("a" | "c")[]])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(pick(DATA, ["a"] as ["a" | "b", ..."c"[]])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(pick(DATA, ["b"] as ["b" | "c", ..."a"[]])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as ["a" | "b", ...("c" | "d")[]]),
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
      expectTypeOf(pick(DATA, ["a"] as [..."a"[], "a"])).toEqualTypeOf<{
        a: "required";
      }>();
    });

    test("all literals, no overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as [..."b"[], "a"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["b"] as [..."a"[], "b"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("with unions, partial overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as [...("a" | "b")[], "a"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["b"] as [...("a" | "b")[], "b"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["a"] as [..."a"[], "a" | "b"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(pick(DATA, ["a"] as [..."b"[], "a" | "b"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as [...("b" | "c")[], "a" | "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
    });

    test("with unions, full overlap", () => {
      expectTypeOf(
        pick(DATA, ["a"] as [...("a" | "b")[], "a" | "b"]),
      ).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
      }>();
    });

    test("with unions, no overlap", () => {
      expectTypeOf(pick(DATA, ["a"] as [...("b" | "c")[], "a"])).toEqualTypeOf<{
        a: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(pick(DATA, ["b"] as [...("a" | "c")[], "b"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(pick(DATA, ["a"] as [..."c"[], "a" | "b"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(pick(DATA, ["b"] as [..."a"[], "b" | "c"])).toEqualTypeOf<{
        a?: "required";
        b?: "optional";
        c?: "undefinable" | undefined;
      }>();
      expectTypeOf(
        pick(DATA, ["a"] as [...("c" | "d")[], "a" | "b"]),
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
describe("unbounded record types (Issue #1128)", () => {
  const DATA = {} as Record<string, "required">;
  const UNDEFINABLE = {} as Record<string, "undefinable" | undefined>;

  test("enforces keys must exist on object", () => {
    // @ts-expect-error [ts2322] -- should not allow non existing props
    pick(DATA, [1, 2]);
  });

  test("doesn't widen key types", () => {
    // @ts-expect-error [ts2345] -- string is too wide for object
    pick(DATA, ["a"] as [PropertyKey]);
  });

  test("empty keys tuple", () => {
    expectTypeOf(pick(DATA, [])).toEqualTypeOf<EmptyObject>();
  });

  describe("fixed tuple keys", () => {
    test("literal keys", () => {
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

    test("non-overlapping union keys", () => {
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

    test("partially overlapping union keys", () => {
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

    test("fully overlapping union keys", () => {
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

    test("literal and overlapping union keys", () => {
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

    test("literal and non-overlapping union keys", () => {
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

  describe("array keys", () => {
    test("literal key", () => {
      const picks = [] as "a"[];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
      }>();
    });

    test("union keys", () => {
      const picks = [] as ("a" | "b")[];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
    });

    test("primitive keys", () => {
      const picks = [] as string[];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, "required">
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
    });
  });

  describe("prefix array keys", () => {
    test("non-overlapping literal keys", () => {
      const picks = ["a"] as ["a", ..."b"[]];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
        b?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
        b?: "undefinable" | undefined;
      }>();
    });

    test("overlapping literal keys", () => {
      const picks = ["a"] as ["a", ..."a"[]];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<{
        a?: "required";
      }>();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<{
        a?: "undefinable" | undefined;
      }>();
    });

    test("union of non-overlapping literals", () => {
      const picks = ["a"] as ["a" | "b", ...("c" | "d")[]];

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
      const picks = ["a"] as ["a" | "b", ...("b" | "c")[]];

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
      const picks = ["a"] as ["a" | "b", ...("a" | "b")[]];

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
      const picks = ["a"] as ["a", ...("a" | "b")[]];
      const alt = ["a"] as ["a" | "b", ..."b"[]];

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
      const picks = ["a"] as ["a", ...("b" | "c")[]];
      const alt = ["a"] as ["a" | "b", ..."c"[]];

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
      const picks = ["a"] as [string, ...string[]];

      expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
        Record<string, "required">
      >();
      expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
        Record<string, "undefinable" | undefined>
      >();
    });

    test("primitive and singular literal keys", () => {
      const picks = ["a"] as ["a", ...string[]];
      const alt = ["a"] as [string, ..."a"[]];

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
      const picks = ["a"] as ["a" | "b", ...string[]];
      const alt = ["a"] as [string, ...("a" | "b")[]];

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

  test("narrows on unbounded keys but doesn't make it partial", () => {
    const picks = [] as `prefix_${string}`[];

    expectTypeOf(pick(DATA, picks)).toEqualTypeOf<
      Record<`prefix_${string}`, "required">
    >();
    expectTypeOf(pick(UNDEFINABLE, picks)).toEqualTypeOf<
      Record<`prefix_${string}`, "undefinable" | undefined>
    >();
  });
});

describe("union object types", () => {
  describe("keys exist in all union members", () => {
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

  describe("keys exist in some union members", () => {
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

  test("keys belong to single union member", () => {
    expectTypeOf(
      pick(
        { a: "a", b: "b", c: "c" } as
          | { a: "a"; b: "b"; c: "c" }
          | { d: "d"; e: "e"; f: "f" },
        ["a", "b"],
      ),
    ).toEqualTypeOf<{ a: "a"; b: "b" } | EmptyObject>();
  });

  test("keys distributed across union members", () => {
    expectTypeOf(
      pick({ a: "a", b: "b" } as { a: "a"; b: "b" } | { c: "c"; d: "d" }, [
        "a",
        "d",
      ]),
    ).toEqualTypeOf<{ a: "a" } | { d: "d" }>();
  });
});

describe("union key array types", () => {
  describe("disjoint literal keys", () => {
    test("bounded plain object", () => {
      expectTypeOf(
        pick({ a: "a", b: "b" }, ["a"] as ["a"] | ["b"]),
      ).toEqualTypeOf<{ a: string } | { b: string }>();
    });

    test("unbounded record", () => {
      expectTypeOf(
        pick({} as Record<string, "value">, ["a"] as ["a"] | ["b"]),
      ).toEqualTypeOf<{ a?: "value" } | { b?: "value" }>();
    });
  });

  describe("overlapping literal keys", () => {
    const picks = ["a", "b"] as ["a", "b"] | ["b", "c"];

    test("bounded plain object", () => {
      expectTypeOf(pick({ a: "a", b: "b", c: "c" }, picks)).toEqualTypeOf<
        { a: string; b: string } | { b: string; c: string }
      >();
    });

    test("unbounded record", () => {
      expectTypeOf(pick({} as Record<string, "value">, picks)).toEqualTypeOf<
        { a?: "value"; b?: "value" } | { b?: "value"; c?: "value" }
      >();
    });
  });

  describe("overlapping union keys", () => {
    const picks = ["a", "b"] as ["a" | "b", "b" | "c"] | ["b" | "c", "c" | "d"];

    test("bounded plain object", () => {
      expectTypeOf(
        pick({ a: "a", b: "b", c: "c", d: "d" }, picks),
      ).toEqualTypeOf<
        | { a?: string; b?: string; c?: string }
        | { b?: string; c?: string; d?: string }
      >();
    });

    test("unbounded record", () => {
      expectTypeOf(pick({} as Record<string, "value">, picks)).toEqualTypeOf<
        | { a?: "value"; b?: "value"; c?: "value" }
        | { b?: "value"; c?: "value"; d?: "value" }
      >();
    });
  });

  describe("different array shapes", () => {
    const picks = ["a", "b"] as ["a" | "b", "b" | "c"] | "d"[];

    test("bounded plain object", () => {
      expectTypeOf(
        pick({ a: "a", b: "b", c: "c", d: "d" }, picks),
      ).toEqualTypeOf<
        { a?: string; b?: string; c?: string } | { d?: string }
      >();
    });

    test("unbounded record", () => {
      expectTypeOf(pick({} as Record<string, "value">, picks)).toEqualTypeOf<
        { a?: "value"; b?: "value"; c?: "value" } | { d?: "value" }
      >();
    });
  });

  test("mix of literals and primitives", () => {
    expectTypeOf(
      pick({} as Record<string, "value">, [] as string[] | "a"[]),
    ).toEqualTypeOf<Record<string, "value"> | { a?: "value" }>();
  });
});

test("result is mutable", () => {
  expectTypeOf(pick({ a: 1 } as const, ["a"])).toEqualTypeOf<{
    a: 1;
  }>();

  expectTypeOf(
    pick({} as Readonly<Record<string, "something">>, [] as string[]),
  ).toEqualTypeOf<Record<string, "something">>();
});

// @see https://github.com/remeda/remeda/issues/886
describe("key type inference (issue #886)", () => {
  test("base", () => {
    expectTypeOf(pick({ foo: "hello", bar: "world" }, ["foo"])).toEqualTypeOf<{
      foo: string;
    }>();
  });

  test("wrapped", () => {
    expectTypeOf(
      keys(pick({ foo: "hello", bar: "world" }, ["foo"])),
    ).toEqualTypeOf<"foo"[]>();
  });

  test("with const key", () => {
    expectTypeOf(
      keys(pick({ foo: "hello", bar: "world" }, ["foo"] as const)),
    ).toEqualTypeOf<"foo"[]>();
  });
});

test("supports inherited properties", () => {
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
