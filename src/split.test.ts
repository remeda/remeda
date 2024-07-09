import { split } from "./split";
import { pipe } from "./pipe";

test("empty string, empty separator", () => {
  expect(split("", "")).toEqual([]);
});

test("empty string, non-empty separator", () => {
  expect(split("", ",")).toEqual([""]);
});

test("trivial split", () => {
  expect(split("a", ",")).toEqual(["a"]);
});

test("string contains separator", () => {
  expect(split(",", ",")).toEqual(["", ""]);
});

test("useful split", () => {
  expect(split("a,b,c", ",")).toEqual(["a", "b", "c"]);
});

test("regex split", () => {
  expect(split("a,b,c", /,/u)).toEqual(["a", "b", "c"]);
});

test("multiple types of separators", () => {
  expect(split("a,b;c", /[;,]/u)).toEqual(["a", "b", "c"]);
});

test("regex with limit", () => {
  expect(split("a,b,c", /,/u, 2)).toEqual(["a", "b"]);
});

test("limited split", () => {
  expect(split("a,b,c", ",", 2)).toEqual(["a", "b"]);
});

test("limit is higher than splits", () => {
  expect(split("a,b,c", ",", 5)).toEqual(["a", "b", "c"]);
});

test("multiple consecutive separators", () => {
  expect(split("a,,b", ",")).toEqual(["a", "", "b"]);
});

test("separator at the start and end", () => {
  expect(split(",a,b,", ",")).toEqual(["", "a", "b", ""]);
});

test("empty-string separator", () => {
  expect(split("abcdef", "")).toEqual(["a", "b", "c", "d", "e", "f"]);
});

test("undefined limit", () => {
  expect(split("a,b,c", ",", undefined)).toEqual(["a", "b", "c"]);
});

test("negative limit", () => {
  expect(split("a,b,c", ",", -1)).toEqual(["a", "b", "c"]);
});

test("fractional limits", () => {
  expect(split("a,b,c", ",", 1.5)).toEqual(["a"]);
});

test("0 limit", () => {
  expect(split("a,b,c", ",", 0)).toEqual([]);
});

describe("dataLast", () => {
  test("useful split", () => {
    expect(pipe("a,b,c", split(","))).toEqual(["a", "b", "c"]);
  });

  test("regex split", () => {
    expect(pipe("a,b,c", split(/,/u))).toEqual(["a", "b", "c"]);
  });

  test("limited split", () => {
    expect(pipe("a,b,c", split(",", 2))).toEqual(["a", "b"]);
  });

  test("regex with limit", () => {
    expect(pipe("a,b,c", split(/,/u, 2))).toEqual(["a", "b"]);
  });

  test("undefined limit", () => {
    expect(pipe("a,b,c", split(",", undefined))).toEqual(["a", "b", "c"]);
  });
});
