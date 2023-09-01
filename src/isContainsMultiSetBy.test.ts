import { identity } from './identity';
import { isContainsMultiSetBy } from './isContainsMultiSetBy';
import { prop } from './prop';

describe('runtime (identity)', () => {
  it('works on empty arrays', () => {
    expect(isContainsMultiSetBy([], [], identity)).toBe(true);
  });

  it('trivially works on the empty set', () => {
    expect(isContainsMultiSetBy([1, 2], [], identity)).toBe(true);
  });

  it('trivially fails on empty data', () => {
    expect(isContainsMultiSetBy([], [1, 2], identity)).toBe(false);
  });

  it('works on a single element', () => {
    expect(isContainsMultiSetBy([1], [1], identity)).toBe(true);
  });

  it('fails for different values', () => {
    expect(isContainsMultiSetBy([1], [2], identity)).toBe(false);
  });

  it('works on a single element with multiple copies', () => {
    expect(isContainsMultiSetBy([1, 1], [1], identity)).toBe(true);
  });

  it('works on a single element with multiple copies in the other set', () => {
    expect(isContainsMultiSetBy([1], [1, 1], identity)).toBe(false);
  });

  it('works on a single element with multiple copies in both sets', () => {
    expect(isContainsMultiSetBy([1, 1, 2, 3], [1, 1], identity)).toBe(true);
  });

  it('works for a non-trivial subset', () => {
    expect(isContainsMultiSetBy([1, 2, 3, 4, 5, 6], [3, 5], identity)).toBe(
      true
    );
  });

  it('doesnt care about order', () => {
    expect(isContainsMultiSetBy([1, 2, 3, 4], [4, 1], identity)).toBe(true);
  });
});

describe('runtime (prop)', () => {
  it('works on empty arrays', () => {
    expect(isContainsMultiSetBy([], [], prop('id'))).toBe(true);
  });

  it('trivially works on the empty set', () => {
    expect(isContainsMultiSetBy([{ id: 1 }, { id: 2 }], [], prop('id'))).toBe(
      true
    );
  });

  it('trivially fails on empty data', () => {
    expect(isContainsMultiSetBy([], [{ id: 1 }, { id: 2 }], prop('id'))).toBe(
      false
    );
  });

  it('works on a single element', () => {
    expect(isContainsMultiSetBy([{ id: 1 }], [{ id: 1 }], prop('id'))).toBe(
      true
    );
  });

  it('fails for different values', () => {
    expect(isContainsMultiSetBy([{ id: 1 }], [{ id: 2 }], prop('id'))).toBe(
      false
    );
  });

  it('works on a single element with multiple copies', () => {
    expect(
      isContainsMultiSetBy([{ id: 1 }, { id: 1 }], [{ id: 1 }], prop('id'))
    ).toBe(true);
  });

  it('works on a single element with multiple copies in the other set', () => {
    expect(
      isContainsMultiSetBy([{ id: 1 }], [{ id: 1 }, { id: 1 }], prop('id'))
    ).toBe(false);
  });

  it('works on a single element with multiple copies in both sets', () => {
    expect(
      isContainsMultiSetBy(
        [{ id: 1 }, { id: 1 }, { id: 2 }, { id: 3 }],
        [{ id: 1 }, { id: 1 }],
        prop('id')
      )
    ).toBe(true);
  });

  it('works for a non-trivial subset', () => {
    expect(
      isContainsMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
        [{ id: 3 }, { id: 5 }],
        prop('id')
      )
    ).toBe(true);
  });

  it('doesnt care about order', () => {
    expect(
      isContainsMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        [{ id: 4 }, { id: 1 }],
        prop('id')
      )
    ).toBe(true);
  });
});
