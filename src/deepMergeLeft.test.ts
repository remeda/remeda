import { deepMergeLeft } from './deepMergeLeft';

describe('deepMergeLeft', () => {
  test('should correctly merge objects with left preference', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };

    const result = deepMergeLeft(target, source);

    expect(result).toEqual({ a: 1, b: 2, c: 4 });
  });
});
