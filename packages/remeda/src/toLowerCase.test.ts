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
