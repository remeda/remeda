import { indexBy } from './indexBy';
import { pipe } from './pipe';

const array = [
  { dir: 'left', code: 97 },
  { dir: 'right', code: 100 },
] as const;
const expected = {
  left: { dir: 'left', code: 97 },
  right: { dir: 'right', code: 100 },
};

describe('data first', () => {
  test('indexBy', () => {
    expect(indexBy(array, x => x.dir)).toEqual(expected);
  });

  test('indexBy.indexed', () => {
    expect(indexBy.indexed(array, x => x.dir)).toEqual(expected);
  });
});

describe('data last', () => {
  test('indexBy', () => {
    expect(
      pipe(
        array,
        indexBy(x => x.dir)
      )
    ).toEqual(expected);
  });

  test('indexBy.indexed', () => {
    expect(
      pipe(
        array,
        indexBy.indexed(x => x.dir)
      )
    ).toEqual(expected);
  });
});
