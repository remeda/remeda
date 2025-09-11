---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) instead.

```ts
// Lodash
replace("Hi Fred", "Fred", "Barney"); // "Hi Barney"
replace("Hi Fred", /fred/i, "Barney"); // "Hi Barney"

// Native (identical behavior)
"Hi Fred".replace("Fred", "Barney"); // "Hi Barney"
"Hi Fred".replace(/fred/i, "Barney"); // "Hi Barney"

// With function replacement
replace("2-4-6", /(\d)/g, (match, p1) => `[${p1}]`); // "[2]-[4]-[6]"

// Native
"2-4-6".replace(/(\d)/g, (match, p1) => `[${p1}]`); // "[2]-[4]-[6]"
```
