---
category: Array
remeda: differenceWith
---

- In most cases [`differenceWith`](/docs#differenceWith) is equivalent to
  Lodash's `differenceWith`.

- Lodash's `differenceWith` accepts multiple arrays as separate arguments and
  flattens them, while Remeda's `differenceWith` takes exactly two arrays.

### Single exclusion array

```ts
// Lodash
differenceWith(
  [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
  ],
  [{ x: 1, y: 2 }],
  _.isEqual,
);

// Remeda
differenceWith(
  [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
  ],
  [{ x: 1, y: 2 }],
  isDeepEqual,
);
```

### Multiple exclusion arrays

```ts
// Lodash
differenceWith([{ x: 1 }, { x: 2 }], [{ x: 1 }], [{ x: 2 }], _.isEqual);

// Remeda - combine exclusion arrays
differenceWith([{ x: 1 }, { x: 2 }], [{ x: 1 }, { x: 2 }], isDeepEqual);
```
