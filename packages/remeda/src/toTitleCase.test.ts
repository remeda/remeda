import { describe, expect, test } from "vitest";
import { toTitleCase } from "./toTitleCase";

test("empty string", () => {
  expect(toTitleCase("")).toBe("");
});

test("basic words", () => {
  expect(toTitleCase("hello world")).toBe("Hello World");
});

test("camelCase", () => {
  expect(toTitleCase("fooBar")).toBe("Foo Bar");
});

test("pascalCase", () => {
  expect(toTitleCase("FooBar")).toBe("Foo Bar");
});

test("kebab-case", () => {
  expect(toTitleCase("foo-bar")).toBe("Foo Bar");
});

test("snake_case", () => {
  expect(toTitleCase("foo_bar")).toBe("Foo Bar");
});

test("sCREAMING_SNAKE_CASE", () => {
  expect(toTitleCase("FOO_BAR")).toBe("Foo Bar");
});

test("sCREAMING-KEBAB-CASE", () => {
  expect(toTitleCase("FOO-BAR")).toBe("Foo Bar");
});

test("single word lowercase", () => {
  expect(toTitleCase("foo")).toBe("Foo");
});

test("single word uppercase", () => {
  expect(toTitleCase("FOO")).toBe("Foo");
});

test("mixed separators", () => {
  expect(toTitleCase("foo-bar_baz qux")).toBe("Foo Bar Baz Qux");
});

describe("lodash spec", () => {
  // @see https://github.com/lodash/lodash/blob/main/test/test.js#L21226-L21236

  test("lodash example: '--foo-bar--'", () => {
    expect(toTitleCase("--foo-bar--")).toBe("Foo Bar");
  });

  test("lodash example: 'fooBar'", () => {
    expect(toTitleCase("fooBar")).toBe("Foo Bar");
  });

  test("lodash example: '__FOO_BAR__'", () => {
    expect(toTitleCase("__FOO_BAR__")).toBe("Foo Bar");
  });
});

describe("edge cases", () => {
  test("repeated separators", () => {
    expect(toTitleCase("foo____bar")).toBe("Foo Bar");
    expect(toTitleCase("foo----bar")).toBe("Foo Bar");
    expect(toTitleCase("foo    bar")).toBe("Foo Bar");
  });

  test("leading and trailing separators", () => {
    expect(toTitleCase("--foo-bar--")).toBe("Foo Bar");
    expect(toTitleCase("__foo_bar__")).toBe("Foo Bar");
    expect(toTitleCase("  foo bar  ")).toBe("Foo Bar");
  });

  test("vendor prefixed css property", () => {
    expect(toTitleCase("-webkit-animation")).toBe("Webkit Animation");
  });

  test("double prefixed", () => {
    expect(toTitleCase("--very-prefixed")).toBe("Very Prefixed");
  });

  test("complex mixed case", () => {
    expect(toTitleCase("foo-bar_abc xyzBarFoo")).toBe(
      "Foo Bar Abc Xyz Bar Foo",
    );
  });

  test("with numbers", () => {
    expect(toTitleCase("foo123bar")).toBe("Foo 123 Bar");
    expect(toTitleCase("foo-bar-123")).toBe("Foo Bar 123");
    expect(toTitleCase("version2Update")).toBe("Version 2 Update");
  });

  test("consecutive uppercase letters", () => {
    expect(toTitleCase("XMLHttpRequest")).toBe("Xml Http Request");
    expect(toTitleCase("HTMLParser")).toBe("Html Parser");
    expect(toTitleCase("getCSSProperty")).toBe("Get Css Property");
  });
});

describe("unicode", () => {
  test("maintains diacritics", () => {
    expect(toTitleCase("café naïve")).toBe("Café Naïve");
    expect(toTitleCase("CAFÉ_NAÏVE")).toBe("Café Naïve");
  });

  test("handles non-Latin scripts", () => {
    expect(toTitleCase("москва петербург")).toBe("Москва Петербург");
    expect(toTitleCase("ελλάδα_αθήνα")).toBe("Ελλάδα Αθήνα");
  });
});
