import { pipe } from "./pipe";
import { toSnakeCase } from "./toSnakeCase";

describe("data-last", () => {
  test("hello world", () => {
    const result = pipe("hello world" as const, toSnakeCase());
    expectTypeOf(result).toEqualTypeOf<"hello_world">();
  });
});

describe("tests copied from type-fest's tests", () => {
  test("pascal", () => {
    const result = toSnakeCase("FooBar");
    expectTypeOf(result).toEqualTypeOf<"foo_bar">();
  });

  test("kebab", () => {
    const result = toSnakeCase("foo-bar");
    expectTypeOf(result).toEqualTypeOf<"foo_bar">();
  });

  test("complex kebab", () => {
    const result = toSnakeCase("foo-bar-abc-123");
    expectTypeOf(result).toEqualTypeOf<"foo_bar_abc_123">();
  });

  test("space", () => {
    const result = toSnakeCase("foo bar");
    expectTypeOf(result).toEqualTypeOf<"foo_bar">();
  });

  test("snake", () => {
    const result = toSnakeCase("foo_bar");
    expectTypeOf(result).toEqualTypeOf<"foo_bar">();
  });

  test("no delimiter from mono", () => {
    const result = toSnakeCase("foobar");
    expectTypeOf(result).toEqualTypeOf<"foobar">();
  });

  test("mixed", () => {
    const result = toSnakeCase("foo-bar_abc xyzBarFoo");
    expectTypeOf(result).toEqualTypeOf<"foo_bar_abc_xyz_bar_foo">();
  });

  test("vendor prefixed css property", () => {
    const result = toSnakeCase("-webkit-animation");
    // TODO: to solve this we probably need to open a PR in type-fest first
    // @ts-expect-error - as above
    expectTypeOf(result).toEqualTypeOf<"webkit_animation">();
  });

  test("double prefixed kebab", () => {
    const result = toSnakeCase("--very-prefixed");
    // TODO: to solve this we probably need to open a PR in type-fest first
    // @ts-expect-error - as above
    expectTypeOf(result).toEqualTypeOf<"very_prefixed">();
  });

  test("repeated separators", () => {
    const result = toSnakeCase("foo____bar");
    // TODO: to solve this we probably need to open a PR in type-fest first
    // @ts-expect-error - as above
    expectTypeOf(result).toEqualTypeOf<"foo_bar">();
  });

  test("uppercase", () => {
    const result = toSnakeCase("FOO");
    expectTypeOf(result).toEqualTypeOf<"foo">();
  });

  test("lowercase", () => {
    const result = toSnakeCase("foo");
    expectTypeOf(result).toEqualTypeOf<"foo">();
  });

  test("screaming snake case", () => {
    const result = toSnakeCase("FOO_BAR");
    expectTypeOf(result).toEqualTypeOf<"foo_bar">();
  });

  test("screaming kebab case", () => {
    const result = toSnakeCase("FOO-BAR");
    expectTypeOf(result).toEqualTypeOf<"foo_bar">();
  });

  test("preserveConsecutiveUppercase: fooBAR", () => {
    const data = "fooBAR";
    const whenTrue = toSnakeCase(data);
    // TODO: to solve this we probably need to open a PR in type-fest first
    // @ts-expect-error - as above
    expectTypeOf(whenTrue).toEqualTypeOf<"foo_bar">();
  });

  test("preserveConsecutiveUppercase: fooBAR", () => {
    const data = "fooBARBiz";
    const whenTrue = toSnakeCase(data);
    // TODO: to solve this we probably need to open a PR in type-fest first
    // @ts-expect-error - as above
    expectTypeOf(whenTrue).toEqualTypeOf<"foo_bar_biz">();
  });

  test("preserveConsecutiveUppercase: fooBAR", () => {
    const data = "foo BAR-Biz_BUZZ";
    const whenTrue = toSnakeCase(data);
    // TODO: to solve this we probably need to open a PR in type-fest first
    // @ts-expect-error - as above
    expectTypeOf(whenTrue).toEqualTypeOf<"foo_bar_biz_buzz">();
  });

  test("preserveConsecutiveUppercase: fooBAR", () => {
    const data = "foo\tBAR-Biz_BUZZ";
    const whenTrue = toSnakeCase(data);
    // TODO: to solve this we probably need to open a PR in type-fest first
    // @ts-expect-error - as above
    expectTypeOf(whenTrue).toEqualTypeOf<"foo_bar_biz_buzz">();
  });
});

test("fallback when regular string", () => {
  const result = toSnakeCase("hello world" as string);
  expectTypeOf(result).toEqualTypeOf<string>();
});

test("with template literal type (lowercase)", () => {
  const result = toSnakeCase("this_is_1" as `this_is_${number}`);
  expectTypeOf(result).toEqualTypeOf<`this_is_${number}`>();
});

test("with template literal type (uppercase)", () => {
  const result = toSnakeCase("THIS_IS_1" as `THIS_IS_${number}`);

  // TODO: to solve this we probably need to open a PR in type-fest first
  // @ts-expect-error - as above
  expectTypeOf(result).toEqualTypeOf<`this_is_${number}`>();
});
