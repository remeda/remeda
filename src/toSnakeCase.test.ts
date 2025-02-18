import { pipe } from "./pipe";
import { toSnakeCase } from "./toSnakeCase";

describe("data-first", () => {
  test("on lower case", () => {
    expect(toSnakeCase("hello world")).toBe("hello_world");
  });

  test("on upper case", () => {
    expect(toSnakeCase("HELLO WORLD")).toBe("hello_world");
  });

  test("on mixed case", () => {
    expect(toSnakeCase("HeLlO WoRlD")).toBe("he_ll_o_wo_rl_d");
  });

  test("on snake case", () => {
    expect(toSnakeCase("hello_world")).toBe("hello_world");
  });

  test("on camel case", () => {
    expect(toSnakeCase("helloWorld")).toBe("hello_world");
  });

  test("on kebab case", () => {
    expect(toSnakeCase("hello-world")).toBe("hello_world");
  });

  test("on prefixed string", () => {
    expect(toSnakeCase("__HELLO_WORLD__")).toBe("hello_world");
  });

  test("on string with multiple delimiters", () => {
    expect(toSnakeCase("foo---bar")).toBe("foo_bar");
  });
});

describe("data-last", () => {
  test("on lower case", () => {
    expect(pipe("hello world", toSnakeCase())).toBe("hello_world");
  });

  test("on upper case", () => {
    expect(pipe("HELLO WORLD", toSnakeCase())).toBe("hello_world");
  });

  test("on mixed case", () => {
    expect(pipe("HeLlO WoRlD", toSnakeCase())).toBe("he_ll_o_wo_rl_d");
  });

  test("on snake case", () => {
    expect(pipe("hello_world", toSnakeCase())).toBe("hello_world");
  });

  test("on camel case", () => {
    expect(pipe("helloWorld", toSnakeCase())).toBe("hello_world");
  });

  test("on kebab case", () => {
    expect(pipe("hello-world", toSnakeCase())).toBe("hello_world");
  });
});

describe("type-fest cases", () => {
  test.each(["fooBar", "foo-bar", "foo bar", "foo_bar"])(
    "%s to be foo-bar",
    (str) => {
      expect(toSnakeCase(str)).toBe("foo_bar");
    },
  );

  test("trivial case", () => {
    expect(toSnakeCase("foobar")).toBe("foobar");
  });
});

describe.each([
  "foo bar",
  "Foo bar",
  "foo Bar",
  "Foo Bar",
  "FOO BAR",
  "fooBar",
  "--foo-bar--",
  "__foo_bar__",
])("lodash case: %s", (str) => {
  test("should convert string to kebab case", () => {
    expect(toSnakeCase(str)).toBe("foo_bar");
  });

  test("should handle double-converting strings", () => {
    expect(toSnakeCase(toSnakeCase(str))).toBe("foo_bar");
  });
});
