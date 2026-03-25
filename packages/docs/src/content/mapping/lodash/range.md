---
category: Util
remeda: range
---

- Lodash's `range` accepts a single argument (`range(end)`) where `start`
  defaults to `0`. In Remeda, `start` is always required.
- Lodash also takes `step` as a third positional parameter; in Remeda, `step` is
  provided via an options object.

### Implicit 0 start

```ts
// Lodash
_.range(5);
_.range(start);

// Remeda
range(0, 5);
range(0, { end: 5, step: 1 });
range(0, start);
range(0, { end: start, step: 1 });
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
