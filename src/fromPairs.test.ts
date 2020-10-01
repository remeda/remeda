import { fromPairs } from './fromPairs';

const tuples: [string, number][] = [['a', 1], ['b', 2], ['c', 3]]

describe('fromPairs', () => {
  test('generates object from pairs', () => {
    expect(fromPairs(tuples)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    })
  })

  test('ignores non-tuples', () => {
    const badInput = [...tuples, undefined, [], [2]];
    expect(fromPairs(badInput as any)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    })
  })
})
