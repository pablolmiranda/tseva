import Eva from '../eva';

describe('functions', () => {
  let eva;

  beforeAll(() => {
    eva = new Eva();
  });

  test('evaluate a simple function declaration', () => {
    eva.eval(['var', 'x', 10]);
    eva.eval(['def', 'foo', [], 'x']);
    expect(eva.eval(['foo'])).toBe(10);
  });

  test('evaluate functions with parameters', () => {
    eva.eval(['def', 'square', ['x'], ['*', 'x', 'x']]);
    expect(eva.eval(['square', 10])).toBe(100);
  });

  test('evaluate function with block body', () => {
    eva.eval(['def', 'run', ['x'], ['begin', ['var', 'x', 7], 'x']]);
    expect(eva.eval(['run'])).toBe(7);
  });

  describe('lambdas', () => {
    test('evaluate simple lambda expressions', () => {
      eva.eval(['var', 'foo', ['lambda', ['x'], ['+', 'x', 1]]]);
      expect(eva.eval(['foo', 1])).toBe(2);
    });
  });
});
