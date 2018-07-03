import { reject } from '../src/reject';

describe('data_first', () => {
  it('should map an array', () => {
    const result = reject([1, 2, 3], x => x % 2 == 1);
    expect(result).toEqual([2]);
  });
});

describe('data_last', () => {
  it('should map an array', () => {
    const result = reject((x: number) => x % 2 == 1)([1, 2, 3]);
    expect(result).toEqual([2]);
  });
});
