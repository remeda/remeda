---
category: String
---

_Not provided by Remeda._

Research shows 75% of `words` usage is for case conversion, which Remeda handles through dedicated functions like `toCamelCase`, `toKebabCase`, and the planned `toTitleCase`. For direct word splitting, use native JavaScript methods.

```ts
// Lodash
words(str);

// Native alternatives
str.split(/\s+/); // Split on whitespace
str.split(/\W+/); // Split on non-word characters
str.match(/\w+/g) || []; // Extract word characters

// Most common Lodash words usage (45% of cases)
words(str).map(capitalize).join(" "); // → Use planned `toTitleCase` instead
```
