import { describe, expectTypeOf, test } from "vitest";
import { toTitleCase } from "./toTitleCase";

test("empty string", () => {
  expectTypeOf(toTitleCase("")).toEqualTypeOf<"">();
});

test("basic words", () => {
  expectTypeOf(toTitleCase("hello world")).toEqualTypeOf<"Hello World">();
});

test("camelCase", () => {
  expectTypeOf(toTitleCase("fooBar")).toEqualTypeOf<"Foo Bar">();
});

test("pascalCase", () => {
  expectTypeOf(toTitleCase("FooBar")).toEqualTypeOf<"Foo Bar">();
});

test("kebab-case", () => {
  expectTypeOf(toTitleCase("foo-bar")).toEqualTypeOf<"Foo Bar">();
});

test("snake_case", () => {
  expectTypeOf(toTitleCase("foo_bar")).toEqualTypeOf<"Foo Bar">();
});

test("sCREAMING_SNAKE_CASE", () => {
  expectTypeOf(toTitleCase("FOO_BAR")).toEqualTypeOf<"Foo Bar">();
});

test("sCREAMING-KEBAB-CASE", () => {
  expectTypeOf(toTitleCase("FOO-BAR")).toEqualTypeOf<"Foo Bar">();
});

test("single word lowercase", () => {
  expectTypeOf(toTitleCase("foo")).toEqualTypeOf<"Foo">();
});

test("single word uppercase", () => {
  expectTypeOf(toTitleCase("FOO")).toEqualTypeOf<"Foo">();
});

test("mixed separators", () => {
  expectTypeOf(
    toTitleCase("foo-bar_baz qux"),
  ).toEqualTypeOf<"Foo Bar Baz Qux">();
});

describe("lodash spec", () => {
  // @see https://github.com/lodash/lodash/blob/main/test/test.js#L21226-L21236

  test("lodash example: '--foo-bar--'", () => {
    expectTypeOf(toTitleCase("--foo-bar--")).toEqualTypeOf<"Foo Bar">();
  });

  test("lodash example: 'fooBar'", () => {
    expectTypeOf(toTitleCase("fooBar")).toEqualTypeOf<"Foo Bar">();
  });

  test("lodash example: '__FOO_BAR__'", () => {
    expectTypeOf(toTitleCase("__FOO_BAR__")).toEqualTypeOf<"Foo Bar">();
  });
});

describe("edge cases", () => {
  test("repeated separators", () => {
    expectTypeOf(toTitleCase("foo____bar")).toEqualTypeOf<"Foo Bar">();
    expectTypeOf(toTitleCase("foo----bar")).toEqualTypeOf<"Foo Bar">();
    expectTypeOf(toTitleCase("foo    bar")).toEqualTypeOf<"Foo Bar">();
  });

  test("leading and trailing separators", () => {
    expectTypeOf(toTitleCase("--foo-bar--")).toEqualTypeOf<"Foo Bar">();
    expectTypeOf(toTitleCase("__foo_bar__")).toEqualTypeOf<"Foo Bar">();
    expectTypeOf(toTitleCase("  foo bar  ")).toEqualTypeOf<"Foo Bar">();
  });

  test("vendor prefixed css property", () => {
    expectTypeOf(
      toTitleCase("-webkit-animation"),
    ).toEqualTypeOf<"Webkit Animation">();
  });

  test("double prefixed", () => {
    expectTypeOf(
      toTitleCase("--very-prefixed"),
    ).toEqualTypeOf<"Very Prefixed">();
  });

  test("complex mixed case", () => {
    expectTypeOf(
      toTitleCase("foo-bar_abc xyzBarFoo"),
    ).toEqualTypeOf<"Foo Bar Abc Xyz Bar Foo">();
  });

  test("with numbers", () => {
    expectTypeOf(toTitleCase("foo123bar")).toEqualTypeOf<"Foo 123 Bar">();
    expectTypeOf(toTitleCase("foo-bar-123")).toEqualTypeOf<"Foo Bar 123">();
    expectTypeOf(
      toTitleCase("version2Update"),
    ).toEqualTypeOf<"Version 2 Update">();
  });

  test("consecutive uppercase letters", () => {
    expectTypeOf(
      toTitleCase("XMLHttpRequest"),
    ).toEqualTypeOf<"Xml Http Request">();
    expectTypeOf(toTitleCase("HTMLParser")).toEqualTypeOf<"Html Parser">();
    expectTypeOf(
      toTitleCase("getCSSProperty"),
    ).toEqualTypeOf<"Get Css Property">();
  });
});

describe("unicode", () => {
  test("maintains diacritics", () => {
    expectTypeOf(toTitleCase("café naïve")).toEqualTypeOf<"Café Naïve">();
    expectTypeOf(toTitleCase("CAFÉ_NAÏVE")).toEqualTypeOf<"Café Naïve">();
  });

  test("handles non-Latin scripts", () => {
    expectTypeOf(
      toTitleCase("москва петербург"),
    ).toEqualTypeOf<"Москва Петербург">();
    expectTypeOf(toTitleCase("ελλάδα_αθήνα")).toEqualTypeOf<"Ελλάδα Αθήνα">();
  });
});
