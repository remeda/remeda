import { countBy } from './countBy';
import { pipe } from './pipe';

describe('data first', () => {
  test('countBy', () => {
    expect(countBy([1, 2, 3, 4, 5], x => x % 2 === 0)).toEqual(2);
  });
  test('countBy.indexed', () => {
    expect(countBy.indexed([1, 2, 3, 4, 5], x => x % 2 === 0)).toEqual(2);
  });
});

describe('data last', () => {
  test('countBy', () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        countBy(x => x % 2 === 0)
      )
    ).toEqual(2);
  });
  test('countBy.indexed', () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        countBy.indexed(x => x % 2 === 0)
      )
    ).toEqual(2);
  });
});
