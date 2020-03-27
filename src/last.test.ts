import { last } from './last';

test('should return last', () => {
  expect(last([1, 2, 3] as const)).toEqual(3);
});

test('empty array', () => {
  expect(last([] as const)).toEqual(undefined);
});
