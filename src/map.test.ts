import { map } from './map';
import { pipe } from './pipe';
import { take } from './take';

describe('data_first', () => {
  it('map', () => {
    const result = map([1, 2, 3], x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });
  it('map.indexed', () => {
    const result = map.indexed([0, 0, 0], (x, i) => i);
    expect(result).toEqual([0, 1, 2]);
  });
});

describe('data_last', () => {
  it('map', () => {
    const result = pipe(
      [1, 2, 3],
      map(x => x * 2)
    );
    expect(result).toEqual([2, 4, 6]);
  });
  it('map.indexed', () => {
    const result = pipe(
      [0, 0, 0],
      map.indexed((x, i) => i)
    );
    expect(result).toEqual([0, 1, 2]);
  });

  it('lazy', () => {
    const count = jest.fn();
    const result = pipe(
      [1, 2, 3],
      map(x => {
        count();
        return x * 10;
      }),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([10, 20]);
  });

  it('lazy indexed', () => {
    const count = jest.fn();
    const result = pipe(
      [0, 0, 0],
      map.indexed((x, i) => {
        count();
        return i;
      }),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([0, 1]);
  });
});
