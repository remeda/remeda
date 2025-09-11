---
category: String
remeda: toCamelCase
---

- Remeda's `toCamelCase` is designed for ASCII strings and may produce
  unexpected results when the input contains non-ASCII characters (diacritics,
  non-Latin characters, emojis, etc.). For internationalized text,
  [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  provides more accurate word segmentation.
- Remeda uses [`type-fest`'s word splitting definition](https://github.com/sindresorhus/type-fest/blob/main/source/words.d.ts),
  which is different from how Lodash splits words; for closer results pass
  `{ preserveConsecutiveUppercase: false }` as the second parameter.

```ts
// Lodash
_.camelCase("HasHTML");

// Remeda
toCamelCase("HasHTML", { preserveConsecutiveUppercase: false });
```
