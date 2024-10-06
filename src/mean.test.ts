import { mean } from "./mean";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  it("should return the mean of numbers in an array", () => {
    expect(mean([1, 2, 3])).toBe(2);
    expect(mean([4, 5, 6])).toBe(5);
    expect(mean([-1, 0, 1])).toBe(0);
  });

  it("should return undefined for an empty array", () => {
    expect(mean([])).toBeUndefined();
    expect(mean([] as Array<bigint>)).toBeUndefined();
  });

  it("works on bigints", () => {
    expect(mean([1n, 2n, 3n])).toBe(2n);
  });
});

describe("dataLast", () => {
  it("should return the mean of numbers in an array", () => {
    expect(pipe([1, 2, 3], mean())).toBe(2);
    expect(pipe([4, 5, 6], mean())).toBe(5);
    expect(pipe([-1, 0, 1], mean())).toBe(0);
  });

  it("should return undefined for an empty array", () => {
    expect(pipe([], mean())).toBeUndefined();
    expect(pipe([] as Array<bigint>, mean())).toBeUndefined();
  });
});
