---
category: String
---

_Not provided by Remeda._

`deburr` uses hard-coded heuristics which might lead to inaccurate results. In
modern applications, we recommend using linguistically-aware alternatives that
are purpose-built for this task:

- When **comparing** strings, prefer [`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
  with `sensitivity: 'base'` to compare them while ignoring accents and case.
- When **simplifying** strings, prefer [`normalize("NFD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  to "extract" the diacritics from characters, then use [`replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
  to remove [diacritics](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
- When **querying** for a string, prefer built-in mechanisms in databases
  and APIs that have more robust query normalization.

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
