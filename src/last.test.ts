import { last } from './last';

test('should return last', () => {
  expect(last([1, 2, 3])).toEqual(3);
});

test('empty array', () => {
  expect(last([])).toEqual(undefined);
});
