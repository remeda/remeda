import { describe, expect, test } from "vitest";
import { invert } from "./invert";
import { pipe } from "./pipe";

describe("data first", () => {
  test("empty object", () => {
    expect(invert({})).toStrictEqual({});
  });

  test("no duplicate values", () => {
    expect(invert({ a: "d", b: "e", c: "f" })).toStrictEqual({
      d: "a",
      e: "b",
      f: "c",
    });
  });

  test("duplicate values", () => {
    expect(invert({ a: "d", b: "e", c: "d" })).toStrictEqual({
      e: "b",
      d: "c",
    });
  });

  test("numeric values", () => {
    expect(invert(["a", "b", "c"])).toStrictEqual({ a: "0", b: "1", c: "2" });
  });

  test("symbol keys are filtered out", () => {
    expect(invert({ [Symbol("a")]: 4, a: "hello" })).toStrictEqual({
      hello: "a",
    });
  });

  test("number keys are converted to strings", () => {
    expect(invert({ 1: "a", 2: "b" })).toStrictEqual({ a: "1", b: "2" });
  });

  test("symbol values are fine", () => {
    const mySymbol = Symbol("my");

    expect(invert({ a: mySymbol })).toStrictEqual({ [mySymbol]: "a" });
  });
});

describe("data last", () => {
  test("empty object", () => {
    expect(pipe({}, invert())).toStrictEqual({});
  });

  test("no duplicate values", () => {
    expect(pipe({ a: "d", b: "e", c: "f" }, invert())).toStrictEqual({
      d: "a",
      e: "b",
      f: "c",
    });
  });

  test("duplicate values", () => {
    expect(pipe({ a: "d", b: "e", c: "d" }, invert())).toStrictEqual({
      e: "b",
      d: "c",
    });
  });

  test("numeric values", () => {
    expect(pipe(["a", "b", "c"], invert())).toStrictEqual({
      a: "0",
      b: "1",
      c: "2",
    });
  });
});
