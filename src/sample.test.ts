import { sample } from './sample';

const list = [1, 2, 3, 4, 5];

describe('data first', () => {
  beforeEach(() => vi.spyOn(global.Math, 'random').mockReturnValue(0.41));
  afterEach(() => vi.spyOn(global.Math, 'random').mockRestore());

  test('sample of 1', () => {
    expect(sample(list, 1)).toEqual([3]);
  });
  test('sample of 2', () => {
    expect(sample(list, 2)).toEqual([3, 2]);
  });
  test('sample of 20 (> than the array size)', () => {
    expect(sample(list, 20)).toEqual([3, 2, 4, 1, 5]);
  });
  describe('repeating', () => {
    test('sample of 2', () => {
      expect(sample(list, { size: 2, repeating: true })).toEqual([3, 3]);
    });
    test('sample of 20', () => {
      expect(sample(list, { size: 20, repeating: true })).toHaveLength(20);
    });
  });
});

describe('data last', () => {
  beforeEach(() => vi.spyOn(global.Math, 'random').mockReturnValue(0.41));
  afterEach(() => vi.spyOn(global.Math, 'random').mockRestore());
  test('sample of 2', () => {
    expect(sample(2)(list)).toEqual([3, 2]);
  });
});
