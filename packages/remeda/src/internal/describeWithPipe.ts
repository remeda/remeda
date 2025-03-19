// TODO: Remove this file once the functions that use it are converted to accept iterable arguments; use as use describeIterableArg instead.  Also remove rule in eslint config.

import { toBasicIterable } from "./toBasicIterable";
import { pipe } from "../pipe";

type PipeFunction = <A, B>(
  input: ReadonlyArray<A>,
  op: (input: ReadonlyArray<A>) => B,
) => B;

export function describeWithPipe(
  desc: string,
  body: (pipeLike: PipeFunction) => void,
): void {
  describe(`${desc} with array input via pipe`, () => {
    body(pipe);
  });

  describe(`${desc} with array input without pipe`, () => {
    body((input, op) => op(input));
  });

  describe(`${desc} with iterable input via pipe`, () => {
    body((input, op) =>
      pipe(toBasicIterable(input) as ReadonlyArray<never>, op),
    );
  });
}
