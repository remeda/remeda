import { swapIndices } from './swapIndices';

describe('data_first', () => {
  it('swap array', () => {
    expect(swapIndices([1, 2, 3, 4, 5], 0, -1)).toEqual([5, 2, 3, 4, 1]);
  });
  it('swap string', () => {
    expect(swapIndices('apple', 0, 1)).toEqual('paple');
  });
});

describe('data_last', () => {
  it('swap array', () => {
    expect(swapIndices(-1, 4)([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });
  it('swap string', () => {
    expect(swapIndices(0, -1)('apple')).toEqual('eppla');
  });
});
