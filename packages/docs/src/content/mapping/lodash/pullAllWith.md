---
category: Array
remeda: differenceWith
---

- In most cases [`differenceWith`](/docs#differenceWith) is equivalent to
  `pullAllWith`.

- When called without the 3rd comparator parameter the Lodash implementation is
  equivalent to that of [`pullAll`](/migrate/lodash/#pullAll).

- When called without the 2nd values parameter the Lodash implementation
  effectively does **nothing**. Prefer skipping the call, or fallback to using
  an empty array for it.

- `pullAllWith` mutates the input array _in-place_, in Remeda inputs are never
  mutated and a _new_ array is returned instead. To "mutate" the input array
  assign the result back to the input variable.

### Comparing objects by value

```ts
let DATA = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
  { x: 5, y: 6 },
];

// Lodash
_.pullAllWith(DATA, [{ x: 3, y: 4 }], _.isEqual);

// Remeda
DATA = differenceWith(DATA, [{ x: 3, y: 4 }], isDeepEqual);
```

### Missing values parameter

```ts
let DATA = [1, 2, 3];
const values: string[] | undefined = undefined;

// Lodash
_.pullAllWith(DATA, values, _.isEqual);

// Remeda
if (values !== undefined) {
  DATA = differenceWith(DATA, values, isDeepEqual);
}

// Or
DATA = differenceWith(DATA, values ?? [], isDeepEqual);
```
