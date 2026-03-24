---
category: Util
remeda: range
---

Lodash's `range` takes `step` as a third positional parameter. In Remeda, `step`
is provided via an options object as the second parameter.

### Without step

```ts
// Lodash
_.range(1, 5);

// Remeda
range(1, 5);
```

### With step

```ts
// Lodash
_.range(1, 20, 5);

// Remeda
range(1, { end: 20, step: 5 });
```

### Descending

```ts
// Lodash
_.range(20, 1, -5);

// Remeda
range(20, { end: 1, step: -5 });
```
