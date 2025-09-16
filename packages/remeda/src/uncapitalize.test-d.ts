import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { uncapitalize } from "./uncapitalize";

describe("data-first", () => {
  test("on lower case", () => {
    const result = uncapitalize("hello world");

    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on upper case", () => {
    const result = uncapitalize("HELLO WORLD");

    expectTypeOf(result).toEqualTypeOf<"hELLO WORLD">();
  });

  test("on mixed case", () => {
    const result = uncapitalize("HeLlO WoRlD");

    expectTypeOf(result).toEqualTypeOf<"heLlO WoRlD">();
  });

  test("on empty string", () => {
    const result = uncapitalize("");

    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = uncapitalize("hello world" as string);

    expectTypeOf(result).toEqualTypeOf<Uncapitalize<string>>();
  });

  test("on template literal type", () => {
    const result = uncapitalize("PREFIX_123" as `PREFIX_${number}`);

    expectTypeOf(result).toEqualTypeOf<`pREFIX_${number}`>();
  });
});

describe("data-last", () => {
  test("on lower case", () => {
    const result = pipe("hello world" as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<"hello world">();
  });

  test("on upper case", () => {
    const result = pipe("HELLO WORLD" as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<"hELLO WORLD">();
  });

  test("on mixed case", () => {
    const result = pipe("HeLlO WoRlD" as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<"heLlO WoRlD">();
  });

  test("on empty string", () => {
    const result = pipe("" as const, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<"">();
  });

  test("on non-literal string", () => {
    const result = pipe("hello world" as string, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<Uncapitalize<string>>();
  });

  test("on template literal type", () => {
    const result = pipe("PREFIX_123" as `PREFIX_${number}`, uncapitalize());

    expectTypeOf(result).toEqualTypeOf<`pREFIX_${number}`>();
  });
});

describe("unicode", () => {
  test("maintains diacritics in rest of word", () => {
    expectTypeOf(uncapitalize("Café Naïve")).toEqualTypeOf<"café Naïve">();
    expectTypeOf(uncapitalize("CAFÉ NAÏVE")).toEqualTypeOf<"cAFÉ NAÏVE">();
  });

  test("handles non-Latin scripts", () => {
    expectTypeOf(uncapitalize("Москва")).toEqualTypeOf<"москва">();
    expectTypeOf(uncapitalize("Ελλάδα")).toEqualTypeOf<"ελλάδα">();
  });

  test("handles surrogate pairs (astral plane)", () => {
    expectTypeOf(uncapitalize("𝒽Ello World")).toEqualTypeOf<"𝒽Ello World">();
  });

  test("doesn't explode on emojis", () => {
    expectTypeOf(uncapitalize("🎉Party Time")).toEqualTypeOf<"🎉Party Time">();
  });

  test("handles combining characters", () => {
    expectTypeOf(uncapitalize("É\u0301llo")).toEqualTypeOf<"é\u0301llo">();
  });

  test("single surrogate pair", () => {
    expectTypeOf(uncapitalize("𝒽")).toEqualTypeOf<"𝒽">();
  });

  test("single accented character", () => {
    expectTypeOf(uncapitalize("É")).toEqualTypeOf<"é">();
  });
});
