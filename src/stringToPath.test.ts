import { stringToPath } from "./stringToPath";

test("should convert a string to a deeply nested path", () => {
  const res = stringToPath("a.b[0].c");
  expect<["a", "b", "0", "c"]>(res).toEqual(["a", "b", "0", "c"]);
});

test("should handle nested dot paths", () => {
  const res = stringToPath("a.b[a.b].c");
  expect<["a", "b", "a.b", "c"]>(res).toEqual(["a", "b", "a.b", "c"]);
});

test("test with more than one-letter keys", () => {
  const res = stringToPath("foo.bar[3].baz");
  assertType<["foo", "bar", "3", "baz"]>(res);
  expect(res).toEqual(["foo", "bar", "3", "baz"]);
});
