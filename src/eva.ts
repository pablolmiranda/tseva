import Environment from './Environment';

type Operators = '+' | '-' | '*';

export type BlockDefinition = ['begin', ...Expression[]];
export type VariableDefinition = ['var', string, Expression];
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

  eval(exp: Expression) {
    if (this.isNumeric(exp)) {
      return exp;
    }

    if (this.isString(exp)) {
      return exp.slice(1, -1);
    }

    if (exp[0] === '+') {
      return this.eval(exp[1]) + this.eval(exp[2]);
    }

    if (exp[0] === '-') {
      return this.eval(exp[1]) - this.eval(exp[2]);
    }

    if (exp[0] === '*') {
      return this.eval(exp[1]) * this.eval(exp[2]);
    }

    if (this.isVariableDefinition(exp)) {
      const [def, name, value]: VariableDefinition = exp;
      return this.global.define(name, this.eval(value));
    }

    if (this.isVariableName(exp)) {
      return this.global.lookup(exp);
    }

    if (this.isBlockExpression(exp)) {
      const [keyword, ...blockExpressions] = exp;
      return this.evalBlock(blockExpressions);
    }

    throw Error(`could not evaluate the following expression:\n ${exp}`);
  }

  evalBlock(blockExpressions: Expression[]) {
    let result;
    blockExpressions.forEach((blockExpression) => {
      result = this.eval(blockExpression);
    });

    return result;
  }

  isBlockExpression(exp: Expression): exp is BlockDefinition {
    return exp[0] === 'begin';
  }

  isNumeric(exp: Expression): Boolean {
    return typeof exp === 'number';
  }

  isString(exp: Expression): exp is string {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
  }

  isVariableDefinition(exp: Expression): exp is VariableDefinition {
    return exp[0] === 'var';
  }

  isVariableName(exp: Expression): exp is string {
    return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
  }
}

export default Eva;
