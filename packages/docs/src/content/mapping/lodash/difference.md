---
category: Array
remeda: difference
---

In Remeda `difference` treats the inputs as multisets/bags which respect
**item duplication**, whereas in Lodash all matching values are filtered out.
This only matters for cases where _both_ arrays might have duplicate values.

Lodash's `difference` accepts multiple arrays as separate arguments and flattens
them, while Remeda's `difference` takes exactly two arrays.

### Single exclusion array (no duplicates)

```ts
// Lodash
difference([2, 1], [2, 3]);

// Remeda
difference([2, 1], [2, 3]);
```

### Multiple exclusion arrays

```ts
// Lodash
difference([1, 2, 3], [1], [2]);

// Remeda
difference([1, 2, 3], [1, 2]); // Combine exclusion arrays
```

### With duplicates

```ts
// Lodash
difference([1, 1, 2, 2], [1]);

// Remeda
filter([1, 1, 2, 2], isNot(isIncludedIn([1])));
```
