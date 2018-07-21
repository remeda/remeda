import { map } from './map';

export const createCounter = () => {
  const count = jest.fn();
  return {
    count,
    fn: <T>() =>
      map<T, T>(x => {
        count();
        return x;
      }),
  };
};
