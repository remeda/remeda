import { values } from './values';

describe('Test for values as data first', () => {
  it('should return values of array', () => {
    expect(values(['x', 'y', 'z'])).toEqual(['x', 'y', 'z']);
  });

  it('should return values of object', () => {
    expect(values({ a: 'x', b: 'y', c: 'z' })).toEqual(['x', 'y', 'z']);
  });
});

describe('typing', () => {
  it('should correctly types indexed types', () => {
    expectTypeOf(values<{ [index: string]: string }>({ a: 'b' })).toEqualTypeOf<
      Array<string>
    >();
  });

  it('should correctly type functions', () => {
    expectTypeOf(values(function namedFunction() {})).toEqualTypeOf<
      Array<never>
    >();
  });

  it('should correctly type arrays', () => {
    expectTypeOf(values([1, 2, 3])).toEqualTypeOf<Array<number>>();
  });

  it('should correctly type const arrays', () => {
    expectTypeOf(values([1, 2, 3] as const)).toEqualTypeOf<Array<1 | 2 | 3>>();
  });

  it('should correctly type objects', () => {
    expectTypeOf(values({ a: true })).toEqualTypeOf<Array<boolean>>();
  });

  it('should correctly type Records', () => {
    expectTypeOf(values<Record<string, boolean>>({ a: true })).toEqualTypeOf<
      Array<boolean>
    >();
  });

  it('should correctly type typed objects', () => {
    expectTypeOf(
      values<{ type: 'cat' | 'dog'; age: number }>({ type: 'cat', age: 7 })
    ).toEqualTypeOf<Array<'cat' | 'dog' | number>>();
  });
});
