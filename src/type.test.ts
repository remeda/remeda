import { type } from './type';

it('"Array" if given an array literal', () => {
  expect(type([1, 2, 3])).toEqual('Array');
});

it('"Object" if given an object literal', () => {
  expect(type({ batman: 'na na na na na na na' })).toEqual('Object');
});

it('"RegExp" if given a RegExp literal', () => {
  expect(type(/[A-z]/)).toEqual('RegExp');
});

it('"Number" if given a numeric value', () => {
  expect(type(4)).toEqual('Number');
});

it('"Number" if given the NaN value', () => {
  expect(type(NaN)).toEqual('Number');
});

it('"String" if given a String literal', () => {
  expect(type('Gooooodd Mornning a!!')).toEqual('String');
});

it('"String" if given a String object', () => {
  // tslint:disable-next-line:no-construct
  expect(type(new String('I am a String object'))).toEqual('String');
});

it('"Null" if given the null value', () => {
  expect(type(null)).toEqual('Null');
});

it('"Undefined" if given the undefined value', () => {
  expect(type(undefined)).toEqual('Undefined');
});
