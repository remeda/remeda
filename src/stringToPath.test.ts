import { stringToPath } from "./stringToPath";

test("should convert a string to a deeply nested path", () => {
  const res = stringToPath("foo.bar[3].baz");
  expect<["foo", "bar", "3", "baz"]>(res).toEqual(["foo", "bar", "3", "baz"]);
});

test("should handle nested dot paths", () => {
  const res = stringToPath("foo[bar.baz].qui.che");
  expect<["foo", "bar.baz", "qui", "che"]>(res).toEqual([
    "foo",
    "bar.baz",
    "qui",
    "che",
  ]);
});

test("should handle short path with only bracket access", () => {
  const res = stringToPath("foo[bar]");
  expect<["foo", "bar"]>(res).toEqual(["foo", "bar"]);
});

test("should handle bracket access at the end", () => {
  const res = stringToPath("foo.bar[3]");
  expect<["foo", "bar", "3"]>(res).toEqual(["foo", "bar", "3"]);
});

test("should handle relatively long paths without performance issues", () => {
  const res = stringToPath(
    "lorem.ipsum[dolor.sit].amet.con.sec.tetur[adi.pisc.ing].elit.42",
  );
  expect<
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
  >(res).toEqual([
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
