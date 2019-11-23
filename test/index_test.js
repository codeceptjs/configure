const Config = require('../codeceptjs').config;
const { expect } = require('chai');
const { 
  setHeadlessWhen, 
  setHeadedWhen,   
  setSharedCookies,
  setWindowSize,
} = require('../index');

describe('Hooks tests', () => {

  beforeEach(() => {
    Config.reset()
  });

  describe('#setHeadlessWhen', () => {
    it('should not enable headless when false', () => {
      const config = {
        helpers: {
          Puppeteer: {
            show: true,
          },
        },        
      }
      setHeadlessWhen(false);
      Config.create(config);
      expect(Config.get()).to.have.nested.property('helpers.Puppeteer.show', true);
    });    
    it('should enable headless for Puppeteer', () => {
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
      expect(Config.get()).to.have.nested.property('helpers.Puppeteer.show', false);
    });

    it('should enable headless for WebDriver', () => {
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
      expect(Config.get()).to.have.nested.property('helpers.WebDriver.desiredCapabilities.chromeOptions.args[0]', '--headless');
    });

  });


  describe('#setHeadedWhen', () => {
    it('should not enable Headed when false', () => {
      const config = {
        helpers: {
          Puppeteer: {
            show: true,
          },
        },        
      }
      setHeadedWhen(false);
      Config.create(config);
      expect(Config.get()).to.have.nested.property('helpers.Puppeteer.show', true);
    });    
    it('should enable Headed for Puppeteer', () => {
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
      expect(Config.get()).to.have.nested.property('helpers.Puppeteer.show', true);
    });

    it('should enable Headed for WebDriver', () => {
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
      expect(Config.get()).not.to.have.nested.property('helpers.WebDriver.desiredCapabilities.chromeOptions.args[0]', '--headless');
    });

  });  

  describe('#setSharedCookies', () => {
    const fn = async (request) => {
      if (!cookies) cookies = await container.helpers(helper).grabCookie();
      request.headers = { Cookie: cookies.map(c => `${c.name}=${c.value}`).join('; ') };      
    }

    it('should copy cookies from WebDriver to REST', () => {
      const config = {
        helpers: {
          WebDriver: {},
          REST: {}
        },        
      }
      setSharedCookies(true);
      Config.create(config);
      expect(Config.get()).to.have.nested.property('helpers.REST.onRequest');
      expect(Config.get().helpers.REST.onRequest.toString(), fn.toString())
    });

    it('should copy cookies from Puppeteer to GraphQL and GraphQLDataFactory', () => {
      const config = {
        helpers: {
          WebDriver: {},
          GraphQL: {},
          GraphQLDataFactory: {}
        },        
      }
      setSharedCookies(true);
      Config.create(config);
      expect(Config.get()).to.have.nested.property('helpers.GraphQL.onRequest');
      expect(Config.get().helpers.GraphQL.onRequest.toString(), fn.toString());
      expect(Config.get()).to.have.nested.property('helpers.GraphQLDataFactory.onRequest');
      expect(Config.get().helpers.GraphQLDataFactory.onRequest.toString()).to.eql(fn.toString())
    });    
  });

  describe('#setWindowSize', () => {
    ['Protractor', 'TestCafe', 'Nightmare', 'WebDriver','Puppeteer'].forEach(helper => {
      it('should set window size for ' + helper, () => {
        Config.reset();
        const config = {
          helpers: {},  
        }
        config.helpers[helper] = {};
        setWindowSize(1900, 1000);
        Config.create(config);
        expect(Config.get()).to.have.nested.property(`helpers.${helper}.windowSize`);
        expect(Config.get().helpers[helper].windowSize).to.eql('1900x1000');
      });
    });

    it('should set window size in args for Puppeteer', () => {
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
      expect(Config.get().helpers.Puppeteer.chrome.args).to.include('--window-size=1900,1000');
      expect(Config.get().helpers.Puppeteer.chrome.args).to.include('some-arg');

    });
  });

});
