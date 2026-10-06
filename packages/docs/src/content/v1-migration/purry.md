#### Runtime

Lazy implementations are no longer supported: the function doesn't look for a
`lazy` prop on the dataFirst function implementation, and doesn't take a lazy
implementation as a third argument. Functions built with `purry` run eagerly
inside `pipe`.

##### Examples

###### Implicit lazy removed (with Object.assign)

```ts
function myFunc(...args: readonly unknown[]): unknown {
  // Was:
  return purry(withLazy, args);

  // Now:
  return purry(dataFirstImpl, args);
}

function dataFirstImpl(...) {
  // ...
}

// These can be removed now:
function withLazy = Object.assign(dataFirstImpl, { lazy: lazyImpl });

function lazyImpl(...): LazyEvaluator {
  // ...
}
```

###### Implicit lazy removed (with a namespace)

```ts
function myFunc(...args: readonly unknown[]): unknown {
  // Unchanged:
  return purry(dataFirstImpl, args);
}

function dataFirstImpl(...) {
  // ...
}

// These can be removed now:
namespace dataFirstImpl {
  export const lazy = lazyImpl;
}

function lazyImpl(...): LazyEvaluator {
  // ...
}
```

###### Explicit lazy removed

```ts
function myFunc(...args: readonly unknown[]): unknown {
  // Was:
  return purry(dataFirstImpl, args, lazyImpl);

  // Now:
  return purry(dataFirstImpl, args);
}

function dataFirstImpl(...) {
  // ...
}

// This can be removed now:
function lazyImpl(...): LazyEvaluator {
  // ...
}
```
