import { expect, test } from "vitest";
import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

test("data-first", () => {
  expect(prop({ foo: "bar" }, "foo")).toBe("bar");
});

test("data-last", () => {
  expect(pipe({ foo: "bar" }, prop("foo"))).toBe("bar");
});

test("factory function", () => {
  const propA = prop("a");

  expect(indexBy([{ a: 1 }, { a: 2 }], propA)).toStrictEqual({
    "1": { a: 1 },
    "2": { a: 2 },
  });
});

test("deep prop", () => {
  const DATA = {
    a: { b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } } },
  } as const;

  expect(prop(DATA, "a")).toStrictEqual({
    b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } },
  });
  expect(prop(DATA, "a", "b")).toStrictEqual({
    c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } },
  });
  expect(prop(DATA, "a", "b", "c")).toStrictEqual({
    d: { e: { f: { g: { h: { i: { j: 10 } } } } } },
  });
  expect(prop(DATA, "a", "b", "c", "d")).toStrictEqual({
    e: { f: { g: { h: { i: { j: 10 } } } } },
  });
  expect(prop(DATA, "a", "b", "c", "d", "e")).toStrictEqual({
    f: { g: { h: { i: { j: 10 } } } },
  });
  expect(prop(DATA, "a", "b", "c", "d", "e", "f")).toStrictEqual({
    g: { h: { i: { j: 10 } } },
  });
  expect(prop(DATA, "a", "b", "c", "d", "e", "f", "g")).toStrictEqual({
    h: { i: { j: 10 } },
  });
  expect(prop(DATA, "a", "b", "c", "d", "e", "f", "g", "h")).toStrictEqual({
    i: { j: 10 },
  });
  expect(prop(DATA, "a", "b", "c", "d", "e", "f", "g", "h", "i")).toStrictEqual(
    { j: 10 },
  );
  expect(prop(DATA, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j")).toBe(10);
});

test("stops at optional props", () => {
  expect(
    prop(
      { a: { b: { c: {} } } } as {
        a?: { b?: { c?: { d?: { e?: { f?: { g?: { h?: number } } } } } } };
      },
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
    ),
  ).toBeUndefined();
});

test("multi-dimensional arrays", () => {
  const data = [[[["cat"]]]] as Array<Array<Array<Array<"cat">>>>;

  expect(prop(data, 0)).toStrictEqual([[["cat"]]]);
  expect(prop(data, 0, 0)).toStrictEqual([["cat"]]);
  expect(prop(data, 0, 0, 0)).toStrictEqual(["cat"]);
  expect(prop(data, 0, 0, 0, 0)).toBe("cat");
});

test("mixed arrays and objects", () => {
  const data = [{ a: "cat" }, { b: "dog" }, { c: "mouse" }] as const;

  expect(prop(data, 0)).toStrictEqual({ a: "cat" });
  expect(prop(data, 0, "a")).toBe("cat");
  expect(prop(data, 1)).toStrictEqual({ b: "dog" });
  expect(prop(data, 1, "b")).toBe("dog");
  expect(prop(data, 2)).toStrictEqual({ c: "mouse" });
  expect(prop(data, 2, "c")).toBe("mouse");
});
