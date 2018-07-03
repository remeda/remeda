import { flatMap } from './flatMap';

describe('data_first', () => {
  it('should map an array', () => {
    const result = flatMap([1, 2], x => [x * 2, x * 3]);
    expect(result).toEqual([2, 3, 4, 6]);
  });
});

describe('data_last', () => {
  it('should map an array', () => {
    const result = flatMap((x: number) => [x * 2, x * 3])([1, 2]);
    expect(result).toEqual([2, 3, 4, 6]);
  });
});
