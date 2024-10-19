import { median } from "./median";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  it("should return the median of numbers in an array", () => {
    expect(median([6, 10, 11])).toBe(10);
    expect(median([1, 2, 3, 9])).toBe(2.5);
    expect(median([-1, 0, 1, 10])).toBe(0.5);
  });

  it("should return undefined for an empty array", () => {
    expect(median([])).toBeUndefined();
  });

  it("works on bigints", () => {
    expect(median([6n, 10n, 11n])).toBe(10n);
  });
});

describe("dataLast", () => {
  it("should return the median of numbers in an array", () => {
    expect(pipe([6, 10, 11], median())).toBe(10);
    expect(pipe([1, 2, 3, 9], median())).toBe(2.5);
    expect(pipe([-1, 0, 1, 10], median())).toBe(0.5);
  });

  it("should return undefined for an empty array", () => {
    expect(pipe([], median())).toBeUndefined();
  });
});
