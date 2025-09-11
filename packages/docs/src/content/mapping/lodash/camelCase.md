---
category: String
remeda: toCamelCase
---

- Lodash attempts pseudo-linguistic word splitting to handle special characters
  like apostrophes and diacritics, which might lead to inaccurate results.
  Remeda uses a narrower, ASCII-only definition of "words" based on
  [`type-fest`'s word splitting definition](https://github.com/sindresorhus/type-fest/blob/main/source/words.d.ts) that should only be used for simple strings like identifiers and
  internal keys. For linguistic processing where language and locale nuances
  matter, use the built-in [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  instead.
- Remeda treats consecutive uppercase characters differently than Lodash. Use
  `{ preserveConsecutiveUppercase: false }` as the second parameter to get the
  same results.

```ts
// Lodash
_.camelCase("HasHTML");

// Remeda
toCamelCase("HasHTML", { preserveConsecutiveUppercase: false });
```
