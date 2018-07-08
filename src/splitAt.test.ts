import { splitAt } from './splitAt';

describe('data_first', () => {
  test('split', () => {
    expect(splitAt([1, 2, 3], 1)).toEqual([[1], [2, 3]]);
  });

  test('split at -1', () => {
    expect(splitAt([1, 2, 3, 4, 5], -1)).toEqual([[1, 2, 3, 4], [5]]);
  });
});

describe('data_last', () => {
  test('split', () => {
    expect(splitAt(1)([1, 2, 3])).toEqual([[1], [2, 3]]);
  });

  test('split at -1', () => {
    expect(splitAt(-1)([1, 2, 3, 4, 5])).toEqual([[1, 2, 3, 4], [5]]);
  });
});
