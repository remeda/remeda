---
category: String
---

_Not provided by Remeda._

Lodash's `upperCase` converts strings to space-separated uppercase words. Use Remeda's `toUpperCase` for simple case conversion, or create a custom function for word separation.

**Note**: Remeda's case functions are designed for ASCII strings and may produce unexpected results with non-ASCII characters (diacritics, non-Latin characters, emojis, etc.).

```ts
// Lodash
_.upperCase("--foo-bar"); // "FOO BAR"
_.upperCase("fooBar"); // "FOO BAR"
_.upperCase("__foo_bar__"); // "FOO BAR"

// Remeda (simple uppercase)
toUpperCase("--foo-bar"); // "--FOO-BAR"
toUpperCase("fooBar"); // "FOOBAR"

// Custom function for word separation
import { pipe, split, filter, map, join } from "remeda";

const upperCase = (str: string) =>
  pipe(
    str,
    (str) => str.replace(/([A-Z])/g, " $1"), // Add space before capitals
    (str) => str.replace(/[^a-zA-Z0-9]+/g, " "), // Replace non-alphanumeric with spaces
    split(" "),
    filter((word) => word.length > 0),
    map((word) => word.toUpperCase()),
    join(" "),
  );

upperCase("--foo-bar"); // "FOO BAR"
upperCase("fooBar"); // "FOO BAR"
```
