import { partialBindTo } from './partialBindTo';

const fn = (x: number, y: number, z: number) => `${x}, ${y}, and ${z}`;

describe('runtime', () => {
  describe('data-first', () => {
    test('should partially apply 0 args', () => {
      expect(partialBindTo([], fn)(1, 2, 3)).toBe(fn(1, 2, 3));
    });

    test('should partially apply 1 arg', () => {
      expect(partialBindTo([1], fn)(2, 3)).toBe(fn(1, 2, 3));
    });

    test('should partially apply all args', () => {
      expect(partialBindTo([1, 2, 3], fn)()).toBe(fn(1, 2, 3));
    });
  });

  describe('data-last', () => {
    test('should partially apply 0 args', () => {
      expect(partialBindTo(fn)([])(1, 2, 3)).toBe(fn(1, 2, 3));
    });

    test('should partially apply 1 arg', () => {
      expect(partialBindTo(fn)([1])(2, 3)).toBe(fn(1, 2, 3));
    });

    test('should partially apply all args', () => {
      expect(partialBindTo(fn)([1, 2, 3])()).toBe(fn(1, 2, 3));
    });
  });
});

describe('typing', () => {
  describe('data-first', () => {
    test('should correctly type 0 partial args', () => {
      expectTypeOf(partialBindTo([], fn)).toEqualTypeOf<
        (x: number, y: number, z: number) => string
      >();
    });

    test('should correctly type 1 partial arg', () => {
      expectTypeOf(partialBindTo([1], fn)).toEqualTypeOf<
        (y: number, z: number) => string
      >();
    });

    test('should correctly type all partial args', () => {
      expectTypeOf(partialBindTo([1, 2, 3], fn)).toEqualTypeOf<() => string>();
    });

    it('should not accept wrong arg type', () => {
      expectTypeOf(partialBindTo([123], (x: string) => x)).toEqualTypeOf<
        (
          x: 'RemedaTypeError(partialBindTo): Argument of the wrong type provided to function.'
        ) => string
      >();
    });

    it('should not accept too many args', () => {
      expectTypeOf(partialBindTo([123, 456], (x: number) => x)).toEqualTypeOf<
        (
          x: 'RemedaTypeError(partialBindTo): Too many args provided to function.'
        ) => number
      >();
    });

    it('should allow refined types', () => {
      expectTypeOf(
        partialBindTo([123], (x: string | number) => x)
      ).toEqualTypeOf<() => string | number>();
    });

    it('should support optional params', () => {
      const foo = (x = true) => x;
      expectTypeOf(partialBindTo([true], foo)).toEqualTypeOf<() => boolean>();
    });

    it('should support optional params after non-optional ones', () => {
      const foo = (x: string, y: number, z = true) => (z ? x : y);
      expectTypeOf(partialBindTo([], foo)).toEqualTypeOf<
        (x: string, y: number, z?: boolean) => string | number
      >();
      expectTypeOf(partialBindTo(['hello'], foo)).toEqualTypeOf<
        (y: number, z?: boolean) => string | number
      >();
      expectTypeOf(partialBindTo(['hello', 123], foo)).toEqualTypeOf<
        (z?: boolean) => string | number
      >();
      expectTypeOf(partialBindTo(['hello', 123, false], foo)).toEqualTypeOf<
        () => string | number
      >();
    });

    it('should support variadic params', () => {
      const foo = (...parts: Array<string>) => parts.join('');
      expectTypeOf(partialBindTo([], foo)).toEqualTypeOf<
        (...parts: Array<string>) => string
      >();
      expectTypeOf(partialBindTo(['hello'], foo)).toEqualTypeOf<
        (...parts: Array<string>) => string
      >();
      expectTypeOf(partialBindTo([123], foo)).toEqualTypeOf<
        (
          x: 'RemedaTypeError(partialBindTo): Argument of the wrong type provided to function.'
        ) => string
      >();
      expectTypeOf(
        partialBindTo(['hello', 'world'] as [string, ...Array<string>], foo)
      ).toEqualTypeOf<(...parts: Array<string>) => string>();
    });
  });

  describe('data-last', () => {
    test('should correctly type 0 partial args', () => {
      expectTypeOf(partialBindTo(fn)([])).toEqualTypeOf<
        (x: number, y: number, z: number) => string
      >();
    });

    test('should correctly type 1 partial arg', () => {
      expectTypeOf(partialBindTo(fn)([1])).toEqualTypeOf<
        (y: number, z: number) => string
      >();
    });

    test('should correctly type all partial args', () => {
      expectTypeOf(partialBindTo(fn)([1, 2, 3])).toEqualTypeOf<() => string>();
    });
  });
});
