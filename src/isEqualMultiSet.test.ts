import { isEqualMultiSet } from './isEqualMultiSet';

describe('runtime', () => {
  it('works on empty inputs', () => {
    expect(isEqualMultiSet([], [])).toEqual(true);
  });

  it('fails on one empty input', () => {
    expect(isEqualMultiSet([], [1])).toEqual(false);
    expect(isEqualMultiSet([1], [])).toEqual(false);
  });

  it('fails on different lengths', () => {
    expect(isEqualMultiSet([1, 2], [1])).toEqual(false);
    expect(isEqualMultiSet([1], [1, 2])).toEqual(false);
  });

  it('fails on different items', () => {
    expect(isEqualMultiSet([1, 2], [3, 4])).toEqual(false);
  });

  it('works on same items', () => {
    expect(isEqualMultiSet([1, 2], [1, 2])).toEqual(true);
  });

  it('fails on deep equality', () => {
    expect(isEqualMultiSet([{ id: 1 }], [{ id: 1 }])).toEqual(false);
  });

  it('respects multi-set semantics', () => {
    expect(isEqualMultiSet([1, 2, 3, 1, 2, 3], [3, 3, 2, 2, 1, 1])).toEqual(
      true
    );
  });

  it('ignores order', () => {
    expect(isEqualMultiSet([1, 2, 3], [3, 2, 1])).toEqual(true);
  });
});
