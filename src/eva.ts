import Environment from './Environment';

type Operators = '+' | '-' | '*';

enum Tokens {
  BEGIN = 'begin',
  DEF = 'def',
  LAMBDA = 'lambda',
  VAR = 'var',
}

const VARIABLE_NAME_REGEX = /^[+\-*a-zA-Z][a-zA-Z0-9_]*$/;

export type BlockDefinition = [Tokens.BEGIN, ...Expression[]];
export type FunctionDeclaration = [Tokens.DEF, ...Expression[]];
export type FunctionObject = {
  params: Expression;
  body: Expression;
  env: Environment;
};
export type LambdaFunctionExpression = [Tokens.LAMBDA, ...Expression[]];
export type OperatorDefinition = [Operators, Expression, Expression];
export type VariableDefinition = [Tokens.VAR, string, Expression];
export type Atom = string | number;
export type Expression =
  | Atom
  | BlockDefinition
  | FunctionDeclaration
  | LambdaFunctionExpression
  | OperatorDefinition
  | VariableDefinition;

const GlobalEnvironment = new Environment({
  false: false,
  true: true,

  '+'(op1, op2) {
    return op1 + op2;
  },

  '-'(op1, op2) {
    return op1 - op2;
  },

  '*'(op1, op2) {
    return op1 * op2;
  },

  '>'(op1, op2) {
    return op1 > op2;
  },

  '>='(op1, op2) {
    return op1 >= op2;
  },

  '<'(op1, op2) {
    return op1 < op2;
  },

  '<='(op1, op2) {
    return op1 <= op2;
  },

  '&&'(op1, op2) {
    return op1 && op2;
  },

  '||'(op1, op2) {
    return op1 || op2;
  },
});

class Eva {
  global: Environment;

  constructor(env = GlobalEnvironment) {
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

    if (this.isUserDefinedFunction(exp)) {
      const [_tag, name, params, body] = exp;

      const fn = {
        params,
        body,
        env,
      };
      return env.define(name as string, fn);
    }

    if (this.isLambdaFunctionExpression(exp)) {
      const [_tag, params, body] = exp;

      return {
        params,
        body,
        env,
      };
    }

    // Function expressions
    if (Array.isArray(exp)) {
      const [name, ...args] = exp;
      const fn = this.eval(name, env);

      if (typeof fn === 'function') {
        const fnArgs = args.map((arg) => this.eval(arg, env));
        return fn(...fnArgs);
      }

      // User defined function
      const activationRecord = {};
      const { body, env: fnEnv, params } = fn;
      params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Environment(activationRecord, fnEnv);
      return this.evalFunctionBody(body, activationEnv);
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

  evalFunctionBody(body: Expression, env: Environment) {
    if (this.isBlockExpression(body)) {
      const [tag, ...blockExpressions] = body;
      return this.evalBlock(blockExpressions, env);
    }
    return this.eval(body, env);
  }

  isBlockExpression(exp: Expression): exp is BlockDefinition {
    return exp[0] === Tokens.BEGIN;
  }

  isLambdaFunctionExpression(exp: Expression): exp is LambdaFunctionExpression {
    return exp[0] === Tokens.LAMBDA;
  }

  isNumeric(exp: Expression): Boolean {
    return typeof exp === 'number';
  }

  isString(exp: Expression): exp is string {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
  }

  isUserDefinedFunction(exp: Expression): exp is FunctionDeclaration {
    return exp[0] === Tokens.DEF;
  }

  isVariableDefinition(exp: Expression): exp is VariableDefinition {
    return exp[0] === Tokens.VAR;
  }

  isVariableName(exp: Expression): exp is string {
    return typeof exp === 'string' && VARIABLE_NAME_REGEX.test(exp);
  }
}

export default Eva;
