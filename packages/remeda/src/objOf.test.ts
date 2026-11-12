import { describe, expect, test } from "vitest";
import { objOf } from "./objOf";

describe("data first", () => {
  test("wrap value", () => {
    const actual = objOf(10, "a");

    expect(actual.a).toBe(10);
    expect(actual).toStrictEqual({ a: 10 });
  });

  test("an undefined value", () => {
    expect(objOf(undefined, "a")).toStrictEqual({ a: undefined });
  });
});

describe("data last", () => {
  test("wrap value", () => {
    const actual = objOf("a")(10);

    expect(actual.a).toBe(10);
    expect(actual).toStrictEqual({ a: 10 });
  });
});
