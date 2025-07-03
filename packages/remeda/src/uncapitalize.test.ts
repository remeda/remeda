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
