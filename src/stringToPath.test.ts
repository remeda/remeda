import { stringToPath } from "./stringToPath";

test("empty path", () => {
  expect(stringToPath("")).toStrictEqual([]);
});

test("single propName", () => {
  expect(stringToPath("a")).toStrictEqual(["a"]);
});

test("single index", () => {
  expect(stringToPath("[0]")).toStrictEqual(["0"]);
});

test("should handle short path with only bracket access", () => {
  expect(stringToPath("foo[bar]")).toEqual(["foo", "bar"]);
});

test("should handle bracket access at the end", () => {
  const res = stringToPath("foo.bar[3]");

  expect(res).toEqual(["foo", "bar", "3"]);
});

test("should convert a string to a deeply nested path", () => {
  expect(stringToPath("foo.bar[3].baz")).toStrictEqual([
    "foo",
    "bar",
    "3",
    "baz",
  ]);
});

test("should handle nested dot paths", () => {
  expect(stringToPath("foo[bar.baz].qui.che")).toStrictEqual([
    "foo",
    "bar.baz",
    "qui",
    "che",
  ]);
});

describe("erroneous edge-cases", () => {
  test("index with string value", () => {
    // The function accepts these, is this a valid input?
    expect(stringToPath("[a]")).toStrictEqual(["a"]);
  });

  test("prop name with numbers", () => {
    // The function accepts these, is this a valid input?
    expect(stringToPath("1")).toStrictEqual(["1"]);
  });

  test.each(
    // ¯\_(ツ)_/¯
    [".", "..", "[", "]", "[[", "]]", "[.", "].", ".[", ".]"],
  )("malformed input: %s", (input) => {
    expect(stringToPath(input)).toStrictEqual([input]);
  });
});
