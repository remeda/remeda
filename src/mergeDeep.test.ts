import { mergeDeepLeft, mergeDeepRight } from './mergeDeep';

describe("mergeDeepLeft and mergeRight tests", () => {
    test('basic', () => {
        interface Item {
            a: number, // C1
            b?: number // C2 
            d: {
                e: {
                    a?: number // C3 nested object
                }
                d?: () => void // C4 function
            }
            y?: {
                a: number
            }
        }
        const data1: Item = {
            a: 1,
            d: {
                e: {
                    a: 5
                }
            }
        }
        const fn = () => {
            return
        }
        const data2: Item = {
            a: 2,
            b: 3,
            d: {
                d: fn,
                e: {
                    a: 4
                }
            }
        }
        expect(
            mergeDeepLeft(data1, data2)
        ).toEqual({
            a: 1, // From data1
            d: {
                d: fn, // From data 2
                e: {
                    a: 5 // From data1
                }
            },
            b: 3, // From data2
        });

        expect(
            mergeDeepRight(data1, data2)
        ).toEqual({
            a: 2, // From data2
            d: {
                d: fn, // From data 2
                e: {
                    a: 4 // From data2
                }
            },
            b: 3, // From data2
        });
    });

    interface Data {
        a: (number | { a: number })[]
    }
    const d1: Data = {
        a: [1, 2, 3, { a: 1 }]
    }
    const d2: Data = {
        a: [7, 2, 3, { a: 1 }, { a: 2 }]
    }
    test("Expecting correctly merged arrays", () => {
        expect(
            mergeDeepLeft(d1, d2)
        ).toEqual({
            a: [1, 2, 3, { a: 1 }, 7, { a: 1 }, { a: 2 }]
        })

        expect(
            mergeDeepRight(d1, d2)
        ).toEqual({
            a: [7, 2, 3, { a: 1 }, { a: 2 }, 1, { a: 1 }]
        })
    })

    test("Testing cycle objects", () => {
        interface Data {
            a: Data | null | number
        }

        let data1: Data = {
            a: null
        }
        data1.a = data1 // Creating cycle

        let data2: Data = {
            a: 5
        }

        expect(
            mergeDeepLeft(data1, data2)
        ).toEqual({
            a: data1
        })

        expect(
            mergeDeepRight(data1, data2)
        ).toEqual({
            a: 5
        })
    })

    test("Testing cycle arrays", () => {
        interface Data {
            a: ReadonlyArray<Data | null | number>
        }

        let data1: Data = {
            a: []
        }
        data1.a = [data1] // Creating cycle

        let data2: Data = {
            a: [5]
        }

        expect(
            mergeDeepLeft(data1, data2)
        ).toEqual({
            a: [data1]
        })

        expect(
            mergeDeepRight(data1, data2)
        ).toEqual({
            a: [5, data1]
        })
    })
})

