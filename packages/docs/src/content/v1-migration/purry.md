#### Runtime

Lazy implementations are no longer supported: the function doesn't look for a
`lazy` prop on the dataFirst function implementation, and doesn't take a lazy
implementation as a third argument. Functions built with `purry` run eagerly
inside `pipe`.

The third argument is now the data-first arity: the number of parameters of the
dataFirst function implementation, as a literal. A call with at least that many
arguments runs data-first, and a shorter one returns the data-last function.
Passing it saves `purry` from reading `Function.length` on every call, and
TypeScript checks it against the implementation's parameters.

##### Examples

###### Arity added

```ts
function myFunc(...args: readonly unknown[]): unknown {
  // Was:
  return purry(dataFirstImpl, args);

  // Now:
  return purry(dataFirstImpl, args, 2);
}

function dataFirstImpl(data, value) {
  // ...
}
```

###### Implicit lazy removed (with Object.assign)

```ts
function myFunc(...args: readonly unknown[]): unknown {
  // Was:
  return purry(withLazy, args);

  // Now:
  return purry(dataFirstImpl, args, 2);
}

function dataFirstImpl(data, value) {
  // ...
}

// These can be removed now:
const withLazy = Object.assign(dataFirstImpl, { lazy: lazyImpl });

function lazyImpl(...): LazyEvaluator {
  // ...
}
```

###### Implicit lazy removed (with a namespace)

```ts
function myFunc(...args: readonly unknown[]): unknown {
  // Was:
  return purry(dataFirstImpl, args);

  // Now:
  return purry(dataFirstImpl, args, 2);
}

function dataFirstImpl(data, value) {
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
  return purry(dataFirstImpl, args, 2);
}

function dataFirstImpl(data, value) {
  // ...
}

// This can be removed now:
function lazyImpl(...): LazyEvaluator {
  // ...
}
```
