import { describe, expectTypeOf, test } from "vitest";
import { capitalize } from "./capitalize";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("on lower case", () => {
    const result = capitalize("hello world");

    expectTypeOf(result).toEqualTypeOf<"Hello world">();
  });

  test("on upper case", () => {
    const result = capitalize("HELLO WORLD");

    expectTypeOf(result).toEqualTypeOf<"HELLO WORLD">();
  });

  test("on mixed case", () => {
    const result = capitalize("heLlO WoRlD");

    expectTypeOf(result).toEqualTypeOf<"HeLlO WoRlD">();
  });

  test("on empty string", () => {
    const result = capitalize("");

    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = capitalize("hello world" as string);

    expectTypeOf(result).toEqualTypeOf<Capitalize<string>>();
  });

  test("on template literal type", () => {
    const result = capitalize("prefix_123" as `prefix_${number}`);

    expectTypeOf(result).toEqualTypeOf<`Prefix_${number}`>();
  });
});

describe("data-last", () => {
  test("on lower case", () => {
    const result = pipe("hello world" as const, capitalize());

    expectTypeOf(result).toEqualTypeOf<"Hello world">();
  });

  test("on upper case", () => {
    const result = pipe("HELLO WORLD" as const, capitalize());

    expectTypeOf(result).toEqualTypeOf<"HELLO WORLD">();
  });

  test("on mixed case", () => {
    const result = pipe("heLlO WoRlD" as const, capitalize());

    expectTypeOf(result).toEqualTypeOf<"HeLlO WoRlD">();
  });

  test("on empty string", () => {
    const result = pipe("" as const, capitalize());

    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = pipe("hello world" as string, capitalize());

    expectTypeOf(result).toEqualTypeOf<Capitalize<string>>();
  });

  test("on template literal type", () => {
    const result = pipe("prefix_123" as `prefix_${number}`, capitalize());

    expectTypeOf(result).toEqualTypeOf<`Prefix_${number}`>();
  });
});
