import { range } from './range';

describe('data first', () => {
  test('range', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
  });
});

describe('data last', () => {
  test('range', () => {
    expect(range(5)(1)).toEqual([1, 2, 3, 4]);
  });
});
