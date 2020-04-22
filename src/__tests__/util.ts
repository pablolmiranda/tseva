export function block(...blockStatements) {
  return ['begin', ...blockStatements];
}

export function sum(exp1, exp2) {
  return ['+', exp1, exp2];
}

export function variable(name, value) {
  return ['var', name, value];
}

export function miniParser(str: string) {
  let current = 0;
  const tokens = [];
  const strLen = str.length;
  let token: string | number = '';

  function takeUntil(c: string) {
    let char = str[current];
    do {
      token += char;
      current++;
      char = str[current];
    } while (current < strLen && char !== c);
  }

  function extractToken() {
    if (!token || token === 'undefined') {
      return;
    }

    if (typeof token === 'string' && !Number.isNaN(Number.parseInt(token))) {
      token = Number.parseInt(token);
    }

    tokens.push(token);
    token = '';
  }

  if (strLen === 0) {
    return tokens;
  }

  while (current < strLen) {
    let char = str[current];

    if (char === ' ') {
      extractToken();
    }

    if (char === '"') {
      takeUntil('"');
      char = str[current];
    }

    if (char === '(') {
      takeUntil(')');
      char = str[current];
      token += char;
      const expression = token.substring(1, token.length - 1);
      tokens.push(miniParser(expression).slice(1));
      token = '';
      current++;
      char = str[current];
    }

    token += char;

    current++;
  }

  extractToken();

  return ['begin', ...tokens];
}
