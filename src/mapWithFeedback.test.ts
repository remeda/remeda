import { pipe } from './pipe';
import { mapWithFeedback } from './mapWithFeedback';
import { createLazyInvocationCounter } from '../test/lazy_invocation_counter';
import { take } from './take';

const data = [1, 2, 3, 4, 5] as const;
const expected = [101, 103, 106, 110, 115];

describe('data first', () => {
  it('should return an array of successively accumulated values', () => {
    const result = mapWithFeedback(data, (acc, x) => acc + x, 100);
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('indexed should track index and provide entire items array', () => {
    let i = 0;
    expect(
      mapWithFeedback.indexed(
        data,
        (acc, x, index, items) => {
          expect(index).toBe(i);
          expect(items).toEqual(data);
          i++;
          return acc + x;
        },
        100
      )
    ).toEqual(expected);
  });

  it('indexed the items array passed to the callback should be an array type containing the union type of all of the members in the original array', () => {
    mapWithFeedback.indexed(
      data,
      (acc, x, _index, items) => {
        expectTypeOf(items).toEqualTypeOf<Array<(typeof data)[number]>>;
        return acc + x;
      },
      100
    );
  });

  it('should return an Array<accumulator type>', () => {
    const result = mapWithFeedback(data, (acc, x) => acc + x, 100);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('indexed should return an Array<accumulator type>', () => {
    const result = mapWithFeedback.indexed(data, (acc, x) => acc + x, 100);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });
});

describe('data last', () => {
  it('should return an array of successively accumulated values', () => {
    expect(
      pipe(
        data,
        mapWithFeedback((acc, x) => acc + x, 100)
      )
    ).toEqual(expected);
  });

  it('indexed should track index and progressively include elements from the original array in the items array during each iteration, forming a growing window', () => {
    const lazyItems: Array<Array<number>> = [];
    const indices: Array<number> = [];
    pipe(
      data,
      mapWithFeedback.indexed((acc, x, index, items) => {
        indices.push(index);
        lazyItems.push([...items]);
        return acc + x;
      }, 100)
    );
    expect(indices).toEqual([0, 1, 2, 3, 4]);
    expect(lazyItems).toEqual([
      [1],
      [1, 2],
      [1, 2, 3],
      [1, 2, 3, 4],
      [1, 2, 3, 4, 5],
    ]);
  });

  it('evaluates lazily', () => {
    const counter = createLazyInvocationCounter();
    pipe(
      data,
      counter.fn(),
      mapWithFeedback((acc, x) => acc + x, 100),
      take(2)
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
  });

  it('indexed evaluates lazily', () => {
    const counter = createLazyInvocationCounter();
    pipe(
      data,
      counter.fn(),
      mapWithFeedback.indexed((acc, x) => acc + x, 100),
      take(2)
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
  });

  it('should return an Array<accumulator type>', () => {
    const result = pipe(
      data,
      mapWithFeedback((acc, x) => acc + x, 100)
    );
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('indexed should return an Array<accumulator type>', () => {
    const result = pipe(
      data,
      mapWithFeedback.indexed((acc, x) => acc + x, 100)
    );
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('indexed the items array passed to the callback should be an array type containing the union type of all of the members in the original array', () => {
    mapWithFeedback.indexed(
      data,
      (acc, x, _index, items) => {
        expectTypeOf(items).toEqualTypeOf<Array<(typeof data)[number]>>;
        return acc + x;
      },
      100
    );
  });
});
