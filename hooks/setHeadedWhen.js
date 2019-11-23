const { config } = require('../codeceptjs');

module.exports = function(when) {
  if (!when) return;

  config.addHook(cfg => {
    if (!cfg.helpers) return;
    if (cfg.helpers.Puppeteer) {
      cfg.helpers.Puppeteer.show = true;
    }
    if (cfg.helpers.Nightmare) {
      cfg.helpers.Nightmare.show = true;
    }
    if (cfg.helpers.TestCafe) {
      cfg.helpers.TestCafe.show = true;
    }
    if (cfg.helpers.WebDriver) {
      if (cfg.helpers.WebDriver.browser === 'chrome') {
        if (
          cfg.helpers.WebDriver.desiredCapabilities && 
          cfg.helpers.WebDriver.desiredCapabilities.chromeOptions &&
          cfg.helpers.WebDriver.desiredCapabilities.chromeOptions.args
          ) {
            const args = cfg.helpers.WebDriver.desiredCapabilities.chromeOptions.args;
            cfg.helpers.WebDriver.desiredCapabilities.chromeOptions.args = args.filter(key => key !== '--headless')
        }
        if (
          cfg.helpers.WebDriver.capabilities && 
          cfg.helpers.WebDriver.capabilities.chromeOptions &&
          cfg.helpers.WebDriver.capabilities.chromeOptions.args
          ) {
            const args = cfg.helpers.WebDriver.capabilities.chromeOptions.args;
            cfg.helpers.WebDriver.capabilities.chromeOptions.args = args.filter(key => key !== '--headless')
        }

      }
    }
  });
}
