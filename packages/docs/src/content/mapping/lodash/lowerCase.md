---
category: String
---

_Not provided by Remeda._

Lodash's `lowerCase` converts strings to space-separated lowercase words using word splitting. Remeda's `toLowerCase` only converts case without word separation.

```ts
// Lodash
_.lowerCase("--Foo-Bar--"); // "foo bar"
_.lowerCase("fooBar"); // "foo bar"
_.lowerCase("__FOO_BAR__"); // "foo bar"

// Remeda (simple lowercase)
toLowerCase("--Foo-Bar--"); // "--foo-bar--"
toLowerCase("fooBar"); // "foobar"

// Custom function for word separation
import { pipe, split, filter, map, join } from "remeda";

const lowerCase = (str: string) =>
  pipe(
    str,
    (str) => str.replace(/([A-Z])/g, " $1"), // Add space before capitals
    (str) => str.replace(/[^a-zA-Z0-9]+/g, " "), // Replace non-alphanumeric with spaces
    split(" "),
    filter((word) => word.length > 0),
    map((word) => word.toLowerCase()),
    join(" "),
  );

lowerCase("--Foo-Bar--"); // "foo bar"
lowerCase("fooBar"); // "foo bar"
```
