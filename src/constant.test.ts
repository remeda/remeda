import { add } from "./add";
import { constant } from "./constant";
import { map } from "./map";
import { pipe } from "./pipe";
import { sliceString } from "./sliceString";
import { times } from "./times";

test("works", () => {
  const one = constant(1);
  expect(one()).toBe(1);
});

test("returns identity (doesn't clone)", () => {
  const obj = {} as { a?: boolean };
  const emptyObj = constant(obj);
  const firstInvocation = emptyObj();
  expect(firstInvocation).toEqual({});
  expect(firstInvocation).toBe(obj);

  obj.a = true;

  expect(firstInvocation).toEqual({ a: true });

  expect(emptyObj()).toEqual({ a: true });
  expect(emptyObj()).toBe(obj);
});

test("works with more than one argument", () => {
  const one = constant(1);
  expect(one(1)).toBe(1);
  expect(one(1, 2)).toBe(1);
  expect(one(1, 2, "a")).toBe(1);
  expect(one(undefined)).toBe(1);
  expect(one(["a"])).toBe(1);
});

test("works with variadic arguments", () => {
  const data = [1, 2, 3] as const;
  const one = constant("a");
  expect(one(...data)).toBe("a");
});

test("can be put in a pipe", () => {
  expect(pipe([1, 2, 3], constant([2, 3, 4]), map(add(1)))).toEqual([3, 4, 5]);
});

test("can completely change the type of the pipe", () => {
  expect(pipe([1, 2, 3], constant("hello world"), sliceString(0, 4))).toEqual(
    "hell",
  );
});

test("can be used as a fill function (with times)", () => {
  expect(times(10, constant("a"))).toEqual([
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
    "a",
  ]);
});
