import { keys } from './keys';
import { pipe } from './pipe';

describe('runtime', () => {
  describe('dataFirst', () => {
    it('work with arrays', () => {
      expect(keys(['x', 'y', 'z'])).toEqual(['0', '1', '2']);
    });

    it('work with objects', () => {
      expect(keys({ a: 'x', b: 'y', c: 'z' })).toEqual(['a', 'b', 'c']);
    });

    it('should return strict types', () => {
      expect(keys.strict({ 5: 'x', b: 'y', c: 'z' } as const)).toEqual([
        '5',
        'b',
        'c',
      ]);
    });
  });

  describe('dataLast', () => {
    it('work with arrays', () => {
      expect(keys()(['x', 'y', 'z'])).toEqual(['0', '1', '2']);
    });

    it('work with objects', () => {
      expect(keys()({ a: 'x', b: 'y', c: 'z' })).toEqual(['a', 'b', 'c']);
    });

    it('should return strict types', () => {
      expect(keys.strict()({ 5: 'x', b: 'y', c: 'z' } as const)).toEqual([
        '5',
        'b',
        'c',
      ]);
    });

    it('should work in pipes', () => {
      expect(pipe({ a: 'x', b: 'y', c: 'z' }, keys())).toEqual(['a', 'b', 'c']);
    });

    it('should work in pipes with strict', () => {
      expect(pipe({ a: 'x', b: 'y', c: 'z' }, keys.strict())).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    test('"headless" dataLast', () => {
      // Older versions of Remeda didn't provide a native dataLast impl and
      // suggested users use a "headless" version of the dataFirst impl to get the
      // dataLast behavior.
      // TODO: Remove this test once we release Remeda v2 where we won't
      // officially continue to support this.
      expect(pipe({ a: 'x', b: 'y', c: 'z' }, keys)).toEqual(['a', 'b', 'c']);
    });
  });
});

describe('strict tuple types', () => {
  test('empty tuple', () => {
    const array: [] = [];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<typeof array>();
  });

  test('empty readonly tuple', () => {
    const array: readonly [] = [];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test('array', () => {
    const array: Array<number> = [];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>();
  });

  test('readonly array', () => {
    const array: ReadonlyArray<number> = [];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>();
  });

  test('tuple', () => {
    const array: ['a', 1, true] = ['a', 1, true];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<['0', '1', '2']>();
  });

  test('readonly tuple', () => {
    const array: readonly ['a', 1, true] = ['a', 1, true];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<['0', '1', '2']>();
  });

  test('tuple with rest tail', () => {
    const array: ['a', ...Array<'b'>] = ['a'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<['0', ...Array<`${number}`>]>();
  });

  test('readonly tuple with rest tail', () => {
    const array: readonly ['a', ...Array<'b'>] = ['a'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<['0', ...Array<`${number}`>]>();
  });

  test('tuple with rest head', () => {
    const array: [...Array<'a'>, 'b'] = ['b'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<[...Array<`${number}`>, `${number}`]>();
  });

  test('readonly tuple with rest head', () => {
    const array: readonly [...Array<'a'>, 'b'] = ['b'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<[...Array<`${number}`>, `${number}`]>();
  });

  test('tuple with rest middle', () => {
    const array: ['a', ...Array<'b'>, 'c'] = ['a', 'c'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<
      ['0', ...Array<`${number}`>, `${number}`]
    >();
  });

  test('readonly tuple with rest middle', () => {
    const array: readonly ['a', ...Array<'b'>, 'c'] = ['a', 'c'];
    const result = keys.strict(array);
    expectTypeOf(result).toEqualTypeOf<
      ['0', ...Array<`${number}`>, `${number}`]
    >();
  });
});

describe('strict object types', () => {
  test('empty record (string)', () => {
    const obj: Record<string, never> = {};
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test('empty record (number)', () => {
    const obj: Record<number, never> = {};
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test('empty record (const)', () => {
    const obj = {} as const;
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test('simple (required) object', () => {
    const obj: { a: string; b: number; c: boolean } = { a: 'a', b: 1, c: true };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 'b' | 'c'>>();
  });

  test('simple partial object', () => {
    const obj: { a?: string; b?: number; c?: boolean } = {
      a: 'a',
      b: 1,
      c: true,
    };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 'b' | 'c'>>();
  });

  test('object with index signature', () => {
    const obj: { [keys: string]: string; a: string } = {
      hello: 'world',
      a: 'goodbye',
    };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test('Record with literal union', () => {
    const obj: Record<'a' | 'b', number> = { a: 1, b: 2 };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<'a' | 'b'>>();
  });

  test('Record with template string literal', () => {
    const obj: Record<`param_${number}`, string> = {
      param_123: 'hello',
      param_456: 'world',
    };
    const result = keys.strict(obj);
    expectTypeOf(result).toEqualTypeOf<Array<`param_${number}`>>();
  });
});
