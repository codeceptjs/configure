## Configuring CodeceptJS with Hooks

This package container useful hooks to solve common configuration issues:

### useHeadlessWhen

This hook enables headless mode for Puppeteer, WebDriver, TestCafe, and Nightmare.

Usage:

```js
const { useHeadlessWhen } = require('@codeceptjs/configure');

// enable headless only if environment variable HEADLESS exist
useHeadlessWhen(process.env.HEADLESS); 

// enable headless on CI
useHeadlessWhen(process.env.CI); 

exports.config = {
  helpers: {
    // standard config goes here
  }
}
```

