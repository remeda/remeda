import { isContainsMultiSet } from './isContainsMultiSet';

describe('runtime', () => {
  it('works on empty arrays', () => {
    expect(isContainsMultiSet([], [])).toBe(true);
  });

  it('trivially works on the empty set', () => {
    expect(isContainsMultiSet([1, 2], [])).toBe(true);
  });

  it('trivially fails on empty data', () => {
    expect(isContainsMultiSet([], [1, 2])).toBe(false);
  });

  it('works on a single element', () => {
    expect(isContainsMultiSet([1], [1])).toBe(true);
  });

  it('fails for different values', () => {
    expect(isContainsMultiSet([1], [2])).toBe(false);
  });

  it('works on a single element with multiple copies', () => {
    expect(isContainsMultiSet([1, 1], [1])).toBe(true);
  });

  it('works on a single element with multiple copies in the other set', () => {
    expect(isContainsMultiSet([1], [1, 1])).toBe(false);
  });

  it('works on a single element with multiple copies in both sets', () => {
    expect(isContainsMultiSet([1, 1, 2, 3], [1, 1])).toBe(true);
  });

  it('works for a non-trivial subset', () => {
    expect(isContainsMultiSet([1, 2, 3, 4, 5, 6], [3, 5])).toBe(true);
  });

  it('doesnt care about order', () => {
    expect(isContainsMultiSet([1, 2, 3, 4], [4, 1])).toBe(true);
  });
});
