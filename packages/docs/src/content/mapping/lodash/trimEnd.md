---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.trimEnd`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd) for whitespace, or create a custom function for specific characters.

```ts
// Lodash (whitespace)
_.trimEnd("  abc  "); // "  abc"

// Native (identical for whitespace)
"  abc  ".trimEnd(); // "  abc"

// Lodash (custom characters)
_.trimEnd("-_-abc-_-", "_-"); // "-_-abc"

// Custom implementation for specific characters
function trimEnd(str: string, chars?: string): string {
  if (!chars) return str.trimEnd();

  const pattern = new RegExp(
    `[${chars.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}]+$`,
    "g",
  );
  return str.replace(pattern, "");
}

trimEnd("-_-abc-_-", "_-"); // "-_-abc"
```
