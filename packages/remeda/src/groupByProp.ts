import type {
  AllUnionFields,
  And,
  ConditionalKeys,
  IsNever,
  Merge,
} from "type-fest";
import type { ArrayRequiredPrefix } from "./internal/types/ArrayRequiredPrefix";
import type { BoundedPartial } from "./internal/types/BoundedPartial";
import type { FilteredArray } from "./internal/types/FilteredArray";
import type { IterableContainer } from "./internal/types/IterableContainer";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

type GroupByProp<T extends IterableContainer, Prop extends GroupableProps<T>> =
  // We distribute the union in order to support unions of tuple types.
  T extends unknown
    ? FixEmptyObject<
        EnsureValuesAreNonEmpty<{
          // For each possible value of the prop we filter the input tuple with
          // the prop assigned to the value, e.g. `{ type: "cat" }`
          [Value in AllPropValues<T, Prop>]: FilteredArray<
            T,
            Record<Prop, Value>
          >;
        }>
      >
    : never;

// We can only group by props that only have values that could be used to key
// an object (i.e. PropertyKey), or if they are undefined (which would filter
// them out of the grouping).
type GroupableProps<T extends IterableContainer> = ConditionalKeys<
  ItemsSuperObject<T>,
  PropertyKey | undefined
>;

// The union of all possible values that the prop could have within the tuple.
type AllPropValues<
  T extends IterableContainer,
  Prop extends GroupableProps<T>,
> = Extract<ItemsSuperObject<T>[Prop], PropertyKey>;

// Creates a singular object type that all items in the tuple would extend. This
// provides us a way to check, for each prop, what are all values it would
// have within the tuple. We use this to map which props are candidates for
// grouping, and when a prop is selected, the full list of values that would
// exist in the output. For example:
// `{ a: number, b: "cat", c: string } | { b: "dog", c: Date }` is groupable
// by 'a' and 'b', but not 'c', and when selecting by 'b', the output would
// have a prop for "cat" and a prop for "dog".
type ItemsSuperObject<T extends IterableContainer> = AllUnionFields<
  // If the input tuple contains optional elements they would add `undefined` to
  // T[number] (and could technically show up in the array itself). Because
  // undefined breaks AllUnionFields we need to remove it from the union. This
  // is OK because we handle this in the implementation too.
  Exclude<T[number], undefined>
>;

// When the input array is empty the constructed result type would be `{}`
// because our mapped type would never run; but this doesn't represent the
// semantics of the return value for that case, because it effectively means
// "any object" and not "empty object". This can happen in 2 situations:
// A union of tuples where one of the tuples doesn't have any item with the
// groupable prop, or when the groupable prop has a value of `undefined` for
// all items. The former is extra problematic because it would add `| {}` to the
// result type which effectively cancels out all other parts of the union.
type FixEmptyObject<T> =
  IsNever<keyof T> extends true ? Record<PropertyKey, never> : T;

// Group by can never return an empty tuple but our filtered arrays might not
// represent that. We need to reshape the tuples so that they always have at
// least one item in them.
type EnsureValuesAreNonEmpty<T extends Record<PropertyKey, IterableContainer>> =
  Merge<
    T,
    BoundedPartial<{
      [P in keyof T as IsPossiblyEmpty<T[P]> extends true
        ? P
        : never]: ArrayRequiredPrefix<T[P], 1>;
    }>
  >;

// A tuple is possibly empty if non of the fixed parts have any elements in
// them. This means the tuple is made of optional elements and/or a rest
// element.
type IsPossiblyEmpty<T extends IterableContainer> = And<
  IsEmpty<TupleParts<T>["required"]>,
  IsEmpty<TupleParts<T>["suffix"]>
>;

type IsEmpty<T> = T extends readonly [] ? true : false;

/**
 * Groups the elements of an array of objects based on the values of a
 * specified property of those objects. The result would contain a property for
 * each unique value of the specific property, with it's value being the input
 * array filtered to only items that have that property set to that value.
 * For any object where the property is missing, or if it's value is
 * `undefined` the item would be filtered out.
 *
 * The grouping property is enforced at the type level to exist in at least one
 * item and to never have a value that cannot be used as an object key (e.g. it
 * must be `PropertyKey | undefined`).
 *
 * The resulting arrays are filtered with the prop and it's value as a
 * type-guard, effectively narrowing the items in each output arrays. This
 * means that when the grouping property is the discriminator of a
 * discriminated union type each output array would contain just the subtype for
 * that value.
 *
 * If you need more control over the grouping you should use `groupBy` instead.
 *
 * @param data - The items to group.
 * @param prop - The property name to group by.
 * @signature
 *    R.groupByProp(data, prop)
 * @example
 *    const result = R.groupByProp(
 *      //  ^? { cat: [{ a: 'cat' }], dog: [{ a: 'dog' }] }
 *      [{ a: 'cat' }, { a: 'dog' }] as const,
 *      'a',
 *    );
 * @dataFirst
 * @category Array
 */
export function groupByProp<
  T extends IterableContainer,
  Prop extends GroupableProps<T>,
>(data: T, prop: Prop): GroupByProp<T, Prop>;

/**
 * Groups the elements of an array of objects based on the values of a
 * specified property of those objects. The result would contain a property for
 * each unique value of the specific property, with it's value being the input
 * array filtered to only items that have that property set to that value.
 * For any object where the property is missing, or if it's value is
 * `undefined` the item would be filtered out.
 *
 * The grouping property is enforced at the type level to exist in at least one
 * item and to never have a value that cannot be used as an object key (e.g. it
 * must be `PropertyKey | undefined`).
 *
 * The resulting arrays are filtered with the prop and it's value as a
 * type-guard, effectively narrowing the items in each output arrays. This
 * means that when the grouping property is the discriminator of a
 * discriminated union type each output array would contain just the subtype for
 * that value.
 *
 * If you need more control over the grouping you should use `groupBy` instead.
 *
 * @param prop - The property name to group by.
 * @signature
 *    R.groupByProp(prop)(data);
 * @example
 *    const result = R.pipe(
 *      //  ^? { cat: [{ a: 'cat' }], dog: [{ a: 'dog' }] }
 *      [{ a: 'cat' }, { a: 'dog' }] as const,
 *      R.groupByProp('a'),
 *    );
 * @dataLast
 * @category Array
 */
export function groupByProp<
  T extends IterableContainer,
  Prop extends GroupableProps<T>,
>(prop: Prop): (data: T) => GroupByProp<T, Prop>;

export function groupByProp(...args: ReadonlyArray<unknown>): unknown {
  return purry(groupByPropImplementation, args);
}

function groupByPropImplementation<
  T extends IterableContainer,
  Prop extends GroupableProps<T>,
>(data: T, prop: Prop): GroupByProp<T, Prop> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Using Object.create(null) allows us to remove everything from the prototype chain, leaving it as a pure object that only has the keys *we* add to it. This prevents issues like the one raised in #1046
  const output: BoundedPartial<
    Record<AllPropValues<T, Prop>, Array<T[number]>>
  > = Object.create(null);

  for (const item of data) {
    const key = item?.[prop];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --  `key` should be typed as `AllPropValues<T, Prop> | undefined`, but isn't because `item` is not inferred as `T[number]` because of a limitation in how TypeScript infers types derived from type-params.
    if (key !== undefined) {
      // Once the prototype chain is fixed, it is safe to access the prop
      // directly without needing to check existence or types.
      const items = output[key];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Similarly to above, once `keys` isn't inferred correctly all other types that would be derived from it fail to be inferred correctly too, including `items` which should be `Array<T[number]> | undefined`.
      if (items === undefined) {
        // It is more performant to create a 1-element array over creating an
        // empty array and falling through to a unified the push. It is also
        // more performant to mutate the existing object over using spread to
        // continually create new objects on every unique key.
        // @ts-expect-error [ts7053] -- For the same reasons as mentioned above, TypeScript isn't inferring `key` correctly, and therefore is erroring when trying to access the output object using it.
        output[key] = [item];
      } else {
        // It is more performant to add the items to an existing array instead
        // of creating a new array via spreading every time we add an item to
        // it (e.g., `[...current, item]`).
        // @ts-expect-error [ts2339] -- Similarly to the above, `items` is not being inferred correctly because of the issue with `key` so TypeScript can't ensure that `push` exists on it.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- And once the type for `items` isn't good, lint can't ensure correctness either.
        items.push(item);
      }
    }
  }

  // Set the prototype as if we initialized our object as a normal object (e.g.
  // `{}`). Without this none of the built-in object methods like `toString`
  // would work on this object and it would act differently than expected.
  Object.setPrototypeOf(output, Object.prototype);

  // @ts-expect-error [ts2322] -- This is fine! We use a broader type for output while we build it because it more accurately represents the shape of the object *while it is being built*. TypeScript can't tell that we finished building the object so can't ensure that output matches the expected output at this point.
  return output;
}
