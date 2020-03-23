import { flattenDeep } from './flattenDeep';
import { pipe } from './pipe';
import { find } from './find';
import { createCounter } from './_counter';

test('flatten', () => {
  expect(flattenDeep([[1, 2], 3, [4, 5]] as const)).toEqual([1, 2, 3, 4, 5]);
});

test('nested', () => {
  expect(
    flattenDeep([
      [1, 2],
      [[3], [4, 5]],
    ] as const)
  ).toEqual([1, 2, 3, 4, 5]);
});

describe('pipe', () => {
  test('with find', () => {
    const counter1 = createCounter();
    const counter2 = createCounter();
    const result = pipe(
      [[1, 2], [[3]], [[4, 5]]] as const,
      counter1.fn(),
      flattenDeep(),
      counter2.fn(),
      find(x => x - 1 === 2)
    );
    expect(counter1.count).toHaveBeenCalledTimes(2);
    expect(counter2.count).toHaveBeenCalledTimes(3);
    expect(result).toEqual(3);
  });
});
