---
category: String
---

_Not provided by Remeda._

Use a simple implementation or a library like [`escape-string-regexp`](https://www.npmjs.com/package/escape-string-regexp).

```ts
// Lodash
escapeRegExp("[lodash](https://lodash.com/)"); // "\\[lodash\\]\\(https://lodash\\.com/\\)"

// Simple implementation
function escapeRegExp(string: string): string {
  return string.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

escapeRegExp("[lodash](https://lodash.com/)"); // "\\[lodash\\]\\(https://lodash\\.com/\\)"

// Using 'escape-string-regexp' library
import escapeStringRegexp from "escape-string-regexp";
escapeStringRegexp("[lodash](https://lodash.com/)"); // "\\[lodash\\]\\(https://lodash\\.com/\\)"
```

The escaped string can then be safely used in `new RegExp()` constructor.
