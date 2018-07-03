import { indexBy } from './indexBy';
import { pipe } from './pipe';

describe('data first', () => {
  test('indexBy correctly', () => {
    const array = [{ dir: 'left', code: 97 }, { dir: 'right', code: 100 }];
    expect(indexBy(array, x => x.dir)).toEqual({
      left: { dir: 'left', code: 97 },
      right: { dir: 'right', code: 100 },
    });
  });
});

describe('data last', () => {
  test('indexBy correctly', () => {
    const array = [{ dir: 'left', code: 97 }, { dir: 'right', code: 100 }];
    expect(
      pipe(
        array,
        indexBy(x => x.dir)
      )
    ).toEqual({
      left: { dir: 'left', code: 97 },
      right: { dir: 'right', code: 100 },
    });
  });
});
