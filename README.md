# cdk-parameter-store
CDK helper class that retrieves and stores values from AWS SSM Parameter Store and AWS Secrets Manager

## Installation

`$ npm install @code-dome/cdk-parameter-store`

## Usage

```
const { ParameterStore } = require('@code-dome/cdk-parameter-store');

// 1.1 Define key/value relationships for your parameter names as found in SSM Parameter Store
const parameters = {
  myParameter: 'name/of/my/parameter/in/ssm',
  apiURL: 'project/backend/api/url',
};

// 1.2 Define key/value relationships for your secret names (and version) as found in Secrets Manager
const secrets = {
  superSecretValue :{
    name: 'name/of/my/secret/in/secretsManager',
    version: 1
  },
}

class MyStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // 2. Create an instance of ParameterStore in the scope of your stack, construct or stage
    const store = new ParameterStore(this);

    // 3. Load parameter names
    const cleanParameters = store.loadStringsWithNames(parameters);
    const secureParameters = store.loadeSecureStringsWithNames(secrets);

    // 4. Retreive parameter values (CDK resolvables)
    const myParameter = cleanParameters.myParameter;
    const myParameterAgain = store.getResolvableByKey('myParameter');
    const myParameterYetAgain = store.getResolvableByName('name/of/my/parameter/in/ssm');

    // Bonus. You can load more parameters later
    const myOtherParameter = store.loadStringWithName('my/other/parameter', 'myOtherParameter');
    const myOtherParameterAgain = store.getResolvableByKey('myOtherParameter');
    const myOtherParameterYetAgain = store.getResolvableByName('my/other/parameter');
  }
}
```

## Important Notes

1. ParameterStore is not a construct or a stack, it does not create any resources in AWS
2. The instance still needs the scope of your stack, construct or stage so that CDK knows which account/region to search in.
3. If the parameter does not exist, CDK will crash and burn.
4. Current version of this module will only retrieve the latest version of the secret or parameter.
5. Secure strings in SSM Parameter Store are not available in CDK as of CDK 1.64.0

## Class Definition

### Properties
- **scope**:
The scope of the parent stack, construct or stage.
- **resolvableParametersByKey**:
`{ key1: 'value', ... }`
All loaded parameter and secret values by key.
- **resolvableParametersByName**:
`{ name1: 'value', ... }`
All loaded parameter and secret values by name.

### Methods
- `constructor(scope: Construct): ParameterStore`
Initializes instance properties
- `exposeValue(value: string, name: string, key: string): string (IResolvable)`
Adds a `value` to the `resolvableParametersByKey` and `resolvableParametersByName` with the given `name` and `key`
- `getResolvableByKey(key: string): string (IResolvable)`
Returns the loaded value with key `key`
- `getResolvableByName(name: string): string (IResolvable)`
Returns the loaded value 
- `loadSecureStringWithName({ name: string, version: Number }, key: string): string (IResolvable)`
Loads content of Secret with name `name` from Secrets Manager, then exposes the value by `key` and `name` using `exposeValue()`
- `loadSecureStringsWithNames(secretNames: Object <{ key: { name: string, version: Number }, ...}>): Object <{ key: string (IResolvable), ... }>`
Calls `loadSecureStringWithName()` for each key in `secretNames`
- `loadStringWithName(name: string, key: string): string (IResolvable)`
Lookup of string parameter named `name` in SSM, then exposes the value by `key` and `name` using `exposeValue()`
- `loadStringsWithNames(parameterNames: Object <{ key: 'name', ...}>): Object <{ key: string (IResolvable), ... }>`
Calls `loadStringWithName()` for each key in `parameterNames`

### Test

`npm test`

### TODO
* Handle version in SSM and Secrets 
* Handle StringListParameter