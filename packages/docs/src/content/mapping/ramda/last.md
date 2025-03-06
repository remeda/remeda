---
category: List
remeda: last
---

For strings use [`sliceString`](/docs#sliceString) with `-1` as an argument instead.

### Arrays

```ts
// Ramda
last([1, 2, 3]);

// Remeda
last([1, 2, 3]);
```

### Strings

```ts
// Ramda
last("abc");

// Remeda
sliceString("abc", -1);
```
