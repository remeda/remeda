import { takeWhile } from './takeWhile';
import { pipe } from './pipe';

describe('data_first', () => {
  it('takeWhile', () => {
    expect(takeWhile([1, 2, 3, 4, 3, 2, 1], x => x !== 4)).toEqual([1, 2, 3]);
  });
});

describe('data_last', () => {
  it('takeWhile', () => {
    expect(
      pipe(
        [1, 2, 3, 4, 3, 2, 1],
        takeWhile(x => x !== 4)
      )
    ).toEqual([1, 2, 3]);
  });
});
