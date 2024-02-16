import { LazyResult } from './_reduceLazy';

function lazyToIterFn<A, B>(
  lazy: (value: A) => LazyResult<B>
): (value: A) => IterableIterator<B> {
  return function* (value: A) {
    const lazyResult = lazy(value);
    if (lazyResult.hasNext) {
      if (lazyResult.hasMany) {
        const nextValues = lazyResult.next;
        yield* nextValues;
      } else {
        yield lazyResult.next;
      }
    }
    if (!lazyResult.hasNext || lazyResult.done) {
      return;
    }
  };
}

/**
 * Perform left-to-right function composition on iterable iterators. Each
 * function should take a value and return an iterable iterator, or be a lazy
 * version of a Remeda function. Lazy Remeda functions can be accessed by
 * taking the `.lazy` property, such as `map.lazy`.
 *
 * @param values The initial values.
 * @param operations the list of operations to apply.
 * @signature R.iterPipe(data, op1, op2, op3)
 * @example
 *    Array.from(
 *      R.iterPipe(
 *        [1, 2, 3, 4].values(),
 *        R.map.lazy(x => x * 2),
 *        function* (x) {
 *          yield x / 2;
 *          yield " -> "
 *          yield x;
 *        },
 *      )
 *    ).join("; ") // => "1 -> 2; 2 -> 4; 3 -> 6; 4 -> 8"
 *
 *
 * @dataFirst
 * @category Function
 */
export function iterPipe<A, B>(
  values: IterableIterator<A>,
  op1: (value: A) => LazyResult<B>
): IterableIterator<B>;
// TODO: add other overloads

export function* iterPipe(
  values: IterableIterator<any>,
  ...operations: Array<(value: any) => LazyResult<any>>
) {
  const lazyOperations = operations.map(lazyToIterFn);
  for (const value of values) {
    let rets = [value];
    for (const op of lazyOperations) {
      const newRets: Array<any> = [];
      for (const ret of rets) {
        newRets.push(...op(ret));
      }
      rets = newRets;
    }
    yield* rets;
  }
}
