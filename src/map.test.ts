import { map } from './map';
import { pipe } from './pipe';
import { take } from './take';
import { filter } from './filter';

describe('data_first', () => {
  it('map', () => {
    const result = map([1, 2, 3] as const, x => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });
  it('map.indexed', () => {
    const result = map.indexed([0, 0, 0] as const, (x, i) => i);
    expect(result).toEqual([0, 1, 2]);
  });
});

describe('data_last', () => {
  it('map', () => {
    const result = pipe(
      [1, 2, 3] as const,
      map(x => x * 2)
    );
    expect(result).toEqual([2, 4, 6]);
  });
  it('map.indexed', () => {
    const result = pipe(
      [0, 0, 0] as const,
      map.indexed((x, i) => i)
    );
    expect(result).toEqual([0, 1, 2]);
  });
});

describe('pipe', () => {
  it('with take', () => {
    const count = jest.fn();
    const result = pipe(
      [1, 2, 3] as const,
      map(x => {
        count();
        return x * 10;
      }),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([10, 20]);
  });

  it('indexed', () => {
    const count = jest.fn();
    const result = pipe(
      [0, 0, 0] as const,
      map.indexed((x, i) => {
        count();
        return i;
      }),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([0, 1]);
  });

  it('indexed: check index and items', () => {
    const indexes1: number[] = [];
    const indexes2: number[] = [];
    const anyItems1: number[][] = [];
    const anyItems2: number[][] = [];
    const result = pipe(
      [1, 2, 3, 4, 5] as const,
      map.indexed((x, i, items) => {
        anyItems1.push([...items]);
        indexes1.push(i);
        return x;
      }),
      filter(x => x % 2 === 1),
      map.indexed((x, i, items) => {
        anyItems2.push([...items]);
        indexes2.push(i);
        return x;
      })
    );
    expect(result).toEqual([1, 3, 5]);
    expect(indexes1).toEqual([0, 1, 2, 3, 4]);
    expect(indexes2).toEqual([0, 1, 2]);
    expect(anyItems1).toEqual([
      [1],
      [1, 2],
      [1, 2, 3],
      [1, 2, 3, 4],
      [1, 2, 3, 4, 5],
    ]);
    expect(anyItems2).toEqual([[1], [1, 3], [1, 3, 5]]);
  });
});
