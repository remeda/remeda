import { meanBy } from './meanBy';
import { pipe } from './pipe';

const array = [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }] as const;

describe('data first', () => {
    test('meanBy', () => {
        expect(meanBy(array, x => x.a)).toEqual(3);
    });

    test('meanBy.indexed', () => {
        expect(meanBy.indexed(array, (x, idx) => x.a + idx)).toEqual(5);
    });
});

describe('data last', () => {
    test('meanBy', () => {
        expect(
            pipe(
                array,
                meanBy(x => x.a)
            )
        ).toEqual(3);
    });

    test('meanBy.indexed', () => {
        const actual = pipe(
            array,
            meanBy.indexed((x, idx) => x.a + idx)
        );
        expect(actual).toEqual(5);
    });
});