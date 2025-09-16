import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { toLowerCase } from "./toLowerCase";

describe("data-first", () => {
  test("on lower case", () => {
    expect(toLowerCase("hello world")).toBe("hello world");
  });

  test("on upper case", () => {
    expect(toLowerCase("HELLO WORLD")).toBe("hello world");
  });

  test("on mixed case", () => {
    expect(toLowerCase("HeLlO WoRlD")).toBe("hello world");
  });
});

describe("data-last", () => {
  test("on lower case", () => {
    expect(pipe("hello world", toLowerCase())).toBe("hello world");
  });

  test("on upper case", () => {
    expect(pipe("HELLO WORLD", toLowerCase())).toBe("hello world");
  });

  test("on mixed case", () => {
    expect(pipe("HeLlO WoRlD", toLowerCase())).toBe("hello world");
  });
});

describe("unicode", () => {
  test("handles diacritics", () => {
    expect(toLowerCase("CAFÉ NAÏVE")).toBe("café naïve");
  });

  test("handles non-Latin scripts", () => {
    expect(toLowerCase("МОСКВА")).toBe("москва");
    expect(toLowerCase("ΕΛΛΆΔΑ")).toBe("ελλάδα");
  });

  test("handles surrogate pairs (astral plane)", () => {
    expect(toLowerCase("𝒽ELLO")).toBe("𝒽ello");
  });

  test("doesn't explode on emojis", () => {
    expect(toLowerCase("🎉PARTY")).toBe("🎉party");
  });

  test("handles combining characters", () => {
    expect(toLowerCase("É\u0301LLO")).toBe("é\u0301llo");
  });

  test("handles Turkish dotted I", () => {
    expect(toLowerCase("İSTANBUL")).toBe("i̇stanbul");
  });
});
