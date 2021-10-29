import { tap } from './tap';
import { pipe } from './pipe';

describe('data_first', () => {
  it('tap', () => {
    const mockFn = jest.fn(() => void 0);
    expect(tap(1, mockFn)).toBe(1);
    expect(mockFn).toBeCalledWith(1);
  });
});

describe('data_last', () => {
  it('tap', () => {
    const mockFn = jest.fn(() => void 0);
    expect(pipe(1, tap(mockFn))).toBe(1);
    expect(mockFn).toBeCalledWith(1);
  });
});
