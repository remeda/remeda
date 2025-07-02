import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { split } from "./split";

test("empty string, empty separator", () => {
  expect(split("", "")).toStrictEqual([]);
});

test("empty string, non-empty separator", () => {
  expect(split("", ",")).toStrictEqual([""]);
});

test("trivial split", () => {
  expect(split("a", ",")).toStrictEqual(["a"]);
});

test("string contains separator", () => {
  expect(split(",", ",")).toStrictEqual(["", ""]);
});

test("useful split", () => {
  expect(split("a,b,c", ",")).toStrictEqual(["a", "b", "c"]);
});

test("regex split", () => {
  expect(split("a,b,c", /,/u)).toStrictEqual(["a", "b", "c"]);
});

test("multiple types of separators", () => {
  expect(split("a,b;c", /[;,]/u)).toStrictEqual(["a", "b", "c"]);
});

test("regex with limit", () => {
  expect(split("a,b,c", /,/u, 2)).toStrictEqual(["a", "b"]);
});

test("limited split", () => {
  expect(split("a,b,c", ",", 2)).toStrictEqual(["a", "b"]);
});

test("limit is higher than splits", () => {
  expect(split("a,b,c", ",", 5)).toStrictEqual(["a", "b", "c"]);
});

test("multiple consecutive separators", () => {
  expect(split("a,,b", ",")).toStrictEqual(["a", "", "b"]);
});

test("separator at the start and end", () => {
  expect(split(",a,b,", ",")).toStrictEqual(["", "a", "b", ""]);
});

test("empty-string separator", () => {
  expect(split("abcdef", "")).toStrictEqual(["a", "b", "c", "d", "e", "f"]);
});

test("undefined limit", () => {
  expect(split("a,b,c", ",", undefined)).toStrictEqual(["a", "b", "c"]);
});

test("negative limit", () => {
  expect(split("a,b,c", ",", -1)).toStrictEqual(["a", "b", "c"]);
});

test("fractional limits", () => {
  expect(split("a,b,c", ",", 1.5)).toStrictEqual(["a"]);
});

test("0 limit", () => {
  expect(split("a,b,c", ",", 0)).toStrictEqual([]);
});

describe("dataLast", () => {
  test("useful split", () => {
    expect(pipe("a,b,c", split(","))).toStrictEqual(["a", "b", "c"]);
  });

  test("regex split", () => {
    expect(pipe("a,b,c", split(/,/u))).toStrictEqual(["a", "b", "c"]);
  });

  test("limited split", () => {
    expect(pipe("a,b,c", split(",", 2))).toStrictEqual(["a", "b"]);
  });

  test("regex with limit", () => {
    expect(pipe("a,b,c", split(/,/u, 2))).toStrictEqual(["a", "b"]);
  });

  test("undefined limit", () => {
    expect(pipe("a,b,c", split(",", undefined))).toStrictEqual(["a", "b", "c"]);
  });
});
