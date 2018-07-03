import { dropLast } from './dropLast';

test('should drop last', () => {
  const arr = [1, 2, 3, 4, 5];
  expect(dropLast(arr, 2)).toEqual([1, 2, 3]);
});
