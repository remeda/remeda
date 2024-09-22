import { only } from "./only";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("empty array", () => {
    expect(only([])).toBeUndefined();
  });

  test("length 1 array", () => {
    expect(only([1])).toBe(1);
  });

  test("length 2 array", () => {
    expect(only([1, 2])).toBeUndefined();
  });
});

describe("data last", () => {
  test("empty array", () => {
    expect(pipe([], only())).toBeUndefined();
  });

  test("length 1 array", () => {
    expect(pipe([1], only())).toBe(1);
  });

  test("length 2 array", () => {
    expect(pipe([1, 2], only())).toBeUndefined();
  });
});

test("simple tuple", () => {
  expect(only([1, "a"])).toBeUndefined();
});

test("tuple with last", () => {
  expect(only(["a", 1])).toBeUndefined();
});

test("tuple with two last", () => {
  expect(only(["a", 1, 2])).toBeUndefined();
});

test("tuple with first and last", () => {
  expect(only([1, "a", 2])).toBeUndefined();
});
