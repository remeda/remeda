---
category: String
remeda: toCamelCase
---

- Lodash attempts pseudo-linguistic word splitting to handle special characters
  which might lead to inaccurate results. Remeda uses a narrower, ASCII-only
  definition of "words" based on [`type-fest`'s word splitting definition](https://github.com/sindresorhus/type-fest/blob/main/source/words.d.ts)
  that should only be used for simple strings like identifiers and internal
  keys. For linguistic processing where language and locale nuances matter, use
  the built-in [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  instead.
- Remeda treats consecutive uppercase characters differently than Lodash. Use
  `{ preserveConsecutiveUppercase: false }` as the second parameter to get the
  same results.
- Lodash performs normalization on the input before splitting it, including
  [`deburr`](/mapping/lodash#deburr) and removing apostrophes. Because Remeda
  assumes the input is a simple string, these normalizations are not built into
  the function and need to be done manually.

### Simple strings

```ts
// Lodash
_.camelCase(input);

// Remeda
toCamelCase(input, { preserveConsecutiveUppercase: false });
```

### Fully normalized

```ts
// Lodash
_.camelCase(input);

// Remeda + Native
toCamelCase(
  input
    .normalize("NFD")
    .replace(
      /['\u2019\u0300-\u036f]/g /* remove diacritics and apostrophes */,
      "",
    ),
  { preserveConsecutiveUppercase: false },
);
```
