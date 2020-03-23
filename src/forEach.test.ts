import { forEach } from './forEach';
import { pipe } from './pipe';
import { take } from './take';

const array = [1, 2, 3] as const;

describe('data_first', () => {
  it('forEach', () => {
    const cb = jest.fn();
    const result = forEach(array, cb);
    expect(cb.mock.calls).toEqual([[1], [2], [3]]);
    expect(result).toEqual(array);
  });
  it('forEach.indexed', () => {
    const cb = jest.fn();
    const result = forEach.indexed(array, cb);
    expect(cb.mock.calls).toEqual([
      [1, 0, array],
      [2, 1, array],
      [3, 2, array],
    ]);
    expect(result).toEqual(array);
  });
});

describe('data_last', () => {
  it('forEach', () => {
    const cb = jest.fn();
    const result = pipe(array, forEach(cb));
    expect(cb.mock.calls).toEqual([[1], [2], [3]]);
    expect(result).toEqual(array);
  });
  it('forEach.indexed', () => {
    const cb = jest.fn();
    const result = pipe(array, forEach.indexed(cb));
    expect(cb.mock.calls).toEqual([
      [1, 0, array],
      [2, 1, array],
      [3, 2, array],
    ]);
    expect(result).toEqual(array);
  });
});

describe('pipe', () => {
  it('with take', () => {
    const count = jest.fn();
    const result = pipe(
      [1, 2, 3],
      forEach(x => {
        count();
      }),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 2]);
  });

  it('indexed', () => {
    const count = jest.fn();
    const result = pipe(
      [1, 2, 3],
      forEach.indexed(() => {
        count();
      }),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 2]);
  });
});
