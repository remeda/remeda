import { first } from './first';
import { pipe } from './pipe';
import { createCounter } from './_counter';
import { take } from './take';
import { map } from './map';

test('should return last', () => {
  expect(first([1, 2, 3])).toEqual(1);
});

test('empty array', () => {
  expect(first([])).toEqual(undefined);
});

test('pipe', () => {
  const counter = createCounter();
  const result = pipe(
    [1, 2, 3, 4, 5, 6],
    counter.fn(),
    first
  );
  expect(counter.count).toHaveBeenCalledTimes(1);
  expect(result).toEqual(1);
});

test('pipe - empty array', () => {
  const counter = createCounter();
  const result = pipe(
    [],
    counter.fn(),
    first
  );
  expect(counter.count).toHaveBeenCalledTimes(0);
  expect(result).toEqual(undefined);
});

test('pipe complex', () => {
  const counter = createCounter();
  const count = jest.fn();
  const arr = [[1, 2, 3], [4, 5], [6]];
  const result = pipe(
    [1, 2],
    map(x => {
      count();
      return x;
    },
    first,
  );
  expect(count).toHaveBeenCalledTimes(1);
  expect(result).toEqual(1);
});
