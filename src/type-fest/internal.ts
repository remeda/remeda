/**
Matches any unknown array or tuple.
*/
export type UnknownArrayOrTuple = readonly [...Array<unknown>];

/**
Matches any non empty tuple.
*/
export type NonEmptyTuple = readonly [unknown, ...Array<unknown>];

/**
Returns a boolean for whether the two given types extends the base type.
*/
export type IsBothExtends<BaseType, FirstType, SecondType> =
  FirstType extends BaseType
    ? SecondType extends BaseType
      ? true
      : false
    : false;

/**
Extracts the type of the first element of an array or tuple.
*/
export type FirstArrayElement<TArray extends UnknownArrayOrTuple> =
  TArray extends readonly [infer THead, ...Array<unknown>] ? THead : never;

/**
Extracts the type of an array or tuple minus the first element.
*/
export type ArrayTail<TArray extends UnknownArrayOrTuple> =
  TArray extends readonly [unknown, ...infer TTail] ? TTail : [];
