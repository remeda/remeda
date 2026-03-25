---
category: Util
remeda: range
---

- Lodash's `rangeRight` has the same inclusive `start` and exclusive `end` as
  `range`, but returns values in descending order. In Remeda, use `range` with a
  negative `step`, swapping `start` and `end` and shifting each by one `step` to
  preserve the same inclusive/exclusive semantics.
- When Lodash's `rangeRight` accepts a single argument it treats it as the `end`
  value and uses `0` for the `start`. In Remeda both `start` and `end` are
  required.

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
range(end - 1, { end: start - 1, step: -1 });
```

### With step

```ts
// Lodash
_.rangeRight(0, 20, 5);
_.rangeRight(start, end, step);

// Remeda
range(15, { end: -5, step: -5 });
range(end - step, { end: start - step, step: -step });
```
