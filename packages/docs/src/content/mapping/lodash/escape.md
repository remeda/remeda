---
category: String
---

_Not provided by Remeda._

`escape` is not needed in the vast majority of modern web development - all
modern frameworks and tools perform this kind of escaping (and more!)
automatically wherever it matters. If you are working on a low-level application
that writes directly to the DOM, prefer libraries that take a holistic approach
to this problem (like [`DOMPurify`](https://www.npmjs.com/package/dompurify))
instead of basic string substitutions. In the rare case you must have an
escaping function, copy the reference code below as-is:

```ts
const ESCAPED: Readonly<Record<string, `&${string};`>> = {
  // https://github.com/lodash/lodash/blob/main/lodash.js#L399-L403
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const CHARS_RE = new RegExp(`[${Object.keys(ESCAPED).join("")}]`, "g");

const escape = (input: string): string =>
  input.replace(CHARS_RE, (char) => ESCAPED[char]!);
```
