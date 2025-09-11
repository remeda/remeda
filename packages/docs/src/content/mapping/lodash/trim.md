---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.trim`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim) for whitespace, or create a custom function for specific characters.

```ts
// Lodash (whitespace)
_.trim("  abc  "); // "abc"

// Native (identical for whitespace)
"  abc  ".trim(); // "abc"

// Lodash (custom characters)
_.trim("-_-abc-_-", "_-"); // "abc"

// Custom implementation for specific characters
function trim(str: string, chars?: string): string {
  if (!chars) return str.trim();

  const pattern = new RegExp(
    `^[${chars.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}]+|[${chars.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")}]+$`,
    "g",
  );
  return str.replace(pattern, "");
}

trim("-_-abc-_-", "_-"); // "abc"
```
