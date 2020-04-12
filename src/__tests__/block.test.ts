import Eva from '../eva';

let eva;

beforeAll(() => {
  eva = new Eva();
});

describe('blocks', () => {
  test('contains at least one expression', () => {
    expect(
      eva.eval(['begin', ['var', 'x', 1], ['var', 'y', 2], ['+', 'x', 'y']])
    ).toBe(3);
  });

  test('creates block closure', () => {
    expect(
      eva.eval(['begin', ['var', 'x', 10], ['begin', ['var', 'x', 20]], 'x'])
    ).toBe(10);
  });

  test('is able to access the parent scope', () => {
    expect(
      eva.eval(['begin', ['var', 'x', 10], ['begin', ['var', 'x', 20]], 'x'])
    ).toBe(10);
  });
});
