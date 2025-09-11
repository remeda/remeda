---
category: String
---

_Not provided by Remeda._

Lodash's `startCase` converts strings to start case (Title Case). Use a combination of Remeda functions or create a custom function.

```ts
// Lodash
startCase("--foo-bar--"); // "Foo Bar"
startCase("fooBar"); // "Foo Bar"
startCase("__FOO_BAR__"); // "FOO BAR"

// Custom function using Remeda utilities
import { pipe, split, filter, map, join, capitalize } from "remeda";

const startCase = (str: string) =>
  pipe(
    str,
    (str) => str.replace(/([A-Z])/g, " $1"), // Add space before capitals
    (str) => str.replace(/[^a-zA-Z0-9]+/g, " "), // Replace non-alphanumeric with spaces
    split(" "),
    filter((word) => word.length > 0),
    map((word) => capitalize(word.toLowerCase())),
    join(" "),
  );

startCase("--foo-bar--"); // "Foo Bar"
startCase("fooBar"); // "Foo Bar"

// For CSS-based display, consider using text-transform
// CSS: text-transform: capitalize;
```
