import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { config as Config, output, container } from 'codeceptjs'
import {
  setHeadlessWhen,
  setHeadedWhen,
  setSharedCookies,
  setWindowSize,
  setBrowser,
  setBrowserConfig,
  setTestHost,
  setCommonPlugins,
} from '../index.js'

describe('Hooks tests', () => {
  beforeEach(() => {
    Config.reset()
  })

  describe('#setHeadlessWhen', () => {
    test('should not enable headless when false', () => {
      const config = { helpers: { Puppeteer: { show: true } } }
      setHeadlessWhen(false)
      Config.create(config)
      assert.equal(Config.get().helpers.Puppeteer.show, true)
    })

    test('should enable headless for Puppeteer', () => {
      const config = { helpers: { Puppeteer: { url: 'http://localhost', restart: false, windowSize: '1600x1200', show: true } } }
      setHeadlessWhen(true)
      Config.create(config)
      assert.equal(Config.get().helpers.Puppeteer.show, false)
    })

    test('should enable headless for Playwright', () => {
      const config = { helpers: { Playwright: { url: 'http://localhost', restart: false, windowSize: '1600x1200', show: true } } }
      setHeadlessWhen(true)
      Config.create(config)
      assert.equal(Config.get().helpers.Playwright.show, false)
    })

    test('should enable headless for WebDriver with browser Chrome', () => {
      const config = { helpers: { WebDriver: { url: 'http://localhost', browser: 'chrome', restart: false, windowSize: '1600x1200' } } }
      setHeadlessWhen(true)
      Config.create(config)
      assert.equal(Config.get().helpers.WebDriver.desiredCapabilities.chromeOptions.args[0], '--headless')
    })

    test('should enable headless for WebDriver with browser Firefox', () => {
      const config = { helpers: { WebDriver: { url: 'http://localhost', browser: 'firefox', restart: false, windowSize: '1600x1200' } } }
      setHeadlessWhen(true)
      Config.create(config)
      assert.equal(Config.get().helpers.WebDriver.desiredCapabilities.firefoxOptions.args[0], '--headless')
    })
  })

  describe('#setHeadedWhen', () => {
    test('should not enable Headed when false', () => {
      const config = { helpers: { Puppeteer: { show: true } } }
      setHeadedWhen(false)
      Config.create(config)
      assert.equal(Config.get().helpers.Puppeteer.show, true)
    })

    test('should enable Headed for Puppeteer', () => {
      const config = { helpers: { Puppeteer: { url: 'http://localhost', restart: false, windowSize: '1600x1200', show: false } } }
      setHeadedWhen(true)
      Config.create(config)
      assert.equal(Config.get().helpers.Puppeteer.show, true)
    })

    test('should enable Headed for Playwright', () => {
      const config = { helpers: { Playwright: { url: 'http://localhost', restart: false, windowSize: '1600x1200', show: false } } }
      setHeadedWhen(true)
      Config.create(config)
      assert.equal(Config.get().helpers.Playwright.show, true)
    })

    test('should enable Headed for WebDriver with browser Chrome', () => {
      const config = { helpers: { WebDriver: { url: 'http://localhost', browser: 'chrome', restart: false, windowSize: '1600x1200', desiredCapabilities: { chromeOptions: { args: ['--headless'] } } } } }
      setHeadedWhen(true)
      Config.create(config)
      assert.ok(!Config.get().helpers.WebDriver.desiredCapabilities.chromeOptions.args.includes('--headless'))
    })

    test('should enable Headed for WebDriver with browser Firefox', () => {
      const config = { helpers: { WebDriver: { url: 'http://localhost', browser: 'firefox', restart: false, windowSize: '1600x1200', desiredCapabilities: { firefoxOptions: { args: ['--headless'] } } } } }
      setHeadedWhen(true)
      Config.create(config)
      assert.ok(!Config.get().helpers.WebDriver.desiredCapabilities.firefoxOptions.args.includes('--headless'))
    })
  })

  describe('#setSharedCookies', () => {
    test('should copy cookies from WebDriver to REST', () => {
      const config = { helpers: { WebDriver: {}, REST: {} } }
      setSharedCookies(true)
      Config.create(config)
      assert.equal(typeof Config.get().helpers.REST.onRequest, 'function')
    })

    test('should copy cookies from Puppeteer to GraphQL and GraphQLDataFactory', () => {
      const config = { helpers: { WebDriver: {}, GraphQL: {}, GraphQLDataFactory: {} } }
      setSharedCookies(true)
      Config.create(config)
      assert.equal(typeof Config.get().helpers.GraphQL.onRequest, 'function')
      assert.equal(typeof Config.get().helpers.GraphQLDataFactory.onRequest, 'function')
    })
  })

  describe('#setWindowSize', () => {
    for (const helper of ['Protractor', 'TestCafe', 'Nightmare', 'WebDriver', 'Puppeteer', 'Playwright']) {
      test('should set window size for ' + helper, () => {
        Config.reset()
        const config = { helpers: {} }
        config.helpers[helper] = {}
        setWindowSize(1900, 1000)
        Config.create(config)
        assert.equal(Config.get().helpers[helper].windowSize, '1900x1000')
      })
    }

    test('should set window size in args for Puppeteer', () => {
      const config = { helpers: { Puppeteer: { chrome: { args: ['some-arg'] } } } }
      setWindowSize(1900, 1000)
      Config.create(config)
      assert.ok(Config.get().helpers.Puppeteer.chrome.args.includes('--window-size=1900,1000'))
      assert.ok(Config.get().helpers.Puppeteer.chrome.args.includes('some-arg'))
    })
  })

  describe('#setBrowser', () => {
    for (const helper of ['Protractor', 'TestCafe', 'WebDriver', 'Playwright']) {
      test('should set browser to firefox for ' + helper, () => {
        Config.reset()
        const config = { helpers: {} }
        config.helpers[helper] = {}
        setBrowser('firefox')
        Config.create(config)
        assert.equal(Config.get().helpers[helper].browser, 'firefox')
      })
    }

    test('should throw exception when browser is not available', () => {
      Config.reset()
      const config = { helpers: { Playwright: {} } }
      setBrowser('chrome')
      assert.throws(() => Config.create(config), /not supported/)
    })
  })

  describe('#setTestHost', () => {
    for (const helper of ['Protractor', 'TestCafe', 'WebDriver', 'Playwright', 'Puppeteer']) {
      test('should set url for ' + helper, () => {
        Config.reset()
        const config = { helpers: {} }
        config.helpers[helper] = {}
        setTestHost('test.com')
        Config.create(config)
        assert.equal(Config.get().helpers[helper].url, 'test.com')
      })
    }
  })

  describe('#setBrowserConfig', () => {
    test('no-ops when called with no args / non-object', () => {
      Config.reset()
      const config = { helpers: { Playwright: { show: true } } }
      setBrowserConfig()
      setBrowserConfig(null)
      Config.create(config)
      assert.equal(Config.get().helpers.Playwright.show, true)
    })

    test('routes browser through setBrowser (Puppeteer gets product, not browser)', () => {
      Config.reset()
      const config = { helpers: { Puppeteer: {}, Playwright: {} } }
      setBrowserConfig({ browser: 'firefox' })
      Config.create(config)
      assert.equal(Config.get().helpers.Puppeteer.product, 'firefox')
      assert.equal(Config.get().helpers.Puppeteer.browser, undefined)
      assert.equal(Config.get().helpers.Playwright.browser, 'firefox')
    })

    test('show:true -> headed; show:false -> headless on Playwright/Puppeteer', () => {
      Config.reset()
      let config = { helpers: { Playwright: { show: false }, Puppeteer: { show: false } } }
      setBrowserConfig({ show: true })
      Config.create(config)
      assert.equal(Config.get().helpers.Playwright.show, true)
      assert.equal(Config.get().helpers.Puppeteer.show, true)

      Config.reset()
      config = { helpers: { Playwright: { show: true }, WebDriver: { browser: 'chrome' } } }
      setBrowserConfig({ show: false })
      Config.create(config)
      assert.equal(Config.get().helpers.Playwright.show, false)
      assert.ok(Config.get().helpers.WebDriver.desiredCapabilities.chromeOptions.args.includes('--headless'))
    })

    test('windowSize string is parsed and setWindowSize fires', () => {
      Config.reset()
      const config = { helpers: { Playwright: {}, WebDriver: {} } }
      setBrowserConfig({ windowSize: '1280x720' })
      Config.create(config)
      assert.equal(Config.get().helpers.Playwright.windowSize, '1280x720')
      assert.ok(Config.get().helpers.Playwright.chromium.args.includes('--window-size=1280,720'))
      assert.equal(Config.get().helpers.WebDriver.windowSize, '1280x720')
    })

    test('extra keys are shallow-merged onto every browser helper', () => {
      Config.reset()
      const config = { helpers: { Playwright: {}, Puppeteer: {}, WebDriver: {}, REST: {} } }
      setBrowserConfig({ video: false, waitForTimeout: 9000 })
      Config.create(config)
      assert.equal(Config.get().helpers.Playwright.video, false)
      assert.equal(Config.get().helpers.Playwright.waitForTimeout, 9000)
      assert.equal(Config.get().helpers.Puppeteer.video, false)
      assert.equal(Config.get().helpers.WebDriver.waitForTimeout, 9000)
      assert.equal(Config.get().helpers.REST.video, undefined)
    })

    test('combined options applied in one call', () => {
      Config.reset()
      const config = { helpers: { Playwright: { show: false } } }
      setBrowserConfig({ browser: 'webkit', show: true, windowSize: '800x600', video: true })
      Config.create(config)
      const pw = Config.get().helpers.Playwright
      assert.equal(pw.browser, 'webkit')
      assert.equal(pw.show, true)
      assert.equal(pw.windowSize, '800x600')
      assert.equal(pw.video, true)
    })
  })

  describe('#setCommonPlugins', () => {
    test('create standard plugins', () => {
      Config.reset()
      const config = { helpers: {} }
      setCommonPlugins()
      Config.create(config)
      assert.ok(Config.get().plugins.screenshotOnFail)
      assert.ok(Config.get().plugins.eachElement)
    })

    test('should not override plugins', () => {
      Config.reset()
      const config = { helpers: {}, plugins: { screenshotOnFail: { enabled: false }, otherPlugin: {} } }
      setCommonPlugins()
      Config.create(config)
      assert.ok(Config.get().plugins.screenshotOnFail)
      assert.equal(Config.get().plugins.screenshotOnFail.enabled, false)
      assert.ok(Config.get().plugins.eachElement)
      assert.ok(Config.get().plugins.otherPlugin)
    })
  })
})
