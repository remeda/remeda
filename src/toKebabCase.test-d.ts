import { pipe } from "./pipe";
import { toKebabCase } from "./toKebabCase";

describe("data-first", () => {
  test("on literal string", () => {
    const result = toKebabCase("Hello World");
    expectTypeOf(result).toEqualTypeOf<"hello-world">();
  });

  test("on template literal type", () => {
    const result = toKebabCase("PREFIX_123" as `PREFIX_${number}`);
    // Ideally this should be `prefix-${number}` but typescript isn't inferring
    // that Lowercase<`${number}`> is `${number}`.
    expectTypeOf(result).toEqualTypeOf<`prefix-${Lowercase<`${number}`>}`>();
  });

  test("on non-literal string", () => {
    const result = toKebabCase("Hello World" as string);
    expectTypeOf(result).toEqualTypeOf<string>();
  });
});

describe("data-last", () => {
  test("on literal string", () => {
    const result = pipe("Hello World" as const, toKebabCase());
    expectTypeOf(result).toEqualTypeOf<"hello-world">();
  });

  test("on template literal type", () => {
    const result = pipe("PREFIX_123" as `PREFIX_${number}`, toKebabCase());
    // Ideally this should be `prefix-${number}` but typescript isn't inferring
    // that Lowercase<`${number}`> is `${number}`.
    expectTypeOf(result).toEqualTypeOf<`prefix-${Lowercase<`${number}`>}`>();
  });

  test("on non-literal string", () => {
    const result = pipe("Hello World" as string, toKebabCase());
    expectTypeOf(result).toEqualTypeOf<string>();
  });
});

describe("type-fest cases", () => {
  test("camelCase", () => {
    const result = toKebabCase("fooBar");
    expectTypeOf(result).toEqualTypeOf<"foo-bar">();
  });

  test("kebab-case", () => {
    const result = toKebabCase("foo-bar");
    expectTypeOf(result).toEqualTypeOf<"foo-bar">();
  });

  test("plain case", () => {
    const result = toKebabCase("foo bar");
    expectTypeOf(result).toEqualTypeOf<"foo-bar">();
  });

  test("snake case", () => {
    const result = toKebabCase("foo_bar");
    expectTypeOf(result).toEqualTypeOf<"foo-bar">();
  });

  test("trivial case", () => {
    const result = toKebabCase("foobar");
    expectTypeOf(result).toEqualTypeOf<"foobar">();
  });
});

describe("lodash cases", () => {
  describe("regular conversions", () => {
    test("input: foo bar", () => {
      const result = toKebabCase("foo bar");
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: Foo bar", () => {
      const result = toKebabCase("Foo bar");
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: foo Bar", () => {
      const result = toKebabCase("foo Bar");
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: Foo Bar", () => {
      const result = toKebabCase("Foo Bar");
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: FOO BAR", () => {
      const result = toKebabCase("FOO BAR");
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: fooBar", () => {
      const result = toKebabCase("fooBar");
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: --foo-bar--", () => {
      const result = toKebabCase("--foo-bar--");
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: __foo_bar__", () => {
      const result = toKebabCase("__foo_bar__");
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });
  });

  describe("double conversions", () => {
    test("input: foo bar", () => {
      const result = toKebabCase(toKebabCase("foo bar"));
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: Foo bar", () => {
      const result = toKebabCase(toKebabCase("Foo bar"));
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: foo Bar", () => {
      const result = toKebabCase(toKebabCase("foo Bar"));
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: Foo Bar", () => {
      const result = toKebabCase(toKebabCase("Foo Bar"));
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: FOO BAR", () => {
      const result = toKebabCase(toKebabCase("FOO BAR"));
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: fooBar", () => {
      const result = toKebabCase(toKebabCase("fooBar"));
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: --foo-bar--", () => {
      const result = toKebabCase(toKebabCase("--foo-bar--"));
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });

    test("input: __foo_bar__", () => {
      const result = toKebabCase(toKebabCase("__foo_bar__"));
      expectTypeOf(result).toEqualTypeOf<"foo-bar">();
    });
  });
});
