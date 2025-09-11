---
category: String
remeda: capitalize
---

- Lodash's `capitalize` converts the entire string to lowercase first, then
  capitalizes only the first character. Remeda's `capitalize` doesn't do this
  automatically, but it could be reproduced by calling [`toLowerCase`](/docs#toLowerCase)
  on the input before calling `capitalize` on it.
- For display purposes, consider using CSS directly via the property
  [`text-transform: capitalize`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
  without any runtime logic at all.
- Remeda's `capitalize` is designed for ASCII strings and may produce unexpected
  results with non-ASCII characters (diacritics, non-Latin characters, emojis,
  etc.). For internationalized text processing,
  [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  provides more accurate word segmentation.

### Programmatic conversion

```ts
// Lodash
_.capitalize("javaScript"); // "Javascript"

// Remeda
capitalize(toLowerCase("javaScript")); // "Javascript"
```

### CSS alternative

```tsx
// Lodash
<div>{_.capitalize(user.name)}</div>

// CSS
<div style={{ textTransform: "capitalize" }}>{user.name}</div>
```
