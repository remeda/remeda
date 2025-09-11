---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.trimStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart) for whitespace, or create a custom function for specific characters.

```ts
// Lodash (whitespace)
trimStart("  abc  "); // "abc  "

// Native (identical for whitespace)
"  abc  ".trimStart(); // "abc  "

// Lodash (custom characters)
trimStart("-_-abc-_-", "_-"); // "abc-_-"

// Custom implementation for specific characters
function trimStart(str: string, chars?: string): string {
  if (!chars) return str.trimStart();

  const pattern = new RegExp(
    `^[${chars.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}]+`,
    "g",
  );
  return str.replace(pattern, "");
}

trimStart("-_-abc-_-", "_-"); // "abc-_-"
```
