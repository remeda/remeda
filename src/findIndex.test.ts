import { findIndex } from './findIndex';
import { pipe } from './pipe';
import { createCounter } from './_counter';

describe('data first', () => {
  test('findIndex', () => {
    expect(findIndex([10, 20, 30], x => x === 20)).toBe(1);
  });

  test('findIndex.indexed', () => {
    expect(findIndex([10, 20, 30], x => x === 20)).toBe(1);
  });

  test('findIndex -1', () => {
    expect(findIndex([2, 3, 4], x => x === 20)).toBe(-1);
  });
});

describe('data last', () => {
  test('findIndex', () => {
    const counter = createCounter();
    const actual = pipe(
      [10, 20, 30],
      counter.fn(),
      findIndex(x => x === 20)
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(1);
  });

  test('findIndex.indexed', () => {
    const counter = createCounter();
    const actual = pipe(
      [10, 20, 30],
      counter.fn(),
      findIndex.indexed(x => x === 20)
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(1);
  });
});
