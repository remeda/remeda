import { values } from "./values";

it("works with arrays", () => {
  expect(values(["x", "y", "z"])).toStrictEqual(["x", "y", "z"]);
});

it("should return values of object", () => {
  expect(values({ a: "x", b: "y", c: "z" })).toStrictEqual(["x", "y", "z"]);
});

it("should skip symbol keys", () => {
  expect(values({ [Symbol("a")]: "x" })).toStrictEqual([]);
});

it("shouldn't skip symbol values", () => {
  const mySymbol = Symbol("mySymbol");

  expect(values({ a: mySymbol })).toStrictEqual([mySymbol]);
});
