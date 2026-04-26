import { config } from '../codeceptjs.js'

const supportedHelpers = ['Playwright', 'WebDriver', 'Puppeteer', 'Appium', 'TestCafe', 'Protractor', 'Nightmare']

export default function (url) {
  config.addHook(cfg => {
    if (!url) return
    if (!cfg.helpers) return

    for (const helperName of supportedHelpers) {
      if (Object.keys(cfg.helpers).includes(helperName)) {
        cfg.helpers[helperName].url = url
      }
    }
  })
}
