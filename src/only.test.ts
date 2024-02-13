import { only } from './only';

describe('strict typing', () => {
  test('simple empty array', () => {
    const arr: Array<number> = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(undefined);
  });

  test('simple array', () => {
    const arr: Array<number> = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test('simple non-empty array', () => {
    const arr: [number, ...Array<number>] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test('simple tuple', () => {
    const arr: [number, string] = [1, 'a'];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toEqual(undefined);
  });

  test('array with more than one item', () => {
    const arr: [number, number, ...Array<number>] = [1, 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toEqual(undefined);
  });

  test('trivial empty array', () => {
    const arr: [] = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf(undefined);
    expect(result).toEqual(undefined);
  });

  test('array with last', () => {
    const arr: [...Array<number>, number] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test('tuple with last', () => {
    const arr: [...Array<string>, number] = ['a', 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<string | number | undefined>();
    expect(result).toEqual(undefined);
  });

  test('tuple with two last', () => {
    const arr: [...Array<string>, number, number] = ['a', 1, 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toEqual(undefined);
  });

  test('tuple with first and last', () => {
    const arr: [number, ...Array<string>, number] = [1, 'a', 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toEqual(undefined);
  });

  test('simple empty readonly array', () => {
    const arr: ReadonlyArray<number> = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(undefined);
  });

  test('simple readonly array', () => {
    const arr: ReadonlyArray<number> = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test('simple non-empty readonly array', () => {
    const arr: readonly [number, ...Array<number>] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test('simple readonly tuple', () => {
    const arr: readonly [number, string] = [1, 'a'];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toEqual(undefined);
  });

  test('readonly array with more than one item', () => {
    const arr: readonly [number, number, ...Array<number>] = [1, 2];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<undefined>();
    expect(result).toEqual(undefined);
  });

  test('readonly trivial empty array', () => {
    const arr: readonly [] = [];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf(undefined);
    expect(result).toEqual(undefined);
  });

  test('readonly array with last', () => {
    const arr: readonly [...Array<number>, number] = [1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test('readonly tuple with last', () => {
    const arr: readonly [...Array<string>, number] = ['a', 1];
    const result = only(arr);
    expectTypeOf(result).toEqualTypeOf<string | number | undefined>();
    expect(result).toEqual(undefined);
  });
});
