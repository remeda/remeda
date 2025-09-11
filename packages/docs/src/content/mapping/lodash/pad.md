---
category: String
---

_Not provided by Remeda._

- If pad is used with whitespace as padding in order to center text when
  displayed on a web page prefer using CSS instead. You shouldn't need to use
  runtime logic for styling.
- For other uses `pad` could be replicated via [`padStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)
  and [`padEnd`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd),
  by computing the amount of effective padding you need on one side.

### CSS

```tsx
// Lodash
<pre>{_.pad(user.name, 20)}</pre>

// CSS
<div style={{ textAlign: "center", width: "20ch" }}>{user.name}</div>
```

### Reference Implementation

```ts
const pad = (data: string, length: number, padding = " ") =>
  data
    .padStart(Math.floor((length + data.length) / 2), padding)
    .padEnd(length, padding);
```
