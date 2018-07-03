import { find } from './find';
import { pipe } from './pipe';

const array = [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 3 }];
const expected = { a: 1, b: 2 };

describe('data first', () => {
  test('find correctly', () => {
    expect(find(array, x => x.b === 2)).toEqual(expected);
  });
});

describe('data last', () => {
  test('find correctly', () => {
    const actual = pipe(
      array,
      find(x => x.b === 2)
    );
    expect(actual).toEqual(expected);
  });
});
