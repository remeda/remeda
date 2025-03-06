import { identity } from "../identity";
import { toBasicIterable } from "./toBasicIterable";

/**
 * A function that either returns its argument unchanges to wraps it as a plain
 * iterable (with no methods other than `[Symbol.iterator]`).
 *
 * If `itemLimit` is provided, the returned iterable will throw an error if it is
 * asked for more than `itemLimit` items.  This is useful to testing laziness.
 *
 * If `allowMultipleTraversal` is `true`, the returned iterable will allow
 * multiple traversals.  This is useful for testing iterables that can be
 * traversed multiple times.
 *
 * @param data - The data to wrap.
 * @param itemLimit - The maximum number of items to return.
 * @returns The wrapped data.
 */
type WrapperFn = <T>(
  data: Iterable<T>,
  itemLimit?: number,
  allowMultipleTraversal?: boolean,
) => Iterable<T>;

/**
 * The body passed to `describeIterableArg`.
 */
type BodyFn = (wrap: WrapperFn) => void | PromiseLike<void>;

/**
 * A wrapper around `describe` that allows for testing functions with both
 * arrays and generic iterables.
 */
export function describeIterableArg(desc: string, body: BodyFn): void;
export function describeIterableArg(body: BodyFn): void;

export function describeIterableArg(...args: ReadonlyArray<unknown>): void {
  let desc: string;
  let body: BodyFn;
  if (args.length === 2) {
    [desc, body] = args as [string, BodyFn];
    if (/\$dataDesc\b/u.exec(desc) === null) {
      desc += " where type of data is $dataDesc";
    }
  } else {
    [body] = args as [BodyFn];
    desc = "where type of data is $dataDesc";
  }

  describe.each`
    dataDesc       | function
    ${"array"}     | ${identity()}
    ${"generator"} | ${toBasicIterable}
  `(desc, ({ function: wrap }) => body(wrap as WrapperFn));
}
