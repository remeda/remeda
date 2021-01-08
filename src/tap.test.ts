import { tap } from './tap';
import { pipe } from './pipe';
import { take } from './take';

const mockFn = jest.fn(() => void 0);

describe('data_first', () => {
  it('tap', () => {
    expect(tap(1, mockFn)).toBe(1);
    expect(mockFn).toBeCalledWith(1);
  });
});

describe('data_last', () => {
  it('tap', () => {
    expect(pipe(1, tap(mockFn))).toBe(1);
    expect(mockFn).toBeCalledWith(1);
  });

  it('tap lazily', () => {
    expect(pipe([1, 2, 3, 4, 5], tap(mockFn), take(3))).toEqual([1, 2, 3]);
    expect(mockFn).toBeCalledWith(1);
    expect(mockFn).toBeCalledWith(2);
    expect(mockFn).toBeCalledWith(3);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});
