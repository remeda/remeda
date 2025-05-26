import { pipe } from "./pipe";
import { toCamelCase } from "./toCamelCase";

describe("data-last", () => {
  test("without options", () => {
    const result = pipe("hello world" as const, toCamelCase());

    expectTypeOf(result).toEqualTypeOf<"helloWorld">();
  });

  test("with options (preserveConsecutiveUppercase: true)", () => {
    const result = pipe(
      "fooBAR" as const,
      toCamelCase({ preserveConsecutiveUppercase: true }),
    );

    expectTypeOf(result).toEqualTypeOf<"fooBAR">();
  });

  test("with options (preserveConsecutiveUppercase: false)", () => {
    const result = pipe(
      "fooBAR" as const,
      toCamelCase({ preserveConsecutiveUppercase: false }),
    );

    expectTypeOf(result).toEqualTypeOf<"fooBar">();
  });
});

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

  test("preserveConsecutiveUppercase: fooBAR", () => {
    const data = "fooBAR";
    const whenTrue = toCamelCase(data, { preserveConsecutiveUppercase: true });

    expectTypeOf(whenTrue).toEqualTypeOf<"fooBAR">();

    const whenFalse = toCamelCase(data, {
      preserveConsecutiveUppercase: false,
    });

    expectTypeOf(whenFalse).toEqualTypeOf<"fooBar">();
  });

  test("preserveConsecutiveUppercase: fooBARBiz", () => {
    const data = "fooBARBiz";
    const whenTrue = toCamelCase(data, { preserveConsecutiveUppercase: true });

    expectTypeOf(whenTrue).toEqualTypeOf<"fooBARBiz">();

    const whenFalse = toCamelCase(data, {
      preserveConsecutiveUppercase: false,
    });

    expectTypeOf(whenFalse).toEqualTypeOf<"fooBarBiz">();
  });

  test("preserveConsecutiveUppercase: foo BAR-Biz_BUZZ", () => {
    const data = "foo BAR-Biz_BUZZ";
    const whenTrue = toCamelCase(data, { preserveConsecutiveUppercase: true });

    expectTypeOf(whenTrue).toEqualTypeOf<"fooBARBizBUZZ">();

    const whenFalse = toCamelCase(data, {
      preserveConsecutiveUppercase: false,
    });

    expectTypeOf(whenFalse).toEqualTypeOf<"fooBarBizBuzz">();
  });

  test("preserveConsecutiveUppercase: foo\tBAR-Biz_BUZZ", () => {
    const data = "foo\tBAR-Biz_BUZZ";
    const whenTrue = toCamelCase(data, { preserveConsecutiveUppercase: true });

    expectTypeOf(whenTrue).toEqualTypeOf<"fooBARBizBUZZ">();

    const whenFalse = toCamelCase(data, {
      preserveConsecutiveUppercase: false,
    });

    expectTypeOf(whenFalse).toEqualTypeOf<"fooBarBizBuzz">();
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

describe("implicit default 'preserveConsecutiveUppercase' option matches explicit setting", () => {
  test("fooBAR", () => {
    const data = "fooBAR";

    expectTypeOf(toCamelCase(data)).toEqualTypeOf(
      toCamelCase(data, { preserveConsecutiveUppercase: true }),
    );
  });

  test("fooBARBiz", () => {
    const data = "fooBARBiz";

    expectTypeOf(toCamelCase(data)).toEqualTypeOf(
      toCamelCase(data, { preserveConsecutiveUppercase: true }),
    );
  });

  test("foo BAR-Biz_BUZZ", () => {
    const data = "foo BAR-Biz_BUZZ";

    expectTypeOf(toCamelCase(data)).toEqualTypeOf(
      toCamelCase(data, { preserveConsecutiveUppercase: true }),
    );
  });

  test("foo\tBAR-Biz_BUZZ", () => {
    const data = "foo\tBAR-Biz_BUZZ";

    expectTypeOf(toCamelCase(data)).toEqualTypeOf(
      toCamelCase(data, { preserveConsecutiveUppercase: true }),
    );
  });
});
