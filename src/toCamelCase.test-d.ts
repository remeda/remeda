import { toCamelCase } from "./toCamelCase";

describe("tests copied from type-fest's tests", () => {
  test("pascal", () => {
    const result = toCamelCase("FooBar");
    expectTypeOf(result).toEqualTypeOf<"fooBar">();
  });

  test("kebab", () => {
    const result = toCamelCase("foo-bar");
    expectTypeOf(result).toEqualTypeOf<"fooBar">();
  });

  test("complex kebab", () => {
    const result = toCamelCase("foo-bar-abc-123");
    expectTypeOf(result).toEqualTypeOf<"fooBarAbc123">();
  });

  test("space", () => {
    const result = toCamelCase("foo bar");
    expectTypeOf(result).toEqualTypeOf<"fooBar">();
  });

  test("snake", () => {
    const result = toCamelCase("foo_bar");
    expectTypeOf(result).toEqualTypeOf<"fooBar">();
  });

  test("no delimiter from mono", () => {
    const result = toCamelCase("foobar");
    expectTypeOf(result).toEqualTypeOf<"foobar">();
  });

  test("mixed", () => {
    const result = toCamelCase("foo-bar_abc xyzBarFoo");
    expectTypeOf(result).toEqualTypeOf<"fooBarAbcXyzBarFoo">();
  });

  test("vendor prefixed css property", () => {
    const result = toCamelCase("-webkit-animation");
    expectTypeOf(result).toEqualTypeOf<"webkitAnimation">();
  });

  test("double prefixed kebab", () => {
    const result = toCamelCase("--very-prefixed");
    expectTypeOf(result).toEqualTypeOf<"veryPrefixed">();
  });

  test("repeated separators", () => {
    const result = toCamelCase("foo____bar");
    expectTypeOf(result).toEqualTypeOf<"fooBar">();
  });

  test("uppercase", () => {
    const result = toCamelCase("FOO");
    expectTypeOf(result).toEqualTypeOf<"foo">();
  });

  test("lowercase", () => {
    const result = toCamelCase("foo");
    expectTypeOf(result).toEqualTypeOf<"foo">();
  });

  test("screaming snake case", () => {
    const result = toCamelCase("FOO_BAR");
    expectTypeOf(result).toEqualTypeOf<"fooBar">();
  });

  test("screaming kebab case", () => {
    const result = toCamelCase("FOO-BAR");
    expectTypeOf(result).toEqualTypeOf<"fooBar">();
  });
});

test("fallback when regular string", () => {
  const result = toCamelCase("hello world" as string);
  expectTypeOf(result).toEqualTypeOf<string>();
});

test("with template literal type (lowercase)", () => {
  const result = toCamelCase("this_is_1" as `this_is_${number}`);
  expectTypeOf(result).toEqualTypeOf<`thisIs${Capitalize<`${number}`>}`>();
});

test("with template literal type (uppercase)", () => {
  const result = toCamelCase("THIS_IS_1" as `THIS_IS_${number}`);
  expectTypeOf(result).toEqualTypeOf<`tHISIS${Capitalize<`${number}`>}`>();
});
