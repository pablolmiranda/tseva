import Environment from './Environment';

type Operators = '+' | '-' | '*';

enum Tokens {
  VAR = 'var',
  BEGIN = 'begin',
}

const VARIABLE_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

export type BlockDefinition = [Tokens.BEGIN, ...Expression[]];
export type VariableDefinition = [Tokens.VAR, string, Expression];
export type OperatorDefinition = [Operators, Expression, Expression];
export type Atom = string | number;
export type Expression =
  | Atom
  | BlockDefinition
  | OperatorDefinition
  | VariableDefinition;

class Eva {
  global: Environment;

  constructor(env = new Environment({})) {
    this.global = env;
  }

  eval(exp: Expression, _env: Environment) {
    const env = _env || this.global;

    if (this.isNumeric(exp)) {
      return exp as Atom;
    }

    if (this.isString(exp)) {
      return exp.slice(1, -1);
    }

    if (exp[0] === '+') {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }

    if (exp[0] === '-') {
      return this.eval(exp[1], env) - this.eval(exp[2], env);
    }

    if (exp[0] === '*') {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }

    if (this.isVariableDefinition(exp)) {
      const [def, name, value]: VariableDefinition = exp;
      return env.define(name, this.eval(value, env));
    }

    if (this.isVariableName(exp)) {
      return env.lookup(exp);
    }

    if (this.isBlockExpression(exp)) {
      const [keyword, ...blockExpressions] = exp;
      return this.evalBlock(blockExpressions, env);
    }

    throw Error(`could not evaluate the following expression:\n ${exp}`);
  }

  evalBlock(blockExpressions: Expression[], env: Environment) {
    let result;
    const blockEnv = new Environment({}, env);
    blockExpressions.forEach((blockExpression) => {
      result = this.eval(blockExpression, blockEnv);
    });

    return result;
  }

  isBlockExpression(exp: Expression): exp is BlockDefinition {
    return exp[0] === Tokens.BEGIN;
  }

  isNumeric(exp: Expression): Boolean {
    return typeof exp === 'number';
  }

  isString(exp: Expression): exp is string {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
  }

  isVariableDefinition(exp: Expression): exp is VariableDefinition {
    return exp[0] === Tokens.VAR;
  }

  isVariableName(exp: Expression): exp is string {
    return typeof exp === 'string' && VARIABLE_NAME_REGEX.test(exp);
  }
}

export default Eva;
