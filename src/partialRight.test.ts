import { partialRight } from './partialRight';

const fn = (x: number, y: number, z: number) => `${x}, ${y}, and ${z}`;

describe('runtime', () => {
  test('should partially apply 0 args', () => {
    expect(partialRight(fn)(1, 2, 3)).toBe(fn(1, 2, 3));
  });

  test('should partially apply 1 arg', () => {
    expect(partialRight(fn, 3)(1, 2)).toBe(fn(1, 2, 3));
  });

  test('should partially apply all args', () => {
    expect(partialRight(fn, 1, 2, 3)()).toBe(fn(1, 2, 3));
  });
});

describe('typing', () => {
  test('should correctly type 0 partial args', () => {
    expectTypeOf(partialRight(fn)).toEqualTypeOf<
      (x: number, y: number, z: number) => string
    >();
  });

  test('should correctly type 1 partial arg', () => {
    expectTypeOf(partialRight(fn, 3)).toEqualTypeOf<
      (y: number, z: number) => string
    >();
  });

  test('should correctly type all partial args', () => {
    expectTypeOf(partialRight(fn, 1, 2, 3)).toEqualTypeOf<() => string>();
  });
});
