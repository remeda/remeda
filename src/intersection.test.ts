import { intersection } from './intersection';

describe('data_first', () => {
  test('intersection', () => {
    expect(intersection([1, 2, 3] as const, [2, 3, 5] as const)).toEqual([
      2,
      3,
    ]);
  });
});

describe('data_last', () => {
  test('intersection', () => {
    expect(intersection([2, 3, 5] as const)([1, 2, 3] as const)).toEqual([
      2,
      3,
    ]);
  });
});
