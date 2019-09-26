const Config = require('codeceptjs').config;
const merge = require('lodash.merge');

module.exports = function(when) {
  if (!when) return;

  Config.addHook((config) => {
    if (!config.helpers) return;
    if (config.helpers.Puppeteer) {
      config.helpers.Puppeteer.show = false;
    }
    if (config.helpers.Nightmare) {
      config.helpers.Nightmare.show = false;
    }
    if (config.helpers.TestCafe) {
      config.helpers.TestCafe.show = false;
    }
    if (config.helpers.WebDriver) {
      if (config.helpers.WebDriver.browser === 'chrome') {
        config.helpers.WebDriver.desiredCapabilities = merge(
          config.helpers.WebDriver.desiredCapabilities || {},
          {
            chromeOptions: {
              args: [ "--headless", "--disable-gpu" ]
            }
          }
        )
      }
    }
  });
}
