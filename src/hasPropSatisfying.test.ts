import { hasPropSatisfying } from './hasPropSatisfying';
import { isEqual } from './isEqual';
import { isNil } from './isNil';
import { isNonNull } from './isNonNull';
import { isNumber } from './isNumber';
import { isObjectType } from './isObjectType';
import { pipe } from './pipe';

describe('data-first', () => {
  it('should return true when a props is present, defined, and satisfies the predicate', () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: 1, 1: 'hello world', [fooSymbol]: 'foo' };
    expect(hasPropSatisfying(obj, 'a', isEqual(1))).toBe(true);
    expect(hasPropSatisfying(obj, 1, isEqual('hello world'))).toBe(true);
    expect(hasPropSatisfying(obj, fooSymbol, isEqual('foo'))).toBe(true);
  });

  it("should return false when a prop doesn't satisfy the predicate", () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: 1, 1: 'hello world', [fooSymbol]: 'foo' };
    expect(hasPropSatisfying(obj, 'a', isEqual(2))).toBe(false);
    expect(hasPropSatisfying(obj, 1, isEqual('hello'))).toBe(false);
    expect(hasPropSatisfying(obj, fooSymbol, isEqual('bar'))).toBe(false);
  });

  it('should return false when a prop is undefined', () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: undefined, 1: undefined, [fooSymbol]: undefined };
    expect(hasPropSatisfying(obj, 'a', isNil)).toBe(false);
    expect(hasPropSatisfying(obj, 1, isNil)).toBe(false);
    expect(hasPropSatisfying(obj, fooSymbol, isNil)).toBe(false);
  });

  it('should return false when a prop is not present on the object', () => {
    const fooSymbol = Symbol('foo');
    const obj = {};
    // @ts-expect-error this property does not exist on the object
    expect(hasPropSatisfying(obj, 'a', isNil)).toBe(false);
    // @ts-expect-error this property does not exist on the object
    expect(hasPropSatisfying(obj, 1, isNil)).toBe(false);
    // @ts-expect-error this property does not exist on the object
    expect(hasPropSatisfying(obj, fooSymbol, isNil)).toBe(false);
  });

  it('should work when using another hasPropSatisfying as the predicate', () => {
    const obj = { data: { foo: 'bar' } };
    expect(
      hasPropSatisfying(obj, 'data', hasPropSatisfying('foo', isEqual('bar')))
    ).toBe(true);
  });

  describe('predicate argument type narrowing', () => {
    it('should narrow the type of the predicate argument to exclude undefined', () => {
      const obj = { a: undefined } as { a: number | undefined };
      hasPropSatisfying(obj, 'a', (val): val is 1 => {
        expectTypeOf(val).toEqualTypeOf<number>();
        return true;
      });
    });

    it('should narrow the type of the predicate argument to exclude undefined when the prop is optional', () => {
      const obj = { a: undefined } as { a?: number | undefined };
      hasPropSatisfying(obj, 'a', (val): val is 1 => {
        expectTypeOf(val).toEqualTypeOf<number>();
        return true;
      });
    });
  });

  describe('type narrowing', () => {
    it('should narrow the type of the specified prop based on the provided predicate', () => {
      const obj = { a: 1 } as { a?: number | string };
      if (hasPropSatisfying(obj, 'a', isEqual(1))) {
        expectTypeOf(obj).toEqualTypeOf<{ a: 1 }>();
      }
      if (hasPropSatisfying(obj, 'a', isNumber)) {
        expectTypeOf(obj).toEqualTypeOf<{ a: number }>();
      }
    });

    it('should narrow the type of an object union based on the predicate result', () => {
      const obj = { type: 'success', data: { foo: 'bar' } } as
        | { type: 'success'; data: { foo: string } }
        | { type: 'error'; error: string };

      if (hasPropSatisfying(obj, 'type', isEqual('success'))) {
        expectTypeOf(obj).toEqualTypeOf<{
          type: 'success';
          data: { foo: string };
        }>();
      }

      if (hasPropSatisfying(obj, 'type', isEqual('error'))) {
        expectTypeOf(obj).toEqualTypeOf<{ type: 'error'; error: string }>();
      }
    });

    it('should narrow the type of an object union based on property presence', () => {
      const obj = { type: 'success', data: { foo: 'bar' } } as
        | { type: 'success'; data: { foo: string } }
        | { type: 'error'; error: string };

      if (hasPropSatisfying(obj, 'data', isObjectType)) {
        expectTypeOf(obj).toEqualTypeOf<{
          type: 'success';
          data: { foo: string };
        }>();
      }
    });

    it('should be able to accept another hasPropSatisfying as a predicate', () => {
      const obj = { type: 'success', data: { foo: 'bar' } } as
        | { type: 'success'; data: { foo: string } }
        | { type: 'error'; error: string };

      if (
        hasPropSatisfying(obj, 'data', hasPropSatisfying('foo', isEqual('bar')))
      ) {
        expectTypeOf(obj).toEqualTypeOf<{
          type: 'success';
          data: { foo: 'bar' };
        }>();
      }
    });
  });
});

describe('data-last', () => {
  it('should return true when a props is present, defined, and satisfies the predicate', () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: 1, 1: 'hello world', [fooSymbol]: 'foo' };
    expect(pipe(obj, hasPropSatisfying('a', isEqual(1)))).toBe(true);
    expect(pipe(obj, hasPropSatisfying(1, isEqual('hello world')))).toBe(true);
    expect(pipe(obj, hasPropSatisfying(fooSymbol, isEqual('foo')))).toBe(true);
  });

  it("should return false when a prop doesn't satisfy the predicate", () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: 1, 1: 'hello world', [fooSymbol]: 'foo' };
    expect(pipe(obj, hasPropSatisfying('a', isEqual(2)))).toBe(false);
    expect(pipe(obj, hasPropSatisfying(1, isEqual('hello')))).toBe(false);
    expect(pipe(obj, hasPropSatisfying(fooSymbol, isEqual('bar')))).toBe(false);
  });

  it('should return false when a prop is undefined', () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: undefined, 1: undefined, [fooSymbol]: undefined };
    expect(pipe(obj, hasPropSatisfying('a', isNil))).toBe(false);
    expect(pipe(obj, hasPropSatisfying(1, isNil))).toBe(false);
    expect(pipe(obj, hasPropSatisfying(fooSymbol, isNil))).toBe(false);
  });

  it('should return false when a prop is not present on the object', () => {
    const fooSymbol = Symbol('foo');
    const obj = {};
    // @ts-expect-error this property does not exist on the object
    expect(pipe(obj, hasPropSatisfying('a', isNil))).toBe(false);
    // @ts-expect-error this property does not exist on the object
    expect(pipe(obj, hasPropSatisfying(1, isNil))).toBe(false);
    // @ts-expect-error this property does not exist on the object
    expect(pipe(obj, hasPropSatisfying(fooSymbol, isNil))).toBe(false);
  });

  it('should work when using another hasPropSatisfying as the predicate', () => {
    const obj = { data: { foo: 'bar' } };
    expect(
      pipe(
        obj,
        hasPropSatisfying('data', hasPropSatisfying('foo', isEqual('bar')))
      )
    ).toBe(true);
  });

  describe('predicate argument type narrowing', () => {
    it('should narrow the type of the predicate argument to exclude undefined', () => {
      const obj = { a: undefined } as { a: number | undefined };
      hasPropSatisfying(obj, 'a', (val): val is 1 => {
        expectTypeOf(val).toEqualTypeOf<number>();
        return true;
      });
    });

    it('should narrow the type of the predicate argument to exclude undefined when the prop is optional', () => {
      const obj = { a: undefined } as { a?: number | undefined };
      hasPropSatisfying(obj, 'a', (val): val is 1 => {
        expectTypeOf(val).toEqualTypeOf<number>();
        return true;
      });
    });
  });

  describe('type narrowing', () => {
    it('should narrow the type of an array based on the predicate', () => {
      const arr = [] as Array<{ a?: number | string }>;
      const withA = arr.filter(hasPropSatisfying('a', isNumber));
      expectTypeOf(withA).toEqualTypeOf<Array<{ a: number }>>();
    });

    it('should narrow the type of an array of object unions based on the predicate result', () => {
      const arr = [] as Array<
        | { type: 'success'; data: { foo: string } }
        | { type: 'error'; error: string }
      >;

      const success = arr.filter(hasPropSatisfying('type', isEqual('success')));
      expectTypeOf(success).toEqualTypeOf<
        Array<{ type: 'success'; data: { foo: string } }>
      >();

      const error = arr.filter(hasPropSatisfying('type', isEqual('error')));
      expectTypeOf(error).toEqualTypeOf<
        Array<{ type: 'error'; error: string }>
      >();
    });

    it('should narrow the type of an array of object unions based on property presence', () => {
      const arr = [] as Array<
        | { type: 'success'; data: { foo: string } }
        | { type: 'error'; error: string }
      >;

      const success = arr.filter(hasPropSatisfying('data', isNonNull));
      expectTypeOf(success).toEqualTypeOf<
        Array<{ type: 'success'; data: { foo: string } }>
      >();

      const error = arr.filter(hasPropSatisfying('error', isNonNull));
      expectTypeOf(error).toEqualTypeOf<
        Array<{ type: 'error'; error: string }>
      >();
    });

    it('should be able to accept another hasPropSatisfying as a predicate', () => {
      const arr = [] as Array<
        | { type: 'success'; data: { foo: string } }
        | { type: 'error'; error: string }
      >;
      const success = arr.filter(
        hasPropSatisfying('data', hasPropSatisfying('foo', isEqual('bar')))
      );
      expectTypeOf(success).toEqualTypeOf<
        Array<{
          type: 'success';
          data: { foo: 'bar' };
        }>
      >();
    });
  });
});
