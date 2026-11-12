import { describe, expect, test } from "vitest";
import { keys } from "./keys";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("work with arrays", () => {
    expect(keys(["x", "y", "z"])).toStrictEqual(["0", "1", "2"]);
  });

  test("work with objects", () => {
    expect(keys({ a: "x", b: "y", c: "z" })).toStrictEqual(["a", "b", "c"]);
  });

  test("should return strict types", () => {
    expect(keys({ 5: "x", b: "y", c: "z" })).toStrictEqual(["5", "b", "c"]);
  });

  test("should ignore symbol keys", () => {
    expect(keys({ [Symbol("a")]: 1 })).toStrictEqual([]);
  });

  test("should turn numbers to strings", () => {
    expect(keys({ 1: "hello" })).toStrictEqual(["1"]);
  });
});

describe("dataLast", () => {
  test("works with objects", () => {
    expect(pipe({ a: 1 }, keys())).toStrictEqual(["a"]);
  });
});
