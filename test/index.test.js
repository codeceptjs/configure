const Config = require('../codeceptjs').config;
const {
  setHeadlessWhen,
  setHeadedWhen,
  setSharedCookies,
  setWindowSize,
  setBrowser,
  setTestHost,
  setCommonPlugins,
} = require('../index');
const {output, container} = require("codeceptjs");

describe('Hooks tests', () => {

  beforeEach(() => {
    Config.reset()
  });

  describe('#setHeadlessWhen', () => {
    test('should not enable headless when false', () => {
      const config = {
        helpers: {
          Puppeteer: {
            show: true,
          },
        },
      }
      setHeadlessWhen(false);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.Puppeteer.show', true);
    });

    test('should enable headless for Puppeteer', () => {
      const config = {
        helpers: {
          Puppeteer: {
            url: 'http://localhost',
            restart: false,
            windowSize: '1600x1200',
            show: true,
          },
        },
      }
      setHeadlessWhen(true);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.Puppeteer.show', false);
    });

    test('should enable headless for Playwright', () => {
      const config = {
        helpers: {
          Playwright: {
            url: 'http://localhost',
            restart: false,
            windowSize: '1600x1200',
            show: true,
          },
        },
      }
      setHeadlessWhen(true);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.Playwright.show', false);
    });


    test('should enable headless for WebDriver with browser Chrome', () => {
      const config = {
        helpers: {
          WebDriver: {
            url: 'http://localhost',
            browser: 'chrome',
            restart: false,
            windowSize: '1600x1200',
          },
        },
      }
      setHeadlessWhen(true);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.WebDriver.desiredCapabilities.chromeOptions.args[0]', '--headless');
    });

    test('should enable headless for WebDriver with browser Firefox', () => {
      const config = {
        helpers: {
          WebDriver: {
            url: 'http://localhost',
            browser: 'firefox',
            restart: false,
            windowSize: '1600x1200',
          },
        },
      }
      setHeadlessWhen(true);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.WebDriver.desiredCapabilities.firefoxOptions.args[0]', '--headless');
    });

  });


  describe('#setHeadedWhen', () => {
    test('should not enable Headed when false', () => {
      const config = {
        helpers: {
          Puppeteer: {
            show: true,
          },
        },
      }
      setHeadedWhen(false);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.Puppeteer.show', true);
    });
    test('should enable Headed for Puppeteer', () => {
      const config = {
        helpers: {
          Puppeteer: {
            url: 'http://localhost',
            restart: false,
            windowSize: '1600x1200',
            show: false,
          },
        },
      }
      setHeadedWhen(true);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.Puppeteer.show', true);
    });

    test('should enable Headed for Playwright', () => {
      const config = {
        helpers: {
          Playwright: {
            url: 'http://localhost',
            restart: false,
            windowSize: '1600x1200',
            show: false,
          },
        },
      }
      setHeadedWhen(true);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.Playwright.show', true);
    });

    test('should enable Headed for WebDriver with browser Chrome', () => {
      const config = {
        helpers: {
          WebDriver: {
            url: 'http://localhost',
            browser: 'chrome',
            restart: false,
            windowSize: '1600x1200',
            desiredCapabilities: {
              chromeOptions: {
                args: ['--headless']
              }
            }
          },
        },
      }
      setHeadedWhen(true);
      Config.create(config);
      expect(Config.get()).not.toHaveProperty('helpers.WebDriver.desiredCapabilities.chromeOptions.args[0]', '--headless');
    });

    test('should enable Headed for WebDriver with browser Firefox', () => {
      const config = {
        helpers: {
          WebDriver: {
            url: 'http://localhost',
            browser: 'firefox',
            restart: false,
            windowSize: '1600x1200',
            desiredCapabilities: {
              firefoxOptions: {
                args: ['--headless']
              }
            }
          },
        },
      }
      setHeadedWhen(true);
      Config.create(config);
      expect(Config.get()).not.toHaveProperty('helpers.WebDriver.desiredCapabilities.firefoxOptions.args[0]', '--headless');
    });

  });

  describe('#setSharedCookies', () => {
    const fn = async (request) => {
      try {
        if (!cookies) cookies = await container.helpers(helper).grabCookie();
        request.headers = { ...request.headers, Cookie: cookies.map(c => `${c.name}=${c.value}`).join('; ') };
      } catch (err) {
        output.error('Can\'t fetch cookies from the current browser. Open a browser and log in before performing request');
      }
    }

    test('should copy cookies from WebDriver to REST', () => {
      const config = {
        helpers: {
          WebDriver: {},
          REST: {}
        },
      }
      setSharedCookies(true);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.REST.onRequest');
      expect(Config.get().helpers.REST.onRequest.toString()).toContain(fn.toString())
    });

    test('should copy cookies from Puppeteer to GraphQL and GraphQLDataFactory', () => {
      const config = {
        helpers: {
          WebDriver: {},
          GraphQL: {},
          GraphQLDataFactory: {}
        },
      }
      setSharedCookies(true);
      Config.create(config);
      expect(Config.get()).toHaveProperty('helpers.GraphQL.onRequest');
      expect(Config.get().helpers.GraphQL.onRequest.toString()).toEqual(fn.toString());
      expect(Config.get()).toHaveProperty('helpers.GraphQLDataFactory.onRequest');
      expect(Config.get().helpers.GraphQLDataFactory.onRequest.toString()).toEqual(fn.toString());
    });
  });

  describe('#setWindowSize', () => {
    ['Protractor', 'TestCafe', 'Nightmare', 'WebDriver','Puppeteer','Playwright'].forEach(helper => {
      test('should set window size for ' + helper, () => {
        Config.reset();
        const config = {
          helpers: {},
        }
        config.helpers[helper] = {};
        setWindowSize(1900, 1000);
        Config.create(config);
        expect(Config.get()).toHaveProperty(`helpers.${helper}.windowSize`);
        expect(Config.get().helpers[helper].windowSize).toEqual('1900x1000');
      });
    });

    test('should set window size in args for Puppeteer', () => {
      const config = {
        helpers: {
          Puppeteer: {
            chrome: {
              args: ['some-arg']
            }
          },
        }
      }
      setWindowSize(1900, 1000);
      Config.create(config);
      expect(Config.get().helpers.Puppeteer.chrome.args).toContain('--window-size=1900,1000');
      expect(Config.get().helpers.Puppeteer.chrome.args).toContain('some-arg');

    });
  });

  describe('#setBrowser', () => {
    ['Protractor', 'TestCafe','WebDriver','Playwright'].forEach(helper => {
      test('should set browser to firefox for ' + helper, () => {
        Config.reset();
        const config = {
          helpers: {},
        }
        config.helpers[helper] = {};
        setBrowser('firefox');
        Config.create(config);
        expect(Config.get()).toHaveProperty(`helpers.${helper}.browser`);
        expect(Config.get().helpers[helper].browser).toEqual('firefox');
      });
    });

    test('should throw exception when browser is not available', () => {
      Config.reset();
      const config = {
        helpers: {
          Playwright: {

          }
        },
      }
      setBrowser('chrome');
      try {
        Config.create(config);
      } catch (err) {
        expect(err.toString()).toContain('not supported');
        return
      }
      throw new Error('no exception thrown');
    });
  });

  describe('#setTestHost', () => {
    ['Protractor', 'TestCafe','WebDriver','Playwright','Puppeteer'].forEach(helper => {
      test('should set url for ' + helper, () => {
        Config.reset();
        const config = {
          helpers: {},
        }
        config.helpers[helper] = {};
        setTestHost('test.com');
        Config.create(config);
        expect(Config.get()).toHaveProperty(`helpers.${helper}.url`);
        expect(Config.get().helpers[helper].url).toEqual('test.com');
      });
    });
  });

  describe('#setCommonPlugins', () => {
    test('create standard plugins', () => {
      Config.reset();
      const config = {
        helpers: {},
      }
      setCommonPlugins();
      Config.create(config);
      expect(Config.get()).toHaveProperty(`plugins.screenshotOnFail`);
      expect(Config.get()).toHaveProperty(`plugins.tryTo`);
      expect(Config.get()).toHaveProperty(`plugins.retryTo`);
      expect(Config.get()).toHaveProperty(`plugins.eachElement`);
    });

    test('should not override plugins', () => {
      Config.reset();
      const config = {
        helpers: {},
        plugins: {
          screenshotOnFail: { enabled: false },
          otherPlugin: {}
        }
      }
      setCommonPlugins();
      Config.create(config);
      expect(Config.get()).toHaveProperty(`plugins.screenshotOnFail`);
      expect(Config.get()).toHaveProperty(`plugins.screenshotOnFail.enabled`);
      expect(Config.get().plugins.screenshotOnFail.enabled).toBeFalsy();
      expect(Config.get()).toHaveProperty(`plugins.tryTo`);
      expect(Config.get()).toHaveProperty(`plugins.retryTo`);
      expect(Config.get()).toHaveProperty(`plugins.eachElement`);
      expect(Config.get()).toHaveProperty(`plugins.otherPlugin`);
    });
  });

});
