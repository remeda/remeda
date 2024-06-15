---
category: List
remeda: flat
---

Unlike `flatten` in Ramda, the Remeda `flat` function is always bound by the
`depth` param. To replicate the Ramda behavior use a high, **const** value.
`Infinity` and `Number.MAX_INTEGER` are not consts and would result in
inefficient typing.

```ts
// Ramda
flatten(DATA);

// Remeda
flat(DATA, 100); // ✅
flat(DATA, Infinity); // ❌
```
