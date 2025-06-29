import type { IsNever } from "type-fest";

// TODO [type-fest@>=5] -- This type is shipping in type-fest v5 and standardizes all IfXXX types. We backported it so that we can already use it because v5 is shipped.
export type If<Type extends boolean, IfBranch, ElseBranch> =
  IsNever<Type> extends true
    ? ElseBranch
    : Type extends true
      ? IfBranch
      : ElseBranch;
