import { swapIndices } from "./swapIndices";

describe("data_first", () => {
  it("swap array", () => {
    expect(swapIndices([1, 2, 3, 4, 5], 0, -1)).toEqual([5, 2, 3, 4, 1]);
  });

  it("swap string", () => {
    expect(swapIndices("apple", 0, 1)).toEqual("paple");
  });

  it("fails gracefully on NaN indices", () => {
    expect(swapIndices("apple", Number.NaN, 1)).toEqual("apple");
    expect(swapIndices("apple", 1, Number.NaN)).toEqual("apple");
    expect(swapIndices("apple", Number.NaN, Number.NaN)).toEqual("apple");
  });

  it("fails gracefully on overflow indices", () => {
    expect(swapIndices("apple", 100, 1)).toEqual("apple");
    expect(swapIndices("apple", 1, 100)).toEqual("apple");
    expect(swapIndices("apple", 200, 300)).toEqual("apple");
  });
});

describe("data_last", () => {
  it("swap array", () => {
    expect(swapIndices(-1, 4)([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });
  it("swap string", () => {
    expect(swapIndices(0, -1)("apple")).toEqual("eppla");
  });
});
