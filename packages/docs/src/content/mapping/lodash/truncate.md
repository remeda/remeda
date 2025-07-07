---
category: String
remeda: truncate
---

- The `length` param in Remeda is not part of the options object and is required
  as it's own argument. There is no implicit default length.
- In Lodash, the function also supports some handling of Unicode characters
  (like Emojis). The Remeda implementation only supports ASCII.
- In Lodash when `omission` is longer than the provided `length` the output
  would be the entire `omission` string, which would cause the result to be
  **longer** than `length`. The Remeda implementation ensures this doesn't
  happen by truncating the `omission` string itself.
- When providing a regular expression for `separator` it needs to have the
  [`global`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags)
  enabled on it.

### Implicit default

```ts
// Lodash
_.truncate(DATA);

// Remeda
truncate(DATA, 30 /* implicit default in Lodash */);
```

### Custom length

```ts
// Lodash
_.truncate(DATA, { length: 24 });

// Remeda
truncate(DATA, 24);
```

### Custom omission

```ts
// Lodash
_.truncate(DATA, { omission: " [...]" });

// Remeda
truncate(DATA, 30, { omission: " [...]" });
```

### String separator

```ts
// Lodash
_.truncate(DATA, { separator: "," });

// Remeda
truncate(DATA, 30, { separator: "," });
```

### RegExp separator

```ts
// Lodash
_.truncate(DATA, { separator: /,? +/ });

// Remeda
truncate(DATA, 30, { separator: /,? +/g });
```

### All options

```ts
// Lodash
_.truncate(DATA, { length: 24, omission: " [...]", separator: /,? +/ });

// Remeda
truncate(DATA, 24, { omission: " [...]", separator: /,? +/g });
```
