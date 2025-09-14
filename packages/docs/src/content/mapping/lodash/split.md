---
category: String
remeda: split
---

- Lodash allows calling `split` without a `separator` parameter (or setting it
  to `undefined`) which returns the input string as a single-element array (the
  same happens when `split` is used as a callback). Remeda needs
  wrapping the input in an array manually.
- Lodash accepts `null` and `undefined` input values, converting them to empty
  strings. Remeda needs these values handled separately.
- When the `separator` parameter is `""`, Lodash uses complex logic to parse
  compound Unicode characters (like family emojis 👨‍👩‍👧‍👦 or flags with modifiers 🏳️‍🌈)
  as single graphemes. Remeda uses native [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
  which splits these into component parts. Use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  with [`granularity: "grapheme"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#grapheme)
  for proper Unicode handling. This is rarely needed - simple Unicode characters
  (like non-Latin alphabets) work fine.

### Basic usage

```ts
// Lodash
_.split(input, separator);
_.split(input, separator, limit);

// Remeda
split(input, separator);
split(input, separator, limit);
```

### Without separator

```ts
// Lodash
_.split(input);
_.map(data, _.split);

// Native
[input];
map(data, (item) => [item]);
```

### Nullish inputs

```ts
// Lodash
_.split(input, separator);
_.split(input, separator, limit);

// Remeda
input != null ? split(input, separator) : [""];
input != null ? split(input, separator, limit) : [""];

// Or
split(input ?? "", separator);
split(input ?? "", separator, limit);
```

### Unicode grapheme splitting

```ts
// Lodash
_.split(input, "");
_.split(input, "", limit);

// Native
[...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(input)].map(
  ({ segment }) => segment,
);
[...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(input)]
  .map(({ segment }) => segment)
  .slice(0, limit);
```
