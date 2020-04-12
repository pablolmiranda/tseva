import Eva from '../eva';

let eva;

beforeAll(() => {
  eva = new Eva();
});

describe('variables', () => {
  test('define a variable', () => {
    expect(eva.eval(['var', 'x', 10])).toBe(10);
    expect(eva.eval('x')).toBe(10);
  });

  test('throw exception if variable is not defined', () => {
    expect(() => eva.eval('y')).toThrow(Error);
  });

  test('can hold expression result', () => {
    expect(eva.eval(['var', 'x', ['+', 1, 2]])).toBe(3);
  });
});
