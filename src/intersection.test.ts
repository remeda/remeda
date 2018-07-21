import { intersection } from './intersection';

describe('data_first', () => {
  test('intersection', () => {
    expect(intersection([1, 2, 3], [2, 3, 5])).toEqual([2, 3]);
  });
});

describe('data_last', () => {
  test('intersection', () => {
    expect(intersection([2, 3, 5])([1, 2, 3])).toEqual([2, 3]);
  });
});
