export function block(...blockStatements) {
  return ['begin', ...blockStatements];
}

export function sum(exp1, exp2) {
  return ['+', exp1, exp2];
}

export function variable(name, value) {
  return ['var', name, value];
}
