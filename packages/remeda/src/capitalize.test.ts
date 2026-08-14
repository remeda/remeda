import { describe, expect, test } from "vitest";
import { capitalize } from "./capitalize";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("empty string", () => {
    expect(capitalize("")).toBe("");
  });

  test("on lower case", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });

  test("on upper case", () => {
    expect(capitalize("HELLO WORLD")).toBe("HELLO WORLD");
  });

  test("on mixed case", () => {
    expect(capitalize("heLlO WoRlD")).toBe("HeLlO WoRlD");
  });
});

describe("data-last", () => {
  test("empty string", () => {
    expect(pipe("", capitalize())).toBe("");
  });

  test("on lower case", () => {
    expect(pipe("hello world", capitalize())).toBe("Hello world");
  });

  test("on upper case", () => {
    expect(pipe("HELLO WORLD", capitalize())).toBe("HELLO WORLD");
  });

  test("on mixed case", () => {
    expect(pipe("heLlO WoRlD", capitalize())).toBe("HeLlO WoRlD");
  });
});

describe("unicode", () => {
  test("maintains diacritics in rest of word", () => {
    expect(capitalize("café naïve")).toBe("Café naïve");
    expect(capitalize("CAFÉ NAÏVE")).toBe("CAFÉ NAÏVE");
  });

  test("handles non-Latin scripts", () => {
    expect(capitalize("москва")).toBe("Москва");
    expect(capitalize("ελλάδα")).toBe("Ελλάδα");
  });

  test("handles surrogate pairs (astral plane)", () => {
    expect(capitalize("𝒽ello world")).toBe("𝒽ello world");
  });

  test("doesn't explode on emojis", () => {
    expect(capitalize("🎉party time")).toBe("🎉party time");
  });

  test("handles combining characters", () => {
    expect(capitalize("é\u{301}llo")).toBe("É\u{301}llo");
  });

  test("single accented char", () => {
    expect(capitalize("é")).toBe("É");
  });

  test("single surrogate pair", () => {
    expect(capitalize("𝒽")).toBe("𝒽");
  });
});
