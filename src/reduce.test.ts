import { reduce } from './reduce';
import { pipe } from './pipe';

const array = [1, 2, 3, 4, 5];

describe('data first', () => {
  test('indexBy correctly', () => {
    expect(reduce(array, (acc, x) => acc + x, 100)).toEqual(115);
  });
});

describe('data last', () => {
  test('indexBy correctly', () => {
    expect(
      pipe(
        array,
        reduce((acc, x) => acc + x, 100)
      )
    ).toEqual(115);
  });
});
