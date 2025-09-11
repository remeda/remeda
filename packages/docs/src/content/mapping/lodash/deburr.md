---
category: String
---

_Not provided by Remeda._

`deburr` uses hard-coded heuristics which can lead to inaccurate results:

- Misses some accented characters (e.g., ḩ, ố, ῷ and й).
- Erroneously "simplifies" ligatures that don't formally have any diacritics
  that require "deburring" (e.g., Æ, Ĳ, Œ, and ŉ).
- Swaps characters because they look similar although they are semantically
  unrelated to each other (e.g., Ð, Ø, Þ, ß, ſ).

We strongly recommend using linguistically-aware alternatives instead that are
purpose-built for this task:

- When **comparing** strings, prefer [`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
  with `sensitivity: 'base'` to compare them while ignoring accents and case.
- When **simplifying** strings, prefer [`normalize("NFD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  to "extract" the diacritics from characters, then use [`replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace). This solution would
  be more accurate, but is not a drop-in replacement for `deburr` because of the
  differences mentioned above.
  to remove [diacritics](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
- When **querying** for a string, prefer purpose built collations and other
  built-in mechanisms of databases and other systems that offer more robust
  query normalization.

### Comparison

```ts
// Lodash
_.deburr("café") === "cafe";

// Native JS
const collator = new Intl.Collator("en", { sensitivity: "base" });
collator.compare("café", "cafe") === 0;
```

### Simplifying

```ts
// Lodash
_.deburr("café");

// Native JS
"café"
  .normalize("NFD")
  .replace(
    /[\u0300-\u036f]/g /* The "Combining Diacritical Marks" Unicode block. */,
    "",
  );
```
