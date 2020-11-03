import { minBy } from './minBy';
import { pipe } from './pipe';

const array = [{ a: 2 }, { a: 5 }, { a: 1 }, { a: 4 }] as const;
const expected = { a: 5 };

describe('data first', () => {
  test('maxBy', () => {
    expect(minBy(array, x => x.a)).toEqual(expected);
  });
  test('maxBy.indexed', () => {
    expect(minBy.indexed(array, (x, idx) => x.a + idx)).toEqual({ a: 4 });
  });
});

describe('data last', () => {
  test('maxBy', () => {
    const actual = pipe(
      array,
      minBy(x => x.a)
    );
    expect(actual).toEqual(expected);
  });

  test('maxBy.indexed', () => {
    const actual = pipe(
      array,
      minBy.indexed((x, idx) => x.a + idx)
    );
    expect(actual).toEqual({ a: 4 });
  });
});
