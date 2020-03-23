import { sort } from './sort';
import { pipe } from './pipe';

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
