import { range } from './range';

export function randomString(length: number) {
  const characterSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomChar = () =>
    characterSet[Math.floor(Math.random() * characterSet.length)];

  return range(0, length).reduce(text => text + randomChar(), '');
}
