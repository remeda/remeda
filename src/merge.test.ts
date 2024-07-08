import { merge } from "./merge";

describe("data first", () => {
  test("should merge", () => {
    expect(merge({ x: 1, y: 2 }, { y: 10, z: 2 })).toEqual({
      x: 1,
      y: 10,
      z: 2,
    });
  });
});

describe("data last", () => {
  test("should merge", () => {
    expect(merge({ y: 10, z: 2 })({ x: 1, y: 2 })).toEqual({
      x: 1,
      y: 10,
      z: 2,
    });
  });
});
