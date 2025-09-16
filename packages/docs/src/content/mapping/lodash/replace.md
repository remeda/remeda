---
category: String
---

_Not provided by Remeda._

- Use native [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
  instead.
- Lodash typing incorrectly allows calling `replace` with two arguments. These
  calls return strings as-is, while RegExp inputs are converted to strings.

### Regular Usage

```ts
// Lodash
_.replace(input, pattern, replacement);

// Native
input.replace(pattern, replacement);
```

### Invalid 2-parameter usage

```ts
// Lodash
_.replace(input, replacement);
_.replace(/pattern/, replacement);

// Native
input; // Returns input unchanged
String(/pattern/); // "/pattern/" - RegExp converted to string
```
