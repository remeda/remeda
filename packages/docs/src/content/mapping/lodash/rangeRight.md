---
category: Util
remeda: range
---

- Lodash's `rangeRight` returns the same values as `range`, but reveres their
  order. To achieve the same output in Remeda, use `range` with a negative
  `step`, swapping `start` and `end`.
- Because `start` is **included** in the output and `end` is **excluded**, the
  values need to be adjusted by (up to) an additional `step` so that the ranges
  match!
- When Lodash's `rangeRight` accepts a single argument it treats it as the `end`
  value and uses `0` for the `start`. In Remeda both `start` and `end` are
  required.

### Implicit 0 start

```ts
// Lodash
_.rangeRight(5);
_.rangeRight(start);

// Remeda
range(4, { end: -1, step: -1 });
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
