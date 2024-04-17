# Runtime

The previous implementation did not have a predictable handling of inputs with
duplicate values (e.g. `[1, 1]`, aka bag/multi-set). This could lead to
confusing results, and did not enable using the function for multi-set use
cases.

In V2 the default implementation now takes into account the duplication factor
of the items in both data and operand arrays.

If your data had no duplications the two implementations are **equivalent**.

If you want to maintain the same runtime behavior when dealing with duplicates
use [`filter`](/docs/#filter) with [`isNot`](/docs/#isNot) and
[`isIncludedIn`](/docs/#isIncludedIn) as the predicate (see example below).

## Examples

### No duplicates

```ts
// Was
R.difference([1, 2, 3], [2]); // => [1, 3]

// Now
R.difference([1, 2, 3], [2]); // => [1, 3]
```

### Duplicates

```ts
// Was
R.difference([1, 1, 2, 2], [1]); // => [2, 2]

// Now
R.difference([1, 1, 2, 2], [1]); // => [1, 2, 2]
```

### Legacy (dataFirst)

```ts
// Was
R.difference([1, 1, 2, 2], [1]); // => [2, 2]

// Now
R.filter([1, 1, 2, 2], R.isNot(R.isIncludedIn([1]))); // => [2, 2]
```

### Legacy (dataLast)

```ts
// Was
R.pipe([1, 1, 2, 2], R.difference([1]));

// Now
R.pipe([1, 1, 2, 2], R.filter(R.isNot(R.isIncludedIn([1]))));
```
