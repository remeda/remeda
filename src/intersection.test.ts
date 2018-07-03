import { intersection } from './intersection';

test('should return intersection', () => {
  expect(intersection([1, 2, 3], [2, 3, 5])).toEqual([2, 3]);
});
