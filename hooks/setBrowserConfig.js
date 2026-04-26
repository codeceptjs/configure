import { config } from '../codeceptjs.js'
import setBrowser from './setBrowser.js'
import setWindowSize from './setWindowSize.js'
import setHeadedWhen from './setHeadedWhen.js'
import setHeadlessWhen from './setHeadlessWhen.js'

const BROWSER_HELPERS = ['Playwright', 'Puppeteer', 'WebDriver', 'Appium']

/**
 * Apply a bag of browser helper overrides in a single call. Dispatches the
 * options that have dedicated hooks (browser, show, windowSize) through them
 * — so per-helper key translation (e.g. Puppeteer `product` vs Playwright
 * `browser`) and capability-arg surgery (WebDriver `--headless` chrome args)
 * are handled correctly. Anything else is shallow-merged onto every browser
 * helper present in config.
 *
 * @example
 *   setBrowserConfig({
 *     browser: process.env.BROWSER,        // -> setBrowser
 *     show: !process.env.HEADLESS,         // -> setHeadedWhen / setHeadlessWhen
 *     windowSize: '1280x720',              // -> setWindowSize
 *     waitForTimeout: 10000,               // -> Object.assign onto each helper
 *   })
 *
 * @param {object} [opts]
 */
export default function setBrowserConfig(opts) {
  if (!opts || typeof opts !== 'object') return

  const { browser, show, windowSize, ...rest } = opts

  if (browser !== undefined && browser !== null && browser !== '') {
    setBrowser(browser)
  }

  if (show === true) setHeadedWhen(true)
  else if (show === false) setHeadlessWhen(true)

  if (windowSize) {
    const m = /^(\d+)x(\d+)$/.exec(String(windowSize))
    if (m) setWindowSize(Number(m[1]), Number(m[2]))
  }

  if (Object.keys(rest).length === 0) return

  config.addHook(cfg => {
    if (!cfg.helpers) return
    for (const helperName of BROWSER_HELPERS) {
      if (cfg.helpers[helperName]) Object.assign(cfg.helpers[helperName], rest)
    }
  })
}
