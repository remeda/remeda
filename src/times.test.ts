import { times } from "./times";

const noop = (): undefined => undefined;
const one = () => 1 as const;
const mul1 = (idx: number): number => idx;
const mul2 = (idx: number): number => idx * 2;

describe("times", () => {
  describe("data_first", () => {
    it("throws error on invalid idx", () => {
      expect(() => times(-1, noop)).toThrow();
      expect(() => times(-1000, noop)).toThrow();
      expect(() => times(Number.MIN_SAFE_INTEGER, noop)).toThrow();
    });

    it("returns empty array", () => {
      const res = times(0, noop);
      expect(res).toEqual([]);
    });

    it("returns arr with fn result", () => {
      expect(times(1, one)).toEqual([1]);
      expect(times(5, one)).toEqual([1, 1, 1, 1, 1]);
    });

    it("passes idx to fn", () => {
      const fn = vi.fn();
      times(5, fn);
      expect(fn).toHaveBeenCalledWith(0);
      expect(fn).toHaveBeenCalledWith(1);
      expect(fn).toHaveBeenCalledWith(2);
      expect(fn).toHaveBeenCalledWith(3);
      expect(fn).toHaveBeenCalledWith(4);
    });

    it("returns fn results as arr", () => {
      expect(times(5, mul1)).toEqual([0, 1, 2, 3, 4]);
      expect(times(5, mul2)).toEqual([0, 2, 4, 6, 8]);
    });
  });

  describe("data_last", () => {
    it("throws error on invalid idx", () => {
      const noopTimes = times(noop);
      expect(() => noopTimes(-1)).toThrow();
      expect(() => noopTimes(-1000)).toThrow();
      expect(() => noopTimes(Number.MIN_SAFE_INTEGER)).toThrow();
    });

    it("returns empty array", () => {
      const res = times(noop)(0);
      expect(res).toEqual([]);
    });

    it("returns arr with fn result", () => {
      const oneTime = times(one);
      expect(oneTime(1)).toEqual([1]);
      expect(oneTime(5)).toEqual([1, 1, 1, 1, 1]);
    });

    it("passes idx to fn", () => {
      const fn = vi.fn();
      times(fn)(5);
      expect(fn).toHaveBeenCalledWith(0);
      expect(fn).toHaveBeenCalledWith(1);
      expect(fn).toHaveBeenCalledWith(2);
      expect(fn).toHaveBeenCalledWith(3);
      expect(fn).toHaveBeenCalledWith(4);
    });

    it("returns fn results as arr", () => {
      expect(times(mul1)(5)).toEqual([0, 1, 2, 3, 4]);
      expect(times(mul2)(5)).toEqual([0, 2, 4, 6, 8]);
    });
  });
});
