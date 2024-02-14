import { pipe } from './pipe';
import { mapWithFeedback } from './mapWithFeedback';
import { createLazyInvocationCounter } from '../test/lazy_invocation_counter';
import { take } from './take';

const data = [1, 2, 3, 4, 5] as const;
const expected = [101, 103, 106, 110, 115] as const;

describe('data first', () => {
  it('should return an array of successively accumulated values', () => {
    const result = mapWithFeedback(data, (acc, x) => acc + x, 100);
    expect(result).toEqual(expected);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('indexed should ', () => {
    let i = 0;
    expect(
      mapWithFeedback.indexed(
        data,
        (acc, x, index, items) => {
          expect(index).toBe(i);
          expect(items).toBe(data);
          i++;
          return acc + x;
        },
        100
      )
    ).toEqual(expected);
  });

  it('return type test', () => {
    const result = mapWithFeedback(data, (acc, x) => acc + x, 100);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('return type test indexed', () => {
    const result = mapWithFeedback.indexed(data, (acc, x) => acc + x, 100);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });
});

describe('data last', () => {
  function testReduceFn(acc: any, x: any) {
    return acc + x;
  }

  it('mapWithFeedback', () => {
    expect(pipe(data, mapWithFeedback(testReduceFn, 100))).toEqual(expected);
  });

  it('mapWithFeedback.indexed', () => {
    let i = 0;
    expect(
      pipe(
        data,
        mapWithFeedback.indexed((acc, x, index, items) => {
          expect(index).toBe(i);
          expect(items.length).toBe(i + 1); // The items collection is built up lazily throughout the iteration process.
          i++;
          return acc + x;
        }, 100)
      )
    ).toEqual(expected);
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

  it('return type test', () => {
    const result = pipe(
      data,
      mapWithFeedback((acc, x) => acc + x, 100)
    );
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it('return type test indexed', () => {
    const result = pipe(
      data,
      mapWithFeedback.indexed((acc, x) => acc + x, 100)
    );
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });
});
