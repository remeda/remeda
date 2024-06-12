---
category: Array
remeda: difference
---

In Remeda `difference` treats the inputs as multisets/bags which respect
**item duplication**, whereas in Lodash all matching values are filtered out.
This only matters for cases where _both_ arrays might have duplicate values. Use
[`filter`](/docs#filter), [`isNot`](/docs#isNot), and
[`isIncludedIn`](/docs#isIncludedIn) instead to compose the same logic.

### No duplicates

```ts
// Lodash
difference([2, 1], [2, 3]);

// Remeda
difference([2, 1], [2, 3]);
```

### With duplicates

```ts
// Lodash
difference([1, 1, 2, 2], [1]);

// Remeda
filter([1, 1, 2, 2], isNot(isIncludedIn([1])));
```
