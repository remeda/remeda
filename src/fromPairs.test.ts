import { fromPairs } from './fromPairs';

const tuples: Array<[string, number]> = [
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
});

describe('typings', () => {
  test('arrays', () => {
    const actual = fromPairs(tuples);
    assertType<Record<string, number>>(actual);
  });
  test('arrays with mixed type value', () => {
    const actual = fromPairs<string | number>([
      ['a', 2],
      ['b', 'c'],
    ]);
    assertType<Record<string, string | number>>(actual);
  });
});
