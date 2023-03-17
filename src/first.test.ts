import { filter } from './filter';
import { first } from './first';
import { pipe } from './pipe';
import { createCounter } from './_counter';

function defaultTo<T>(d: T) {
  return function (v: T | undefined | null) {
    return v == null ? d : v;
  };
}

test('should return last', () => {
  expect(first([1, 2, 3] as const)).toEqual(1);
});

test('empty array', () => {
  expect(first([])).toEqual(undefined);
});

describe('pipe', () => {
  test('as no-fn', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3, 4, 5, 6] as const,
      counter.fn(),
      first,
      x => x
    );
    expect(counter.count).toHaveBeenCalledTimes(1);
    expect(result).toEqual(1);
  });

  test('as fn', () => {
    const counter = createCounter();
    const result = pipe([1, 2, 3, 4, 5, 6] as const, counter.fn(), first());
    expect(counter.count).toHaveBeenCalledTimes(1);
    expect(result).toEqual(1);
  });

  test('with filter', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 4, 8, 16] as const,
      counter.fn(),
      filter(x => x > 3),
      first(),
      defaultTo(0),
      x => x + 1
    );
    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toEqual(5);
  });

  test('empty array', () => {
    const counter = createCounter();
    const result = pipe([] as const, counter.fn(), first());
    expect(counter.count).toHaveBeenCalledTimes(0);
    expect(result).toEqual(undefined);
  });

  test('2 x first()', () => {
    const counter = createCounter();
    const result = pipe(
      [[1, 2, 3], [4, 5], [6]] as const,
      counter.fn(),
      first(),
      defaultTo<ReadonlyArray<number>>([]),
      first()
    );
    expect(counter.count).toHaveBeenCalledTimes(1);
    expect(result).toEqual(1);
  });

  test('complex', () => {
    const counter1 = createCounter();
    const counter2 = createCounter();
    const result = pipe(
      [[1, 2, 3], [1], [4, 5, 6, 7], [1, 2, 3, 4]] as const,
      counter1.fn(),
      filter(arr => arr.length === 4),
      first(),
      defaultTo<ReadonlyArray<number>>([]),
      counter2.fn(),
      filter(x => x % 2 === 1),
      first()
    );
    expect(counter1.count).toHaveBeenCalledTimes(3);
    expect(counter2.count).toHaveBeenCalledTimes(2);
    expect(result).toEqual(5);
  });
});

describe('strict typing', () => {
  test('simple empty array', () => {
    const arr: Array<number> = [];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(undefined);
  });

  test('simple array', () => {
    const arr: Array<number> = [1];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test('simple non-empty array', () => {
    const arr: [number, ...Array<number>] = [1];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number>();
    expect(result).toEqual(1);
  });

  test('simple tuple', () => {
    const arr: [number, string] = [1, 'a'];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number>();
    expect(result).toEqual(1);
  });

  test('array with more than one item', () => {
    const arr: [number, number, ...Array<number>] = [1, 2];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number>();
    expect(result).toEqual(1);
  });

  test('trivial empty array', () => {
    const arr: [] = [];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf(undefined);
    expect(result).toEqual(undefined);
  });

  test('simple empty readonly array', () => {
    const arr: ReadonlyArray<number> = [];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(undefined);
  });

  test('simple readonly array', () => {
    const arr: ReadonlyArray<number> = [1];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
    expect(result).toEqual(1);
  });

  test('simple non-empty readonly array', () => {
    const arr: readonly [number, ...Array<number>] = [1];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number>();
    expect(result).toEqual(1);
  });

  test('simple readonly tuple', () => {
    const arr: readonly [number, string] = [1, 'a'];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number>();
    expect(result).toEqual(1);
  });

  test('readonly array with more than one item', () => {
    const arr: readonly [number, number, ...Array<number>] = [1, 2];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf<number>();
    expect(result).toEqual(1);
  });

  test('readonly trivial empty array', () => {
    const arr: readonly [] = [];
    const result = first(arr);
    expectTypeOf(result).toEqualTypeOf(undefined);
    expect(result).toEqual(undefined);
  });
});
