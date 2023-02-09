import { toPairs } from './toPairs';

test('should return pairs', () => {
  const actual = toPairs({ a: 1, b: 2, c: 3 });
  expect(actual).toEqual([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
});
