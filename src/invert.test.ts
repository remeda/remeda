import { invert } from "./invert";
import { pipe } from "./pipe";

describe("data first", () => {
  test("empty object", () => {
    expect(invert({})).toEqual({});
  });

  test("no duplicate values", () => {
    expect(invert({ a: "d", b: "e", c: "f" })).toEqual({
      d: "a",
      e: "b",
      f: "c",
    });
  });

  test("duplicate values", () => {
    expect(invert({ a: "d", b: "e", c: "d" })).toEqual({ e: "b", d: "c" });
  });

  test("numeric values", () => {
    expect(invert(["a", "b", "c"])).toEqual({ a: "0", b: "1", c: "2" });
  });

  test("symbol keys are filtered out", () => {
    expect(invert({ [Symbol("a")]: 4, a: "hello" })).toEqual({ hello: "a" });
  });

  test("number keys are converted to strings", () => {
    expect(invert({ 1: "a", 2: "b" })).toEqual({ a: "1", b: "2" });
  });

  test("symbol values are fine", () => {
    const mySymbol = Symbol("my");

    expect(invert({ a: mySymbol })).toEqual({ [mySymbol]: "a" });
  });
});

describe("data last", () => {
  test("empty object", () => {
    expect(pipe({}, invert())).toEqual({});
  });

  test("no duplicate values", () => {
    expect(pipe({ a: "d", b: "e", c: "f" }, invert())).toEqual({
      d: "a",
      e: "b",
      f: "c",
    });
  });

  test("duplicate values", () => {
    expect(pipe({ a: "d", b: "e", c: "d" }, invert())).toEqual({
      e: "b",
      d: "c",
    });
  });

  test("numeric values", () => {
    expect(pipe(["a", "b", "c"], invert())).toEqual({
      a: "0",
      b: "1",
      c: "2",
    });
  });
});
