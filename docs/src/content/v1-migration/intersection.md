# Typing

The typing for the `other` operand was softened so that it could accept any
value. This allows the returned type to be narrowed to items that are in the
intersection (type-wise) of the two types.

# Runtime

The previous implementation did not have a predictable handling of inputs with
duplicate values (e.g. `[1, 1]`, aka bag/multi-set). This could lead to
confusing results, and did not enable using the function for multi-set use
cases.

In V2 the default implementation now takes into account the duplication factor
of the items in both input arrays.

If your data had no duplications the two implementations are **equivalent**.

If you want to maintain the same runtime behavior for dealing with duplicates
use [`filter`](/docs/#filter) with [`isIncludedIn`](/docs/#isIncludedIn) as the
predicate.

## Examples

### Narrowed result

```ts
const DATA1 = [] as (string | number)[];
const DATA2 = [] as (number | boolean)[];

// In the current implementation typescript would error for DATA2 because it
// isn't the same type as DATA1, this would no longer error.
const intersected = intersection(DATA1, DATA2);
//    ^? number[];
```

### No duplicates

```ts
// Was
intersection([1, 2, 3], [2]); // => [2]

// Now
intersection([1, 2, 3], [2]); // => [2]
```

### Duplicates

```ts
// Was
intersection([1, 1, 2, 2], [1]); // => [1, 1]

// Now
intersection([1, 1, 2, 2], [1]); // => [1]
```

### Legacy (dataFirst)

```ts
// Was
intersection([1, 1, 2, 2], [1]); // => [1, 1]

// Now
filter([1, 1, 2, 2], isIncludedIn([1])); // => [1, 1]
```

### Legacy (dataLast)

```ts
// Was
pipe([1, 1, 2, 2], intersection([1]));

// Now
pipe([1, 1, 2, 2], filter(isIncludedIn([1])));
```
