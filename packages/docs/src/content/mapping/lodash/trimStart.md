---
category: String
---

_Not provided by Remeda._

- When the second `characters` parameter is not provided to lodash (or when it
  is `undefined`), all whitespace characters would be trimmed. This is the same
  as the native [`String.prototype.trimStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart).
- The native `trimStart` doesn't support the additional `characters` parameter
  that allows changing the trimmed character. Instead, first convert the string
  to an array (via spreading), use Remeda's [`dropWhile`](/docs#dropWhile), and
  then rejoin the array back with [`join`](/docs#join).
- When the input string might contain complex Unicode characters or emojis (like
  family emojis 👨‍👩‍👧‍👦 or flags with modifiers 🏳️‍🌈), use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  with [`granularity: "grapheme"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#granularity)
  to convert the string to an array. Lodash does this implicitly.
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

// Remeda
join(dropWhile([...input], isIncludedIn(characters)), "");
```

### Graphemes

```ts
// Lodash
_.trimStart(input, characters);

// Remeda
join(
  dropWhile(
    map(
      new Intl.Segmenter("en", { granularity: "grapheme" }).segment(input),
      prop("segment"),
    ),
    isIncludedIn(characters),
  ),
  "",
);
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
