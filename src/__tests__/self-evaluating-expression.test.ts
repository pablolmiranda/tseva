import Eva from '../eva';
import { miniParser } from './util';

let eva;
beforeAll(() => {
  eva = new Eva();
});

test('evaluate numbers', () => {
  const exp1 = miniParser(`1`);
  expect(eva.eval(exp1)).toBe(1);

  const exp2 = miniParser(`10`);
  expect(eva.eval(exp2)).toBe(10);
});

test('evalute string', () => {
  const exp1 = miniParser(`"Hello World"`);
  expect(eva.eval(exp1)).toBe('Hello World');
});

describe('operators', () => {
  test('evaluate +', () => {
    const exp = miniParser(`(+ 1 2)`);
    expect(eva.eval(exp)).toBe(3);
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
