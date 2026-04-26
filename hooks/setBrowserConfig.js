import { config } from '../codeceptjs.js'
import setBrowser from './setBrowser.js'
import setWindowSize from './setWindowSize.js'
import setHeadedWhen from './setHeadedWhen.js'
import setHeadlessWhen from './setHeadlessWhen.js'

const BROWSER_HELPERS = ['Playwright', 'Puppeteer', 'WebDriver', 'Appium']

/**
 * Apply a bag of browser helper overrides in a single call. Dispatches the
 * options that have dedicated hooks (browser, show, windowSize) through them
 * — those need per-helper key translation (Puppeteer wants `product`, not
 * `browser`) or capability-arg surgery (WebDriver `--headless`,
 * chromium `--window-size`). Everything else (including plain keys like
 * `url`, `waitForTimeout`, `video`, etc.) is shallow-merged onto every
 * browser helper present in config. Keys whose value is `undefined` are
 * skipped so unset env vars don't clobber existing helper config.
 *
 * @example
 *   setBrowserConfig({
 *     browser: process.env.BROWSER,        // -> setBrowser
 *     show: !process.env.HEADLESS,         // -> setHeadedWhen / setHeadlessWhen
 *     windowSize: '1280x720',              // -> setWindowSize
 *     url: process.env.URL,                // -> merged onto each helper
 *     waitForTimeout: 10000,               // -> merged onto each helper
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

  // skip undefined values so unset env vars don't overwrite existing helper config
  const merge = {}
  for (const k of Object.keys(rest)) {
    if (rest[k] !== undefined) merge[k] = rest[k]
  }
  if (Object.keys(merge).length === 0) return

  config.addHook(cfg => {
    if (!cfg.helpers) return
    for (const helperName of BROWSER_HELPERS) {
      if (cfg.helpers[helperName]) Object.assign(cfg.helpers[helperName], merge)
    }
  })
}
