import { flatMap } from './flatMap';
import { pipe } from './pipe';
import { find } from './find';
import { createCounter } from './_counter';

describe('data_first', () => {
  it('flatMap', () => {
    const result = flatMap([1, 2] as const, x => [x * 2, x * 3]);
    expect(result).toEqual([2, 3, 4, 6]);
  });
});

describe('data_last', () => {
  it('flatMap', () => {
    const result = flatMap((x: number) => [x * 2, x * 3])([1, 2]);
    expect(result).toEqual([2, 3, 4, 6]);
  });

  describe('pipe', () => {
    test('with find', () => {
      const counter1 = createCounter();
      const counter2 = createCounter();
      const result = pipe(
        [10, 20, 30, 40] as const,
        counter1.fn(),
        flatMap(x => [x, x + 1, x + 2, x + 3]),
        counter2.fn(),
        find(x => x === 22)
      );
      expect(counter1.count).toHaveBeenCalledTimes(2);
      expect(counter2.count).toHaveBeenCalledTimes(7);
      expect(result).toEqual(22);
    });
  });
});
