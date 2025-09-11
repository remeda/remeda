---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.normalize`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) with [`.replace()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) instead.

```ts
// Lodash
deburr("déjà vu"); // "deja vu"

// Native
"déjà vu".normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // "deja vu"
```

For more comprehensive Unicode handling, consider using a dedicated library like [`unidecode`](https://www.npmjs.com/package/unidecode) or [`diacritics`](https://www.npmjs.com/package/diacritics).
