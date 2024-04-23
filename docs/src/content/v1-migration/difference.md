# Runtime

The previous implementation did not have a predictable handling of inputs with
duplicate values (e.g. `[1, 1]`, aka bag/multi-set). This could lead to
confusing results, and did not enable using the function for multi-set use
cases.

In V2 the default implementation now takes into account the duplication factor
of the items in both input arrays.

If your data had no duplications the two implementations are **equivalent**.

If you want to maintain the same runtime behavior for dealing with duplicates
use [`filter`](/docs/#filter) with [`isNot`](/docs/#isNot) and
[`isIncludedIn`](/docs/#isIncludedIn) as the predicate.

## Examples

### No duplicates

```ts
// Was
difference([1, 2, 3], [2]); // => [1, 3]

// Now
difference([1, 2, 3], [2]); // => [1, 3]
```

### Duplicates

```ts
// Was
difference([1, 1, 2, 2], [1]); // => [2, 2]

// Now
difference([1, 1, 2, 2], [1]); // => [1, 2, 2]
```

### Legacy (dataFirst)

```ts
// Was
difference([1, 1, 2, 2], [1]); // => [2, 2]

// Now
filter([1, 1, 2, 2], isNot(isIncludedIn([1]))); // => [2, 2]
```

### Legacy (dataLast)

```ts
// Was
pipe([1, 1, 2, 2], difference([1]));

// Now
pipe([1, 1, 2, 2], filter(isNot(isIncludedIn([1]))));
```
