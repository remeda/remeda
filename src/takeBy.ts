import { heapSiftDown, heapify } from './_heap';
import {
  CompareFunction,
  OrderRule,
  purryOrderRules,
} from './_purryOrderRules';
import { NonEmptyArray } from './_types';

export function takeBy<T>(
  data: ReadonlyArray<T>,
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): Array<T>;

export function takeBy<T>(
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): (data: ReadonlyArray<T>) => Array<T>;

export function takeBy(
  first: unknown,
  second: unknown,
  ...rest: ReadonlyArray<unknown>
): unknown {
  // We need to pull the `n` argument out to make it work with purryOrderRules.
  let n: number;
  let args;
  if (typeof first === 'number') {
    // dataLast!
    n = first;
    args = [second, ...rest];
  } else if (typeof second === 'number') {
    // dataFirst!
    n = second;
    args = [first, ...rest];
  } else {
    throw new Error("Couldn't find a number argument in the called arguments");
  }

  return purryOrderRules((...args) => takeByImplementation(...args, n), args);
}

function takeByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  n: number
): Array<T> {
  if (n <= 0 || data.length === 0) {
    return [];
  }

  if (n >= data.length) {
    return [...data];
  }

  const heap = data.slice(0, n);
  heapify(heap, compareFn);

  const rest = data.slice(n);
  for (const item of rest) {
    if (compareFn(item, heap[0]) < 0) {
      heap[0] = item;
      heapSiftDown(heap, 0, compareFn);
    }
  }

  return heap;
}
