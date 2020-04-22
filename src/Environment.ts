import { Atom, Expression, FunctionObject } from './eva';

class Environment {
  record: Record<string, any>;
  parentRecord?: Environment;

  constructor(initialRecord = {}, parent?: Environment) {
    this.record = initialRecord;
    this.parentRecord = parent;
  }

  define(key: string, value: Atom | Expression | FunctionObject) {
    this.record[key] = value;
    return value;
  }

  lookup(key: string) {
    const record = this.findRecord(key);
    return record[key];
  }

  findRecord(key) {
    if (this.record[key]) {
      return this.record;
    }

    if (this.parentRecord !== null) {
      return this.parentRecord?.findRecord(key);
    }

    throw Error(`variable ${key} not defined`);
  }
}
export default Environment;
