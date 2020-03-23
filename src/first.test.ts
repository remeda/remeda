import { first } from './first';
import { pipe } from './pipe';
import { createCounter } from './_counter';
import { filter } from './filter';

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
      defaultTo<readonly number[]>([]),
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
      defaultTo<readonly number[]>([]),
      counter2.fn(),
      filter(x => x % 2 === 1),
      first()
    );
    expect(counter1.count).toHaveBeenCalledTimes(3);
    expect(counter2.count).toHaveBeenCalledTimes(2);
    expect(result).toEqual(5);
  });
});
