---
category: String
---

_Not provided by Remeda._

- `words` is often used to convert between different cases of identifiers and
  keys. Use [`toCamelCase`](/docs#toCamelCase), [`toKebabCase`](/docs#toKebabCase),
  [`toSnakeCase`](/docs#toSnakeCase), or [`toTitleCase`](/docs#toTitleCase)
  instead.
- If `words` is used for simple splitting tasks, it can often be replaced with
  [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
  using simple regular expressions like `/\s+/`, `/\W+/`, `/[\p{Z}\p{P}]+/u`, or
  ones tailored specifically for your use-case.
- Lodash performs a lot of pseudo-linguistic heuristics in order to detect
  special characters like diacritics, emojis, and complex graphemes. If you need
  accurate language-aware splitting of words, prefer [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  with [`granularity: "word"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#word).
- When provided with the optional `pattern` parameter, `words` defers the call
  to [`String.prototype.match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
  as-is.

### Case conversion

```ts
// Lodash
_.words(input).map(_.toLowerCase).join("-");
_.words(input).map(_.toLowerCase).join("_");
_.words(input).map(_.capitalize).join(" ");
_.words(input).map(_.toUpperCase).join("-");
_.words(input).map(_.toUpperCase).join("_");

// Remeda
toKebabCase(input);
toSnakeCase(input);
toTitleCase(input, { preserveConsecutiveUppercase: false });
toUpperCase(toKebabCase(input));
toUpperCase(toSnakeCase(input));
```

### Naive splitting

```ts
// Lodash
_.words(input);

// Remeda
split(input, /\s+/); // spaces
split(input, /\W+/); // spaces, punctuation
split(input, /[\p{Z}\p{P}]+/u); // support for unicode spaces and punctuation.
```

### Proper NLP

```ts
// Lodash
_.words(input);

// Native
const segmenter = new Intl.Segmenter("en", { granularity: "word" });
Array.from(segmenter.segment(input)).map(({ segment }) => segment);
```

### Custom pattern

```ts
// Lodash
_.words(input, pattern);

// Native
input.match(pattern);
```
