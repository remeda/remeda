import { partialRight } from './partialRight';

const fn = (x: number, y: number, z: number) => `${x}, ${y}, and ${z}`;

describe('runtime', () => {
  describe('data-first', () => {
    test('should partially apply 0 args', () => {
      expect(partialRight([], fn)(1, 2, 3)).toBe(fn(1, 2, 3));
    });

    test('should partially apply 1 arg', () => {
      expect(partialRight([3], fn)(1, 2)).toBe(fn(1, 2, 3));
    });

    test('should partially apply all args', () => {
      expect(partialRight([1, 2, 3], fn)()).toBe(fn(1, 2, 3));
    });
  });

  describe('data-last', () => {
    test('should partially apply 0 args', () => {
      expect(partialRight(fn)([])(1, 2, 3)).toBe(fn(1, 2, 3));
    });

    test('should partially apply 1 arg', () => {
      expect(partialRight(fn)([3])(1, 2)).toBe(fn(1, 2, 3));
    });

    test('should partially apply all args', () => {
      expect(partialRight(fn)([1, 2, 3])()).toBe(fn(1, 2, 3));
    });
  });
});

describe('typing', () => {
  describe('data-first', () => {
    test('should correctly type 0 partial args', () => {
      expectTypeOf(partialRight([], fn)).toEqualTypeOf<
        (x: number, y: number, z: number) => string
      >();
    });

    test('should correctly type 1 partial arg', () => {
      expectTypeOf(partialRight([3], fn)).toEqualTypeOf<
        (y: number, z: number) => string
      >();
    });

    test('should correctly type all partial args', () => {
      expectTypeOf(partialRight([1, 2, 3], fn)).toEqualTypeOf<() => string>();
    });
  });

  describe('data-last', () => {
    test('should correctly type 0 partial args', () => {
      expectTypeOf(partialRight(fn)([])).toEqualTypeOf<
        (x: number, y: number, z: number) => string
      >();
    });

    test('should correctly type 1 partial arg', () => {
      expectTypeOf(partialRight(fn)([3])).toEqualTypeOf<
        (y: number, z: number) => string
      >();
    });

    test('should correctly type all partial args', () => {
      expectTypeOf(partialRight(fn)([1, 2, 3])).toEqualTypeOf<() => string>();
    });
  });
});
