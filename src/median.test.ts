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
    expect(median([] as Array<bigint>)).toBeUndefined();
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
    expect(pipe([] as Array<bigint>, median())).toBeUndefined();
  });
});

it("throws on mixed arrays of even length", () => {
  // @ts-expect-error [ts2345] - Can't median bigints and numbers...
  expect(() => median([1, 1n])).toThrowErrorMatchingInlineSnapshot(
    "[Error: median: invalid types or unexpected input encountered]",
  );
});
