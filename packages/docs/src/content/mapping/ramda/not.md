---
category: Logic
remeda: isNot
---

The function only accepts boolean values, to support arbitrary values compose
it with [`isTruthy`](/docs#isTruthy).

### Booleans

```ts
// Ramda
not(val);

// Remeda
isNot(val);
```

### Arbitrary

```ts
// Ramda
not(val);

// Remeda
isNot(isTruthy(val));
```
