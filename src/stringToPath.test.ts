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

  test("should convert a string to a deeply nested path", () => {
    const res = stringToPath("foo.bar[3].baz");
    expect(res).toEqual(["foo", "bar", "3", "baz"]);
  });

  test("should handle nested dot paths", () => {
    const res = stringToPath("foo[bar.baz].qui.che");
    expect(res).toEqual(["foo", "bar.baz", "qui", "che"]);
  });

  test("should handle short path with only bracket access", () => {
    const res = stringToPath("foo[bar]");
    expect(res).toEqual(["foo", "bar"]);
  });

  test("should handle bracket access at the end", () => {
    const res = stringToPath("foo.bar[3]");
    expect(res).toEqual(["foo", "bar", "3"]);
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

  test("simple const string are inferred", () => {
    const input = "foo[bar.baz].qui";
    const data = stringToPath(input);
    expectTypeOf(data).toEqualTypeOf<["foo", "bar.baz", "qui"]>();
  });

  test("should handle relatively long paths without performance issues", () => {
    const res = stringToPath(
      "lorem.ipsum[dolor.sit].amet.con.sec.tetur[adi.pisc.ing].elit.42",
    );
    expectTypeOf(res).toEqualTypeOf<
      [
        "lorem",
        "ipsum",
        "dolor.sit",
        "amet",
        "con",
        "sec",
        "tetur",
        "adi.pisc.ing",
        "elit",
        "42",
      ]
    >();
  });

  test("dynamic strings cannot be inferred", () => {
    const bar = "bar" as string;
    const input = `foo.${bar}[baz]`;
    const data = stringToPath(input);
    expectTypeOf(data).toEqualTypeOf<never>();
  });
});
