---
category: Function
remeda: constant
---

Use `constant` with the constant `true`. Notice that in Ramda you use `T` itself
as the function, but in Remeda `constant` is a factory that _creates_ the
replacement function.

```ts
// Ramda
T;

// Remeda
constant(true);
```
