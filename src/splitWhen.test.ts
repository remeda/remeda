import { splitWhen } from './splitWhen';

it('should split array', () => {
  expect(splitWhen([1, 2, 3, 1, 2, 3] as const, x => x === 2)).toEqual([
    [1],
    [2, 3, 1, 2, 3],
  ]);
});

it('should with no matches', () => {
  const n: number = 1232;
  expect(splitWhen([1, 2, 3, 1, 2, 3] as const, x => x === n)).toEqual([
    [1, 2, 3, 1, 2, 3],
    [],
  ]);
});
