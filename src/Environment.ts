import { Atom } from './eva';

class Environment {
  record: Record<string, any>;

  constructor(initialRecord = {}) {
    this.record = initialRecord;
  }
  define(key: string, value: Atom) {
    this.record[key] = value;
    return value;
  }

  lookup(key: string) {
    if (!this.record[key]) {
      throw Error(`variable ${key} not defined`);
    }

    return this.record[key];
  }
}
export default Environment;
