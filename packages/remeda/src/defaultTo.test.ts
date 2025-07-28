import { describe, expect, test } from "vitest";
import { defaultTo } from "./defaultTo";

describe("falsy values", () => {
  describe("nullish", () => {
    test("undefined", () => {
      expect(defaultTo(undefined as string | undefined, "fallback")).toBe(
        "fallback",
      );
    });

    test("null", () => {
      expect(defaultTo(null as string | null, "fallback")).toBe("fallback");
    });
  });

  describe("non-nullish", () => {
    test("nan", () => {
      // We handle NaN differently than Lodash and Ramda intentionally, we
      // prefer to maintain the ECMAScript semantics for the nullish coalescing
      // operator `??`.
      expect(defaultTo(Number.NaN as number | undefined, 42)).toBe(Number.NaN);
    });

    test("empty string", () => {
      expect(defaultTo("" as string | undefined, "fallback")).toBe("");
    });

    test("false", () => {
      expect(defaultTo(false as boolean | undefined, true)).toBe(false);
    });

    test("zero", () => {
      expect(defaultTo(0 as number | undefined, 42)).toBe(0);
    });

    test("empty array", () => {
      expect(defaultTo([] as Array<unknown> | undefined, ["a"])).toStrictEqual(
        [],
      );
    });

    test("empty object", () => {
      expect(
        defaultTo({} as Record<string, unknown> | undefined, { a: "b" }),
      ).toStrictEqual({});
    });
  });
});

describe("truthy values", () => {
  test("string", () => {
    expect(defaultTo("a" as string | undefined, "fallback")).toBe("a");
  });

  test("number", () => {
    expect(defaultTo(42 as number | undefined, 0)).toBe(42);
  });

  test("boolean", () => {
    expect(defaultTo(true as boolean | undefined, false)).toBe(true);
  });

  test("array", () => {
    expect(defaultTo(["a"] as Array<string> | undefined, ["b"])).toStrictEqual([
      "a",
    ]);
  });

  test("object", () => {
    expect(
      defaultTo({ a: "a" } as { a: string } | undefined, { a: "b" }),
    ).toStrictEqual({ a: "a" });
  });
});

describe("object identity", () => {
  test("value isn't cloned", () => {
    const data = { a: "a" } as { a: string } | undefined;

    expect(defaultTo(data, { a: "b" })).toBe(data);
  });

  test("fallback isn't cloned", () => {
    const fallback = { a: "b" };

    expect(defaultTo(undefined as { a: string } | undefined, fallback)).toBe(
      fallback,
    );
  });
});
