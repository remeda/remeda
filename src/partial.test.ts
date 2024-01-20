import { partial } from './partial';

const fn = (x: number, y: number, z: number) => `${x}, ${y}, and ${z}`;

describe('runtime', () => {
  test('should partially apply 0 args', () => {
    expect(partial(fn)(1, 2, 3)).toBe(fn(1, 2, 3));
  });

  test('should partially apply 1 arg', () => {
    expect(partial(fn, 1)(2, 3)).toBe(fn(1, 2, 3));
  });

  test('should partially apply all args', () => {
    expect(partial(fn, 1, 2, 3)()).toBe(fn(1, 2, 3));
  });
});

describe('typing', () => {
  test('should correctly type 0 partial args', () => {
    expectTypeOf(partial(fn)).toEqualTypeOf<
      (x: number, y: number, z: number) => string
    >();
  });

  test('should correctly type 1 partial arg', () => {
    expectTypeOf(partial(fn, 1)).toEqualTypeOf<
      (y: number, z: number) => string
    >();
  });

  test('should correctly type all partial args', () => {
    expectTypeOf(partial(fn, 1, 2, 3)).toEqualTypeOf<() => string>();
  });
});
