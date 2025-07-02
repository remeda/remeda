import { expect, it } from "vitest";
import { pipe } from "./pipe";
import { swapProps } from "./swapProps";

it("data-first", () => {
  expect(swapProps({ a: 1, b: 2 }, "a", "b")).toStrictEqual({ a: 2, b: 1 });
});

it("data-last", () => {
  expect(pipe({ a: 1, b: 2 }, swapProps("a", "b"))).toStrictEqual({
    a: 2,
    b: 1,
  });
});

it("maintains the shape of the rest of the object", () => {
  expect(swapProps({ a: true, b: "hello", c: 3 }, "a", "b")).toStrictEqual({
    a: "hello",
    b: true,
    c: 3,
  });
});
