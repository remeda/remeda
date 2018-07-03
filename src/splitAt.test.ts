import { splitAt } from './splitAt';

test('should split', () => {
  expect(splitAt([1, 2, 3], 1)).toEqual([[1], [2, 3]]);
});

test('should split -1', () => {
  expect(splitAt([1, 2, 3, 4, 5], -1)).toEqual([[1, 2, 3, 4], [5]]);
});
