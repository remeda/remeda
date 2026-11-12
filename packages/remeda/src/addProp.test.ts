import { describe, expect, test } from "vitest";
import { addProp } from "./addProp";
import { pipe } from "./pipe";

describe("data first", () => {
  test("simple", () => {
    const actual = addProp({ a: 1 }, "b", 2);

    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });

  test("an undefined value", () => {
    expect(addProp({ a: 1 }, "b", undefined)).toStrictEqual({
      a: 1,
      b: undefined,
    });
  });
});

describe("data last", () => {
  test("simple", () => {
    const actual = pipe({ a: 1 }, addProp("b", 2));

    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });
});
