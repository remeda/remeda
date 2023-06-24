import { fromPairs } from './fromPairs';

const tuples: Array<[string, number]> = [
  ['a', 1],
  ['b', 2],
  ['c', 3],
];

describe('fromPairs', () => {
  test('generates object from pairs', () => {
    expect(fromPairs(tuples)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});

describe('typings', () => {
  test('arrays', () => {
    const actual = fromPairs(tuples);
    assertType<Record<string, number>>(actual);
  });
  test('arrays with mixed type value', () => {
    const actual = fromPairs<string | number>([
      ['a', 2],
      ['b', 'c'],
    ]);
    assertType<Record<string, string | number>>(actual);
  });
});

describe('Strict (with readonly inputs)', () => {
  test('trivial empty case', () => {
    const result = fromPairs.strict([] as const);
    expectTypeOf(result).toEqualTypeOf({} as const);
    expect(result).toStrictEqual({});
  });

  test('trivial single entry const case', () => {
    const result = fromPairs.strict([['a', 1]] as const);
    expectTypeOf(result).toEqualTypeOf<{ a: 1 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('trivial multi entry const case', () => {
    const result = fromPairs.strict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ] as const);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b: 2; c: 3 }>();
    expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  test('runtime empty well defined array', () => {
    const arr: ReadonlyArray<['a', 1] | ['b', 2] | ['c', 3]> = [];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({});
  });

  test('runtime single value well defined array', () => {
    const arr: ReadonlyArray<['a', 1] | ['b', 2] | ['c', 3]> = [['a', 1]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('runtime multi-value well defined array', () => {
    const arr: ReadonlyArray<['a', 1] | ['b', 2] | ['c', 3]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  test('runtime mixed tuple with rest (first)', () => {
    const arr: readonly [['a', 1], ...ReadonlyArray<['b', 2] | ['c', 3]>] = [
      ['a', 1],
    ];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('runtime mixed tuple with rest (last)', () => {
    const arr: readonly [...ReadonlyArray<['b', 2] | ['c', 3]>, ['a', 1]] = [
      ['a', 1],
    ];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('runtime empty generic type', () => {
    const arr: ReadonlyArray<readonly [string, boolean]> = [];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({});
  });

  test('runtime single value generic type', () => {
    const arr: ReadonlyArray<readonly [string, boolean]> = [['hello', true]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({ hello: true });
  });

  test('runtime multi-value generic type', () => {
    const arr: ReadonlyArray<readonly [string, boolean]> = [
      ['hello', true],
      ['world', false],
    ];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({ hello: true, world: false });
  });

  test('mixed literals and generics', () => {
    const arr: ReadonlyArray<
      readonly ['a', 1] | readonly [`testing_${string}`, boolean]
    > = [['a', 1]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<
      { a?: 1 } & Partial<Record<`testing_${string}`, boolean>>
    >();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('array with literal keys', () => {
    const arr: ReadonlyArray<readonly ['a' | 'b' | 'c', 'd']> = [['a', 'd']];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Partial<Record<'a' | 'b' | 'c', 'd'>>>();
    expect(result).toStrictEqual({ a: 'd' });
  });

  test('backwards compatibility (number)', () => {
    const arr: ReadonlyArray<readonly [number, 123]> = [[1, 123]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
    expect(result).toStrictEqual({ 1: 123 });
  });

  test('backwards compatibility (string)', () => {
    const arr: ReadonlyArray<readonly [string, 123]> = [['a', 123]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
    expect(result).toStrictEqual({ a: 123 });
  });
});

describe('Strict (with non-readonly inputs)', () => {
  test('trivial empty case', () => {
    const result = fromPairs.strict([]);
    expectTypeOf(result).toEqualTypeOf({} as const);
    expect(result).toStrictEqual({});
  });

  test('trivial single entry const case', () => {
    const result = fromPairs.strict([['a', 1]]);
    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('trivial multi entry const case', () => {
    const result = fromPairs.strict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
    expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  test('runtime empty well defined array', () => {
    const arr: Array<['a', 1] | ['b', 2] | ['c', 3]> = [];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({});
  });

  test('runtime single value well defined array', () => {
    const arr: Array<['a', 1] | ['b', 2] | ['c', 3]> = [['a', 1]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('runtime multi-value well defined array', () => {
    const arr: Array<['a', 1] | ['b', 2] | ['c', 3]> = [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a?: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1, b: 2, c: 3 });
  });

  test('runtime mixed tuple with rest (first)', () => {
    const arr: [['a', 1], ...Array<['b', 2] | ['c', 3]>] = [['a', 1]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('runtime mixed tuple with rest (last)', () => {
    const arr: [...Array<['b', 2] | ['c', 3]>, ['a', 1]] = [['a', 1]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<{ a: 1; b?: 2; c?: 3 }>();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('runtime empty generic type', () => {
    const arr: Array<[string, boolean]> = [];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({});
  });

  test('runtime single value generic type', () => {
    const arr: Array<[string, boolean]> = [['hello', true]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({ hello: true });
  });

  test('runtime multi-value generic type', () => {
    const arr: Array<[string, boolean]> = [
      ['hello', true],
      ['world', false],
    ];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, boolean>>();
    expect(result).toStrictEqual({ hello: true, world: false });
  });

  test('mixed literals and generics', () => {
    const arr: Array<['a', 1] | [`testing_${string}`, boolean]> = [['a', 1]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<
      { a?: 1 } & Partial<Record<`testing_${string}`, boolean>>
    >();
    expect(result).toStrictEqual({ a: 1 });
  });

  test('array with literal keys', () => {
    const arr: Array<readonly ['a' | 'b' | 'c', 'd']> = [['a', 'd']];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Partial<Record<'a' | 'b' | 'c', 'd'>>>();
    expect(result).toStrictEqual({ a: 'd' });
  });

  test('backwards compatibility (number)', () => {
    const arr: Array<[number, 123]> = [[1, 123]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<number, 123>>();
    expect(result).toStrictEqual({ 1: 123 });
  });

  test('backwards compatibility (string)', () => {
    const arr: Array<[string, 123]> = [['a', 123]];
    const result = fromPairs.strict(arr);
    expectTypeOf(result).toEqualTypeOf<Record<string, 123>>();
    expect(result).toStrictEqual({ a: 123 });
  });
});
