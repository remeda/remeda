---
category: Array
remeda: filter
---

_Not provided by Remeda._

- Use [`filter`](/docs#filter) with a custom predicate function instead.

- Lodash's `differenceBy` accepts multiple arrays as separate arguments and
  flattens them, while also taking the last argument as an iteratee function.

### With property iteratee

```ts
// Lodash
differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], "x");

// Remeda
filter([{ x: 2 }, { x: 1 }], (item) => ![1].includes(item.x));
```

### With function iteratee and multiple exclusion arrays

```ts
// Lodash
differenceBy([2.1, 1.2], [2.3], [1.4], Math.floor);

// Remeda - combine exclusion arrays and apply iteratee logic
filter([2.1, 1.2], (item) => ![2, 1].includes(Math.floor(item)));
```
