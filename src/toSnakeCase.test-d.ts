import { expectTypeOf } from "expect-type";
import { toSnakeCase } from "./toSnakeCase";

test("primitive string", () => {
  const result = toSnakeCase("hello world" as string);
  expectTypeOf(result).toEqualTypeOf<string>();
});

test("empty string", () => {
  const result = toSnakeCase("" as const);
  expectTypeOf(result).toEqualTypeOf<"">();
});

test("camelCase", () => {
  const result = toSnakeCase("helloWorld" as const);
  expectTypeOf(result).toEqualTypeOf<"hello_world">();
});

test("spaces and mixed cases", () => {
  const result = toSnakeCase("Hello World" as const);
  expectTypeOf(result).toEqualTypeOf<"hello_world">();
});

test("spaces and lower case", () => {
  const result = toSnakeCase("hello world" as const);
  expectTypeOf(result).toEqualTypeOf<"hello_world">();
});

test("spaces and UPPERCASE", () => {
  const result = toSnakeCase("HELLO WORLD" as const);
  expectTypeOf(result).toEqualTypeOf<"hello_world">();
});

test("snake_case", () => {
  const result = toSnakeCase("hello_world" as const);
  expectTypeOf(result).toEqualTypeOf<"hello_world">();
});

test("kebab-case", () => {
  const result = toSnakeCase("hello-world" as const);
  expectTypeOf(result).toEqualTypeOf<"hello_world">();
});

test("string with multiple delimiters", () => {
  const result = toSnakeCase("foo___bar" as const);
  expectTypeOf(result).toEqualTypeOf<"foo_bar">();
});

test("numbers", () => {
  const result = toSnakeCase("helloWorld123" as const);
  expectTypeOf(result).toEqualTypeOf<"hello_world_123">();
});

test("string with special characters", () => {
  const result = toSnakeCase("hello@world!" as const);
  expectTypeOf(result).toEqualTypeOf<"hello_@world_!">();
});
