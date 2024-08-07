import { pipe } from "./pipe";
import { toSnakeCase } from "./toSnakeCase";

describe("data-last", () => {
  test("hello world", () => {
    expect(pipe("hello world", toSnakeCase())).toBe("helloWorld");
  });
});

describe("tests copied from type-fest's tests", () => {
  test("pascal", () => {
    expect(toSnakeCase("FooBar")).toBe("foo_bar");
  });

  test("kebab", () => {
    expect(toSnakeCase("foo-bar")).toBe("foo_bar");
  });

  test("complex kebab", () => {
    expect(toSnakeCase("foo-bar-abc-123")).toBe("foo_bar_abc_123");
  });

  test("space", () => {
    expect(toSnakeCase("foo bar")).toBe("foo_bar");
  });

  test("snake", () => {
    expect(toSnakeCase("foo_bar")).toBe("foo_bar");
  });

  test("no delimiter from mono", () => {
    expect(toSnakeCase("foobar")).toBe("foobar");
  });

  test("mixed", () => {
    expect(toSnakeCase("foo-bar_abc xyzBarFoo")).toBe(
      "foo_bar_abc_xyz_bar_foo",
    );
  });

  test("vendor prefixed css property", () => {
    expect(toSnakeCase("-webkit-animation")).toBe("webkit_animation");
  });

  test("double prefixed kebab", () => {
    expect(toSnakeCase("--very-prefixed")).toBe("very_prefixed");
  });

  test("repeated separators", () => {
    expect(toSnakeCase("foo____bar")).toBe("foo_bar");
  });

  test("uppercase", () => {
    expect(toSnakeCase("FOO")).toBe("foo");
  });

  test("lowercase", () => {
    expect(toSnakeCase("foo")).toBe("foo");
  });

  test("screaming snake case", () => {
    expect(toSnakeCase("FOO_BAR")).toBe("foo_bar");
  });

  test("screaming kebab case", () => {
    expect(toSnakeCase("FOO-BAR")).toBe("foo_bar");
  });

  test.each([
    { input: "fooBAR", output: "fooBAR" },
    { input: "fooBARBiz", output: "fooBARBiz" },
    {
      input: "foo BAR-Biz_BUZZ",
      output: "fooBARBizBUZZ",
    },
    {
      input: "foo\tBAR-Biz_BUZZ",
      output: "fooBARBizBUZZ",
    },
  ])("$input -> $output", ({ input, output }) => {
    expect(toSnakeCase(input)).toBe(output);
  });
});
