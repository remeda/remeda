import { range } from './range';

test('should create range', () => {
  expect(range(5)).toEqual([0, 1, 2, 3, 4]);
});

test('should create range with start', () => {
  expect(range(1, 5)).toEqual([1, 2, 3, 4]);
});
