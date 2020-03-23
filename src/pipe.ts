import { LazyResult } from './_reduceLazy';

/**
 * Perform left-to-right function composition.
 * @param value The initial value.
 * @param operations the list of operations to apply.
 * @signature R.pipe(data, op1, op2, op3)
 * @example
 *    R.pipe(
 *      [1, 2, 3, 4],
 *      R.map(x => x * 2),
 *      arr => [arr[0] + arr[1], arr[2] + arr[3]],
 *    ) // => [6, 14]
 *
 *
 * @data_first
 * @category Function
 */
export function pipe<A, B>(value: A, op1: (input: A) => B): B;
export function pipe<A, B, C>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C
): C;

export function pipe<A, B, C, D>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D
): D;

export function pipe<A, B, C, D, E>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E
): E;

export function pipe<A, B, C, D, E, F>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F
): F;

export function pipe<A, B, C, D, E, F, G>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G
): G;

export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  op1: (input: A) => B,
  op2: (input: B) => C,
  op3: (input: C) => D,
  op4: (input: D) => E,
  op5: (input: E) => F,
  op6: (input: F) => G,
  op7: (input: G) => H
): H;

export function pipe(
  value: any,
  ...operations: Array<(value: any) => any>
): any {
  let ret = value;
  const lazyOps = operations.map(op => {
    const { lazy, lazyArgs } = op as LazyOp;
    if (lazy) {
      const fn: any = lazy(...lazyArgs);
      fn.indexed = lazy.indexed;
      fn.single = lazy.single;
      fn.index = 0;
      fn.items = [];
      return fn;
    }
    return null;
  });
  let opIdx = 0;
  while (opIdx < operations.length) {
    const op = operations[opIdx];
    const lazyOp = lazyOps[opIdx];
    if (!lazyOp) {
      ret = op(ret);
      opIdx++;
      continue;
    }
    const lazySeq: LazyFn[] = [];
    for (let j = opIdx; j < operations.length; j++) {
      if (lazyOps[j]) {
        lazySeq.push(lazyOps[j]);
        if (lazyOps[j].single) {
          break;
        }
      } else {
        break;
      }
    }

    let acc: any[] = [];

    for (let j = 0; j < ret.length; j++) {
      let item = ret[j];
      if (_processItem({ item, acc, lazySeq })) {
        break;
      }
    }
    const lastLazySeq = lazySeq[lazySeq.length - 1];
    if ((lastLazySeq as any).single) {
      ret = acc[0];
    } else {
      ret = acc;
    }
    opIdx += lazySeq.length;
  }
  return ret;
}

type LazyFn = (value: any, index?: number, items?: any) => LazyResult<any>;

type LazyOp = ((input: any) => any) & {
  lazy: ((...args: any[]) => LazyFn) & {
    indexed: boolean;
    single: boolean;
  };
  lazyArgs: any[];
};

function _processItem({
  item,
  lazySeq,
  acc,
}: {
  item: any;
  lazySeq: any[];
  acc: any[];
}): boolean {
  if (lazySeq.length === 0) {
    acc.push(item);
    return false;
  }
  let lazyResult: LazyResult<any> = { done: false, hasNext: false };
  let isDone = false;
  for (let i = 0; i < lazySeq.length; i++) {
    const lazyFn = lazySeq[i];
    const indexed = lazyFn.indexed;
    const index = lazyFn.index;
    const items = lazyFn.items;
    items.push(item);
    lazyResult = indexed ? lazyFn(item, index, items) : lazyFn(item);
    lazyFn.index++;
    if (lazyResult.hasNext) {
      if (lazyResult.hasMany) {
        const nextValues: any[] = lazyResult.next;
        for (const subItem of nextValues) {
          const subResult = _processItem({
            item: subItem,
            acc,
            lazySeq: lazySeq.slice(i + 1),
          });
          if (subResult) {
            return true;
          }
        }
        return false;
      } else {
        item = lazyResult.next;
      }
    }
    if (!lazyResult.hasNext) {
      break;
    }
    // process remaining functions in the pipe
    // but don't process remaining elements in the input array
    if (lazyResult.done) {
      isDone = true;
    }
  }
  if (lazyResult.hasNext) {
    acc.push(item);
  }
  if (isDone) {
    return true;
  }
  return false;
}
