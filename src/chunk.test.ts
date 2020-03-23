import { chunk } from './chunk';

describe('data first', () => {
  test('equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'] as const, 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  test('not equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'] as const, 3)).toEqual([
      ['a', 'b', 'c'],
      ['d'],
    ]);
  });

  test('1 element', () => {
    expect(chunk(['x'] as const, 3)).toEqual([['x']]);
  });

  test('empty array', () => {
    expect(chunk([] as const, 3)).toEqual([]);
  });
});

describe('data last', () => {
  test('equal size', () => {
    expect(chunk(2)(['a', 'b', 'c', 'd'] as const)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });
});
