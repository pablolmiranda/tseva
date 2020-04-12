import Eva from '../eva';

let eva;

beforeAll(() => {
  eva = new Eva();
});

describe('block', () => {
  test('contains at least one expression', () => {
    expect(
      eva.eval(['begin', ['var', 'x', 1], ['var', 'y', 2], ['+', 'x', 'y']])
    ).toBe(3);
  });
});
