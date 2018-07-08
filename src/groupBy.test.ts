import { groupBy } from './groupBy';
import { pipe } from './pipe';

const array = [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 1, b: 3 }];
const expected = {
  1: [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 3 }],
  2: [{ a: 2, b: 1 }],
};

describe('data first', () => {
  test('groupBy correctly', () => {
    expect(groupBy(array, x => x.a)).toEqual(expected);
  });
});

describe('data last', () => {
  test('indexBy correctly', () => {
    expect(
      pipe(
        array,
        groupBy(x => x.a)
      )
    ).toEqual(expected);
  });
});

declare module './groupBy' {
  export interface groupBy {
    indexed: () => string;
  }
}
