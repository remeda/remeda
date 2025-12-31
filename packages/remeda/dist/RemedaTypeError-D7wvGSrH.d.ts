import { Tagged } from "type-fest";

//#region src/internal/types/RemedaTypeError.d.ts
declare const RemedaErrorSymbol: unique symbol;
type RemedaTypeErrorOptions = {
  type?: unknown;
  metadata?: unknown;
};
/**
 * Used for reporting type errors in a more useful way than `never`.
 */
type RemedaTypeError<Name extends string, Message extends string, Options extends RemedaTypeErrorOptions = {}> = Tagged<Options extends {
  type: infer T;
} ? T : typeof RemedaErrorSymbol, `RemedaTypeError(${Name}): ${Message}.`, Options extends {
  metadata: infer Metadata;
} ? Metadata : never>;
//#endregion
export { RemedaTypeError as t };
//# sourceMappingURL=RemedaTypeError-D7wvGSrH.d.ts.map