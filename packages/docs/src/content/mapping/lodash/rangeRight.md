---
category: Util
remeda: range
---

- In Lodash `rangeRight` has an **exclusive** `start` and an inclusive `end`,
  unlike Remeda's `range`. To match the same values the ends of the range need
  to be adjusted by `-1`.
- When Lodash's `rangeRight` accepts a single argument it treats it as the
  `start` value and uses `0` for the `end`. In Remeda both `start` and `end` are
  required.
- Lodash's `rangeRight` generates a sequence in descending order. Use `range`
  with a negative step, adjusting start and end to match the same values.

### Implicit 0 start

```ts
// Lodash
_.rangeRight(4);
_.rangeRight(start);

// Remeda
range(start - 1, { end: -1, step: -1 });
```

### With start

```ts
// Lodash
_.rangeRight(10, 20);
_.rangeRight(start, end);

// Remeda
range(19, { end: 9, step: -1 });
range(start - 1, { end: end - 1, step: -1 });
```

### With step

```ts
// Lodash
_.rangeRight(0, 20, 5);
_.rangeRight(start, end, step);

// Remeda
range(15, { end: -5, step: -5 });
range(start - 1, { end: end - 1, step: -step });
```
