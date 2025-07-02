import { expectTypeOf, test } from "vitest";
import { stringToPath } from "./stringToPath";

test("should convert a string to a deeply nested path", () => {
  const result = stringToPath("a.b[0].c");

  expectTypeOf(result).toEqualTypeOf<["a", "b", "0", "c"]>();
});

test("simple const string are inferred", () => {
  const result = stringToPath("foo[bar.baz].qui");

  expectTypeOf(result).toEqualTypeOf<["foo", "bar.baz", "qui"]>();
});

test("should handle long paths", () => {
  const result = stringToPath(
    "lorem.ipsum[dolor.sit].amet.con.sec.tetur[adi.pisc.ing].elit.42",
  );

  expectTypeOf(result).toEqualTypeOf<
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
  const result = stringToPath(`foo.${"bar" as string}[baz]`);

  expectTypeOf(result).toEqualTypeOf<never>();
});
