import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { uncapitalize } from "./uncapitalize";

describe("data-first", () => {
  test("empty string", () => {
    expect(uncapitalize("")).toBe("");
  });

  test("on lower case", () => {
    expect(uncapitalize("hello world")).toBe("hello world");
  });

  test("on upper case", () => {
    expect(uncapitalize("HELLO WORLD")).toBe("hELLO WORLD");
  });

  test("on mixed case", () => {
    expect(uncapitalize("HeLlO WoRlD")).toBe("heLlO WoRlD");
  });
});

describe("data-last", () => {
  test("empty string", () => {
    expect(pipe("", uncapitalize())).toBe("");
  });

  test("on lower case", () => {
    expect(pipe("hello world", uncapitalize())).toBe("hello world");
  });

  test("on upper case", () => {
    expect(pipe("HELLO WORLD", uncapitalize())).toBe("hELLO WORLD");
  });

  test("on mixed case", () => {
    expect(pipe("HeLlO WoRlD", uncapitalize())).toBe("heLlO WoRlD");
  });
});

describe("unicode", () => {
  test("maintains diacritics in rest of word", () => {
    expect(uncapitalize("Café Naïve")).toBe("café Naïve");
    expect(uncapitalize("CAFÉ NAÏVE")).toBe("cAFÉ NAÏVE");
  });

  test("handles non-Latin scripts", () => {
    expect(uncapitalize("Москва")).toBe("москва");
    expect(uncapitalize("Ελλάδα")).toBe("ελλάδα");
  });

  test("handles surrogate pairs (astral plane)", () => {
    expect(uncapitalize("𝒽Ello World")).toBe("𝒽Ello World");
  });

  test("doesn't explode on emojis", () => {
    expect(uncapitalize("🎉Party Time")).toBe("🎉Party Time");
  });

  test("handles combining characters", () => {
    expect(uncapitalize("É\u0301llo")).toBe("é\u0301llo");
  });

  test("single surrogate pair", () => {
    expect(uncapitalize("𝒽")).toBe("𝒽");
  });

  test("single accented character", () => {
    expect(uncapitalize("É")).toBe("é");
  });
});
