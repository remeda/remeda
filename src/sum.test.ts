import { pipe } from "./pipe";
import { sum } from "./sum";

describe("runtime", () => {
  describe("dataFirst", () => {
    it("should return the sum of numbers in an array", () => {
      expect(sum([1, 2, 3])).toBe(6);
      expect(sum([4, 5, 6])).toBe(15);
      expect(sum([-1, 0, 1])).toBe(0);
    });

    it("should return 0 for an empty array", () => {
      expect(sum([])).toBe(0);
    });
  });

  describe("dataLast", () => {
    it("should return the sum of numbers in an array", () => {
      expect(pipe([1, 2, 3], sum())).toBe(6);
      expect(pipe([4, 5, 6], sum())).toBe(15);
      expect(pipe([-1, 0, 1], sum())).toBe(0);
    });

    it("should return 0 for an empty array", () => {
      expect(pipe([], sum())).toBe(0);
    });
  });
});
