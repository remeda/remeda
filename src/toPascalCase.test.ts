import { toPascalCase } from "./toPascalCase";

describe("tests copied from type-fest's tests", () => {
  test("camel", () => {
    expect(toPascalCase("fooBar")).toBe("FooBar");
  });

  test("kebab", () => {
    expect(toPascalCase("foo-bar")).toBe("FooBar");
  });

  test("complex kebab", () => {
    expect(toPascalCase("foo-bar-abc-123")).toBe("FooBarAbc123");
  });

  test("space", () => {
    expect(toPascalCase("foo bar")).toBe("FooBar");
  });

  test("snake", () => {
    expect(toPascalCase("foo_bar")).toBe("FooBar");
  });

  test("no delimiter from mono", () => {
    expect(toPascalCase("foobar")).toBe("Foobar");
  });

  test("mixed", () => {
    expect(toPascalCase("foo-bar_abc xyzBarFoo")).toBe("FooBarAbcXyzBarFoo");
  });

  test("vendor prefixed css property", () => {
    expect(toPascalCase("-webkit-animation")).toBe("WebkitAnimation");
  });

  test("double prefixed kebab", () => {
    expect(toPascalCase("--very-prefixed")).toBe("VeryPrefixed");
  });

  test("repeated separators", () => {
    expect(toPascalCase("foo____bar")).toBe("FooBar");
  });

  test("uppercase", () => {
    expect(toPascalCase("FOO")).toBe("Foo");
  });

  test("lowercase", () => {
    expect(toPascalCase("foo")).toBe("Foo");
  });

  test("screaming snake case", () => {
    expect(toPascalCase("FOO_BAR")).toBe("FooBar");
  });

  test("screaming kebab case", () => {
    expect(toPascalCase("FOO-BAR")).toBe("FooBar");
  });
});
