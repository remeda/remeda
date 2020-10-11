import { fromPairs } from './fromPairs';
import { AssertEqual } from './_types';

const tuples: [string, number][] = [
  ['a', 1],
  ['b', 2],
  ['c', 3],
];

describe('fromPairs', () => {
  test('generates object from pairs', () => {
    expect(fromPairs(tuples)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  test('ignores non-tuples', () => {
    const badInput = [...tuples, undefined, [], [2]];
    expect(fromPairs(badInput as any)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});

describe('typings', () => {
  test('arrays', () => {
    const actual = fromPairs(tuples);
    const result: AssertEqual<typeof actual, Record<string, number>> = true;
    expect(result).toBe(true);
  });
  test('arrays with mixed type value', () => {
    const actual = fromPairs<string | number>([
      ['a', 2],
      ['b', 'c'],
    ]);
    const result: AssertEqual<
      typeof actual,
      Record<string, string | number>
    > = true;
    expect(result).toBe(true);
  });
});
