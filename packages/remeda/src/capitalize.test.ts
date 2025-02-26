import { pipe } from "./pipe";
import { capitalize } from "./capitalize";

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
