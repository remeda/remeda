import { describe, expect, test } from "vitest";
import { hasSubObject } from "./hasSubObject";
import { pipe } from "./pipe";

describe("data first", () => {
  test("works with empty sub-object", () => {
    expect(hasSubObject({ a: 1, b: "b", c: 3 }, {})).toBe(true);
    expect(hasSubObject({}, {})).toBe(true);
  });

  test("works with primitives", () => {
    expect(hasSubObject({ a: 1, b: "b", c: 3 }, { a: 1, b: "b" })).toBe(true);
    expect(hasSubObject({ a: 1, b: "c", c: 3 }, { a: 1, b: "b" })).toBe(false);
    expect(hasSubObject({ a: 2, b: "b", c: 3 }, { a: 1, b: "b" })).toBe(false);
  });

  test("works with deep objects", () => {
    expect(hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 2 } })).toBe(
      true,
    );
    expect(hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 0 } })).toBe(
      false,
    );
  });

  test("checks for matching key", () => {
    const data = {} as { a?: undefined };

    expect(hasSubObject(data, { a: undefined })).toBe(false);
  });
});

describe("data last", () => {
  test("works with empty sub-object", () => {
    expect(pipe({ a: 1, b: 2, c: 3 }, hasSubObject({}))).toBe(true);
    expect(pipe({}, hasSubObject({}))).toBe(true);
  });

  test("works with primitives", () => {
    expect(pipe({ a: 1, b: "b", c: 3 }, hasSubObject({ a: 1, b: "b" }))).toBe(
      true,
    );
    expect(pipe({ a: 1, b: "c", c: 3 }, hasSubObject({ a: 1, b: "b" }))).toBe(
      false,
    );
    expect(pipe({ a: 2, b: "b", c: 3 }, hasSubObject({ a: 1, b: "b" }))).toBe(
      false,
    );
  });

  test("works with deep objects", () => {
    expect(
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1, c: 2 } })),
    ).toBe(true);

    expect(
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1, c: 3 } })),
    ).toBe(false);
  });
});
