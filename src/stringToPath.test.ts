import { stringToPath } from "./stringToPath";

describe("stringToPath", () => {
  describe("implementation", () => {
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
      assertType<["foo", "bar.baz", "qui"]>(data);
    });

    test("string constructed from const strings are inferred", () => {
      const bar = "bar";
      const baz = "baz";
      const qui = "qui";
      const input = `foo[${bar}.${baz}].${qui}.che`;
      const data = stringToPath(input);
      assertType<["foo", "bar.baz", "qui", "che"]>(data);
    });

    test("dynamic strings cannot be inferred", () => {
      // eslint-disable-next-line @typescript-eslint/no-inferrable-types
      const bar: string = "bar";
      const input = `foo.${bar}[baz]`;
      const data = stringToPath(input);
      assertType<Array<string>>(data);
    });
  });
});
