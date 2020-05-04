import { dropLast } from './dropLast';

const arr = [1, 2, 3, 4, 5] as const;

test('should drop last', () => {
  expect(dropLast(arr, 2)).toEqual([1, 2, 3]);
});

test('should not drop last', () => {
  expect(dropLast(arr, 0)).toEqual(arr);
  expect(dropLast(arr, -0)).toEqual(arr);
});
