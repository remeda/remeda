import { takeWhile } from './takeWhile';

it('should take elements', () => {
  expect(takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4)).toEqual([1, 2, 3]);
});
