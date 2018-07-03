import { filter } from '../src/filter';

describe('data_first', () => {
  it('should map an array', () => {
    const result = filter([1, 2, 3], x => x % 2 == 1);
    expect(result).toEqual([1, 3]);
  });
});

describe('data_last', () => {
  it('should map an array', () => {
    const result = filter((x: number) => x % 2 == 1)([1, 2, 3]);
    expect(result).toEqual([1, 3]);
  });
});
