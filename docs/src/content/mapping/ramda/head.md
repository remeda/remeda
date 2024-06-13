---
category: List
remeda: first
---

- For strings use [`sliceString`](/docs#sliceString) with `0` and `1` as arguments instead.

### Arrays

```ts
// Ramda
head([1, 2, 3]);

// Remeda
first([1, 2, 3]);
```

### Strings

```ts
// Ramda
head("abc");

// Remeda
sliceString("abc", 0, 1);
```
