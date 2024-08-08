import { pipe } from "./pipe";
import { toCamelCase } from "./toCamelCase";

describe("data-last", () => {
  test("without options", () => {
    expect(pipe("hello world", toCamelCase())).toBe("helloWorld");
  });

  test("with options (preserveConsecutiveUppercase: true)", () => {
    expect(
      pipe("fooBAR", toCamelCase({ preserveConsecutiveUppercase: true })),
    ).toBe("fooBAR");
  });

  test("with options (preserveConsecutiveUppercase: false)", () => {
    expect(
      pipe("fooBAR", toCamelCase({ preserveConsecutiveUppercase: false })),
    ).toBe("fooBar");
  });
});

describe("tests copied from type-fest's tests", () => {
  test("pascal", () => {
    expect(toCamelCase("FooBar")).toBe("fooBar");
  });

  test("kebab", () => {
    expect(toCamelCase("foo-bar")).toBe("fooBar");
  });

  test("complex kebab", () => {
    expect(toCamelCase("foo-bar-abc-123")).toBe("fooBarAbc123");
  });

  test("space", () => {
    expect(toCamelCase("foo bar")).toBe("fooBar");
  });

  test("snake", () => {
    expect(toCamelCase("foo_bar")).toBe("fooBar");
  });

  test("no delimiter from mono", () => {
    expect(toCamelCase("foobar")).toBe("foobar");
  });

  test("mixed", () => {
    expect(toCamelCase("foo-bar_abc xyzBarFoo")).toBe("fooBarAbcXyzBarFoo");
  });

  test("vendor prefixed css property", () => {
    expect(toCamelCase("-webkit-animation")).toBe("webkitAnimation");
  });

  test("double prefixed kebab", () => {
    expect(toCamelCase("--very-prefixed")).toBe("veryPrefixed");
  });

  test("repeated separators", () => {
    expect(toCamelCase("foo____bar")).toBe("fooBar");
  });

  test("uppercase", () => {
    expect(toCamelCase("FOO")).toBe("foo");
  });

  test("lowercase", () => {
    expect(toCamelCase("foo")).toBe("foo");
  });

  test("screaming snake case", () => {
    expect(toCamelCase("FOO_BAR")).toBe("fooBar");
  });

  test("screaming kebab case", () => {
    expect(toCamelCase("FOO-BAR")).toBe("fooBar");
  });

  test.each([
    { input: "fooBAR", whenTrue: "fooBAR", whenFalse: "fooBar" },
    { input: "fooBARBiz", whenTrue: "fooBARBiz", whenFalse: "fooBarBiz" },
    {
      input: "foo BAR-Biz_BUZZ",
      whenTrue: "fooBARBizBUZZ",
      whenFalse: "fooBarBizBuzz",
    },
    {
      input: "foo\tBAR-Biz_BUZZ",
      whenTrue: "fooBARBizBUZZ",
      whenFalse: "fooBarBizBuzz",
    },
  ])(
    "preserveConsecutiveUppercase: $input",
    ({ input, whenTrue, whenFalse }) => {
      expect(toCamelCase(input, { preserveConsecutiveUppercase: true })).toBe(
        whenTrue,
      );
      expect(toCamelCase(input, { preserveConsecutiveUppercase: false })).toBe(
        whenFalse,
      );
    },
  );
});
