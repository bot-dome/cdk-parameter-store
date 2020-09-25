const { ParameterStore } = require('../index');

describe('ParameterStore happy path', () => {
  test('export class is defined', (done) => {
    expect(ParameterStore).toBeDefined();
    expect(typeof ParameterStore).toEqual('function');
    done();
  });

  test('class can be instanced', (done) => {
    const dummyScope = { dummy: 'scope' };
    const store = new ParameterStore(dummyScope);

    expect(store).toBeDefined();
    expect(store).toBeInstanceOf(ParameterStore);

    expect(store.scope).toBeDefined();
    expect(store.scope).toEqual(dummyScope);

    expect(store.resolvableParametersByKey).toBeDefined();
    expect(store.resolvableParametersByName).toBeDefined();

    done();
  });

  test('instance should be able to expose values', (done) => {
    const dummyScope = { dummy: 'scope' };
    const parameter = { name: 'my/param', key: 'myParam', value: 'value' };
    const store = new ParameterStore(dummyScope);

    store.exposeValue(parameter.value, parameter.name, parameter.key);

    expect(Object.keys(store.resolvableParametersByKey)).toHaveLength(1);
    expect(store.resolvableParametersByKey[parameter.key]).toBeDefined();
    expect(store.resolvableParametersByKey[parameter.key]).toEqual(parameter.value);

    expect(Object.keys(store.resolvableParametersByName)).toHaveLength(1);
    expect(store.resolvableParametersByName[parameter.name]).toBeDefined();
    expect(store.resolvableParametersByName[parameter.name]).toEqual(parameter.value);

    done();
  });

  test('instance should return values by key', (done) => {
    const dummyScope = { dummy: 'scope' };
    const parameter = { name: 'my/param', key: 'myParam', value: 'value' };
    const store = new ParameterStore(dummyScope);

    store.exposeValue(parameter.value, parameter.name, parameter.key);
    const value = store.getResolvableByKey(parameter.key);

    expect(value).toEqual(parameter.value);
    done();
  });

  test('instance should return values by name', (done) => {
    const dummyScope = { dummy: 'scope' };
    const parameter = { name: 'my/param', key: 'myParam', value: 'value' };
    const store = new ParameterStore(dummyScope);

    store.exposeValue(parameter.value, parameter.name, parameter.key);
    const value = store.getResolvableByName(parameter.name);

    expect(value).toEqual(parameter.value);
    done();
  });

  test('instance should load an array of parameters', (done) => {
    const dummyScope = { dummy: 'scope' };
    const store = new ParameterStore(dummyScope);

    // mock loadStringWithName
    const mockValue = (name) => `valueFor:${name}`;
    store.loadStringWithName = (name, key) => {
      store.exposeValue(mockValue(name), name, key);
    }

    const parameters = {
      param: 'this/is/a/param',
      anotherParam: 'this:is:another:param',
      lastParam: 'lastParam',
    };

    const values = store.loadStringsWithNames(parameters);

    expect(Object.keys(values)).toHaveLength(Object.keys(parameters).length);
    expect(Object.keys(values)).toEqual(Object.keys(parameters));
    
    const expectedValues = Object.values(parameters).map(mockValue);
    expect(Object.values(values)).toEqual(expectedValues);

    done();
  });

  test('instance should load an array of secrets', (done) => {
    const dummyScope = { dummy: 'scope' };
    const store = new ParameterStore(dummyScope);

    // mock loadSecureStringWithName
    const mockValue = (name) => `valueFor:${name}`;
    store.loadSecureStringWithName = (name, key) => {
      store.exposeValue(mockValue(name), name, key);
    }

    const secrets = {
      secret: 'this/is/a/secret',
      anotherSecret: 'this:is:another:secret',
      lastSecret: 'lastSecret',
    };

    const values = store.loadSecureStringsWithNames(secrets);

    expect(Object.keys(values)).toHaveLength(Object.keys(secrets).length);
    expect(Object.keys(values)).toEqual(Object.keys(secrets));
    
    const expectedValues = Object.values(secrets).map(mockValue);
    expect(Object.values(values)).toEqual(expectedValues);

    done();
  });
});