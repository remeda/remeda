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

- `pull` mutates the input array _in-place_, in Remeda inputs are never mutated
  and a _new_ array is returned instead. To "mutate" the input array assign the
  result back to the input variable.

- Notice that `pull` takes a variadic array of items to remove. In Remeda all
  functions take an explicit array instead. You will need to wrap your items in
  an array when migrating.

### No duplicates

```ts
let DATA = ["a", "b", "c", "d"];

// Lodash
_.pull(DATA, "a", "c");

// Remeda
DATA = difference(DATA, ["a", "c"]);
```

### With duplicates

```ts
let DATA = ["a", "b", "c", "a", "b", "c"];

// Lodash
_.pull(DATA, "a", "c");

// Remeda
DATA = filter(DATA, isNot(isIncludedIn(["a", "c"])));
```
