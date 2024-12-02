import { expectTypeOf } from "expect-type";
import { toKebabCase } from "./toKebabCase";

test("primitive string", () => {
  const result = toKebabCase("hello world" as string);
  expectTypeOf(result).toEqualTypeOf<string>();
});

test("empty string", () => {
  const result = toKebabCase("" as const);
  expectTypeOf(result).toEqualTypeOf<"">();
});

test("camelCase", () => {
  const result = toKebabCase("helloWorld" as const);
  expectTypeOf(result).toEqualTypeOf<"hello-world">();
});

test("spaces and mixed cases", () => {
  const result = toKebabCase("Hello World" as const);
  expectTypeOf(result).toEqualTypeOf<"hello-world">();
});

test("spaces and lower case", () => {
  const result = toKebabCase("hello world" as const);
  expectTypeOf(result).toEqualTypeOf<"hello-world">();
});

test("spaces and UPPERCASE", () => {
  const result = toKebabCase("HELLO WORLD" as const);
  expectTypeOf(result).toEqualTypeOf<"hello-world">();
});

test("snake_case", () => {
  const result = toKebabCase("hello_world" as const);
  expectTypeOf(result).toEqualTypeOf<"hello-world">();
});

test("kebab-case", () => {
  const result = toKebabCase("hello-world" as const);
  expectTypeOf(result).toEqualTypeOf<"hello-world">();
});

test("string with multiple delimiters", () => {
  const result = toKebabCase("foo---bar" as const);
  expectTypeOf(result).toEqualTypeOf<"foo-bar">();
});

test("numbers", () => {
  const result = toKebabCase("helloWorld123" as const);
  expectTypeOf(result).toEqualTypeOf<"hello-world-123">();
});

test("string with special characters", () => {
  const result = toKebabCase("hello@world!" as const);
  expectTypeOf(result).toEqualTypeOf<"hello-@world-!">();
});
