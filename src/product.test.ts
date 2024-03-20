import { pipe } from "./pipe";
import { product } from "./product";

describe("runtime", () => {
  describe("dataFirst", () => {
    it("should return the product of numbers in the array", () => {
      expect(product([1, 2, 3])).toBe(6);
      expect(product([4, 5, 6])).toBe(120);
      expect(product([0, 1, 2])).toBe(0);
      expect(product([-1, -2, -3])).toBe(-6);
    });

    it("should return 1 for an empty array", () => {
      expect(product([])).toBe(1);
    });
  });

  describe("dataLast", () => {
    it("should return the product of numbers in the array", () => {
      expect(pipe([1, 2, 3], product())).toBe(6);
      expect(pipe([4, 5, 6], product())).toBe(120);
      expect(pipe([0, 1, 2], product())).toBe(0);
      expect(pipe([-1, -2, -3], product())).toBe(-6);
    });

    it("should return 1 for an empty array", () => {
      expect(pipe([], product())).toBe(1);
    });
  });
});
