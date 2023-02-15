import { groupBy } from './groupBy';
import { pipe } from './pipe';
import { AssertEqual, NonEmptyArray } from './_types';

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

const array2 = [
  { a: 'cat', b: 123 },
  { a: 'dog', b: 456 },
] as const;
type Array2Item = typeof array2[number];

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

describe('Result key types', () => {
  test('Union of string literals', () => {
    const data = groupBy(array2, x => x.a);
    const result: AssertEqual<
      typeof data,
      Partial<Record<'cat' | 'dog', NonEmptyArray<Array2Item>>>
    > = true;
    expect(result).toEqual(true);
  });
  test('Union of number literals', () => {
    const data = groupBy(array2, x => x.b);
    const result: AssertEqual<
      typeof data,
      Partial<Record<123 | 456, NonEmptyArray<Array2Item>>>
    > = true;
    expect(result).toEqual(true);
  });
  test('string', () => {
    const data = groupBy(array2, (x): string => x.a);
    const result: AssertEqual<
      typeof data,
      Record<string, NonEmptyArray<Array2Item>>
    > = true;
    expect(result).toEqual(true);
  });
  test('number', () => {
    const data = groupBy(array2, (x): number => x.b);
    const result: AssertEqual<
      typeof data,
      Record<number, NonEmptyArray<Array2Item>>
    > = true;
    expect(result).toEqual(true);
  });
  test('string | number', () => {
    const data = groupBy(array2, (x):  string | number => x.b);
    const result: AssertEqual<
      typeof data,
      Record<string | number, NonEmptyArray<Array2Item>>
    > = true;
    expect(result).toEqual(true);
  });
});

