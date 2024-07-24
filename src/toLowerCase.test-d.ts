import { pipe } from "./pipe";
import { toLowerCase } from "./toLowerCase";

describe("data-first", () => {
  test("on lower case", () => {
    const result = toLowerCase("hello world");
    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on upper case", () => {
    const result = toLowerCase("HELLO WORLD");
    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on mixed case", () => {
    const result = toLowerCase("HeLlO WoRlD");
    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on empty string", () => {
    const result = toLowerCase("");
    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = toLowerCase("hello world" as string);
    expectTypeOf(result).toEqualTypeOf<Lowercase<string>>();
  });

  test("on template literal type", () => {
    const result = toLowerCase("prefix_123" as `PREFIX_${number}`);
    expectTypeOf(result).toEqualTypeOf<`prefix_${Lowercase<`${number}`>}`>();
  });
});

describe("data-last", () => {
  test("on lower case", () => {
    const result = pipe("hello world" as const, toLowerCase());
    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on upper case", () => {
    const result = pipe("HELLO WORLD" as const, toLowerCase());
    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on mixed case", () => {
    const result = pipe("HeLlO WoRlD" as const, toLowerCase());
    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on empty string", () => {
    const result = pipe("" as const, toLowerCase());
    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = pipe("hello world" as string, toLowerCase());
    expectTypeOf(result).toEqualTypeOf<Lowercase<string>>();
  });

  test("on template literal type", () => {
    const result = pipe("prefix_123" as `PREFIX_${number}`, toLowerCase());
    expectTypeOf(result).toEqualTypeOf<`prefix_${Lowercase<`${number}`>}`>();
  });
});
