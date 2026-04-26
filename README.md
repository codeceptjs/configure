## CodeceptJS Configuration Hooks [![Run Tests](https://github.com/codeceptjs/configure/actions/workflows/run-tests.yml/badge.svg?branch=4.x)](https://github.com/codeceptjs/configure/actions/workflows/run-tests.yml)

Configuration hook helps you update CodeceptJS configuration at ease.

Those hooks are expected to simplify configuration for common use cases.

**Requires CodeceptJS >= 4.0.0** — `4.x` is the ESM-only line that ships alongside CodeceptJS 4. For CodeceptJS 3.x use `@codeceptjs/configure@^1`.

## Install it

```
npm i @codeceptjs/configure --save
```

## How to use it

Better to see once.

**Watch [YouTube video](https://www.youtube.com/watch?v=onBnfo_rJa4)**

### setHeadlessWhen

Toggle headless mode for Puppeteer, WebDriver and Playwright on condition.

Usage:

```js
// in codecept.conf.js
import { setHeadlessWhen } from '@codeceptjs/configure'

// enable headless when env var HEADLESS exists
// Use it like:
//
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS); 

exports.config = {
  helpers: {
    // standard config goes here
    WebDriver: {}
    // or Puppeteer
    // or Playwright
  }
}
```

* For Puppeteer, Playwright: it enables `show: true`.
* For WebDriver with Chrome or Firefox browser: it adds `--headless` option to chrome/firefox options inside `desiredCapabilities`.

### setHeadedWhen

Opposite to [setHeadlessWhen](#setHeadlessWhen). Forces window mode for running tests.

```js
// in codecept.conf.js
import { setHeadlessWhen } from '@codeceptjs/configure'

// enable window mode when env var DEV exists
// Use it like:
//
// export DEV=true && npx codeceptjs run
setHeadedWhen(process.env.DEV); 
```
### setCommonPlugins

Enables CodeceptJS plugins which are recommened for common usage.
The list of plugins can be updated from version to version so this hook ensures that all of them are loaded and you won't need to update them in a config:

```js
// in codecept.conf.js
import { setCommonPlugins } from '@codeceptjs/configure'

setCommonPlugins();
```

These plugins will be loaded:

**Enabled globally**

* `retryFailedStep`
* `screenshotOnFail`

**Registered but not enabled** — activate ad-hoc via `-p <name>` on the CLI, or by setting `enabled: true` in user config:

* `pauseOn` — pause on failure / step / file / URL (`-p pauseOn:fail`, `-p pauseOn:step`, `-p pauseOn:file:tests/login_test.js`, `-p pauseOn:url:/checkout/*`)
* `browser` — override browser helper config from CLI (`-p browser:show`, `-p browser:browser=firefox`, etc.)
* `aiTrace` — capture AI traces (`-p aiTrace`)

Note: in CodeceptJS 4.x, `tryTo` / `retryTo` / `eachElement` are no longer plugins — import them from `codeceptjs/effects`.

### setSharedCookies

Shares cookies between browser and REST/GraphQL helpers.

This hooks sets `onRequest` function for REST, GraphQL, ApiDataFactory, GraphQLDataFactory.
This function obtains cookies from an active session in WebDriver or Puppeteer helpers.

```js
// in codecept.conf.js
import { setSharedCookies } from '@codeceptjs/configure'

// share cookies between browser helpers and REST/GraphQL
setSharedCookies();

exports.config = {
  helpers: {
    WebDriver: {
      // standard config goes here      
    },
    // or Puppeteer
    // or Playwright,
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

### setBrowser

Changes browser in config for Playwright, Puppeteer and WebDriver:

```js
import { setBrowser } from '@codeceptjs/configure'

setBrowser(process.env.BROWSER);
```

### setWindowSize

Universal way to set a browser window size. For Puppeteer this launches Chrome browser with a specified width and height dimensions without changing viewport size. 

Usage: `setWindowSize(width, height)`.

```js
// in codecept.conf.js
import { setWindowSize } from '@codeceptjs/configure'

setWindowSize(1600, 1200);

exports.config = {
  helpers: {
    Puppeteer: {}
  }
}
```

### setBrowserConfig

Apply a bag of browser-helper overrides in one call. Three keys need real per-helper translation and are routed through their dedicated hooks: `browser` (Puppeteer wants `product`, not `browser`), `show` (WebDriver needs `--headless` injected into chrome/firefox capability args), and `windowSize` (Puppeteer/Playwright also need `--window-size=W,H` chrome args). Everything else — `url`, `waitForTimeout`, `video`, etc. — is shallow-merged onto every browser helper present in config. Keys whose value is `undefined` are skipped so passing an unset env var doesn't clobber existing config.

```js
import { setBrowserConfig } from '@codeceptjs/configure'

setBrowserConfig({
  browser: process.env.BROWSER,        // -> setBrowser
  show: !process.env.HEADLESS,         // -> setHeadedWhen / setHeadlessWhen
  windowSize: '1280x720',              // -> setWindowSize
  url: process.env.URL,                // -> merged onto each helper
  waitForTimeout: 10000,               // -> merged onto each helper
})
```

### setTestHost

Changes url in config for Playwright, Puppeteer, WebDriver and Appium:

```js
import { setTestHost } from '@codeceptjs/configure'

setTestHost(process.env.TEST_HOST);
```

## Contributing

Please send your config hooks!

If you feel that `codecept.conf.js` becomes too complicated, and you know how to make it simpler, 
send a pull request with a config hook to solve your case.

Good ideas for config hooks:

* Setting the same window size for all browser helpers.
* Configuring `run-multiple`
* Changing browser in WebDriver depending on environment variable.

To create a custom hook follow this rules.

1. Create a file starting with prefix `use` in `hooks` directory.
2. Create a js module that exports a function.
3. Require `config` object from `codeceptjs` package.
4. Use `config.addHook((config) => {})` to set a hook for configuration
5. Add a test to `index.test.js`
6. Run `npm run test`

See current hooks as examples.

