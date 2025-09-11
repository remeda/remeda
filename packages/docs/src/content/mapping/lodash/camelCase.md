---
category: String
remeda: toCamelCase
---

- Camel-casing relies heavily on how "words" are broken up. Remeda uses the same
  logic that [`type-fest` uses](https://github.com/sindresorhus/type-fest/blob/main/source/split-words.d.ts).
  This might work slightly different from Lodash.
- Remeda's `toCamelCase` is designed for ASCII identifiers and may produce unexpected results with non-ASCII characters.
- Remeda offers an optional flag for `toCamelCase` that changes how consecutive
  uppercase letters are handled. For Lodash-like behavior, set `preserveConsecutiveUppercase: false`.

```ts
// Lodash
camelCase("HasHTML"); // "hasHtml"

// Remeda (Lodash-like behavior)
toCamelCase("HasHTML", { preserveConsecutiveUppercase: false }); // "hasHtml"

// Remeda (default behavior)
toCamelCase("HasHTML"); // "hasHTML"
```
