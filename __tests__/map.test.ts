import { map } from '../src/map';

describe('data_first', () => {
  it('should map an array', () => {
    const result = map([1, 2, 3], x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });
});

describe('data_last', () => {
  it('should map an array', () => {
    const result = map((x: number) => x * 2)([1, 2, 3]);
    expect(result).toEqual([2, 4, 6]);
  });
});
