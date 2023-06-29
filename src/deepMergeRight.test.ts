import { deepMergeRight } from './deepMergeRight';

describe('deepMergeRight', () => {
  test('should correctly merge objects with right preference', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };

    const result = deepMergeRight(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });
});
