---
category: Array
remeda: flat
---

Unlike `flatten` in Lodash, the Remeda `flat` function is always bound by the
`depth` param. To replicate the Lodash behavior use a high, **const** value.
`Infinity` and `Number.MAX_INTEGER` are not consts and would result in
inefficient typing.

```ts
// Lodash
flattenDeep(DATA);

// Remeda
flat(DATA, 100); // ✅
flat(DATA, Infinity); // ❌
```
