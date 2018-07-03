import { splitWhen } from './splitWhen';

it('should split array', () => {
  expect(splitWhen([1, 2, 3, 1, 2, 3], x => x === 2)).toEqual([
    [1],
    [2, 3, 1, 2, 3],
  ]);
});

it('should with no matches', () => {
  expect(splitWhen([1, 2, 3, 1, 2, 3], x => x === 1232)).toEqual([
    [1, 2, 3, 1, 2, 3],
    [],
  ]);
});
