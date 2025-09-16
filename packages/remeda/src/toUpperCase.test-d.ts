import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { toUpperCase } from "./toUpperCase";

describe("data-first", () => {
  test("on lower case", () => {
    const result = toUpperCase("hello world");

    expectTypeOf(result).toEqualTypeOf<"HELLO WORLD">();
  });

  test("on upper case", () => {
    const result = toUpperCase("HELLO WORLD");

    expectTypeOf(result).toEqualTypeOf<"HELLO WORLD">();
  });

  test("on mixed case", () => {
    const result = toUpperCase("HeLlO WoRlD");

    expectTypeOf(result).toEqualTypeOf<"HELLO WORLD">();
  });

  test("on empty string", () => {
    const result = toUpperCase("");

    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = toUpperCase("hello world" as string);

    expectTypeOf(result).toEqualTypeOf<Uppercase<string>>();
  });

  test("on template literal type", () => {
    const result = toUpperCase("prefix_123" as `prefix_${number}`);

    expectTypeOf(result).toEqualTypeOf<`PREFIX_${Uppercase<`${number}`>}`>();
  });
});

describe("data-last", () => {
  test("on lower case", () => {
    const result = pipe("hello world" as const, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<"HELLO WORLD">();
  });

  test("on upper case", () => {
    const result = pipe("HELLO WORLD" as const, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<"HELLO WORLD">();
  });

  test("on mixed case", () => {
    const result = pipe("HeLlO WoRlD" as const, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<"HELLO WORLD">();
  });

  test("on empty string", () => {
    const result = pipe("" as const, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = pipe("hello world" as string, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<Uppercase<string>>();
  });

  test("on template literal type", () => {
    const result = pipe("prefix_123" as `prefix_${number}`, toUpperCase());

    expectTypeOf(result).toEqualTypeOf<`PREFIX_${Uppercase<`${number}`>}`>();
  });
});

describe("unicode", () => {
  test("handles diacritics", () => {
    expectTypeOf(toUpperCase("café naïve")).toEqualTypeOf<"CAFÉ NAÏVE">();
  });

  test("handles non-Latin scripts", () => {
    expectTypeOf(toUpperCase("москва")).toEqualTypeOf<"МОСКВА">();
    expectTypeOf(toUpperCase("ελλάδα")).toEqualTypeOf<"ΕΛΛΆΔΑ">();
  });

  test("doesn't explode on emojis", () => {
    expectTypeOf(toUpperCase("🎉party")).toEqualTypeOf<"🎉PARTY">();
  });

  test("handles surrogate pairs (astral plane)", () => {
    expectTypeOf(toUpperCase("𝒽ello")).toEqualTypeOf<"𝒽ELLO">();
  });

  test("handles combining characters", () => {
    expectTypeOf(toUpperCase("e\u0301llo")).toEqualTypeOf<"E\u0301LLO">();
  });

  test("handles German eszett", () => {
    expectTypeOf(toUpperCase("straße")).toEqualTypeOf<"STRASSE">();
  });

  test("handles Turkish dotted I", () => {
    expectTypeOf(toUpperCase("i̇stanbul")).toEqualTypeOf<"İSTANBUL">();
  });
});
