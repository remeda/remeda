---
category: String
---

_Not provided by Remeda._

`escapeRegExp` is effectively a wrapper around the regular expression
`/[\\^$.*+?()[\]{}|]/g` (which matches on the characters: ^, $, ., \*, +, ?, (),
{}, [], and |) that also does replacement. It is only useful in very niche
situations where you'd want to use externally-provided strings directly to the
RegExp constructor and you'd want to sanitize them first; these situations might
be solvable differently by either validating the input itself, or by using more
nuanced string utilities provided by databases and other data sources that might
already do sanitization for you. In the rare case you must have an escaping
function, copy the reference code below as-is.

```ts
const SPECIAL_CHARACTERS_RE = /[\\^$.*+?()[\]{}|]/g;

const escapeRegExp = (input: string): string =>
  input.replace(SPECIAL_CHARACTERS_RE, "\\$&");
```
