import { deepMergeLeft, deepMergeRight } from './deepMege';

describe('mergeDeepLeft and mergeRight tests', () => {
    test('basic', () => {
        interface Item {
            a: number; // C1
            b?: number; // C2
            d: {
                e: {
                    a?: number; // C3 nested object
                };
                d?: () => void; // C4 function
            };
            y?: {
                a: number;
            };
        }
        const data1: Item = {
            a: 1,
            d: {
                e: {
                    a: 5,
                },
            },
        };
        const fn = () => {
            return;
        };
        const data2: Item = {
            a: 2,
            b: 3,
            d: {
                d: fn,
                e: {
                    a: 4,
                },
            },
        };
        expect(deepMergeLeft(data1, data2)).toEqual({
            a: 1, // From data1
            d: {
                d: fn, // From data 2
                e: {
                    a: 5, // From data1
                },
            },
            b: 3, // From data2
        });

        expect(deepMergeRight(data1, data2)).toEqual({
            a: 2, // From data2
            d: {
                d: fn, // From data 2
                e: {
                    a: 4, // From data2
                },
            },
            b: 3, // From data2
        });
    });

    interface Data {
        a: (number | { a: number })[];
    }
    const d1: Data = {
        a: [1, 2, 3, { a: 1 }],
    };
    const d2: Data = {
        a: [7, 2, 3, { a: 1 }, { a: 2 }],
    };
    test('Expecting correctly merged arrays', () => {
        expect(deepMergeLeft(d1, d2)).toEqual({
            a: [1, 2, 3, { a: 1 }, 7, { a: 1 }, { a: 2 }],
        });

        expect(deepMergeRight(d1, d2)).toEqual({
            a: [7, 2, 3, { a: 1 }, { a: 2 }, 1, { a: 1 }],
        });
    });

    test('Testing cycle objects', () => {
        interface Data {
            a: Data | null | number;
        }

        let data1: Data = {
            a: null,
        };
        data1.a = data1; // Creating cycle

        let data2: Data = {
            a: 5,
        };

        expect(deepMergeLeft(data1, data2)).toEqual({
            a: data1,
        });

        expect(deepMergeRight(data1, data2)).toEqual({
            a: 5,
        });
    });

    test('Testing cycle arrays', () => {
        interface Data {
            a: ReadonlyArray<Data | null | number>;
        }

        let data1: Data = {
            a: [],
        };
        data1.a = [data1]; // Creating cycle

        let data2: Data = {
            a: [5],
        };

        expect(deepMergeLeft(data1, data2)).toEqual({
            a: [data1],
        });

        expect(deepMergeRight(data1, data2)).toEqual({
            a: [5, data1],
        });
    });

    test('Complicated example', () => {
        const source1: any = {
            propS1: 'str1',
            propS2: 'str2',
            propN1: 1,
            propN2: 2,
            propA1: [1, 2, 3],
            propA2: [],
            propB1: true,
            propB2: false,
            propU1: null,
            propU2: null,
            propD1: undefined,
            propD2: undefined,
            propO1: {
                subS1: 'sub11',
                subS2: 'sub12',
                subN1: 11,
                subN2: 12,
                subA1: [11, 12, 13],
                subA2: [],
                subB1: false,
                subB2: true,
                subU1: null,
                subU2: null,
                subD1: undefined,
                subD2: undefined,
                propX1Deep: {
                    a: {
                        subS1: 'sub11',
                        subS2: 'sub12',
                        subN1: 11,
                        subN2: 12,
                        subA1: [11, 12, 13],
                        subA2: [],
                        subB1: false,
                        subB2: true,
                        subU1: null,
                        subU2: null,
                        subD1: undefined,
                        subD2: undefined,
                    },
                },
            },
            propO2: {
                subS1: 'sub21',
                subS2: 'sub22',
                subN1: 21,
                subN2: 22,
                subA1: [21, 22, 23],
                subA2: [],
                subB1: false,
                subB2: true,
                subU1: null,
                subU2: null,
                subD1: undefined,
                subD2: undefined,
            },
        };
        const clone = { ...source1 };
        const source2: any = {
            propS2: 'str2',
            propS3: 'str3',
            propN2: -2,
            propN3: 3,
            propA2: [2, 2],
            propA3: [3, 2, 1],
            propB2: true,
            propB3: false,
            propU2: 'not null',
            propU3: null,
            propD2: 'defined',
            propD3: undefined,
            propO2: {
                subS2: 'inv22',
                subS3: 'sub23',
                subN2: -22,
                subN3: 23,
                subA2: [5, 5, 5],
                subA3: [31, 32, 33],
                subB2: false,
                subB3: true,
                subU2: 'not null --- ',
                subU3: null,
                subD2: ' not undefined ----',
                subD3: undefined,
            },
            propO3: {
                subS1: 'sub31',
                subS2: 'sub32',
                subN1: 31,
                subN2: 32,
                subA1: [31, 32, 33],
                subA2: [],
                subB1: false,
                subB2: true,
                subU1: null,
                subU2: null,
                subD1: undefined,
                subD2: undefined,
            },
        };
        expect(deepMergeLeft(source1, source2)).toEqual({
            propA1: [1, 2, 3],
            propA2: [2],
            propA3: [3, 2, 1],
            propB1: true,
            propB2: false,
            propB3: false,
            propD1: undefined,
            propD2: 'defined',
            propD3: undefined,
            propN1: 1,
            propN2: 2,
            propN3: 3,
            propO1: {
                propX1Deep: {
                    a: {
                        subA1: [11, 12, 13],
                        subA2: [],
                        subB1: false,
                        subB2: true,
                        subD1: undefined,
                        subD2: undefined,
                        subN1: 11,
                        subN2: 12,
                        subS1: 'sub11',
                        subS2: 'sub12',
                        subU1: null,
                        subU2: null,
                    },
                },
                subA1: [11, 12, 13],
                subA2: [],
                subB1: false,
                subB2: true,
                subD1: undefined,
                subD2: undefined,
                subN1: 11,
                subN2: 12,
                subS1: 'sub11',
                subS2: 'sub12',
                subU1: null,
                subU2: null,
            },
            propO2: {
                subA1: [21, 22, 23],
                subA2: [5],
                subA3: [31, 32, 33],
                subB1: false,
                subB2: true,
                subB3: true,
                subD1: undefined,
                subD2: ' not undefined ----',
                subD3: undefined,
                subN1: 21,
                subN2: 22,
                subN3: 23,
                subS1: 'sub21',
                subS2: 'sub22',
                subS3: 'sub23',
                subU1: undefined,
                subU2: 'not null --- ',
                subU3: null,
            },
            propO3: {
                subA1: [31, 32, 33],
                subA2: [],
                subB1: false,
                subB2: true,
                subD1: undefined,
                subD2: undefined,
                subN1: 31,
                subN2: 32,
                subS1: 'sub31',
                subS2: 'sub32',
                subU1: null,
                subU2: null,
            },
            propS1: 'str1',
            propS2: 'str2',
            propS3: 'str3',
            propU1: undefined,
            propU2: 'not null',
            propU3: null,
        });
        expect(source1).toEqual(clone);
    });
});
