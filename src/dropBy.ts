import { heapSiftDown, heapify } from './_heap';
import {
  CompareFunction,
  OrderRule,
  purryOrderRules,
} from './_purryOrderRules';
import { NonEmptyArray } from './_types';

export function dropBy<T>(
  data: ReadonlyArray<T>,
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): Array<T>;

export function dropBy<T>(
  n: number,
  ...rules: Readonly<NonEmptyArray<OrderRule<T>>>
): (data: ReadonlyArray<T>) => Array<T>;

export function dropBy(
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

  return purryOrderRules((...args) => dropByImplementation(...args, n), args);
}

function dropByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
  n: number
): Array<T> {
  if (n >= data.length) {
    return [];
  }

  if (n <= 0) {
    return [...data];
  }

  const heap = data.slice(0, n);
  heapify(heap, compareFn);

  const out: Array<T> = [];

  const rest = data.slice(n);
  for (const item of rest) {
    if (compareFn(item, heap[0]) < 0) {
      // Every time we change the head of the heap it means the existing head
      // would not be dropped, so we add it to the output.
      out.push(heap[0]);
      heap[0] = item;
      heapSiftDown(heap, 0, compareFn);
    } else {
      out.push(item);
    }
  }

  return out;
}
