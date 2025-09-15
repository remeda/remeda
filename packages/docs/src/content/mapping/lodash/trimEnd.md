---
category: String
---

_Not provided by Remeda._

- When the second `characters` parameter is not provided to lodash (or when it
  is `undefined`), all whitespace characters would be trimmed. This is the same
  as the native [`String.prototype.trimEnd`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd).
- The native `trimEnd` doesn't support the additional `characters` parameter
  that allows changing the trimmed character. Instead, first convert the string
  to an array (via spreading), use Remeda's [`dropLastWhile`](/docs#dropLastWhile),
  and then rejoin the array back with [`join`](/docs#join).
- When the input string might contain complex Unicode characters or emojis (like
  family emojis 👨‍👩‍👧‍👦 or flags with modifiers 🏳️‍🌈), use [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
  with [`granularity: "grapheme"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#granularity)
  to convert the string to an array. Lodash does this implicitly.
- Lodash allows calling `trimEnd` without any input (or with an `undefined`
  input), which results in an empty string `""`. This requires explicit handling
  in replacements.

### Whitespaces

```ts
// Lodash
_.trimEnd(input);

// Native
input.trimEnd();
```

### Callback

```ts
// Lodash
_.map(data, _.trimEnd);

// Native
data.map(String.prototype.trimEnd);
```

### Characters

```ts
// Lodash
_.trimEnd(input, characters);

// Remeda
join(dropLastWhile([...input], isIncludedIn(characters)), "");
```

### Graphemes

```ts
// Lodash
_.trimEnd(input, characters);

// Remeda
join(
  dropLastWhile(
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
_.trimEnd();
_.trimEnd(input);

// Native
("");
input?.trimEnd() ?? "";
```
