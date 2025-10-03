---
category: String
---

_Not provided by Remeda._

- When the second `characters` parameter is not provided to Lodash (or when it
  is `undefined`), all whitespace characters would be trimmed. This is the same
  as the native [`String.prototype.trimStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart).
- The native `trimStart` doesn't support the additional `characters` parameter
  that allows changing the trimmed characters. Instead, create a regex that
  would match `characters` anchored to the start of the string
  (`^[${characters}]+`) and then use [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
  to replace them with the empty string (`""`).
- Lodash does complex grapheme parsing, but this is usually not needed unless
  the `characters` parameter itself contains complex Unicode graphemes (like
  family emojis 👨‍👩‍👧‍👦 or flags with modifiers 🏳️‍🌈 that you want to trim). In these
  cases use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  with [`granularity: "grapheme"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#granularity)
  to split the string, then use Remeda's [`dropWhile`](/docs#dropWhile), and
  then rejoin the array back with [`join`](/docs#join).
- Lodash allows calling `trimStart` without any input (or with an `undefined`
  input), which results in an empty string `""`. This requires explicit handling
  in replacements.

### Whitespaces

```ts
// Lodash
_.trimStart(input);

// Native
input.trimStart();
```

### Callback

```ts
// Lodash
_.map(data, _.trimStart);

// Native
data.map(String.prototype.trimStart);
```

### Characters

```ts
// Lodash
_.trimStart(input, characters);

// Native
input.replace(new RegExp(`^[${characters}]+`), "");
```

### Graphemes

```ts
// Lodash
_.trimStart(input, characters);

// Remeda
const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const inputGraphemes = Array.from(segmenter.segment(input), prop("segment"));
const graphemes = Array.from(segmenter.segment(characters), prop("segment"));
join(dropWhile(inputGraphemes, isIncludedIn(graphemes)), "");
```

### Missing input data

```ts
// Lodash
_.trimStart();
_.trimStart(input);

// Native
("");
input?.trimStart() ?? "";
```
