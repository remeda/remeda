import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { toUpperCase } from "./toUpperCase";

describe("data-first", () => {
  test("on lower case", () => {
    expect(toUpperCase("hello world")).toBe("HELLO WORLD");
  });

  test("on upper case", () => {
    expect(toUpperCase("HELLO WORLD")).toBe("HELLO WORLD");
  });

  test("on mixed case", () => {
    expect(toUpperCase("HeLlO WoRlD")).toBe("HELLO WORLD");
  });
});

describe("data-last", () => {
  test("on lower case", () => {
    expect(pipe("hello world", toUpperCase())).toBe("HELLO WORLD");
  });

  test("on upper case", () => {
    expect(pipe("HELLO WORLD", toUpperCase())).toBe("HELLO WORLD");
  });

  test("on mixed case", () => {
    expect(pipe("HeLlO WoRlD", toUpperCase())).toBe("HELLO WORLD");
  });
});

describe("unicode", () => {
  test("handles diacritics", () => {
    expect(toUpperCase("café naïve")).toBe("CAFÉ NAÏVE");
  });

  test("handles non-Latin scripts", () => {
    expect(toUpperCase("москва")).toBe("МОСКВА");
    expect(toUpperCase("ελλάδα")).toBe("ΕΛΛΆΔΑ");
  });

  test("doesn't explode on emojis", () => {
    expect(toUpperCase("🎉party")).toBe("🎉PARTY");
  });

  test("handles surrogate pairs (astral plane)", () => {
    expect(toUpperCase("𝒽ello")).toBe("𝒽ELLO");
  });

  test("handles combining characters", () => {
    expect(toUpperCase("e\u0301llo")).toBe("E\u0301LLO");
  });

  test("handles German eszett", () => {
    expect(toUpperCase("straße")).toBe("STRASSE");
  });

  test("handles Turkish dotted I", () => {
    expect(toUpperCase("i̇stanbul")).toBe("İSTANBUL");
  });
});
