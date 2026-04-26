import { config } from '../codeceptjs.js'

export default function (browser) {
  if (!browser) return

  config.addHook(cfg => {
    if (!cfg.helpers) return
    if (cfg.helpers.Puppeteer) {
      checkAllowedBrowser('Puppeteer', ['firefox', 'chrome'])
      cfg.helpers.Puppeteer.product = browser
    }
    if (cfg.helpers.Playwright) {
      checkAllowedBrowser('Playwright', ['chromium', 'webkit', 'firefox'])
      cfg.helpers.Playwright.browser = browser
    }
    if (cfg.helpers.WebDriver) {
      cfg.helpers.WebDriver.browser = browser
    }
  })

  function checkAllowedBrowser(engine, values = []) {
    if (!values.includes(browser)) {
      throw new Error(`Browser ${browser} is not supported by ${engine} engine`)
    }
  }
}
