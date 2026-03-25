---
category: Util
remeda: range
---

- When calling Lodash's `range` with a single argument, an implicit `start` of
  `0` is used. In Remeda, `start` is always required.
- Lodash also takes `step` as a third positional parameter; in Remeda, `step` is
  provided via an options object.

### Implicit 0 start

```ts
// Lodash
_.range(5);
_.range(end);

// Remeda
range(0, 5);
range(0, { end: 5, step: 1 });
range(0, end);
range(0, { end, step: 1 });
```

### With start

```ts
// Lodash
_.range(1, 5);
_.range(start, end);

// Remeda
range(1, 5);
range(1, { end: 5, step: 1 });
range(start, end);
range(start, { end, step: 1 });
```

### With step

```ts
// Lodash
_.range(1, 20, 5);
_.range(start, end, step);

// Remeda
range(1, { end: 20, step: 5 });
range(start, { end, step });
```
