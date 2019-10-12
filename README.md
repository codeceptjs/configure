## CodeceptJS Configuration Hooks [![Build Status](https://travis-ci.org/codecept-js/configure.svg?branch=master)](https://travis-ci.org/codecept-js/configure)

Configuration hook is a function that is updates CodeceptJS configuration.

Those hooks are expected to simplify configuration for common use cases.

### setHeadlessWhen

Toggle headless mode for Puppeteer, WebDriver, TestCafe, and Nightmare on condition.

Usage:

```js
// in codecept.conf.js
const { setHeadlessWhen } = require('@codeceptjs/configure');

// enable headless only if environment variable HEADLESS exist
setHeadlessWhen(process.env.HEADLESS); 

// or enable headless on CI
setHeadlessWhen(process.env.CI); 

exports.config = {
  helpers: {
    // standard config goes here
    WebDriver: {} 
    // or Puppeteer
    // or TestCafe
  }
}
```

* For Puppeteer, TestCafe, Nigthmare it enables `show: true`.
* For WebDriver with Chrome browser adds `--headless` option to chrome options inside desiredCapabilities.

### setSharedCookies

Shares cookies between browser and REST/GraphQL helpers.

This hooks sets `onRequest` function for REST, GraphQL, ApiDataFactory, GraphQLDataFactory.
This function obtains cookies from an active session in WebDriver or Puppeteer helpers.

```js
// in codecept.conf.js
const { setSharedCookies } = require('@codeceptjs/configure');

// share cookies between browser helpers and REST/GraphQL
setSharedCookies();

exports.config = {
  helpers: {
    WebDriver: {
      // standard config goes here      
    } 
    // or Puppeteer
    // or TestCafe,
    REST: {
      // standard config goes here      
      // onRequest: <= will be set by hook
    },
    ApiDataFactory: {
      // standard config goes here
      // onRequest: <= will be set by hook
    }
  }
}

```

## Contributing

Please send your config hooks!

If you feel that `codecept.conf.js` becomes too complicated and you know how to make it simpler, 
send a pull request with a config hook to solve your case.

Good ideas for config hooks:

* Setting the same window size for all browser helpers.
* Configuring `run-multiple`
* Changing browser in WebDriver or Protractor depending on environment variable.

To create a custom hook follow this rules.

1. Create a file starting with prefix `use` in `hooks` directory.
2. Create a js module that exports a function.
3. Require `config` object from `codeceptjs` package.
4. Use `config.addHook((config) => {})` to set a hook for configuration
5. Add a test to `index_test.js`
6. Run `mocha index_test.js`

See current hooks as examples.

