import { findIndex } from './findIndex';

test('should return index', () => {
  expect(findIndex([10, 20, 30], x => x === 20)).toBe(1);
});

test('should return -1', () => {
  expect(findIndex([2, 3, 4], x => x === 20)).toBe(-1);
});
