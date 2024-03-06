import type { OrderRule } from "./_purryOrderRules";
import { purryOrderRules } from "./_purryOrderRules";
import type {
  CompareFunction,
  IterableContainer,
  NonEmptyArray,
} from "./_types";
import { hasAtLeast } from "./hasAtLeast";

type FirstBy<T extends IterableContainer> =
  | T[number]
  | (T extends readonly [unknown, ...ReadonlyArray<unknown>]
      ? never
      : T extends readonly [...ReadonlyArray<unknown>, unknown]
        ? never
        : undefined);

/**
 * Find the first element in the array that adheres to the order rules provided. This is a superset of what a typical `maxBy` or `minBy` function would do as it allows defining "tie-breaker" rules when values are equal, and allows comparing items using any logic. This function is equivalent to calling `R.first(R.sortBy(...))` but runs at *O(n)* instead of *O(nlogn)*.
 *
 * Use `nthBy` if you need an element other that the first, or `takeFirstBy` if you more than just the first element.
 * @param data - An array of items.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The first element by the order criteria, or `undefined` if the array
 * is empty. (The function provides strong typing if the input type assures the
 * array isn't empty).
 * @signature
 *   R.firstBy(...rules)(data);
 * @example
 *   const max = R.pipe([1,2,3], R.firstBy([R.identity, "desc"])); // => 3;
 *   const min = R.pipe([1,2,3], R.firstBy([1,2,3])); // => 1;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = R.pipe(data, R.firstBy([(item) => item.a.length, "desc"])); // => { a: "aaa" };
 *   const minBy = R.pipe(data, R.firstBy((item) => item.a.length)); // => { a: "a" };
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = R.pipe(data, R.firstBy(R.prop('type'), [R.prop('size'), 'desc'])); // => {type: "cat", size: 2}
 * @dataLast
 * @category Array
 */
export function firstBy<T extends IterableContainer>(
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): (data: T) => FirstBy<T>;

/**
 * Find the first element in the array that adheres to the order rules provided. This is a superset of what a typical `maxBy` or `minBy` function would do as it allows defining "tie-breaker" rules when values are equal, and allows comparing items using any logic. This function is equivalent to calling `R.first(R.sortBy(...))` but runs at *O(n)* instead of *O(nlogn)*.
 *
 * Use `nthBy` if you need an element other that the first, or `takeFirstBy` if you more than just the first element.
 * @param data - An array of items.
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns The first element by the order criteria, or `undefined` if the array
 * is empty. (The function provides strong typing if the input type assures the
 * array isn't empty).
 * @signature
 *   R.firstBy(data, ...rules);
 * @example
 *   const max = R.firstBy([1,2,3], [R.identity, "desc"]); // => 3;
 *   const min = R.firstBy([1,2,3], R.identity); // => 1;
 *
 *   const data = [{ a: "a" }, { a: "aa" }, { a: "aaa" }] as const;
 *   const maxBy = R.firstBy(data, [(item) => item.a.length, "desc"]); // => { a: "aaa" };
 *   const minBy = R.firstBy(data, (item) => item.a.length); // => { a: "a" };
 *
 *   const data = [{type: "cat", size: 1}, {type: "cat", size: 2}, {type: "dog", size: 3}] as const;
 *   const multi = R.firstBy(data, R.prop('type'), [R.prop('size'), 'desc']); // => {type: "cat", size: 2}
 * @dataFirst
 * @category Array
 */
export function firstBy<T extends IterableContainer>(
  data: T,
  ...rules: Readonly<NonEmptyArray<OrderRule<T[number]>>>
): FirstBy<T>;

export function firstBy(): unknown {
  return purryOrderRules(firstByImplementation, arguments);
}

function firstByImplementation<T>(
  data: ReadonlyArray<T>,
  compareFn: CompareFunction<T>,
): T | undefined {
  if (!hasAtLeast(data, 2)) {
    // If we have 0 or 1 item we simply return the trivial result.
    return data[0];
  }

  let [currentFirst] = data;

  // Remove the first item, we won't compare it with itself.
  const [, ...rest] = data;
  for (const item of rest) {
    if (compareFn(item, currentFirst) < 0) {
      // item comes before currentFirst in the order.
      currentFirst = item;
    }
  }

  return currentFirst;
}
