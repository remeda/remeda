import { flattenDeep } from './flattenDeep';

test('flatten', () => {
  expect(flattenDeep([[1, 2], 3, [4, 5]])).toEqual([1, 2, 3, 4, 5]);
});

test('nested', () => {
  expect(flattenDeep([[1, 2], [[3], [4, 5]]])).toEqual([1, 2, 3, 4, 5]);
});
