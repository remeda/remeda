import { pipe } from "./pipe";
import { set } from "./set";

describe("data first", () => {
  test("simple", () => {
    expect(set({ a: 1 }, "a", 2)).toStrictEqual({ a: 2 });
  });
});

describe("data last", () => {
  test("simple", () => {
    expect(pipe({ a: 1 }, set("a", 2))).toStrictEqual({ a: 2 });
  });
});
