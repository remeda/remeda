import { stringToPath } from "./stringToPath";

describe("runtime", () => {
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

  test("should handle relatively long paths without performance issues", () => {
    const res = stringToPath(
      "lorem.ipsum[dolor.sit].amet.con.sec.tetur[adi.pisc.ing].elit.42",
    );
    expect(res).toEqual([
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
    ]);
  });
});

describe("types", () => {
  test("simple const string are inferred", () => {
    const input = "foo[bar.baz].qui";
    const data = stringToPath(input);
    expectTypeOf(data).toEqualTypeOf<["foo", "bar.baz", "qui"]>();
  });

  test("dynamic strings cannot be inferred", () => {
    const bar = "bar" as string;
    const input = `foo.${bar}[baz]`;
    const data = stringToPath(input);
    expectTypeOf(data).toEqualTypeOf<Array<string>>();
  });
});
