---
category: String
---

_Not provided by Remeda._

- When the second `characters` parameter is not provided to lodash (or when it
  is `undefined`), all whitespace characters would be trimmed. This is the same
  as the the native [`String.prototype.trim`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim).
- The native `trim` doesn't support the additional `characters` parameter that
  allows changing the trimmed character. Instead, first convert the string to an
  array (via spreading), use Remeda's [`dropWhile`](/docs#dropWhile) (for left
  trimming) and [`dropLastWhile`](/docs#dropLastWhile) (for right trimming), and
  then rejoin the array back with [`join`](/docs#join).
- Lodash does complex grapheme parsing, but this is usually not needed unless
  the `characters` parameter itself contains complex Unicode graphemes (like
  family emojis 👨‍👩‍👧‍👦 or flags with modifiers 🏳️‍🌈 that you want to trim). In these
  cases use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  with [`granularity: "grapheme"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#granularity).
  to split the array.
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

// Remeda
join(
  dropLastWhile(
    dropWhile([...input], isIncludedIn(characters)),
    isIncludedIn(characters),
  ),
  "",
);
```

### Graphemes

```ts
// Lodash
_.trim(input, characters);

// Remeda
const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const graphemes = map(segmenter.segment(characters), prop("segment"));
join(
  dropLastWhile(
    dropWhile(
      map(segmenter.segment(input), prop("segment")),
      isIncludedIn(graphemes),
    ),
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
