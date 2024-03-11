import { partialRightBindTo } from './partialRightBindTo';

const fn = (x: number, y: number, z: number) => `${x}, ${y}, and ${z}`;

describe('runtime', () => {
  describe('data-first', () => {
    test('should partially apply 0 args', () => {
      expect(partialRightBindTo([], fn)(1, 2, 3)).toBe(fn(1, 2, 3));
    });

    test('should partially apply 1 arg', () => {
      expect(partialRightBindTo([3], fn)(1, 2)).toBe(fn(1, 2, 3));
    });

    test('should partially apply all args', () => {
      expect(partialRightBindTo([1, 2, 3], fn)()).toBe(fn(1, 2, 3));
    });
  });

  describe('data-last', () => {
    test('should partially apply 0 args', () => {
      expect(partialRightBindTo(fn)([])(1, 2, 3)).toBe(fn(1, 2, 3));
    });

    test('should partially apply 1 arg', () => {
      expect(partialRightBindTo(fn)([3])(1, 2)).toBe(fn(1, 2, 3));
    });

    test('should partially apply all args', () => {
      expect(partialRightBindTo(fn)([1, 2, 3])()).toBe(fn(1, 2, 3));
    });
  });
});

describe('typing', () => {
  describe('data-first', () => {
    test('should correctly type 0 partial args', () => {
      expectTypeOf(partialRightBindTo([], fn)).toEqualTypeOf<
        (x: number, y: number, z: number) => string
      >();
    });

    test('should correctly type 1 partial arg', () => {
      expectTypeOf(partialRightBindTo([3], fn)).toEqualTypeOf<
        (y: number, z: number) => string
      >();
    });

    test('should correctly type all partial args', () => {
      expectTypeOf(partialRightBindTo([1, 2, 3], fn)).toEqualTypeOf<
        () => string
      >();
    });
  });

  describe('data-last', () => {
    test('should correctly type 0 partial args', () => {
      expectTypeOf(partialRightBindTo(fn)([])).toEqualTypeOf<
        (x: number, y: number, z: number) => string
      >();
    });

    test('should correctly type 1 partial arg', () => {
      expectTypeOf(partialRightBindTo(fn)([3])).toEqualTypeOf<
        (y: number, z: number) => string
      >();
    });

    test('should correctly type all partial args', () => {
      expectTypeOf(partialRightBindTo(fn)([1, 2, 3])).toEqualTypeOf<
        () => string
      >();
    });
  });
});
