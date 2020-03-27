import { take } from './take';

describe('data_first', () => {
  it('take', () => {
    expect(take([1, 2, 3, 4, 3, 2, 1] as const, 3)).toEqual([1, 2, 3]);
  });
});

describe('data_last', () => {
  it('take', () => {
    expect(take(3)([1, 2, 3, 4, 3, 2, 1] as const)).toEqual([1, 2, 3]);
  });
});
