import { splitAt } from './splitAt';

describe('data_first', () => {
  test('split', () => {
    expect(splitAt([1, 2, 3] as const, 1)).toEqual([[1], [2, 3]]);
  });

  test('split at -1', () => {
    expect(splitAt([1, 2, 3, 4, 5] as const, -1)).toEqual([[1, 2, 3, 4], [5]]);
  });
});

describe('data_last', () => {
  test('split', () => {
    expect(splitAt(1)([1, 2, 3] as const)).toEqual([[1], [2, 3]]);
  });

  test('split at -1', () => {
    expect(splitAt(-1)([1, 2, 3, 4, 5] as const)).toEqual([[1, 2, 3, 4], [5]]);
  });
});
