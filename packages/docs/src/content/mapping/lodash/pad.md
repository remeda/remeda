---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.padStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) and [`padEnd`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd) to implement center padding.

```ts
// Lodash
pad("abc", 8); // "  abc   "
pad("abc", 8, "_-"); // "_-abc_-_"

// Custom implementation using native methods
function pad(str: string, length: number, chars: string = " "): string {
  if (str.length >= length) return str;

  const padLength = length - str.length;
  const padLeft = Math.floor(padLength / 2);
  const padRight = padLength - padLeft;

  const leftPad = chars
    .repeat(Math.ceil(padLeft / chars.length))
    .slice(0, padLeft);
  const rightPad = chars
    .repeat(Math.ceil(padRight / chars.length))
    .slice(0, padRight);

  return leftPad + str + rightPad;
}

pad("abc", 8); // "  abc   "
pad("abc", 8, "_-"); // "_-abc_-_"
```
