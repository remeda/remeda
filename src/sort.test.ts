import { sort } from './sort';

test('should sort', () => {
  expect(sort([4, 2, 7, 5], (a, b) => a - b)).toEqual([2, 4, 5, 7]);
});
