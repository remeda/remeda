---
category: String
remeda: capitalize
---

- Lodash's `capitalize` converts the entire string to lowercase first, then capitalizes only the first character. Remeda's `capitalize` only capitalizes the first character without modifying the rest of the string.
- Remeda's `capitalize` is designed for ASCII identifiers (variable names, database fields, etc.) and may produce unexpected results with non-ASCII characters. For Unicode text, consider using the CSS `text-transform: capitalize` property instead.

```ts
// Lodash
capitalize("hELLO WORLD"); // "Hello world"
capitalize("HTML"); // "Html"

// Remeda
capitalize("hELLO WORLD"); // "HELLO WORLD"
capitalize("HTML"); // "HTML"
```

### When behavior is identical

```ts
// Lodash
capitalize("hello world"); // "Hello world"

// Remeda
capitalize("hello world"); // "Hello world"
```

### Mixed case handling

```ts
// Lodash
capitalize("javaScript"); // "Javascript"

// Remeda
capitalize("javaScript"); // "JavaScript"
```
