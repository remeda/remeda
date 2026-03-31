---
category: Util
remeda: range
---

- When calling Lodash's `range` with a single argument, an implicit `start` of
  `0` is used. In Remeda, `start` is always required.
- When `start > end`, Lodash infers a negative step (`-1`). Remeda does not
  infer the step direction — a negative `step` must be provided explicitly, or
  the result is an empty array.
- Lodash special-cases a `step` of `0` by computing the length of the output as
  if `step` were `1`, and filling the output with the `start` value. We throw a
  `RangeError` for this case instead.
- Lodash coerces `NaN` to `0` (e.g., `_.range(NaN, 3)` → `[0, 1, 2]`). Remeda
  does not handle `NaN` inputs and their behavior is unspecified.

### Implicit 0 start

```ts
// Lodash
_.range(5);
_.range(end);

// Remeda
range(0, 5);
range(0, end);
```

### With start

```ts
// Lodash
_.range(1, 5);
_.range(start, end);

// Remeda
range(1, 5);
range(start, end);
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

### Descending range (start > end)

```ts
// Lodash
_.range(5, 1);
_.range(start, end);

// Remeda
range(5, { end: 1, step: -1 });
range(start, { end, step: -1 });
```

### Step of 0

```ts
// Lodash
_.range(1, 5, 0);
_.range(start, end, 0);

// Native
Array.from({ length: 4 }).fill(1);
Array.from({ length: end - start }).fill(start);
```
