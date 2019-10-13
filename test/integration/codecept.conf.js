const {
  setWindowSize,
  setHeadlessWhen,
  setSharedCookies
} = require('../../index');

setWindowSize(1500, 800);
setHeadlessWhen(process.env.CI);
setSharedCookies();

exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'https://github.com',
      show: true
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'integration'
}