import { times } from './times';

describe('times', () => {
  describe('data_first', () => {
    it('throws error on invalid idx', () => {
      const noop = () => undefined;
      expect(() => times(-1, noop)).toThrow();
      expect(() => times(-1000, noop)).toThrow();
      expect(() => times(Number.MIN_SAFE_INTEGER, noop)).toThrow();
    });

    it('returns empty array', () => {
      const noop = () => undefined;
      const res = times(0, noop);
      expect(res).toEqual([]);
    });

    it('returns arr with fn result', () => {
      const one = () => 1;
      expect(times(1, one)).toEqual([1]);
      expect(times(5, one)).toEqual([1, 1, 1, 1, 1]);
    });

    it('passes idx to fn', () => {
      const fn = jest.fn();
      times(5, fn);
      expect(fn).toHaveBeenCalledWith(0);
      expect(fn).toHaveBeenCalledWith(1);
      expect(fn).toHaveBeenCalledWith(2);
      expect(fn).toHaveBeenCalledWith(3);
      expect(fn).toHaveBeenCalledWith(4);
    });

    it('returns fn results as arr', () => {
      const idx = (idx: number) => idx;
      expect(times(5, idx)).toEqual([0, 1, 2, 3, 4]);

      const mul2 = (idx: number) => idx * 2;
      expect(times(5, mul2)).toEqual([0, 2, 4, 6, 8]);
    });
  });

  describe('data_last', () => {
    it('throws error on invalid idx', () => {
      const noop = () => undefined;
      const noopTimes = times(noop);
      expect(() => noopTimes(-1)).toThrow();
      expect(() => noopTimes(-1000)).toThrow();
      expect(() => noopTimes(Number.MIN_SAFE_INTEGER)).toThrow();
    });

    it('returns empty array', () => {
      const noop = () => undefined;
      const res = times(noop)(0);
      expect(res).toEqual([]);
    });

    it('returns arr with fn result', () => {
      const one = () => 1;
      const oneTime = times(one);
      expect(oneTime(1)).toEqual([1]);
      expect(oneTime(5)).toEqual([1, 1, 1, 1, 1]);
    });

    it('passes idx to fn', () => {
      const fn = jest.fn();
      times(fn)(5);
      expect(fn).toHaveBeenCalledWith(0);
      expect(fn).toHaveBeenCalledWith(1);
      expect(fn).toHaveBeenCalledWith(2);
      expect(fn).toHaveBeenCalledWith(3);
      expect(fn).toHaveBeenCalledWith(4);
    });

    it('returns fn results as arr', () => {
      const idx = (idx: number) => idx;
      expect(times(idx)(5)).toEqual([0, 1, 2, 3, 4]);

      const mul2 = (idx: number) => idx * 2;
      expect(times(mul2)(5)).toEqual([0, 2, 4, 6, 8]);
    });
  });
});
