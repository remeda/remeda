---
category: String
---

_Not provided by Remeda._

`unescape` is rarely needed in modern web development. The main use case is
processing HTML documents/snippets. For comprehensive HTML processing, prefer
dedicated HTML/XML parsing libraries. In the rare case you must have an
unescaping function, copy the reference code below as-is:

```ts
const UNESCAPED: Readonly<Record<`&${string};`, string>> = {
  // https://github.com/lodash/lodash/blob/main/lodash.js#L408-L412
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

const ENTITIES_RE = new RegExp(`${Object.keys(UNESCAPED).join("|")}`, "g");

const unescape = (input: string): string =>
  input.replace(ENTITIES_RE, (entity) => UNESCAPED[entity]!);
```
