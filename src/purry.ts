export function purry(fn: any, args: IArguments | any[]) {
  const diff = fn.length - args.length;
  const arrayArgs = Array.from(args);
  if (diff === 0) {
    return fn(...arrayArgs);
  }
  if (diff === 1) {
    return (data: any) => fn(data, ...arrayArgs);
  }
  throw new Error('Wrong number of arguments');
}
