import { pipe } from './pipe';
import { sort } from './sort';

describe('data_first', () => {
  test('sort', () => {
    expect(sort([4, 2, 7, 5] as const, (a, b) => a - b)).toEqual([2, 4, 5, 7]);
  });
});

describe('data_last', () => {
  test('sort', () => {
    expect(
      pipe(
        [4, 2, 7, 5] as const,
        sort((a, b) => a - b)
      )
    ).toEqual([2, 4, 5, 7]);
  });
});

describe('strict', () => {
  it('on empty tuple', () => {
    const array: [] = [];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on empty readonly tuple', () => {
    const array: readonly [] = [];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it('on array', () => {
    const array: Array<number> = [];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('on readonly array', () => {
    const array: ReadonlyArray<number> = [];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('on tuple', () => {
    const array: [1, 2, 3] = [1, 2, 3];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
  });

  it('on readonly tuple', () => {
    const array: readonly [1, 2, 3] = [1, 2, 3];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>();
  });

  it('on tuple with rest tail', () => {
    const array: [number, ...Array<number>] = [1];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it('on readonly tuple with rest tail', () => {
    const array: readonly [number, ...Array<number>] = [1];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it('on tuple with rest head', () => {
    const array: [...Array<number>, number] = [1];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  it('on readonly tuple with rest head', () => {
    const array: readonly [...Array<number>, number] = [1];
    const result = sort.strict(array, (a, b) => a - b);
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  it('on mixed types tuple', () => {
    const array: [number, string, boolean] = [1, 'hello', true];
    const result = sort.strict(array, () => 1);
    expectTypeOf(result).toEqualTypeOf<
      [
        number | string | boolean,
        number | string | boolean,
        number | string | boolean,
      ]
    >();
  });
});
