---
category: String
---

_Not provided by Remeda._

- When the second `characters` parameter is not provided to Lodash (or when it
  is `undefined`), all whitespace characters would be trimmed. This is the same
  as the native [`String.prototype.trim`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim).
- The native `trim` doesn't support the additional `characters` parameter that
  allows changing the trimmed characters. Instead, create a regex that would
  match `characters` anchored to either the start or the end of the string
  (`^[${characters}]+|[${characters}]+$`) and then use [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
  to replace them with the empty string (`""`). Don't forget the [`g`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global)
  RegExp flag to properly catch everything, and the [`u`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode)
  RegExp flag if you need to handle Unicode characters.
- Lodash does complex grapheme parsing, but this is usually not needed unless
  the `characters` parameter itself contains complex Unicode graphemes (like
  family emojis 👨‍👩‍👧‍👦 or flags with modifiers 🏳️‍🌈 that you want to trim). In these
  cases use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  with [`granularity: "grapheme"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#granularity)
  to split the string, then use Remeda's [`dropWhile`](/docs#dropWhile) (for
  left trimming) and [`dropLastWhile`](/docs#dropLastWhile) (for right
  trimming), and rejoin the array back with [`join`](/docs#join).
- Lodash allows calling `trim` without any input (or with an `undefined` input),
  which results in an empty string `""`. This requires explicit handling in
  replacements.

### Whitespaces

```ts
// Lodash
_.trim(input);

// Native
input.trim();
```

### Callback

```ts
// Lodash
_.map(data, _.trim);

// Native
data.map(String.prototype.trim);
```

### Characters

```ts
// Lodash
_.trim(input, characters);

// Native
input.replace(new RegExp(`^[${characters}]+|[${characters}]+$`, "gu"), "");
```

### Graphemes

```ts
// Lodash
_.trim(input, characters);

// Remeda
const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const inputGraphemes = Array.from(segmenter.segment(input), prop("segment"));
const graphemes = Array.from(segmenter.segment(characters), prop("segment"));
join(
  dropLastWhile(
    dropWhile(inputGraphemes, isIncludedIn(graphemes)),
    isIncludedIn(graphemes),
  ),
  "",
);
```

### Missing input data

```ts
// Lodash
_.trim();
_.trim(input);

// Native
("");
input?.trim() ?? "";
```
