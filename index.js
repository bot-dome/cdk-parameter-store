const { SecretValue } = require('@aws-cdk/core');
const { StringParameter } = require('@aws-cdk/aws-ssm');

class ParameterStore {
  constructor(scope) {
    this.resolvableParametersByKey = {};
    this.resolvableParametersByName = {};

    this.scope = scope;
  }

  exposeValue(value, name, key) {
    if (name) {
      this.resolvableParametersByName[name] = value;
    }
    if (key) {
      this.resolvableParametersByKey[key] = value;
    }

    return value;
  }

  loadStringWithName(name, key) {
    const value = StringParameter.valueFromLookup(this.scope, name);
    return this.exposeValue(value, name, key);
  }

  loadSecureStringWithName({ name }, key) {
    const value = SecretValue.secretsManager(name);
    return this.exposeValue(value, name, key);
  }

  loadStringsWithNames(parameterNames) {
    Object.keys(parameterNames)
      .forEach(
        (key) => this.loadStringWithName(parameterNames[key], key),
      );
    return this.resolvableParametersByKey;
  }

  loadSecureStringsWithNames(secretNames) {
    Object.keys(secretNames)
      .forEach(
        (key) => this.loadSecureStringWithName(secretNames[key], key),
      );
    return this.resolvableParametersByKey;
  }

  getResolvableByKey(key) {
    return this.resolvableParametersByKey[key];
  }

  getResolvableByName(name) {
    return this.resolvableParametersByName[name];
  }
}

module.exports = { ParameterStore };
