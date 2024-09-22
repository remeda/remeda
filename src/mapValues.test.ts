import { constant } from "./constant";
import { mapValues } from "./mapValues";
import { pipe } from "./pipe";

test("dataFirst", () => {
  expect(
    mapValues({ a: 1, b: 2 }, (value, key) => `${value}${key}`),
  ).toStrictEqual({ a: "1a", b: "2b" });
});

test("dataLast", () => {
  expect(
    pipe(
      { a: 1, b: 2 },
      mapValues((value, key) => `${value}${key}`),
    ),
  ).toStrictEqual({ a: "1a", b: "2b" });
});

test("symbols are filtered out", () => {
  expect(
    mapValues({ [Symbol("mySymbol")]: 1 }, constant("hello")),
  ).toStrictEqual({});
});

test("symbols are not passed to the mapper", () => {
  mapValues({ [Symbol("mySymbol")]: 1, a: "hello" }, (value, key) => {
    expect(value).toBe("hello");
    expect(key).toBe("a");

    return "world";
  });
});

test("number keys are converted to string in the mapper", () => {
  mapValues({ 123: 456 }, (value, key) => {
    expect(value).toBe(456);
    expect(key).toBe("123");

    return "world";
  });
});
