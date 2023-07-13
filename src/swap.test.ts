import { swap } from './swap';

describe('data_first', () => {
  it('swap array', () => {
    expect(swap([1, 2, 3, 4, 5], 0, -1)).toEqual([5, 2, 3, 4, 1]);
  });
  it('swap string', () => {
    expect(swap('apple', 0, 1)).toEqual('paple');
  });
  it('swap object', () => {
    expect(swap({ a: 1, b: 2 }, 'a', 'b')).toEqual({ a: 2, b: 1 });
  });
});

describe('data_last', () => {
  it('swap array', () => {
    expect(swap(-1, 4)([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });
  it('swap string', () => {
    expect(swap(0, -1)('apple')).toEqual('eppla');
  });
  it('swap object', () => {
    expect(swap('a', 'b')({ a: 1, b: 2 })).toEqual({ a: 2, b: 1 });
  });
});
