import { expect, test } from "vitest";
import { constant } from "./constant";
import { mapKeys } from "./mapKeys";
import { pipe } from "./pipe";

test("dataFirst", () => {
  expect(
    mapKeys({ a: 1, b: 2 }, (key, value) => `${key}${value}`),
  ).toStrictEqual({ a1: 1, b2: 2 });
});

test("dataLast", () => {
  expect(
    pipe(
      { a: 1, b: 2 },
      mapKeys((key, value) => `${key}${value}`),
    ),
  ).toStrictEqual({ a1: 1, b2: 2 });
});

test("symbols are filtered out", () => {
  expect(mapKeys({ [Symbol("mySymbol")]: 1 }, constant(3))).toStrictEqual({});
});

test("symbols are not passed to the mapper", () => {
  mapKeys({ [Symbol("mySymbol")]: 1, a: "hello" }, (key, value) => {
    expect(key).toBe("a");
    expect(value).toBe("hello");

    return key;
  });
});

test("symbols returned from the mapper are not ignored", () => {
  const mySymbol = Symbol("mySymbol");

  expect(mapKeys({ a: 1 }, constant(mySymbol))).toStrictEqual({
    [mySymbol]: 1,
  });
});

test("number keys are converted to strings", () => {
  mapKeys({ 123: 456 }, (key, value) => {
    expect(key).toBe("123");
    expect(value).toBe(456);

    return key;
  });
});

test("numbers returned from the mapper are used as-is", () => {
  expect(mapKeys({ a: "b" }, constant(123))).toStrictEqual({ 123: "b" });
});

test("`__proto__` returned from the mapper is an own property", () => {
  expect(
    Object.entries(mapKeys({ a: 1 }, constant("__proto__"))),
  ).toStrictEqual([["__proto__", 1]]);
});

test("`__proto__` returned from the mapper keeps the prototype", () => {
  expect(
    Object.getPrototypeOf(mapKeys({ a: { b: 1 } }, constant("__proto__"))),
  ).toBe(Object.prototype);
});
