import { partition } from './partition';
import { pipe } from './pipe';
import { AssertEqual } from './_types';

const array = [
  { a: 1, b: 1 },
  { a: 1, b: 2 },
  { a: 2, b: 1 },
  { a: 1, b: 3 },
] as const;
const expected = [
  [
    { a: 1, b: 1 },
    { a: 1, b: 2 },
    { a: 1, b: 3 },
  ],
  [{ a: 2, b: 1 }],
];

describe('data first', () => {
  test('partition', () => {
    expect(partition(array, x => x.a === 1)).toEqual(expected);
  });
  test('partition with type guard', () => {
    const isNumber = function (value: any): value is number {
      return typeof value === 'number';
    };
    const actual = partition([1, 'a', 2, 'b'], isNumber);
    expect(actual).toEqual([
      [1, 2],
      ['a', 'b'],
    ]);
    const result: AssertEqual<typeof actual, [number[], string[]]> = true;
    expect(result).toBe(true);
  });
  test('partition.indexed', () => {
    expect(partition.indexed(array, (_, index) => index !== 2)).toEqual(
      expected
    );
  });
});

describe('data last', () => {
  test('partition', () => {
    expect(
      pipe(
        array,
        partition(x => x.a === 1)
      )
    ).toEqual(expected);
  });
  test('partition.indexed', () => {
    expect(
      pipe(
        array,
        partition.indexed((_, index) => index !== 2)
      )
    ).toEqual(expected);
  });
});
