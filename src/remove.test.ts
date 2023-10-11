import { pipe } from './pipe';
import { remove } from './remove';

describe('data first', () => {
  test('remove', () => {
    expect(remove([1, 2, 3, 4, 5, 6, 7, 8], 2, 3)).toEqual([1, 2, 6, 7, 8]);
    expect(remove([1, 2, 3], 0, 1)).toEqual([2, 3]);
    expect(remove([1, 2, 3], -1, 1)).toEqual([1, 2]);
  });

  test("don't remove / immutability", () => {
    const data = [1, 2, 3];
    const result = remove(data, 0, 0);
    expect(result).toEqual(data);
    assert.notStrictEqual(result, data);

    expect(remove(data, 0, 0)).toEqual(data);
    expect(remove(data, 0, -1)).toEqual(data);
  });
});

describe('data last', () => {
  test('remove', () => {
    expect(pipe([1, 2, 3, 4, 5, 6, 7, 8], remove(2, 3))).toEqual([
      1, 2, 6, 7, 8,
    ]);
  });
});
