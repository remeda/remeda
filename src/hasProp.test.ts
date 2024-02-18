import { hasProp } from './hasProp';
import { pipe } from './pipe';

describe('data-first', () => {
  it('should return true when a prop is present on the object and is defined', () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: 1, 1: 'hi', [fooSymbol]: 'bar' };
    expect(hasProp(obj, 'a')).toBe(true);
    expect(hasProp(obj, 1)).toBe(true);
    expect(hasProp(obj, fooSymbol)).toBe(true);
  });

  it('should return false when a prop is not present on the object', () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: 1 };
    // @ts-expect-error this property does not exist on the object
    expect(hasProp(obj, 'b')).toBe(false);
    // @ts-expect-error this property does not exist on the object
    expect(hasProp(obj, 1)).toBe(false);
    // @ts-expect-error this property does not exist on the object
    expect(hasProp(obj, fooSymbol)).toBe(false);
  });

  it('should return false when a prop is present on the object but is undefined', () => {
    const obj = { b: undefined };
    expect(hasProp(obj, 'b')).toBe(false);
  });

  it('should accept any prop name if the object is typeod as a record', () => {
    const obj: Record<string, unknown> = { a: 1 };
    expect(hasProp(obj, 'a')).toBe(true);
    expect(hasProp(obj, 'b')).toBe(false);
  });

  it('should narrow the type of an object to exclude undefined', () => {
    const obj = { a: 1, b: undefined } as { a: number; b: number | undefined };
    if (hasProp(obj, 'b')) {
      expectTypeOf(obj).toEqualTypeOf<{ a: number; b: number }>();
    }
  });

  it('should narrow the type of optional properties', () => {
    const obj = { a: 1, b: undefined } as { a: number; b?: number | undefined };
    if (hasProp(obj, 'b')) {
      expectTypeOf(obj).toEqualTypeOf<{ a: number; b: number }>();
    }
  });

  it('should narrow the types of unions when the prop is exclusive to only some members of the union', () => {
    const obj = { a: 1, b: 2 } as
      | { a: number; b: number }
      | { b: number; c: number };
    if (hasProp(obj, 'a')) {
      expectTypeOf(obj).toEqualTypeOf<{ a: number; b: number }>();
    }
    if (hasProp(obj, 'c')) {
      expectTypeOf(obj).toEqualTypeOf<{ b: number; c: number }>();
    }
  });

  it('should not narrow the type of a union when the prop is present on all members of the union', () => {
    const obj = { a: 1, b: 2 } as
      | { a: number; b: number }
      | { b: number; c: number };
    if (hasProp(obj, 'b')) {
      expectTypeOf(obj).toEqualTypeOf<
        { a: number; b: number } | { b: number; c: number }
      >();
    }
  });
});

describe('data-last', () => {
  it('should return true when a prop is present on the object and is defined', () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: 1, 1: 'hi', [fooSymbol]: 'bar' };
    expect(pipe(obj, hasProp('a'))).toBe(true);
    expect(pipe(obj, hasProp(1))).toBe(true);
    expect(pipe(obj, hasProp(fooSymbol))).toBe(true);
  });

  it('should return false when a prop is not present on the object', () => {
    const fooSymbol = Symbol('foo');
    const obj = { a: 1 };
    // @ts-expect-error this property does not exist on the object
    expect(pipe(obj, hasProp('b'))).toBe(false);
    // @ts-expect-error this property does not exist on the object
    expect(pipe(obj, hasProp(1))).toBe(false);
    // @ts-expect-error this property does not exist on the object
    expect(pipe(obj, hasProp(fooSymbol))).toBe(false);
  });

  it('should return false when a prop is present on the object but is undefined', () => {
    const obj = { b: undefined };
    expect(pipe(obj, hasProp('b'))).toBe(false);
  });

  it('should accept any prop name if the object is typeod as a record', () => {
    const obj: Record<string, unknown> = { a: 1 };
    expect(pipe(obj, hasProp('a'))).toBe(true);
    expect(pipe(obj, hasProp('b'))).toBe(false);
  });

  it('should narrow the type of an object to exclude undefined', () => {
    const arr = [] as Array<{ a: number; b: number | undefined }>;
    const filtered = arr.filter(hasProp('b'));
    expectTypeOf(filtered).toEqualTypeOf<Array<{ a: number; b: number }>>();
  });

  it('should narrow the type of optional properties', () => {
    const arr = [] as Array<{ a: number; b?: number | undefined }>;
    const filtered = arr.filter(hasProp('b'));
    expectTypeOf(filtered).toEqualTypeOf<Array<{ a: number; b: number }>>();
  });

  it('should narrow the types of unions when the prop is exclusive to only some members of the union', () => {
    const arr = [] as Array<
      { a: number; b: number } | { b: number; c: number }
    >;

    const itemsWithA = arr.filter(hasProp('a'));
    expectTypeOf(itemsWithA).toEqualTypeOf<Array<{ a: number; b: number }>>();

    const itemsWithC = arr.filter(hasProp('c'));
    expectTypeOf(itemsWithC).toEqualTypeOf<Array<{ b: number; c: number }>>();
  });

  it('should not narrow the type of a union when the prop is present on all members of the union', () => {
    const arr = [] as Array<
      { a: number; b: number } | { b: number; c: number }
    >;

    const itemsWithB = arr.filter(hasProp('b'));
    expectTypeOf(itemsWithB).toEqualTypeOf<
      Array<{ a: number; b: number } | { b: number; c: number }>
    >();
  });
});
