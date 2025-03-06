// This file defines types related to three different kinds lazy operations for use by `pipe`:
// - Producers: functions that take a single value and return an iterable.
// - Transducers: functions that take an iterable and return another iterable.
// - Reducers: functions that take an iterable and return a single value.
//
// Each category contains a set of related types:
// - Lazy*: An effect that processes it arguments and/or produces its results lazily.
// - Lazy*Impl: A function contining the lazy implementation of an effect.
// - Eager*Impl: A function contining the eager implementation of an effect.
// - *: An eager effect that contains additional fields to support a lazy implementation.

export type LazyOp =
  | Producer<unknown, unknown>
  | Transducer<unknown, unknown>
  | Reducer<unknown, unknown>;

// Producers

export type LazyProducer<Data, Result> = (data: Data) => Iterable<Result>;

export type LazyProducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Data, ...args: Args) => Iterable<Result>;

export type EagerProducer<Data, Result> = (data: Data) => Array<Result>;

export type Producer<Data, Result> = EagerProducer<Data, Result> & {
  readonly lazyKind: "producer";
  readonly lazy: LazyProducer<Data, Result>;
};

// Transducers

export type LazyTransducer<Data, Result> = (
  data: Iterable<Data>,
) => Iterable<Result>;

export type LazyTransducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Iterable<Data>, ...args: Args) => Iterable<Result>;

export type EagerTransducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Iterable<Data>, ...args: Args) => Array<Result>;

export type EagerTransducer<Data, Result> = (
  data: Iterable<Data>,
) => Array<Result>;

export type Transducer<Data, Result> = EagerTransducer<Data, Result> & {
  readonly lazyKind: "transducer";
  readonly lazy: LazyTransducer<Data, Result>;
};

// Reducers

export type EagerReducer<Data, Result> = (data: Iterable<Data>) => Result;

export type LazyReducerImpl<
  Data,
  Args extends ReadonlyArray<unknown>,
  Result,
> = (data: Iterable<Data>, ...args: Args) => Result;

export type Reducer<Data, Result> = EagerReducer<Data, Result> & {
  readonly lazyKind: "reducer";
};
