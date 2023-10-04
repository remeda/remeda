import { values } from './values';

describe('Test for values as data first', () => {
  it('should return values of array', () => {
    expect(values(['x', 'y', 'z'])).toEqual(['x', 'y', 'z']);
  });

  it('should return values of object', () => {
    expect(values({ a: 'x', b: 'y', c: 'z' })).toEqual(['x', 'y', 'z']);
  });

  it('should accept indexed types', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    expectTypeOf(values<{ [index: string]: string }>({ a: 'b' })).toEqualTypeOf<
      Array<string>
    >();
  });

  it('should correctly type object keys', () => {
    expectTypeOf(
      values<{ type: 'cat' | 'dog'; age: number }>({ type: 'cat', age: 7 })
    ).toEqualTypeOf<Array<'cat' | 'dog' | number>>();
  });

  it('should correctly type array keys', () => {
    expectTypeOf(values([1, 2, 3] as const)).toEqualTypeOf<Array<1 | 2 | 3>>();
  });
});
