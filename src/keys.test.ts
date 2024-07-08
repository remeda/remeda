import { keys } from "./keys";

describe("dataFirst", () => {
  it("work with arrays", () => {
    expect(keys(["x", "y", "z"])).toEqual(["0", "1", "2"]);
  });

  it("work with objects", () => {
    expect(keys({ a: "x", b: "y", c: "z" })).toEqual(["a", "b", "c"]);
  });

  it("should return strict types", () => {
    expect(keys({ 5: "x", b: "y", c: "z" })).toEqual(["5", "b", "c"]);
  });

  it("should ignore symbol keys", () => {
    expect(keys({ [Symbol("a")]: 1 })).toStrictEqual([]);
  });

  it("should turn numbers to strings", () => {
    expect(keys({ 1: "hello" })).toStrictEqual(["1"]);
  });
});
