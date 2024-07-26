import { pipe } from "./pipe";
import { toPascalCase } from "./toPascalCase";

describe("data-last", () => {
  test("without options", () => {
    const result = pipe("hello world" as const, toPascalCase());
    expectTypeOf(result).toEqualTypeOf<"HelloWorld">();
  });

  test("with options (preserveConsecutiveUppercase: true)", () => {
    const result = pipe(
      "fooBAR" as const,
      toPascalCase({ preserveConsecutiveUppercase: true }),
    );
    expectTypeOf(result).toEqualTypeOf<"FooBAR">();
  });

  test("with options (preserveConsecutiveUppercase: false)", () => {
    const result = pipe(
      "fooBAR" as const,
      toPascalCase({ preserveConsecutiveUppercase: false }),
    );
    expectTypeOf(result).toEqualTypeOf<"FooBar">();
  });
});

describe("tests copied from type-fest's tests", () => {
  test("camel", () => {
    const result = toPascalCase("fooBar");
    expectTypeOf(result).toEqualTypeOf<"FooBar">();
  });

  test("kebab", () => {
    const result = toPascalCase("foo-bar");
    expectTypeOf(result).toEqualTypeOf<"FooBar">();
  });

  test("complex kebab", () => {
    const result = toPascalCase("foo-bar-abc-123");
    expectTypeOf(result).toEqualTypeOf<"FooBarAbc123">();
  });

  test("space", () => {
    const result = toPascalCase("foo bar");
    expectTypeOf(result).toEqualTypeOf<"FooBar">();
  });

  test("snake", () => {
    const result = toPascalCase("foo_bar");
    expectTypeOf(result).toEqualTypeOf<"FooBar">();
  });

  test("no delimiter from mono", () => {
    const result = toPascalCase("foobar");
    expectTypeOf(result).toEqualTypeOf<"Foobar">();
  });

  test("mixed", () => {
    const result = toPascalCase("foo-bar_abc xyzBarFoo");
    expectTypeOf(result).toEqualTypeOf<"FooBarAbcXyzBarFoo">();
  });

  test("vendor prefixed css property", () => {
    const result = toPascalCase("-webkit-animation");
    expectTypeOf(result).toEqualTypeOf<"WebkitAnimation">();
  });

  test("double prefixed kebab", () => {
    const result = toPascalCase("--very-prefixed");
    expectTypeOf(result).toEqualTypeOf<"VeryPrefixed">();
  });

  test("repeated separators", () => {
    const result = toPascalCase("foo____bar");
    expectTypeOf(result).toEqualTypeOf<"FooBar">();
  });

  test("uppercase", () => {
    const result = toPascalCase("FOO");
    expectTypeOf(result).toEqualTypeOf<"Foo">();
  });

  test("lowercase", () => {
    const result = toPascalCase("foo");
    expectTypeOf(result).toEqualTypeOf<"Foo">();
  });

  test("screaming snake case", () => {
    const result = toPascalCase("FOO_BAR");
    expectTypeOf(result).toEqualTypeOf<"FooBar">();
  });

  test("screaming kebab case", () => {
    const result = toPascalCase("FOO-BAR");
    expectTypeOf(result).toEqualTypeOf<"FooBar">();
  });

  test("preserveConsecutiveUppercase: fooBAR", () => {
    const data = "fooBAR";
    const whenTrue = toPascalCase(data, { preserveConsecutiveUppercase: true });
    expectTypeOf(whenTrue).toEqualTypeOf<"FooBAR">();

    const whenFalse = toPascalCase(data, {
      preserveConsecutiveUppercase: false,
    });
    expectTypeOf(whenFalse).toEqualTypeOf<"FooBar">();
  });

  test("preserveConsecutiveUppercase: fooBAR", () => {
    const data = "fooBARBiz";
    const whenTrue = toPascalCase(data, { preserveConsecutiveUppercase: true });
    expectTypeOf(whenTrue).toEqualTypeOf<"FooBARBiz">();

    const whenFalse = toPascalCase(data, {
      preserveConsecutiveUppercase: false,
    });
    expectTypeOf(whenFalse).toEqualTypeOf<"FooBarBiz">();
  });

  test("preserveConsecutiveUppercase: fooBAR", () => {
    const data = "foo BAR-Biz_BUZZ";
    const whenTrue = toPascalCase(data, { preserveConsecutiveUppercase: true });
    expectTypeOf(whenTrue).toEqualTypeOf<"FooBARBizBUZZ">();

    const whenFalse = toPascalCase(data, {
      preserveConsecutiveUppercase: false,
    });
    expectTypeOf(whenFalse).toEqualTypeOf<"FooBarBizBuzz">();
  });

  test("preserveConsecutiveUppercase: fooBAR", () => {
    const data = "foo\tBAR-Biz_BUZZ";
    const whenTrue = toPascalCase(data, { preserveConsecutiveUppercase: true });
    expectTypeOf(whenTrue).toEqualTypeOf<"FooBARBizBUZZ">();

    const whenFalse = toPascalCase(data, {
      preserveConsecutiveUppercase: false,
    });
    expectTypeOf(whenFalse).toEqualTypeOf<"FooBarBizBuzz">();
  });
});

test("fallback when regular string", () => {
  const result = toPascalCase("hello world" as string);
  expectTypeOf(result).toEqualTypeOf<Capitalize<string>>();
});

test("with template literal type (lowercase)", () => {
  const result = toPascalCase("this_is_1" as `this_is_${number}`);
  expectTypeOf(result).toEqualTypeOf<`ThisIs${Capitalize<`${number}`>}`>();
});

test("with template literal type (uppercase)", () => {
  const result = toPascalCase("THIS_IS_1" as `THIS_IS_${number}`);
  expectTypeOf(result).toEqualTypeOf<`THISIS${Capitalize<`${number}`>}`>();
});
