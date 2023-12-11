import { dropBy } from './dropBy';
import { identity } from './identity';
import { pipe } from './pipe';

describe('runtime (dataFirst)', () => {
  it('works', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(dropBy(data, 2, identity)).toEqual([5, 6, 4, 3, 7]);
  });

  it('handles empty arrays gracefully', () => {
    const data: Array<number> = [];
    expect(dropBy(data, 1, identity)).toHaveLength(0);
  });

  it('handles negative numbers gracefully', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(dropBy(data, -3, identity)).toHaveLength(data.length);
  });

  it('handles overflowing numbers gracefully', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(dropBy(data, 100, identity)).toHaveLength(0);
  });

  it('clones the input when needed', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = dropBy(data, 0, identity);
    expect(result).not.toBe(data);
    expect(result).toEqual(data);
  });

  it('works with complex compare rules', () => {
    const data = [
      'a',
      'aaa',
      'bbbbb',
      'aa',
      'bb',
      'bbb',
      'bbbb',
      'aaaa',
      'b',
      'aaaaa',
    ];
    expect(dropBy(data, 3, x => x.length, identity)).toEqual([
      'bbbbb',
      'aaa',
      'bbb',
      'bbbb',
      'aaaa',
      'bb',
      'aaaaa',
    ]);
  });
});

describe('runtime (dataLast)', () => {
  it('works', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(
      pipe(
        data,
        dropBy(2, x => x)
      )
    ).toEqual([5, 6, 4, 3, 7]);
  });

  it('handles empty arrays gracefully', () => {
    const data: Array<number> = [];
    expect(
      pipe(
        data,
        dropBy(1, x => x)
      )
    ).toHaveLength(0);
  });

  it('handles negative numbers gracefully', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(
      pipe(
        data,
        dropBy(-3, x => x)
      )
    ).toHaveLength(data.length);
  });

  it('handles overflowing numbers gracefully', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    expect(
      pipe(
        data,
        dropBy(100, x => x)
      )
    ).toHaveLength(0);
  });

  it('clones the data when needed', () => {
    const data = [4, 5, 1, 6, 2, 3, 7];
    const result = pipe(
      data,
      dropBy(0, x => x)
    );
    expect(result).not.toBe(data);
    expect(result).toEqual(data);
  });

  it('works with complex compare rules', () => {
    const data = [
      'a',
      'aaa',
      'bbbbb',
      'aa',
      'bb',
      'bbb',
      'bbbb',
      'aaaa',
      'b',
      'aaaaa',
    ];
    expect(
      pipe(
        data,
        dropBy(
          3,
          x => x.length,
          x => x
        )
      )
    ).toEqual(['bbbbb', 'aaa', 'bbb', 'bbbb', 'aaaa', 'bb', 'aaaaa']);
  });
});
