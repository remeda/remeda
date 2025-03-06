---
category: String
remeda: toCamelCase
---

- Camel-casing relies heavily on how "words" are broken up. Remeda uses the same
  logic that [`type-fest` uses](https://github.com/sindresorhus/type-fest/blob/main/source/split-words.d.ts).
  This might work slightly different from Lodash.
- Remeda offers an optional flag for `toCamelCase` that changes how consecutive
  uppercase letters are handled. This flag is turned **on** by default, but the
  behavior is more similar to Lodash when it is turned **off**.

```ts
// Lodash
camelCase("HasHTML"); // "hasHtml"

// Remeda
toCamelCase("HasHTML"); // "hasHTML";

toCamelCase("HasHTML", { preserveConsecutiveUppercase: true }); // "hasHTML";
toCamelCase("HasHTML", { preserveConsecutiveUppercase: false }); // "hasHtml";
```
