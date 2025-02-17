# Removed

Replaced with [`doNothing`](/docs/#doNothing) when the function should return
`void`, or [`constant`](/docs/#constant) with `undefined` as the operand when a
return value is required.

## Examples

### Void

```ts
// Was
forEach(DATA, noop);

// Now
forEach(DATA, doNothing());
```

### Constant

```ts
// Was
map(DATA, noop);

// Now
map(DATA, constant(undefined));
```
