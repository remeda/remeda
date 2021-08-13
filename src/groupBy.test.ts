import { AssertEqual } from 'src/_types';
import { groupBy } from './groupBy';
import { pipe } from './pipe';

const array = [
  { a: 1, b: 1 },
  { a: 1, b: 2 },
  { a: 2, b: 1 },
  { a: 1, b: 3 },
] as const;
const expected = {
  1: [
    { a: 1, b: 1 },
    { a: 1, b: 2 },
    { a: 1, b: 3 },
  ],
  2: [{ a: 2, b: 1 }],
};

describe('data first', () => {
  test('groupBy', () => {
    expect(groupBy(array, x => x.a)).toEqual(expected);
  });
  test('groupBy.indexed', () => {
    expect(groupBy.indexed(array, x => x.a)).toEqual(expected);
  });
});

describe('data last', () => {
  test('groupBy', () => {
    expect(
      pipe(
        array,
        groupBy(x => x.a)
      )
    ).toEqual(expected);
  });
  test('groupBy.indexed', () => {
    expect(
      pipe(
        array,
        groupBy.indexed(x => x.a)
      )
    ).toEqual(expected);
  });
});

describe('groupBy typings', () => {
  test('keys should be strictly inferred', () => {
    const actual = groupBy(array, x => x.a);
    const result: AssertEqual<keyof typeof actual, 1 | 2> = true;
    expect(result).toEqual(true);
  });
  test('keys should be strictly inferred for indexed version', () => {
    const actual = groupBy.indexed(array, x => x.a);
    const result: AssertEqual<keyof typeof actual, 1 | 2> = true;
    expect(result).toEqual(true);
  });
  test('keys should be strictly inferred for data last version', () => {
    const actual = pipe(
      array,
      groupBy(x => x.a)
    );
    const result: AssertEqual<keyof typeof actual, 1 | 2> = true;
    expect(result).toEqual(true);
  });
});
