---
category: Function
remeda: constant
---

Use `constant` with the constant `false`. Notice that in Ramda you use `F`
itself as the function, but in Remeda `constant` is a factory that _creates_ the
replacement function.

```ts
// Ramda
F;

// Remeda
constant(false);
```
