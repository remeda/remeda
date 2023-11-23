import { filter } from './filter';
import { map } from './map';
import { pipe } from './pipe';
import { tap } from './tap';

const value = [1] as const;

describe('data first', () => {
  it('should call function with input value', () => {
    const fn = vi.fn();
    tap(value, fn);
    expect(fn).toBeCalledWith(value);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('should return input value', () => {
    expect(tap(value, v => v.length)).toBe(value);
  });
});

describe('data last', () => {
  it('should call function with input value', () => {
    const fn = vi.fn();
    pipe(value, tap(fn));
    expect(fn).toBeCalledWith(value);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('should return input value', () => {
    expect(
      pipe(
        value,
        tap(v => v.length)
      )
    ).toBe(value);
  });

  it('should work in the middle of pipe sequence', () => {
    expect(
      pipe(
        [-1, 2],
        filter(n => n > 0),
        tap(arr => expect(arr).toStrictEqual([2])),
        map(n => n * 2)
      )
    ).toStrictEqual([4]);
  });
});
