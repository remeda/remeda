---
category: String
remeda: truncate
---

- Remeda requires an explicit `length` parameter, while Lodash defaults to
  **`30`** when it isn't provided.
- Lodash computes the length of the `input` and `omission` strings in
  _graphemes_, unlike Remeda that counts _Unicode characters_. In the vast
  majority of cases these are identical, but when these strings contain
  complex Unicode characters (like family emojis 👨‍👩‍👧‍👦 or flags with modifiers 🏳️‍🌈)
  the input might not be truncated at the same index.
- The Remeda function would _never_ return a string longer than `length`, opting
  to truncate the `omission` itself when it's too long. Lodash will never
  truncate the `omission` and therefore might return an output that exceeds
  `length`.

### Default length

```ts
// Lodash
_.truncate(input);

// Remeda
truncate(input, 30);
```

### Custom length

```ts
// Lodash
_.truncate(input, { length });

// Remeda
truncate(input, length);
```

### With options

```ts
// Lodash
_.truncate(input, { omission, separator });
_.truncate(input, { length, omission, separator });

// Remeda
truncate(input, 30, { omission, separator });
truncate(input, length, { omission, separator });
```
