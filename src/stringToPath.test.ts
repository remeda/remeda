import { stringToPath } from "./stringToPath";

describe("runtime", () => {
  test("should convert a string to a deeply nested path", () => {
    expect(stringToPath("a.b[0].c")).toStrictEqual(["a", "b", "0", "c"]);
  });

  test("should handle nested dot paths", () => {
    expect(stringToPath("a.b[a.b].c")).toStrictEqual(["a", "b", "a.b", "c"]);
  });

  test("empty path", () => {
    expect(stringToPath("")).toStrictEqual([]);
  });

  test("single propName", () => {
    expect(stringToPath("a")).toStrictEqual(["a"]);
  });

  test("single index", () => {
    expect(stringToPath("[0]")).toStrictEqual(["0"]);
  });

  test("index with string value", () => {
    // The function accepts these, is this a valid input?
    expect(stringToPath("[a]")).toStrictEqual(["a"]);
  });

  test("prop name with numbers", () => {
    // The function accepts these, is this a valid input?
    expect(stringToPath("1")).toStrictEqual(["1"]);
  });

  test.each([
    // ¯\_(ツ)_/¯
    [".", ["."]],
    ["..", [".."]],
    ["[", ["["]],
    ["]", ["]"]],
    ["[[", ["[["]],
    ["]]", ["]]"]],
    ["[.", ["[."]],
    ["].", ["]."]],
    [".[", [".["]],
    [".]", [".]"]],
  ])("malformed input: %s", (input, output) => {
    expect(stringToPath(input)).toStrictEqual(output);
  });
});

describe("typing", () => {
  test("should convert a string to a deeply nested path", () => {
    const res = stringToPath("a.b[0].c");
    expectTypeOf(res).toEqualTypeOf<["a", "b", "0", "c"]>();
  });

  test("should handle nested dot paths", () => {
    const res = stringToPath("a.b[a.b].c");
    expectTypeOf(res).toEqualTypeOf<["a", "b", "a.b", "c"]>();
  });
});
