import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { set } from "./set";

describe("data first", () => {
  test("simple", () => {
    expect(set({ a: 1 }, "a", 2)).toStrictEqual({ a: 2 });
  });

  test("an undefined value", () => {
    expect(
      set({ a: 1 } as { a: number | undefined }, "a", undefined),
    ).toStrictEqual({ a: undefined });
  });
});

describe("data last", () => {
  test("simple", () => {
    expect(pipe({ a: 1 }, set("a", 2))).toStrictEqual({ a: 2 });
  });
});
