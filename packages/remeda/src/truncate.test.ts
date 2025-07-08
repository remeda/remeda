import { describe, expect, test } from "vitest";
import { truncate } from "./truncate";
import { pipe } from "./pipe";

test("empty string", () => {
  expect(truncate("", 10)).toBe("");
});

test("trivial (0) n", () => {
  expect(truncate("hello, world!", 0)).toBe("");
});

test("trivial case", () => {
  expect(truncate("hello, world!", 8)).toBe("hello...");
});

test("empty omission", () => {
  expect(truncate("hello, world!", 5, { omission: "" })).toBe("hello");
});

test("empty separator", () => {
  expect(truncate("hello, world!", 8, { separator: "" })).toBe("hello...");
});

test("trivial regex separator", () => {
  expect(truncate("hello, world!", 8, { separator: /./gu })).toBe("hello...");
});

test("multiple string separators within maxLength", () => {
  expect(truncate("cat, dog, mouse, elephant", 20, { separator: "," })).toBe(
    "cat, dog, mouse...",
  );
});

test("multiple regex separators within maxLength", () => {
  expect(
    truncate("cat. dog, mouse. elephant", 20, { separator: /,|\./gu }),
  ).toBe("cat. dog, mouse...");
});

test("a separator after maxLength", () => {
  expect(
    truncate("A long sentence followed by a period. Another sentence", 20, {
      separator: ".",
    }),
  ).toBe("A long sentence f...");
});

test("omission is longer than maxLength", () => {
  expect(truncate("Hello, world!", 5, { omission: "123456789" })).toBe("12345");
});

test("n is in range ((data.length - omission.length)..data.length]", () => {
  expect(truncate("Hello, world!", 11)).toBe("Hello, w...");
  expect(truncate("Hello, world!", 12)).toBe("Hello, wo...");
  expect(truncate("Hello, world!", 13)).toBe("Hello, world!");
});

describe("data-last", () => {
  test("has an implicit default options object", () => {
    expect(pipe("Hello, world!", truncate(8))).toBe("Hello...");
  });

  test("accepts an options object", () => {
    expect(
      pipe("Hello, world!", truncate(10, { omission: "Bye!", separator: "," })),
    ).toBe("HelloBye!");
  });
});

// Based on the tests in: https://github.com/lodash/lodash/blob/4.17.15/test/test.js#L22614-L22701 without tests that don't make sense in a TypeScript
// environment (like tests that check implicit type coercion).
describe("lodash spec", () => {
  test("should not truncate if `string` is <= `length`", () => {
    expect(truncate("hi-diddly-ho there, neighborino", 31)).toBe(
      "hi-diddly-ho there, neighborino",
    );
    expect(truncate("hi-diddly-ho there, neighborino", 33)).toBe(
      "hi-diddly-ho there, neighborino",
    );
  });

  test("should truncate string the given length", () => {
    expect(truncate("hi-diddly-ho there, neighborino", 24)).toBe(
      "hi-diddly-ho there, n...",
    );
  });

  test("should support a `omission` option", () => {
    expect(
      truncate("hi-diddly-ho there, neighborino", 30, { omission: " [...]" }),
    ).toBe("hi-diddly-ho there, neig [...]");
  });

  test("should support a `maxLength` option", () => {
    expect(truncate("hi-diddly-ho there, neighborino", 4)).toBe("h...");
  });

  test("should support a `separator` option", () => {
    expect(
      truncate("hi-diddly-ho there, neighborino", 24, { separator: " " }),
    ).toBe("hi-diddly-ho there,...");
    expect(
      truncate("hi-diddly-ho there, neighborino", 24, { separator: /,? +/gu }),
    ).toBe("hi-diddly-ho there...");
  });

  test("should treat negative `length` as `0`", () => {
    // Lodash returns the omission, but that would cause the string to overflow
    // its defined max length which seems odd...
    expect(truncate("hi-diddly-ho there, neighborino", -2)).toBe("");
  });

  test("should coerce `length` to an integer", () => {
    expect(truncate("hi-diddly-ho there, neighborino", 4.6)).toBe("h...");
    expect(truncate("hi-diddly-ho there, neighborino", Number.NaN)).toBe("...");
  });
});
