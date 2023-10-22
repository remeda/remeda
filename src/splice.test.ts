import { pipe } from './pipe';
import { splice } from './splice';

describe('data first', () => {
  test('splice', () => {
    expect(splice([1, 2, 3, 4, 5, 6, 7, 8], 2, 3, [])).toEqual([1, 2, 6, 7, 8]);
    expect(splice([1, 2, 3, 4, 5, 6, 7, 8], 2, 3, [9, 10])).toEqual([
      1, 2, 9, 10, 6, 7, 8,
    ]);
  });

  test('immutability', () => {
    const data = [1, 2, 3];
    const result = splice(data, 0, 0, []);
    expect(result).toEqual(data);
    expect(result).not.toBe(data);
  });
});

describe('data last', () => {
  test('splice', () => {
    expect(
      pipe([1, 2, 3, 4, 5, 6, 7, 8], splice(2, 3, [] as Array<number>))
    ).toEqual([1, 2, 6, 7, 8]);
    expect(pipe([1, 2, 3, 4, 5, 6, 7, 8], splice(2, 3, [9, 10]))).toEqual([
      1, 2, 9, 10, 6, 7, 8,
    ]);
  });
});
