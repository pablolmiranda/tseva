import Eva from '..';

let eva;
beforeAll(() => {
  eva = new Eva();
});

test('evaluate numbers', () => {
  expect(eva.eval(1)).toBe(1);
  expect(eva.eval(10)).toBe(10);
});

test('evalute string', () => {
  expect(eva.eval('"Hello World"')).toBe('Hello World');
});

describe('operators', () => {
  test('evaluate +', () => {
    expect(eva.eval(['+', 1, 2])).toBe(3);
  });

  test('evaluate -', () => {
    expect(eva.eval(['-', 2, 1])).toBe(1);
  });

  test('evaluate *', () => {
    expect(eva.eval(['*', 2, 2])).toBe(4);
  });

  test('evaluate nested operations', () => {
    expect(eva.eval(['+', ['+', 1, 2], 3])).toBe(6);
  });

  test('evaluate nested combined operations', () => {
    expect(eva.eval(['+', ['*', 2, 2], ['-', 6, 3]])).toBe(7);
  });
});
