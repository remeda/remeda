import { isEqualMultiSetBy } from './isEqualMultiSetBy';
import { prop } from './prop';

describe('runtime (prop)', () => {
  it('works on empty inputs', () => {
    expect(isEqualMultiSetBy([], [], prop('id'))).toEqual(true);
  });

  it('fails on one empty input', () => {
    expect(isEqualMultiSetBy([], [{ id: 1 }], prop('id'))).toEqual(false);
    expect(isEqualMultiSetBy([{ id: 1 }], [], prop('id'))).toEqual(false);
  });

  it('fails on different lengths', () => {
    expect(
      isEqualMultiSetBy([{ id: 1 }, { id: 2 }], [{ id: 1 }], prop('id'))
    ).toEqual(false);
    expect(
      isEqualMultiSetBy([{ id: 1 }], [{ id: 1 }, { id: 2 }], prop('id'))
    ).toEqual(false);
  });

  it('fails on different items', () => {
    expect(
      isEqualMultiSetBy(
        [{ id: 1 }, { id: 2 }],
        [{ id: 3 }, { id: 4 }],
        prop('id')
      )
    ).toEqual(false);
  });

  it('works on same items', () => {
    expect(
      isEqualMultiSetBy(
        [{ id: 1 }, { id: 2 }],
        [{ id: 1 }, { id: 2 }],
        prop('id')
      )
    ).toEqual(true);
  });

  it('fails on deep equality', () => {
    expect(
      isEqualMultiSetBy([{ id: { id: 1 } }], [{ id: { id: 1 } }], prop('id'))
    ).toEqual(false);
  });

  it('respects multi-set semantics', () => {
    expect(
      isEqualMultiSetBy(
        [
          { id: 1, subId: 1 },
          { id: 2, subId: 1 },
          { id: 3, subId: 1 },
          { id: 1, subId: 2 },
          { id: 2, subId: 2 },
          { id: 3, subId: 2 },
        ],
        [
          { id: 3, subId: 3 },
          { id: 3, subId: 4 },
          { id: 2, subId: 3 },
          { id: 2, subId: 4 },
          { id: 1, subId: 3 },
          { id: 1, subId: 4 },
        ],
        prop('id')
      )
    ).toEqual(true);
  });

  it('ignores order', () => {
    expect(
      isEqualMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        [{ id: 3 }, { id: 2 }, { id: 1 }],
        prop('id')
      )
    ).toEqual(true);
  });
});
