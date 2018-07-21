export const _toSingle = <T>(fn: T): T & { single: true } => {
  (fn as any).single = true;
  return fn as any;
};
