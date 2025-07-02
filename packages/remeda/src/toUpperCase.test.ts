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
