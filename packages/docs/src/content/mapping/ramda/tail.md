---
category: List
remeda: drop
---

- Equivalent to `drop` with an argument of `1`.
- On strings use [`sliceString`](/docs#sliceString) instead.

### Arrays

```ts
// Ramda
tail([1, 2, 3]);

// Remeda
drop([1, 2, 3], 1);
```

### Strings

```ts
// Ramda
tail("abc");

// Remeda
sliceString("abc", 1);
```
