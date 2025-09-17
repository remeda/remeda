---
category: String
remeda: toKebabCase
---

- Lodash attempts pseudo-linguistic word splitting to handle special characters,
  which might lead to inaccurate results. Remeda uses a simpler word splitting
  approach based on [`type-fest`'s definition](https://github.com/sindresorhus/type-fest/blob/main/source/words.d.ts)
  that should only be used for simple strings like identifiers and internal
  keys. For linguistic processing where language and locale nuances matter, use
  the built-in [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  instead.
- Lodash performs normalization on the input before splitting it, including
  [`deburr`](/mapping/lodash#deburr) and removing apostrophes. Remeda's word
  splitting is simpler and doesn't include these normalizations, so they need to
  be done manually if required.
- Lodash allows calling `kebabCase` without any input, or with an `undefined`
  input, which isn't supported in Remeda. Handle these cases before calling the
  function.

### Simple strings

```ts
// Lodash
_.kebabCase(input);

// Remeda
toKebabCase(input);
```

### Normalized

```ts
// Lodash
_.kebabCase(input);

// Remeda + Native
toKebabCase(
  input
    // "Promote" diacritics to be independent characters in the string.
    .normalize("NFD")
    // Remove apostrophes and all independent diacritic characters.
    .replace(/['\u2019\u0300-\u036f]/g, ""),
);
```

### Missing input

```ts
// Lodash
_.kebabCase();
_.kebabCase(input);

// Remeda
("");
input !== undefined ? toKebabCase(input) : "";

// Or
toKebabCase(input ?? "");
```
