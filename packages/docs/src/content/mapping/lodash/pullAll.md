---
category: Array
remeda: difference
---

_Not provided by Remeda._

- For cases where the input data is **unique** (no duplicate values) [`difference`](/docs#difference)
  could be used as a replacement.

- For the general case, when the input might contain _duplicates_, use the
  composition of [`filter`](/docs#filter), [`isNot`](/docs#isNot), and [`isIncludedIn`](/docs#isIncludedIn)
  instead.

- `pullAll` mutates the input array _in-place_, in Remeda inputs are never mutated
  and a _new_ array is returned instead. To "mutate" the input array assign the
  result back to the input variable.

### No duplicates

```ts
let DATA = [1, 2, 3, 4, 5, 6];

// Lodash
_.pullAll(DATA, [1, 3, 5]);

// Remeda
DATA = difference(DATA, [1, 3, 5]);
```

### With duplicates

```ts
let DATA = [2, 1, 2, 3];

// Lodash
_.pullAll(DATA, [1, 2]);

// Remeda
DATA = filter(DATA, isNot(isIncludedIn([1, 2])));
```
