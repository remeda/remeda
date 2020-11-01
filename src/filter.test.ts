import { pipe } from './pipe';
import { filter } from './filter';
import { createCounter } from './_counter';

function assertType<T>(data: T): T {
  return data;
}

function isNumber<T>(data: T): data is Extract<T, number> {
  return typeof data === 'number';
} // TODO Refactor to remeda function

describe('data_first', () => {
  it('filter', () => {
    const result = filter([1, 2, 3] as const, x => x % 2 === 1);
    assertType<(1 | 2 | 3)[]>(result); // Type test
    expect(result).toEqual([1, 3]);
  });

  it('data_first with typescript guard', () => {
    const result = filter([1, 2, 3, 'abc', true] as const, isNumber);
    assertType<(1 | 2 | 3)[]>(result); // Type test
    expect(result).toEqual([1, 2, 3]);
  });

  it('filter.indexed', () => {
    const result = filter.indexed(
      [1, 2, 3] as const,
      (x, i) => x % 2 === 1 && i !== 1
    );
    assertType<(1 | 2 | 3)[]>(result); // Type test
    expect(result).toEqual([1, 3]);
  });

  it('filter.indexed with typescript guard', () => {
    const result = filter.indexed(
      [1, 2, 3, false, 'text'] as const, // Type (1 | 2 | 3 | false | "text")[]
      isNumber
    );
    assertType<(1 | 2 | 3)[]>(result); // Type test (1 | 2 | 3)[]
    expect(result).toEqual([1, 2, 3]);
  });
});

describe('data_last', () => {
  it('filter', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3] as const,
      filter(x => x % 2 === 1),
      counter.fn()
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    assertType<(1 | 2 | 3)[]>(result); // Type test (1 | 2 | 3)[]
    expect(result).toEqual([1, 3]);
  });

  it('filter', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3] as const,
      filter(x => x % 2 === 1),
      counter.fn()
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    assertType<(1 | 2 | 3)[]>(result); // Type test (1 | 2 | 3)[]
    expect(result).toEqual([1, 3]);
  });

  it('filter with typescript guard', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3, false, 'text'] as const, // Type (1 | 2 | 3 | false | "text")[]
      filter(isNumber),
      counter.fn()
    );
    expect(counter.count).toHaveBeenCalledTimes(3);
    assertType<(1 | 2 | 3)[]>(result); // Type test (1 | 2 | 3)[]
    expect(result).toEqual([1, 2, 3]);
  });
  it('filter.indexed with typescript guard', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3, false, 'text'] as const, // Type (1 | 2 | 3 | false | "text")[]
      filter.indexed(isNumber),
      counter.fn()
    );
    assertType<(1 | 2 | 3)[]>(result); // Type test (1 | 2 | 3)[]
    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toEqual([1, 2, 3]);
  });
  it('filter.indexed', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3] as const,
      filter.indexed((x, i) => x % 2 === 1 && i !== 1),
      counter.fn()
    );
    assertType<(1 | 2 | 3)[]>(result); // Type test (1 | 2 | 3)[]
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 3]);
  });
});
