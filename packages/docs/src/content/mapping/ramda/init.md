---
category: List
remeda: dropLast
---

- Equivalent to `dropLast` with an argument of `1`.
- On strings use [`sliceString`](/docs#sliceString) with `0` and `-1` as arguments instead.

### Arrays

```ts
// Ramda
init([1, 2, 3]);

// Remeda
dropLast([1, 2, 3], 1);
```

### Strings

```ts
// Ramda
init("abc");

// Remeda
sliceString("abc", 0, -1);
```
