import { join } from './join';

describe('at runtime', () => {
  describe('joins same-typed items', () => {
    it('number', () => {
      const array = [1, 2, 3, 4, 5];
      const result = join(array, ',');
      expect(result).toEqual('1,2,3,4,5');
    });

    it('string', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = join(array, ',');
      expect(result).toEqual('a,b,c,d,e');
    });

    it('bigint', () => {
      const array = [BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5)];
      const result = join(array, ',');
      expect(result).toEqual('1,2,3,4,5');
    });

    it('boolean', () => {
      const array = [true, false, true, false, true];
      const result = join(array, ',');
      expect(result).toEqual('true,false,true,false,true');
    });

    it('null', () => {
      const array = [null, null, null, null, null];
      const result = join(array, ',');
      expect(result).toEqual(',,,,');
    });

    it('undefined', () => {
      const array = [undefined, undefined, undefined, undefined, undefined];
      const result = join(array, ',');
      expect(result).toEqual(',,,,');
    });
  });

  it('joins different-typed items', () => {
    const array = [1, '2', BigInt(3), true, null, undefined];
    const result = join(array, ',');
    expect(result).toEqual('1,2,3,true,,');
  });

  describe('edge-cases', () => {
    it('empty glue', () => {
      const array = [1, 2, 3, 4, 5];
      const result = join(array, '');
      expect(result).toEqual('12345');
    });

    it('empty array', () => {
      const array: Array<number> = [];
      const result = join(array, ',');
      expect(result).toEqual('');
    });

    it('doesnt add glue on single item', () => {
      const array = [1];
      const result = join(array, ',');
      expect(result).toEqual('1');
    });
  });
});

describe('typing', () => {
  it('empty tuple', () => {
    const array: [] = [];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('empty readonly tuple', () => {
    const array: readonly [] = [];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<''>();
  });

  it('array', () => {
    const array: Array<number> = [];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<string>();
  });

  it('readonly array', () => {
    const array: ReadonlyArray<number> = [];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<string>();
  });

  it('tuple', () => {
    const array: ['a' | 'b', 'c' | 'd', 'e' | 'f'] = ['a', 'c', 'e'];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<`${'a' | 'b'},${'c' | 'd'},${
      | 'e'
      | 'f'}`>();
  });

  it('readonly tuple', () => {
    const array: readonly ['a' | 'b', 'c' | 'd', 'e' | 'f'] = ['a', 'c', 'e'];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<`${'a' | 'b'},${'c' | 'd'},${
      | 'e'
      | 'f'}`>();
  });

  it('tuple with rest tail', () => {
    const array: ['a' | 'b', ...Array<'c' | 'd'>] = ['a', 'c'];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<`${'a' | 'b'},${string}`>();
  });

  it('readonly tuple with rest tail', () => {
    const array: readonly ['a' | 'b', ...Array<'c' | 'd'>] = ['a', 'c'];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<`${'a' | 'b'},${string}`>();
  });

  it('tuple with rest head', () => {
    const array: [...Array<'a' | 'b'>, 'c' | 'd'] = ['a', 'c'];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<`${string},${'c' | 'd'}`>();
  });

  it('readonly tuple with rest head', () => {
    const array: readonly [...Array<'a' | 'b'>, 'c' | 'd'] = ['a', 'c'];
    const result = join(array, ',');
    expectTypeOf(result).toEqualTypeOf<`${string},${'c' | 'd'}`>();
  });

  describe('tuple item types', () => {
    it('number', () => {
      const array: [number, number] = [1, 2];
      const result = join(array, ',');
      expectTypeOf(result).toEqualTypeOf<`${number},${number}`>();
    });

    it('string', () => {
      const array: [string, string] = ['a', 'b'];
      const result = join(array, ',');
      expectTypeOf(result).toEqualTypeOf<`${string},${string}`>();
    });

    it('bigint', () => {
      const array: [bigint, bigint] = [BigInt(1), BigInt(2)];
      const result = join(array, ',');
      expectTypeOf(result).toEqualTypeOf<`${bigint},${bigint}`>();
    });

    it('boolean', () => {
      const array: [boolean, boolean] = [true, false];
      const result = join(array, ',');
      expectTypeOf(result).toEqualTypeOf<`${boolean},${boolean}`>();
    });

    it('null', () => {
      const array: [null, null] = [null, null];
      const result = join(array, ',');
      expectTypeOf(result).toEqualTypeOf<','>();
    });

    it('undefined', () => {
      const array: [undefined, undefined] = [undefined, undefined];
      const result = join(array, ',');
      expectTypeOf(result).toEqualTypeOf<','>();
    });

    it('mixed', () => {
      const array: [number, undefined, string] = [1, undefined, 'a'];
      const result = join(array, ',');
      expectTypeOf(result).toEqualTypeOf<`${number},,${string}`>();
    });

    it('nullish items', () => {
      const array: [
        'prefix' | undefined,
        'midfix' | undefined,
        'suffix' | undefined,
      ] = ['prefix', undefined, 'suffix'];
      const result = join(array, ',');
      expectTypeOf(result).toEqualTypeOf<`${'prefix' | ''},${'midfix' | ''},${
        | 'suffix'
        | ''}`>();
    });
  });
});
