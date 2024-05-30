# Typing

The dataLast implementation is now optimized for use in pipes and places where
the object type is known at the time of invocation. It no longer supports
implicit "forward" typing as a factory. This provides better type-ahead when
filling in the path, and better error handling when a prop name or it's type
changes or the name has a typo.

## Examples

### No forward typing

```ts
// Was: **The operand** for `setter` would be checked that the path ["a", "b"]
// exists on it and is of the right type.
const setter = setPath(["a", "b"], 123);
setter({ a: { b: 456 } }); // => { a: { b: 123 }}

// Now: We now validate that **the path** exists in the piped object and is of
// the correct type.
pipe({ a: { b: 456 } }, setPath(["a", "b"], 123));
```

### Typo protection

```ts
// Would surface a typescript error on the path itself.
pipe({ a: { b: 456 } }, setPath(["a", "c"], 123));
```
